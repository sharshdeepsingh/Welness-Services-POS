import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CustomerForm from './CustomerForm';
import PaymentForm from './PaymentForm';
import Receipt from './Receipt';

export default function Cart() {
  const { state, dispatch } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, customer, payment, receipt
  const [customerDetails, setCustomerDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCustomerSubmit = (data) => {
    setCustomerDetails(data);
    setCheckoutStep('payment');
  };

  const handlePaymentComplete = (paymentDetails) => {
    const orderDetails = {
      orderId: 'ORD' + Date.now(),
      items: state.items,
      total,
      timestamp: paymentDetails.timestamp,
      transactionId: paymentDetails.transactionId
    };
    setOrderDetails(orderDetails);
    dispatch({ type: 'CLEAR_CART' });
    setCheckoutStep('receipt');
  };

  if (checkoutStep === 'receipt') {
    return <Receipt orderDetails={orderDetails} customerDetails={customerDetails} />;
  }

  if (state.items.length === 0 && checkoutStep === 'cart') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        {checkoutStep === 'cart' && 'Shopping Cart'}
        {checkoutStep === 'customer' && 'Customer Details'}
        {checkoutStep === 'payment' && 'Payment'}
      </h2>

      {checkoutStep === 'cart' && (
        <>
          {state.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 bg-gray-200 rounded-l"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded-r"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₹{total}</span>
          </div>
          <button
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={() => setCheckoutStep('customer')}
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {checkoutStep === 'customer' && (
        <CustomerForm onSubmit={handleCustomerSubmit} />
      )}

      {checkoutStep === 'payment' && (
        <PaymentForm amount={total} onPaymentComplete={handlePaymentComplete} />
      )}
    </div>
  );
}