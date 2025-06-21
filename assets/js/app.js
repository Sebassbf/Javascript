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
        mostrarMensajeAgregado();
    }
});

function mostrarMensajeAgregado() {
    const mensaje = document.getElementById('mensaje-agregado');
    mensaje.classList.add('mostrar');

    setTimeout(() => {
        mensaje.classList.remove('mostrar');
    }, 1500);
}


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
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async function () {
            if (carrito.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Carrito vacío',
                    text: 'Agregue productos antes de finalizar la compra.',
                });
                return;
            }

            const { value: formValues } = await Swal.fire({
                title: 'Ingrese sus datos',
                html:
                    '<input id="swal-name" class="swal2-input" placeholder="Nombre completo">' +
                    '<input id="swal-email" type="email" class="swal2-input" placeholder="Correo electrónico">' +
                    '<input id="swal-address" class="swal2-input" placeholder="Dirección de envío">',
                focusConfirm: false,
                confirmButtonText: 'Continuar',
                preConfirm: () => {
                    const name = document.getElementById('swal-name').value;
                    const email = document.getElementById('swal-email').value;
                    const address = document.getElementById('swal-address').value;

                    if (!name || !email || !address) {
                        Swal.showValidationMessage('Por favor, complete todos los campos');
                        return false;
                    }

                    return { name, email, address };
                }
            });

            if (formValues) {
                const orden = {
                    cliente: formValues,
                    carrito: carrito,
                    total: calcularTotal()
                };

                localStorage.setItem('ordenCompra', JSON.stringify(orden));
                mostrarResumenCompra(orden);
            }
        });
    }
});

function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function mostrarResumenCompra(data) {
    const resumen = `
        <p><strong>Nombre:</strong> ${data.cliente.name}</p>
        <p><strong>Email:</strong> ${data.cliente.email}</p>
        <p><strong>Dirección:</strong> ${data.cliente.address}</p>
        <p><strong>Total:</strong> $${data.total.toLocaleString('es-AR')}</p>
        <hr>
        <p><strong>Productos:</strong></p>
        <ul style="text-align:left;">
            ${data.carrito.map(item => `<li>${item.nombre} x${item.cantidad}</li>`).join('')}
        </ul>
    `;

    Swal.fire({
        title: 'Resumen de compra',
        html: resumen,
        confirmButtonText: 'Confirmar compra',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem('ordenCompra');
            carrito.length = 0;
            guardarCarrito();

            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada!',
                text: 'Su compra ha sido procesada con éxito.',
                confirmButtonColor: '#28a745'
            });
        }
    });
}

function guardarCarrito() {
    renderizarCarrito(); 
    localStorage.setItem('carrito', JSON.stringify(carrito));
}




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
