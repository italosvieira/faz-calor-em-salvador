import os
import logging
import psycopg2


def save(cursor, dados_processados):
    print("")


def consultar_bairros():
    try:
        conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
                                   user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
        cursor = conexao.cursor()
        cursor.execute("SELECT * FROM bairros")
        bairros = cursor.fetchall()
        cursor.close()
        conexao.close()
        return bairros
    except psycopg2.Error as e:
        logging.info("Não foi possivel estabelecer conexão com o banco de dados. Code:" + e.pgcode + ". Erro:" + e.pgerror)
        exit(1)
