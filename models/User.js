const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  address: {
    street: String,
    area: String,
    city: String,
    pincode: String,
    fullAddress: String
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);