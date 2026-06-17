const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name price images averageRating numReviews category gender'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle product in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist/toggle/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let action;

    if (index > -1) {
      // Remove from wishlist
      wishlist.products.splice(index, 1);
      action = 'removed';
    } else {
      // Add to wishlist
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();

    wishlist = await Wishlist.findById(wishlist._id).populate(
      'products',
      'name price images averageRating numReviews category gender'
    );

    res.json({ success: true, action, wishlist });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
