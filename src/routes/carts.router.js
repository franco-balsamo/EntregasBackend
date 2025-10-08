// src/routes/carts.router.js
import { Router } from 'express';
import crypto from 'node:crypto';
import { requireAuth } from '../middlewares/requireAuth.js';
import { allowRoles } from '../middlewares/authorization.js';
import { ownsCartOrAdmin } from '../middlewares/cartOwnership.js';
import CartsRepository from '../dao/repositories/carts.repository.js';
import ProductsRepository from '../dao/repositories/products.repository.js';
import TicketsRepository from '../dao/repositories/tickets.repository.js';

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

// ************ PURCHASE ************
router.post('/:cid/purchase',
  requireAuth,
  allowRoles('user'),
  ownsCartOrAdmin,
  async (req, res) => {
    try {
      const { cid } = req.params;

      // 1) Traer carrito con populate (para conocer el price actual)
      const cart = await CartsRepository.getById(cid);
      if (!cart) return res.status(404).json({ error: 'cart not found' });

      const approved = [];   // { pid, qty, price }
      const rejected = [];   // { product, quantity }
      let amount = 0;

      // 2) Intentar descontar stock por cada línea del carrito
      for (const line of cart.products) {
        const pid = line.product?._id?.toString();
        const qty = Number(line.quantity);
        const price = Number(line.product?.price);

        if (!pid || !Number.isFinite(qty) || qty <= 0) continue;

        const ok = await ProductsRepository.decStockIfEnough(pid, qty);
        if (ok) {
          approved.push({ pid, qty, price });
          amount += price * qty;
        } else {
          rejected.push({ product: pid, quantity: qty });
        }
      }

      // 3) Si nada pudo procesarse, devolvés error amigable
      if (approved.length === 0) {
        return res.status(400).json({ error: 'No hay stock suficiente para los productos del carrito.' });
      }

      // 4) Crear ticket
      const ticket = await TicketsRepository.create({
        code: crypto.randomUUID(),
        amount,
        purchaser: req.user.email
      });

      // 5) Dejar en el carrito solo los no procesados
      await CartsRepository.setProducts(cid, rejected);

      // 6) Responder
      return res.json({
        status: 'success',
        ticket,
        purchasedCount: approved.length,
        unprocessedProducts: rejected
      });
    } catch (err) {
      console.error('POST /api/carts/:cid/purchase error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
