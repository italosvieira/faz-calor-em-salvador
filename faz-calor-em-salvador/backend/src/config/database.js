const { Pool } = require('pg')
const logger = require('./winston')

const pool = new Pool()

module.exports = async function () {
  try {
    logger.info('Estabelcendo conexão com o banco de dados.')
    await pool.query('SELECT NOW()')
    await pool.end()
    logger.info('Conexão estabelecida com sucesso.')
  } catch (e) {
    logger.error('Erro ao estabelecer conexão com o banco de dados. ', e)
    process.exit(1)
  }
}