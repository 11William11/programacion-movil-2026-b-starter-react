// Ejercicio Kotlin · Parte 4 del TODO.md
//
// Alcance: solo lo visto en la semana 7 (val/var, funciones, clases, tipos que admiten null,
// `?.`, `?:`, if/when, plantillas de cadena). No exige proyecto Android.
// Cómo ejecutarlo: pegue el archivo en https://play.kotlinlang.org o compílelo con `kotlinc`.

// Producto del catálogo. `id`, `name` y `category` no cambian una vez creado el producto (val);
// `price` y `stock` sí pueden cambiar (var). `stock` es `Int?`: puede ser null cuando no hay dato.
class Product(
    val id: Int,
    val name: String,
    var price: Double,
    val category: String,
    var stock: Int?
)

// Etiqueta de stock, igual que la de la app:
// null → "Sin dato" · 0 → "Agotado" · menos de 5 → "Pocas unidades" · otro caso → "Disponible".
fun stockLabel(stock: Int?): String {
    return when {
        stock == null -> "Sin dato"
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

// Precio con el descuento aplicado: applyDiscount(10000.0, 15) devuelve 8500.0.
fun applyDiscount(price: Double, percent: Int): Double {
    return price * (100 - percent) / 100
}

fun main() {
    val products = listOf(
        Product(1, "Agua mineral 600 ml", 1800.0, "Bebidas", 120),
        Product(5, "Galletas de avena x6", 2700.0, "Snacks", 0),
        Product(7, "Jabón de manos 250 ml", 6900.0, "Aseo", null)
    )

    for (product in products) {
        val discountedPrice = applyDiscount(product.price, 10)
        println("${product.name} | ${stockLabel(product.stock)} | con 10 % de descuento: $discountedPrice")
    }
}
