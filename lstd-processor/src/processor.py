import glob
import logging
import numpy


from pyhdf.SD import SD, SDC


def teste():
    fileList = [f for f in glob.glob("../data/*.hdf")]

    for fileName in fileList:
        file = SD(fileName, SDC.READ)

        # Read dataset.
        data = file.select("LST_Day_1km")
        teste = file.attributes(full=1)
        dayViewTime = file.select("Day_view_time")

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
