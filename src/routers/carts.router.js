// carts.router.js
import CartsController from '../controllers/carts.controllers.js';
import express from 'express';
import { authMiddleware, authRolesMiddleware } from '../utils.js';

const router = express.Router();

router.post('/carts', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.addCart(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.get('/carts/:cid', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.getCartById(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.get('/getCartId', authMiddleware('jwt'), async (req, res) => {
    try {
        const result = await CartsController.getCartId(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.post('/carts/:cid/products/:pid', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.addProductToCart(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.delete('/carts/:cid/products/:pid', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.removeProductFromCart(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.put('/carts/:cid', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.updateCart(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.put('/carts/:cid/products/:pid', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    try {
        const result = await CartsController.updateProductQuantity(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.delete('/carts/:cid', async (req, res) => {
    try {
        const result = await CartsController.removeAllProductsFromCart(req);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

router.post('/carts/:cid/purchase', authMiddleware('jwt'), async (req, res) => {
    try {
        const { cid } = req.params;
        const userId = req.user.id; // Supongo que el usuario está almacenado en el token

        const result = await CartsController.purchaseCart(cid, userId);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
    }
});

export default router;
