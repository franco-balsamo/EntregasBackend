// cartsManager.js
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const cartsPath = './src/data/carts.json';

export default class CartManager {
  generateUniqueNumericId(products) {
    let id;
    do {
      id = Math.floor(10000 + Math.random() * 90000);
    } while (products.some(p => String(p.id) === String(id)));
    return id;
  }

  async getAllCarts() {
    try {
      const data = await fs.readFile(cartsPath, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error leyendo los carritos:', err);
      throw err;
    }
  }

  async saveCarts(cartsList) {
    try {
      await fs.writeFile(cartsPath, JSON.stringify(cartsList, null, 2));
    } catch (err) {
      console.error('Error guardando los carritos:', err);
      throw err;
    }
  }

  async createCart() {
    const carts = await this.getAllCarts();
    const newCart = {
      id: this.generateUniqueNumericId(carts),
      products: []
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    console.log(`Nuevo carrito creado con ID: ${newCart.id}`);
    return newCart;
  }

  async getCartById(cartId) {
    const carts = await this.getAllCarts();
    return carts.find(c => String(c.id) === String(cartId));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAllCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) {
      console.log(`No se encontró el carrito con ID: ${cartId}`);
      return null;
    }

    if (!productId) {
      console.log('ID de producto no proporcionado');
      return null;
    }
    const prodStrId = String(productId);
    const existingProduct = cart.products.find(p => String(p.product) === prodStrId);

    if (existingProduct) {
      existingProduct.quantity += 1;
      console.log(`Producto ${productId} ya estaba en el carrito. Cantidad aumentada.`);
    } else {
      cart.products.push({ product: prodStrId, quantity: 1 });
      console.log(`Producto ${productId} agregado al carrito.`);
    }

    await this.saveCarts(carts);
    return cart;
  }

  
}
