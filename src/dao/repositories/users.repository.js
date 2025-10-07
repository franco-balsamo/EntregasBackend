import { UserModel } from '../../models/user.model.js';

class UsersRepository {
  async create(data) {
    const doc = await UserModel.create(data);
    return doc.toObject();
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email }).lean();
  }

  async getById(id) {
    return await UserModel.findById(id).lean();
  }

  async updateById(id, patch) {
    return await UserModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }
}

export default new UsersRepository();
