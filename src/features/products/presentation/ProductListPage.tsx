import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import { CATEGORIES, filterProducts, toProductView } from '../domain/product';
import type { Product } from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

/**
 * Pantalla: lista de productos (ruta /productos).
 *
 *  - `useState` guarda los productos, el estado de la carga, el mensaje de error y los filtros;
 *  - `useEffect` con `[]` carga la lista UNA vez, al abrir la pantalla;
 *  - `useIonViewWillEnter` la recarga cuando la persona VUELVE a esta pantalla (Ionic mantiene la
 *    página en memoria, así que sin esto no se vería, por ejemplo, un producto recién creado);
 *  - la búsqueda y la categoría se aplican en memoria con `filterProducts`.
 *
 * Cuatro estados: cargando, error (con «Reintentar»), vacío (la API no tiene productos) y sin
 * resultados (los filtros no encuentran nada); los dos últimos usan `EmptyState`.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

/** Botones del filtro de categoría: «Todas» (valor vacío) y una por cada categoría permitida. */
const CATEGORY_FILTERS = [{ label: 'Todas', value: '' }, ...CATEGORIES.map((name) => ({ label: name, value: name }))];

const ProductListPage: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir la lista dos veces a la vez
    isLoadingRef.current = true;
    setStatus('loading');
    try {
      setProducts(await getProducts());
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const filteredProducts = filterProducts(products, { search, category });
  const hasProducts = products.length > 0;
  const clearFilters = () => {
    setSearch('');
    setCategory('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {status !== 'error' && (
          <div className="ion-padding-horizontal ion-padding-top">
            <IonInput
              label="Buscar por nombre"
              labelPlacement="floating"
              fill="outline"
              clearInput
              value={search}
              onIonInput={(event) => setSearch(String(event.detail.value ?? ''))}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
              {CATEGORY_FILTERS.map((option) => (
                <IonButton
                  key={option.label}
                  size="small"
                  fill={category === option.value ? 'solid' : 'outline'}
                  onClick={() => setCategory(option.value)}
                >
                  {option.label}
                </IonButton>
              ))}
            </div>
          </div>
        )}
        {status === 'loading' && <p className="ion-padding">Cargando productos…</p>}
        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}
        {status === 'ready' && !hasProducts && (
          <EmptyState
            title="No hay productos"
            message="Todavía no hay productos en el catálogo."
            actionLabel="Nuevo producto"
            onAction={() => history.push('/productos/nuevo')}
          />
        )}
        {status === 'ready' && hasProducts && filteredProducts.length === 0 && (
          <EmptyState
            title="Sin resultados"
            message="Ningún producto coincide con la búsqueda o la categoría."
            actionLabel="Limpiar filtros"
            onAction={clearFilters}
          />
        )}
        {status === 'ready' && filteredProducts.length > 0 && (
          <IonList>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={toProductView(product)}
                onSelect={(id) => history.push(`/productos/${id}`)}
              />
            ))}
          </IonList>
        )}
        {(status !== 'ready' || hasProducts) && (
          <IonButton routerLink="/productos/nuevo" className="ion-margin">
            Nuevo producto
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;
