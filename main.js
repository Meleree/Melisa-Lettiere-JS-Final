let nombreUsuario = prompt("Ingrese su nombre");
if (nombreUsuario == ""){
    alert("No ingresaste tu nombre de usuario");
}
else {
    alert("Bienvenido/a " + nombreUsuario + " a Melere");
}

let carrito = [];

const IVA = 0.21;

class Articulo {
    constructor(id, nombreProducto, precioProducto, talleProducto, imagenUrl) {
        this.id = id;
        this.nombreProducto = nombreProducto;
        this.precioProducto = precioProducto;
        this.talleProducto = talleProducto;
        this.imagenUrl = imagenUrl;
    }
}

const articulos = [
    new Articulo(1, 'Remera Basic', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-basic.webp'),
    new Articulo(2, 'Remera Double', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-double.webp'),
    new Articulo(3, 'Remera Dragon', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-dragon.webp'),
    new Articulo(4, 'Remera Good Luck', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-good-luck.webp'),
    new Articulo(5, 'Remera Some Luck', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-some-luck.webp'),
    new Articulo(6, 'Remera Some Love', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-some-love.webp'),
    new Articulo(7, 'Remera Oval', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-oval.webp'),
    new Articulo(8, 'Remera Fire', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/reme-fire.webp'),
    new Articulo(10, 'Buzo Incoherent', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/buzo-incoherent.webp'),
    new Articulo(11, 'Buzo Some Love', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/buzo-some-love.webp'),
    new Articulo(12, 'Buzo Some Luck', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/buzo-some-luck.webp'),
    new Articulo(13, 'Buzo Star', 45000, ['S', 'M', 'L', 'XL', 'XXL'], './assets/buzo-star.webp'),
    new Articulo(15, 'Balaclava Rayden', 15000, ['Único'], './assets/bala-rayden.webp'),
    new Articulo(16, 'Balaclava Spider', 15000, ['Único'], './assets/bala-spider.webp'),
    new Articulo(17, 'Medias Puas', 8000, ['Único'], './assets/medias-puas.webp'),
    new Articulo(18, 'Medias Shine', 8000, ['Único'], './assets/medias-shine.webp'),
];

function mostrarArticulos() {
    const contenedor = document.getElementById('contenedor-articulos');
    contenedor.innerHTML = ''; 
    
    articulos.forEach(articulo => {
        const articuloDiv = document.createElement('div');
        articuloDiv.classList.add('articulo');
        
        const tallasDiv = document.createElement('div');
        tallasDiv.classList.add('tallas');
        articulo.talleProducto.forEach(talla => {
            const tallaBtn = document.createElement('button');
            tallaBtn.textContent = talla;
            tallaBtn.classList.add('talla-btn');
            tallaBtn.onclick = () => {
                seleccionarTalla(talla, articulo.id);
            };
            tallasDiv.appendChild(tallaBtn);
        });
        
        const precioConIVA = (articulo.precioProducto * (1 + IVA)).toFixed(2);

        articuloDiv.innerHTML = `
            <img src="${articulo.imagenUrl}" alt="${articulo.nombreProducto}">
            <h3>${articulo.nombreProducto}</h3>
            <p>Precio: $${precioConIVA}</p>
        `;
        
        articuloDiv.appendChild(tallasDiv);
        
        contenedor.appendChild(articuloDiv);
    });
}

function buscarArticulos() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const articulosFiltrados = articulos.filter(articulo => 
        articulo.nombreProducto.toLowerCase().includes(input)
    );
    mostrarArticulosFiltrados(articulosFiltrados);
}

function mostrarArticulosFiltrados(articulosFiltrados) {
    const contenedor = document.getElementById('contenedor-articulos');
    contenedor.innerHTML = ''; 
    
    articulosFiltrados.forEach(articulo => {
        const articuloDiv = document.createElement('div');
        articuloDiv.classList.add('articulo');
        
        const tallasDiv = document.createElement('div');
        tallasDiv.classList.add('tallas');
        articulo.talleProducto.forEach(talla => {
            const tallaBtn = document.createElement('button');
            tallaBtn.textContent = talla;
            tallaBtn.classList.add('talla-btn');
            tallaBtn.onclick = () => {
                seleccionarTalla(talla, articulo.id);
            };
            tallasDiv.appendChild(tallaBtn);
        });
        
        const precioConIVA = (articulo.precioProducto * (1 + IVA)).toFixed(2);

        articuloDiv.innerHTML = `
            <img src="${articulo.imagenUrl}" alt="${articulo.nombreProducto}">
            <h3>${articulo.nombreProducto}</h3>
            <p>Precio: $${precioConIVA}</p>
        `;
        
        articuloDiv.appendChild(tallasDiv);
        
        contenedor.appendChild(articuloDiv);
    });
}

function seleccionarTalla(talla, articuloId) {
    const articulo = articulos.find(a => a.id === articuloId);
    if (articulo) {
        let cantidad = parseInt(prompt(`¿Cuántas unidades deseas de ${articulo.nombreProducto} (${talla})?`), 10);
        if (isNaN(cantidad) || cantidad <= 0) {
            alert("Cantidad no válida. Debes ingresar un número positivo.");
        } else {
            let itemEnCarrito = carrito.find(item => item.articulo.id === articulo.id && item.talla === talla);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad += cantidad;
            } else {
                carrito.push({ articulo, cantidad, talla });
            }
            actualizarContadorCarrito();
            alert(`Has añadido ${cantidad} unidad(es) de ${articulo.nombreProducto} (${talla}) al carrito.`);
        }
    } else {
        alert("Artículo no encontrado.");
    }
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
            const precioConIVA = (item.articulo.precioProducto * (1 + IVA)).toFixed(2);
            const subtotal = (item.cantidad * item.articulo.precioProducto * (1 + IVA)).toFixed(2);
            resumenCarrito += `
            <div class="cart-item">
                <img src="${item.articulo.imagenUrl}" alt="${item.articulo.nombreProducto}" width="50">
                <p><strong>Artículo:</strong> ${item.articulo.nombreProducto}</p>
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
    actualizarContadorCarrito();
    mostrarCarrito();
}

function eliminarArticulo(index) {
    carrito.splice(index, 1);
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

    alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");

    carrito = [];
    actualizarContadorCarrito();
    mostrarCarrito(); 
}


window.onload = function() {
    mostrarArticulos();
    mostrarMenu();
};

const opcionesMenu = {
    '1': submenuRemeras,
    '2': submenuBuzos,
    '3': submenuAccesorios,
    '4': verCarrito,
    '5': submenuMediosDePago,
    '6': () => alert("Saliendo. ¡Hasta luego!")
};

function mostrarMenu() {
    let opcion;
    do {
        opcion = prompt(
            "Elige una opción:\n" +
            "1. Comprar remeras\n" +
            "2. Comprar buzos\n" +
            "3. Comprar accesorios\n" +
            "4. Ver carrito\n" +
            "5. Medios de pago\n" +
            "6. Salir"
        );

        const accion = opcionesMenu[opcion];
        if (accion) {
            accion();
        } else {
            alert("Opción no válida. Por favor, elige una opción entre 1 y 6.");
        }
    } while (opcion !== '6');
}

function manejarSubmenu(opciones, mensaje) {
    let opcion;
    do {
        opcion = prompt(mensaje);

        const accion = opciones[opcion];
        if (accion === null) {
            alert("Volviendo al menú principal.");
            break;
        } else if (typeof accion === 'number') {
            manejarArticulo(accion);
        } else if (typeof accion === 'function') {
            accion();
        } else {
            alert("Opción no válida. Por favor, elige una opción correcta.");
        }
    } while (!opciones[opcion] || (opcion !== '9' && opcion !== '14' && opcion !== '19' && opcion !== '4'));
}

function manejarArticulo(id) {
    const articulo = articulos.find(a => a.id === id);
    if (articulo) {
        const talla = prompt("Selecciona la talla: " + articulo.talleProducto.join(', '));
        if (articulo.talleProducto.includes(talla)) {
            const cantidad = parseInt(prompt("¿Cuántas unidades deseas agregar al carrito?"), 10);
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Cantidad no válida. Debe ser un número mayor que 0.");
            } else {
                seleccionarTalla(talla, articulo.id);
            }
        } else {
            alert("Talla no válida. Por favor, elige una talla disponible.");
        }
    } else {
        alert("Artículo no válido.");
    }
}

function submenuRemeras() {
    manejarSubmenu(
        {
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': null
        },
        "Acá tenemos estas opciones para vos:\n" +
        "1. Remera Basic\n" +
        "2. Remera Double\n" +
        "3. Remera Dragon\n" +
        "4. Remera Good Luck\n" +
        "5. Remera Some Luck\n" +
        "6. Remera Some Love\n" +
        "7. Remera Oval\n" +
        "8. Remera Fire\n" +
        "9. Volver al menú principal"
    );
}

// Función para el submenú de buzos
function submenuBuzos() {
    manejarSubmenu(
        {
            '10': 10,
            '11': 11,
            '12': 12,
            '13': 13,
            '14': null
        },
        "Acá tenemos estas opciones para vos:\n" +
        "10. Buzo Incoherent\n" +
        "11. Buzo Some Love\n" +
        "12. Buzo Some Luck\n" +
        "13. Buzo Star\n" +
        "14. Volver al menú principal"
    );
}

// Función para el submenú de accesorios
function submenuAccesorios() {
    manejarSubmenu(
        {
            '15': 15,
            '16': 16,
            '17': 17,
            '18': 18,
            '19': null
        },
        "Acá tenemos estas opciones para vos:\n" +
        "15. Balaclava Rayden\n" +
        "16. Balaclava Spider\n" +
        "17. Medias Puas\n" +
        "18. Medias Shine\n" +
        "19. Volver al menú principal"
    );
}

// Función para el submenú de medios de pago
function submenuMediosDePago() {
    manejarSubmenu(
        {
            '1': () => alert("Has elegido el medio de pago número 1."),
            '2': () => alert("Has elegido el medio de pago número 2."),
            '3': () => alert("Has elegido el medio de pago número 3."),
            '4': null
        },
        "Elegiste medios de pago. Elige una opción:\n" +
        "1. Tarjeta de crédito\n" +
        "2. MercadoPago\n" +
        "3. Transferencia bancaria\n" +
        "4. Volver al menú principal"
    );
}