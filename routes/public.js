const express = require('express');
const { TrendyItem, HomeBanner, Cuisine, Highlight } = require('../models/Admin');
const router = express.Router();

// Get active trendy items for home page
router.get('/trendy-items', async (req, res) => {
  try {
    const items = await TrendyItem.find({ isActive: true }).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active banners for home page
router.get('/banners', async (req, res) => {
  try {
    const banners = await HomeBanner.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active cuisines for home page
router.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Cuisine.find({ isActive: true }).sort({ order: 1 });
    res.json(cuisines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active highlights for home page
router.get('/highlights', async (req, res) => {
  try {
    const highlights = await Highlight.find({ isActive: true }).sort({ order: 1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;