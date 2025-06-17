// products.js
import { Router } from 'express';
import ProductManager from '../managers/productManager.js';

const router = Router();
const manager = new ProductManager();

// GET / → Obtiene todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await manager.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /:pid → Obtiene un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('Error al buscar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST / → Crea un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
  }

  try {
    const newProduct = await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /:pid → Actualiza un producto
router.put('/:pid', async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /:pid → Elimina un producto
router.delete('/:pid', async (req, res) => {
  try {
    const success = await manager.deleteProduct(req.params.pid);
    if (!success) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
