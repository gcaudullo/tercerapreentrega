import ProductsManager from '../dao/product.manager.js';

class ProductsService {
    static async getProducts(criteria, options) {
        try {
            return ProductsManager.getProducts(criteria, options);
        } catch (error) {
            console.error('Error in ProductService.getProducts:', error);
            throw error;
        }
    }

    static async getProductById(productId) {
        try {
            return ProductsManager.getProductById(productId);
        } catch (error) {
            console.error('Error in ProductService.getProductById:', error);
            throw error;
        }
    }

    static async addProduct(productData) {
        try {
            return ProductsManager.addProduct(productData);
        } catch (error) {
            console.error('Error in ProductService.addProduct:', error);
            throw error;
        }
    }

    static async updateProduct(id, data) {
        try {
            return ProductsManager.updateProduct(id, data);
        } catch (error) {
            console.error('Error in ProductService.updateProduct:', error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            return ProductsManager.deleteProduct(id);
        } catch (error) {
            console.error('Error in ProductService.deleteProduct:', error);
            throw error;
        }
    }

    static async updateProductStock(productId, newStock) {
        try {
            return ProductsManager.updateProduct(productId, { stock: newStock });
        } catch (error) {
            console.error('Error in ProductService.updateProductStock:', error);
            throw error;
        }
    }
}

export default ProductsService;
