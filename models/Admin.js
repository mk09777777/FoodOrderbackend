const mongoose = require('mongoose');

const trendyItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  actualPrice: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  restaurant: { type: String, default: 'Trendy Foods' },
  description: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const homeBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const cuisineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const highlightSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  description: String,
  image: { type: String, required: true },
  video: String,
  logo: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  name: { type: String, required: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
const TrendyItem = mongoose.model('TrendyItem', trendyItemSchema);
const HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
const Cuisine = mongoose.model('Cuisine', cuisineSchema);
const Highlight = mongoose.model('Highlight', highlightSchema);

module.exports = { Admin, TrendyItem, HomeBanner, Cuisine, Highlight };