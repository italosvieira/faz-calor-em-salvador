import numpy
import logging


def processar_dados_cientificos(arquivo, metadados, nome_arquivo):
    processar_mod11a1(arquivo, metadados, nome_arquivo) if metadados["nome_dataset"] == "MOD11A1" else processar_mod11a2(arquivo, metadados, nome_arquivo)


def processar_mod11a1(arquivo, metadados, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A1.")


def processar_mod11a2(arquivo, metadados, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A2.")

    data2D = arquivo.select("LST_Day_1km")
    data = data2D[:, :].astype(numpy.double)


def extrair_lst(arquivo, nome_arquivo):
    lst = arquivo.select("LST_Day_1km")
    attrs = lst.attributes(full=1)
    data = lst[:, :].astype(numpy.double)
