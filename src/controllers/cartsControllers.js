import Cart from '../models/cartsModel.js';

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const replaceCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products: newProducts },
      { new: true }
    );
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    item.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Crear un nuevo carrito vacío
export const createCart = async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
