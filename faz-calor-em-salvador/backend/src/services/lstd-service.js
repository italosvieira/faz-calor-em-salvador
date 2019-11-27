const { Pool } = require('pg')
const GeoJSON = require('geojson')

const pool = new Pool()

module.exports = {
  getPontosModoIntervalos: async (bairroId, dataInicio, dataFim) => {
    return (await pool.query({
      text: 'select latitude, longitude, temperatura_dia as temperaturaDia, hora_registro_pixel_dia as horaDia, ' +
          'temperatura_noite as temperaturaNoite, hora_registro_pixel_noite horaNoite ' +
          'from lstd_dados_cientificos dc inner join lstd_metadados md on dc.id_metadados = md.id ' +
          'where dc.id_bairro = $1 and md.nome_dataset = \'MOD11A2\' ' +
          'and TO_DATE($2, \'DD/MM/YYYY\') = md.data_inicio_colecao and TO_DATE($3, \'DD/MM/YYYY\') = md.data_fim_colecao',
      values: [bairroId, dataInicio, dataFim]
    })).rows
  },
  getPontosModoIntervalosAsGeoJson: async function (bairroId, dataInicio, dataFim) {
    const pontos = []

    for (const ponto of (await this.getPontosModoIntervalos(bairroId, dataInicio, dataFim))) {
      pontos.push(GeoJSON.parse(ponto, { Point: ['latitude', 'longitude'] }))
    }

    return pontos
  }
}