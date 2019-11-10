import logging


def config():
    logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s]: %(message)s', datefmt='%d/%m/%Y %H:%M:%S')
