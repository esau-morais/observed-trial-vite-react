import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const appPort = Number(process.env.PORT ?? 4173);
const apiPort = Number(process.env.API_PORT ?? 4010);

const books = JSON.parse(
  await readFile(new URL('./api/books.json', import.meta.url), 'utf8'),
);

function handleApi(request, response) {
  const url = new URL(request.url, 'http://127.0.0.1');
  response.setHeader('Access-Control-Allow-Origin', '*');
  if (request.method === 'GET' && url.pathname === '/api/books') {
    const shelf = url.searchParams.get('shelf');
    const result = books.filter((book) => !shelf || book.shelf === shelf);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ books: result }));
    return true;
  }
  return false;
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const distRoot = path.join(path.dirname(new URL(import.meta.url).pathname), 'dist');

const app = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (url.pathname === '/api/books' || url.pathname.startsWith('/api/books')) {
    if (handleApi(request, response)) return;
  }
  if (request.method !== 'GET') {
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.end('method not allowed');
    return;
  }
  try {
    let filename;
    if (url.pathname === '/') {
      filename = path.join(distRoot, 'index.html');
    } else {
      const rel = url.pathname.slice(1);
      filename = path.resolve(distRoot, rel);
      if (!filename.startsWith(distRoot + path.sep) && filename !== distRoot) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('not found');
        return;
      }
    }
    const bytes = await readFile(filename);
    const ext = path.extname(filename);
    response.writeHead(200, { 'Content-Type': mime[ext] ?? 'application/octet-stream' });
    response.end(bytes);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('not found');
  }
});

const api = createServer((request, response) => {
  if (handleApi(request, response)) return;
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'not found' }));
});

await new Promise((resolve) => api.listen(apiPort, '127.0.0.1', resolve));
console.log(`API listening on http://127.0.0.1:${apiPort}`);
await new Promise((resolve) => app.listen(appPort, '127.0.0.1', resolve));
console.log(`App listening on http://127.0.0.1:${appPort}`);
