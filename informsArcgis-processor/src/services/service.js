const { Client } = require('pg')
const logger = require('../config/winston')
const request = require('request-promise')

const db = new Client()
const alterDatabase = `ALTER DATABASE faz_calor_em_salvador SET datestyle TO "ISO, DMY"`
const url = `http://maps.informs.conder.ba.gov.br/arcgis/rest/services/BAHIA/BAIRRO_GEO/MapServer/0/query?where=CODIGO_MUNICIPIO%3D2740&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`

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

const processarBairros = async function () {
  try {
    logger.info('Fazendo request inicial da url para dados. URL: ' + url)
    listaBairros = await request.get({ uri: url, json: true })
    console.log("batata")
  } catch (e) {
    throw new Error('Erro ao fazer request inicial da url para obter dados. URL' + url + '. Mensagem de Erro: ' + e.message)
  }
}

module.exports = {
  inicializarAplicacao,
  processar: processarBairros
}