export default function Receipt({ orderDetails, customerDetails }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Receipt</h2>
        <p className="text-gray-500">Order #{orderDetails.orderId}</p>
        <p className="text-gray-500">{new Date(orderDetails.timestamp).toLocaleString()}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Customer Details</h3>
        <p>Name: {customerDetails.name}</p>
        <p>Email: {customerDetails.email}</p>
        <p>Phone: {customerDetails.phone}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Order Items</h3>
        <div className="space-y-2">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{orderDetails.total}</span>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}