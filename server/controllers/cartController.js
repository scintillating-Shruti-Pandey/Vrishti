const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock sizes colors'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    const colorObj = product.colors.find(c => c.name === selectedColor);
    const availableStock = colorObj && colorObj.stock !== undefined ? colorObj.stock : product.stock;
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items in stock for this color`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already in cart (same product, size, color)
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, selectedSize, selectedColor });
    }

    await cart.save();

    // Populate before returning
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock sizes colors'
    );

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product) {
      const colorObj = product.colors.find(c => c.name === item.selectedColor);
      const availableStock = colorObj && colorObj.stock !== undefined ? colorObj.stock : product.stock;
      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} items in stock for this color`,
        });
      }
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock sizes colors'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock sizes colors'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
