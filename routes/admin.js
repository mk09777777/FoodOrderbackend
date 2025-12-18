const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Admin, TrendyItem, HomeBanner, Cuisine, Highlight } = require('../models/Admin');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all restaurant items for selection
router.get('/restaurant-items', adminAuth, async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const items = restaurants.flatMap(r => 
      r.items.map(item => ({
        _id: item._id,
        name: item.dish,
        image: item.img,
        price: item.offerPrice,
        category: item.type ? 'Veg' : 'Non-Veg',
        description: item.description,
        restaurant: { id: r._id, name: r.name }
      }))
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trendy Items Management
router.get('/trendy-items', adminAuth, async (req, res) => {
  try {
    const items = await TrendyItem.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/trendy-items', adminAuth, async (req, res) => {
  try {
    const item = new TrendyItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/trendy-items/:id', adminAuth, async (req, res) => {
  try {
    const item = await TrendyItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/trendy-items/:id', adminAuth, async (req, res) => {
  try {
    await TrendyItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Image upload
router.post('/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://foodorderbackend-fhmg.onrender.com' : 'http://localhost:5000';
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Home Banners Management
router.get('/banners', adminAuth, async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/banners', adminAuth, async (req, res) => {
  try {
    const banner = new HomeBanner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/banners/:id', adminAuth, async (req, res) => {
  try {
    const banner = await HomeBanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/banners/:id', adminAuth, async (req, res) => {
  try {
    await HomeBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restaurant Management
router.get('/restaurants', adminAuth, async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select('-items');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/restaurants/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      { 'openingHours.isOpen': isActive }, 
      { new: true }
    );
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cuisines Management
router.get('/cuisines', adminAuth, async (req, res) => {
  try {
    const cuisines = await Cuisine.find().sort({ order: 1 });
    res.json(cuisines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cuisines', adminAuth, async (req, res) => {
  try {
    const cuisine = new Cuisine(req.body);
    await cuisine.save();
    res.status(201).json(cuisine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/cuisines/:id', adminAuth, async (req, res) => {
  try {
    await Cuisine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cuisine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Highlights Management
router.get('/highlights', adminAuth, async (req, res) => {
  try {
    const highlights = await Highlight.find().sort({ order: 1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/highlights', adminAuth, async (req, res) => {
  try {
    const highlight = new Highlight(req.body);
    await highlight.save();
    res.status(201).json(highlight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/highlights/:id', adminAuth, async (req, res) => {
  try {
    await Highlight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Highlight deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;