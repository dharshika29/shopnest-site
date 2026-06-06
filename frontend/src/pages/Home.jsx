import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products';
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (category) params.append('category', category);
        if (initialMinPrice) params.append('minPrice', initialMinPrice);
        if (initialMaxPrice) params.append('maxPrice', initialMaxPrice);
        if (sort) params.append('sort', sort);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const { data } = await api.get(url);
        setProducts(data);
        
        // Extract unique categories from all products if not filtered by keyword
        if (!keyword && !category && allCategories.length === 0) {
          const uniqueCategories = [...new Set(data.map(p => p.category))];
          setAllCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, initialMinPrice, initialMaxPrice, sort]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Premium Hero Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Lifestyle Products</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Elevate your everyday with our carefully curated collection of exclusive items. Quality meets design in every piece.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          {allCategories.length > 0 && <CategoryFilter categories={allCategories} />}

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <form onSubmit={handleApplyFilters} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Price:</span>
                <input 
                  type="number" 
                  placeholder="Min ₹" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max ₹" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button 
                type="submit"
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors"
              >
                Apply
              </button>
            </form>

            <div className="hidden md:block w-px h-8 bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select 
                value={sort}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {(keyword || category) && (
          <h2 className="text-2xl font-bold text-gray-700 text-left mt-8 mb-8">
            Results for {keyword ? `"${keyword}"` : ''} {category ? `in ${category}` : ''}
            <span className="text-sm font-normal text-gray-400 ml-4">({products.length} found)</span>
          </h2>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
