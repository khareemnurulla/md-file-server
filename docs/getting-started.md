# Getting Started with MD File Server

Welcome to MD File Server! This guide will help you get up and running quickly.

## Installation

### From npm

Install globally with npm:

```bash
npm install -g md-file-server
```

Or use locally in your project:

```bash
npm install md-file-server
```

### From GitHub

Run directly from GitHub without cloning:

```bash
npx git+https://github.com/khareemnurulla/md-file-server.git
```

Or install from GitHub:

```bash
npm install git+https://github.com/khareemnurulla/md-file-server.git
```

## Quick Start

### Command Line Usage

#### If installed from npm:

Start the server in the current directory:

```bash
md-file-server
```

Start with custom options:

```bash
md-file-server docs --port 8080 --host 0.0.0.0
```

#### If using from GitHub:

Run directly without installing:

```bash
npx git+https://github.com/khareemnurulla/md-file-server.git
```

Start with custom options:

```bash
npx git+https://github.com/khareemnurulla/md-file-server.git docs --port 8080 --host 0.0.0.0
```

### Programmatic Usage

```javascript
const { createServer } = require('md-file-server');

const server = createServer({
  port: 3000,
  directory: './my-docs',
  theme: 'github',
  liveReload: true
});

await server.start();
```

## Configuration Options

| Option | CLI Flag | Default | Description |
|--------|----------|---------|-------------|
| port | `-p, --port` | 3000 | Server port |
| host | `-h, --host` | localhost | Server host |
| directory | `-d, --directory` | . | Directory to serve |
| theme | `--theme` | github | CSS theme |
| liveReload | `--no-live-reload` | true | Enable live reload |

## Features

### 🚀 Fast Rendering
Powered by `marked` for fast markdown parsing and `highlight.js` for syntax highlighting.

### 🔄 Live Reload
Automatically refreshes the browser when files change (can be disabled).

### 📁 Directory Browsing
Navigate through directories with a clean, intuitive interface.

### 🎨 Themes
Customize the appearance with CSS themes.

### 🛡️ Security
Built-in path traversal protection and input sanitization.

## Next Steps

- Create your markdown files
- Organize them in directories
- Start the server and begin writing!

Happy documenting! 📝