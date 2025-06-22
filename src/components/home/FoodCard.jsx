import React, { useState } from "react";
import pizza from "../../assets/images/pizza.png";
import info from "../../assets/images/info.svg";
import InfoModal from "../modals/InfoModal";
import { useSelector } from "react-redux";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";

const FoodCard = ({
  item,
  onPizzaClick,
  setIsInfoModalTriggered,
  discount,
}) => {
  const isDelivery = useSelector(selectDeliveryStatus);
  const cart = useSelector((state) => state.pizza.cart);
  // console.log("cart", cart);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  // Find this item in the cart
  const cartItem = cart.find(
    (cartItem) => cartItem.selectedPizzaDetail.items.id === item.id
  );
  // Function to open the info modal
  const openInfoModal = (e) => {
    e.stopPropagation();
    setInfoModalOpen(true);
    setIsInfoModalTriggered(true);
  };

  // Function to close the info modal
  const closeInfoModal = () => {
    setInfoModalOpen(false);
    setIsInfoModalTriggered(false); // Reset the trigger state when closing
  };

  const getPrice = (priceObj) => {
    if (!priceObj) return 0;
    return isDelivery ? priceObj.deliveryPrice : priceObj.takeAwayPrice;
  };
  return (
    <div
      key={item.id}
      onClick={() => onPizzaClick(item)}
      className="relative border-2 bg-white hover:bg-yellow-50 p-3 rounded-lg shadow hover:shadow-xl transition duration-200 flex items-center gap-[1.438rem] cursor-pointer"
    >
      {/* show number of quantity */}
      {cartItem && (
        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-md shadow">
          {cartItem.quantity}
        </div>
      )}
      <div className="w-[4.5rem] h-[4.5rem]">
        <img
          src={pizza}
          alt="Pizza Margherita"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div>
        <div className="flex gap-4 items-center mb-2 ">
          <h3 className="text-base sm:text-lg font-semibold ">{item?.name}</h3>
          {item?.description && (
            <img
              src={info}
              alt="info"
              className="w-3.5 h-3.5"
              onClick={openInfoModal}
            />
          )}
        </div>
        <div className="bg-[#F3DFAC] py-1 px-2 rounded font-poppins inline-block">
          <span className="text-sm font-medium mr-2">
            {getPrice(item?.price[0])?.toFixed(2)}€
          </span>
          {discount?.amount && (
            <span className="text-[0.625rem] font-medium line-through">
              {(
                getPrice(item?.price[0]) +
                getPrice(item?.price[0]) * (discount?.amount / 100)
              ).toFixed(2)}{" "}
              €
            </span>
          )}
        </div>
      </div>
      {/* Info Modal is conditionally rendered */}
      {infoModalOpen && <InfoModal item={item} closeModal={closeInfoModal} />}
    </div>
  );
};

export default FoodCard;
