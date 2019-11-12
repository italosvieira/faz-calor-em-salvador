CREATE TABLE municipios (
    id                  BIGSERIAL PRIMARY KEY,
    nome_municipio      VARCHAR(300) NOT NULL,
    codigo_municipio    VARCHAR(10) NOT NULL,
    UNIQUE(codigo_municipio),
    UNIQUE(nome_municipio)
);

CREATE INDEX ON municipio (codigo_municipio);

comment on column municipio.id is 'Identificador do registro gerado automaticamente.';
comment on column municipio.nome_municipio is 'Nome do município extraído do Informs Arcgis.';
comment on column municipio.codigo_municipio is 'Código do município extraido do Informs Arcgis.';