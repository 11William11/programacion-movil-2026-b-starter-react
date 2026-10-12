import { IonBadge, IonItem, IonLabel } from '@ionic/react';

import type { ProductView } from '../domain/product';
import { getStockColor } from './stock-color';

export interface ProductCardProps {
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

/**
 * Tarjeta reutilizable de un producto (se usa en la lista).
 *
 * Sigue el modelo de `EmptyState`: props tipadas en una `interface` `<Componente>Props`, las
 * opcionales con `?`, y solo muestra datos; avisa con `onSelect` sin saber a dónde se navega.
 * Muestra nombre, categoría, precio y la etiqueta de stock como un aviso de color: rojo si está
 * agotado, naranja si quedan pocas unidades y verde si hay.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <IonItem button detail onClick={() => onSelect?.(product.id)}>
    <IonLabel>
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <p>{product.priceLabel}</p>
    </IonLabel>
    <IonBadge slot="end" color={getStockColor(product)}>
      {product.stockLabel}
    </IonBadge>
  </IonItem>
);

export default ProductCard;
