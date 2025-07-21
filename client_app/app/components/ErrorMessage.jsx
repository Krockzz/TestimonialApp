// components/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
    if (!message) return null; // Only show the error message if it's not empty
    return <div className="text-red-600 text-sm mb-4">{message}</div>;
  }
  