const { createServer } = require('../index');
const Server = require('../lib/server');

jest.mock('../lib/server', () => {
  return jest.fn().mockImplementation((options) => {
    return { options };
  });
});

describe('createServer', () => {
  it('should return an instance of Server (mocked)', () => {
    const server = createServer();
    expect(Server).toHaveBeenCalled();
    expect(server).toBeDefined();
  });

  it('should use default options when no options are provided', () => {
    const server = createServer();
    expect(server.options).toEqual({
      port: 3000,
      host: 'localhost',
      directory: '.',
      theme: 'github',
      liveReload: true
    });
  });

  it('should merge provided options with defaults', () => {
    const customOptions = {
      port: 8080,
      theme: 'dracula'
    };
    const server = createServer(customOptions);
    expect(server.options).toEqual({
      port: 8080,
      host: 'localhost',
      directory: '.',
      theme: 'dracula',
      liveReload: true
    });
  });

  it('should override all defaults if all options are provided', () => {
    const customOptions = {
      port: 4000,
      host: '0.0.0.0',
      directory: './docs',
      theme: 'solarized',
      liveReload: false
    };
    const server = createServer(customOptions);
    expect(server.options).toEqual(customOptions);
  });
});
