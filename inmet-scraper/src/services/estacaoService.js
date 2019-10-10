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
const insertInto = ' INSERT INTO '
const estacaoAutomaticaSavadorTabela = 'estacao_automatica_salvador '
const estacaoAutomaticaSavadorRadioMarinhaTabela = 'estacao_automatica_salvador_radio_marinha '
const estacaoConvencionalSalvadorOndinaTabela = 'estacao_convencional_salvador '
const colunasEstacoesAutomaticas = '(data_medicao, hora_medicao, temperatura_inst, temperatura_max, temperatura_min, umidade_inst, umidade_max, umidade_min, pto_orvalho_inst, pto_orvalho_max, pto_orvalho_min, pressao_inst, pressao_max, pressao_min, vento_velocidade, vento_direcao, vento_rajada, radiacao, precipitacao)'
const values = ' VALUES($1, $2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19)'
const colunaEstacaoConvencional = '(data_medicao, hora_medicao, temperatura, temperatura_max, temperatura_min, umidade, pressao, vento_velocidade, vento_direcao, nebulosidade, insolacao, precipitacao)'
const valuesEstacaoConvencional = ' VALUES($1, $2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)'
const teste = ` INSERT INTO estacao_convencional_salvador(data_medicao, hora_medicao, temperatura, temperatura_max, temperatura_min, umidade, pressao, vento_velocidade, vento_direcao, nebulosidade, insolacao, precipitacao) VALUES($1, $2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)`

/*PGHOST='localhost'
PGUSER=process.env.USER
PGDATABASE=process.env.USER
PGPASSWORD=null
PGPORT=5432*/

// TODO sdalvar também os registro em uma tabela jsonb
// TODO tentar salvar o log final numa tabela jsonb

const inicializarAplicacao = async function () {
  try {
    logger.info('Iniciando a aplicação.')
    logger.info('Tentando se conectar ao banco de dados.')
    await db.connect()
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
  const dataIni = await db.query(query)

  if (!dataIni) {
    if (convencional) {
      return moment().subtract(3, 'months').format(formatoData).toString()
    } else {
      return moment().subtract(1, 'year').format(formatoData).toString()
    }
  }

  return dataIni
}

async function salvarRegistros(listaEstacoes, query, nomeEstacao) {
  logger.info(nomeEstacao + 'Inicializando a persistência dos registros no banco.')

  for (const estacao of listaEstacoes) {
    const registro = 'Registro: ' + JSON.stringify(estacao)

    try {
      logger.info(nomeEstacao + 'Salvando o ' + registro)
      await db.query(query, Object.values(estacao))
    } catch (e) {
      logger.error(nomeEstacao + 'Erro ao salvar o ' + registro + '. Mensagem de Erro: ' + e.message)
    }
  }
}

const estacaoAutomaticaSalvadorScraper = async function () {
  try {
    const nomeEstacao = 'Estação Automática de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) from estacao_automatica_salvador', false)
    const listaEstacoesAutomaticasSalvador = await scrapper(estacaoAutomaticaSalvador, dataIni, dataFim, nomeEstacao, false)
    await salvarRegistros(listaEstacoesAutomaticasSalvador, insertInto + estacaoAutomaticaSavadorTabela + colunasEstacoesAutomaticas + values, nomeEstacao)
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática de Salvador.')
}

const estacaoAutomaticaSalvadorRadioMarinhaScraper = async function () {
  try {
    const nomeEstacao = 'Estação Automática Rádio Marinha de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) from estacao_automatica_salvador_radio_marinha', false)
    const listaEstacoesAutomaticasSalvadorRadioMarinha = await scrapper(estacaoAutomaticaSalvadorRadioMarinha, dataIni, dataFim, 'Estação Automática Rádio Marinha de Salvador. ', false)
    await salvarRegistros(listaEstacoesAutomaticasSalvadorRadioMarinha, insertInto + estacaoAutomaticaSavadorRadioMarinhaTabela + colunasEstacoesAutomaticas + values, nomeEstacao)
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática Rádio Marinha de Salvador.')
}

const estacaoConvencionalSalvadorScraper = async function () {
  try {
    const nomeEstacao = 'Estação Convencional de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) from estacao_convencional_salvador', false)
    const listaEstacoesConvencionaisSalvador = await scrapper(estacaoConvencionalSalvadorOndina, dataIni, dataFim, 'Estação Convencional de Salvador. ', true)
    await salvarRegistros(listaEstacoesConvencionaisSalvador, teste, nomeEstacao)
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