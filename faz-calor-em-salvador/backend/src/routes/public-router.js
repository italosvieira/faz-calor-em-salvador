const KoaRouter = require('koa-router')

const service = require('../services/mapa-service')
const router = new KoaRouter({ prefix: '/api/public/filtro' })

router.post('/', service.post)
router.get('/', service.get)
router.get('/:bairroId/dias', service.getDias)
router.get('/:bairroId/intervalos', service.getIntervalos)

module.exports = router