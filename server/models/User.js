const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const walletHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Don't include password in queries by default
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    wallet: {
      type: Number,
      default: 10000, // ₹10,000 starting balance
    },
    walletHistory: [walletHistorySchema],
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add initial wallet credit to history on creation
userSchema.pre('save', function (next) {
  if (this.isNew && this.walletHistory.length === 0) {
    this.walletHistory.push({
      type: 'credit',
      amount: 10000,
      description: 'Welcome bonus - Vrishti wallet activated! ✨',
    });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
