//import mongoose from 'mongoose';
//
//const cartSchema = new mongoose.Schema({
//  products: [
//    {
//      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//      quantity: { type: Number, default: 1 }
//    }
//  ]
//}, { timestamps: true });
//
//export default mongoose.model('Cart', cartSchema);

// src/models/cart.model.js
import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
               quantity: { type: Number, default: 1, min: 1 } }]
}, { timestamps: true });

export const CartModel = mongoose.model('Cart', cartSchema); // <- model name 'Cart' (colección 'carts')
