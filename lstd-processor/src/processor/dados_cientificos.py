import numpy
import logging
import textwrap
from shapely.geometry import Point, asPolygon

import src.service.dados_cientificos as service


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
        "indicador_temperatura": extrair_dados_temperatura(arquivo, nome_arquivo, "LST_Day_1km"),
        "indicador_qualidade": extrair_indicador_de_qualidade(arquivo, nome_arquivo, "QC_Day"),
        "indicador_hora": extrair_hora(arquivo, nome_arquivo, "Day_view_time")
    }


def extrair_dados_temperatura_noite(arquivo, nome_arquivo):
    return {
        "indicador_temperatura": extrair_dados_temperatura(arquivo, nome_arquivo, "LST_Night_1km"),
        "indicador_qualidade": extrair_indicador_de_qualidade(arquivo, nome_arquivo, "QC_Night"),
        "indicador_hora": extrair_hora(arquivo, nome_arquivo, "Night_view_time")
    }


def extrair_dados_temperatura(arquivo, nome_arquivo, nome_dado_cientifico):
    lst = arquivo.select(nome_dado_cientifico)
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
        "matriz_qualidade": qi[:, :].astype(numpy.int16),
        "valor_valido_minimo": extrair_valor_minimo_valido(atributos),
        "valor_valido_maximo": extrair_valor_maximo_valido(atributos)
    }


def extrair_hora(arquivo, nome_arquivo, nome_dado_cientifico):
    hora = arquivo.select(nome_dado_cientifico)
    atributos = hora.attributes(full=1)

    return {
        "matriz_hora": hora[:, :].astype(numpy.int16),
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


def processar_qualidade_do_pixel(linha, coluna, indicador_qualidade):
    qualidade_pixel = indicador_qualidade["matriz_qualidade"][linha][coluna]

    if indicador_qualidade["valor_valido_maximo"] < qualidade_pixel < indicador_qualidade["valor_valido_minimo"]:
        return None

    qualidade_pixel_bit_string = numpy.binary_repr(qualidade_pixel, width=8)
    qualidade_pixel_array = textwrap.wrap(qualidade_pixel_bit_string, 2)

    qualidade_pixel_array[0]
    qualidade_pixel_array[1]
    qualidade_pixel_array[2]
    qualidade_pixel_array[3]

    return {
        "qualidade_pixel_bit_string": qualidade_pixel_bit_string,
        "qualidade_do_dado_obrigatorio": processar_qualidade_do_dado_obrigatorio(qualidade_pixel_array[3]),
        "qualidade_do_dado": processar_qualidade_do_dado(qualidade_pixel_array[2]),
        "erro_de_emissao": processar_erro_de_emissao(qualidade_pixel_array[1]),
        "lst_erro": processar_lst_erro(qualidade_pixel_array[0])
    }


def processar_qualidade_do_dado_obrigatorio(dado):
    if dado == "00":
        return "Gerado, boa qualidade, não necessita de revalidação"

    if dado == "01":
        return "Gerado, outra qualidade, não necessita de revalidação"

    if dado == "10":
        return "Não gerado por causa do efeito das nuvens"

    if dado == "11":
        return "Não gerado por algum motivo fora o das nuvens"


def processar_qualidade_do_dado(dado):
    if dado == "00":
        return "Dado de boa qualidade"

    if dado == "01":
        return "Dado de outra qualidade"

    if dado == "10":
        return "Não definido"

    if dado == "11":
        return "Não definido"


def processar_erro_de_emissao(dado):
    if dado == "00":
        return "Média de erro de emissão <= 0.01"

    if dado == "01":
        return "Média de erro de emissão <= 0.02"

    if dado == "10":
        return "Média de erro de emissão <= 0.04"

    if dado == "11":
        return "Média de erro de emissão > 0.04"


def processar_lst_erro(dado):
    if dado == "00":
        return "Média LST erro <= 1K"

    if dado == "01":
        return "Média LST erro <= 2K"

    if dado == "10":
        return "Média LST erro <= 3K"

    if dado == "11":
        return "Média LST erro > 3K"


def processar_hora_registro_pixel(linha, coluna, indicador_hora):
    hora = indicador_hora["matriz_hora"][linha][coluna]

    if hora == indicador_hora["valor_de_preenchemento"] or (
            indicador_hora["valor_valido_maximo"] < hora < indicador_hora["valor_valido_minimo"]):
        return None

    return int(hora * indicador_hora["fator_escalar"])


def processar_bairros(latitude, longitude, poligonos_bairros):
    for bairro in poligonos_bairros:
        # point = Point(latitude, longitude)
        # point.within(bairro.poligono)
        if bairro["poligono"].contains(Point(float(longitude), float(latitude))):
            return bairro.id

    # point1 = ogr.Geometry(ogr.wkbPoint)
    # # point1.AddPoint(longitude, latitude)
    # point1.AddPoint(-38.52982521057129, -13.005791274703812)
    #
    # ring = ogr.Geometry(ogr.wkbLinearRing)
    # ring.AddPoint(-38.51755142211914, -13.010265380580984)
    # ring.AddPoint(-38.52431058883667, -13.002195205876193)
    # ring.AddPoint(-38.52838754653931, -13.00378417294829)
    # ring.AddPoint(-38.527464866638184, -12.996487384978787)
    # ring.AddPoint(-38.535726070404046, -13.002696986050923)
    # ring.AddPoint(-38.533945083618164, -13.013255041853022)
    # ring.AddPoint(-38.51755142211914, -13.010265380580984)
    # polygon = ogr.Geometry(ogr.wkbPolygon)
    # polygon.AddGeometry(ring)
    # polygon.Contains(point1)


def obter_bairros_como_poligonos():
    lista_retorno = []
    bairros = service.consultar_bairros()

    for bairro in bairros:
        lista_retorno.append({"id": bairro[0], "poligono": asPolygon(bairro[4])})

    return lista_retorno


def extrair_valor_de_preenchemento(atributos):
    return atributos["_FillValue"][0]


def extrair_fator_escalar(atributos):
    return atributos["scale_factor"][0]


def extrair_valor_minimo_valido(atributos):
    return atributos["valid_range"][0][0]


def extrair_valor_maximo_valido(atributos):
    return atributos["valid_range"][0][1]
