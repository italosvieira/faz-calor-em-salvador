const Koa = require('koa')
const koaCors = require('@koa/cors')
const koaHelmet = require('koa-helmet')
const koaBodyParser = require('koa-bodyparser')
const KoaResponseTime = require('koa-response-time')
const KoaLogger = require('koa-logger')

const ExceptionHandler = require('./middleware/exceptionHandler')
const Database = require('./config/database')

const logger = require('./config/winston')
const publicRoutes = require('./routes/publicRouter')

async function start () {
  await Database()

  const app = new Koa()
  app.use(KoaResponseTime())
  app.use(koaBodyParser())
  app.use(KoaLogger((str) => { logger.info(str) }))
  app.use(koaCors())
  app.use(koaHelmet())
  app.use(ExceptionHandler())
  app.use(publicRoutes.routes())
  app.use(publicRoutes.allowedMethods())
  app.listen(process.env.NODE_PORT || 3000, () => logger.info(`Aplicação escutando na porta ${process.env.NODE_PORT || 3000}.`))
}

start()