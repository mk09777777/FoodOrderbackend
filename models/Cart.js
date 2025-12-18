const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  dish: { type: String, required: true },
  restaurant: { type: String, required: true },
  img: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: {
    name: String,
    price: Number
  },
  selectedAddons: [{
    name: String,
    price: Number
  }]
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);