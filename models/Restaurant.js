const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const itemSchema = new mongoose.Schema({
  dish: { type: String, required: true },
  restaurant: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: Boolean, required: true },
  offer: { type: Number, default: 0 },
  actualPrice: { type: String, required: true },
  offerPrice: { type: String, required: true },
  nutrition: {
    Calories: String,
    Protein: String,
    Fat: String,
    Carbs: String,
    Fiber: String
  },
  allergicIngredients: [String],
  sizes: [sizeSchema],
  addons: [addonSchema],
  isAvailable: { type: Boolean, default: true }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisines: [String],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  address: {
    street: String,
    area: String,
    city: String,
    pincode: String,
    fullAddress: String
  },
  contact: {
    phone: String,
    email: String
  },
  openingHours: {
    open: String,
    close: String,
    isOpen: { type: Boolean, default: true }
  },
  delivery: {
    time: String,
    fee: Number,
    minOrder: Number
  },
  items: [itemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);