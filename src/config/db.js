import mongoose from 'mongoose';

export default async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'backend1',
  });
  console.log('MongoDB conectado');
}
