const chokidar = require('chokidar');
const EventEmitter = require('events');

class Watcher extends EventEmitter {
  constructor(directory) {
    super();
    this.directory = directory;
    this.watcher = null;
    this.clients = new Set();
  }

  start() {
    this.watcher = chokidar.watch(this.directory, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('change', (path) => {
        console.log(`File changed: ${path}`);
        this.notifyClients('reload');
      })
      .on('add', (path) => {
        console.log(`File added: ${path}`);
        this.notifyClients('reload');
      })
      .on('unlink', (path) => {
        console.log(`File removed: ${path}`);
        this.notifyClients('reload');
      });

    console.log(`Watching for changes in: ${this.directory}`);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    this.clients.clear();
  }

  addClient(client) {
    this.clients.add(client);
    
    client.on('close', () => {
      this.clients.delete(client);
    });

    client.on('error', () => {
      this.clients.delete(client);
    });

    // Send initial connection message
    this.sendToClient(client, { type: 'connected' });
  }

  removeClient(client) {
    this.clients.delete(client);
  }

  sendToClient(client, data) {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.warn('Failed to send message to client:', error);
      this.clients.delete(client);
    }
  }

  notifyClients(event, data = {}) {
    const eventData = { type: event, ...data };
    
    this.clients.forEach(client => {
      this.sendToClient(client, eventData);
    });
  }
}

module.exports = Watcher;