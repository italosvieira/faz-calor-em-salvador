const service = require('./services/estacaoService')

async function start () {
  await service.inicializarAplicacao()
  await service.estacaoAutomaticaSalvadorScraper()
  await service.estacaoAutomaticaSalvadorRadioMarinhaScraper()
  await service.estacaoConvencionalSalvadorScraper()
  await service.finalizarAplicacao()
}

start()