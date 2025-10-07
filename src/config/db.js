//import mongoose from 'mongoose';
//
//export default async function connectDB() {
//  await mongoose.connect(process.env.MONGODB_URI, {
//    dbName: 'backend1',
//  });
//  console.log('MongoDB conectado');
//}

import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.MONGO_URL);
  console.log('[DB] Mongo conectado');
}
