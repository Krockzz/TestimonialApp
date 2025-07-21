// components/InputField.jsx
export default function InputField({ label, type, value, onChange, placeholder }) {
    return (
      <div className="mb-4">
        <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          id={label}
          type={type}
          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
  