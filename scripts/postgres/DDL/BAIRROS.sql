CREATE TABLE bairros (
    id                  BIGSERIAL PRIMARY KEY,
    nome_bairro         VARCHAR(300) NOT NULL,
    codigo_bairro       INTEGER NOT NULL,
    poligono            POLYGON NOT NULL,
    poligono_json       JSON NOT NULL,
    municipio           BIGINT REFERENCES municipios(id) NOT NULL,
    UNIQUE(nome_bairro),
    UNIQUE(codigo_bairro)
);

CREATE INDEX ON bairros(codigo_bairro);
CREATE INDEX ON bairros(nome_bairro);

comment on column bairros.id is 'Identificador do registro gerado automaticamente.';
comment on column bairros.nome_bairro is 'Nome do bairro extraído do Informs Arcgis.';
comment on column bairros.codigo_bairro is 'Código do bairro extraido do Informs Arcgis.';