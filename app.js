/* Creamos la clase Carrito que contiene los atributos de los productos
y se encarga de realizar los cálculos
*/
class Carrito {
  constructor(productos, moneda) {
    this.productos = productos;
    this.moneda = moneda;

    for (const producto of productos) {
      producto.precio = Number(producto.precio);
      producto.cantidad = 0;
      producto.subtotal = 0;
    }
  }

  obtenerInformacionProducto(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  actualizarUnidades(id, cantidad) {
    const producto = this.obtenerInformacionProducto(id);
    producto.cantidad = Math.max(0, cantidad);
    producto.subtotal = Number((producto.precio * producto.cantidad).toFixed(2));
  }

  obtenerCarrito() {
    const productos = this.productos.filter((producto) => producto.cantidad > 0);
    let total = 0;
    for (const producto of productos) {
      total += producto.subtotal;
    }
    return {
      total: Number(total.toFixed(2)),
      moneda: this.moneda,
      productos: productos,
    };
  }

  vaciar() {
    for (const producto of this.productos) {
      producto.cantidad = 0;
      producto.subtotal = 0;
    }
  }
}

/* Seleccionamos los elementos del DOM para mostrar la información
(tabla de productos y el resumen del carrito)
y poder hacer las acciones interactivas del usuario
*/
let carrito;

const tablaProductos = document.querySelector("#tablaProductos");
const listaCarrito = document.querySelector("#listaCarrito");
const total = document.querySelector("#total");
const estado = document.querySelector("#estado");
const numArticulos = document.querySelector("#numArticulos");

function dinero(numero) {
  return numero.toFixed(2) + " " + carrito.moneda;
}

// Cada botón cambia las unidades y se vuelve a dibujar todo
function cambiar(id, cambio) {
  const producto = carrito.obtenerInformacionProducto(id);
  carrito.actualizarUnidades(id, producto.cantidad + cambio);
  mostrar();
}

// El botón de vaciar pone todas las unidades a 0
document.querySelector("#vaciar").addEventListener("click", function () {
  if (carrito) {
    carrito.vaciar();
    mostrar();
  }
});

function mostrar() {
  tablaProductos.innerHTML = "";
  listaCarrito.innerHTML = "";

  for (const producto of carrito.productos) {
    const fila = document.createElement("tr");
    const celdaNombre = document.createElement("td");

    const nombre = document.createElement("strong");
    nombre.innerText = producto.nombre;
    const id = document.createElement("small");
    id.innerText = "ID: " + producto.id;
    celdaNombre.appendChild(nombre);
    celdaNombre.appendChild(id);

    const celdaCantidad = document.createElement("td");
    const menos = document.createElement("button");
    menos.innerText = "-";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("readonly", "readonly");
    input.value = producto.cantidad;
    const mas = document.createElement("button");
    mas.innerText = "+";
    celdaCantidad.appendChild(menos);
    celdaCantidad.appendChild(input);
    celdaCantidad.appendChild(mas);

    const celdaPrecio = document.createElement("td");
    celdaPrecio.innerText = dinero(producto.precio);

    const celdaSubtotal = document.createElement("td");
    celdaSubtotal.innerText = dinero(producto.subtotal);

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaSubtotal);
    tablaProductos.appendChild(fila);

    menos.addEventListener("click", function () {
      cambiar(producto.id, -1);
    });
    mas.addEventListener("click", function () {
      cambiar(producto.id, 1);
    });
  }

  // Si no hay productos en el carrito, mostramos un mensaje
  const datos = carrito.obtenerCarrito();
  if (datos.productos.length === 0) {
    const vacio = document.createElement("li");
    vacio.innerText = "Todavía no has añadido nada";
    vacio.classList.add("vacio");
    listaCarrito.appendChild(vacio);
  }

  /* Tenemos en cuenta el singular/plural según la cantidad de cada producto
  y mostramos la cantidad total de todos los productos y su información
*/
  let unidades = 0;
  for (const producto of datos.productos) {
    unidades += producto.cantidad;
  }
  numArticulos.innerText =
    unidades + (unidades === 1 ? " artículo" : " artículos");

  for (const producto of datos.productos) {
    const li = document.createElement("li");
    li.innerText =
      producto.cantidad +
      " x " +
      producto.nombre +
      ": " +
      dinero(producto.subtotal);
    listaCarrito.appendChild(li);
  }
  total.innerText = dinero(datos.total);
}


// Hacemos la llamada a la API para cargar la información de los productos
const URL_API = "api.php";
async function cargarProductos(){
    try {
        const respuesta = await fetch(URL_API);
        if(!respuesta.ok) throw new Error ("HTTP " + respuesta.status);
        const datos = await respuesta.json();
        carrito = new Carrito(datos.productos, datos.moneda);
        mostrar();
        estado.innerText = "Productos cargados. Con + y - selecciona las unidades";
    } catch(error){
        estado.innerText = "No se han podido cargar los productos: " + error.message;
    }
}


cargarProductos();