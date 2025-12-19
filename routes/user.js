const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, address },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const orders = await Order.find({ 'customer.email': user.email })
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;