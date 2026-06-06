import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Heart } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  
  const isWishlisted = product ? isInWishlist(product._id) : false;

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });
      alert('Review submitted successfully');
      setRating(0);
      setComment('');
      fetchProduct(); // refresh product
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-12 text-gray-500">Product not found</div>;
  }

  const imageUrl = product.image.startsWith('http') 
    ? product.image 
    : `https://shopnest-site.onrender.com${product.image}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to shopping
      </button>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="max-h-[500px] object-contain rounded-xl shadow-sm mix-blend-multiply"
          />
        </div>
        
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold mb-2">
            {product.category}
          </div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <button 
              onClick={() => toggleWishlist(product._id)}
              className="p-3 rounded-full bg-red-50 text-gray-400 hover:text-red-500 transition-colors shadow-sm mt-1"
            >
              <Heart 
                size={24} 
                className={isWishlisted ? "text-red-500" : ""} 
                fill={isWishlisted ? "currentColor" : "none"} 
              />
            </button>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < (product.rating || 0) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-500 ml-2">({product.numReviews || 0} reviews)</span>
          </div>
          
          <div className="mb-6">
            <span className="text-3xl font-extrabold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Stock Status:</span> 
            {product.stock > 0 ? (
              <span className="ml-2 text-green-600 font-medium">{product.stock} in stock</span>
            ) : (
              <span className="ml-2 text-red-500 font-medium">Out of stock</span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock === 0}
            className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
          >
            <ShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        {(!product.reviews || product.reviews.length === 0) && (
          <div className="bg-gray-50 p-6 rounded-xl text-gray-500 mb-8">No reviews yet</div>
        )}
        <div className="space-y-6 mb-12">
          {product.reviews && product.reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-4">{review.name}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h2>
        {user ? (
          <form onSubmit={submitReviewHandler} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl text-gray-700">
            Please <a href="/login" className="text-indigo-600 font-bold hover:underline">sign in</a> to write a review.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
