const usuarioCorrecto = "usuario";  
        const contrasenaCorrecta = "contrasena";  

        function mostrarPopup() {
            document.getElementById('loginPopup').style.display = 'block';
        }

        function cerrarPopup() {
            document.getElementById('loginPopup').style.display = 'none';
        }

        function iniciarSesion() {
            const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
            const contrasena = document.getElementById('contrasena').value;

            if (nombreUsuario === "" || contrasena === "") {
                alert("Por favor, completa ambos campos.");
            } else if (nombreUsuario === usuarioCorrecto && contrasena === contrasenaCorrecta) {
                alert("Bienvenido/a " + nombreUsuario + " a Melere");
                cerrarPopup();
                localStorage.setItem('nombreUsuario', nombreUsuario);
            } else {
                alert("Nombre de usuario o contraseña incorrectos.");
            }
        }

        let carrito = [];
        const IVA = 0.21;
        const articulos = []; 

        async function cargarArticulos() {
            try {
                const response = await fetch('./JSON/articulos.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los artículos');
                }
                const data = await response.json();
                articulos.push(...data);
                mostrarArticulos();
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
            }
        }

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
                        <button onclick="actualizarCantidad(${index}, carrito[${index}].cantidad - 1)">-</button>
                        <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${index}, this.value)">
                        <button onclick="actualizarCantidad(${index}, carrito[${index}].cantidad + 1)">+</button>
                        <button onclick="eliminarArticulo(${index})">Eliminar</button>
                    </div>
                    `;
                    total += parseFloat(subtotal);
                });
                resumenCarrito += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
                cartContents.innerHTML = resumenCarrito;
            }
        
            cartOverlay.style.display = 'flex'; 
        }
        function eliminarArticulo(index) {
            carrito.splice(index, 1); 
            actualizarContadorCarrito(); 
            mostrarCarrito(); 
        }
        
        function actualizarCantidad(index, nuevaCantidad) {
            if (nuevaCantidad < 1) {
                carrito.splice(index, 1);
                alert("El artículo ha sido eliminado del carrito.");
            } else {
                carrito[index].cantidad = nuevaCantidad;
            }
        
            actualizarContadorCarrito();
            mostrarCarrito();
        }

        function cerrarCarrito() {
            const cartOverlay = document.getElementById('cartOverlay');
            cartOverlay.style.display = 'none'; 
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
        
            function actualizarContadorCarrito() {
            const cartCount = document.getElementById('cartCount');
            cartCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
        }
        
        window.onload = function() {
            mostrarPopup();
            cargarArticulos();
        };