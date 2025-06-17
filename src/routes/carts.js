// carts.js
import { Router } from 'express';
import CartManager from '../managers/cartsManager.js';

const router = Router();
const manager = new CartManager();

// POST / → crear carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /:cid → productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /:cid/product/:pid → agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await manager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: 'No se pudo agregar el producto. Carrito o producto inválido.' });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
