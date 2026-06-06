import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, Package, Ticket } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/orders/summary');
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <div className="flex gap-4">
          <Link 
            to="/admin/products"
            className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Manage Products
          </Link>
          <Link 
            to="/admin/coupons"
            className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Manage Coupons
          </Link>
          <Link 
            to="/admin/orders"
            className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">₹{summary?.sales.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl text-green-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.orders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 p-4 rounded-xl text-yellow-600">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Products</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.products}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-xl text-purple-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Users</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.users}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Trend</h2>
          <div className="h-[300px] w-full">
            {summary?.dailyOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">No sales data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="_id" tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Orders Volume</h2>
          <div className="h-[300px] w-full">
            {summary?.dailyOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">No order data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary?.dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="_id" tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
