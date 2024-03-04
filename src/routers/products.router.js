import express from 'express';
import ProductsController from '../controllers/products.controllers.js';
import { authMiddleware, authRolesMiddleware, buildResponsePaginated, generateProduct } from '../utils.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category } = req.query;
        const products = await ProductsController.getProducts(req);

        res.status(200).json(buildResponsePaginated({ ...products, sort, category }));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining products.' });
    }
});

router.get('/products/:pId', authMiddleware('jwt'), authRolesMiddleware(['user', 'admin']), async (req, res) => {
    try {
        const product = await ProductsController.getProductById(req);
        if (!product) {
            res.status(404).json({ error: 'Product not found! 😨' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining product.' });
    }
});

router.post('/products', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res) => {
    try {
        const newProduct = await ProductsController.addProduct(req);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product.' });
    }
});

router.put('/products/:pid', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res) => {
    try {
        await ProductsController.updateProduct(req);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

router.delete('/products/:pid', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res) => {
    try {
        await ProductsController.deleteProduct(req);
        res.status(200).json({ message: 'Product successfully removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

router.get('/mockingproducts', async (req, res) => {
    const products = [];
    for (let index = 0; index < 100; index++) {
        products.push(generateProduct());
    }
    res.status(200).json(products);
});

export default router;
