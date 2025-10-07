import { ProductModel } from '../../models/product.model.js';

class ProductsRepository {
  async paginate(filter = {}, options = {}) {
    const limit = Number(options.limit ?? 10);
    const page  = Number(options.page ?? 1);
    const sort  = options.sort ?? null; // ej { price: 1 } o { price: -1 }

    const query = ProductModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    if (sort) query.sort(sort);

    const [items, total] = await Promise.all([
      query.lean(),
      ProductModel.countDocuments(filter)
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async getById(id) {
    return await ProductModel.findById(id).lean();
  }

  async create(data) {
    const doc = await ProductModel.create(data);
    return doc.toObject();
  }

  async updateById(id, patch) {
    return await ProductModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }

  async deleteById(id) {
    return await ProductModel.findByIdAndDelete(id).lean();
  }
}

export default new ProductsRepository();
