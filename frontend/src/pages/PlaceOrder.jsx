import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../services/api';

const PlaceOrder = () => {
  const { cart, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const itemsPrice = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await api.get(`/coupons/active?cartTotal=${itemsPrice}`);
        setAvailableCoupons(data);
      } catch (error) {
        console.error('Failed to fetch coupons', error);
      }
    };
    if (itemsPrice > 0) {
      fetchCoupons();
    }
  }, [itemsPrice]);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const itemsPriceDisplay = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const discountAmount = Number((itemsPriceDisplay * (discountPercent / 100)).toFixed(2));
  const shippingPrice = itemsPriceDisplay > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * (itemsPriceDisplay - discountAmount)).toFixed(2));
  const totalPrice = itemsPriceDisplay - discountAmount + shippingPrice + taxPrice;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;
    try {
      setCouponError('');
      setCouponSuccess('');
      const { data } = await api.post('/coupons/verify', { 
        code: promoCode,
        cartTotal: itemsPrice
      });
      if (data.valid) {
        setDiscountPercent(data.discountPercent);
        setCouponSuccess(`Coupon applied! ${data.discountPercent}% off.`);
      }
    } catch (error) {
      setDiscountPercent(0);
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setOrdering(true);

      if (paymentMethod === 'Razorpay') {
        const res = await loadRazorpay();
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          setOrdering(false);
          return;
        }

        // Create order
        const { data: orderData } = await api.post('/payment/razorpay-order', {
          amount: totalPrice,
        });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ShopNest',
          description: 'Payment for your order',
          order_id: orderData.id,
          handler: async function (response) {
            try {
              const paymentDetails = {
                orderItems: cart.map(item => ({
                  product: item.product._id,
                  quantity: item.quantity,
                  price: item.product.price
                })),
                shippingAddress,
                paymentMethod,
                totalPrice,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              const { data } = await api.post('/orders', paymentDetails);
              
              let emailPreviewUrl = null;
              if (data.previewUrl) {
                emailPreviewUrl = data.previewUrl;
              }

              clearCart();
              navigate('/orders', { state: { emailPreviewUrl } });
            } catch (err) {
              console.error("Payment verification failed", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          theme: {
            color: '#4f46e5',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setOrdering(false);
        return;
      }

      // Cash On Delivery Flow
      const orderData = {
        orderItems: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress,
        paymentMethod,
        totalPrice
      };
      
      const { data } = await api.post('/orders', orderData);
      
      let emailPreviewUrl = null;
      if (data.previewUrl) {
        console.log("=========================================");
        console.log("Email Notification Sent!");
        console.log("Preview your receipt here: ", data.previewUrl);
        console.log("=========================================");
        emailPreviewUrl = data.previewUrl;
      }

      clearCart();
      navigate('/orders', { state: { emailPreviewUrl } });
    } catch (error) {
      console.error("Order creation failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      if (paymentMethod !== 'Razorpay') {
        setOrdering(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CheckoutSteps step1 step2 step3 />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping</h2>
            <p className="text-gray-700">
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Items</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cart.map((item, index) => {
                  const imageUrl = item.product.image.startsWith('http') 
                    ? item.product.image 
                    : `https://shopnest-site.onrender.com${item.product.image}`;
                  
                  return (
                    <li key={index} className="py-4 flex items-center gap-4">
                      <img src={imageUrl} alt={item.product.title} className="w-16 h-16 rounded-md object-cover border border-gray-200" />
                      <div className="flex-1">
                        <Link to={`/product/${item.product._id}`} className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {item.product.title}
                        </Link>
                      </div>
                      <div className="font-medium text-gray-700">
                        {item.quantity} x ₹{item.product.price.toFixed(2)} = ₹{(item.quantity * item.product.price).toFixed(2)}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-medium">₹{itemsPriceDisplay.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">₹{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium">₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg text-gray-900">
                <span className="font-bold">Total</span>
                <span className="font-bold text-indigo-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. NEW2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              
              {availableCoupons.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-600 mb-2">Available Coupons:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((coupon) => (
                      <button
                        key={coupon._id}
                        onClick={() => setPromoCode(coupon.code)}
                        className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 transition cursor-pointer"
                        title="Click to use this code"
                      >
                        {coupon.code} (-{coupon.discountPercent}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-sm mt-2 font-medium">{couponSuccess}</p>}
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || ordering}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-lg disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
            >
              {ordering ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
