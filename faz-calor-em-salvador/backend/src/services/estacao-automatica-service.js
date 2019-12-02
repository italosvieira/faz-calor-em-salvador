const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  getMediaTemperaturaIntervalo: async function (dataMedicaoInicio, dataMedicaoFim, horaMedicao) {
    return (await pool.query(
      {
        text: `
          select avg(eas.temperatura_inst) as temperaturainst, 
                 avg(eas.temperatura_max) as temperaturamax, 
                 avg(eas.temperatura_min) as temperaturamin 
          from estacao_automatica_salvador eas 
          where eas.data_medicao >= TO_DATE($1, 'DD/MM/YYYY') and eas.data_medicao <= TO_DATE($2, 'DD/MM/YYYY') 
          and eas.hora_medicao = $3 
        `,
        values: [dataMedicaoInicio, dataMedicaoFim, horaMedicao]
      }
    )).rows[0]
  },
  getTemperaturaDia: async function (dataMedicao, horaMedicao) {
    return (await pool.query({
      text: `
        select temperatura_inst as temperaturainst, 
               temperatura_max as temperaturamax, 
               temperatura_min as temperaturamin 
        from estacao_automatica_salvador 
        where data_medicao = TO_DATE($1, 'DD/MM/YYYY') and hora_medicao = $2 
      `,
      values: [dataMedicao, horaMedicao]
    })).rows[0]
  }
}