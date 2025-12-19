const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { itemId, dish, restaurant, img, price, quantity, selectedSize, selectedAddons } = req.body;
    
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.itemId === itemId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        itemId, dish, restaurant, img, price, quantity, selectedSize, selectedAddons
      });
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.selectedAddons) {
        itemTotal += item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * item.quantity;
      }
      return total + itemTotal;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.itemId !== req.params.itemId);
    
    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.selectedAddons) {
        itemTotal += item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * item.quantity;
      }
      return total + itemTotal;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Checkout - Create order from cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const { deliveryAddress, phone, notes } = req.body;
    
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get restaurant from first item (assuming single restaurant orders)
    const firstItem = cart.items[0];
    const restaurant = await Restaurant.findOne({ name: firstItem.restaurant });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now();
    
    // Create order items
    const orderItems = cart.items.map(item => ({
      dish: item.dish,
      quantity: item.quantity,
      price: item.price,
      addons: item.selectedAddons || [],
      size: item.selectedSize || null
    }));
    
    // Calculate delivery fee
    const deliveryFee = restaurant.delivery?.fee || 0;
    const totalAmount = cart.totalAmount + deliveryFee;
    
    // Create order
    const order = new Order({
      orderNumber,
      restaurant: restaurant._id,
      customer: {
        name: user.name,
        phone: phone || user.phone,
        email: user.email,
        address: deliveryAddress
      },
      items: orderItems,
      totalAmount,
      deliveryFee,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.delivery?.time || 30) * 60000)
    });
    
    await order.save();
    
    // Clear cart after successful order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.status(201).json({ 
      message: 'Order placed successfully', 
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;