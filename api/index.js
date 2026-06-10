const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();

// Path to original db.json (read-only in Vercel package)
const originalDbPath = path.join(__dirname, '../db.json');

// Path in /tmp (writable in Vercel serverless environment)
const writableDbPath = path.join('/tmp', 'db.json');

// Copy original db.json to /tmp if it doesn't exist
try {
  if (!fs.existsSync(writableDbPath)) {
    fs.writeFileSync(writableDbPath, fs.readFileSync(originalDbPath, 'utf-8'));
  }
} catch (error) {
  console.error('Failed to copy db.json to /tmp:', error);
}

// Use the writable file in /tmp if available, otherwise fall back to read-only original
const dbFile = fs.existsSync(writableDbPath) ? writableDbPath : originalDbPath;
const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom route rewrite rules to map /api/* to /*
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));

server.use(router);

module.exports = server;
