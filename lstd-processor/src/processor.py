import glob
import logging
import json
import numpy
from shapely.geometry import Point
from src.processors import metadados

from pyhdf.SD import SD, SDC


def teste():
    logging.info("Iniciando processamento de arquivos.")

    fileList = [f for f in glob.glob("../data/*.hdf")]

    logging.info("Arquivos a serem processados: " + ", ".join(map(lambda f: f.replace("../data/", ""), fileList)))

    for fileName in fileList:
        file = SD(fileName, SDC.READ)

        # Read dataset.
        # data = file.select("LST_Day_1km")
        # teste = file.attributes(full=1)
        # dayViewTime = file.select("Day_view_time")

        fattrs = file.attributes(full=1)

        # Aqui
        # struct_metadata = fattrs["StructMetadata.0"][0]

        # Aqui o nome do arquivo, nome dos arquivos que geraram esse arquivo de 8 dias e coordenadas pra fazer o
        # retangulo que é o recorte, nome do dataset
        core_metadata = fattrs["CoreMetadata.0"][0]

        # Aqui tem as bound coordenadas
        archive_metadata = fattrs["ArchiveMetadata.0"][0]
        batata = metadados.obter_metadados(file)
        print("Hello World!")

        # archive_metadata.split("NORTHBOUNDINGCOORDINATE")[1].split("=")[2].split("\n")[0]
        # archive_metadata.split("SOUTHBOUNDINGCOORDINATE")[1].split("=")[2].split("\n")[0]
        # archive_metadata.split("EASTBOUNDINGCOORDINATE")[1].split("=")[2].split("\n")[0]
        # archive_metadata.split("WESTBOUNDINGCOORDINATE")[1].split("=")[2].split("\n")[0]
        # archive_metadata.split("LONGNAME")[1].split("=")[2].split("\n")[0]

        # core_metadata.split("LOCALGRANULEID")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("PRODUCTIONDATETIME")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("SHORTNAME")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("RANGEBEGINNINGDATE")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("RANGEBEGINNINGTIME")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("RANGEENDINGDATE")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("RANGEENDINGTIME")[1].split("=")[2].split("\n")[0]
        # core_metadata.split("INPUTPOINTER")[1].split("=")[2].split("END_OBJECT")[0]

        # core_metadata.split("GRINGPOINTLATITUDE")[1].split("=")[3].split("\n")[0]
        # core_metadata.split("GRINGPOINTLONGITUDE")[1].split("=")[3].split("\n")[0]








        # RINGPOINTLONGITUDE\n
        # NUM_VAL = 4\n
        # CLASS = "1"\n
        # VALUE = (-40.6223286226357, -30.4678185972175, -31.929789319176, -42.5715488199633)\n
        # END_OBJECT = GRINGPOINTLONGITUDE\n\n
        # OBJECT = GRINGPOINTLATITUDE\n
        # NUM_VAL = 4\n
        # CLASS = "1"\n
        # VALUE = (-10.0041666666667, -10.0041666666667, -19.9958333333333, -19.9958333333333)\n
        # END_OBJECT =

        # North = latitude
        # East = longitude

        #     OBJECT = NORTHBOUNDINGCOORDINATE
        #     NUM_VAL = 1
        #     VALUE = -10.0041666666667
        # END_OBJECT = NORTHBOUNDINGCOORDINATE
        #
        # OBJECT = SOUTHBOUNDINGCOORDINATE
        # NUM_VAL = 1
        # VALUE = -19.9958333333333
        #
        #
        # END_OBJECT = SOUTHBOUNDINGCOORDINATE
        #
        # OBJECT = EASTBOUNDINGCOORDINATE
        # NUM_VAL = 1
        # VALUE = -30.4678185972175
        # END_OBJECT = EASTBOUNDINGCOORDINATE
        #
        # OBJECT = WESTBOUNDINGCOORDINATE
        # NUM_VAL = 1
        # VALUE = -42.5715488199633
        # END_OBJECT = WESTBOUNDINGCOORDINATE

        # # Read geolocation dataset from MOD03 product.
        # lat = file.select('Latitude')
        # latitude = lat[:, :]
        # lon = file.select('Longitude')
        # longitude = lon[:, :]
        #
        # # Retrieve attributes.
        # attrs = data2D.attributes(full=1)
        # lna = attrs["long_name"]
        # long_name = lna[0]
        # aoa = attrs["add_offset"]
        # add_offset = aoa[0]
        # fva = attrs["_FillValue"]
        # _FillValue = fva[0]
        # sfa = attrs["scale_factor"]
        # scale_factor = sfa[0]
        # vra = attrs["valid_range"]
        # valid_min = vra[0][0]
        # valid_max = vra[0][1]
        # ua = attrs["units"]
        # units = ua[0]
