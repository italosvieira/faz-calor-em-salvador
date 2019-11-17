import logging
from datetime import datetime


def config():
    logging.basicConfig(level=logging.DEBUG,
                        format='[%(asctime)s] [%(levelname)s]: %(message)s',
                        datefmt='%d/%m/%Y %H:%M:%S',
                        handlers=[
                            logging.FileHandler('lstdProcessor-{:%Y-%m-%d}.log'.format(datetime.now())),
                            logging.StreamHandler()
                        ])
