const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Tops', 'Dresses', 'Tshirts', 'Trousers', 'Jeans', 'Shirts', 'Skirts', 'Coats',
        'Sarees', 'Kurtas', 'Lehanga Choli', 'Gopi Dresses', 'Ethnic Dresses', 'Co-Ords',
        'Kurta Sets', 'Sweatshirts', 'Shorts', 'Jackets', 'Dhoti Kurta Sets', 'Blazers', 'Suits', 'Sherwani'
      ],
    },
    gender: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Boys', 'Girls', 'Unisex'],
    },
    ageGroup: [{
      type: String,
      required: true,
      enum: ['Kids (2-12)', 'Teens (13-19)', 'Adults (20+)'],
    }],
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FS'],
      },
    ],
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        images: [{ type: String }],
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    material: {
      type: String,
      default: 'Cotton',
    },
    brand: {
      type: String,
      default: 'Vrishti',
    },
    stock: {
      type: Number,
      default: 50,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Compound indexes for common filter queries
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Product', productSchema);
