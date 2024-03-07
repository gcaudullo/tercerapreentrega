document.addEventListener('DOMContentLoaded', async () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    console.log(addToCartButtons);  // Verifica si los botones se seleccionan correctamente

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
