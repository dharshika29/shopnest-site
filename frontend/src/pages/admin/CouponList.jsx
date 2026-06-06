import { useState, useEffect } from 'react';
import api from '../../services/api';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', { 
        code, 
        discountPercent: Number(discountPercent),
        minPurchaseAmount: Number(minPurchaseAmount) || 0
      });
      setCode('');
      setDiscountPercent('');
      setMinPurchaseAmount('');
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (error) {
        alert('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Coupons</h2>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Create New Coupon</h3>
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code (e.g. DIWALI50)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount % (1-100)</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={minPurchaseAmount}
              onChange={(e) => setMinPurchaseAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Create
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No coupons found. Create one above!</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">{coupon.discountPercent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{coupon.minPurchaseAmount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CouponList;
