FROM hdfeos/anaconda3
RUN apt update
RUN pip install --upgrade pip
RUN pip install geojson
RUN pip install shapely
RUN pip install geopy
RUN pip install psycopg2-binary
RUN conda update --all
RUN apt-get -y install libjpeg-dev
#RUN pip install GDAL
#RUN conda install -c conda-forge libgcc
RUN conda install -c conda-forge gdal
#RUN apt install -y gdal-bin
#RUN apt install -y libgdal-dev
#RUN apt install -y g++
#RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal
#RUN export C_INCLUDE_PATH=/usr/include/gdal
#RUN pip install --global-option=build_ext --global-option="-I/usr/include/gdal/" GDAL==2.1.0
#RUN pip install GDAL

#RUN conda install libgcc=5.2.0
#ENV GDAL_VERSION=2.2.1
#ENV GDAL_VERSION_PYTHON=2.2.1
#
#RUN apt-get update && \
#    apt-get -y install \
#        wget \
#        libcurl4-openssl-dev \
#        build-essential \
#        libpq-dev \
#        ogdi-bin \
#        libogdi3.2-dev \
#        libjasper-runtime \
#        libjasper-dev \
#        libjasper1 \
#        libgeos-dev \
#        libproj-dev \
#        libpoppler-dev \
#        libsqlite3-dev \
#        libspatialite-dev \
#        python3 \
#        python3-dev \
#        python3-numpy
#
#RUN wget https://bootstrap.pypa.io/get-pip.py && \
#    python3 get-pip.py
#
#RUN wget http://download.osgeo.org/gdal/$GDAL_VERSION/gdal-${GDAL_VERSION}.tar.gz -O /tmp/gdal-${GDAL_VERSION}.tar.gz && \
#    tar -x -f /tmp/gdal-${GDAL_VERSION}.tar.gz -C /tmp
#
#RUN cd /tmp/gdal-${GDAL_VERSION} && \
#    ./configure \
#        --prefix=/usr \
#        --with-python \
#        --with-geos \
#        --with-sfcgal \
#        --with-libtiff=internal \
#        --with-geotiff=internal \
#        --with-jpeg=internal \
#        --with-jpeg12=internal \
#        --with-png \
#        --with-expat \
#        --with-libkml \
#        --with-openjpeg \
#        --with-pg \
#        --with-curl \
#        --with-spatialite && \
#    make -j $(nproc) && make install
#
#RUN rm /tmp/gdal-${GDAL_VERSION} -rf
#
#RUN pip install GDAL==${GDAL_VERSION_PYTHON}
CMD [ "/bin/bash" ]