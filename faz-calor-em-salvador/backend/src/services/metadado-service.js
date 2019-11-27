const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  getIntervalos: async () => {
    return (await pool.query(
      ` select to_char(md.data_inicio_colecao, 'DD/MM/YYYY') as inicio, to_char(md.data_fim_colecao, 'DD/MM/YYYY') as fim
        from lstd_metadados md
        order by md.data_fim_colecao desc
      `
    )).rows
  }
}