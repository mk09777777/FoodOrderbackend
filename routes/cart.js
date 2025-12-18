const express = require('express');
const Cart = require('../models/Cart');
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

module.exports = router;