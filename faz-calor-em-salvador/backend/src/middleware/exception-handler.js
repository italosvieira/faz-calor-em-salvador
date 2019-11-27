const logger = require('../config/winston')
const BusinessException = require('../exceptions/business-exception')

module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      logger.error(error)

      if (error instanceof BusinessException) {
        ctx.status = error.httpStatusCode
        ctx.body = createResponse(ctx.originalUrl, ctx.method, error.httpStatusCode, error.clientMessage)
      } else {
        ctx.status = 500
        ctx.body = createResponse(ctx.originalUrl, ctx.method, 500, 'A unexpected error has occurred.')
      }
    }
  }
}

function createResponse (path, method, statusCode, errorMessage) {
  return {
    timestamp: new Date().toISOString(),
    path: path,
    method: method,
    statusCode: statusCode,
    error: errorMessage
  }
}