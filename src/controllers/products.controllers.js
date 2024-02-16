import ProductsService from '../services/products.service.js';

export default class ProductsController {
    static async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, category } = req.query;
            const criteria = {};
            const options = { limit, page };

            if (sort) {
                options.sort = { price: sort };
            }

            if (category) {
                criteria.category = category;
            }

            const products = await ProductsService.getProducts(criteria, options);
            return products;
        } catch (error) {
            console.error(error);
            throw new Error('Error obtaining products.');
        }
    }

    static async getProductById(req, res) {
        try {
            const { pId } = req.params;
            const product = await ProductsService.getProductById(pId);

            if (!product) {
                throw new Error('Product not found! 😨');
            }

            return product;
        } catch (error) {
            console.error(error);
            throw new Error('Error obtaining product.');
        }
    }

    static async addProduct(req, res) {
        try {
            const newProduct = await ProductsService.addProduct(req.body);
            return newProduct;
        } catch (error) {
            console.error(error);
            throw new Error('Error adding product.');
        }
    }

    static async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const productData = req.body;
            await ProductsService.updateProduct(pid, productData);
        } catch (error) {
            console.error(error);
            throw new Error('Error updating product');
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            await ProductsService.deleteProduct(pid);
        } catch (error) {
            console.error(error);
            throw new Error('Error deleting product');
        }
    }
}
