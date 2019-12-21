const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  getIntervalos: async function (bairroId) {
    return (await pool.query({
      text:
          `select to_char(md.data_inicio_colecao, 'DD/MM/YYYY') as inicio,
                  to_char(md.data_fim_colecao, 'DD/MM/YYYY') as fim
        from lstd_metadados md
        inner join lstd_dados_cientificos dc on md.id = dc.id_metadados
        where md.data_inicio_colecao is not null
        and md.data_fim_colecao is not null
        and dc.id_bairro = $1
        order by md.data_fim_colecao desc
      `,
      values: [bairroId]
    })).rows
  },
  getDiasDisponiveis: async function (bairroId) {
    return (await pool.query({
      text: `
        select md.data_inicio_colecao as dia
        from lstd_metadados md
        inner join lstd_dados_cientificos dc on md.id = dc.id_metadados
        where md.data_inicio_colecao is not null
        and dc.id_bairro = $1
        order by dia desc
      `,
      values: [bairroId]
    })).rows
  }
}