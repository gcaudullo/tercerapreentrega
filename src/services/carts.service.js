// carts.service.js
import CartsManager from '../dao/cart.manager.js';

export default class CartsService {
    static async createCart() {
        try {
            const cartId = await CartsManager.addCart();
            return { message: 'Cart created successfully', cartId };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error creating cart.' };
        }
    }

    static async getCartById(cartId) {
        try {
            const products = await CartsManager.getCartById(cartId);
            if (products === -1) {
                throw { status: 404, error: 'There is no cart with that ID.' };
            } else {
                return products;
            }
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error obtaining products.' };
        }
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            await CartsManager.addProductToCart(cartId, productId, quantity);
            return { message: `Product id ${productId} added to Cart id ${cartId}! 😎` };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error adding product to cart' };
        }
    }

    static async removeProductFromCart(cartId, productId) {
        try {
            await CartsManager.removeProductFromCart(cartId, productId);
            return { message: `Product id ${productId} removed from Cart id ${cartId}! 😎` };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error removing product from cart.' };
        }
    }

    static async updateCart(cartId, products) {
        try {
            await CartsManager.updateCart(cartId, products);
            return { message: `Cart id ${cartId} updated with new products! 😎` };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error updating cart.' };
        }
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        try {
            await CartsManager.updateProductQuantity(cartId, productId, quantity);
            return { message: `Product id ${productId} quantity updated in Cart id ${cartId}! 😎` };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error updating product quantity in cart.' };
        }
    }

    static async removeAllProductsFromCart(cartId) {
        try {
            await CartsManager.removeAllProductsFromCart(cartId);
            return { message: `All products removed from Cart id ${cartId}! 😎` };
        } catch (error) {
            console.error(error);
            throw { status: 500, error: 'Error removing all products from cart.' };
        }
    }
}
