const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dish: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  addons: [{
    name: String,
    price: Number
  }],
  size: {
    name: String,
    price: Number
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true }
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  estimatedDeliveryTime: Date,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);