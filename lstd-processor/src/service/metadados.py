def save(cursor, metadados):
    # id                          BIGSERIAL PRIMARY KEY,
    # nome_arquivo                VARCHAR(150) NOT NULL,
    # nome_dataset                VARCHAR(20) NOT NULL,
    # data_geracao_arquivo        DATE NOT NULL,
    # coordenada_limite_norte     VARCHAR(50) NOT NULL,
    # coordenada_limite_sul       VARCHAR(50) NOT NULL,
    # coordenada_limite_leste     VARCHAR(50) NOT NULL,
    # coordenada_limite_oeste     VARCHAR(50) NOT NULL,
    # arquivos_geradores          JSON,
    # data_inicio_colecao         DATE,
    # hora_inicio_colecao         VARCHAR(2),
    # data_fim_colecao            DATE,
    # hora_fim_colecao            VARCHAR(2),
    values = [
        metadados["nome_arquivo"],
        metadados["nome_dataset"],
        metadados["data_hora_geracao_arquivo"],
        metadados["coordenada_limite_norte"],
        metadados["coordenada_limite_sul"],
        metadados["coordenada_limite_lest"],
        metadados["coordenada_limite_oeste"],
        metadados["arquivos_geradores"],
        metadados["data_inicio_colecao"],
        metadados["hora_inicio_colecao"],
        metadados["data_fim_colecao"],
        metadados["hora_fim_colecao"],
    ]

    cursor.execute("INSERT INTO lstd_metadados "
                   "(nome_arquivo, nome_dataset, data_geracao_arquivo,"
                   "coordenada_limite_norte, coordenada_limite_sul, coordenada_limite_leste,"
                   "coordenada_limite_oeste, arquivos_geradores, data_inicio_colecao,"
                   "hora_inicio_colecao, data_fim_colecao, hora_fim_colecao)"
                   " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", values)


def get_medatados_id_by_nome_arquivo(cursor, nome_arquivo):
    cursor.execute("SELECT m.id FROM lstd_metadados as m WHERE m.id %s", nome_arquivo)
    return cursor.fetchone()
