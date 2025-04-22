import React from "react";

const InfoModal = ({ item, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <button onClick={closeModal} className=" hover:text-red-800">
            <i className="fa-regular fa-circle-xmark font-sm"></i>
          </button>
        </div>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          tincidunt justo sit amet risus vehicula.
        </p>
        <a
          href="tel:01774040220"
          className="flex gap-4 items-center text-base font-normal font-poppins mt-4"
        >
          <i className="fa-solid fa-phone"></i>
          <p>01774040220</p>
        </a>
      </div>
    </div>
  );
};

export default InfoModal;
