const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Place an order (checkout)
// @route   POST /api/orders/checkout
exports.checkout = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address',
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      });
    }

    // Calculate total and build order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: 'A product in your cart is no longer available',
        });
      }

      const colorObj = item.product.colors.find(c => c.name === item.selectedColor);
      const availableStock = colorObj && colorObj.stock !== undefined ? colorObj.stock : item.product.stock;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${item.product.name}" has only ${availableStock} items in stock for this color`,
        });
      }

      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.product.images[0] || '',
      });
    }

    // Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.wallet < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. You need ₹${totalAmount.toLocaleString('en-IN')} but have ₹${user.wallet.toLocaleString('en-IN')}`,
      });
    }

    // Deduct from wallet
    user.wallet -= totalAmount;
    user.walletHistory.push({
      type: 'debit',
      amount: totalAmount,
      description: `Order placed — ${orderItems.length} item(s)`,
    });
    await user.save();

    // Reduce stock
    for (const item of cart.items) {
      const updateData = { $inc: { stock: -item.quantity } };
      const colorIndex = item.product.colors.findIndex(c => c.name === item.selectedColor);
      if (colorIndex !== -1) {
        updateData.$inc[`colors.${colorIndex}.stock`] = -item.quantity;
      }
      await Product.findByIdAndUpdate(item.product._id, updateData);
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      order,
      newBalance: user.wallet,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure user owns this order or is admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
