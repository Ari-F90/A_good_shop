// 1. CLASE CARRITO

/* Creamos la clase Carrito que contiene los atributos de los productos
y se encarga de realizar los cálculos
*/
class Carrito {
  constructor(productos, moneda) {
    this.productos = productos;
    this.moneda = moneda;

    /* A cada producto le añadimos lo que no viene de la API y pasamos el precio
    (que viene como string) a número*/
    for (const producto of productos) {
      producto.precio = Number(producto.precio);
      producto.cantidad = 0;
      producto.subtotal = 0;
    }
  }

  // Busca el producto por su ID
  obtenerInformacionProducto(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  /* Cambia la cantidad de un producto (nunca menos de 0)
  y ajustar el subtotal de cada uno*/
  actualizarUnidades(id, cantidad) {
    const producto = this.obtenerInformacionProducto(id);
    producto.cantidad = Math.max(0, cantidad);
    producto.subtotal = Number(
      (producto.precio * producto.cantidad).toFixed(2),
    );
  }

  // Devuelve el total de la compra y sólo lo productos con cantidad > 0
  obtenerCarrito() {
    const productos = this.productos.filter(
      (producto) => producto.cantidad > 0,
    );
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

  // Deja el carrito con las unidades de los productos a 0
  vaciar() {
    for (const producto of this.productos) {
      producto.cantidad = 0;
      producto.subtotal = 0;
    }
  }
}


// 2. DATOS Y ELEMENTOS DE LA PÁGINA

/*Seleccionamos los elementos del DOM para mostrar la información
(tabla de productos y el resumen del carrito)*/
let carrito;

const tablaProductos = document.querySelector("#tablaProductos");
const listaCarrito = document.querySelector("#listaCarrito");
const total = document.querySelector("#total");
const estado = document.querySelector("#estado");
const numArticulos = document.querySelector("#numArticulos");

// Colocar el subtotal del producto con 2 decimales y la moneda
function dinero(numero) {
  return numero.toFixed(2) + " " + carrito.moneda;
}


// 3. MOSTRAR LA INFORMACIÓN POR PANTALLA

// Crear la fila de la tabla de los productos
function crearFila(producto) {
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

  menos.addEventListener("click", function () {
    cambiar(producto.id, -1);
  });
  mas.addEventListener("click", function () {
    cambiar(producto.id, 1);
  });

  const celdaPrecio = document.createElement("td");
  celdaPrecio.innerText = dinero(producto.precio);

  const celdaSubtotal = document.createElement("td");
  celdaSubtotal.innerText = dinero(producto.subtotal);

  fila.appendChild(celdaNombre);
  fila.appendChild(celdaCantidad);
  fila.appendChild(celdaPrecio);
  fila.appendChild(celdaSubtotal);
  return fila;
}

/* Mostramos cada fila de cada producto en la tabla y el cuadro de la derecha
con la información del carrito*/
function mostrarProductos() {
  tablaProductos.innerHTML = "";
  for (const producto of carrito.productos) {
    tablaProductos.appendChild(crearFila(producto));
  }
}

function mostrarListaCarrito() {
  listaCarrito.innerHTML = "";
  const datos = carrito.obtenerCarrito();

  // Si no hay productos en el carrito, mostramos un mensaje
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

// Llamamos a las dos funciones annteriores para mostrar todo por pantalla
function mostrarTodo(){
  mostrarProductos();
  mostrarListaCarrito();
}


// 4. ACCIONES DEL USUARIO

// Cada botón cambia las unidades y se vuelve a dibujar todo
function cambiar(id, cambio) {
  const producto = carrito.obtenerInformacionProducto(id);
  carrito.actualizarUnidades(id, producto.cantidad + cambio);
  mostrarTodo();
}

// El botón de vaciar pone todas las unidades a 0
document.querySelector("#vaciar").addEventListener("click", function () {
  if (carrito) {
    carrito.vaciar();
    mostrarTodo();
  }
});


// 5. CARGA DE PRODUCTOS DESDE LA API
// Hacemos la llamada a la API para cargar la información de los productos
const URL_API = "api.php";
async function cargarProductos() {
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    const datos = await respuesta.json();
    carrito = new Carrito(datos.productos, datos.moneda);
    mostrarTodo();
    estado.innerText = "Productos cargados. Con + y - selecciona las unidades";
  } catch (error) {
    estado.innerText =
      "No se han podido cargar los productos: " + error.message;
  }
}

// Al abrir la página se cargan los productos
cargarProductos();
