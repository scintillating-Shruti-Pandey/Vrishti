const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Add a new product (admin only)
// @route   POST /api/admin/products
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      gender,
      ageGroup,
      sizes,
      colors,
      material,
      brand,
      stock,
      featured,
    } = req.body;

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === 'images') {
          images.push(file.path);
        }
      }
    }

    // Parse JSON strings from FormData
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    const parsedAgeGroup = typeof ageGroup === 'string' && ageGroup.startsWith('[') ? JSON.parse(ageGroup) : (typeof ageGroup === 'string' ? [ageGroup] : ageGroup);

    // Attach color images
    if (parsedColors && req.files) {
      parsedColors.forEach((color, index) => {
        const colorImages = req.files
          .filter(f => f.fieldname === `color_images_${index}`)
          .map(f => f.path);
        if (colorImages.length > 0) {
          color.images = colorImages;
        }
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      images,
      category,
      gender,
      ageGroup: parsedAgeGroup,
      sizes: parsedSizes,
      colors: parsedColors,
      material,
      brand,
      stock: parsedColors && parsedColors.length > 0 ? parsedColors.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0) : 0,
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a product (admin only)
// @route   PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Parse JSON strings from FormData
    if (typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }
    if (typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }
    if (typeof updateData.ageGroup === 'string') {
      updateData.ageGroup = updateData.ageGroup.startsWith('[') ? JSON.parse(updateData.ageGroup) : [updateData.ageGroup];
    }
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.colors) {
      updateData.stock = updateData.colors.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    }
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files
        .filter(f => f.fieldname === 'images')
        .map((file) => file.path);
      
      // Append to existing images or replace
      if (updateData.keepExistingImages === 'true') {
        const product = await Product.findById(req.params.id);
        updateData.images = [...(product?.images || []), ...newImages];
      } else if (newImages.length > 0 || updateData.images) {
        // if no keepExistingImages, rely on what frontend sent or just replace with new
        updateData.images = newImages;
      }

      // Handle color images
      if (updateData.colors) {
        updateData.colors.forEach((color, index) => {
          const colorImages = req.files
            .filter(f => f.fieldname === `color_images_${index}`)
            .map(f => f.path);
          
          if (colorImages.length > 0) {
            color.images = [...(color.images || []), ...colorImages];
          }
        });
      }
    }

    // Remove helper fields
    delete updateData.keepExistingImages;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a product (admin only)
// @route   DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    // If cancelled, refund to wallet
    if (status === 'Cancelled') {
      const user = await User.findById(order.user);
      if (user) {
        user.wallet += order.totalAmount;
        user.walletHistory.push({
          type: 'credit',
          amount: order.totalAmount,
          description: `Refund for cancelled order #${order._id.toString().slice(-8)}`,
        });
        await user.save();
      }
    }

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueAgg] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
