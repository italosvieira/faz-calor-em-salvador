CREATE TABLE estacao_convencional_salvador (
    id                 BIGSERIAL PRIMARY KEY,
    data_medicao       DATE NOT NULL,
    hora_medicao       VARCHAR(2) NOT NULL,
    temperatura        NUMERIC(3,2) NOT NULL,
    temperatura_max    NUMERIC(3,2),
    temperatura_min    NUMERIC(3,2),
    umidade            INTEGER,
    pressao            NUMERIC(5,2),
    vento_velocidade   NUMERIC(3,2),
    vento_direcao      INTEGER,
    nebulosidade       INTEGER,
    insolacao           NUMERIC(4,2),
    precipitacao       NUMERIC(6,2)
);

CREATE INDEX ON estacao_convencional_salvador ((max(data_medicao)));

comment on column estacao_convencional_salvador.id is 'Identificador do registro gerado automaticamente.';
comment on column estacao_convencional_salvador.data_medicao is 'Data de quando foi medido os dados do registro. No formato DD/MM/YYYY';
comment on column estacao_convencional_salvador.hora_medicao is 'Hora de quando foi medido os dados do registro. No formato 24h';
comment on column estacao_convencional_salvador.temperatura is 'Temperatura registrada no dia em °C.';
comment on column estacao_convencional_salvador.umidade is 'Umidade registrada no dia em %.';
comment on column estacao_convencional_salvador.pressao is 'Pressão registrada no dia em hPa.';
comment on column estacao_convencional_salvador.vento_velocidade is 'Velocidade do vento registrada no dia em m/s.';
comment on column estacao_convencional_salvador.vento_direcao is 'Direção do vento registrada no dia em graus (º).';
comment on column estacao_convencional_salvador.nebulosidade is 'Nebulosidade registrada no dia em décimos.';
comment on column estacao_convencional_salvador.insolacao is 'Insolacao registrada no dia em h.';
comment on column estacao_convencional_salvador.temperatura_max is 'Temperatura máxima registrada no dia em °C.';
comment on column estacao_convencional_salvador.temperatura_min is 'Temperatura mínima registrada no dia em °C.';
comment on column estacao_convencional_salvador.precipitacao is 'Precipitação registrada no dia em mm.';