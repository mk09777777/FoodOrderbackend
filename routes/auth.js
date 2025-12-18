const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, countryCode, password } = req.body;
    
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, phone, countryCode, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP (Static verification)
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // Static OTP verification (always accept "1234")
    if (otp !== '1234') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
      try {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
        res.redirect(`exp://localhost:8081/--/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }))}`);
      } catch (error) {
        res.redirect('/login?error=auth_failed');
      }
    }
  );
}

module.exports = router;