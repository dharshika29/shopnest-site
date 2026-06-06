import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
  );
  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'PayPal'
  );
  const { user } = useContext(AuthContext);

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/user/profile');
      if (data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert("Please login to add to cart");
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ 
      cart, setCart, addToCart, updateQuantity, removeFromCart, clearCart,
      shippingAddress, saveShippingAddress, paymentMethod, savePaymentMethod
    }}>
      {children}
    </CartContext.Provider>
  );
};
