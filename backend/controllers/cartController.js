import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if product already in cart
    const itemIndex = user.cart.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      // product exists, update quantity
      let productItem = user.cart[itemIndex];
      const newQuantity = productItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items in stock`);
      }
      
      productItem.quantity = newQuantity;
      user.cart[itemIndex] = productItem;
    } else {
      // new product, add to cart array
      if (quantity > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items in stock`);
      }
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    // Populate the cart products before sending
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    const itemIndex = user.cart.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        user.cart.splice(itemIndex, 1);
      } else {
        if (quantity > product.stock) {
          res.status(400);
          throw new Error(`Only ${product.stock} items in stock`);
        }
        user.cart[itemIndex].quantity = quantity;
      }
      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('cart.product');
      res.json(updatedUser.cart);
    } else {
      res.status(404);
      throw new Error('Product not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(updatedUser.cart);
  } catch (error) {
    next(error);
  }
};

export { addToCart, updateCartQuantity, removeFromCart };
