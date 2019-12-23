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
      return stack ? `[${moment(timestamp).format('DD/MM/YYYY HH:mm:ss')}] ${level}: ${message} \n ${stack}`
        : `[${moment(timestamp).format('DD/MM/YYYY HH:mm:ss')}] ${level}: ${message}`
    })
  ),
  transports: [new winston.transports.Console()]
})