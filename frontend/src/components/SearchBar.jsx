import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative w-full max-w-md mx-auto hidden md:block">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
      />
      <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-indigo-600">
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
