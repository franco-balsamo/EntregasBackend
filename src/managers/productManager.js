// productManager.js
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const productsPath = './src/data/products.json';

export default class ProductManager {
  generateUniqueNumericId(products) {
    let id;
    do {
      id = Math.floor(10000 + Math.random() * 90000);
    } while (products.some(p => String(p.id) === String(id)));
    return id;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(productsPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error leyendo los productos:', err);
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find(p => String(p.id) === String(id));
  }

  async addProduct(product) {
    const products = await this.getAllProducts();

    if (!product || typeof product !== 'object') {
      console.warn('Producto inválido');
      return null;
    }

    const newProduct = {
      ...product,
      id: this.generateUniqueNumericId(products)
    };
    products.push(newProduct);

    try {
      await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
      console.log(`Producto agregado con ID: ${newProduct.id}`);
      return newProduct;
    } catch (err) {
      console.error('Error escribiendo productos:', err);
      throw err;
    }
  }

  async updateProduct(id, data) {
    const products = await this.getAllProducts();
    const index = products.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      console.warn(`Producto con ID ${id} no encontrado para actualización.`);
      return null;
    }

    products[index] = { ...products[index], ...data, id: products[index].id };

    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    console.log(`Producto con ID ${id} actualizado.`);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getAllProducts();
    const filtered = products.filter(p => String(p.id) !== String(id));

    if (filtered.length === products.length) {
      console.warn(`No se encontró ningún producto con ID: ${id} para eliminar.`);
      return false;
    }

    await fs.writeFile(productsPath, JSON.stringify(filtered, null, 2));
    console.log(`Producto con ID ${id} eliminado.`);
    return true;
  }
}
