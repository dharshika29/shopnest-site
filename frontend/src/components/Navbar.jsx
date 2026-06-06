import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShoppingCart, User, LogOut, Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl mr-3 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 shadow-md">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-extrabold text-gradient tracking-tight">ShopNest</span>
          </Link>
          
          <div className="flex-1 max-w-2xl px-8 hidden md:block">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="relative text-gray-700 hover:text-red-500 transition-colors">
              <Heart size={24} />
              {wishlist?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition-colors relative" title="Messages">
                <MessageCircle size={24} />
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hidden md:block">
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="relative group cursor-pointer flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-slate-200 transition-all duration-300">
                    <img 
                      src={user.profilePic ? (user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`) : "https://ui-avatars.com/api/?name=" + user.name + "&background=0D8ABC&color=fff"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-3 w-48 hidden group-hover:block z-50">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in-up">
                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <User size={16} className="mr-3" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <ShoppingBag size={16} className="mr-3" /> Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100">
                        <LogOut size={16} className="mr-3" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="premium-button text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
