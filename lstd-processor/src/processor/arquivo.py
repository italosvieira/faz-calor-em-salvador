import glob
import json
import logging

import geopy
import geopy.distance
from pyhdf.SD import SD, SDC
from multiprocessing import Pool

import src.processor.metadados as metadados_processor
import src.processor.dados_cientificos as dados_cientificos_processor
import src.service.metadados as metadados_service
import src.service.dados_cientificos as dados_cientificos_service


def iniciar_processamento_de_arquivos():
    logging.info("Iniciando o processamento de dados.")

    lista_arquivos = obter_lista_arquivos()

    logging.info("Arquivos a serem processados: " + ", ".join(map(lambda f: sanitizar_nome_arquivo(f), lista_arquivos)))

    for nome_arquivo in lista_arquivos:
        processar_arquivo(nome_arquivo)


def obter_lista_arquivos():
    logging.info("Obtendo arquivos na pasta /data.")
    return [f for f in glob.glob("../data/*.hdf")]


def sanitizar_nome_arquivo(nome_arquivo):
    return nome_arquivo.replace("../data/", "")


def processar_arquivo(nome_arquivo):
    nome_arquivo_sanitizado = sanitizar_nome_arquivo(nome_arquivo)
    logging.info(nome_arquivo_sanitizado + ": Iniciando o processamento.")
    arquivo = SD(nome_arquivo, SDC.READ)

    logging.info(nome_arquivo_sanitizado + ": Iniciando o processamento de metadados.")
    metadados = metadados_processor.processar_metadados(arquivo, nome_arquivo_sanitizado)

    logging.info(nome_arquivo_sanitizado + ": Metadados extraidos do arquivo: " + json.dumps(metadados))

    logging.info(nome_arquivo_sanitizado + ": Iniciando o processamento dos dados científicos.")
    dados_cientificos = dados_cientificos_processor.processar_dados_cientificos(arquivo, metadados, nome_arquivo_sanitizado)

    logging.info(nome_arquivo_sanitizado + ": Dados científicos extraidos do arquivo com sucesso.")

    # Processa os dados_cientificos. Depois que termina esse processamento salva os metadados e cada dado cientifico.
    logging.info(nome_arquivo_sanitizado + ": Iniciando processamento dos registros a serem inseridos no banco.")
    processar_grid(nome_arquivo_sanitizado, metadados, dados_cientificos)

    logging.info(nome_arquivo_sanitizado + ": Arquivo processado com sucesso.")


def batata(json_dados):
    linha = json_dados["linha"]
    lista_latitudes = json_dados["lista_latitudes"]
    lista_longitudes = json_dados["lista_longitudes"]
    dados_temperatura_dia = json_dados["dados_cientificos"]["dados_temperatura_dia"]
    dados_temperatura_noite = json_dados["dados_cientificos"]["dados_temperatura_noite"]
    poligonos_bairros = dados_cientificos_processor.obter_bairros_como_poligonos()
    nome_arquivo = json_dados["nome_arquivo"]
    latitude = lista_latitudes[linha]

    for coluna in range(1200):
        longitude = lista_longitudes[coluna]
        id_bairro = dados_cientificos_processor.processar_bairros(latitude, longitude, poligonos_bairros)

        teste = {
            "id_bairro": id_bairro,
            "id_metadados": json_dados["metadados_id"],
            "latitude": latitude,
            "longitude": longitude,
            "temperatura_dia": dados_cientificos_processor.processar_temperatura(linha, coluna, dados_temperatura_dia["indicador_temperatura"]),
            "qualidade_do_pixel_dia": dados_cientificos_processor.processar_qualidade_do_pixel(linha, coluna, dados_temperatura_dia["indicador_qualidade"]),
            "hora_registro_pixel_dia": dados_cientificos_processor.processar_hora_registro_pixel(linha, coluna, dados_temperatura_dia["indicador_hora"]),
            "temperatura_noite": dados_cientificos_processor.processar_temperatura(linha, coluna, dados_temperatura_noite["indicador_temperatura"]),
            "qualidade_do_pixel_noite": dados_cientificos_processor.processar_qualidade_do_pixel(linha, coluna, dados_temperatura_noite["indicador_qualidade"]),
            "hora_registro_pixel_noite": dados_cientificos_processor.processar_hora_registro_pixel(linha, coluna, dados_temperatura_noite["indicador_hora"])
        }

        if id_bairro is not None:
            logging.info(nome_arquivo + ": Salvando no banco de dados o registro: " + json.dumps(teste))
            id_dado_cientifico = dados_cientificos_service.save(teste)
            logging.info(nome_arquivo + ": Registro salvo na tabela lstd_dados_cientificos com o id: " + str(id_dado_cientifico))


def processar_grid(nome_arquivo, metadados, dados_cientificos):
    lista_latitudes, lista_longitudes = gerar_matriz_coordenadas(metadados["coordenada_limite_norte"],
                                                                 metadados["coordenada_limite_oeste"])
    metadados_id = metadados_service.get_medatados_id_by_nome_arquivo_or_insert(metadados)

    with Pool(50) as pool:
        for linha in range(1200):
            pool.map(batata, [{
                "linha": linha,
                "metadados_id": metadados_id,
                "lista_latitudes": lista_latitudes,
                "lista_longitudes": lista_longitudes,
                "dados_cientificos": dados_cientificos,
                "nome_arquivo": nome_arquivo,
            }])


def gerar_matriz_coordenadas(lat, lon):
    latitudes, longitudes = [], []
    latitudes.append(float(lat))
    longitudes.append(float(lon))

    # 90 para andar pra direita isso é longitude
    # 180 para andar pra baixo isso é latitude
    latitude_inicio = geopy.Point(latitude=lat, longitude=lon)
    longitude_inicio = geopy.Point(latitude=lat, longitude=lon)
    distancia = geopy.distance.distance(kilometers=1)

    for i in range(1199):
        latitude_inicio = distancia.destination(point=latitude_inicio, bearing=180)
        longitude_inicio = distancia.destination(point=longitude_inicio, bearing=90)
        latitudes.append(latitude_inicio.latitude)
        longitudes.append(longitude_inicio.longitude)

    return latitudes, longitudes
