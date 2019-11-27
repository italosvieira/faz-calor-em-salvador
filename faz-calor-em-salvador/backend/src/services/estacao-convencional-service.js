const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  getMediaTemperaturaIntervalo: async (dataMedicaoInicio, dataMedicaoFim) => {
    return (await pool.query(
      {
        text:
            `
            select  avg(eac.temperatura) as temperaturainst,
                    (select avg(temperatura_max) from estacao_convencional_salvador eac where eac.data_medicao >= TO_DATE($1, 'DD/MM/YYYY') and eac.data_medicao <= TO_DATE($2, 'DD/MM/YYYY') and eac.hora_medicao = '00') as temperaturamax,
                    avg(eac.temperatura_min) as temperaturamin
            from estacao_convencional_salvador eac
            where eac.data_medicao >= TO_DATE($1, 'DD/MM/YYYY') and eac.data_medicao <= TO_DATE($2, 'DD/MM/YYYY') and eac.hora_medicao = '12'
            `,
        values: [dataMedicaoInicio, dataMedicaoFim]
      }
    )).rows[0]
  }
}