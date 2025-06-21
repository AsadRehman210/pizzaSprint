import React, { useState } from "react";
import pizza from "../../assets/images/pizza.png";
import discounted from "../../assets/images/discount.svg";
import { useDispatch, useSelector } from "react-redux";
// import { removePizza, updateQuantity } from "../../redux/actions/PizzaActions";
import message from "../../assets/images/message.svg";
import MessageModal from "../modals/MessageModal";
import "react-confirm-alert/src/react-confirm-alert.css";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";
import PizzaSelectedModal from "../modals/PizzaSelectedModal";
import {
  removePizzaFromCart,
  updatePizzaQuantity,
} from "../../redux/slice/pizzaSlice";

const OrderItem = ({
  id,
  name,
  dealSize,
  sizes,
  extras,
  dealExtras,
  totalPrice,
  discountedPrice,
  quantity,
  selectedPizzaDetail,
}) => {
  const dispatch = useDispatch();
  const isDelivery = useSelector(selectDeliveryStatus);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Calculate the price based on delivery status
  const calculateCurrentPrice = () => {
    try {
      // Base price from size with fallback
      const sizePrice =
        parseFloat(
          isDelivery
            ? sizes[0]?.deliveryPrice || 0
            : sizes[0]?.takeAwayPrice || 0
        ) || 0;

      // Calculate extras price
      const extrasPrice = extras.reduce((total, group) => {
        const groupTotal = (group.selectedExtras || []).reduce((sum, extra) => {
          // Use the direct price from extra object
          return sum + (parseFloat(extra.price) || 0);
        }, 0);
        return total + groupTotal;
      }, 0);
      const DealExtrasPrice = dealExtras.reduce((total, group) => {
        const groupTotal = (group.selectedExtras || []).reduce((sum, extra) => {
          // Use the direct price from extra object
          return sum + (parseFloat(extra.price) || 0);
        }, 0);
        return total + groupTotal;
      }, 0);

      return (sizePrice + extrasPrice + DealExtrasPrice) * quantity;
    } catch (error) {
      console.error("Error calculating current price:", error);
      return 0;
    }
  };

  const calculateOriginalPrice = () => {
    try {
      // Base price from size with fallback
      const sizePrice = parseFloat(sizes[0]?.deliveryPrice || 0) || 0;

      // Calculate extras price
      const extrasPrice = extras.reduce((total, group) => {
        const groupTotal = (group.selectedExtras || []).reduce((sum, extra) => {
          // Use the direct price from extra object
          return sum + (parseFloat(extra.price) || 0);
        }, 0);
        return total + groupTotal;
      }, 0);
      const dealExtrasPrice = dealExtras.reduce((total, group) => {
        const groupTotal = (group.selectedExtras || []).reduce((sum, extra) => {
          // Use the direct price from extra object
          return sum + (parseFloat(extra.price) || 0);
        }, 0);
        return total + groupTotal;
      }, 0);

      return (sizePrice + extrasPrice + dealExtrasPrice) * quantity;
    } catch (error) {
      console.error("Error calculating original price:", error);
      return 0;
    }
  };

  const currentPrice = calculateCurrentPrice();
  const originalPrice = calculateOriginalPrice();

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    dispatch(
      updatePizzaQuantity({
        id,
        sizeId: sizes[0]?.sizeId,
        extras,
        dealExtras,
        quantity: newQuantity,
        selectedPizzaDetail,
      })
    );
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(
        updatePizzaQuantity({
          id,
          sizeId: sizes[0]?.sizeId,
          extras,
          dealExtras,
          quantity: newQuantity,
          selectedPizzaDetail,
        })
      );
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleRemoveItem = () => {
    dispatch(
      removePizzaFromCart({
        id,
        sizeId: sizes[0]?.sizeId,
        extras,
        dealExtras,
        selectedPizzaDetail,
      })
    );
    setIsDeleteModalOpen(false);
  };

  const openMessageModal = (name) => {
    setProductName(name);
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  const handleMessageSubmit = (message) => {
    console.log("Message Submitted:", message);
  };

  // Flatten all selected extras into one array
  const allSelectedExtras = extras.flatMap((group) =>
    group.selectedExtras.map((extra) => ({
      name: extra.name,
      groupName: group.groupName,
      price: isDelivery ? extra?.deliveryPrice : extra?.takeAwayPrice,
    }))
  );

  const allSelectedDealExtras = dealExtras.flatMap((group) =>
    group.selectedExtras.map((extra) => ({
      groupId: group.groupId,
      name: extra.name,
      groupName: group.groupName,
      price: extra.price,
      extraId: extra.id,
    }))
  );
  return (
    <div className="flex flex-col gap-2 items-center justify-start border-b-2 border-[#D8D8D8] pb-4 mb-4">
      <div
        className="flex items-center justify-between gap-4 w-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-1">
          <h3 className="text-base lg:text-xl font-semibold">{name}</h3>
          <p className="text-xs lg:text-sm font-medium font-poppins">
            {sizes[0]?.size || dealSize?.name}
          </p>

          {/* Extras summary in comma-separated format */}
          <div className="text-[0.625rem] lg:text-sm font-normal text-[#4D4D4D]">
            {allSelectedExtras.length > 0 && (
              <span>
                {allSelectedExtras.map((extra, index) => (
                  <span key={index}>
                    {extra.name}
                    {index < allSelectedExtras.length - 1 && ", "}
                  </span>
                ))}
              </span>
            )}
            {allSelectedDealExtras.length > 0 && (
              <span>
                {allSelectedDealExtras.map((extra, index) => (
                  <span key={index}>
                    {extra.name}
                    {index < allSelectedDealExtras.length - 1 && ", "}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
        <img
          src={pizza}
          alt={name}
          className="w-[3.25rem] lg:w-[3.438rem] h-[3.25rem] lg:h-[3.438rem] object-cover rounded"
        />
      </div>

      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex justify-between gap-4">
          <div className="flex items-center border rounded-md bg-[#D9D9D9] p-1">
            {quantity > 1 ? (
              <button
                className="w-6 h-6 text-white rounded bg-[#17A2B8] active:bg-[#16939B] flex justify-center items-center"
                onClick={handleDecreaseQuantity}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
            ) : (
              <button
                className="w-6 h-6 text-white rounded bg-[#DC3545] active:bg-[#B82F3C] flex justify-center items-center"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <i className="fa-solid fa-trash text-sm"></i>
              </button>
            )}
            <span className="text-base font-semibold w-10 text-center">
              {quantity}
            </span>
            <button
              className="w-6 h-6 text-white rounded bg-[#28A745] active:bg-[#218838] flex justify-center items-center"
              onClick={handleIncreaseQuantity}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div
            className="bg-[#FD7E14] active:bg-[#D56A0A] cursor-pointer flex justify-center items-center rounded w-8 h-8 message"
            onClick={() => openMessageModal(name)}
          >
            <img src={message} alt="message" />
          </div>
        </div>
        <div className="text-right flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm lg:text-base font-medium font-poppins">
              {currentPrice.toFixed(2)} €
            </p>
            {discountedPrice > 0 && (
              <p className="text-xs line-through font-poppins text-[#4D4D4D]">
                {originalPrice.toFixed(2)} €
              </p>
            )}
          </div>
          {discountedPrice > 0 && (
            <div className="flex gap-2 justify-end">
              <img src={discounted} alt="discount pic" />
              <p className="text-[0.625rem] lg:text-xs font-medium font-poppins">
                {discountedPrice}% Discount
              </p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && selectedPizzaDetail && (
        <PizzaSelectedModal
          selectedPizza={selectedPizzaDetail}
          closeModal={closeModal}
        />
      )}

      {/* Modals */}
      {isMessageModalOpen && (
        <MessageModal
          closeModal={closeMessageModal}
          handleSubmit={handleMessageSubmit}
          productName={productName}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          name={name}
          onConfirm={handleRemoveItem}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderItem;
