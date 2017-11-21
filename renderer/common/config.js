const dotenv = require('dotenv');

// load configuration
const result = dotenv.config();

if (result.error) {
  const logger = require('./logger'); // eslint-disable-line global-require
  if (result.error.message.indexOf('ENOENT') < 0) {
    logger.warn('Initialization error: dotenv file not loaded', result.error);
  }
}
