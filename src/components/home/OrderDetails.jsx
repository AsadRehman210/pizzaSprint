import React from "react";
import OrderItem from "./OrderItems";
import { useSelector } from "react-redux";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";

const OrderDetails = ({ selectedArea }) => {
  const cart = useSelector((state) => state.pizza.cart);
  const isDelivery = useSelector(selectDeliveryStatus);

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => {
    const sizePrice = isDelivery
      ? item.sizes[0].deliveryPrice
      : item.sizes[0].takeAwayPrice;

    const extrasPrice = item.extras.reduce((sum, group) => {
      return (
        sum +
        group.selectedExtras.reduce((groupSum, extra) => {
          return (
            groupSum + (isDelivery ? extra.deliveryPrice : extra.takeAwayPrice)
          );
        }, 0)
      );
    }, 0);

    return total + (sizePrice + extrasPrice) * item.quantity;
  }, 0);

  // Calculate progress towards minimum order amount
  const calculateProgress = () => {
    if (!selectedArea || !isDelivery) return 100; // No minimum for pickup or no area selected
    const minAmount = selectedArea.minimumOrderAmount;
    return Math.min((totalAmount / minAmount) * 100, 100);
  };

  const handleCheckoutClick = () => {
    if (!meetsMinimum) {
      toast.error(
        `Minimum order amount is ${selectedArea?.minimumOrderAmount.toFixed(
          2
        )} €`
      );
      return;
    }
    console.log("Selected Items:", cart);
    console.log("Detailed Order Info:", {
      items: cart,
      totalAmount: totalAmount.toFixed(2),
      isDelivery,
      selectedArea,
    });
  };

  // Check if order meets minimum amount
  const meetsMinimum =
    !isDelivery ||
    !selectedArea ||
    totalAmount >= selectedArea.minimumOrderAmount;

  return (
    <div className="border-0 lg:border-l-2 border-[#D8D8D8] pl-0 lg:pl-4 w-full hidden lg:flex flex-col sticky top-[40px] sticky-height">
      <h2 className="text-2xl font-semibold mb-4 mt-6">Your Order</h2>

      {/* Progress bar for minimum order amount */}
      {isDelivery &&
        selectedArea &&
        totalAmount < selectedArea.minimumOrderAmount && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>
                Add{" "}
                {Math.max(
                  0,
                  (selectedArea.minimumOrderAmount - totalAmount).toFixed(2)
                )}{" "}
                € more to order
              </span>
              <span>
                {totalAmount.toFixed(2)} /{" "}
                {selectedArea.minimumOrderAmount.toFixed(2)} €
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#00274D] h-2.5 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        )}

      <div className="max-h-[26rem] min-h-[10rem] overflow-auto pr-2">
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
        onClick={handleCheckoutClick}
        className={`w-full text-white py-3 rounded mt-6 text-lg font-medium flex justify-between px-4 bg-[#00274D] active:bg-[#001C3A]`}
        // disabled={!meetsMinimum}
      >
        <p>CheckOut</p>
        <p>{totalAmount.toFixed(2)} €</p>
      </button>
    </div>
  );
};

export default OrderDetails;
