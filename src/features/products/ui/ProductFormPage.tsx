import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

/**
 * Pantalla: formulario de nuevo producto (ruta /productos/nuevo).
 *
 * TODO(Parte 2): formulario con nombre, precio, categoría y stock. Antes de
 * guardar, llame a `validateProduct()` y muestre los mensajes de error junto
 * a cada campo (nombre obligatorio, precio mayor que 0). Si es válido, llame
 * a `createProduct()` y regrese a la lista.
 */
const ProductFormPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/productos" />
        </IonButtons>
        <IonTitle>Nuevo producto</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>TODO(Parte 2): formulario con validación.</p>
    </IonContent>
  </IonPage>
);

export default ProductFormPage;
