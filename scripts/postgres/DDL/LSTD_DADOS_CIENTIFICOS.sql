CREATE TABLE lstd_dados_cientificos (
    id                          BIGSERIAL PRIMARY KEY,
    id_metadados                BIGINT REFERENCES lstd_metadados(id) NOT NULL,
    latitude                    VARCHAR(30) NOT NULL,
    longitude                   VARCHAR(30) NOT NULL,
    temperatura_dia             VARCHAR(10),
    qualidade_do_pixel_dia      VARCHAR(2) NOT NULL,
    hora_registro_pixel_dia     VARCHAR(2)
    temperatura_noite           VARCHAR(10),
    qualidade_do_pixel_noite    VARCHAR(2) NOT NULL,
    hora_registro_pixel_noite   VARCHAR(2)
);

comment on column lstd_dados_cientificos.id is 'Identificador do registro gerado automaticamente.';
comment on column lstd_dados_cientificos.id_metadados is 'Identificador do registro de metadados.';
comment on column lstd_dados_cientificos.latitude is 'Latitude do pixel.';
comment on column lstd_dados_cientificos.longitude is 'Longitude do pixel';
comment on column lstd_dados_cientificos.temperatura is 'Temperatura do pixel em °C.';
comment on column lstd_dados_cientificos.qualidade_do_pixel is 'Qualidade do pixel %.';
comment on column lstd_dados_cientificos.hora_registro_pixel is 'Hora de registro do pixel.';