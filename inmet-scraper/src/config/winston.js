const winston = require('winston')
const moment = require('moment')

module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format(info => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return stack ? `[${timestamp}] ${level}: ${message} \n ${stack}` : `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [
    new (winston.transports.File)({ filename: moment().format('DD-MM-YYYY').toString() + '_log.log', level: 'info'}),
    new (winston.transports.Console)
  ]
})