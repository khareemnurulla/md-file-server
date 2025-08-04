const Server = require('./lib/server');

function createServer(options = {}) {
  const defaultOptions = {
    port: 3000,
    host: 'localhost',
    directory: '.',
    theme: 'github',
    liveReload: true
  };

  const config = { ...defaultOptions, ...options };
  return new Server(config);
}

module.exports = { createServer };