import os
import logging
import psycopg2


def config():
    try:
        logging.info("Testando conexão com o banco de dados.")
        conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
                                   user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
        cursor = conexao.cursor()
        cursor.execute("SELECT NOW();")
        cursor.fetchone()
        logging.info("Conexão estabelecida com sucesso com o banco de dados.")
        cursor.close()
        conexao.close()
    except psycopg2.Error as e:
        logging.info("Não foi possivel estabelecer conexão com o banco de dados. Code:" + e.pgcode + ". Erro:" + e.pgerror)
        exit(1)
