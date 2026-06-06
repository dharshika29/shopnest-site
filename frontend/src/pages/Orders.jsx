import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Clock, Mail } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const emailPreviewUrl = location.state?.emailPreviewUrl;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
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

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <Package size={64} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8">When you place orders, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {emailPreviewUrl && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-green-800 font-bold">Email Receipt Sent!</h3>
              <p className="text-sm text-green-700">Your order has been placed successfully.</p>
            </div>
          </div>
          <a 
            href={emailPreviewUrl} 
            target="_blank" 
            rel="noreferrer"
            className="bg-white text-green-700 border border-green-300 px-4 py-2 rounded-lg font-bold hover:bg-green-50 transition-colors shadow-sm text-center"
          >
            View Email Receipt
          </a>
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
        <Package className="mr-3 text-indigo-600" />
        Your Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Clock size={16} />
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="font-mono text-xs text-gray-400">Order ID: {order._id}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="font-bold text-lg text-gray-900">₹{order.totalPrice.toFixed(2)}</div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="divide-y divide-gray-100">
                {order.products.map((item, index) => {
                  const imageUrl = item.product.image.startsWith('http') 
                    ? item.product.image 
                    : `http://localhost:5000${item.product.image}`;
                    
                  return (
                    <li key={index} className="py-4 flex gap-6 items-center first:pt-0 last:pb-0">
                      <img 
                        src={imageUrl} 
                        alt={item.product.title} 
                        className="w-16 h-16 object-cover rounded-lg bg-gray-50 p-1 border border-gray-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.title}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
