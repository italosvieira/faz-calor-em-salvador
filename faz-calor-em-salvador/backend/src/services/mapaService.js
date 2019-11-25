const { Pool } = require('pg')
const GeoJSON = require('geojson')

const pool = new Pool()

module.exports = {
  get: async function (ctx) {
    const filtro = {
      visualizacoes: ['Semanal'],
      bairros: (await pool.query('select id, nome_bairro as nome from bairros order by nome_bairro;')).rows
    }

    ctx.body = filtro
  },
  post: async function (ctx) {
    const bairro = (await pool.query({
      text: 'SELECT nome_bairro as nome, poligono_json as poligono from bairros where id = $1',
      values: [ctx.request.body.bairro.id]
    })).rows[0]

    const pontos = (await pool.query({
      text: 'select latitude, longitude, temperatura_dia as temperaturaDia, hora_registro_pixel_dia as horaDia, ' +
            'temperatura_noite as temperaturaNoite, hora_registro_pixel_noite horaNoite ' +
            'from lstd_dados_cientificos dc inner join lstd_metadados md on dc.id_metadados = md.id ' +
            'where dc.id_bairro = $1 and md.nome_dataset = \'MOD11A2\' ' +
            'and TO_DATE($2, \'DD/MM/YYYY\') >= md.data_inicio_colecao and TO_DATE($3, \'DD/MM/YYYY\') <= md.data_fim_colecao',
      values: [ctx.request.body.bairro.id, ctx.request.body.data.singleDate.formatted, ctx.request.body.data.singleDate.formatted]
    })).rows

    const geoBairro = GeoJSON.parse(bairro, { Polygon: 'poligono' })
    geoBairro.geometry.coordinates = [geoBairro.geometry.coordinates]
    const geoPontos = []

    for (const ponto of pontos) {
      geoPontos.push(GeoJSON.parse(ponto, { Point: ['latitude', 'longitude'] }))
    }

    ctx.body = { bairro: geoBairro, pontos: geoPontos }
  }
}