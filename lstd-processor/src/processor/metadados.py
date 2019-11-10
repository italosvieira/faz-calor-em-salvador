import json
import logging

CORE_METADATA_0 = "CoreMetadata.0"
ARCHIVE_METADATA_0 = "ArchiveMetadata.0"
IGUAL = "="
BARRA_N = "\n"
NORTH_BOUNDING_COORDINATE = "NORTHBOUNDINGCOORDINATE"
SOUTH_BOUNDING_COORDINATE = "SOUTHBOUNDINGCOORDINATE"
EAST_BOUNDING_COORDINATE = "EASTBOUNDINGCOORDINATE"
WEST_BOUNDING_COORDINATE = "WESTBOUNDINGCOORDINATE"
LONG_NAME = "LONGNAME"
LOCAL_GRANULE_ID = "LOCALGRANULEID"
PRODUCTION_DATE_TIME = "PRODUCTIONDATETIME"
SHORT_NAME = "SHORTNAME"
RANGE_BEGINNING_DATE = "RANGEBEGINNINGDATE"
RANGE_BEGINNING_TIME = "RANGEBEGINNINGTIME"
RANGE_ENDING_DATE = "RANGEENDINGDATE"
RANGE_ENDING_TIME = "RANGEENDINGTIME"
END_OBJECT = "END_OBJECT"
INPUT_POINTER = "INPUTPOINTER"
GRING_POINT_LATITUDE = "GRINGPOINTLATITUDE"
GRING_POINT_LONGITUDE = "GRINGPOINTLONGITUDE"
EMPTY_STR = ""
LEFT_PARENTHESES = "("
RIGHT_PARENTHESES = ")"
LEFT_BRACKETS = "["
RIGHT_BRACKETS = "]"
ASPAS = "\""
VIRGULA = ","


def processar_metadados(arquivo, nome_arquivo):
    metadados = arquivo.attributes(full=1)

    logging.info(nome_arquivo + ": Metadados: " + json.dumps(metadados))

    core_metadata = metadados[CORE_METADATA_0][0]
    logging.info(nome_arquivo + ": Core Metadados: " + json.dumps(core_metadata))

    archive_metadata = metadados[ARCHIVE_METADATA_0][0]
    logging.info(nome_arquivo + ": Archive Metadados: " + json.dumps(archive_metadata))

    return {
        "coordenada_limite_norte": extrair_north_bounding_coordinate(archive_metadata),
        "coordenada_limite_sul": extrair_south_bounding_coordinate(archive_metadata),
        "coordenada_limite_lest": extrair_east_bounding_coordinate(archive_metadata),
        "coordenada_limite_oeste": extrair_west_bounding_coordinate(archive_metadata),
        "nome_completo_dataset": extrair_long_name(archive_metadata),
        "nome_arquivo": extrair_granule_id(core_metadata),
        "data_hora_geracao_arquivo": extrair_production_date_time(core_metadata),
        "nome_dataset": extrair_short_name(core_metadata),
        "data_inicio_colecao": extrair_range_begining_date(core_metadata),
        "hora_inicio_colecao": extrair_range_begining_time(core_metadata),
        "data_fim_colecao": extrair_range_ending_date(core_metadata),
        "hora_fim_colecao": extrair_range_ending_time(core_metadata),
        "arquivos_geradores": extrair_input_pointer(core_metadata),
        "latitudes_canto": extrair_gring_point_latitude(core_metadata),
        "longitudes_canto": extrair_gring_point_longitude(core_metadata),
    }


def extrair_north_bounding_coordinate(archive_metadata):
    return archive_metadata.split(NORTH_BOUNDING_COORDINATE)[1].split(IGUAL)[2].split(BARRA_N)[0].strip()


def extrair_south_bounding_coordinate(archive_metadata):
    return archive_metadata.split(SOUTH_BOUNDING_COORDINATE)[1].split(IGUAL)[2].split(BARRA_N)[0].strip()


def extrair_east_bounding_coordinate(archive_metadata):
    return archive_metadata.split(EAST_BOUNDING_COORDINATE)[1].split(IGUAL)[2].split(BARRA_N)[0].strip()


def extrair_west_bounding_coordinate(archive_metadata):
    return archive_metadata.split(WEST_BOUNDING_COORDINATE)[1].split(IGUAL)[2].split(BARRA_N)[0].strip()


def extrair_long_name(archive_metadata):
    return archive_metadata.split(LONG_NAME)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_granule_id(core_metadata):
    return core_metadata.split(LOCAL_GRANULE_ID)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_production_date_time(core_metadata):
    return core_metadata.split(PRODUCTION_DATE_TIME)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_short_name(core_metadata):
    return core_metadata.split(SHORT_NAME)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_range_begining_date(core_metadata):
    return core_metadata.split(RANGE_BEGINNING_DATE)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_range_begining_time(core_metadata):
    return core_metadata.split(RANGE_BEGINNING_TIME)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_range_ending_date(core_metadata):
    return core_metadata.split(RANGE_ENDING_DATE)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_range_ending_time(core_metadata):
    return core_metadata.split(RANGE_ENDING_TIME)[1].split(IGUAL)[2].split(BARRA_N)[0]. \
        strip(). \
        replace(ASPAS, EMPTY_STR). \
        strip()


def extrair_input_pointer(core_metadata):
    return list(map(lambda f: f.replace(ASPAS, EMPTY_STR).strip(),
                    core_metadata.split(INPUT_POINTER)[1].split(IGUAL)[2].split(END_OBJECT)[0].
                    replace(BARRA_N, EMPTY_STR).
                    replace(LEFT_PARENTHESES, EMPTY_STR).
                    replace(RIGHT_PARENTHESES, EMPTY_STR).
                    split(VIRGULA)))


def extrair_gring_point_latitude(core_metadata):
    return core_metadata.split(GRING_POINT_LATITUDE)[1].split(IGUAL)[3].split(BARRA_N)[0]. \
        replace(LEFT_PARENTHESES, EMPTY_STR). \
        replace(RIGHT_PARENTHESES, EMPTY_STR). \
        strip(). \
        split(VIRGULA)


def extrair_gring_point_longitude(core_metadata):
    return core_metadata.split(GRING_POINT_LONGITUDE)[1].split(IGUAL)[3].split(BARRA_N)[0]. \
        replace(LEFT_PARENTHESES, EMPTY_STR). \
        replace(RIGHT_PARENTHESES, EMPTY_STR). \
        strip(). \
        split(VIRGULA)
