import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    salePrice: Number,
    image: String,
    quantity: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  date: { type: Date, default: Date.now },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  comment: { type: String },
  cancellationReason: { type: String },
  usedBonus: { type: Number, default: 0 },
  promoCode: { type: String },
  promoDiscount: { type: Number, default: 0 },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema); 