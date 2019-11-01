import logging
import processor
import test


def main():
    logging.basicConfig(level=logging.DEBUG,
                        format='[%(asctime)s] [%(levelname)s]: %(message)s',
                        datefmt='%d/%m/%Y %H:%M:%S')
    processor.teste()
    # test.run()


if __name__ == "__main__":
    main()
