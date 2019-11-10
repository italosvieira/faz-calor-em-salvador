CREATE TABLE lstd_metadados (
    id                          BIGSERIAL PRIMARY KEY,
    nome_arquivo                VARCHAR(150) NOT NULL,
    nome_dataset                VARCHAR(20) NOT NULL,
    data_geracao_arquivo        DATE NOT NULL,
    coordenada_limite_norte     VARCHAR(50) NOT NULL,
    coordenada_limite_sul       VARCHAR(50) NOT NULL,
    coordenada_limite_leste     VARCHAR(50) NOT NULL,
    coordenada_limite_oeste     VARCHAR(50) NOT NULL,
    arquivos_geradores          JSON,
    data_inicio_colecao         DATE,
    hora_inicio_colecao         VARCHAR(2),
    data_fim_colecao            DATE,
    hora_fim_colecao            VARCHAR(2),
    UNIQUE(nome_arquivo)
);

CREATE INDEX ON lstd_metadados (nome_arquivo);
CREATE INDEX ON lstd_metadados (nome_dataset);

comment on column lstd_metadados.id is 'Identificador do registro gerado automaticamente.';
comment on column lstd_metadados.nome_arquivo is 'Nome do arquivo gerador do registro.';
comment on column lstd_metadados.nome_dataset is 'Nome do dataset de origem do registro.';
comment on column lstd_metadados.data_geracao_arquivo is 'Data da geração do arquivo do dataset. No formato DD/MM/YYYY';
comment on column lstd_metadados.coordenada_limite_norte is 'Coordenada norte do limite da grid do granulo.';
comment on column lstd_metadados.coordenada_limite_sul is 'Coordenada sul do limite da grid do granulo.';
comment on column lstd_metadados.coordenada_limite_leste is 'Coordenada leste do limite da grid do granulo.';
comment on column lstd_metadados.coordenada_limite_oeste is 'Coordenada oeste do limite da grid do granulo.';
comment on column lstd_metadados.arquivos_geradores is 'Arquivos que geraram o granulo.';
comment on column lstd_metadados.data_inicio_colecao is 'Data de início da coleta de dados que geraram esse granulo. No formato DD/MM/YYYY';
comment on column lstd_metadados.hora_inicio_colecao is 'Hora de início da coleta de dados que geraram esse granulo. No formato DD/MM/YYYY';
comment on column lstd_metadados.data_fim_colecao is 'Data de fim da coleta de dados que geraram esse granulo. No formato DD/MM/YYYY';
comment on column lstd_metadados.hora_fim_colecao is 'Hora de fim da coleta de dados que geraram esse granulo. No formato DD/MM/YYYY';