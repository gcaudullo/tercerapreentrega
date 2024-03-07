// carts.service.js
import CartsManager from '../dao/cart.manager.js';
import ProductsService from '../services/products.service.js';
import TicketService from './ticket.sevice.js';
import UserService from './users.service.js';

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
        }catch (error) {
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

    static async purchaseCart(cartId, userId) {
        try {
            const cart = await CartsManager.getCartById(cartId);
            if (!cart) {
                return { success: false, message: 'Cart not found' };
            }
    
            const purchaseResult = await this.processPurchase(cart);
    
            // Debugging: Imprimir el purchaseResult para verificar que tiene la información esperada
            //console.log('purchaseResult:', purchaseResult);
    
            // Calcular el monto total de la compra
            const totalAmount = await Promise.all(purchaseResult.map(async (result) => {
                const cartItem = cart.products.find(item => item.product.toString() === result.productId.toString());
                //console.log('cartItem', cartItem);
                if (cartItem) {
                    const productData = await ProductsService.getProductById(cartItem.product);
                    // console.log('productData', productData);
                    // console.log('cartItem', cartItem);
                    return productData ? cartItem.quantity * productData.price : 0;
                }
                return 0;
            })).then(amounts => {
                // console.log('amounts', amounts);
                return amounts.reduce((total, amount) => total + amount, 0);
            });
    
            // Debugging: Imprimir el totalAmount para verificar su valor
            // console.log('totalAmount', totalAmount);
    
            // Generar ticket
            const ticketData = {
                purchaser: userId,
                amount: totalAmount,
                purchaseResult,
            };
    
            const ticket = await TicketService.generateTicket(ticketData);
    
            // Filtrar productos que no pudieron comprarse y actualizar el carrito
            const updatedCart = await this.filterFailedPurchases(cart, purchaseResult);
    
            return { ticket, updatedCart };
        } catch (error) {
            throw error;
        }
    }
    
    
    


    static async processPurchase(cart) {
        const purchaseResult = [];
        // Verificar si cart.products está definido y es un array
        if (!cart.products || !Array.isArray(cart.products)) {
            throw { status: 500, error: 'Invalid cart format.' };
        }
    
        for (const cartItem of cart.products) {
            try {
                const productData = await ProductsService.getProductById(cartItem.product);
                if (!productData) {
                    purchaseResult.push({ success: false, productId: cartItem.product, message: 'Product not found' });
                    continue;
                }
    
                if (productData.stock >= cartItem.quantity) {
                    // Restar del stock y continuar
                    await ProductsService.updateProductStock(cartItem.product, productData.stock - cartItem.quantity);
                    purchaseResult.push({ success: true, productId: cartItem.product, message: 'Purchase successful' });
                } else {
                    // No hay suficiente stock
                    purchaseResult.push({ success: false, productId: cartItem.product, message: 'Insufficient stock' });
                }
            } catch (error) {
                console.error('Error processing purchase:', error);
                purchaseResult.push({ success: false, productId: cartItem.product, message: 'Error processing purchase' });
            }
        }
    
        return purchaseResult;
    }
    

    static async filterFailedPurchases(cart, purchaseResult) {
        const failedProductIds = purchaseResult.filter(result => !result.success).map(result => result.productId);
    
        if (failedProductIds.length === 0) {
            // No hay productos fallidos, todos fueron comprados con éxito
            await CartsManager.removeAllProductsFromCart(cart._id);
            return null;  // Retorna null indicando que el carrito está vacío
        }
    
        const updatedCart = await CartsManager.filterFailedPurchases(cart, failedProductIds);
        return updatedCart;
    }

    static async getCartIdByUserId(userId) {
        try {
            // Obtiene el usuario y recupera el ID del carrito asociado (si existe)
            const user = await UserService.getUserById(userId);
    
            if (user && user.cartId) {
                // Si el usuario tiene un carrito asociado, devuelve su ID
                return user.cartId;
            } else {
                // Si no hay carrito asociado al usuario, crea uno nuevo y actualiza el usuario
                const newCartId = await CartsManager.addCart();
                
                // Actualiza el usuario con el nuevo ID del carrito
                await UserService.updateUserCartId(userId, newCartId);
    
                return newCartId;
            }
        } catch (error) {
            console.error('Error getting cartId by user:', error);
            throw { status: 500, error: 'Error obtaining cartId.' };
        }
    }
    
}
