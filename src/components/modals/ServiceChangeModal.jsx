import React from "react";

const ServiceChangeModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Change Service Type</h3>
          <button onClick={onCancel} className="hover:text-red-800">
            <i className="fa-regular fa-circle-xmark font-sm"></i>
          </button>
        </div>

        <p className="text-sm sm:text-base">
          You are changing the service type. If you change the service type, the
          price may also change. Do you want to proceed?
        </p>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#00274D] text-white rounded text-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceChangeModal;
