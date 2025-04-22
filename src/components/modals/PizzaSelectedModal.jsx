import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";
import { addPizzaToCart } from "../../redux/slice/pizzaSlice";

const PizzaSelectedModal = ({ selectedPizza, closeModal }) => {
  const isDelivery = useSelector(selectDeliveryStatus);
  const dispatch = useDispatch();

  // Initialize selectedSize based on hasSizes
  const [selectedSize, setSelectedSize] = useState(
    selectedPizza.hasSizes
      ? selectedPizza.price[0]
      : {
          deliveryPrice: selectedPizza.price[0].deliveryPrice,
          takeAwayPrice: selectedPizza.price[0].takeAwayPrice,
        }
  );

  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleExtraChange = (extra) => {
    if (selectedExtras.includes(extra)) {
      setSelectedExtras(selectedExtras.filter((item) => item !== extra));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "17px";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // Get the correct price based on delivery status and object structure
  const getPrice = (priceObj) => {
    if (!priceObj) return 0;

    // Handle extras pricing (direct price property)
    if (priceObj.price !== undefined) {
      return Number(priceObj.price) || 0;
    }

    // Handle size pricing (delivery/takeaway prices)
    const price = isDelivery ? priceObj.deliveryPrice : priceObj.takeAwayPrice;
    return Number(price) || 0;
  };

  // Calculate total price, including extras
  const calculateTotalPrice = () => {
    let total = getPrice(selectedSize);

    // Add price of selected extras for the current size
    selectedExtras.forEach((extra) => {
      const extraPriceObj = extra.price.find(
        (p) => p.sizeId === selectedSize.sizeId
      );
      if (extraPriceObj) {
        total += getPrice(extraPriceObj);
      }
    });

    return total * quantity;
  };

  // Calculate the price of a single product (size + extras)
  const calculateSingleProductPrice = () => {
    let total = getPrice(selectedSize);

    // Add price of selected extras for the current size
    selectedExtras.forEach((extra) => {
      const extraPriceObj = extra.price.find(
        (p) => p.sizeId === selectedSize.sizeId
      );
      if (extraPriceObj) {
        total += getPrice(extraPriceObj);
      }
    });
    return total;
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const pizzaData = {
      id: selectedPizza.id,
      name: selectedPizza.name,
      totalPrice: calculateTotalPrice(),
      price: calculateSingleProductPrice(),
      sizes: [
        {
          size: selectedSize.sizeName,
          price: getPrice(selectedSize),
          sizeId: selectedSize.sizeId,
          deliveryPrice: selectedSize.deliveryPrice,
          takeAwayPrice: selectedSize.takeAwayPrice,
        },
      ],
      extras: selectedPizza.group
        .map((group) => {
          const selectedGroupExtras = selectedExtras
            .filter((extra) =>
              group.groupOption.some((option) => option.id === extra.id)
            )
            .map((extra) => {
              const priceObj = extra.price.find(
                (p) => p.sizeId === selectedSize.sizeId
              );
              return {
                name: extra.name,
                price: priceObj ? getPrice(priceObj) : 0,
                id: extra.id,
                groupId: group.id,
                deliveryPrice: priceObj?.price || 0, // Using price for both as per your data structure
                takeAwayPrice: priceObj?.price || 0, // Using price for both as per your data structure
              };
            });

          return selectedGroupExtras.length > 0
            ? {
                groupName: group.name,
                groupId: group.id,
                selectedExtras: selectedGroupExtras,
              }
            : null;
        })
        .filter((group) => group !== null),
      quantity: quantity,
      discountedPrice: selectedPizza.discountedPrice,
      isDelivery: isDelivery,
    };

    dispatch(addPizzaToCart(pizzaData));
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[1.75rem] font-semibold">{selectedPizza.name}</h3>
          <button onClick={closeModal} className=" hover:text-red-800">
            <i className="fa-regular fa-circle-xmark font-sm"></i>
          </button>
        </div>

        {selectedPizza.hasSizes && (
          <div className="flex flex-col gap-4 pr-2 overflow-auto addReadMore">
            {/* Product size section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h4 className="text-base font-bold">Your Size</h4>
                  <p className="text-sm font-noraml font-poppins">Choose 1</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
                    Required
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                {selectedPizza?.price?.map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="size"
                      id={`size-${index}`}
                      checked={selectedSize.sizeName === item.sizeName}
                      onChange={() => handleSizeChange(item)}
                      className="appearance-none border border-[#00274D] rounded-full w-4 h-4 checked:bg-[#00274D] checked:border-[#00274D] focus:outline-none"
                    />
                    <label
                      htmlFor={`size-${index}`}
                      className="flex justify-between w-full"
                    >
                      <p className="text-sm font-medium font-poppins">
                        {item.sizeName}
                      </p>
                      <p className="text-sm font-medium font-poppins">
                        {getPrice(item)} €
                      </p>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extra topping section */}
            {selectedPizza?.group.map((extra, index) => (
              <div key={index}>
                <div className="flex justify-between border-t border-[#D8D8D8] py-3">
                  <div className="flex flex-col">
                    <h4 className="text-base font-semibold">{extra.name}</h4>
                    <p className="text-sm font-noraml font-poppins">
                      Choose as many as you want
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
                      Optional
                    </p>
                  </div>
                </div>

                <ul className="my-2 space-y-2">
                  {extra?.groupOption?.map((item, extraIndex) => {
                    const priceObj = item.price.find(
                      (p) => p.sizeId === selectedSize.sizeId
                    );
                    const price = priceObj ? getPrice(priceObj) : 0;

                    return (
                      <li key={extraIndex} className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          id={`extra-${extraIndex}`}
                          checked={selectedExtras.includes(item)}
                          onChange={() => handleExtraChange(item)}
                          className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-[#00274D] checked:border-[#00274D] focus:outline-none focus:ring-none cursor-pointer
                        checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:justify-center checked:before:items-center relative"
                        />
                        <label
                          htmlFor={`extra-${extraIndex}`}
                          className="flex justify-between w-full"
                        >
                          <p className="text-sm font-medium font-poppins">
                            {item.name}
                          </p>
                          <p className="text-sm font-medium font-poppins">
                            {price} €
                          </p>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Quantity and Add to Cart section */}
        <div
          className={`flex gap-2 ${!selectedPizza.hasSizes ? "mt-20" : "mt-4"}`}
        >
          <div className="flex items-center border rounded-md bg-[#D9D9D9] p-1">
            <button
              className="w-6 h-6 text-white rounded bg-[#17A2B8] active:bg-[#16939B] flex justify-center items-center"
              onClick={handleDecreaseQuantity}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
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
          <button
            onClick={handleAddToCart}
            className="bg-[#00274D] text-white py-2 rounded-lg active:bg-[#001C3A] flex-1 flex justify-between px-4"
          >
            <p>Add to Cart</p>
            <p>{calculateTotalPrice().toFixed(2)} €</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaSelectedModal;
