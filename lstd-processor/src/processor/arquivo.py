import glob
import json
import logging

import geopy
import geopy.distance
from pyhdf.SD import SD, SDC

from . import save
from . import metadados as metadados_processor
from . import dados_cientificos as dados_cientificos_processor


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
    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento.")
    arquivo = SD(nome_arquivo, SDC.READ)

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento de metadados.")
    metadados = metadados_processor.processar_metadados(arquivo, sanitizar_nome_arquivo(nome_arquivo))

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Metadados extraidos do arquivo: " + json.dumps(metadados))

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento dos dados científicos.")
    dados_cientificos = dados_cientificos_processor.processar_dados_cientificos(arquivo, metadados,
                                                                                sanitizar_nome_arquivo(nome_arquivo))

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Dados científicos extraidos do arquivo com sucesso.")

    # Processa os dados_cientificos. Depois que termina esse processamento salva os metadados e cada dado cientifico.
    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando processamento dos registros a serem inseridos no banco.")
    dados_processados = processar_grid(nome_arquivo, metadados, dados_cientificos)

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Registros a serem inseridos no banco processados com sucesso.")

    save(metadados, dados_processados)


def processar_grid(nome_arquivo, metadados, dados_cientificos):
    lista_retorno = []
    lista_latitudes, lista_longitudes = gerar_matriz_coordenadas(metadados["coordenada_limite_norte"],
                                                                 metadados["coordenada_limite_oeste"])
    # Linha é Longitude
    # Coluna é Latitude
    for linha in range(1200):
        for coluna in range(1200):
            dados_temperatura_dia = dados_cientificos["dados_temperatura_dia"]
            dados_temperatura_noite = dados_cientificos["dados_temperatura_noite"]

            lista_retorno.append({
                "id_metadados": "",
                "latitude": lista_latitudes[coluna],
                "longitude": lista_longitudes[linha],
                "temperatura_dia": dados_cientificos_processor.processar_temperatura(linha, coluna, dados_temperatura_dia["indicador_temperatura"]),
                "qualidade_do_pixel_dia": dados_cientificos_processor.processar_qualidade_do_pixel(linha, coluna, dados_temperatura_dia["indicador_qualidade"]),
                "hora_registro_pixel_dia": dados_cientificos_processor.processar_hora_registro_pixel(linha, coluna, dados_temperatura_dia["indicador_hora"]),
                "temperatura_noite": dados_cientificos_processor.processar_temperatura(linha, coluna, dados_temperatura_noite["indicador_temperatura"]),
                "qualidade_do_pixel_noite": dados_cientificos_processor.processar_qualidade_do_pixel(linha, coluna, dados_temperatura_noite["indicador_qualidade"]),
                "hora_registro_pixel_noite": dados_cientificos_processor.processar_hora_registro_pixel(linha, coluna, dados_temperatura_noite["indicador_hora"]),
                "bairro": dados_cientificos_processor.processar_bairros(lista_latitudes[coluna], lista_longitudes[linha])
            })

    return lista_retorno


def gerar_matriz_coordenadas(latitude, longitude):
    latitudes, longitudes = [], []
    latitudes.append(latitude)
    longitudes.append(longitude)

    # 90 para andar pra direita isso é longitude
    # 180 para andar pra baixo isso é latitude
    latitude_inicio = geopy.Point(latitude, longitude)
    longitude_inicio = geopy.Point(latitude, longitude)
    distancia = geopy.distance.VincentyDistance(kilometers=1)

    for i in range(1199):
        latitude_inicio = distancia.destination(point=latitude_inicio, bearing=180)
        longitude_inicio = distancia.destination(point=longitude_inicio, bearing=90)
        latitudes.append(latitude_inicio.latitude)
        longitudes.append(longitude_inicio.longitude)

    return latitudes, longitudes
