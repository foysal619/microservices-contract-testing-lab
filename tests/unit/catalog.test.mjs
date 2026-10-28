import assert from 'node:assert/strict';
import test from 'node:test';
import { startCatalogServer } from '../../services/catalog/server.mjs';
import { fetchProduct } from '../../services/orders/client.mjs';

test('orders client reads a product from the real catalog provider', async (t) => {
  const provider = await startCatalogServer();
  t.after(() => provider.close());
  const product = await fetchProduct(provider.url, 'p-100');
  assert.equal(product.name, 'Mechanical Keyboard');
  assert.equal(product.available, true);
});

test('orders client reports missing products', async (t) => {
  const provider = await startCatalogServer();
  t.after(() => provider.close());
  await assert.rejects(() => fetchProduct(provider.url, 'missing'), /404/);
});
