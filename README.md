# MD File Server

A simple HTTP server that serves Markdown files as HTML with live rendering and syntax highlighting.

## Features

- 📝 Serves Markdown files as rendered HTML
- 🚀 Simple setup and configuration
- 🎨 Syntax highlighting for code blocks
- 📱 Responsive design
- ⚡ Fast and lightweight
- 🔄 Live reload during development

## Installation

```bash
npm install md-file-server
```

## Usage

### Command Line

```bash
# Serve current directory
npx md-file-server

# Serve specific directory
npx md-file-server ./docs

# Custom port
npx md-file-server -p 8080

# Custom host
npx md-file-server -h 0.0.0.0
```

### Programmatic Usage

```javascript
const { createServer } = require('md-file-server');

const server = createServer({
  port: 3000,
  host: 'localhost',
  directory: './docs'
});

server.start();
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `-p, --port` | `3000` | Port to listen on |
| `-h, --host` | `localhost` | Host to bind to |
| `-d, --directory` | `.` | Directory to serve |
| `--theme` | `github` | CSS theme for rendered HTML |
| `--no-live-reload` | `false` | Disable live reload |

## API

### `createServer(options)`

Creates a new MD file server instance.

**Options:**
- `port` (number): Server port
- `host` (string): Server host
- `directory` (string): Directory to serve
- `theme` (string): CSS theme
- `liveReload` (boolean): Enable live reload

**Returns:** Server instance with `start()` and `stop()` methods.

## Supported File Types

- `.md` - Markdown files (rendered as HTML)
- `.markdown` - Markdown files (rendered as HTML)
- All other files are served as static assets

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/md-file-server.git
cd md-file-server

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

Made with ❤️ for the Markdown community