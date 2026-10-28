import http from 'node:http';

export const products = new Map([
  ['p-100', { id: 'p-100', name: 'Mechanical Keyboard', price: 89.99, available: true }],
]);

export function createCatalogServer() {
  return http.createServer((request, response) => {
    const match = request.url?.match(/^\/products\/([^/?]+)$/);
    if (request.method !== 'GET' || !match) {
      response.writeHead(404, { 'content-type': 'application/json' });
      return response.end(JSON.stringify({ error: 'not_found' }));
    }

    const product = products.get(match[1]);
    if (!product) {
      response.writeHead(404, { 'content-type': 'application/json' });
      return response.end(JSON.stringify({ error: 'product_not_found' }));
    }

    response.writeHead(200, { 'content-type': 'application/json' });
    return response.end(JSON.stringify(product));
  });
}

export async function startCatalogServer(port = 0) {
  const server = createCatalogServer();
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  const address = server.address();
  return {
    server,
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}`) {
  const instance = await startCatalogServer(Number(process.env.PORT ?? 3001));
  console.log(`catalog-provider listening at ${instance.url}`);
}
