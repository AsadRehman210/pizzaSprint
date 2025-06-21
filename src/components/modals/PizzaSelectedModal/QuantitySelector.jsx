import React from "react";

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center border rounded-md bg-[#D9D9D9] p-1">
    <button
      className="w-6 h-6 text-white rounded bg-[#17A2B8] active:bg-[#16939B] flex justify-center items-center"
      onClick={onDecrease}
    >
      <i className="fa-solid fa-minus"></i>
    </button>
    <span className="text-base font-semibold w-10 text-center">{quantity}</span>
    <button
      className="w-6 h-6 text-white rounded bg-[#28A745] active:bg-[#218838] flex justify-center items-center"
      onClick={onIncrease}
    >
      <i className="fa-solid fa-plus"></i>
    </button>
  </div>
);

export default QuantitySelector;
