//import mongoose from 'mongoose'
//
//const userSchema = new mongoose.Schema({
//  first_name: { type: String, required: true },
//  last_name:  { type: String, required: true },
//  email:      { type: String, required: true, unique: true, index: true },
//  age:        { type: Number, required: true },
//  password:   { type: String, required: true },
//  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: null },
//  role:       { type: String, enum: ['user', 'admin'], default: 'user' }
//}, { timestamps: true })
//
//export const UserModel = mongoose.model('users', userSchema)


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name:  { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, index: true, trim: true },
  age:        { type: Number, default: null },      // <- opcional
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null }, // <- ref al model name
  role:       { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
