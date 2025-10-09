import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name:  { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, index: true, trim: true },
  age:        { type: Number, default: null },     
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null }, 
  role:       { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
