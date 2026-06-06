import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import api from '../../services/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [reviews, setReviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setTitle(data.title);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setStock(data.stock);
        setDescription(data.description);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch product", error);
        alert("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);
      formData.append('description', description);
      
      if (fileInputRef.current.files[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/products');
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/products/${id}/reviews/${reviewId}`);
        setReviews(reviews.filter((r) => r._id !== reviewId));
        alert('Review deleted successfully');
      } catch (error) {
        console.error("Failed to delete review", error);
        alert(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
  }

  const imageUrl = image.startsWith('http') || image.startsWith('data:') 
    ? image 
    : `http://localhost:5000${image}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin/products" className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" />
        Go Back
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Edit Product</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Count In Stock</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="space-y-1 text-center">
                    {image && (
                      <div className="mb-4 flex justify-center">
                        <img src={imageUrl} alt="Preview" className="h-32 object-contain" />
                      </div>
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2 py-1">
                        <span>Upload a file</span>
                        <input type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={(e) => {
                          if (e.target.files[0]) {
                            setImage(URL.createObjectURL(e.target.files[0]));
                          }
                        }}/>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="flex justify-center items-center gap-2 w-full md:w-auto px-8 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold transition-colors shadow-lg shadow-indigo-200"
            >
              <Save size={20} />
              Update Product
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet for this product.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600">USER</th>
                  <th className="p-4 font-semibold text-gray-600">RATING</th>
                  <th className="p-4 font-semibold text-gray-600">COMMENT</th>
                  <th className="p-4 font-semibold text-gray-600">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{review.name}</td>
                    <td className="p-4 text-indigo-600 font-bold">{review.rating} / 5</td>
                    <td className="p-4 text-gray-600">{review.comment}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteReviewHandler(review._id)}
                        className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
