import { TicketModel } from '../../models/ticket.model.js';

class TicketsRepository {
  async create(data) {
    const doc = await TicketModel.create(data);
    return doc.toObject();
  }

  async getByCode(code) {
    return await TicketModel.findOne({ code }).lean();
  }
}

export default new TicketsRepository();
