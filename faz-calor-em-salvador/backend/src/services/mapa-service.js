const moment = require('moment')
const lstdService = require('./lstd-service')
const bairroService = require('./bairro-service')
const metadadoService = require('./metadado-service')
const estacaoAutomaticaService = require('./estacao-automatica-service')
const estacaoConvencionalService = require('./estacao-convencional-service')
const estacaoAutomaticaRadioMarinhaService = require('./estacao-automatica-radio-marinha-service')

const BusinessException = require('../exceptions/business-exception')

function validarRequest (body) {
  if (!body) {
    throw new BusinessException('Request body null ou undefined', 'Request inválido.', 400)
  }

  if (!body.visualizacao) {
    throw new BusinessException('Visualizacao null ou undefined', 'Request inválido. visualizacao nao pode ser null ou undefined', 400)
  }

  if (body.visualizacao !== 'Semanal' && body.visualizacao !== 'Dia a dia') {
    throw new BusinessException('Visualizacao diferente de Semanal ou Dia a dia', 'Request inválido. visualizacao nao pode ser diferente de Semanal ou Dia a dia', 400)
  }

  if (!body.bairro) {
    throw new BusinessException('bairro null ou undefined', 'Request inválido. bairro nao pode ser null ou undefined', 400)
  }

  if (!body.bairro.id) {
    throw new BusinessException('bairro.id null ou undefined', 'Request inválido. bairro.id nao pode ser null ou undefined', 400)
  }

  try {
    Number.parseInt(body.bairro.id)
  } catch (e) {
    throw new BusinessException('bairro.id não é um número', 'Request inválido. bairro.id inválido', 400)
  }

  if (body.visualizacao === 'Semanal') {
    if (!body.intervalo) {
      throw new BusinessException('intervalo null ou undefined', 'Request inválido. intervalo não pode ser null ou undefined no modo visualizao Semanal', 400)
    }

    if (!body.intervalo.inicio) {
      throw new BusinessException('intervalo.inicio null ou undefined', 'Request inválido. intervalo.inicio não pode ser null ou undefined no modo visualizao Semanal', 400)
    }

    if (!body.intervalo.fim) {
      throw new BusinessException('intervalo.fim null ou undefined', 'Request inválido. intervalo.fim não pode ser null ou undefined no modo visualizao Semanal', 400)
    }
  }

  if (body.visualizacao === 'Dia a dia') {
    if (!body.data) {
      throw new BusinessException('data null ou undefined', 'Request inválido. data não pode ser null ou undefined no modo visualizao Dia a dia', 400)
    }

    if (!body.data.singleDate) {
      throw new BusinessException('data.singleDate null ou undefined', 'Request inválido. data.singleDate não pode ser null ou undefined no modo visualizao Dia a dia', 400)
    }

    if (!body.data.singleDate.formatted) {
      throw new BusinessException('data.singleDate.formatted null ou undefined', 'Request inválido. data.singleDate.formatted não pode ser null ou undefined no modo visualizao Dia a dia', 400)
    }

    if (!moment(body.data.singleDate.formatted).isValid()) {
      throw new BusinessException('data.singleDate.formatted não está em uma formato válido', 'Request inválido. data.singleDate.formatted está em um formato inválido no modo visualizao Dia a dia', 400)
    }

    try {
      moment(body.data.singleDate.formatted).format('DD/MM/YYYY')
    } catch (e) {
      throw new BusinessException('data.singleDate.formatted não está em uma formato válido', 'Request inválido. data.singleDate.formatted está em um formato inválido no modo visualizao Dia a dia', 400)
    }
  }
}

async function consultarMapaModoIntervalo (body) {
  return {
    bairro: await bairroService.getBairroAsGeoJson(body.bairro.id),
    pontos: await lstdService.getPontosModoIntervalosAsGeoJson(body.bairro.id, body.intervalo.inicio, body.intervalo.fim),
    estacaoAutomatica: {
      mediaTemperaturaManha: await estacaoAutomaticaService.getMediaTemperaturaIntervalo(body.intervalo.inicio, body.intervalo.fim, 10),
      mediaTemperaturaNoite: await estacaoAutomaticaService.getMediaTemperaturaIntervalo(body.intervalo.inicio, body.intervalo.fim, 22)
    },
    estacaoAutomaticaRadioMarinha: {
      mediaTemperaturaManha: await estacaoAutomaticaRadioMarinhaService.getMediaTemperaturaIntervalo(body.intervalo.inicio, body.intervalo.fim, 10),
      mediaTemperaturaNoite: await estacaoAutomaticaRadioMarinhaService.getMediaTemperaturaIntervalo(body.intervalo.inicio, body.intervalo.fim, 22)
    },
    estacaoConvencional: {
      mediaTemperaturaManha: await estacaoConvencionalService.getMediaTemperaturaIntervalo(body.intervalo.inicio, body.intervalo.fim)
    }
  }
}

async function consultarMapaModoDiaDia (body) {
  const dia = body.data.singleDate.formatted

  return {
    bairro: await bairroService.getBairroAsGeoJson(body.bairro.id),
    pontos: await lstdService.getPontosDiaAsGeoJson(body.bairro.id, dia),
    estacaoAutomatica: {
      mediaTemperaturaManha: await estacaoAutomaticaService.getTemperaturaDia(dia, 10),
      mediaTemperaturaNoite: await estacaoAutomaticaService.getTemperaturaDia(dia, 22)
    },
    estacaoAutomaticaRadioMarinha: {
      mediaTemperaturaManha: await estacaoAutomaticaRadioMarinhaService.getTemperaturaDia(dia, 10),
      mediaTemperaturaNoite: await estacaoAutomaticaRadioMarinhaService.getTemperaturaDia(dia, 22)
    },
    estacaoConvencional: {
      mediaTemperaturaManha: await estacaoConvencionalService.getTemperaturaDia(dia)
    }
  }
}

function transformarEmIMyDate (data) {
  const dia = data.dia
  return { year: dia.getFullYear(), month: dia.getMonth() + 1, day: dia.getDate() }
}

module.exports = {
  get: async function (ctx) {
    const bairros = await bairroService.findAll()
    const dias = (await metadadoService.getDiasDisponiveis(bairros[0].id)).map(transformarEmIMyDate)

    ctx.body = {
      visualizacoes: ['Dia a dia', 'Semanal'],
      bairros: bairros,
      dias: dias
    }
  },
  post: async function (ctx) {
    const body = ctx.request.body

    validarRequest(body)

    if (body.visualizacao === 'Semanal') {
      ctx.body = await consultarMapaModoIntervalo(body)
    } else {
      ctx.body = await consultarMapaModoDiaDia(body)
    }
  },
  getDias: async function (ctx) {
    ctx.body = (await metadadoService.getDiasDisponiveis(ctx.params.bairroId)).map(transformarEmIMyDate)
  },
  getIntervalos: async function (ctx) {
    ctx.body = await metadadoService.getIntervalos(ctx.params.bairroId)
  }
}