import React from "react";

const AddToCartButton = ({ isUpdate, totalPrice, onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#00274D] text-white py-2 rounded-lg active:bg-[#001C3A] flex-1 flex justify-between px-4"
  >
    <p>{isUpdate ? "Update Cart" : "Add to Cart"}</p>
    <p>{totalPrice.toFixed(2)} €</p>
  </button>
);

export default AddToCartButton;
