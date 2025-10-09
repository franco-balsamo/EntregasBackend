import { Router } from 'express';
import passport from 'passport';
import { requireAuth } from '../middlewares/requireAuth.js';
import { allowRoles } from '../middlewares/authorization.js';
import ProductsRepository from '../dao/repositories/products.repository.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort } = req.query;

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
