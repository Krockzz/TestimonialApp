// components/PricingCard.jsx
export default function PricingCard({ title, price, features }) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-3xl font-bold text-blue-600 my-4">{price}</p>
  
          <ul className="list-disc text-left text-gray-700 dark:text-gray-300">
            {features.map((feature, index) => (
              <li key={index} className="my-2">{feature}</li>
            ))}
          </ul>
  
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Sign Up
          </button>
        </div>
      </div>
    );
  }
  