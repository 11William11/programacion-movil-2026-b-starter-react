/**
 * Servicio de datos de productos (YA ESTÁ DADO: no es necesario modificarlo).
 *
 * Lee `src/data/products.json` y simula una API:
 *  - Latencia de 400 ms en cada llamada.
 *  - Falla de red simulada (estado de ERROR en la interfaz) cuando:
 *      · la URL trae `?error=1`, o
 *      · la variable `VITE_SIMULATE_ERROR=true` está en su `.env`.
 *  - Lista vacía simulada (estado VACÍO en la interfaz) cuando la URL trae `?empty=1`.
 *
 * Las funciones devuelven promesas; la interfaz debe manejar las tres
 * situaciones: cargando, vacío y error.
 */
import productsJson from '../../../data/products.json';
import type { Product, ProductInput } from '../model/product';

export type ProductsServiceErrorCode = 'NETWORK' | 'NOT_FOUND';

/** Error de dominio: la interfaz decide el mensaje según `code`. */
export class ProductsServiceError extends Error {
  readonly code: ProductsServiceErrorCode;

  constructor(code: ProductsServiceErrorCode, message: string) {
    super(message);
    this.name = 'ProductsServiceError';
    this.code = code;
  }
}

export interface ProductsServiceConfig {
  latencyMs: number;
  /** null = decidir por URL / variable de entorno; true/false = forzar. */
  forceError: boolean | null;
  forceEmpty: boolean | null;
}

const DEFAULT_LATENCY_MS = 400;

let config: ProductsServiceConfig = {
  latencyMs: DEFAULT_LATENCY_MS,
  forceError: null,
  forceEmpty: null,
};

/** Copia en memoria: `createProduct` agrega aquí (no persiste al recargar). */
let products: Product[] = productsJson.map((item) => ({ ...item }));

/** Cambia la configuración del servicio (útil en las pruebas). */
export function configureProductsService(next: Partial<ProductsServiceConfig>): void {
  config = { ...config, ...next };
}

/** Restaura datos y configuración originales (útil en las pruebas). */
export function resetProductsService(): void {
  config = { latencyMs: DEFAULT_LATENCY_MS, forceError: null, forceEmpty: null };
  products = productsJson.map((item) => ({ ...item }));
}

function hasUrlFlag(name: string): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(name) === '1';
}

function shouldSimulateError(): boolean {
  if (config.forceError !== null) return config.forceError;
  return hasUrlFlag('error') || import.meta.env.VITE_SIMULATE_ERROR === 'true';
}

function shouldReturnEmpty(): boolean {
  if (config.forceEmpty !== null) return config.forceEmpty;
  return hasUrlFlag('empty');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateNetwork(): Promise<void> {
  await wait(config.latencyMs);
  if (shouldSimulateError()) {
    throw new ProductsServiceError('NETWORK', 'No fue posible conectar con el servidor.');
  }
}

/** Lista de productos. */
export async function getProducts(): Promise<Product[]> {
  await simulateNetwork();
  if (shouldReturnEmpty()) return [];
  return products.map((item) => ({ ...item }));
}

/** Un producto por id. Falla con `NOT_FOUND` si no existe. */
export async function getProduct(id: number): Promise<Product> {
  await simulateNetwork();
  const found = products.find((item) => item.id === id);
  if (!found) {
    throw new ProductsServiceError('NOT_FOUND', `No existe el producto ${id}.`);
  }
  return { ...found };
}

/** Crea un producto (se asigna el siguiente id). No valida: valide antes de llamar. */
export async function createProduct(input: ProductInput): Promise<Product> {
  await simulateNetwork();
  const nextId = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const created: Product = { id: nextId, ...input };
  products = [...products, created];
  return { ...created };
}
