# Example Markdown Document

This is a test markdown file to demonstrate the **MD File Server** functionality.

## Features

- ✅ Markdown rendering with syntax highlighting
- ✅ Live reload functionality
- ✅ Directory listing
- ✅ GitHub-style theme
- ✅ CLI and programmatic API

## Code Example

Here's a JavaScript code snippet:

```javascript
const { createServer } = require('md-file-server');

const server = createServer({
  port: 3000,
  host: 'localhost',
  directory: './docs',
  theme: 'github',
  liveReload: true
});

server.start().then(() => {
  console.log('Server started successfully!');
});
```

## Python Example

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## Lists

### Ordered List
1. First item
2. Second item
3. Third item

### Unordered List
- Item A
- Item B
- Item C

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown rendering | ✅ | With syntax highlighting |
| Live reload | ✅ | Using Server-Sent Events |
| Themes | ✅ | GitHub theme included |
| CLI | ✅ | Full command-line interface |

## Blockquote

> This is a blockquote example. It demonstrates how quoted text appears in the rendered output.

## Links and Images

Visit [GitHub](https://github.com) for more information.

---

*This document was created to test the MD File Server functionality.*