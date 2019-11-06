import logging
from src import iniciar_processamento


def main():
    logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] [%(levelname)s]: %(message)s', datefmt='%d/%m/%Y %H:%M:%S')
    iniciar_processamento()


if __name__ == "__main__":
    main()
