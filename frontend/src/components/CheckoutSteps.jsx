import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <nav className="flex justify-center mb-8">
      <ul className="flex space-x-4 items-center">
        <li>
          {step1 ? (
            <Link to="/shipping" className="text-indigo-600 font-bold hover:underline">Shipping</Link>
          ) : (
            <span className="text-gray-400">Shipping</span>
          )}
        </li>
        <span className="text-gray-300">/</span>
        <li>
          {step2 ? (
            <Link to="/payment" className="text-indigo-600 font-bold hover:underline">Payment</Link>
          ) : (
            <span className="text-gray-400">Payment</span>
          )}
        </li>
        <span className="text-gray-300">/</span>
        <li>
          {step3 ? (
            <Link to="/placeorder" className="text-indigo-600 font-bold hover:underline">Place Order</Link>
          ) : (
            <span className="text-gray-400">Place Order</span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
