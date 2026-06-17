const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/balance', walletController.getBalance);
router.post('/add-funds', walletController.addFunds);

module.exports = router;
