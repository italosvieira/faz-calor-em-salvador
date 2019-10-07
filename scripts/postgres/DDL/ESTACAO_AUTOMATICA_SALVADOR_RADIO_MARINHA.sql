CREATE TABLE estacao_automatica_salvador_radio_marinha (
    id                 BIGSERIAL PRIMARY KEY,
    data_medicao       DATE NOT NULL,
    hora_medicao       VARCHAR(2) NOT NULL,
    temperatura_inst   NUMERIC(3,2) NOT NULL,
    temperatura_max    NUMERIC(3,2),
    temperatura_min    NUMERIC(3,2),
    umidade_inst       INTEGER,
    umidade_max        INTEGER,
    umidade_min        INTEGER,
    pto_orvalho_inst   NUMERIC(3,2),
    pto_orvalho_max    NUMERIC(3,2),
    pto_orvalho_min    NUMERIC(3,2),
    pressao_inst       NUMERIC(5,2),
    pressao_max        NUMERIC(5,2),
    pressao_min        NUMERIC(5,2),
    vento_velocidade   NUMERIC(3,2),
    vento_direcao      INTEGER,
    vento_rajada       NUMERIC(3,2),
    radiacao           NUMERIC(6,2),
    precipitacao       NUMERIC(6,2)
);

CREATE INDEX ON estacao_automatica_salvador_radio_marinha ((max(data_medicao)));

comment on column estacao_automatica_salvador_radio_marinha.id is 'Identificador do registro gerado automaticamente.';
comment on column estacao_automatica_salvador_radio_marinha.data_medicao is 'Data de quando foi medido os dados do registro. No formato DD/MM/YYYY';
comment on column estacao_automatica_salvador_radio_marinha.hora_medicao is 'Hora de quando foi medido os dados do registro. No formato 24h';
comment on column estacao_automatica_salvador_radio_marinha.temperatura_inst is 'Temperatura instante registrada no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.temperatura_max is 'Temperatura máxima registrada no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.temperatura_min is 'Temperatura mínima registrada no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.umidade_inst is 'Umidade instante registrada no dia em %.';
comment on column estacao_automatica_salvador_radio_marinha.umidade_max is 'Umidade máxima registrada no dia em %.';
comment on column estacao_automatica_salvador_radio_marinha.umidade_min is 'Umidade mínima registrada no dia em %.';
comment on column estacao_automatica_salvador_radio_marinha.pto_orvalho_inst is 'Ponto de orvalho instante registrado no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.pto_orvalho_max is 'Ponto de orvalho máximo registrado no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.pto_orvalho_min is 'Ponto de orvalho mínimo registrado no dia em °C.';
comment on column estacao_automatica_salvador_radio_marinha.pressao_inst is 'Pressão instante registrada no dia em hPa.';
comment on column estacao_automatica_salvador_radio_marinha.pressao_max is 'Pressão máxima registrada no dia em hPa.';
comment on column estacao_automatica_salvador_radio_marinha.pressao_min is 'Pressão mínima registrada no dia em hPa.';
comment on column estacao_automatica_salvador_radio_marinha.vento_velocidade is 'Velocidade do vento registrada no dia em m/s.';
comment on column estacao_automatica_salvador_radio_marinha.vento_direcao is 'Direção do vento registrada no dia em graus (º).';
comment on column estacao_automatica_salvador_radio_marinha.vento_rajada is 'rajada de vento registrada no dia em m/s.';
comment on column estacao_automatica_salvador_radio_marinha.radiacao is 'Radiação registrada no dia em KJ/m².';
comment on column estacao_automatica_salvador_radio_marinha.precipitacao is 'Precipitação registrada no dia em mm.';