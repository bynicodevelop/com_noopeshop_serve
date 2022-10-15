const {info, error, warn} = require('firebase-functions/lib/logger');

const logger = {
  log: (msg, data) => info(msg, JSON.stringify(data || {})),
  warn: (msg, data) => warn(msg, JSON.stringify(data || {})),
  error: (msg, data) => error(msg, JSON.stringify(data || {})),
};

exports.logger = logger;
