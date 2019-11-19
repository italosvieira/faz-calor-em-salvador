import glob
import json
import logging
import re

import mpl_toolkits.basemap.pyproj as pyproj
import numpy as np
from pyhdf.SD import SD, SDC
from shapely.geometry import Point

import src.processor.dados_cientificos as dados_cientificos_processor
import src.processor.metadados as metadados_processor


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
    processar_grid(arquivo, nome_arquivo_sanitizado, metadados, dados_cientificos)

    logging.info(nome_arquivo_sanitizado + ": Arquivo processado com sucesso.")


def processar_grid(arquivo, nome_arquivo, metadados, dados_cientificos):
    latitudes, longitudes = gerar_matriz_coordenadas(arquivo)
    index, lista_poligos_bairro = dados_cientificos_processor.obter_bairros_como_poligonos()
    dados_temperatura_dia = dados_cientificos["dados_temperatura_dia"]
    dados_temperatura_noite = dados_cientificos["dados_temperatura_noite"]
    # metadados_id = metadados_service.get_medatados_id_by_nome_arquivo_or_insert(metadados)

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
                "id_metadados": "",
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
                # logging.info(nome_arquivo + ": Salvando no banco de dados o registro: " + json.dumps(lst_dados_cientificos))
                # id_dado_cientifico = dados_cientificos_service.save(lst_dados_cientificos)
                # logging.info(nome_arquivo + ": Registro salvo na tabela lstd_dados_cientificos com o id: " + str(id_dado_cientifico))
                logging.info("Bairro: %s. Temperatura Dia: %s. Temperatura Noite: %s. Latitude: %s. Longitude: %s",
                             lst_dados_cientificos["id_bairro"],
                             lst_dados_cientificos["temperatura_dia"], lst_dados_cientificos["temperatura_noite"],
                             lst_dados_cientificos["latitude"], lst_dados_cientificos["longitude"])


def gerar_matriz_coordenadas(arquivo):
    data2D = arquivo.select("LST_Day_1km")
    data = data2D[:, :].astype(np.double)

    # Read attributes.
    attrs = data2D.attributes(full=1)
    lna = attrs["long_name"]
    long_name = lna[0]
    vra = attrs["valid_range"]
    valid_range = vra[0]
    fva = attrs["_FillValue"]
    _FillValue = fva[0]
    sfa = attrs["scale_factor"]
    scale_factor = sfa[0]
    aoa = attrs["add_offset"]
    add_offset = aoa[0]

    # Apply the attributes to the data.
    invalid = np.logical_or(data < valid_range[0], data > valid_range[1])
    invalid = np.logical_or(invalid, data == _FillValue)
    data[invalid] = np.nan
    data = (data - add_offset) * scale_factor
    data = np.ma.masked_array(data, np.isnan(data))

    # Construct the grid.  The needed information is in a global attribute
    # called 'StructMetadata.0'.  Use regular expressions to tease out the
    # extents of the grid.
    fattrs = arquivo.attributes(full=1)
    ga = fattrs["StructMetadata.0"]
    gridmeta = ga[0]
    ul_regex = re.compile(r'''UpperLeftPointMtrs=\(
                                  (?P<upper_left_x>[+-]?\d+\.\d+)
                                  ,
                                  (?P<upper_left_y>[+-]?\d+\.\d+)
                                  \)''', re.VERBOSE)

    match = ul_regex.search(gridmeta)
    x0 = np.float(match.group('upper_left_x'))
    y0 = np.float(match.group('upper_left_y'))

    lr_regex = re.compile(r'''LowerRightMtrs=\(
                                  (?P<lower_right_x>[+-]?\d+\.\d+)
                                  ,
                                  (?P<lower_right_y>[+-]?\d+\.\d+)
                                  \)''', re.VERBOSE)
    match = lr_regex.search(gridmeta)
    x1 = np.float(match.group('lower_right_x'))
    y1 = np.float(match.group('lower_right_y'))

    nx, ny = data.shape
    x = np.linspace(x0, x1, nx)
    y = np.linspace(y0, y1, ny)
    xv, yv = np.meshgrid(x, y)

    sinu = pyproj.Proj("+proj=sinu +R=6371007.181 +nadgrids=@null +wktext")
    wgs84 = pyproj.Proj("+init=EPSG:4326")
    lon, lat = pyproj.transform(sinu, wgs84, xv, yv)
    return lat, lon
