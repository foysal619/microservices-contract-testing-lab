import path from 'node:path';
import test from 'node:test';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { fetchProduct } from '../../services/orders/client.mjs';

const { boolean, decimal, like, string } = MatchersV3;
const provider = new PactV3({
  consumer: 'orders-consumer',
  provider: 'catalog-provider',
  dir: path.resolve('pacts'),
  logLevel: 'warn',
});

test('consumer contract: product is available for ordering', async () => {
  provider
    .given('product p-100 exists')
    .uponReceiving('a request for product p-100')
    .withRequest({ method: 'GET', path: '/products/p-100', headers: { accept: 'application/json' } })
    .willRespondWith({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        id: string('p-100'),
        name: like('Mechanical Keyboard'),
        price: decimal(89.99),
        available: boolean(true),
      },
    });

  await provider.executeTest(async (mockServer) => {
    await fetchProduct(mockServer.url, 'p-100');
  });
});
