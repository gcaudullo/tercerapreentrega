document.addEventListener('DOMContentLoaded', async () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    try {
        // Intenta obtener el token almacenado en las cookies
        const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        console.log('token', token);

        if (token) {
            // Realiza una solicitud al backend para obtener el cartId
            const response = await fetch('/api/getCartId', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluye el token en el encabezado de autorización
                },
            });

            if (response.ok) {
                const { cartId } = await response.json();

                addToCartButtons.forEach((button) => {
                    button.addEventListener('click', async (event) => {
                        event.preventDefault();
                        const productId = button.getAttribute('data-product-id');

                        // Realiza otra solicitud al backend para agregar el producto al carrito
                        const addToCartResponse = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado de autorización
                            },
                            body: JSON.stringify({ quantity: 1 }),  // Añade la cantidad al cuerpo de la solicitud
                        });

                        if (addToCartResponse.ok) {
                            console.log('Producto agregado al carrito correctamente');
                            // Aquí puedes agregar lógica adicional si es necesario, como actualizar la UI
                        } else {
                            console.error('Error al agregar el producto al carrito');
                        }
                    });
                });
            } else {
                console.error('Error al obtener el cartId del servidor');
            }
        } else {
            console.error('Token no encontrado');
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
    }
});


document.getElementById('checkoutBtn').addEventListener('click', async () => {
    try {
        // Intenta obtener el token almacenado en las cookies
        const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        console.log('Token:', token);

        if (token) {
            // Realiza una solicitud al backend para obtener el cartId
            const cartIdResponse = await fetch('/api/getCartId', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (cartIdResponse.ok) {
                const { cartId } = await cartIdResponse.json();
                console.log('CartId:', cartId);

                // Realiza la solicitud de compra al backend utilizando el cartId obtenido
                const purchaseResponse = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await purchaseResponse.json();

                // Aquí puedes manejar la respuesta del servidor, por ejemplo, mostrar un mensaje al usuario
                alert(result.message);

                // Redirigir al usuario a otra página, si es necesario
                window.location.href = '/views/success'; // Cambia esto según tu estructura de rutas
            } else {
                console.error('Error al obtener el cartId del servidor');
            }
        } else {
            console.error('Token no encontrado');
        }
    } catch (error) {
        console.error('Error durante el proceso de compra:', error);
        // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
        alert('Error during checkout. Please try again.');
    }
});
