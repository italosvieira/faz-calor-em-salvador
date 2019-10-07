const db = require('./config/postgres')
const logger = require('./config/winston')
const scrapper = require('./scraper')
const moment = require('moment')

/*PGHOST='localhost'
PGUSER=process.env.USER
PGDATABASE=process.env.USER
PGPASSWORD=null
PGPORT=5432*/

async function start () {
  logger.info('Iniciando a aplicação.')
  await db.connect()

  const dataFim = moment().format('DD/MM/YYYY').toString()
  const estacaoAutomaticaSalvador = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQwMQ=='
  const estacaoAutomaticaSalvadorRadioMarinha = 'http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQ1Ng=='
  const estacaoConvencionalSalvadorOndina = 'http://www.inmet.gov.br/sim/sonabra/dspDadosCodigo.php?ODMyMjk='

  //TODO Tentar se conectar com banco e se não conseguir sair da aplicação
  /*try {
    await scrapper('http://www.inmet.gov.br/sonabra/pg_dspDadosCodigo_sim.php?QTQwMQ==', '29/09/2019', '30/09/2019')
  } catch (e) {
    logger.error(e.message)
    process.exit(1)
  }*/

  try {
    // TODO dataIni vai procurar no banco a última data
    const dataIni = '05/10/2019'
    const x = await scrapper(estacaoAutomaticaSalvador, dataIni, dataFim, 'Estação Automática de Salvador. ', false)
    console.log('')
    // TODO salvar no banco os dados que foram obtidos, não salvar com a mesma data e a mesma hora
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática de Salvador.')

  try {
    // TODO dataIni vai procurar no banco a última data
    const dataIni = '05/10/2019'
    const x = await scrapper(estacaoAutomaticaSalvadorRadioMarinha, dataIni, dataFim, 'Estação Automática Rádio Marinha de Salvador. ', false)
    // TODO salvar no banco os dados que foram obtidos, não salvar com a mesma data e a mesma hora
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Automática Rádio Marinha de Salvador.')

  try {
    // TODO dataIni vai procurar no banco a última data
    const dataIni = '05/10/2019'
    const x = await scrapper(estacaoConvencionalSalvadorOndina, dataIni, dataFim, 'Estação Convencional de Salvador. ', true)
    // TODO salvar no banco os dados que foram obtidos, não salvar com a mesma data e a mesma hora
  } catch (e) {
    logger.error(e.message)
  }

  logger.info('Finalizando coleta de dados da Estação Convencional de Salvador.')
}

start()