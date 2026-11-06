import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView } from '../domain/product';
import type { ProductView } from '../domain/product';
import EmptyState from './EmptyState';
import { getStockColor } from './stock-color';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 *
 * `useParams` lee el `:id` de la ruta; llega como TEXTO, así que se convierte con `Number`.
 * Carga el producto con el mismo patrón de la lista (`useState` + `useEffect` y recarga con
 * `useIonViewWillEnter`, para ver los cambios al volver de editar). Un producto inexistente llega
 * como ApiError 404 y `getErrorMessage` lo traduce a «No encontramos ese producto.».
 *
 * «Eliminar» no borra de inmediato: muestra una confirmación en pantalla (`isConfirmingDelete`)
 * con «Confirmar» y «Cancelar». Al confirmar se llama a `deleteProduct` y se vuelve a la lista.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const productId = Number(useParams<{ id: string }>().id);
  const history = useHistory();
  const [product, setProduct] = useState<ProductView | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isLoadingRef = useRef(false);

  const loadProduct = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir el producto dos veces a la vez
    isLoadingRef.current = true;
    setStatus('loading');
    try {
      setProduct(toProductView(await getProduct(productId)));
      setErrorMessage('');
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  useIonViewWillEnter(() => {
    setIsConfirmingDelete(false);
    void loadProduct();
  });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await deleteProduct(productId);
      history.replace('/productos');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {status === 'loading' && <p className="ion-padding">Cargando producto…</p>}
        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProduct()}
          />
        )}
        {status === 'ready' && product && (
          <>
            <IonList>
              <IonItem>
                <IonLabel>
                  <p>Nombre</p>
                  <h2>{product.name}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Categoría</p>
                  <h2>{product.category}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Precio</p>
                  <h2>{product.priceLabel}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Stock</p>
                  <h2>{product.stock} unidades</h2>
                </IonLabel>
                <IonBadge slot="end" color={getStockColor(product)}>
                  {product.stockLabel}
                </IonBadge>
              </IonItem>
            </IonList>

            {errorMessage && (
              <IonText color="danger">
                <p className="ion-padding-horizontal">{errorMessage}</p>
              </IonText>
            )}

            {isConfirmingDelete ? (
              <div className="ion-padding">
                <IonText>
                  <h3>¿Eliminar este producto?</h3>
                </IonText>
                {/* `key` y `fill` explícitos: sin ellos React reutiliza el botón «Eliminar» (outline)
                    para «Confirmar» y Ionic deja un estilo roto. */}
                <IonButton
                  key="confirm"
                  color="danger"
                  fill="solid"
                  disabled={isDeleting}
                  onClick={() => void handleConfirmDelete()}
                >
                  Confirmar
                </IonButton>
                <IonButton
                  key="cancel"
                  fill="outline"
                  disabled={isDeleting}
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            ) : (
              <div className="ion-padding">
                <IonButton key="edit" fill="solid" routerLink={`/productos/${productId}/editar`}>
                  Editar
                </IonButton>
                <IonButton key="delete" color="danger" fill="outline" onClick={() => setIsConfirmingDelete(true)}>
                  Eliminar
                </IonButton>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
