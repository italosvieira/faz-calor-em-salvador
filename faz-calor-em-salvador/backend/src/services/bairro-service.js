const { Pool } = require('pg')
const GeoJSON = require('geojson')

const pool = new Pool()

module.exports = {
  findAll: async function () {
    return (await pool.query('select id, nome_bairro as nome from bairros order by nome_bairro')).rows
  },

  findById: async function (id) {
    return (await pool.query({
      text: 'SELECT nome_bairro as nome, poligono_json as poligono from bairros where id = $1',
      values: [id]
    })).rows[0]
  },

  getBairroAsGeoJson: async function (id) {
    const bairro = GeoJSON.parse(await this.findById(id), { Polygon: 'poligono' })
    bairro.geometry.coordinates = [bairro.geometry.coordinates]
    return bairro
  }
}