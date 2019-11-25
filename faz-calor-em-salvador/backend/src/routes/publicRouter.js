const KoaRouter = require('koa-router')

const service = require('../services/mapaService')
const router = new KoaRouter({ prefix: '/api/public' })

router.get('/filtro', service.get)
router.post('/filtro', service.post)

module.exports = router