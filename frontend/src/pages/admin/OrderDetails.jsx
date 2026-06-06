import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get('/orders');
        const foundOrder = data.find(o => o._id === id);
        setOrder(foundOrder);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    try {
      await api.put(`/orders/${order._id}/deliver`);
      setOrder({ ...order, status: 'Delivered' });
    } catch (error) {
      console.error("Failed to deliver order", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Order {order._id}</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">User</h2>
          <p><strong>Name:</strong> {order.user.name}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Payment Method</h2>
          <p>{order.paymentMethod}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Status</h2>
          <div className={`px-4 py-2 rounded-full inline-block text-sm font-bold ${
            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.status}
          </div>
        </div>
        
        {order.status !== 'Delivered' && (
          <button
            onClick={deliverHandler}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Mark As Delivered
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
