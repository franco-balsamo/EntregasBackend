import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code:              { type: String, required: true, unique: true, index: true },
  purchase_datetime: { type: Date,   required: true, default: Date.now },
  amount:            { type: Number, required: true, min: 0 },
  purchaser:         { type: String, required: true, trim: true } // email del comprador
}, { timestamps: true });

export const TicketModel = mongoose.model('Ticket', ticketSchema);
