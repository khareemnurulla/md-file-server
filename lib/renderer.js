const { marked } = require('marked');
const hljs = require('highlight.js');

class Renderer {
  constructor(options) {
    this.options = options;
    this.setupMarked();
  }

  setupMarked() {
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (error) {
            console.warn('Highlight.js error:', error);
          }
        }
        return hljs.highlightAuto(code).value;
      },
      langPrefix: 'hljs language-',
      breaks: false,
      gfm: true
    });
  }

  renderMarkdown(markdown, includeLiveReload = false) {
    const html = marked(markdown);
    const liveReloadScript = includeLiveReload ? 
      '<script src="/assets/client.js"></script>' : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <link rel="stylesheet" href="/assets/themes/${this.options.theme}.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css">
</head>
<body>
  <div class="markdown-body">
    ${html}
  </div>
  ${liveReloadScript}
</body>
</html>`;
  }

  renderDirectoryListing(files, currentPath) {
    const sortedFiles = files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    const fileListHtml = sortedFiles.map(file => {
      const icon = file.isDirectory ? '📁' : '📄';
      const href = currentPath.endsWith('/') 
        ? `${currentPath}${file.name}` 
        : `${currentPath}/${file.name}`;
      const sizeDisplay = file.isDirectory ? '-' : this.formatFileSize(file.size);
      const dateDisplay = new Date(file.modified).toLocaleString();

      return `
        <tr>
          <td><a href="${href}">${icon} ${file.name}</a></td>
          <td>${sizeDisplay}</td>
          <td>${dateDisplay}</td>
        </tr>
      `;
    }).join('');

    const parentLink = currentPath !== '/' ? 
      `<tr><td><a href="../">📁 ..</a></td><td>-</td><td>-</td></tr>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Directory Listing - ${currentPath}</title>
  <link rel="stylesheet" href="/assets/themes/${this.options.theme}.css">
  <style>
    .directory-listing {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      text-align: left;
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    a {
      text-decoration: none;
      color: #0969da;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="directory-listing">
    <h1>📁 Directory: ${currentPath}</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Modified</th>
        </tr>
      </thead>
      <tbody>
        ${parentLink}
        ${fileListHtml}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}

module.exports = Renderer;