import type { ProductView } from '../model/product';

export interface ProductCardProps {
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

/**
 * Tarjeta reutilizable de un producto (se usa en la lista).
 *
 * TODO(Parte 2): construirla con componentes de Ionic (IonItem / IonCard...),
 * mostrando nombre, categoría, precio y un aviso cuando hay pocas unidades
 * o está agotado. Hoy solo muestra el nombre.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <div onClick={() => onSelect?.(product.id)}>{product.name}</div>
);

export default ProductCard;
