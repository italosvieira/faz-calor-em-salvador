CREATE TABLE municipios (
    id                  BIGSERIAL PRIMARY KEY,
    nome_municipio      VARCHAR(300) NOT NULL,
    codigo_municipio    INTEGER NOT NULL,
    UNIQUE(codigo_municipio),
    UNIQUE(nome_municipio)
);

CREATE INDEX ON municipios (codigo_municipio);
CREATE INDEX ON municipios (nome_municipio);

comment on column municipios.id is 'Identificador do registro gerado automaticamente.';
comment on column municipios.nome_municipio is 'Nome do município extraído do Informs Arcgis.';
comment on column municipios.codigo_municipio is 'Código do município extraido do Informs Arcgis.';