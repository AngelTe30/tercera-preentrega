
let productos = [];
const cartbtn = document.querySelector('.cart');
const cartproducts = document.querySelector('.cart-product');
const productinfo = document.querySelector('cart-product');
const rowProduct = document.querySelector('.row');
const cantidadproducto = document.querySelector('.count-cart'); 

/*Cargar archivos del json*/ 
async function cargarproductos() {
    fetch("js/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        productos = data;
        console.log("Productos cargados:", productos); // Verifica los productos cargados
        mostrarProductos(productos);
    })
    .catch(error => {
        console.error("Error al cargar los productos:", error); // Muestra cualquier error de carga
    });
}

 /*funcion para ocultar y abrir el carrito*/ 
 cartbtn.addEventListener('click', () => {
    cartproducts.classList.toggle('hidden-cart');
});

/*funcion para cargar productos al html*/ 
    function mostrarProductos(listaproductos) {
        const contenedorProductos = document.querySelector('.productos');
        listaproductos.forEach(producto => {
            const productoCard = document.createElement('article');
            productoCard.classList.add('card');
            
            productoCard.innerHTML = `
                <div class="image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <p class="name-product">${producto.nombre}</p>
                <div class="price">
                    <i class="fa-solid fa-dollar-sign"></i>
                    <p id="price-product">${producto.precio}</p>
                </div>
                </div>
                <div id="add">
                    <button class="add-button" id="${producto.id}">Add cart</button>
                </div>
            `;
            
            contenedorProductos.appendChild(productoCard);
});
actualizarbotones();
console.log(btnAgregar)
}
cargarproductos();

let btnAgregar = document.querySelectorAll(".add-button");

function actualizarbotones(){
    btnAgregar =  document.querySelectorAll(".add-button");

    btnAgregar.forEach(boton => {
        boton.addEventListener('click', agregarCarrito);
    })
}

const carrito = [];

function agregarCarrito(e){
    const idboton = e.currentTarget.id;
    const productosAgregar = productos.find(producto => producto.id === idboton);

    if(carrito.some(producto => producto.id ===idboton)){
        const index = carrito.findIndex(producto => producto.id === idboton);
        carrito[index].cantidad++;
    }else{
        productosAgregar.cantidad=1;
        carrito.push(productosAgregar);
    }
    actualizarcantidad();
    renderizarCarrito();

    localStorage.setItem("productos-en-carrito",JSON.stringify(carrito));
}

function actualizarcantidad(){
    let cantidadcarrito = carrito.reduce((acc,producto) => acc + producto.cantidad,0);
    cantidadproducto.innerText = cantidadcarrito;
}


function renderizarCarrito() {
    const contenedorCarrito = document.querySelector(".row");
    contenedorCarrito.innerHTML = ''; // Limpia el contenido previo del carrito

    carrito.forEach(producto => {
        const productoHTML = document.createElement("div");
        productoHTML.classList.add("info-cart");

        productoHTML.innerHTML = `
            <span class="cantidad-producto">${producto.cantidad}</span>
            <p class="titulo-producto">${producto.nombre}</p>
            <span class="precio-producto">$${producto.precio * producto.cantidad}</span>
            <i class="fa-solid fa-xmark" onclick="eliminarProducto('${producto.id}')"></i>
        `;

        contenedorCarrito.appendChild(productoHTML);
    });

    // Actualiza el total
    const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    document.querySelector(".pago").innerText = `$${total}`;

    // Muestra u oculta el mensaje de carrito vacío
    const emptyMessage = document.querySelector(".empty");
    emptyMessage.style.display = carrito.length === 0 ? "block" : "none";
}

function eliminarProducto(id) {
    const index = carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
        carrito.splice(index, 1); // Elimina el producto del carrito
    }
    actualizarcantidad();
    renderizarCarrito(); // Renderiza el carrito después de eliminar

    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
}


// Llama a `actualizarCantidad` al cargar la página para mantener la cantidad si hay productos en el localStorage
document.addEventListener("DOMContentLoaded", () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    carritoGuardado.forEach(producto => carrito.push(producto));
    actualizarcantidad();
    renderizarCarrito();
});
