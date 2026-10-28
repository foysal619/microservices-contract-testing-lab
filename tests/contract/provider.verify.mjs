import path from 'node:path';
import { Verifier } from '@pact-foundation/pact';
import { products, startCatalogServer } from '../../services/catalog/server.mjs';

const provider = await startCatalogServer();

try {
  await new Verifier({
    provider: 'catalog-provider',
    providerBaseUrl: provider.url,
    pactUrls: [path.resolve('pacts/orders-consumer-catalog-provider.json')],
    stateHandlers: {
      'product p-100 exists': async () => {
        products.set('p-100', { id: 'p-100', name: 'Mechanical Keyboard', price: 89.99, available: true });
      },
    },
    logLevel: 'warn',
  }).verifyProvider();
} finally {
  await provider.close();
}
