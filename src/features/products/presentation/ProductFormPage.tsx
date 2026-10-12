import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import { CATEGORIES, validateProduct } from '../domain/product';
import type { ProductField, ProductInput } from '../domain/product';
import EmptyState from './EmptyState';

/**
 * Pantalla: formulario de producto. La misma pantalla sirve para dos rutas:
 *  - /productos/nuevo          → crear (no hay `id` en la ruta)
 *  - /productos/:id/editar     → editar (hay `id`; los campos se precargan con `getProduct`)
 *
 * Cada campo es un valor controlado: vive en una variable de estado (`useState`) y `onIonInput`
 * la actualiza cada vez que la persona escribe. Precio y stock se guardan como texto (es lo que
 * entrega el campo) y se convierten a número al guardar.
 *
 * Al tocar «Guardar» se valida con `validateProduct()` (las mismas reglas de la API) y el mensaje
 * de cada campo inválido aparece junto a él. Si es válido se llama a `createProduct` o
 * `updateProduct`; si el servidor rechaza (ApiError 400) se muestran su mensaje y sus `details`.
 * Si guarda bien, se vuelve a la lista.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

/** Convierte el texto de un campo numérico; un campo vacío cuenta como inválido (NaN), no como 0. */
function toNumber(text: string): number {
  return text.trim() === '' ? Number.NaN : Number(text);
}

/** Mensaje de error de un campo, en rojo y pequeño. No pinta nada si no hay error. */
const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <IonText color="danger">
      <small>{message}</small>
    </IonText>
  ) : null;

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditing = id !== undefined;
  const productId = Number(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<Partial<Record<ProductField, string>>>({});
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(isEditing ? 'loading' : 'ready');
  const [loadErrorMessage, setLoadErrorMessage] = useState('');

  const loadProduct = useCallback(async () => {
    setLoadStatus('loading');
    try {
      const product = await getProduct(productId);
      setName(product.name);
      setPrice(String(product.price));
      setCategory(product.category);
      setStock(String(product.stock));
      setLoadStatus('ready');
    } catch (error) {
      setLoadErrorMessage(getErrorMessage(error));
      setLoadStatus('error');
    }
  }, [productId]);

  useEffect(() => {
    if (isEditing) void loadProduct();
  }, [isEditing, loadProduct]);

  /** Quita el mensaje de error de un campo cuando la persona vuelve a escribir en él. */
  const clearError = (field: ProductField) => {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSave = async () => {
    const input: ProductInput = { name: name.trim(), price: toNumber(price), category, stock: toNumber(stock) };
    const result = validateProduct(input);

    setErrors(result.errors);
    setServerError('');
    setServerDetails([]);
    if (!result.isValid) return; // validación en línea: no se llama a la API con datos inválidos

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }
      history.replace('/productos');
    } catch (error) {
      setServerError(getErrorMessage(error));
      setServerDetails(error instanceof ApiError ? error.details : []);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loadStatus === 'loading' && <p>Cargando producto…</p>}
        {loadStatus === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={loadErrorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProduct()}
          />
        )}
        {loadStatus === 'ready' && (
          <>
            <div className="ion-margin-bottom">
              <IonInput
                label="Nombre"
                labelPlacement="floating"
                fill="outline"
                value={name}
                onIonInput={(event) => {
                  setName(String(event.detail.value ?? ''));
                  clearError('name');
                }}
              />
              <FieldError message={errors.name} />
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label="Precio (COP)"
                labelPlacement="floating"
                fill="outline"
                type="number"
                inputmode="decimal"
                value={price}
                onIonInput={(event) => {
                  setPrice(String(event.detail.value ?? ''));
                  clearError('price');
                }}
              />
              <FieldError message={errors.price} />
            </div>

            <div className="ion-margin-bottom">
              <p className="ion-no-margin">Categoría</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {CATEGORIES.map((option) => (
                  <IonButton
                    key={option}
                    size="small"
                    fill={category === option ? 'solid' : 'outline'}
                    onClick={() => {
                      setCategory(option);
                      clearError('category');
                    }}
                  >
                    {option}
                  </IonButton>
                ))}
              </div>
              <FieldError message={errors.category} />
            </div>

            <div className="ion-margin-bottom">
              <IonInput
                label="Stock"
                labelPlacement="floating"
                fill="outline"
                type="number"
                inputmode="numeric"
                value={stock}
                onIonInput={(event) => {
                  setStock(String(event.detail.value ?? ''));
                  clearError('stock');
                }}
              />
              <FieldError message={errors.stock} />
            </div>

            {serverError && (
              <IonText color="danger">
                <p className="ion-no-margin">{serverError}</p>
                {serverDetails.length > 0 && (
                  <ul>
                    {serverDetails.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </IonText>
            )}

            <IonButton expand="block" fill="solid" disabled={isSaving} onClick={() => void handleSave()}>
              Guardar
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;
