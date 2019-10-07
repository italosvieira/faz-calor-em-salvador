const logger = require('../config/winston')
const request = require('request-promise')
const cheerio = require('cheerio')
const moment = require('moment')

const propriedadesEstacaoConvencional = ['data_medicao', 'hora_medicao', 'temperatura', 'umidade', 'pressao', 'velocidade_vento', 'direcao_vento',
  'nebulosidade', 'isolacao', 'temperatura_maxima', 'temperatura_minima', 'precipitacao']

const propriedadesEstacaoAutomatica = ['data_medicao', 'hora_medicao', 'temperatura_inst', 'temperatura_max', 'temperatura_min', 'umidade_inst',
                                      'umidade_max', 'umidade_min', 'pto_orvalho_inst', 'pto_orvalho_max', 'pto_orvalho_min', 'pressao_inst', 'pressao_max',
                                      'pressao_min', 'vento_velocidade', 'vento_direcao', 'vento_rajada', 'radiacao', 'precipitacao']

function popularObjetoEstacao($, convencional) {
  const list = []
  let listaDePropriedades = []

  if (convencional) {
    listaDePropriedades = propriedadesEstacaoConvencional
  } else {
    listaDePropriedades = propriedadesEstacaoAutomatica
  }

  $('table').last().find('tbody tr').each(function () {
    const estacaoConvencional = {}

    $(this).find('td span').each(function (iteracao) {
      const value = $(this).text()

      if (iteracao > listaDePropriedades.length) {
        if (value) {
          estacaoConvencional['propriedadeDesconhecida' + iteracao] = value.trim()
        } else {
          estacaoConvencional['propriedadeDesconhecida' + iteracao] = null
        }
      } else {
        if (value) {
          estacaoConvencional[listaDePropriedades[iteracao]] = value.trim()
        } else {
          estacaoConvencional[listaDePropriedades[iteracao]] = null
        }
      }
    })

    list.push(estacaoConvencional)
  })

  return list
}

module.exports = async function(url, dataIni, dataFim, estacao, convencional) {
  logger.info(estacao + 'Iniciando coleta de dados.')

  let body, $, aleaValue, xaleaValue, xID, aleaNum

  if (!moment(dataIni, 'DD/MM/YYYY').isValid()) {
    throw new Error(estacao + 'Data início passada como parâmetro inválida. Data Início: ' + dataIni)
  }

  if (!moment(dataFim, 'DD/MM/YYYY').isValid()) {
    throw new Error(estacao + 'Data fim passada como parâmetro inválida. Data Fim: ' + dataFim)
  }

  try {
    logger.info(estacao + 'Fazendo request inicial da url para obter metadados. URL: ' + url)
    body = await request.get(url)
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer request inicial da url para obter metadados. URL' + url + '. Mensagem de Erro: ' + e.message)
  }

  try {
    logger.info(estacao + 'Fazendo parse do body do request de metadados com o cheerio. Body: ' + JSON.stringify(body))
    $ = cheerio.load(body)
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer parse do body do request de metadados com o cheerio. Mensagem de Erro: ' + e.message)
  }

  try {
    logger.info(estacao + 'Fazendo extração e decode do parâmetro aleaNum.')
    aleaNum = $('td > img').attr('src').split('geraImg.php?imgNum=')[1]
    aleaNum = Buffer.from(aleaNum, 'base64').toString('ascii');
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer a extração ou decode do parâmetro aleaNum com o cheerio. Mensagem de Erro: ' + e.message)
  }

  if (!aleaNum) {
    throw new Error(estacao + 'Erro o parâmetro aleaNum é null ou undefined. aleaNum: ' + aleaNum)
  }

  logger.info(estacao + 'Parâmetro aleaNum extraido com sucesso. aleaNum: ' + aleaNum)

  try {
    logger.info(estacao + 'Fazendo extração do parâmetro aleaValue.')
    aleaValue = $('[name=aleaValue]').attr('value')
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer a extração do parâmetro aleaValue com o cheerio. Mensagem de Erro: ' + e.message)
  }

  if (!aleaValue) {
    throw new Error(estacao + 'Erro o parâmetro aleaValue é null ou undefined. aleaValue: ' + aleaValue)
  }

  logger.info(estacao + 'Parâmetro aleaValue extraido com sucesso. aleaValue: ' + aleaValue)

  try {
    logger.info(estacao + 'Fazendo extração do parâmetro xaleaValue.')
    xaleaValue = $('[name=xaleaValue]').attr('value')
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer a extração do parâmetro xaleaValue com o cheerio. Mensagem de Erro: ' + e.message)
  }

  if (!xaleaValue && !convencional) {
    throw new Error(estacao + 'Erro o parâmetro xaleaValue é null ou undefined. xaleaValue: ' + xaleaValue)
  }

  logger.info(estacao + 'Parâmetro xaleaValue extraido com sucesso. xaleaValue: ' + xaleaValue)

  try {
    logger.info(estacao + 'Fazendo extração do parâmetro xID.')
    xID = $('[name=xID]').attr('value')
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer a extração do parâmetro xID com o cheerio. Mensagem de Erro: ' + e.message)
  }

  if (!xID && !convencional) {
    throw new Error(estacao + 'Erro o parâmetro xID é null ou undefined. xID: ' + xID)
  }

  logger.info(estacao + 'Parâmetro xID extraido com sucesso. xID: ' + xID)

  const form = {"aleaValue": aleaValue, "xaleaValue": xaleaValue, "xID": xID, "aleaNum": aleaNum, "dtaini": dataIni, "dtafim": dataFim}

  try {
    logger.info(estacao + 'Fazendo post request para obter os dados a serem extraídos. URL: ' + url + '. Form: ' + JSON.stringify(form))
    body = await request.post({
      url: url,
      form: form,
      method: 'POST'
    })
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer post request para obter os dados a serem extraídos. URL: ' + url + '. Form: ' + JSON.stringify(form) + e.message)
  }

  try {
    logger.info(estacao + 'Fazendo parse do body do post request com o cheerio dos dados a serem extraídos. Body: ' + JSON.stringify(body))
    $ = cheerio.load(body)
  } catch (e) {
    throw new Error(estacao + 'Erro ao fazer parse do body do post request com o cheerio dos dados a serem extraídos. Body: ' + JSON.stringify(body)
      + '. Mensagem de Erro: ' + e.message)
  }

  return popularObjetoEstacao($, convencional)
}