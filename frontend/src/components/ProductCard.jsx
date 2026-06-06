import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Plus, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  
  const isWishlisted = isInWishlist(product._id);
  
  // Need to adjust image URL since it's hosted on backend
  const imageUrl = product.image.startsWith('http') 
    ? product.image 
    : `http://localhost:5000${product.image}`;

  return (
    <div className="premium-card group flex flex-col h-full overflow-hidden">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square bg-slate-50">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-white/50">
          {product.category}
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-all duration-300 z-10 shadow-sm border border-white/50 hover:scale-110"
        >
          <Heart 
            size={18} 
            className={isWishlisted ? "text-red-500" : ""} 
            fill={isWishlisted ? "currentColor" : "none"} 
          />
        </button>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-extrabold text-slate-900">
            ₹{product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => addToCart(product._id, 1)}
            className="flex items-center justify-center bg-slate-900 hover:bg-indigo-600 text-white p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            title="Add to cart"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
