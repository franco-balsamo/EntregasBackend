// src/routes/carts.router.js
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { allowRoles } from '../middlewares/authorization.js';
import { ownsCartOrAdmin } from '../middlewares/cartOwnership.js';
import CartsRepository from '../dao/repositories/carts.repository.js';
import ProductsRepository from '../dao/repositories/products.repository.js';

const router = Router();

// GET detalle de carrito (dueño o admin)
router.get('/:cid',
  requireAuth,
  ownsCartOrAdmin,
  async (req, res) => {
    const cart = await CartsRepository.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'cart not found' });
    res.json(cart);
  }
);

// Agregar producto (solo user, sobre su carrito)
router.post('/:cid/product/:pid',
  requireAuth,
  allowRoles('user'),        // <- solo usuarios
  ownsCartOrAdmin,           // <- y solo el dueño de ese cid
  async (req, res) => {
    const { cid, pid } = req.params;
    const qty = Number(req.body.quantity ?? 1);
    if (Number.isNaN(qty) || qty <= 0) return res.status(400).json({ error: 'quantity > 0' });

    const product = await ProductsRepository.getById(pid);
    if (!product) return res.status(404).json({ error: 'product not found' });

    const cart = await CartsRepository.getById(cid);
    if (!cart) return res.status(404).json({ error: 'cart not found' });

    // Si ya existe, sumamos quantity; si no, pusheamos
    const existing = cart.products.find(p => p.product?._id?.toString() === pid);
    if (existing) {
      existing.quantity += qty;
      const newProducts = cart.products.map(p =>
        p.product?._id?.toString() === pid ? existing : p
      );
      const updated = await CartsRepository.setProducts(cid, newProducts.map(p => ({
        product: p.product._id ?? p.product, quantity: p.quantity
      })));
      return res.json(updated);
    } else {
      const updated = await CartsRepository.pushProduct(cid, pid, qty);
      return res.json(updated);
    }
  }
);

// Setear cantidad exacta (solo user, dueño)
router.put('/:cid/product/:pid',
  requireAuth,
  allowRoles('user'),
  ownsCartOrAdmin,
  async (req, res) => {
    const { cid, pid } = req.params;
    const qty = Number(req.body.quantity);
    if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json({ error: 'quantity > 0' });

    const cart = await CartsRepository.getById(cid);
    if (!cart) return res.status(404).json({ error: 'cart not found' });

    const newProducts = cart.products.map(p =>
      p.product?._id?.toString() === pid ? { product: p.product._id ?? p.product, quantity: qty } : { product: p.product._id ?? p.product, quantity: p.quantity }
    );
    const updated = await CartsRepository.setProducts(cid, newProducts);
    res.json(updated);
  }
);

// Eliminar un producto del carrito (solo user, dueño)
router.delete('/:cid/product/:pid',
  requireAuth,
  allowRoles('user'),
  ownsCartOrAdmin,
  async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await CartsRepository.getById(cid);
    if (!cart) return res.status(404).json({ error: 'cart not found' });

    const newProducts = cart.products
      .filter(p => p.product?._id?.toString() !== pid)
      .map(p => ({ product: p.product._id ?? p.product, quantity: p.quantity }));

    const updated = await CartsRepository.setProducts(cid, newProducts);
    res.json(updated);
  }
);

// Vaciar carrito (solo user, dueño)
router.delete('/:cid',
  requireAuth,
  allowRoles('user'),
  ownsCartOrAdmin,
  async (req, res) => {
    const updated = await CartsRepository.empty(req.params.cid);
    res.json(updated);
  }
);

export default router;
