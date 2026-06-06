import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <CheckoutSteps step1 />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shipping</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter postal code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter country"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
