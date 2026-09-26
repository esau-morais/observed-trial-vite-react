import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.API_PORT ?? 4010);
const books = JSON.parse(
  await readFile(new URL('./books.json', import.meta.url), 'utf8'),
);

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  response.setHeader('Access-Control-Allow-Origin', '*');

  if (request.method === 'GET' && url.pathname === '/api/books') {
    const shelf = url.searchParams.get('shelf');
    const result = books.filter((book) => !shelf || book.shelf === shelf);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ books: result }));
    return;
  }

  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'not found' }));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`API listening on http://127.0.0.1:${port}`);
});
