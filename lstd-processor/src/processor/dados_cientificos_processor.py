import numpy
import logging


# for linha in range(1200):
#     for coluna in range(1200):
#         current_element = data[linha][coluna]
#         print(data[linha][coluna])
#
#         if current_element == fill_value or (valid_max < current_element < valid_min):
#             data[linha][coluna] = fill_value
#             continue
#
#         data[linha][coluna] = (current_element * scale_factor) - 273.15
#         print(data[linha][coluna])


# LST_Day_1km
# QC_Day
# Day_view_time
#
# LST_Night_1km
# QC_Night
# Night_view_time


def processar_dados_cientificos(arquivo, metadados, nome_arquivo):
    if metadados["nome_dataset"] == "MOD11A1":
        return processar_mod11a1(arquivo, metadados, nome_arquivo)
    return processar_mod11a2(arquivo, metadados, nome_arquivo)


def processar_mod11a1(arquivo, metadados, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A1.")


def processar_mod11a2(arquivo, metadados, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A2.")

    return {
        "dados_temperatura": extrair_dados_temperatura(arquivo, nome_arquivo)
    }


def extrair_dados_temperatura(arquivo, nome_arquivo):
    lst = arquivo.select("LST_Day_1km")
    atributos = lst.attributes(full=1)

    return {
        "matriz_temperatura": lst[:, :].astype(numpy.double),
        "valor_de_preenchemento": extrair_valor_de_preenchemento(atributos),
        "fator_escalar": extrair_fator_escalar(atributos),
        "valor_minimo_valido": extrair_valor_minimo_valido(atributos),
        "valor_maximo_valido": extrair_valor_maximo_valido(atributos)
    }


def extrair_valor_de_preenchemento(atributos):
    return atributos["_FillValue"][0]


def extrair_fator_escalar(atributos):
    return atributos["scale_factor"][0]


def extrair_valor_minimo_valido(atributos):
    return atributos["valid_range"][0][0]


def extrair_valor_maximo_valido(atributos):
    return atributos["valid_range"][0][1]
