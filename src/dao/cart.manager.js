// cart.manager.js
import CartRepository from '../repositories/cart.repository.js';

export default class CartsManager {
  static async addCart() {
    return CartRepository.addCart();
  }

  static async getCartById(cartId) {
    return CartRepository.getCartById(cartId);
  }

  static async addProductToCart(cartId, productId, quantity) {
    return CartRepository.addProductToCart(cartId, productId, quantity);
  }

  static async removeProductFromCart(cartId, productId) {
    return CartRepository.removeProductFromCart(cartId, productId);
  }

  static async updateCart(cartId, newProducts) {
    return CartRepository.updateCart(cartId, newProducts);
  }

  static async updateProductQuantity(cartId, productId, newQuantity) {
    return CartRepository.updateProductQuantity(cartId, productId, newQuantity);
  }

  static async removeAllProductsFromCart(cartId) {
    return CartRepository.removeAllProductsFromCart(cartId);
  }

  static async filterFailedPurchases(cart, failedProductIds) {
    return CartRepository.filterFailedPurchases(cart, failedProductIds);
  }

}
