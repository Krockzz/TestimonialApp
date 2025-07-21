// components/ConfirmModal.jsx
export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg border border-white/10">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
