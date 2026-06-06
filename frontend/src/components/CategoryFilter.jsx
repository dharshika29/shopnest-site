import { useNavigate, useSearchParams } from 'react-router-dom';

const CategoryFilter = ({ categories }) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category === '') {
      navigate('/');
    } else {
      navigate(`/?category=${category}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => handleCategoryClick('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          currentCategory === ''
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-600 hover:text-indigo-600'
        }`}
      >
        All
      </button>
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === category
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-600 hover:text-indigo-600'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
