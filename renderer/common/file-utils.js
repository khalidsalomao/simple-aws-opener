const fs = require('fs');
const logger = require('./logger');

function loadDelimitedFile(file, delimiter) {
  if (!file || !fs.existsSync(file)) {
    throw new Error(`File not found: ${file || '<empty filename>'}`);
  }
  logger.debug(`loading file ${file}...`);
  const content = fs.readFileSync(file, {
    encoding: 'utf-8'
  });

  logger.debug(`parsing file ${file}...`);
  const parsed = papa.parse(content, {
    header: true,
    delimiter: delimiter || '',
    dynamicTyping: false,
    skipEmptyLines: true
  });

  if (parsed.meta) {
    logger.debug(`file parsed: ${JSON.stringify(parsed.meta)}`);
  }

  if (parsed.errors && parsed.errors.length) {
    parsed.errors.forEach(e => logger.error(e));
    throw new Error('Errors detected, exiting...');
  }

  if (!parsed.data || !parsed.data.length) {
    throw new Error('Empty dataset, exiting...');
  }

  logger.debug(`${parsed.data.length} records parsed`);
  return parsed;
}

const files = {};

function writeDelimitedFile(file, record, delimiter) {
  if (!record) {
    return;
  }

  const records = Array.isArray(record) ? record : [record];
  const lines = (files[file] || 0);
  files[file] = lines + records.length;

  const config = {
    delimiter: delimiter || '\t',
    header: lines === 0
  };

  if (lines === 0 && fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  fs.appendFileSync(file, papa.unparse(records, config));
  fs.appendFileSync(file, '\n');
}

module.exports = {
  loadDelimitedFile,
  writeDelimitedFile,
  getAvgTiming,
  addStat,
  startTracing,
  stopTracing,
};
