const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const router = express.Router();

// Restaurant auth middleware
const restaurantAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.restaurant = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Restaurant login (using email from contact)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ 'contact.email': email });
    if (!restaurant) {
      return res.status(401).json({ message: 'Restaurant not found' });
    }
    
    // For demo, using simple password check (in production, hash passwords)
    if (password !== 'restaurant123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: restaurant._id, role: 'restaurant' }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      restaurant: { 
        id: restaurant._id, 
        name: restaurant.name, 
        email: restaurant.contact.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get restaurant dashboard data
router.get('/dashboard', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant.id);
    const stats = {
      totalItems: restaurant.items.length,
      activeItems: restaurant.items.filter(item => item.isAvailable).length,
      rating: restaurant.rating,
      totalRatings: restaurant.totalRatings
    };
    res.json({ restaurant, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update restaurant info
router.put('/info', restaurantAuth, async (req, res) => {
  try {
    const { name, cuisines, address, contact, openingHours, delivery } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.restaurant.id,
      { name, cuisines, address, contact, openingHours, delivery },
      { new: true }
    );
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Menu Items Management
router.get('/items', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant.id);
    res.json(restaurant.items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/items', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant.id);
    restaurant.items.push({ ...req.body, restaurant: restaurant.name });
    await restaurant.save();
    res.status(201).json(restaurant.items[restaurant.items.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/items/:itemId', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant.id);
    const item = restaurant.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    Object.assign(item, req.body);
    await restaurant.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/items/:itemId', restaurantAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurant.id);
    restaurant.items.id(req.params.itemId).remove();
    await restaurant.save();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/items/:itemId/availability', restaurantAuth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const restaurant = await Restaurant.findById(req.restaurant.id);
    const item = restaurant.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.isAvailable = isAvailable;
    await restaurant.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Order Management
router.get('/orders', restaurantAuth, async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.restaurant.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:orderId/status', restaurantAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, restaurant: req.restaurant.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Analytics
router.get('/analytics', restaurantAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayOrders, totalOrders, revenue] = await Promise.all([
      Order.countDocuments({ restaurant: req.restaurant.id, createdAt: { $gte: today } }),
      Order.countDocuments({ restaurant: req.restaurant.id }),
      Order.aggregate([
        { $match: { restaurant: mongoose.Types.ObjectId(req.restaurant.id), status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);
    
    res.json({
      todayOrders,
      totalOrders,
      totalRevenue: revenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;