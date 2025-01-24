import { useCart } from '../context/CartContext';

export default function ServiceCard({ service }) {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: service });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={service.image} 
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
        <p className="text-gray-600 mt-2">{service.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-gray-800 font-bold">₹{service.price}</span>
            <span className="text-gray-500 text-sm ml-2">/ {service.duration}</span>
          </div>
          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {service.category}
          </span>
        </div>
      </div>
    </div>
  );
}