const User = require('../models/User');

// @desc    Get wallet balance and history
// @route   GET /api/wallet/balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      wallet: {
        balance: user.wallet,
        history: user.walletHistory.sort((a, b) => b.date - a.date),
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add dummy funds to wallet
// @route   POST /api/wallet/add-funds
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0 || amount > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid amount between ₹1 and ₹1,00,000',
      });
    }

    const user = await User.findById(req.user._id);
    user.wallet += amount;
    user.walletHistory.push({
      type: 'credit',
      amount,
      description: 'Funds added to wallet',
    });

    await user.save();

    res.json({
      success: true,
      wallet: {
        balance: user.wallet,
        history: user.walletHistory.sort((a, b) => b.date - a.date),
      },
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
