const service = require('./services/bairro')

async function start () {
  await service.inicializarAplicacao()
  await service.processarBairros()
  await service.finalizarAplicacao(0)
}

start()