const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add a review (must have purchased the product)
// @route   POST /api/reviews/product/:productId
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    // Check if user has purchased this product
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      status: { $in: ['Processing', 'Shipped', 'Delivered'] },
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: order._id,
      rating,
      title,
      comment,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check ownership
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
