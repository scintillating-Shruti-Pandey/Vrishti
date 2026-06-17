const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// All admin routes require auth + admin role
router.use(auth, admin);

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// Product management
router.post('/products', upload.any(), adminController.addProduct);
router.put('/products/:id', upload.any(), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
