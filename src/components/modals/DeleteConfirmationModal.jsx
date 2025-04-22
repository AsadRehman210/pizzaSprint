import React from "react";

const DeleteConfirmationModal = ({ name, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
      <h1 className="text-xl font-semibold mb-4">Confirm Delete</h1>
      <p className="text-base mb-6">
        Please confirm that you want to remove 1 <strong>{name}</strong> from your order?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-[#00274D] text-white px-4 py-2 rounded hover:bg-[#001C3A]"
        >
          Confirm
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default DeleteConfirmationModal;
