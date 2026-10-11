import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import {
  CATEGORIES,
  filterProducts,
  formatCOP,
  LOW_STOCK_THRESHOLD,
  NAME_MAX_LENGTH,
  toProductView,
  validateProduct,
} from '../domain/product';
import type { ProductInput } from '../domain/product';

/**
 * Pruebas unitarias de EJEMPLO (ya vienen dadas) para que `npm test` corra desde el inicio.
 * Muestran el estilo esperado: describe / it / expect, sin red ni pantallas.
 */
describe('datos semilla de la API (ejemplo)', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);
    expect(seedProducts.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(item.category);
      expect(Number.isInteger(item.stock)).toBe(true);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades para probar las etiquetas', () => {
    expect(seedProducts.some((item) => item.stock === 0)).toBe(true);
    expect(seedProducts.some((item) => item.stock > 0 && item.stock < LOW_STOCK_THRESHOLD)).toBe(true);
  });
});

describe('formatCOP (ejemplo)', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

const validInput: ProductInput = { name: 'Café molido 250 g', price: 9800, category: 'Hogar', stock: 12 };

describe('validateProduct', () => {
  it('acepta un producto válido sin errores', () => {
    expect(validateProduct(validInput)).toEqual({ isValid: true, errors: {} });
  });

  it('rechaza un nombre vacío, un precio menor o igual que 0 y una categoría no permitida', () => {
    const result = validateProduct({ name: '   ', price: 0, category: 'Otra', stock: 1 });

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['category', 'name', 'price']);
  });

  it('limita el nombre a 60 caracteres', () => {
    expect(validateProduct({ ...validInput, name: 'x'.repeat(NAME_MAX_LENGTH) }).isValid).toBe(true);
    expect(validateProduct({ ...validInput, name: 'x'.repeat(NAME_MAX_LENGTH + 1) }).errors.name).toBeDefined();
  });

  it('exige un stock entero mayor o igual que 0 y un precio numérico', () => {
    expect(validateProduct({ ...validInput, stock: 0 }).isValid).toBe(true);
    expect(validateProduct({ ...validInput, stock: -1 }).errors.stock).toBeDefined();
    expect(validateProduct({ ...validInput, stock: 2.5 }).errors.stock).toBeDefined();
    expect(validateProduct({ ...validInput, price: Number.NaN }).errors.price).toBeDefined();
  });
});

describe('toProductView', () => {
  const product = { id: 7, name: '  Set de ollas ', price: 1250000, category: 'Hogar', stock: 6 };

  it('formatea el precio en pesos y recorta el nombre', () => {
    const view = toProductView(product);

    expect(view.priceLabel).toBe('$ 1.250.000');
    expect(view.name).toBe('Set de ollas');
    expect(view).toMatchObject({ id: 7, category: 'Hogar', stock: 6 });
  });

  it('marca «Agotado» con stock 0 y «Pocas unidades» por debajo del umbral', () => {
    const outOfStock = toProductView({ ...product, stock: 0 });
    expect(outOfStock).toMatchObject({ stockLabel: 'Agotado', isOutOfStock: true, isLowStock: false });

    const lastUnits = toProductView({ ...product, stock: LOW_STOCK_THRESHOLD - 1 });
    expect(lastUnits).toMatchObject({ stockLabel: 'Pocas unidades', isOutOfStock: false, isLowStock: true });
  });

  it('marca «Disponible» desde el umbral en adelante', () => {
    const view = toProductView({ ...product, stock: LOW_STOCK_THRESHOLD });

    expect(view).toMatchObject({ stockLabel: 'Disponible', isOutOfStock: false, isLowStock: false });
  });
});

describe('filterProducts', () => {
  const names = (list: { name: string }[]) => list.map((item) => item.name);

  it('filtra por texto sin distinguir mayúsculas', () => {
    const result = filterProducts(seedProducts, { search: 'GASEOSA', category: '' });

    expect(names(result)).toEqual(['Gaseosa cola 1,5 L']);
  });

  it('filtra por categoría exacta y la combina con el texto', () => {
    const snacks = filterProducts(seedProducts, { search: '', category: 'Snacks' });
    expect(snacks.map((item) => item.id)).toEqual([4, 5]);

    expect(filterProducts(seedProducts, { search: '', category: 'snacks' })).toEqual([]);

    const combined = filterProducts(seedProducts, { search: 'papas', category: 'Snacks' });
    expect(combined.map((item) => item.id)).toEqual([4]);
  });

  it('no filtra con texto vacío o de espacios, y devuelve un arreglo nuevo', () => {
    const result = filterProducts(seedProducts, { search: '   ', category: '' });

    expect(result).toEqual(seedProducts);
    expect(result).not.toBe(seedProducts);
  });
});
