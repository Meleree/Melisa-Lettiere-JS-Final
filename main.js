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
        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.min = '1';
        cantidadInput.value = '1';
        cantidadInput.classList.add('cantidad-input');
        
        const confirmarBtn = document.createElement('button');
        confirmarBtn.textContent = 'Confirmar';
        confirmarBtn.onclick = () => {
            const cantidad = parseInt(cantidadInput.value, 10);
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
                ocultarFormulario();
                mostrarCarrito();
            }
        };
        
        const cancelarBtn = document.createElement('button');
        cancelarBtn.textContent = 'Cancelar';
        cancelarBtn.onclick = ocultarFormulario;

        const formulario = document.createElement('div');
        formulario.classList.add('formulario');
        formulario.innerHTML = `
            <p>¿Cuántas unidades deseas de ${articulo.nombreProducto} (${talla})?</p>
        `;
        formulario.appendChild(cantidadInput);
        formulario.appendChild(confirmarBtn);
        formulario.appendChild(cancelarBtn);
        
        document.body.appendChild(formulario);
    } else {
        alert("Artículo no encontrado.");
    }
}

function ocultarFormulario() {
    const formulario = document.querySelector('.formulario');
    if (formulario) {
        formulario.remove();
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
            total += parseFloat(subtotal);
            resumenCarrito += `
                <div>
                    <p>Artículo: ${item.articulo.nombreProducto}</p>
                    <p>Talla: ${item.talla}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>Subtotal: $${subtotal}</p>
                    <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            `;
        });
        
        const totalConIVA = total.toFixed(2);
        resumenCarrito += `<p>Total: $${totalConIVA}</p>`;
        
        cartContents.innerHTML = resumenCarrito;
    }
    
    cartOverlay.style.display = 'flex';
}

function ocultarCarrito() {
    document.getElementById('cartOverlay').style.display = 'none';
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    mostrarCarrito();
    actualizarContadorCarrito();
}

function finalizarCompra() {
    if (carrito.length > 0) {
        alert("Compra finalizada. ¡Gracias por su compra!");
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito)); 
        actualizarContadorCarrito();
        ocultarCarrito();
    } else {
        alert("El carrito está vacío.");
    }
}

function actualizarContadorCarrito() {
    const contador = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('contador-carrito').textContent = contador;
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarArticulos();
    actualizarContadorCarrito();
    
    document.getElementById('searchInput').addEventListener('input', buscarArticulos);
    document.getElementById('cartButton').addEventListener('click', mostrarCarrito);
    document.getElementById('cartClose').addEventListener('click', ocultarCarrito);
    document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
});