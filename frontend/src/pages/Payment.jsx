import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  const [payment, setPayment] = useState(paymentMethod || 'Razorpay');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(payment);
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <CheckoutSteps step1 step2 />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Payment Method</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">Select Method</label>
            <div className="flex items-center">
              <input
                id="razorpay"
                name="paymentMethod"
                type="radio"
                value="Razorpay"
                checked={payment === 'Razorpay'}
                onChange={(e) => setPayment(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="razorpay" className="ml-3 block text-gray-700 font-medium">
                Razorpay (Credit Card / UPI / NetBanking)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="cod"
                name="paymentMethod"
                type="radio"
                value="CashOnDelivery"
                checked={payment === 'CashOnDelivery'}
                onChange={(e) => setPayment(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="cod" className="ml-3 block text-gray-700 font-medium">
                Cash On Delivery
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-8"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
