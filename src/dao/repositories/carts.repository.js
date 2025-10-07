//import { CartModel } from '../../models/cart.model.js';
//
//class CartsRepository {
//  async create(data = { products: [] }) {
//    const doc = await CartModel.create(data);
//    return doc.toObject();
//  }
//
//  async getById(id) {
//    return await CartModel.findById(id)
//      .populate('products.product')
//      .lean();
//  }
//
//  async pushProduct(cid, pid, qty = 1) {
//    return await CartModel.findByIdAndUpdate(
//      cid,
//      { $push: { products: { product: pid, quantity: qty } } },
//      { new: true }
//    ).lean();
//  }
//
//  async setProducts(cid, products) {
//    return await CartModel.findByIdAndUpdate(
//      cid,
//      { $set: { products } },
//      { new: true }
//    ).lean();
//  }
//
//  async empty(cid) {
//    return await CartModel.findByIdAndUpdate(
//      cid,
//      { $set: { products: [] } },
//      { new: true }
//    ).lean();
//  }
//}
//
//export default new CartsRepository();

// src/dao/repositories/carts.repository.js
import { CartModel } from '../../models/cart.model.js';

class CartsRepository {
  async create(data = { products: [] }) {
    const doc = await CartModel.create(data);
    return doc.toObject();              // <- importante para tener _id plano
  }
  async getById(id) {
    return await CartModel.findById(id)
      .populate('products.product')
      .lean();
  }
  async pushProduct(cid, pid, qty = 1) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { $push: { products: { product: pid, quantity: qty } } },
      { new: true }
    ).lean();
  }
  async setProducts(cid, products) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { $set: { products } },
      { new: true }
    ).lean();
  }
  async empty(cid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    ).lean();
  }
}
export default new CartsRepository();
