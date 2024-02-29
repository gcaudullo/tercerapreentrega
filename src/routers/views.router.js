import express from 'express';
import ProductsService from '../services/products.service.js';
import CartsService from '../services/carts.service.js';
import { buildResponsePaginated } from '../utils.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.redirect('/views/login');
  }
  try {
    res.render('profile', { title: 'Bienvenido a nuestro Ecommerce', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error rendering profile.' });
  }
});

router.get('/login', async (req, res) => {
  res.render('login', { title: 'Bienvenido a nuestro Ecommerce' });
});

router.get('/register', async (req, res) => {
  res.render('register', { title: 'Bienvenido a nuestro Ecommerce' });
});

router.get('/recovery-pass', async (req, res) => {
  res.render('recovery-pass', { title: 'Bienvenido a nuestro Ecommerce' });
});

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, category } = req.query;
  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }
  if (category) {
    criteria.category = category;
  }

  try {
    const products = await ProductsService.getProducts(criteria, options);
    const data = buildResponsePaginated({ ...products, sort, category }, 'http://localhost:8080/views');
    const user = req.user;
    res.render('home', { title: 'Productos 🚀', products: data, welcomeMessage: user ? `Bienvenido, ${user.first_name}! <br>Rol: ${user.role}` : '' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obtaining products.' });
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Real Time Products 😎' });
});

router.get('/chat', (req, res) => {
  res.render('chat', { title: 'Chat de nuestro ecommerce 😎' });
});

router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartsService.getCartById(cartId);
    if (cart === -1) {
      res.status(404).json({ error: 'There is no cart with that ID.' });
    } else {
      // Imprimir la estructura del objeto cart en la consola
      console.log('Cart structure:', JSON.stringify(cart, null, 2));

      // Renderiza la vista de carrito con los productos
      res.render('cart', { title: 'Carrito de Compras', cart: cart.products });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obtaining cart.' });
  }
});


export default router;
