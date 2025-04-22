import React, { useState } from "react";

const MessageModal = ({ closeModal, handleSubmit, productName }) => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    handleSubmit(message);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold">Comment for {productName}</h3>
          <button onClick={closeModal} className=" hover:text-red-800">
            <i className="fa-regular fa-circle-xmark font-sm"></i>
          </button>
        </div>
        <p>Special requests, allergies, diets, restrictions?</p>
        <textarea
          value={message}
          onChange={handleMessageChange}
          rows="4"
          placeholder="Special requests, allergies, diets, restrictions?"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitMessage}
            className="bg-[#00274D] text-white py-2 px-4 rounded-lg w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
