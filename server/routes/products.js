const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// @route   GET /api/products/categories
router.get('/categories', productController.getCategories);

// @route   GET /api/products/featured
router.get('/featured', productController.getFeaturedProducts);

// @route   GET /api/products
router.get('/', productController.getProducts);

// @route   GET /api/products/:id
router.get('/:id', productController.getProduct);

module.exports = router;
