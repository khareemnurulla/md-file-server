const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const Renderer = require('./renderer');
const Watcher = require('./watcher');

class Server {
  constructor(options) {
    this.options = options;
    this.app = express();
    this.server = null;
    this.renderer = new Renderer(options);
    this.watcher = options.liveReload ? new Watcher(options.directory) : null;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
  }

  setupRoutes() {
    // Server-Sent Events endpoint for live reload
    this.app.get('/events', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      if (this.watcher) {
        this.watcher.addClient(res);
      }

      req.on('close', () => {
        if (this.watcher) {
          this.watcher.removeClient(res);
        }
      });
    });

    this.app.use(async (req, res) => {
      try {
        const requestPath = decodeURIComponent(req.path);
        const safePath = this.sanitizePath(requestPath);
        const fullPath = path.join(path.resolve(this.options.directory), safePath);
        
        if (!this.isPathSafe(fullPath)) {
          return res.status(403).send('Access denied');
        }

        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.serveDirectory(res, fullPath, requestPath);
        } else if (this.isMarkdownFile(fullPath)) {
          await this.serveMarkdownFile(res, fullPath);
        } else {
          await this.serveStaticFile(res, fullPath);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          return res.status(404).send('File not found');
        }
        console.error('Server error:', error);
        res.status(500).send('Internal server error');
      }
    });
  }

  sanitizePath(requestPath) {
    return path.normalize(requestPath).replace(/^(\.\.[\/\\])+/, '');
  }

  isPathSafe(fullPath) {
    const resolvedBase = path.resolve(this.options.directory);
    const resolvedPath = path.resolve(fullPath);
    return resolvedPath.startsWith(resolvedBase);
  }

  isMarkdownFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.md' || ext === '.markdown';
  }

  async serveDirectory(res, dirPath, requestPath) {
    const files = await fs.readdir(dirPath);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        };
      })
    );

    const html = this.renderer.renderDirectoryListing(fileStats, requestPath);
    res.send(html);
  }

  async serveMarkdownFile(res, filePath) {
    const markdown = await fs.readFile(filePath, 'utf8');
    const html = this.renderer.renderMarkdown(markdown, this.options.liveReload);
    res.send(html);
  }

  async serveStaticFile(res, filePath) {
    res.sendFile(filePath);
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.options.port, this.options.host, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`MD File Server running at http://${this.options.host}:${this.options.port}`);
          console.log(`Serving directory: ${path.resolve(this.options.directory)}`);
          
          if (this.watcher) {
            this.watcher.start();
          }
          
          resolve();
        }
      });
    });
  }

  async stop() {
    return new Promise((resolve) => {
      if (this.watcher) {
        this.watcher.stop();
      }
      
      if (this.server) {
        this.server.close(() => {
          console.log('Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Server;