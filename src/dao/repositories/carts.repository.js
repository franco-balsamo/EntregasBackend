import { CartModel } from '../../models/cart.model.js';

class CartsRepository {
  async create(data = { products: [] }) {
    const doc = await CartModel.create(data);
    return doc.toObject();
  }

  async getById(id) {
    return CartModel.findById(id).populate('products.product').lean();
  }

  async pushProduct(cid, pid, qty = 1) {
    return CartModel.findByIdAndUpdate(
      cid,
      { $push: { products: { product: pid, quantity: qty } } },
      { new: true }
    ).lean();
  }

  async setProducts(cid, products) {
    return CartModel.findByIdAndUpdate(
      cid,
      { $set: { products } },
      { new: true }
    ).lean();
  }

  async empty(cid) {
    return CartModel.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    ).lean();
  }
}

export default new CartsRepository();
