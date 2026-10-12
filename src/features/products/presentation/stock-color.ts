import type { ProductView } from '../domain/product';

/** Color del aviso de stock: rojo si está agotado, naranja si quedan pocas unidades y verde si hay. */
export function getStockColor(product: ProductView): 'danger' | 'warning' | 'success' {
  if (product.isOutOfStock) return 'danger';
  if (product.isLowStock) return 'warning';
  return 'success';
}
