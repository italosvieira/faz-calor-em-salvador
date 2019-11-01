import os
import glob
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import numpy as np
from pyhdf.SD import SD, SDC


# GROUP=SwathStructure
# 	GROUP=SWATH_1
# 		SwathName="MOD_Swath_LST"
# 		GROUP=Dimension
# 			OBJECT=Dimension_1
# 				DimensionName="Along_swath_lines_1km"
# 				Size=2030
# 			END_OBJECT=Dimension_1
# 			OBJECT=Dimension_2
# 				DimensionName="Cross_swath_pixels_1km"
# 				Size=1354
# 			END_OBJECT=Dimension_2
# 			OBJECT=Dimension_3
# 				DimensionName="Coarse_swath_lines_5km"
# 				Size=406
# 			END_OBJECT=Dimension_3
# 			OBJECT=Dimension_4
# 				DimensionName="Coarse_swath_pixels_5km"
# 				Size=271
# 			END_OBJECT=Dimension_4
# 		END_GROUP=Dimension
# 		GR
# 		OUP=DimensionMap
# 			OBJECT=DimensionMap_1
# 				GeoDimension="Coarse_swath_lines_5km"
# 				DataDimension="Along_swath_lines_1km"
# 				Offset=2
# 				Increment=5
# 			END_OBJECT=DimensionMap_1
# 			OBJECT=DimensionMap_2
# 				GeoDimension="Coarse_swath_pixels_5km"
# 				DataDimension="Cross_swath_pixels_1km"
# 				Offset=2
# 				Increment=5
# 			END_OBJECT=DimensionMap_2
# 		END_GROUP=DimensionMap
# 		GROUP=IndexDimensionMap
# 		END_GROUP=IndexDimensionMap
# 		GROUP=GeoField
# 			OBJECT=GeoField_1
# 				GeoFieldName="Latitude"
# 				DataType=DFNT_FLOAT32
# 				DimList=("Coarse_swath_lines_5km","Coarse_swath_pixels_5km")
# 			END_OBJECT=GeoField_1
# 			OBJECT=GeoField_2
# 				GeoFieldName="Longitude"
# 				DataType=DFNT_FLOAT32
# 				DimList=("Coarse_swath_lines_5km","Coarse_swath_pixels_5km")
# 			END_OBJECT=GeoField_2
# 		END_GROUP=GeoField
# 		GROUP=DataField
# 			OBJECT=DataField_1
# 				DataFieldName="LST"
# 				DataType=DFNT_UINT16
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_1
# 			OBJECT=DataField_2
# 				DataFieldName="QC"
# 				DataType=DFNT_UINT16
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_2
# 			OBJECT=DataField_3
# 				DataFieldName="Error_LST"
# 				DataType=DFNT_UINT8
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_3
# 			OBJECT=DataField_4
# 				DataFieldName="Emis_31"
# 				DataType=DFNT_UINT8
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_4
# 			OBJECT=DataField_5
# 				DataFieldName="Emis_32"
# 				DataType=DFNT_UINT8
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_5
# 			OBJECT=DataField_6
# 				DataFieldName="View_angle"
# 				DataType=DFNT_UINT8
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_6
# 			OBJECT=DataField_7
# 				DataFieldName="View_time"
# 				DataType=DFNT_UINT8
# 				DimList=("Along_swath_lines_1km","Cross_swath_pixels_1km")
# 			END_OBJECT=DataField_7
# 		END_GROUP=DataField
# 		GROUP=MergedFields
# 		END_GROUP=MergedFields
# 	END_GROUP=SWATH_1
# END_GROUP=SwathStructure
# GROUP=GridStructure
# END_GROUP=GridStructure
# GROUP=PointStructure
# END_GROUP=PointStructure
# END


def run():
    fileList = [f for f in glob.glob("entries/*.hdf")]

    for fileName in fileList:
        hdf_geo = SD(fileName, SDC.READ)

        # Read dataset.
        fattrs = hdf_geo.attributes(full=1)
        ga = fattrs["StructMetadata.0"]
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
