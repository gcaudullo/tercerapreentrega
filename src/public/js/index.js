const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const formMessage = document.getElementById('form-message');
const socket = io();
let email = '';

if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        socket.emit('addProduct', productData);
    });
}

if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(deleteProductForm);
        const productId = formData.get('productId');
        socket.emit('deleteProduct', productId);
    });
}

if (formMessage) {
    formMessage.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('input-message');
        const newMsg = {
            user: email,
            body: input.value,
        };
        input.value = '';
        input.focus();
        socket.emit('new-message', newMsg)
    })
}

socket.on('listOfProducts', async (products) => {
    await actualizarVista(products);
});

socket.on('productAdded', async (productData) => {
    console.log('Producto agregado:', productData);
});

// Evento para eliminar un producto
socket.on('productDeleted', async (productId) => {
    console.log('Producto eliminado:', productId);
});

socket.on('update-messages', (messages) => {
    console.log('messages', messages);
    const logMessages = document.getElementById('log-messages');
    if (logMessages) {
        logMessages.innerText = '';
        messages.forEach((message) => {
            const p = document.createElement('p');
            p.innerText = `${message.user}: ${message.body}`;
            logMessages.appendChild(p);
        });
    } else {
    
    }
})

async function actualizarVista(products) {
    const productListDiv = document.getElementById('product-list');
    if (productListDiv) {
        // Limpia el contenido existente en el div.
        productListDiv.innerHTML = '';
        // Itera sobre la lista de productos y crea elementos HTML para mostrar cada producto.
        products.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
        <p><strong>Id</strong>: ${product._id}</p>
        <p><strong>Title</strong>: ${product.title}</p>
        <p><strong>Description</strong>: ${product.description}</p>
        <p><strong>Code</strong>: ${product.code}</p>
        <p><strong>Price</strong>: ${product.price}</p>
        <p><strong>Status</strong>: ${product.status}</p>
        <p><strong>Stock</strong>: ${product.stock}</p>
        <p><strong>Category</strong>: ${product.category}</p>
        <button class="addToCartBtn" data-product-id="${product._id}" data-cart-id="${user.cartId}">Agregar al Carrito</button> 
        <hr/>
      `;
            // Agrega el elemento del producto al div de la lista de productos.
            productListDiv.appendChild(productDiv);
        });
    }
}


if (formMessage) {
    Swal.fire({
        title: 'Identificate por favor 👮',
        input: 'text',
        inputLabel: 'Ingresa tu email',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitamos que ingrese su email para continuar!';
            }
        },
    })
        .then((result) => {
            email = result.value.trim();
            console.log(`Hola ${email}, bienvenido 🖐`);
        });
}

document.addEventListener('click', async (event) => {
    const button = event.target.closest('.addToCartBtn');
    console.log("click")
    if (button) {
        event.preventDefault();
        const productId = button.getAttribute('data-product-id');
        const cartId = button.getAttribute('data-cart-id');

        try {
            // Obtén el token almacenado en las cookies
            const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token=')).split('=')[1];

            // Realiza una solicitud al backend para agregar el producto al carrito
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluye el token en el encabezado de autorización
                },
                body: JSON.stringify({ quantity: 1 }),  // Añade la cantidad al cuerpo de la solicitud
            });

            if (response.ok) {
                console.log('Producto agregado al carrito correctamente');
                // Aquí puedes agregar lógica adicional si es necesario, como actualizar la UI
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
        }
    }
});
