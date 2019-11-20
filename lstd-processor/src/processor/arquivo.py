import glob
import json
import logging
import re
from multiprocessing import Pool, cpu_count

import mpl_toolkits.basemap.pyproj as pyproj
import numpy as np
from pyhdf.SD import SD, SDC
from shapely.geometry import Point

import src.processor.dados_cientificos as dados_cientificos_processor
import src.processor.metadados as metadados_processor
import src.service.metadados as metadados_service
import src.service.dados_cientificos as dados_cientificos_service


def iniciar_processamento_de_arquivos():
    logging.info("Iniciando o processamento de dados.")

    lista_arquivos = obter_lista_arquivos()

    logging.info("Arquivos a serem processados: " + ", ".join(map(lambda f: sanitizar_nome_arquivo(f), lista_arquivos)))

    with Pool(cpu_count() - 1) as pool:
        pool.map(processar_arquivo, lista_arquivos)


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
    processar_grid(arquivo, nome_arquivo_sanitizado, metadados, dados_cientificos)

    logging.info(nome_arquivo_sanitizado + ": Arquivo processado com sucesso.")


def processar_grid(arquivo, nome_arquivo, metadados, dados_cientificos):
    longitudes, latitudes = gerar_matriz_coordenadas(arquivo)
    index, lista_poligos_bairro = dados_cientificos_processor.obter_bairros_como_poligonos()
    dados_temperatura_dia = dados_cientificos["dados_temperatura_dia"]
    dados_temperatura_noite = dados_cientificos["dados_temperatura_noite"]
    metadados_id = metadados_service.get_medatados_id_by_nome_arquivo_or_insert(metadados)

    for linha in range(1200):
        for coluna in range(1200):
            latitude = latitudes[linha][coluna]
            longitude = longitudes[linha][coluna]
            point = Point(longitude, latitude)
            id_bairro = None

            for j in index.intersection(point.bounds):
                filtered = list(filter(lambda x: x[0] == j, lista_poligos_bairro))
                if filtered[0][1].contains(point):
                    id_bairro = j

            lst_dados_cientificos = {
                "id_bairro": id_bairro,
                "id_metadados": metadados_id,
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
                logging.info(nome_arquivo + ": Salvando no banco de dados o registro: " + json.dumps(lst_dados_cientificos))
                # id_dado_cientifico = dados_cientificos_service.save(lst_dados_cientificos)
                # logging.info(nome_arquivo + ": Registro salvo na tabela lstd_dados_cientificos com o id: " + str(id_dado_cientifico))


def gerar_matriz_coordenadas(arquivo):
    gridmeta = arquivo.attributes(full=1)["StructMetadata.0"][0]

    match = re.compile(r'''UpperLeftPointMtrs=\((?P<upper_left_x>[+-]?\d+\.\d+), (?P<upper_left_y>[+-]?\d+\.\d+)\)''', re.VERBOSE).search(gridmeta)
    x0 = np.float(match.group('upper_left_x'))
    y0 = np.float(match.group('upper_left_y'))

    match = re.compile(r'''LowerRightMtrs=\((?P<lower_right_x>[+-]?\d+\.\d+), (?P<lower_right_y>[+-]?\d+\.\d+)\)''', re.VERBOSE).search(gridmeta)
    x1 = np.float(match.group('lower_right_x'))
    y1 = np.float(match.group('lower_right_y'))

    nx, ny = arquivo.select("LST_Day_1km")[:, :].astype(np.double).shape
    x = np.linspace(x0, x1, nx)
    y = np.linspace(y0, y1, ny)
    xv, yv = np.meshgrid(x, y)

    return pyproj.transform(pyproj.Proj("+proj=sinu +R=6371007.181 +nadgrids=@null +wktext"), pyproj.Proj("+init=EPSG:4326"), xv, yv)
