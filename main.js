let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
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
            localStorage.setItem('carrito', JSON.stringify(carrito)); 
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
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    actualizarContadorCarrito();
    mostrarCarrito();
}

function eliminarArticulo(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
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
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    actualizarContadorCarrito();
    mostrarCarrito(); 
}

window.onload = function() {
    mostrarArticulos();
    mostrarCarrito(); 
    actualizarContadorCarrito(); 

    document.getElementById('searchInput').addEventListener('input', buscarArticulos);
    document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
    document.getElementById('cartClose').addEventListener('click', ocultarCarrito);
};