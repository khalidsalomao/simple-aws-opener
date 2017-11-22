const winston = require('winston');

winston.configure({
  transports: [
    new (winston.transports.Console)({
      level: process.env.LOGLEVEL || 'debug',
      colorize: true,
      timestamp: true,
      showLevel: true,
      humanReadableUnhandledException: true
    }),
    new (winston.transports.File)({
      level: process.env.LOGLEVELFILE || process.env.LOGLEVEL || 'info',
      maxFiles: 3,
      maxsize: 1024 * 1024,
      maxRetries: 3,
      zippedArchive: true,
      json: false,
      filename: `${process.env.npm_package_name || 'logfile'}.log`,
      humanReadableUnhandledException: true
    })
  ]
});

module.exports = winston;
