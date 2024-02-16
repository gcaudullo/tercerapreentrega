import ProductsManager from '../dao/product.manager.js';
import CartsManager from '../dao/cart.manager.js';
import express from 'express';
import { buildResponsePaginated } from '../utils.js';
const router = express.Router();

router.get('/profile', async (req, res) => {
  // Comprueba si hay un usuario en la sesión
  const user = req.user;
  // Si no hay usuario, redirige al inicio de sesión
  if (!user) {
    return res.redirect('/views/login');
  }
  try {
    // Renderiza la vista de perfil con los datos del usuario
    res.render('profile', { title: 'Bienvenido a nuestro Ecommerce', user });
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir al renderizar la vista
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
  // sort es por precio, posibles valores asc/desc
  // search es por category
  const criteria = {};
  const options = { limit, page }
  const user = req.user;
  if (sort) {
    options.sort = { price: sort };
  }
  if (category) {
    criteria.category = category;
  }
  try {
    const products = await ProductsManager.getProducts(criteria, options);
    const data = buildResponsePaginated({ ...products, sort, category }, 'http://localhost:8080/views');
    res.render('home', { title: 'Productos 🚀', products: data , welcomeMessage: user ? `Bienvenido, ${user.first_name}! <br>Rol: ${user.role}`:''});
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

// Ruta para visualizar un carrito específico
router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartsManager.getCartById(cartId);
    if (cart === -1) {
      res.status(404).json({ error: 'There is no cart with that ID.' });
    } else {
      // Renderiza la vista de carrito con los productos
      res.render('cart', { title: 'Carrito de Compras', cart });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obtaining cart.' });
  }
});


export default router;

