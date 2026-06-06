import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  const handleCheckout = () => {
    navigate('/shipping');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
          <ShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our latest products and find something you love.
        </p>
        <Link 
          to="/" 
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => {
                const imageUrl = item.product.image.startsWith('http') 
                  ? item.product.image 
                  : `http://localhost:5000${item.product.image}`;
                
                return (
                  <li key={item.product._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                    <img 
                      src={imageUrl} 
                      alt={item.product.title} 
                      className="w-24 h-24 object-cover rounded-xl bg-gray-50 p-2"
                    />
                    <div className="flex-1 flex flex-col text-center sm:text-left">
                      <Link to={`/product/${item.product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                          {item.product.title}
                        </h3>
                      </Link>
                      <p className="text-indigo-600 font-bold mt-1">₹{item.product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-200 transition-colors"
                        >-</button>
                        <span className="px-3 font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-200 transition-colors"
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={ordering}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-lg disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
            >
              {ordering ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
