import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

/**
 * Pantalla: lista de productos (ruta /productos).
 *
 * TODO(Parte 2): cargar los productos con `getProducts()` y mostrar
 *  - estado de CARGA mientras se espera,
 *  - estado de ERROR con un mensaje y un botón «Reintentar»,
 *  - estado VACÍO cuando no hay productos,
 *  - la lista con un `ProductCard` por producto (al tocarlo, ir a /productos/:id),
 *  - un botón para ir al formulario (/productos/nuevo).
 * Pruebe los estados con /productos?error=1 y /productos?empty=1.
 */
const ProductListPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Productos</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>TODO(Parte 2): lista de productos con estados de carga, vacío y error.</p>
      <IonButton routerLink="/productos/1">Ver detalle (ejemplo)</IonButton>
      <IonButton routerLink="/productos/nuevo">Nuevo producto</IonButton>
    </IonContent>
  </IonPage>
);

export default ProductListPage;
