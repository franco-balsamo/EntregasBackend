//import { Router } from 'express';
//import ProductsRepository from '../dao/repositories/products.repository.js';
//import passport from 'passport';
//import { allowRoles } from '../middlewares/authorization.js';
//
//const router = Router();
//
///**
// * GET /api/products
// * Smoke test de lectura + paginado simple
// * Ej: /api/products?limit=5&page=1&sort=price:asc
// */
//router.get('/', async (req, res) => {
//  try {
//    const { limit, page, sort } = req.query;
//
//    // parse sort "campo:asc|desc" -> { campo: 1|-1 }
//    let sortOpt = null;
//    if (sort) {
//      const [field, dir] = String(sort).split(':');
//      sortOpt = { [field]: dir === 'desc' ? -1 : 1 };
//    }
//
//    const result = await ProductsRepository.paginate({}, { limit, page, sort: sortOpt });
//    res.json(result);
//  } catch (err) {
//    console.error('GET /api/products error:', err);
//    res.status(500).json({ error: 'Internal server error' });
//  }
//});
//
///**
// * POST /api/products
// * Endpoint rápido SOLO para poblar datos en desarrollo y probar el GET.
// * (Luego lo protegeremos con roles y validaciones.)
// */
//router.post('/', async (req, res) => {
//  try {
//    const { title, description = '', code, price, stock, category = '', thumbnails = [] } = req.body;
//
//    if (!title || !code || price == null || stock == null) {
//      return res.status(400).json({ error: 'title, code, price y stock son obligatorios' });
//    }
//
//    const created = await ProductsRepository.create({
//      title,
//      description,
//      code,
//      price: Number(price),
//      stock: Number(stock),
//      category,
//      thumbnails,
//      status: true,
//    });
//
//    res.status(201).json(created);
//  } catch (err) {
//    console.error('POST /api/products error:', err);
//    // Si hay duplicado de code, Mongoose manda "E11000 duplicate key error"
//    if (err.code === 11000) return res.status(409).json({ error: 'code ya existe' });
//    res.status(500).json({ error: 'Internal server error' });
//  }
//});
//
//router.post('/',
//  passport.authenticate('jwt', { session: false }),
//  allowRoles('admin'),
//  async (req, res) => {
//    // creación de producto
//  }
//);
//
//export default router;


// src/routes/products.router.js
import { Router } from 'express';
import passport from 'passport';
import { requireAuth } from '../middlewares/requireAuth.js';
import { allowRoles } from '../middlewares/authorization.js';
import ProductsRepository from '../dao/repositories/products.repository.js';

const router = Router();

// GET /api/products  (paginado + sort)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort } = req.query;

    // parse sort "campo:asc|desc" -> { campo: 1|-1 }
    let sortOpt = null;
    if (sort) {
      const [field, dir] = String(sort).split(':');
      sortOpt = { [field]: dir === 'desc' ? -1 : 1 };
    }

    const result = await ProductsRepository.paginate({}, { limit, page, sort: sortOpt });
    return res.json(result);
  } catch (err) {
    console.error('GET /api/products error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/whoami  (debug de auth: borralo cuando termines)
router.get(
  '/whoami',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({ email: req.user.email, role: req.user.role });
  }
);

// POST /api/products  (solo admin)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, _res, next) => { console.log('POST /products as', req.user?.email, req.user?.role); next(); },
  allowRoles('admin'),
  async (req, res) => {
    try {
      const { title, description = '', code, price, stock, category = '', thumbnails = [] } = req.body;

      if (!title || !code || price == null || stock == null) {
        return res.status(400).json({ error: 'title, code, price y stock son obligatorios' });
      }

      const created = await ProductsRepository.create({
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
        thumbnails,
        status: true
      });

      return res.status(201).json(created);
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ error: 'code ya existe' });
      }
      console.error('POST /api/products error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/products/:pid  (solo admin)
router.put('/:pid',
  requireAuth,
  allowRoles('admin'),
  async (req, res) => {
    const { pid } = req.params;
    const patch = req.body;
    try {
      const updated = await ProductsRepository.updateById(pid, patch);
      if (!updated) return res.status(404).json({ error: 'product not found' });
      res.json(updated);
    } catch (e) {
      console.error('PUT /api/products/:pid error:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/products/:pid  (solo admin) — (opcional ahora)
router.delete('/:pid',
  requireAuth,
  allowRoles('admin'),
  async (req, res) => {
    const { pid } = req.params;
    try {
      const deleted = await ProductsRepository.deleteById(pid);
      if (!deleted) return res.status(404).json({ error: 'product not found' });
      res.json({ status: 'ok', id: pid });
    } catch (e) {
      console.error('DELETE /api/products/:pid error:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
