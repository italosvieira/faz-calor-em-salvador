import src.config.logger as logger
import src.config.database as database
import src.processor.arquivo as arquivo_processor


def main():
    logger.config()
    database.config()
    arquivo_processor.iniciar_processamento_de_arquivos()


if __name__ == "__main__":
    main()
