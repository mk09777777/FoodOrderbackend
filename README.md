# Food Order Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally (make sure MongoDB is installed and running)

3. Seed the database with restaurant data:
```bash
node seedMongoDB.js
```

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/signin` - User login
- POST `/api/auth/verify-otp` - OTP verification (static: use "1234")

### Restaurants
- GET `/api/restaurants` - Get all restaurants
- GET `/api/restaurants/:id` - Get restaurant by ID
- GET `/api/restaurants/search/:query` - Search restaurants

### Cart
- GET `/api/cart` - Get user cart (requires auth)
- POST `/api/cart/add` - Add item to cart (requires auth)
- DELETE `/api/cart/remove/:itemId` - Remove item from cart (requires auth)
- DELETE `/api/cart/clear` - Clear cart (requires auth)

### User
- GET `/api/user/profile` - Get user profile (requires auth)
- PUT `/api/user/profile` - Update user profile (requires auth)

## Environment Variables

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodorder
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```