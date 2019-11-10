import numpy
import logging
import textwrap


def processar_dados_cientificos(arquivo, metadados, nome_arquivo):
    if metadados["nome_dataset"] == "MOD11A1":
        return processar_mod11a1(arquivo, metadados, nome_arquivo)
    return processar_mod11a2(arquivo, nome_arquivo)


def processar_mod11a1(arquivo, metadados, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A1.")


def processar_mod11a2(arquivo, nome_arquivo):
    logging.info(nome_arquivo + ": Processando arquivo do dataset MOD11A2.")

    return {
        "dados_temperatura_dia": extrair_dados_temperatura_dia(arquivo, nome_arquivo),
        "dados_temperatura_noite": extrair_dados_temperatura_noite(arquivo, nome_arquivo)
    }


def extrair_dados_temperatura_dia(arquivo, nome_arquivo):
    return {
        "indicador_temperatura": extrair_dados_temperatura(arquivo, nome_arquivo),
        "indicador_qualidade": extrair_indicador_de_qualidade(arquivo, nome_arquivo, "QC_Day"),
        "indicador_hora": extrair_hora(arquivo, nome_arquivo, "Day_view_time")
    }


def extrair_dados_temperatura_noite(arquivo, nome_arquivo):
    return {
        "indicador_temperatura": extrair_dados_temperatura(arquivo, nome_arquivo),
        "indicador_qualidade": extrair_indicador_de_qualidade(arquivo, nome_arquivo, "QC_Night"),
        "indicador_hora": extrair_hora(arquivo, nome_arquivo, "Night_view_time")
    }


def extrair_dados_temperatura(arquivo, nome_arquivo):
    lst = arquivo.select("LST_Day_1km")
    atributos = lst.attributes(full=1)

    return {
        "matriz_temperatura": lst[:, :].astype(numpy.int16),
        "valor_de_preenchemento": extrair_valor_de_preenchemento(atributos),
        "fator_escalar": extrair_fator_escalar(atributos),
        "valor_valido_minimo": extrair_valor_minimo_valido(atributos),
        "valor_valido_maximo": extrair_valor_maximo_valido(atributos)
    }


def extrair_indicador_de_qualidade(arquivo, nome_arquivo, nome_dado_cientifico):
    qi = arquivo.select(nome_dado_cientifico)
    atributos = qi.attributes(full=1)

    return {
        "matriz_qualidade": qi[:, :].astype(numpy.int8),
        "valor_valido_minimo": extrair_valor_minimo_valido(atributos),
        "valor_valido_maximo": extrair_valor_maximo_valido(atributos)
    }


def extrair_hora(arquivo, nome_arquivo, nome_dado_cientifico):
    hora = arquivo.select(nome_dado_cientifico)
    atributos = hora.attributes(full=1)

    return {
        "matriz_hora": hora[:, :].astype(numpy.int8),
        "valor_de_preenchemento": extrair_valor_de_preenchemento(atributos),
        "fator_escalar": extrair_fator_escalar(atributos),
        "valor_valido_minimo": extrair_valor_minimo_valido(atributos),
        "valor_valido_maximo": extrair_valor_maximo_valido(atributos)
    }


def processar_temperatura(linha, coluna, indicador_temperatura):
    temperatura = indicador_temperatura["matriz_temperatura"][linha][coluna]

    if temperatura == indicador_temperatura["valor_de_preenchemento"] or (
            indicador_temperatura["valor_valido_maximo"] < temperatura < indicador_temperatura["valor_valido_minimo"]):
        return None

    return (temperatura * indicador_temperatura["fator_escalar"]) - 273.15


# Primeiro par de bits
# 00 = LST produced, goodquality, not necessary to examine more detailed QA
# 01 = LST produced, other quality, recommend examination of more detailed QA
# 10 = LST not produced due to cloud effects
# 11 = LST not produced primarily due to reasons other than cloud
def processar_qualidade_do_pixel(linha, coluna, indicador_qualidade):
    qualidade_pixel = indicador_qualidade["matriz_qualidade"][linha][coluna]

    if indicador_qualidade["valor_valido_maximo"] < qualidade_pixel < indicador_qualidade["valor_valido_minimo"]:
        return None

    qualidade_pixel_bit_string = numpy.binary_repr(qualidade_pixel, width=8)
    qualidade_pixel_array = textwrap.wrap(qualidade_pixel, 2)


def processar_hora_registro_pixel(linha, coluna, indicador_hora):
    hora = indicador_hora["matriz_hora"][linha][coluna]

    if hora == indicador_hora["valor_de_preenchemento"] or (
            indicador_hora["valor_valido_maximo"] < hora < indicador_hora["valor_valido_minimo"]):
        return None

    return int(hora * indicador_hora["fator_escalar"])


def extrair_valor_de_preenchemento(atributos):
    return atributos["_FillValue"][0]


def extrair_fator_escalar(atributos):
    return atributos["scale_factor"][0]


def extrair_valor_minimo_valido(atributos):
    return atributos["valid_range"][0][0]


def extrair_valor_maximo_valido(atributos):
    return atributos["valid_range"][0][1]
