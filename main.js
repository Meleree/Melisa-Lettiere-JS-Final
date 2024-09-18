document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error('Formulario de inicio de sesión no encontrado.');
        return;
    }

    const nombreUsuarioGuardado = localStorage.getItem('nombreUsuario');
    if (nombreUsuarioGuardado) {
        loginForm.style.display = 'none';
        alert(`Bienvenido/a ${nombreUsuarioGuardado} a Melere`);
        cargarArticulos(); // Cargar artículos después del inicio de sesión
    } else {
        loginForm.style.display = 'block';
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const validUser = 'usuario';
        const validPassword = 'contrasena';

        if (username === validUser && password === validPassword) {
            localStorage.setItem('nombreUsuario', username);
            alert(`Bienvenido/a ${username} a Melere`);
            loginForm.style.display = 'none'; 
            cargarArticulos(); 
        } else {
            alert('Nombre de usuario o contraseña incorrectos.');
        }
    });
});

const carrito = [];
const IVA = 0.21;

function cargarArticulos() {
    fetch('./JSON/articulos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarArticulos(data);
        })
        .catch(error => console.error('Error al cargar los artículos:', error));
}
console.log(data)
function mostrarArticulos(articulos) {
    const contenedor = document.getElementById('contenedor-articulos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    articulos.forEach(articulo => {
        const articuloDiv = document.createElement('div');
        articuloDiv.classList.add('articulo');

        const imagenUrl = articulo.imagen || './assets/placeholder.jpg'; // Usa una imagen por defecto si falta

        const tallasDiv = document.createElement('div');
        tallasDiv.classList.add('tallas');
        const tallas = articulo.talleProducto || ['Único']; // Verifica el campo 'talleProducto'
        tallas.forEach(talla => {
            const tallaBtn = document.createElement('button');
            tallaBtn.textContent = talla;
            tallaBtn.classList.add('talla-btn');
            tallaBtn.onclick = () => {
                seleccionarTalla(talla, articulo.id);
            };
            tallasDiv.appendChild(tallaBtn);
        });

        const precioConIVA = (articulo.precio * (1 + IVA)).toFixed(2);

        articuloDiv.innerHTML = `
            <img src="${imagenUrl}" alt="${articulo.nombre}" width="100">
            <h3>${articulo.nombre}</h3>
            <p>Precio: $${precioConIVA}</p>
        `;
        
        articuloDiv.appendChild(tallasDiv);
        
        contenedor.appendChild(articuloDiv);
    });
}

function buscarArticulos() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    fetch('./JSON/articulos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const articulosFiltrados = data.filter(articulo => 
                articulo.nombre.toLowerCase().includes(input)
            );
            mostrarArticulos(articulosFiltrados);
        })
        .catch(error => console.error('Error al buscar artículos:', error));
}

function seleccionarTalla(talla, articuloId) {
    fetch('./JSON/articulos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const articulo = data.find(a => a.id === articuloId);
            if (articulo) {
                let cantidad = parseInt(prompt(`¿Cuántas unidades deseas de ${articulo.nombre} (${talla})?`), 10);
                if (isNaN(cantidad) || cantidad <= 0) {
                    alert("Cantidad no válida. Debes ingresar un número positivo.");
                } else {
                    let itemEnCarrito = carrito.find(item => item.articulo.id === articulo.id && item.talla === talla);
                    if (itemEnCarrito) {
                        itemEnCarrito.cantidad += cantidad;
                    } else {
                        carrito.push({ articulo, cantidad, talla });
                    }
                    guardarCarrito();
                    actualizarContadorCarrito();
                    alert(`Has añadido ${cantidad} unidad(es) de ${articulo.nombre} (${talla}) al carrito.`);
                }
            } else {
                alert("Artículo no encontrado.");
            }
        })
        .catch(error => console.error('Error al seleccionar talla:', error));
}

function mostrarCarrito() {
    const cartOverlay = document.getElementById('cartOverlay');
    const cartContents = document.getElementById('cartContents');
    
    if (carrito.length === 0) {
        cartContents.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        let resumenCarrito = "";
        let total = 0;
        carrito.forEach((item, index) => {
            const precioConIVA = (item.articulo.precio * (1 + IVA)).toFixed(2);
            const subtotal = (item.cantidad * item.articulo.precio * (1 + IVA)).toFixed(2);
            resumenCarrito += `
                <div class="cart-item">
                    <img src="${item.articulo.imagen}" alt="${item.articulo.nombre}" width="50">
                    <p><strong>Artículo:</strong> ${item.articulo.nombre}</p>
                    <p><strong>Talla:</strong> ${item.talla}</p>
                    <p><strong>Precio Unitario (con IVA):</strong> $${precioConIVA}</p>
                    <p><strong>Subtotal:</strong> $${subtotal}</p>
                    <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${index}, this.value)">
                    <button onclick="eliminarArticulo(${index})">Eliminar</button>
                </div>
            `;
            total += parseFloat(subtotal);
        });
        resumenCarrito += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
        cartContents.innerHTML = resumenCarrito;
    }
    
    cartOverlay.style.display = 'block';
}

function actualizarCantidad(index, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
        alert("Cantidad no válida. Debes ingresar un número positivo.");
        return;
    }

    carrito[index].cantidad = nuevaCantidad;
    if (nuevaCantidad === 0) {
        carrito.splice(index, 1); 
    }
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function eliminarArticulo(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function ocultarCarrito() {
    const cartOverlay = document.getElementById('cartOverlay');
    cartOverlay.style.display = 'none';
}

function actualizarContadorCarrito() {
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = `${totalArticulos}`;
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. No puedes finalizar la compra.");
        return;
    }

    alert("¡Gracias por tu compra!");
    carrito.length = 0; // Vaciar carrito
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito(); 
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito.length = 0; // Limpiar el carrito antes de cargar
        carrito.push(...JSON.parse(carritoGuardado));
        actualizarContadorCarrito();
    }
}

window.onload = function() {
    cargarCarrito();
    if (localStorage.getItem('nombreUsuario')) {
        cargarArticulos();
    }
}
