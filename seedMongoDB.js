const mongoose = require('mongoose');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Clear existing data
    await db.collection('restaurants').deleteMany({});
    console.log('Cleared existing restaurants');
    
    // Insert new data
    const restaurants = [
      {
        "_id": "66f01a111111111111111101",
        "name": "Spice Villa",
        "cuisines": ["Indian", "Chinese"],
        "rating": 4.3,
        "totalRatings": 1240,
        "address": { "street": "MG Road", "area": "Camp", "city": "Pune", "pincode": "411001", "fullAddress": "MG Road, Camp, Pune - 411001" },
        "contact": { "phone": "+91 9876543210", "email": "support@spicevilla.com" },
        "openingHours": { "open": "10:00 AM", "close": "11:30 PM", "isOpen": true },
        "delivery": { "time": "30-40 mins", "fee": 30, "minOrder": 149 },
        "items": [
          {
            "_id": "66f01a222222222222222001",
            "dish": "Chicken Biryani",
            "restaurant": "Spice Villa",
            "img": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500",
            "description": "Slow-cooked aromatic basmati rice layered with spiced marinated chicken and saffron.",
            "type": false,
            "offer": 20,
            "actualPrice": "$14.99",
            "offerPrice": "$11.99",
            "nutrition": { "Calories": "450kcal", "Protein": "32g", "Fat": "14g", "Carbs": "48g" },
            "allergicIngredients": ["Dairy", "Nuts"],
            "sizes": [
              { "name": "Regular", "price": 11.99 },
              { "name": "Large", "price": 15.99 }
            ],
            "addons": [
              { "name": "Extra Chicken", "price": 3.50 },
              { "name": "Boiled Egg", "price": 1.00 },
              { "name": "Extra Raita", "price": 0.50 }
            ],
            "isAvailable": true
          },
          {
            "_id": "66f01a222222222222222002",
            "dish": "Paneer Butter Masala",
            "restaurant": "Spice Villa",
            "img": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500",
            "description": "Soft paneer cubes simmered in a rich, creamy tomato and butter-based gravy.",
            "type": true,
            "offer": 15,
            "actualPrice": "$12.99",
            "offerPrice": "$10.99",
            "nutrition": { "Calories": "380kcal", "Protein": "15g", "Fat": "22g" },
            "allergicIngredients": ["Dairy", "Cashews"],
            "sizes": [
              { "name": "Half", "price": 10.99 },
              { "name": "Full", "price": 14.99 }
            ],
            "addons": [
              { "name": "Extra Butter", "price": 1.00 },
              { "name": "Butter Naan", "price": 2.50 }
            ],
            "isAvailable": true
          }
        ]
      },
      {
        "_id": "66f01a111111111111111102",
        "name": "The Golden Dragon",
        "cuisines": ["Chinese", "Thai"],
        "rating": 4.5,
        "totalRatings": 890,
        "address": { "street": "Koregaon Park", "area": "KP", "city": "Pune", "pincode": "411001", "fullAddress": "Lane 7, Koregaon Park, Pune" },
        "contact": { "phone": "+91 9988776655", "email": "info@goldendragon.com" },
        "openingHours": { "open": "12:00 PM", "close": "11:00 PM", "isOpen": true },
        "delivery": { "time": "25-35 mins", "fee": 40, "minOrder": 200 },
        "items": [
          {
            "_id": "66f01a222222222222223001",
            "dish": "Schezwan Hakka Noodles",
            "restaurant": "The Golden Dragon",
            "img": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
            "description": "Spicy stir-fried noodles tossed with garden-fresh vegetables and homemade schezwan sauce.",
            "type": true,
            "offer": 10,
            "actualPrice": "$10.00",
            "offerPrice": "$9.00",
            "nutrition": { "Calories": "310kcal", "Fiber": "4g" },
            "allergicIngredients": ["Soy", "Gluten"],
            "sizes": [
              { "name": "Medium", "price": 9.00 },
              { "name": "Large", "price": 12.00 }
            ],
            "addons": [
              { "name": "Extra Veggies", "price": 1.50 },
              { "name": "Chilli Vinegar", "price": 0.50 }
            ],
            "isAvailable": true
          }
        ]
      },
      {
        "_id": "66f01a111111111111111103",
        "name": "Little Italy",
        "cuisines": ["Italian"],
        "rating": 4.6,
        "totalRatings": 1500,
        "address": { "street": "University Rd", "area": "Shivaji Nagar", "city": "Pune", "pincode": "411005", "fullAddress": "Shivaji Nagar, Pune" },
        "contact": { "phone": "+91 2026136534", "email": "contact@littleitaly.com" },
        "openingHours": { "open": "11:30 AM", "close": "11:30 PM", "isOpen": true },
        "delivery": { "time": "30-45 mins", "fee": 35, "minOrder": 250 },
        "items": [
          {
            "_id": "66f01a222222222222224001",
            "dish": "Margherita Pizza",
            "restaurant": "Little Italy",
            "img": "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500",
            "description": "Classic Neapolitan pizza with fresh basil, mozzarella, and hand-pressed tomato sauce.",
            "type": true,
            "offer": 10,
            "actualPrice": "$15.00",
            "offerPrice": "$13.50",
            "nutrition": { "Calories": "250kcal per slice", "Carbs": "30g" },
            "allergicIngredients": ["Dairy", "Gluten"],
            "sizes": [
              { "name": "9 inch", "price": 13.50 },
              { "name": "12 inch", "price": 18.50 }
            ],
            "addons": [
              { "name": "Extra Cheese", "price": 2.00 },
              { "name": "Jalapenos", "price": 1.00 }
            ],
            "isAvailable": true
          }
        ]
      },
      {
        "_id": "66f01a111111111111111104",
        "name": "Burger King",
        "cuisines": ["Fast Food", "American"],
        "rating": 4.1,
        "totalRatings": 6700,
        "address": { "street": "FC Road", "area": "Deccan", "city": "Pune", "pincode": "411004", "fullAddress": "FC Road, Pune" },
        "contact": { "phone": "+91 2025676789", "email": "hello@burgerking.in" },
        "openingHours": { "open": "10:00 AM", "close": "12:00 AM", "isOpen": true },
        "delivery": { "time": "20-30 mins", "fee": 25, "minOrder": 150 },
        "items": [
          {
            "_id": "66f01a222222222222225001",
            "dish": "Whopper",
            "restaurant": "Burger King",
            "img": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
            "description": "Flame-grilled beef patty topped with tomatoes, fresh lettuce, mayo, and ketchup.",
            "type": false,
            "offer": 15,
            "actualPrice": "$8.00",
            "offerPrice": "$6.80",
            "nutrition": { "Calories": "660kcal", "Protein": "28g", "Fat": "40g" },
            "allergicIngredients": ["Gluten", "Egg", "Sesame"],
            "sizes": [
              { "name": "Single", "price": 6.80 },
              { "name": "Double", "price": 9.80 }
            ],
            "addons": [
              { "name": "Bacon", "price": 1.50 },
              { "name": "Cheese Slice", "price": 0.50 }
            ],
            "isAvailable": true
          }
        ]
      }
    ];
    
    await db.collection('restaurants').insertMany(restaurants);
    console.log('Seeded restaurants successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();