const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public — anyone can read reviews
router.get('/product/:productId', reviewController.getProductReviews);

// Protected — must be logged in to write/delete reviews
router.post('/product/:productId', auth, reviewController.addReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
