import React from "react";
import OrderItem from "../home/OrderItems";
import { useSelector } from "react-redux";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";

const OrderDetailsModal = ({ isModalOpen, closeModal }) => {
  const cart = useSelector((state) => state.pizza.cart);
  const isDelivery = useSelector(selectDeliveryStatus);
  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => {
    const sizePrice = isDelivery
      ? item.sizes[0]?.deliveryPrice
      : item.sizes[0]?.takeAwayPrice;

    const extrasPrice = item.extras.reduce((sum, group) => {
      return (
        sum +
        group.selectedExtras.reduce((groupSum, extra) => {
          return groupSum + (extra?.price || 0);
        }, 0)
      );
    }, 0);
    const dealExtrasPrice = item.dealExtras.reduce((sum, group) => {
      return (
        sum +
        group.selectedExtras.reduce((groupSum, extra) => {
          return groupSum + (extra?.price || 0);
        }, 0)
      );
    }, 0);

    return (
      total + ((sizePrice || 0) + extrasPrice + dealExtrasPrice) * item.quantity
    );
  }, 0);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex lg:hidden justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Orderss</h2>
              <button className="hover:text-gray-800" onClick={closeModal}>
                <i className="fa-regular fa-circle-xmark font-sm"></i>
              </button>
            </div>
            <div className=" pr-2 overflow-auto">
              {cart.length === 0 ? (
                <div className="h-[10rem] flex items-center justify-center">
                  <p className="text-center">Your shopping cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((order, index) => (
                    <OrderItem key={index} {...order} />
                  ))}
                </>
              )}
            </div>
            <button
              className="w-full text-white py-3 rounded mt-6 text-lg font-medium bg-[#00274D] active:bg-[#001C3A] flex justify-between px-4"
              onClick={closeModal}
            >
              <p>CheckOut</p>
              <p>${totalAmount.toFixed(2)}</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsModal;
