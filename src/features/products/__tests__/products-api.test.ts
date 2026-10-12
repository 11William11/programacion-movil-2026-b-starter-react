// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

/**
 * Prueba de la API de EJEMPLO (ya viene dada). Patrón que se espera en las pruebas de la API:
 *  1. `startTestServer()` levanta la API en un puerto libre antes de cada prueba.
 *  2. `fetch` (el de Node, sin dependencias extra) llama a la API como lo haría la app.
 *  3. Se comprueba el código de estado y el cuerpo.
 *  4. `close()` cierra el servidor al terminar.
 */
let baseUrl = '';
let close: () => Promise<void>;

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

describe('API de productos (ejemplo)', () => {
  it('arranca y responde 404 con el formato de error en una ruta desconocida', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: expect.any(String), details: expect.any(Array) });
  });
});

/** Envía un cuerpo JSON a la API (POST y PUT). */
function sendJson(method: 'POST' | 'PUT', path: string, body: unknown): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validProduct = { name: 'Café molido 250 g', price: 9800, category: 'Hogar', stock: 12 };

describe('GET /api/products', () => {
  it('filtra por texto sin distinguir mayúsculas y por categoría exacta', async () => {
    const byText = await (await fetch(`${baseUrl}/api/products?search=AGUA`)).json();
    expect(byText.map((item: { id: number }) => item.id)).toEqual([1]);

    const byCategory = await (await fetch(`${baseUrl}/api/products?category=Snacks`)).json();
    expect(byCategory.map((item: { id: number }) => item.id)).toEqual([4, 5]);

    const exactOnly = await (await fetch(`${baseUrl}/api/products?category=snacks`)).json();
    expect(exactOnly).toEqual([]);
  });
});

describe('POST /api/products', () => {
  it('responde 400 con { error, details } cuando los datos no validan', async () => {
    const response = await sendJson('POST', '/api/products', {
      name: '   ',
      price: 0,
      category: 'Otra',
      stock: -1,
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Datos inválidos');
    expect(body.details).toHaveLength(4); // un mensaje por cada campo inválido
  });

  it('responde 201 con el producto creado y un id incremental', async () => {
    const response = await sendJson('POST', '/api/products', validProduct);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ id: 9, ...validProduct });
  });
});

describe('GET /api/products/:id', () => {
  it('responde 404 cuando el producto no existe', async () => {
    const response = await fetch(`${baseUrl}/api/products/999`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: 'Producto no encontrado', details: expect.any(Array) });
  });

  it('responde 400 cuando el id no es numérico', async () => {
    const response = await fetch(`${baseUrl}/api/products/abc`);

    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/products/:id', () => {
  it('responde 204 sin cuerpo y el producto deja de existir', async () => {
    const deleted = await fetch(`${baseUrl}/api/products/1`, { method: 'DELETE' });
    expect(deleted.status).toBe(204);
    expect(await deleted.text()).toBe('');

    const afterwards = await fetch(`${baseUrl}/api/products/1`);
    expect(afterwards.status).toBe(404);
  });
});
