import ProductRepository from '../repositories/product.repository.js';

class ProductService {
  static async getProducts(criteria, options) {
    try {
      return ProductRepository.getProducts(criteria, options);
    } catch (error) {
      console.error('Error in ProductService.getProducts:', error);
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      return ProductRepository.getProductById(productId);
    } catch (error) {
      console.error('Error in ProductService.getProductById:', error);
      throw error;
    }
  }

  static async addProduct(productData) {
    try {
      return ProductRepository.addProduct(productData);
    } catch (error) {
      console.error('Error in ProductService.addProduct:', error);
      throw error;
    }
  }

  static async updateProduct(id, data) {
    try {
      return ProductRepository.updateProduct(id, data);
    } catch (error) {
      console.error('Error in ProductService.updateProduct:', error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      return ProductRepository.deleteProduct(id);
    } catch (error) {
      console.error('Error in ProductService.deleteProduct:', error);
      throw error;
    }
  }

  static async updateProductStock(productId, newStock) {
    try {
      return ProductRepository.updateProduct(productId, { stock: newStock });
    } catch (error) {
      console.error('Error in ProductService.updateProductStock:', error);
      throw error;
    }
  }
}

export default ProductService;
