const service = require('./services/service')

async function start () {
  // await service.inicializarAplicacao()
  await service.processar()
}

start()