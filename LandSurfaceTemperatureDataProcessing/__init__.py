import logging

def main():
    logging.basicConfig(format="%(asctime)s - %(levelname)s - %(message)s", datefmt="%d/%m/%Y %H:%M:%S", level=logging.DEBUG)
    logging.info("Hello World!")

if __name__ == "__main__":
    main()
