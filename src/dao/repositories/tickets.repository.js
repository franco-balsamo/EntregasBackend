import { TicketModel } from '../../models/ticket.model.js';

class TicketsRepository {
  async create(data) {
    const doc = await TicketModel.create(data);
    return doc.toObject();
  }
  async getById(id) {
    return TicketModel.findById(id).lean();
  }
}

export default new TicketsRepository();
