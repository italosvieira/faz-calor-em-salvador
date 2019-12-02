const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  getMediaTemperaturaIntervalo: async function (dataMedicaoInicio, dataMedicaoFim, horaMedicao) {
    return (await pool.query(
      {
        text: `
          select  avg(earm.temperatura_inst) as temperaturainst, 
                  avg(earm.temperatura_max) as temperaturamax, 
                  avg(earm.temperatura_min) as temperaturamin 
          from estacao_automatica_salvador_radio_marinha earm 
          where earm.data_medicao >= TO_DATE($1, 'DD/MM/YYYY') and earm.data_medicao <= TO_DATE($2, 'DD/MM/YYYY') 
          and earm.hora_medicao = $3
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
        from estacao_automatica_salvador_radio_marinha 
        where data_medicao = TO_DATE($1, 'DD/MM/YYYY') and hora_medicao = $2 
      `,
      values: [dataMedicao, horaMedicao]
    })).rows[0]
  }
}