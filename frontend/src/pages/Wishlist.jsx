import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = (product) => {
    addToCart(product._id, 1);
    toggleWishlist(product._id); // Remove from wishlist after moving
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-red-50 p-8 rounded-full shadow-sm mb-6">
          <Heart size={64} className="text-red-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Save items you love here to easily find them later.
        </p>
        <Link 
          to="/" 
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <Heart className="text-red-500" fill="currentColor" />
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlist.map((product) => {
          const imageUrl = product.image.startsWith('http') 
            ? product.image 
            : `https://shopnest-site.onrender.com${product.image}`;

          return (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
                <img 
                  src={imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1 hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <span className="text-xl font-bold text-gray-900 mb-4 block">
                  ₹{product.price.toFixed(2)}
                </span>

                <div className="mt-auto flex flex-col gap-2">
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-xl font-bold transition-colors shadow-md shadow-indigo-200"
                  >
                    <ShoppingCart size={18} />
                    {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product._id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl font-bold transition-colors"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
