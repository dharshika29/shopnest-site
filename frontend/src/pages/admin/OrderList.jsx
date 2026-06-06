import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, XCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Package className="mr-3 text-indigo-600" />
          Orders
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">USER</th>
                <th className="p-4 font-semibold text-gray-600">DATE</th>
                <th className="p-4 font-semibold text-gray-600">TOTAL</th>
                <th className="p-4 font-semibold text-gray-600">STATUS</th>
                <th className="p-4 font-semibold text-gray-600 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">{order._id.substring(0, 10)}...</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{order.user && order.user.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="p-4 text-sm">
                    {order.status === 'Delivered' ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle size={16} className="mr-1" /> Delivered
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600 font-medium">
                        <XCircle size={16} className="mr-1" /> {order.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/admin/order/${order._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
