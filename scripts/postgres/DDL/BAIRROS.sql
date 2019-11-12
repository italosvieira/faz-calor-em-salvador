CREATE TABLE bairros (
    id                  BIGSERIAL PRIMARY KEY,
    nome_bairros        VARCHAR(300) NOT NULL,
    codigo_bairros      VARCHAR(10) NOT NULL,
    poligono            JSONB NOT NULL,
    municipio           BIGINT REFERENCES municipio(id) NOT NULL,
    UNIQUE(nome_bairros),
    UNIQUE(codigo_bairros)
);

CREATE INDEX ON municipio (codigo_municipio);

comment on column municipio.id is 'Identificador do registro gerado automaticamente.';
comment on column municipio.nome_municipio is 'Nome do município extraído do Informs Arcgis.';
comment on column municipio.codigo_municipio is 'Código do município extraido do Informs Arcgis.';