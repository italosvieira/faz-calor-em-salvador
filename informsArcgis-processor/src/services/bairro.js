const { Client } = require('pg')
const logger = require('../config/winston')
const request = require('request-promise')

const db = new Client()
const url = `http://maps.informs.conder.ba.gov.br/arcgis/rest/services/BAHIA/BAIRRO_GEO/MapServer/0/query?where=CODIGO_MUNICIPIO%3D2740&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`

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
  logger.info("Finalizando a aplicação.")
  await db.end()
  process.exit(code || 0)
}

const processarBairros = async function () {
  logger.info("Iniciando o processamento dos bairros.")
  const body = await fazerRequest()
  const lista = await transformarDados(body)
  await salvarDados(lista)
}

async function fazerRequest() {
  try {
    logger.info('Fazendo request inicial da url para dados. URL: ' + url)
    return await request.get({ uri: url, json: true })
  } catch (e) {
    logger.error('Erro ao fazer request inicial da url para obter dados. URL' + url + '. Mensagem de Erro: ' + e.message)
    await finalizarAplicacao(1)
  }
}

async function transformarDados(result) {
  try {
    logger.info("Transformando os dados do retorno do request. Result" + JSON.stringify(result))
    const lista = []

    for (const object of result.features) {
      logger.info("Montando objeto com atributos. Atributos: " + JSON.stringify(object))
      const attributes = object.attributes
      lista.push({
          "municipio": { "nomeMunicipio": attributes.NOME_MUNICIPIO.trim(), "codigoMunicipio": attributes.CODIGO_MUNICIPIO },
          "bairro": { "nomeBairro": attributes.NOME.trim(), "codigoBairro": attributes.CODIGO, "poligono": object.geometry.rings[0] }
      })
    }
    return lista
  } catch (e) {
    logger.error('Erro ao fazer parse do objeto. Mensagem de Erro: ' + e.message)
    await finalizarAplicacao(1)
  }
}

async function salvarDados(lista) {
  logger.info("Iniciando processo de persistência no banco de dados.")

  for (const elemento of lista) {
    logger.info("Dado a ser persistido. Município: " + JSON.stringify(elemento.municipio) + ". Bairro: " + JSON.stringify(elemento.bairro))
    let municipio = await consultarMunicipio(elemento.municipio)

    logger.info("Retorno da consulta de município no banco de dados. Município: " + JSON.stringify(municipio))

    if (!municipio || !municipio.id) {
      municipio = await inserirMunicipio(elemento.municipio)
    }

    await inserirBairro(elemento.bairro, municipio)
  }
}

async function consultarMunicipio(municipio) {
  try {
    logger.info("Fazendo consulta para ver se já existe esse município no banco de dados. Município: " + JSON.stringify(municipio))
    return (await db.query(`SELECT * FROM municipios WHERE codigo_municipio = $1 AND nome_municipio = $2`,
      [municipio.codigoMunicipio, municipio.nomeMunicipio])).rows[0]
  } catch (e) {
    logger.error("Erro ao fazer consulta de município no banco de dados. Mensagem de Erro: " + e.message)
    return null
  }
}

async function inserirMunicipio(municipio) {
  try {
    logger.info("Inserindo novo município no banco de dados. Município: " + JSON.stringify(municipio))
    return (await db.query(`INSERT INTO municipios (nome_municipio, codigo_municipio) VALUES ($1, $2) RETURNING id`,
      [municipio.nomeMunicipio, municipio.codigoMunicipio])).rows[0]
  } catch (e) {
    logger.error("Erro ao inserir novo município no banco de dados. Mensagem de Erro: " + e.message)
    return null
  }
}

async function inserirBairro(bairro, municipio) {
  try {
    logger.info("Inserindo novo bairro no banco de dados. Bairro: " + JSON.stringify(bairro) + ". Município: " + JSON.stringify(municipio))
    await db.query(`INSERT INTO bairros (nome_bairro, codigo_bairro, poligono, poligono_json, municipio) VALUES ($1, $2, $3, $4, $5)`,
      [bairro.nomeBairro, bairro.codigoBairro, montarStringPoligono(bairro.poligono), JSON.stringify(bairro.poligono), municipio.id])
  } catch (e) {
    logger.error("Erro ao inserindo novo bairro no banco de dados. Mensagem de Erro: " + e.message)
  }
}

function montarStringPoligono(poligono) {
  let string = "("

  for (const coordenadas of poligono) {
    string = string + "(" + coordenadas.join(",") + "),"
  }

  return string.substring(0, string.length - 1) + ")"
}

module.exports = {
  inicializarAplicacao,
  processarBairros,
  finalizarAplicacao
}