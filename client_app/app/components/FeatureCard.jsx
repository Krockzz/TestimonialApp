export default function FeatureCard({ title, description }) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-md text-center">
        <h3 className="text-xl font-semibold text-blue-400 mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    );
  }
  