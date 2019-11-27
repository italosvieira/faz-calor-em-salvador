const KoaRouter = require('koa-router')

const service = require('../services/mapa-service')
const router = new KoaRouter({ prefix: '/api/public' })

router.get('/filtro', service.get)
router.post('/filtro', service.post)

module.exports = router