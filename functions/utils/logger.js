const logger = {
  log: (msg, data) => console.log(msg, JSON.stringify(data)),
  error: (msg, data) => console.error(msg, JSON.stringify(data)),
  warn: (msg, data) => console.warn(msg, JSON.stringify(data)),
};

exports.logger = logger;
