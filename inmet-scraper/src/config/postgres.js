const { Client } = require('pg')
const logger = require('./winston')

const client = new Client()

module.exports = {
  connect: async function() {
    try {
      logger.info('Tentando se conectar ao banco postgres.')
      await client.connect()
    } catch (e) {
      logger.error('Erro ao se conectar ao banco postgres. Mensagem de Erro: ' + e.message)
      process.exit(1)
    }
  },

  query: (text, params, callback) => {
    return client.query(text, params, callback)
  },
}