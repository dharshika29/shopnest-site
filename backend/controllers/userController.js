import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product').populate('wishlist');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
        cart: user.cart,
        wishlist: user.wishlist,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
      
      if (req.file) {
        user.profilePic = `/${req.file.path.replace(/\\/g, '/')}`;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/user/wishlist/:id
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;

    if (user) {
      const alreadyInWishlist = user.wishlist.find((id) => id.toString() === productId.toString());

      if (alreadyInWishlist) {
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
      } else {
        user.wishlist.push(productId);
      }

      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json(updatedUser.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getUserProfile, updateUserProfile, toggleWishlist };
