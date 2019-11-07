import json
import glob
import logging

from pyhdf.SD import SD, SDC
from .metadados_processor import processar_metadados
from .dados_cientificos_processor import processar_dados_cientificos


def iniciar_processamento():
    logging.info("Iniciando o processamento de dados.")

    lista_arquivos = obter_lista_arquivos()

    logging.info("Arquivos a serem processados: " + ", ".join(map(lambda f: sanitizar_nome_arquivo(f), lista_arquivos)))

    for nome_arquivo in lista_arquivos:
        processar_arquivo(nome_arquivo)


def obter_lista_arquivos():
    logging.info("Obtendo arquivos na pasta /data.")
    return [f for f in glob.glob("../data/*.hdf")]


def processar_arquivo(nome_arquivo):
    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento.")
    arquivo = SD(nome_arquivo, SDC.READ)

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento de metadados.")
    metadados = processar_metadados(arquivo, sanitizar_nome_arquivo(nome_arquivo))

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Metadados extraidos do arquivo: " + json.dumps(metadados))

    logging.info(sanitizar_nome_arquivo(nome_arquivo) + ": Iniciando o processamento dos dados científicos.")
    dados_cientificos = processar_dados_cientificos(arquivo, metadados, sanitizar_nome_arquivo(nome_arquivo))


def sanitizar_nome_arquivo(nome_arquivo):
    return nome_arquivo.replace("../data/", "")
