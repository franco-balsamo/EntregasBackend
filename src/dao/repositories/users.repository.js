import { UserModel } from '../../models/user.model.js';

class UsersRepository {
  async create(data) {
    const doc = await UserModel.create(data);
    return doc.toObject();
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email }).lean();
  }

  async getByEmailWithPassword(email) {
    return await UserModel.findOne({ email }).select('+password').lean();
  }

  async getById(id) {
    return await UserModel.findById(id).lean();
  }

  async getByIdWithPassword(id) {
    return await UserModel.findById(id).select('+password').lean();
  }

  async updateById(id, patch) {
    const hasOp = Object.keys(patch || {}).some(k => k.startsWith('$'));
    const update = hasOp ? patch : { $set: patch };
    return await UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }
}

export default new UsersRepository();
