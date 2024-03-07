// carts.controller.js
import CartsService from '../services/carts.service.js';

export default class CartsController {
    static async addCart(req) {
        try {
            const result = await CartsService.createCart();
            return { status: 201, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async getCartById(req) {
        const cartId = req.params.cid;

        try {
            const result = await CartsService.getCartById(cartId);
            return { status: 200, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async addProductToCart(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            const result = await CartsService.addProductToCart(cartId, productId, quantity);
            return { status: 201, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async removeProductFromCart(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {
            const result = await CartsService.removeProductFromCart(cartId, productId);
            return { status: 200, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async updateCart(req) {
        const cartId = req.params.cid;
        const products = req.body.products;

        try {
            const result = await CartsService.updateCart(cartId, products);
            return { status: 200, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async updateProductQuantity(req) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        try {
            const result = await CartsService.updateProductQuantity(cartId, productId, quantity);
            return { status: 200, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async removeAllProductsFromCart(req) {
        const cartId = req.params.cid;

        try {
            const result = await CartsService.removeAllProductsFromCart(cartId);
            return { status: 200, data: result };
        } catch (error) {
            console.error(error);
            throw { status: error.status || 500, error: error.error || 'Internal Server Error' };
        }
    }

    static async purchaseCart(cartId, userId) {
        try {
            const result = await CartsService.purchaseCart(cartId, userId);
            return { status: 200, data: result };
        } catch (error) {
            throw error;
        }
    }

    static async getCartId(req) {
        try {
            // Obtener el usuario desde el token
            const userId = req.user.id;

            // Obtener el cartId del usuario desde tu base de datos o cualquier almacenamiento
            const cartId = await CartsService.getCartIdByUserId(userId);

            if (cartId) {
                return { status: 200, data: { cartId } };
            } else {
                return { status: 404, data: { error: 'CartId no encontrado para este usuario' } };
            }
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Internal Server Error' };
        }
    }
}
