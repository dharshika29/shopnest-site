import Coupon from '../models/Coupon.js';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, minPurchaseAmount } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
      code,
      discountPercent,
      minPurchaseAmount: minPurchaseAmount || 0,
    });

    if (coupon) {
      res.status(201).json(coupon);
    } else {
      res.status(400);
      throw new Error('Invalid coupon data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Coupon Code
// @route   POST /api/coupons/verify
// @access  Private
const verifyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    
    if (!code) {
      res.status(400);
      throw new Error('Please provide a coupon code');
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (coupon) {
      if (cartTotal !== undefined && cartTotal < coupon.minPurchaseAmount) {
        res.status(400);
        throw new Error(`This coupon requires a minimum purchase of ₹${coupon.minPurchaseAmount}`);
      }
      res.json({ valid: true, discountPercent: coupon.discountPercent });
    } else {
      res.status(400);
      throw new Error('Invalid or expired coupon code');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons/active
// @access  Private
const getActiveCoupons = async (req, res, next) => {
  try {
    const cartTotal = Number(req.query.cartTotal) || 0;
    const coupons = await Coupon.find({ 
      isActive: true,
      minPurchaseAmount: { $lte: cartTotal }
    }).select('code discountPercent');
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export { createCoupon, getCoupons, deleteCoupon, verifyCoupon, getActiveCoupons };
