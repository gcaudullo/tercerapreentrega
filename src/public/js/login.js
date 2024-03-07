document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: document.getElementsByName("email")[0].value,
                password: document.getElementsByName("password")[0].value,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const tokenString = String(data.token).trim();

            // Almacena el token en localStorage
            localStorage.setItem("token", tokenString);

            // Decodifica el token para obtener el cartId
            const decodedToken = jwt_decode(tokenString);
            const cartId = decodedToken ? decodedToken.cart_id : null;

            // Almacena el cartId en localStorage
            localStorage.setItem("cartId", cartId);

            console.log('Token y cartId almacenados en localStorage:', tokenString, cartId);
            window.location.href = "/views"; // Redirige a la página principal
        } else {
            // Manejar otros casos según sea necesario
            console.error('Error en la respuesta del servidor:', response.status);
        }
    } catch (error) {
        console.error('Error in login:', error);
    }
});
