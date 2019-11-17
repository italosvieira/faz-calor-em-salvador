import json
import os
import psycopg2


def save(cursor, metadados):
    values = [
        metadados["nome_arquivo"],
        metadados["nome_dataset"],
        metadados["data_hora_geracao_arquivo"],
        metadados["coordenada_limite_norte"],
        metadados["coordenada_limite_sul"],
        metadados["coordenada_limite_lest"],
        metadados["coordenada_limite_oeste"],
        json.dumps(metadados["arquivos_geradores"]),
        metadados["data_inicio_colecao"],
        metadados["hora_inicio_colecao"].split(":")[0],
        metadados["data_fim_colecao"],
        metadados["hora_fim_colecao"].split(":")[0]
    ]

    cursor.execute("INSERT INTO lstd_metadados "
                   "(nome_arquivo, nome_dataset, data_geracao_arquivo,"
                   "coordenada_limite_norte, coordenada_limite_sul, coordenada_limite_leste,"
                   "coordenada_limite_oeste, arquivos_geradores, data_inicio_colecao,"
                   "hora_inicio_colecao, data_fim_colecao, hora_fim_colecao)"
                   " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id", values)
    return cursor.fetchone()[0]


def get_medatados_id_by_nome_arquivo(cursor, nome_arquivo):
    cursor.execute("SELECT id FROM lstd_metadados WHERE nome_arquivo = %s", (nome_arquivo,))
    return cursor.fetchone()


def get_medatados_id_by_nome_arquivo_or_insert(metadados):
    conexao = psycopg2.connect(host=os.environ["POSTGRES_HOST"], dbname=os.environ["POSTGRES_DB"],
                               user=os.environ["POSTGRES_USER"], password=os.environ["POSTGRES_PASSWORD"])
    cursor = conexao.cursor()
    m = get_medatados_id_by_nome_arquivo(cursor, metadados["nome_arquivo"])

    if not m:
        id_metadados = save(cursor, metadados)
        conexao.commit()
        cursor.close()
        conexao.close()
        return id_metadados
    cursor.close()
    conexao.close()
    return m[0]
