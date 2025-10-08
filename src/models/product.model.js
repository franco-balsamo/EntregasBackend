import mongoose from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true }, 
  code:        { type: String, required: true, unique: true, index: true },
  price:       { type: Number, required: true, min: 0 },
  status:      { type: Boolean, default: true },
  stock:       { type: Number, required: true, min: 0 },
  category:    { type: String, default: '', trim: true }, 
  thumbnails:  { type: [String], default: [] }
});

// productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);

