import React from "react";

const ModalHeader = ({ title, onClose }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[1.75rem] font-semibold">{title}</h3>
    <button onClick={onClose} className="hover:text-red-800">
      <i className="fa-regular fa-circle-xmark font-sm"></i>
    </button>
  </div>
);

export default ModalHeader;
