import os
import logging
import psycopg2


def save(dados_processados):
    try:
        conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
                                   user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
        cursor = conexao.cursor()

        qualidade_pixel_dia = dados_processados["qualidade_do_pixel_dia"]
        qualidade_do_pixel_noite = dados_processados["qualidade_do_pixel_noite"]
        values = [
            dados_processados["id_metadados"],
            dados_processados["id_bairro"],
            dados_processados["latitude"],
            dados_processados["longitude"],
            dados_processados["temperatura_dia"],
            dados_processados["hora_registro_pixel_dia"],
            dados_processados["temperatura_noite"],
            dados_processados["hora_registro_pixel_noite"],
            qualidade_pixel_dia["qualidade_pixel_bit_string"],
            qualidade_pixel_dia["media_erro_temperatura"],
            qualidade_pixel_dia["qualidade_pixel"],
            qualidade_pixel_dia["qualidade_pixel_obrigatoria"],
            qualidade_pixel_dia["media_erro_emissao"],
            qualidade_do_pixel_noite["qualidade_pixel_bit_string"],
            qualidade_do_pixel_noite["media_erro_temperatura"],
            qualidade_do_pixel_noite["qualidade_pixel"],
            qualidade_do_pixel_noite["qualidade_pixel_obrigatoria"],
            qualidade_do_pixel_noite["media_erro_emissao"],
        ]

        cursor.execute("INSERT INTO lstd_dados_cientificos "
                       "(id_metadados, id_bairro, latitude, longitude,"
                       "temperatura_dia, hora_registro_pixel_dia, temperatura_noite, hora_registro_pixel_noite,"
                       "qualidade_pixel_bit_string_dia, media_erro_temperatura_dia, qualidade_pixel_dia, qualidade_pixel_obrigatoria_dia, media_erro_emissao_dia,"
                       "qualidade_pixel_bit_string_noite, media_erro_temperatura_noite, qualidade_pixel_noite, qualidade_pixel_obrigatoria_noite, media_erro_emissao_noite)"
                       " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id", values)
        retorno = cursor.fetchone()[0]
        conexao.commit()
        cursor.close()
        conexao.close()
        return retorno
    except psycopg2.Error as e:
        logging.info("Não foi possivel salavr o registro. Code:" + e.pgcode + ". Erro:" + e.pgerror)
        return


def consultar_bairros():
    try:
        conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
                                   user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
        cursor = conexao.cursor()
        cursor.execute("SELECT id, poligono_json FROM bairros")
        bairros = cursor.fetchall()
        cursor.close()
        conexao.close()
        return bairros
    except psycopg2.Error as e:
        logging.info("Não foi possivel estabelecer conexão com o banco de dados. Code:" + e.pgcode + ". Erro:" + e.pgerror)
        exit(1)
