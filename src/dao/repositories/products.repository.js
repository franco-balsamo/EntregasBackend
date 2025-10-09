import { ProductModel } from '../../models/product.model.js';

class ProductsRepository {
  async getById(id) {
    return ProductModel.findById(id).lean();
  }

  async create(data) {
    const doc = await ProductModel.create(data);
    return doc.toObject();
  }

  async updateById(id, patch) {
    return ProductModel.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id).lean();
  }

  async paginate(filter = {}, { limit = 10, page = 1, sort = null } = {}) {
    const l = Number(limit), p = Number(page);
    const query = ProductModel.find(filter);
    if (sort) query.sort(sort);
    const [items, total] = await Promise.all([
      query.skip((p - 1) * l).limit(l).lean(),
      ProductModel.countDocuments(filter)
    ]);
    return { items, total, page: p, pages: Math.max(1, Math.ceil(total / l)) };
  }

  async decStockIfEnough(pid, qty) {
    const r = await ProductModel.updateOne(
      { _id: pid, stock: { $gte: qty } },
      { $inc: { stock: -qty } }
    );
    return r.modifiedCount === 1;
  }
}

export default new ProductsRepository();
