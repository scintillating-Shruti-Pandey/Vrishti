const Product = require('../models/Product');

// @desc    Get all products (with filters, search, pagination, sorting)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      gender,
      ageGroup,
      size,
      color,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = { $in: category.split(',') };
    }

    // Gender filter
    if (gender) {
      const selectedGenders = gender.split(',');
      selectedGenders.push('Unisex'); // Include Unisex products for any gender selection
      query.gender = { $in: selectedGenders };
    }

    // Age group filter
    if (ageGroup) {
      query.ageGroup = { $in: ageGroup.split(',') };
    }

    // Size filter
    if (size) {
      const selectedSizes = size.split(',');
      selectedSizes.push('FS'); // Include Free Style products for any size selection
      query.sizes = { $in: selectedSizes };
    }

    // Color filter
    if (color) {
      query['colors.name'] = { $in: color.split(',').map((c) => new RegExp(c, 'i')) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { numReviews: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
