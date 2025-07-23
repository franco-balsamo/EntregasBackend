//import { Router } from 'express';
//import Cart from '../models/cartsModel.js';
//import Product from '../models/productsModel.js';
//
//const router = Router();
//
//// Vista principal con productos paginados y selector de carrito
//router.get('/products', async (req, res) => {
//  const { limit = 10, page = 1, sort, query, cartId } = req.query;
//
//  // Traer todos los carritos para el selector
//  const carts = await Cart.find().lean();
//
//  // Armar filtros
//  const filter = query
//    ? { $or: [{ category: query }, { status: query === 'available' }] }
//    : {};
//  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
//
//  // Paginar productos
//  const result = await Product.paginate(filter, {
//    limit,
//    page,
//    sort: sortOption,
//    lean: true
//  });
//
//  const { docs: products, ...pagination } = result;
//
//  // Enlaces de paginación
//  const baseUrl = `/products?limit=${limit}`
//    + `${query ? `&query=${query}` : ''}`
//    + `${sort ? `&sort=${sort}` : ''}`
//    + `${cartId ? `&cartId=${cartId}` : ''}`;
//  const prevLink = pagination.hasPrevPage ? `${baseUrl}&page=${pagination.prevPage}` : null;
//  const nextLink = pagination.hasNextPage ? `${baseUrl}&page=${pagination.nextPage}` : null;
//
//  res.render('home', {
//    carts,
//    cartId: cartId || '',
//    products,
//    ...pagination,
//    prevLink,
//    nextLink
//  });
//});
//
//// Vista detalle de producto (opcional)
//router.get('/products/:pid', async (req, res) => {
//  const product = await Product.findById(req.params.pid).lean();
//  const cartId = req.query.cartId || '';
//  res.render('productDetail', { product, cartId });
//});
//
//// Página de productos en tiempo real
//router.get('/realtimeproducts', (req, res) => {
//  res.render('realTimeProducts');
//});
//
//export default router;


import { Router } from 'express';
import Product from '../models/productsModel.js';
import Cart from '../models/cartsModel.js';

const router = Router();

// --- LISTA DE PRODUCTOS PAGINADOS ---
// GET /products?limit=10&page=1&sort=asc&query=category
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = query
    ? { $or: [{ category: query }, { status: query === 'available' }] }
    : {};
  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

  const result = await Product.paginate(filter, {
    limit,
    page,
    sort: sortOption,
    lean: true,
  });

  const { docs: products, ...pagination } = result;

  const baseUrl = `/products?limit=${limit}`
    + `${query ? `&query=${query}` : ''}`
    + `${sort ? `&sort=${sort}` : ''}`;

  const prevLink = pagination.hasPrevPage ? `${baseUrl}&page=${pagination.prevPage}` : null;
  const nextLink = pagination.hasNextPage ? `${baseUrl}&page=${pagination.nextPage}` : null;

  res.render('products', {
    products,
    ...pagination,
    prevLink,
    nextLink,
  });
});

// --- DETALLE PRODUCTO ---
// GET /products/:pid
router.get('/products/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.render('productDetail', { product });
});

// --- DETALLE CARRITO ---
// GET /carts/:cid
router.get('/carts/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  if (!cart) {
    return res.status(404).send('Carrito no encontrado');
  }
  res.render('cartDetail', { cart });
});

export default router;
