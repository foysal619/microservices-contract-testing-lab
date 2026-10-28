export async function fetchProduct(baseUrl, productId, fetchImpl = fetch) {
  const response = await fetchImpl(`${baseUrl}/products/${encodeURIComponent(productId)}`, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
  const product = await response.json();
  if (!product.id || typeof product.price !== 'number') throw new Error('Catalog contract is invalid');
  return product;
}
