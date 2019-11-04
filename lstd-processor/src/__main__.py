import logging
from src import processor


def main():
    logging.basicConfig(level=logging.DEBUG,
                        format='[%(asctime)s] [%(levelname)s]: %(message)s',
                        datefmt='%d/%m/%Y %H:%M:%S')
    processor.teste()


if __name__ == "__main__":
    main()
