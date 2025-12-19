const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const spiceVillaData = {
  name: "Spice Villa",
  cuisines: ["Indian", "North Indian", "Biryani", "Curry"],
  rating: 4.3,
  totalRatings: 1250,
  address: {
    street: "123 Food Street",
    area: "Connaught Place",
    city: "New Delhi",
    pincode: "110001",
    fullAddress: "123 Food Street, Connaught Place, New Delhi - 110001"
  },
  contact: {
    phone: "+91-9876543210",
    email: "owner@spicevilla.com"
  },
  openingHours: {
    open: "10:00 AM",
    close: "11:00 PM",
    isOpen: true
  },
  delivery: {
    time: "30-45 mins",
    fee: 40,
    minOrder: 200
  },
  items: [
    {
      dish: "Chicken Biryani",
      restaurant: "Spice Villa",
      img: "https://foodorderbackend-fhmg.onrender.com/uploads/chicken-biryani.jpg",
      description: "Aromatic basmati rice cooked with tender chicken pieces and traditional spices",
      type: false,
      offer: 15,
      actualPrice: "350",
      offerPrice: "299",
      nutrition: {
        Calories: "520",
        Protein: "28g",
        Fat: "18g",
        Carbs: "65g",
        Fiber: "3g"
      },
      allergicIngredients: ["Dairy", "Nuts"],
      sizes: [
        { name: "Regular", price: 299 },
        { name: "Large", price: 399 }
      ],
      addons: [
        { name: "Extra Raita", price: 30 },
        { name: "Boiled Egg", price: 20 }
      ],
      isAvailable: true
    },
    {
      dish: "Paneer Butter Masala",
      restaurant: "Spice Villa",
      img: "https://foodorderbackend-fhmg.onrender.com/uploads/paneer-butter-masala.jpg",
      description: "Rich and creamy tomato-based curry with soft paneer cubes",
      type: true,
      offer: 10,
      actualPrice: "280",
      offerPrice: "252",
      nutrition: {
        Calories: "380",
        Protein: "18g",
        Fat: "22g",
        Carbs: "25g",
        Fiber: "4g"
      },
      allergicIngredients: ["Dairy", "Nuts"],
      sizes: [
        { name: "Half", price: 252 },
        { name: "Full", price: 350 }
      ],
      addons: [
        { name: "Butter Naan", price: 45 },
        { name: "Jeera Rice", price: 80 }
      ],
      isAvailable: true
    },
    {
      dish: "Mutton Rogan Josh",
      restaurant: "Spice Villa",
      img: "https://foodorderbackend-fhmg.onrender.com/uploads/mutton-rogan-josh.jpg",
      description: "Traditional Kashmiri mutton curry with aromatic spices",
      type: false,
      offer: 20,
      actualPrice: "450",
      offerPrice: "360",
      nutrition: {
        Calories: "420",
        Protein: "32g",
        Fat: "24g",
        Carbs: "15g",
        Fiber: "2g"
      },
      allergicIngredients: ["Dairy"],
      sizes: [
        { name: "Half", price: 360 },
        { name: "Full", price: 480 }
      ],
      addons: [
        { name: "Basmati Rice", price: 60 },
        { name: "Garlic Naan", price: 50 }
      ],
      isAvailable: true
    },
    {
      dish: "Dal Tadka",
      restaurant: "Spice Villa",
      img: "https://foodorderbackend-fhmg.onrender.com/uploads/dal-tadka.jpg",
      description: "Yellow lentils tempered with cumin, garlic and spices",
      type: true,
      offer: 5,
      actualPrice: "180",
      offerPrice: "171",
      nutrition: {
        Calories: "220",
        Protein: "12g",
        Fat: "8g",
        Carbs: "28g",
        Fiber: "8g"
      },
      allergicIngredients: [],
      sizes: [
        { name: "Half", price: 171 },
        { name: "Full", price: 220 }
      ],
      addons: [
        { name: "Steamed Rice", price: 50 },
        { name: "Roti", price: 25 }
      ],
      isAvailable: true
    },
    {
      dish: "Tandoori Chicken",
      restaurant: "Spice Villa",
      img: "https://foodorderbackend-fhmg.onrender.com/uploads/tandoori-chicken.jpg",
      description: "Marinated chicken grilled in tandoor with traditional spices",
      type: false,
      offer: 12,
      actualPrice: "320",
      offerPrice: "282",
      nutrition: {
        Calories: "350",
        Protein: "35g",
        Fat: "15g",
        Carbs: "8g",
        Fiber: "1g"
      },
      allergicIngredients: ["Dairy"],
      sizes: [
        { name: "Half", price: 282 },
        { name: "Full", price: 380 }
      ],
      addons: [
        { name: "Mint Chutney", price: 15 },
        { name: "Onion Salad", price: 25 }
      ],
      isAvailable: true
    }
  ]
};

async function seedSpiceVilla() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if Spice Villa already exists
    const existingRestaurant = await Restaurant.findOne({ name: "Spice Villa" });
    
    if (existingRestaurant) {
      console.log('Spice Villa already exists, updating...');
      await Restaurant.findByIdAndUpdate(existingRestaurant._id, spiceVillaData);
      console.log('Spice Villa updated successfully!');
    } else {
      const spiceVilla = new Restaurant(spiceVillaData);
      await spiceVilla.save();
      console.log('Spice Villa created successfully!');
    }

    console.log('\n=== SPICE VILLA RESTAURANT OWNER LOGIN ===');
    console.log('Email: owner@spicevilla.com');
    console.log('Password: restaurant123');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding Spice Villa:', error);
    process.exit(1);
  }
}

seedSpiceVilla();