const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', wishlistController.getWishlist);
router.post('/toggle/:productId', wishlistController.toggleWishlist);

module.exports = router;
