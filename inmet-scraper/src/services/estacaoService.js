const { Client } = require('pg')
const moment = require('moment')
const logger = require('../config/winston')
const scrapper = require('./scraperService')

const db = new Client()
const formatoData = 'DD/MM/YYYY'
const dataFim = moment().format(formatoData).toString()
const estacaoAutomaticaSalvador = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQwMQ=='
const estacaoAutomaticaSalvadorRadioMarinha = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQ1Ng=='
const estacaoConvencionalSalvadorOndina = 'http://www.inmet.gov.br/sim/sonabra/dspDadosCodigo.php?ODMyMjk='
const alterDatabase = ` ALTER DATABASE faz_calor_em_salvador SET datestyle TO "ISO, DMY" `
const insertEstacaoAutomaticaSalvador = ` INSERT INTO estacao_automatica_salvador(data_medicao, hora_medicao, temperatura_inst, temperatura_max, temperatura_min, umidade_inst, umidade_max, umidade_min, pto_orvalho_inst, pto_orvalho_max, pto_orvalho_min, pressao_inst, pressao_max, pressao_min, vento_velocidade, vento_direcao, vento_rajada, radiacao, precipitacao) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`
const insertEstacaoAutomaticaSalvadorJSONB = ` INSERT INTO estacao_automatica_salvador_jsonb(data) VALUES($1)`
const insertEstacaoAutomaticaSalvadorRadioMarinha = ` INSERT INTO estacao_automatica_salvador_radio_marinha(data_medicao, hora_medicao, temperatura_inst, temperatura_max, temperatura_min, umidade_inst, umidade_max, umidade_min, pto_orvalho_inst, pto_orvalho_max, pto_orvalho_min, pressao_inst, pressao_max, pressao_min, vento_velocidade, vento_direcao, vento_rajada, radiacao, precipitacao) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`
const insertEstacaoAutomaticaSalvadorRadioMarinhaJSONB = ` INSERT INTO estacao_automatica_salvador_radio_marinha_jsonb(data) VALUES($1)`
const insertEstacaoConvencionalOndina = ` INSERT INTO estacao_convencional_salvador(data_medicao, hora_medicao, temperatura, umidade, pressao, vento_velocidade, vento_direcao, nebulosidade, insolacao, temperatura_max, temperatura_min, precipitacao) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
const insertEstacaoConvencionalOndinaJSONB = ` INSERT INTO estacao_convencional_salvador_jsonb(data) VALUES($1)`

const inicializarAplicacao = async function () {
  try {
    logger.info('Iniciando a aplicação.')
    logger.info('Tentando se conectar ao banco de dados.')
    await db.connect()
    await db.query(alterDatabase)
  } catch (e) {
    logger.error('Erro ao se conectar ao banco de dados. Mensagem de Erro: ' + e.message)
    await finalizarAplicacao(1)
  }
}

const finalizarAplicacao = async function (code) {
  await db.end()
  process.exit(code || 0)
}

async function obterDataInicio(query, convencional) {
  const queryResult = await db.query(query)
  const dataIni = queryResult.rows[0].dataini

  if (!dataIni) {
    if (convencional) {
      return moment().subtract(90, 'day').format(formatoData).toString()
    } else {
      return moment().subtract(365, 'day').format(formatoData).toString()
    }
  }

  return moment(dataIni).format(formatoData).toString()
}

async function salvarRegistros(listaEstacoes, query, nomeEstacao, convencional) {
  logger.info(nomeEstacao + 'Inicializando a persistência dos registros no banco.')

  for (const estacao of listaEstacoes) {
    const registro = 'Registro: ' + JSON.stringify(estacao)

    try {
      logger.info(nomeEstacao + 'Salvando o ' + registro)

      if (convencional) {
        await db.query(query, Object.values(estacao).slice(0, 12))
      } else {
        await db.query(query, Object.values(estacao).slice(0, 19))
      }

    } catch (e) {
      logger.error(nomeEstacao + 'Erro ao salvar o ' + registro + '. Mensagem de Erro: ' + e.message)
    }
  }
}

async function salvarRegistrosJSONB(listaEstacoes, query, nomeEstacao) {
  logger.info(nomeEstacao + 'Inicializando a persistência dos registros no banco no formato JSONB.')

  for (const estacao of listaEstacoes) {
    const jsonb = [JSON.stringify(estacao)]
    const registro = 'Registro: ' + jsonb

    try {
      logger.info(nomeEstacao + 'Salvando o ' + registro)
      await db.query(query, jsonb)
    } catch (e) {
      logger.error(nomeEstacao + 'Erro ao salvar no formato JSONB o ' + registro + '. Mensagem de Erro: ' + e.message)
    }
  }
}

const estacaoAutomaticaSalvadorScraper = async function () {
  try {
    const nomeEstacao = 'Estação Automática de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) as dataini from estacao_automatica_salvador', false)
    const listaEstacoesAutomaticasSalvador = await scrapper(estacaoAutomaticaSalvador, dataIni, dataFim, nomeEstacao, false)
    await salvarRegistros(listaEstacoesAutomaticasSalvador, insertEstacaoAutomaticaSalvador, nomeEstacao, false)
    await salvarRegistrosJSONB(listaEstacoesAutomaticasSalvador, insertEstacaoAutomaticaSalvadorJSONB, nomeEstacao)
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática de Salvador.')
}

const estacaoAutomaticaSalvadorRadioMarinhaScraper = async function () {
  try {
    const nomeEstacao = 'Estação Automática Rádio Marinha de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) as dataIni from estacao_automatica_salvador_radio_marinha', false)
    const listaEstacoesAutomaticasSalvadorRadioMarinha = await scrapper(estacaoAutomaticaSalvadorRadioMarinha, dataIni, dataFim, 'Estação Automática Rádio Marinha de Salvador. ', false)
    await salvarRegistros(listaEstacoesAutomaticasSalvadorRadioMarinha, insertEstacaoAutomaticaSalvadorRadioMarinha, nomeEstacao, false)
    await salvarRegistrosJSONB(listaEstacoesAutomaticasSalvadorRadioMarinha, insertEstacaoAutomaticaSalvadorRadioMarinhaJSONB, nomeEstacao)
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática Rádio Marinha de Salvador.')
}

const estacaoConvencionalSalvadorScraper = async function () {
  try {
    const nomeEstacao = 'Estação Convencional de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) as dataIni from estacao_convencional_salvador', true)
    const listaEstacoesConvencionaisSalvador = await scrapper(estacaoConvencionalSalvadorOndina, dataIni, dataFim, 'Estação Convencional de Salvador. ', true)
    await salvarRegistros(listaEstacoesConvencionaisSalvador, insertEstacaoConvencionalOndina, nomeEstacao, true)
    await salvarRegistrosJSONB(listaEstacoesConvencionaisSalvador, insertEstacaoConvencionalOndinaJSONB, nomeEstacao)
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Convencional de Salvador.')
}

module.exports = {
  inicializarAplicacao,
  estacaoAutomaticaSalvadorScraper,
  estacaoAutomaticaSalvadorRadioMarinhaScraper,
  estacaoConvencionalSalvadorScraper,
  finalizarAplicacao
}