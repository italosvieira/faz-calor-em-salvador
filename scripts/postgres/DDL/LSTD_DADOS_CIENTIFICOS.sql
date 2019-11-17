CREATE TYPE MEDIA_ERRO_TEMPERATURA AS ENUM ('00', '01', '10', '11');
CREATE TYPE QUALIDADE_PIXEL AS ENUM ('00', '01', '10', '11');
CREATE TYPE QUALIDADE_OBRIGATORIA_PIXEL AS ENUM ('00', '01', '10', '11');
CREATE TYPE MEDIA_ERRO_EMISSAO AS ENUM ('00', '01', '10', '11');

CREATE TABLE lstd_dados_cientificos (
    id                                    BIGSERIAL PRIMARY KEY,
    id_metadados                          BIGINT REFERENCES lstd_metadados(id) NOT NULL,
    id_bairro                             BIGINT REFERENCES bairros(id) NOT NULL,
    latitude                              VARCHAR(30) NOT NULL,
    longitude                             VARCHAR(30) NOT NULL,
    temperatura_dia                       VARCHAR(10),
    hora_registro_pixel_dia               VARCHAR(2),
    temperatura_noite                     VARCHAR(10),
    hora_registro_pixel_noite             VARCHAR(2),
    qualidade_pixel_bit_string_dia        VARCHAR(8),
    media_erro_temperatura_dia            MEDIA_ERRO_TEMPERATURA,
    qualidade_pixel_dia                   QUALIDADE_PIXEL,
    qualidade_pixel_obrigatoria_dia       QUALIDADE_OBRIGATORIA_PIXEL,
    media_erro_emissao_dia                MEDIA_ERRO_EMISSAO,
    qualidade_pixel_bit_string_noite      VARCHAR(8),
    media_erro_temperatura_noite          MEDIA_ERRO_TEMPERATURA,
    qualidade_pixel_noite                 QUALIDADE_PIXEL,
    qualidade_pixel_obrigatoria_noite     QUALIDADE_OBRIGATORIA_PIXEL,
    media_erro_emissao_noite              MEDIA_ERRO_EMISSAO
);

CREATE INDEX ON lstd_dados_cientificos(id_bairro);

comment on column lstd_dados_cientificos.id is 'Identificador do registro gerado automaticamente.';
comment on column lstd_dados_cientificos.id_metadados is 'Identificador do registro de metadados.';
comment on column lstd_dados_cientificos.id_bairro is 'Identificador do registro do bairro.';
comment on column lstd_dados_cientificos.latitude is 'Latitude do pixel.';
comment on column lstd_dados_cientificos.longitude is 'Longitude do pixel';
comment on column lstd_dados_cientificos.temperatura_dia is 'Temperatura durante o dia do pixel em °C.';
comment on column lstd_dados_cientificos.hora_registro_pixel_dia is 'Hora de registro do pixel durante o dia.';
comment on column lstd_dados_cientificos.temperatura_noite is 'Temperatura durante a noite do pixel em °C.';
comment on column lstd_dados_cientificos.hora_registro_pixel_noite is 'Hora de registro do pixel durante a noite.';
comment on column lstd_dados_cientificos.qualidade_pixel_bit_string_dia is 'String de bits que gera os dados de qualidade do dia.';
comment on column lstd_dados_cientificos.media_erro_temperatura_dia is 'Par de bits que representam a média de erro da temperatura do dia. Valores: 00=Média LST erro <= 1K, 01=Média LST erro <= 2K, 10=Média LST erro <= 3K, 11=Média LST erro > 3K';
comment on column lstd_dados_cientificos.qualidade_pixel_dia is 'Par de bits que representam a qualidade do pixel do dia. Valores: 00=Dado de boa qualidade, 01=Dado de outra qualidade, 10=Não definido, 11=Não definido';
comment on column lstd_dados_cientificos.qualidade_pixel_obrigatoria_dia is 'Par de bits que representam a qualidade obrigatória do pixel do dia. Valores: 00=Gerado, boa qualidade, não necessita de revalidação, 01=Gerado, outra qualidade, não necessita de revalidação, 10=Não gerado por causa do efeito das nuvens, 11=Não gerado por algum motivo fora o das nuvens';
comment on column lstd_dados_cientificos.media_erro_emissao_dia is 'Par de bits que representam a média de erro de emissão do pixel do dia. Valores: 00=Média de erro de emissão <= 0.01, 01=Média de erro de emissão <= 0.02, 10=Média de erro de emissão <= 0.04, 11=Média de erro de emissão > 0.04';
comment on column lstd_dados_cientificos.qualidade_pixel_bit_string_noite is 'String de bits que gera os dados de qualidade da noite.';
comment on column lstd_dados_cientificos.media_erro_temperatura_noite is 'Par de bits que representam a média de erro da temperatura da noite. Valores: 00=Média LST erro <= 1K, 01=Média LST erro <= 2K, 10=Média LST erro <= 3K, 11=Média LST erro > 3K';
comment on column lstd_dados_cientificos.qualidade_pixel_noite is 'Par de bits que representam a qualidade do pixel da noite. Valores: 00=Dado de boa qualidade, 01=Dado de outra qualidade, 10=Não definido, 11=Não definido';
comment on column lstd_dados_cientificos.qualidade_pixel_obrigatoria_noite is 'Par de bits que representam a qualidade obrigatória do pixel da noite. Valores: 00=Gerado, boa qualidade, não necessita de revalidação, 01=Gerado, outra qualidade, não necessita de revalidação, 10=Não gerado por causa do efeito das nuvens, 11=Não gerado por algum motivo fora o das nuvens';
comment on column lstd_dados_cientificos.media_erro_emissao_noite is 'Par de bits que representam a média de erro de emissão do pixel da noite. Valores: 00=Média de erro de emissão <= 0.01, 01=Média de erro de emissão <= 0.02, 10=Média de erro de emissão <= 0.04, 11=Média de erro de emissão > 0.04';