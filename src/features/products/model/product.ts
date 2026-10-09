/**
 * Modelo de dominio de la funcionalidad «Productos».
 *
 * Los tipos y las constantes ya vienen dados. Las dos funciones de abajo
 * (`toProductView` y `validateProduct`) son STUBS: usted las implementa
 * (Parte 2 y Parte 3 del TODO.md).
 */

/** Producto tal como lo entrega el servicio. */
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Datos que captura el formulario para crear un producto (aún sin id). */
export interface ProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Producto listo para mostrarse en la interfaz. */
export interface ProductView {
  id: number;
  name: string;
  /** Precio ya formateado, p. ej. "$8500.00". */
  priceLabel: string;
  category: string;
  /** true cuando quedan 1..LOW_STOCK_THRESHOLD unidades. */
  isLowStock: boolean;
  /** true cuando no quedan unidades (stock = 0). */
  isOutOfStock: boolean;
}

/** Campos del formulario que pueden tener un error de validación. */
export type ProductField = 'name' | 'price';

/** Resultado de validar un `ProductInput`. */
export interface ValidationResult {
  isValid: boolean;
  /** Mensaje de error por campo. Vacío si `isValid` es true. */
  errors: Partial<Record<ProductField, string>>;
}

/** Umbral de «pocas unidades». */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Convierte un `Product` en un `ProductView`.
 *
 * Contrato que debe cumplir:
 *  - `name`: el nombre sin espacios sobrantes al inicio ni al final.
 *  - `priceLabel`: "$" seguido del precio con dos decimales (p. ej. "$8500.00").
 *  - `isOutOfStock`: stock igual a 0.
 *  - `isLowStock`: stock mayor que 0 y menor o igual que LOW_STOCK_THRESHOLD.
 *  - `id` y `category` pasan sin cambios.
 *
 * TODO(Parte 2): implementar (hoy devuelve valores de relleno).
 */
export function toProductView(product: Product): ProductView {
  // TODO(Parte 2): reemplazar este relleno por la implementación real.
  return {
    id: product.id,
    name: product.name,
    priceLabel: '',
    category: product.category,
    isLowStock: false,
    isOutOfStock: false,
  };
}

/**
 * Valida los datos del formulario.
 *
 * Contrato que debe cumplir:
 *  - `name` es obligatorio (un nombre solo de espacios cuenta como vacío).
 *  - `price` debe ser un número finito mayor que 0.
 *  - `errors` trae un mensaje por cada campo inválido; `isValid` es true
 *    solo si no hay ningún error.
 *
 * TODO(Parte 2): implementar (hoy da por válido cualquier dato).
 */
export function validateProduct(input: ProductInput): ValidationResult {
  // TODO(Parte 2): validar `input` y devolver los errores por campo.
  void input;
  return { isValid: true, errors: {} };
}
