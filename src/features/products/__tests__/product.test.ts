import { afterEach, describe, expect, it } from 'vitest';
import {
  configureProductsService,
  getProduct,
  getProducts,
  ProductsServiceError,
  resetProductsService,
} from '../data/products-service';

/**
 * Prueba de ejemplo (ya viene dada) para que `npm test` corra desde el inicio.
 * Muestra el estilo esperado: describe / it / expect, un caso feliz y un caso de error.
 */
describe('products-service (ejemplo)', () => {
  afterEach(() => {
    resetProductsService();
  });

  it('entrega los 8 productos del JSON con todos sus campos', async () => {
    configureProductsService({ latencyMs: 0 });

    const products = await getProducts();

    expect(products).toHaveLength(8);
    expect(products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
        stock: expect.any(Number),
      }),
    );
  });

  it('falla con el código NETWORK cuando se simula el error', async () => {
    configureProductsService({ latencyMs: 0, forceError: true });

    await expect(getProducts()).rejects.toBeInstanceOf(ProductsServiceError);
    await expect(getProduct(1)).rejects.toMatchObject({ code: 'NETWORK' });
  });
});

/**
 * TODO(Parte 3): agregue sus pruebas aquí (o en archivos nuevos dentro de __tests__/).
 * Mínimo dos: una de `validateProduct` y una de `toProductView`.
 * Quite el `.todo` cuando escriba el cuerpo de cada una.
 */
describe('validateProduct', () => {
  it.todo('rechaza un nombre vacío y un precio menor o igual que 0');
});

describe('toProductView', () => {
  it.todo('formatea el precio y marca las existencias bajas');
});
