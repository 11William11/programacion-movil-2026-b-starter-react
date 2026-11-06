/**
 * API de productos (Express).
 *
 * `createApp()` construye y devuelve la aplicación SIN ponerla a escuchar:
 *  - `server/index.js` la pone a escuchar en el puerto 3000 (`npm run server`);
 *  - las pruebas la levantan con `app.listen(0)` (puerto libre) y llaman con `fetch`
 *    (ver el helper `startTestServer()` en src/features/products/__tests__/test-server.ts).
 *
 * Contrato (el detalle se documenta en docs/api/products-endpoints.md, Parte 1):
 *   GET    /api/products?search=&category=   200 + arreglo
 *   GET    /api/products/:id                 200 | 400 | 404
 *   POST   /api/products                     201 | 400
 *   PUT    /api/products/:id                 200 | 400 | 404
 *   DELETE /api/products/:id                 204 | 400 | 404
 * Formato de error uniforme: { "error": "mensaje", "details": ["..."] }
 *
 * QUÉ YA VIENE HECHO (no se pide escribirlo, pero sí entenderlo y explicarlo en el ADR-002
 * y en la sección «API error handling» del README):
 *   - express.json(): convierte el cuerpo JSON en `req.body`.
 *   - cors(): permite que la app (puerto 5173) llame a la API (puerto 3000).
 *   - parseId(): convierte el parámetro `:id` en número, o devuelve null si no es numérico.
 *   - Manejador 404 (ruta desconocida) y manejador de errores central (500).
 *
 * QUÉ SE ESCRIBIÓ (Parte 2 del TODO.md): las cinco rutas de /api/products, con filtros,
 * validación del cuerpo (acumula un mensaje por problema en `details`) e ids incrementales.
 */
const express = require('express');
const cors = require('cors');
const seedProducts = require('./data/products.json');

// Categorías permitidas (la app usa la misma lista).
const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'];

// Longitud máxima del nombre (la app usa el mismo valor).
const NAME_MAX_LENGTH = 60;

/**
 * YA DADO. Convierte el texto de `:id` en número.
 * Devuelve null si no son solo dígitos ("abc", "1.5", "-2"): la ruta responde 400 en ese caso.
 */
function parseId(rawId) {
  return /^\d+$/.test(rawId) ? Number(rawId) : null;
}

/** Responde con el formato de error uniforme { error, details[] }. */
function sendError(res, status, error, details = []) {
  return res.status(status).json({ error, details });
}

/** 400 cuando `:id` no es numérico (parseId devolvió null). */
function sendInvalidId(res, rawId) {
  return sendError(res, 400, 'El id debe ser numérico', [`id recibido: ${rawId}`]);
}

/** 404 cuando no existe un producto con ese id. */
function sendProductNotFound(res, id) {
  return sendError(res, 404, 'Producto no encontrado', [`No existe un producto con id ${id}`]);
}

/**
 * Valida el cuerpo de POST y PUT y devuelve la lista de problemas (vacía si todo está bien),
 * con un mensaje por cada campo inválido. La app valida las mismas reglas con validateProduct().
 */
function validateProductBody(body) {
  const { name, price, category, stock } = body ?? {};
  const details = [];

  if (typeof name !== 'string' || name.trim() === '') {
    details.push('name es obligatorio');
  } else if (name.trim().length > NAME_MAX_LENGTH) {
    details.push(`name no puede superar ${NAME_MAX_LENGTH} caracteres`);
  }
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    details.push('price debe ser un número mayor que 0');
  }
  if (typeof category !== 'string' || !CATEGORIES.includes(category)) {
    details.push(`category es obligatoria y debe ser una de: ${CATEGORIES.join(', ')}`);
  }
  if (!Number.isInteger(stock) || stock < 0) {
    details.push('stock debe ser un entero mayor o igual que 0');
  }

  return details;
}

function createApp() {
  const app = express();

  // YA DADO: CORS para el origen de desarrollo de la app y lectura del cuerpo JSON.
  app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
  app.use(express.json());

  // Almacenamiento en memoria: copia de la semilla (se reinicia con el servidor).
  const products = seedProducts.map((item) => ({ ...item }));
  // Siguiente id: el mayor existente + 1. No se reutilizan los ids de productos eliminados.
  let nextId = products.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

  // GET /api/products?search=&category= → 200 con el arreglo (filtrado si vienen los parámetros).
  app.get('/api/products', (req, res) => {
    const { search, category } = req.query;
    let result = products;

    // `search`: el nombre contiene el texto, sin distinguir mayúsculas. Un texto vacío no filtra.
    if (typeof search === 'string' && search.trim() !== '') {
      const text = search.trim().toLowerCase();
      result = result.filter((product) => product.name.toLowerCase().includes(text));
    }
    // `category`: coincidencia exacta.
    if (typeof category === 'string' && category !== '') {
      result = result.filter((product) => product.category === category);
    }

    res.status(200).json(result);
  });

  // GET /api/products/:id → 200 con el producto | 400 (id no numérico) | 404 (no existe).
  app.get('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return sendInvalidId(res, req.params.id);

    const product = products.find((item) => item.id === id);
    if (!product) return sendProductNotFound(res, id);

    return res.status(200).json(product);
  });

  // POST /api/products → 201 con el producto creado | 400 con { error, details[] }.
  // El id lo asigna el servidor; si el cuerpo trae uno, se ignora.
  app.post('/api/products', (req, res) => {
    const details = validateProductBody(req.body);
    if (details.length > 0) return sendError(res, 400, 'Datos inválidos', details);

    const { name, price, category, stock } = req.body;
    const product = { id: nextId, name: name.trim(), price, category, stock };
    nextId += 1;
    products.push(product);

    return res.status(201).json(product);
  });

  // PUT /api/products/:id → 200 con el producto actualizado | 400 | 404.
  // Manda el id de la ruta: el `id` del cuerpo, si llega, se ignora.
  app.put('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return sendInvalidId(res, req.params.id);

    const product = products.find((item) => item.id === id);
    if (!product) return sendProductNotFound(res, id);

    const details = validateProductBody(req.body);
    if (details.length > 0) return sendError(res, 400, 'Datos inválidos', details);

    const { name, price, category, stock } = req.body;
    Object.assign(product, { name: name.trim(), price, category, stock });

    return res.status(200).json(product);
  });

  // DELETE /api/products/:id → 204 sin cuerpo | 400 | 404.
  app.delete('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return sendInvalidId(res, req.params.id);

    const index = products.findIndex((item) => item.id === id);
    if (index === -1) return sendProductNotFound(res, id);

    products.splice(index, 1);
    return res.status(204).end();
  });

  // YA DADO: ruta desconocida → 404 con el formato de error uniforme.
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada', details: [`${req.method} ${req.originalUrl}`] });
  });

  // YA DADO: manejador de errores central (se reconoce por tener CUATRO parámetros).
  // Express lo ejecuta cuando una ruta lanza una excepción o llama a next(error).
  // eslint-disable-next-line no-unused-vars -- Express exige los 4 parámetros para reconocerlo.
  app.use((err, _req, res, _next) => {
    if (err && err.type === 'entity.parse.failed') {
      // JSON malformado en el cuerpo: es un error de quien llama, no del servidor.
      return res.status(400).json({ error: 'El cuerpo no es un JSON válido', details: [] });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor', details: [] });
  });

  return app;
}

module.exports = { createApp, CATEGORIES, parseId };
