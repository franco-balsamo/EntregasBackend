// routes/views.router.js
import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  const productos = await manager.getAllProducts();
  //console.log('Productos cargados:', productos);
  res.render('home', { productos });
});

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts');
});

export default router;

