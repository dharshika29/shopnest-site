import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/user/profile');
      if (data.wishlist) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    try {
      const { data } = await api.post(`/user/wishlist/${productId}`);
      setWishlist(data);
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
