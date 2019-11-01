import glob
import logging
import numpy
import geojson
import json


from pyhdf.SD import SD, SDC

# 406/271 ; 2030/1354
# 4060 quantidade de registros no offset

def teste():
    fileList = [f for f in glob.glob("entries/*.hdf")]

    for fileName in fileList:
        file = SD(fileName, SDC.READ)

        # Read dataset.
        data2D = file.select("LST")[:, :].astype(numpy.double)
        data = data2D[:, :].astype(numpy.double)

        logging.info('data')
        logging.info(len(data))

        logging.info('data[0]')
        logging.info(len(data[0]))

        # Read geolocation dataset from MOD03 product.
        # latitude = file.select('Latitude')[:, :]
        # longitude = file.select('Longitude')[:, :]
        lat = file.select('Latitude')
        latitudeLine = lat[:, :].astype(numpy.double)
        lon = file.select('Longitude')
        longitudeLine = lon[:, :].astype(numpy.double)

        logging.info('latitude')
        logging.info(len(latitudeLine))

        logging.info('longitude')
        logging.info(len(longitudeLine))

        multipoint = []

        for latitudeColumn, longitudeColumn in zip(latitudeLine, longitudeLine):
            for lat, long in zip(latitudeColumn, longitudeColumn):
                multipoint.append(geojson.Point((lat, long)))
                # logging.info(lat)
                # logging.info(long)
            # logging.info('lat')
            # logging.info(len(lat))
            #
            # logging.info('long')
            # logging.info(len(long))

        with open('map2.geojson', 'w', encoding='utf8') as fp:
            json.dump(geojson.MultiPoint(multipoint[1001:2001]), fp, sort_keys=True, ensure_ascii=False)
        # geojson.dump(geojson.MultiPoint(multipoint), sort_keys=True)

        # logging.info(lat)
        #
        # latitude = lat[:, :]
        # lon = file.select('Longitude')
        # longitude = lon[:, :]