// Variables globales
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const listaProductos = document.querySelector('#listaProductos');
const carritoLista = document.querySelector('#carrito-lista');
const total = document.querySelector('#total');
const vaciarBtn = document.querySelector('#vaciar-carrito');

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
});

listaProductos.addEventListener('click', e => {
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.closest('.product');
        obtenerDatosProducto(producto);
    }
});

vaciarBtn.addEventListener('click', () => {
    carrito.length = 0;
    guardarCarrito();
    renderizarCarrito();
});

// Funciones
function obtenerDatosProducto(producto) {
    const infoProducto = {
        id: producto.querySelector('button').getAttribute('data-id'),
        nombre: producto.querySelector('h4').textContent,
        precio: parseInt(producto.querySelector('#currentPrice').textContent.replace('$', '').replace('.', '')),
        imagen: producto.querySelector('img').getAttribute('src'),
        cantidad: 1
    };

    const existe = carrito.find(item => item.id === infoProducto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push(infoProducto);
    }

    guardarCarrito();
    renderizarCarrito();
}

function renderizarCarrito() {
    carritoLista.innerHTML = '';
    let totalCompra = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${producto.imagen}" width="50">
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
            <button class="eliminar" data-id="${producto.id}">X</button>
        `;
        carritoLista.appendChild(li);
        totalCompra += producto.precio * producto.cantidad;
    });

    total.textContent = `Total: $${totalCompra.toLocaleString('es-CO')}`;
    document.getElementById('cart-count').textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);


    // Botón eliminar
    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            eliminarProducto(btn.getAttribute('data-id'));
        });
    });
}

function eliminarProducto(id) {
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    renderizarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('DOMContentLoaded', function () {
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            Swal.fire({
                icon: 'success',
                title: '¡Compra exitosa!',
                text: 'Su compra ha sido procesada con éxito.',
                confirmButtonColor: '#28a745'
            });

            cart.length = 0; // Vacía el carrito
            updateCart();
        });
    }
});



const cartToggle = document.getElementById('cart-toggle');
const cartDropdown = document.getElementById('cart-dropdown');

cartToggle.addEventListener('click', () => {
    cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
});

//Al hacer click afuera cierra el carrito
document.addEventListener('click', function (e) {
    if (!cartDropdown.contains(e.target) && !cartToggle.contains(e.target)) {
        cartDropdown.style.display = 'none';
    }
});
