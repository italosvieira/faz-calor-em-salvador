import os
import glob
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import numpy as np
from pyhdf.SD import SD, SDC


def run():
    fileList = [f for f in glob.glob("entries/*.hdf")]

    for fileName in fileList:
        hdf_geo = SD(fileName, SDC.READ)

        # Read dataset.
        data2D = hdf_geo.select("LST")
        data = data2D[:, :].astype(np.double)

        # Read geolocation dataset from MOD03 product.
        lat = hdf_geo.select('Latitude')
        latitude = lat[:, :]
        lon = hdf_geo.select('Longitude')
        longitude = lon[:, :]

        # Retrieve attributes.
        attrs = data2D.attributes(full=1)
        lna = attrs["long_name"]
        long_name = lna[0]
        aoa = attrs["add_offset"]
        add_offset = aoa[0]
        fva = attrs["_FillValue"]
        _FillValue = fva[0]
        sfa = attrs["scale_factor"]
        scale_factor = sfa[0]
        vra = attrs["valid_range"]
        valid_min = vra[0][0]
        valid_max = vra[0][1]
        ua = attrs["units"]
        units = ua[0]

        invalid = np.logical_or(data > valid_max, data < valid_min)
        invalid = np.logical_or(invalid, data == _FillValue)
        data[invalid] = np.nan
        data = (data - add_offset) * scale_factor
        data = np.ma.masked_array(data, np.isnan(data))

        # Draw an equidistant cylindrical projection using the low resolution
        # coastline database.
        m = Basemap(projection='cyl', resolution='l',
                    llcrnrlat=12.5, urcrnrlat=37.5,
                    llcrnrlon=87.5, urcrnrlon=122.5)
        m.drawcoastlines(linewidth=0.5)
        m.drawparallels(np.arange(10, 40, 5), labels=[1, 0, 0, 0])
        m.drawmeridians(np.arange(90, 130, 10), labels=[0, 0, 0, 1])
        m.pcolormesh(longitude, latitude, data, latlon=True)
        cb = m.colorbar()
        cb.set_label(units)

        plt.title('{0}\n{1}'.format("MOD11_L2.A2019287.1305.006.2019288083222.hdf", long_name))
        fig = plt.gcf()
        # plt.show()
        pngfile = "{0}.py.png".format("MOD11_L2.A2019287.1305.006.2019288083222.hdf")
        fig.savefig(pngfile)
