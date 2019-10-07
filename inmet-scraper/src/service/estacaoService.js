const { Client } = require('pg')
const moment = require('moment')
const logger = require('../config/winston')
const scrapper = require('./scraperService')

const db = new Client()
const dataFim = moment().format('DD/MM/YYYY').toString()
const estacaoAutomaticaSalvador = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQwMQ=='
const estacaoAutomaticaSalvadorRadioMarinha = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQ1Ng=='
const estacaoConvencionalSalvadorOndina = 'http://www.inmet.gov.br/sim/sonabra/dspDadosCodigo.php?ODMyMjk='

/*PGHOST='localhost'
PGUSER=process.env.USER
PGDATABASE=process.env.USER
PGPASSWORD=null
PGPORT=5432*/

// TODO colocar algumas variaveis locais como do escopo do arquivo
// TODO sdalvar também os registro em uma tabela jsonb

async function obterDataInicio(query, convencional) {
  const dataIni = await db.query(query)

  if (!dataIni) {
    if (convencional) {
      return moment().subtract(3, 'months').format('DD/MM/YYYY').toString()
    } else {
      return moment().subtract(1, 'year').format('DD/MM/YYYY').toString()
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

const estacaoAutomaticaSalvadorScraper = async function () {
  try {
    const nomeEstacao = 'Estação Automática de Salvador. '
    const dataIni = await obterDataInicio('select max(data_medicao) from estacao_automatica_salvador', false)
    const listaEstacoesAutomaticasSalvador = await scrapper(estacaoAutomaticaSalvador, dataIni, dataFim, nomeEstacao, false)
    await salvarRegistros(listaEstacoesAutomaticasSalvador, 'query', nomeEstacao) //TODO query
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
    await salvarRegistros(listaEstacoesAutomaticasSalvadorRadioMarinha, 'query', nomeEstacao) //TODO query
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
    await salvarRegistros(listaEstacoesConvencionaisSalvador, 'query', nomeEstacao) //TODO query
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Convencional de Salvador.')
}

const finalizarAplicacao = async function (code) {
  await db.end()
  process.exit(code || 0)
}

module.exports = {
  inicializarAplicacao,
  estacaoAutomaticaSalvadorScraper,
  estacaoAutomaticaSalvadorRadioMarinhaScraper,
  estacaoConvencionalSalvadorScraper,
  finalizarAplicacao
}