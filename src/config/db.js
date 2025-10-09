import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.MONGO_URI);
  console.log('[DB] Mongo conectado');
}
