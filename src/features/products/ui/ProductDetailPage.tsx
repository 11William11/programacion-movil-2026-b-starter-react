import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 *
 * TODO(Parte 2): cargar el producto con `getProduct(id)` y mostrar nombre,
 * categoría, precio y stock. Maneje carga y error (incluido NOT_FOUND).
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
      <IonContent className="ion-padding">
        <p>TODO(Parte 2): detalle del producto con id {id}.</p>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
