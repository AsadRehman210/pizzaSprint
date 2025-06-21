import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDeliveryStatus } from "../../redux/slice/authSlice";
import { addPizzaToCart } from "../../redux/slice/pizzaSlice";
import ModalHeader from "./PizzaSelectedModal/ModalHeader";
import OptionGroupHeader from "./PizzaSelectedModal/OptionGroupHeader";
import QuantitySelector from "./PizzaSelectedModal/QuantitySelector";
import AddToCartButton from "./PizzaSelectedModal/AddToCartButton";

// Helper functions
const getPrice = (priceObj, isDelivery) => {
  if (!priceObj) return 0;
  if (priceObj.price !== undefined) return Number(priceObj.price) || 0;
  const price = isDelivery ? priceObj?.deliveryPrice : priceObj?.takeAwayPrice;
  return Number(price) || 0;
};

const findExistingPizza = (cart, selectedPizza) => {
  return cart.find(
    (item) =>
      item.id === selectedPizza?.id &&
      item.selectedPizzaDetail?.items?.id === selectedPizza?.items?.id
  );
};

const useModalScrollLock = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "17px";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
};

const PizzaSelectedModal = ({ selectedPizza, closeModal }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.pizza.cart);
  const isDelivery = useSelector(selectDeliveryStatus);

  const existingPizza = useMemo(
    () => findExistingPizza(cart, selectedPizza),
    [cart, selectedPizza]
  );

  // State initialization
  const [selectedSize, setSelectedSize] = useState(() => {
    if (existingPizza?.sizes?.length > 0) {
      return (
        selectedPizza?.items?.price?.find(
          (size) => size.sizeId === existingPizza?.sizes[0]?.sizeId
        ) || selectedPizza?.items?.price?.[0]
      );
    }
    return selectedPizza?.items?.price?.[0] || null;
  });

  const [selectedDealItem, setSelectedDealItem] = useState(() => {
    if (!selectedPizza?.items?.dealItems) return null;
    if (existingPizza?.dealSize) {
      return (
        selectedPizza.items.dealItems[0]?.selectableItems?.find(
          (item) => item.id === existingPizza.dealSize.id
        ) || selectedPizza.items.dealItems[0]?.selectableItems?.[0]
      );
    }
    return selectedPizza.items.dealItems[0]?.selectableItems?.[0] || null;
  });

  const [selectedExtras, setSelectedExtras] = useState(() => {
    if (!existingPizza?.extras) return [];
    return (
      selectedPizza?.group?.flatMap((group) =>
        group.groupOption.filter((option) =>
          existingPizza.extras.some((extraGroup) =>
            extraGroup.selectedExtras.some((extra) => extra.id === option.id)
          )
        )
      ) || []
    );
  });

  const [selectedDealExtras, setSelectedDealExtras] = useState(() => {
    if (!existingPizza?.dealExtras) return [];
    return (
      selectedPizza?.items?.dealItems?.[0]?.group?.flatMap((group) =>
        group.groupOption.filter((option) =>
          existingPizza?.dealExtras?.some((extraGroup) =>
            extraGroup.selectedExtras.some((extra) => extra.id === option.id)
          )
        )
      ) || []
    );
  });

  const [quantity, setQuantity] = useState(existingPizza?.quantity || 1);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleDealItemChange = (item) => {
    setSelectedDealItem(item);
  };

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const handleDealExtraChange = (extra) => {
    setSelectedDealExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const buildPizzaData = () => {
    const isDeal = selectedPizza?.items?.itemType === "deal";

    const extras =
      selectedPizza?.group
        ?.map((group) => {
          const groupExtras = selectedExtras.filter((extra) =>
            group.groupOption.some((option) => option.id === extra.id)
          );

          return groupExtras.length > 0
            ? {
                groupId: group.id,
                groupName: group.name,
                selectedExtras: groupExtras.map((extra) => ({
                  id: extra.id,
                  name: extra.name,
                  price: getPrice(
                    extra.price.find((p) => p.sizeId === selectedSize?.sizeId),
                    isDelivery
                  ),
                })),
              }
            : null;
        })
        .filter(Boolean) || [];

    const dealExtras =
      isDeal && selectedPizza?.items?.dealItems?.[0]?.group
        ? selectedPizza.items.dealItems[0].group
            .map((group) => {
              const groupExtras = selectedDealExtras?.filter((extra) =>
                group.groupOption.some((option) => option.id === extra.id)
              );

              return groupExtras.length > 0
                ? {
                    groupId: group.id,
                    groupName: group.name,
                    selectedExtras: groupExtras.map((extra) => ({
                      id: extra.id,
                      name: extra.name,
                      price: getPrice(extra.price?.[0], isDelivery),
                    })),
                  }
                : null;
            })
            .filter(Boolean)
        : [];

    const basePrice = getPrice(selectedSize, isDelivery);

    const extrasTotal = [...extras, ...dealExtras].reduce(
      (total, group) =>
        total +
        (group?.selectedExtras || []).reduce(
          (sum, extra) => sum + (extra?.price || 0),
          0
        ),
      0
    );

    const totalPrice = (basePrice + extrasTotal) * quantity;

    return {
      id: selectedPizza.id,
      name: selectedPizza.items.name,
      price: basePrice,
      totalPrice,
      sizes: selectedPizza.hasSizes
        ? [
            {
              size: selectedSize.sizeName,
              sizeId: selectedSize.sizeId,
              deliveryPrice: selectedSize.deliveryPrice,
              takeAwayPrice: selectedSize.takeAwayPrice,
            },
          ]
        : [selectedPizza?.items?.price?.[0]],
      extras,
      dealSize: isDeal ? selectedDealItem : null,
      dealExtras,
      quantity,
      isDelivery,
      selectedPizzaDetail: selectedPizza,
      // Add existing pizza ID if updating
      ...(existingPizza ? { existingPizzaId: existingPizza.id } : {}),
    };
  };

  const handleAddToCart = () => {
    const pizzaData = buildPizzaData();
    dispatch(addPizzaToCart(pizzaData));
    closeModal();
  };

  const renderSizeOptions = () => {
    if (!selectedPizza?.hasSizes || !selectedPizza?.items?.price?.length) {
      return null;
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h4 className="text-base font-bold">Size</h4>
            <p className="text-sm font-normal font-poppins">Choose 1</p>
          </div>
          <div className="flex items-center">
            <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
              Required
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {selectedPizza.items.price.map((size, index) => (
            <li key={index} className="flex items-center gap-4">
              <input
                type="radio"
                name="size"
                id={`size-${index}`}
                checked={selectedSize?.sizeId === size.sizeId}
                onChange={() => handleSizeChange(size)}
                className="appearance-none border border-[#00274D] rounded-full w-4 h-4 checked:bg-[#00274D] checked:border-[#00274D] focus:outline-none"
              />
              <label
                htmlFor={`size-${index}`}
                className="flex justify-between w-full"
              >
                <p className="text-sm font-medium font-poppins">
                  {size.sizeName}
                </p>
                <p className="text-sm font-medium font-poppins">
                  {getPrice(size, isDelivery)} €
                </p>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderDealItems = () => {
    if (selectedPizza?.items?.itemType !== "deal") return null;

    return selectedPizza?.items?.dealItems?.map((dealItem, dealIndex) => (
      <div key={dealIndex} className="flex flex-col gap-4">
        {dealItem.selectableItems && (
          <>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h4 className="text-base font-bold">
                  {dealItem.name || "Your Choice"}
                </h4>
                <p className="text-sm font-normal font-poppins">
                  {dealItem.isSelectable ? "Choose 1" : "Included"}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
                  {dealItem.isSelectable ? "Required" : "Included"}
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {dealItem.selectableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <input
                    type={dealItem.isSelectable ? "radio" : "checkbox"}
                    name={`deal-${dealIndex}`}
                    id={`deal-${dealIndex}-${index}`}
                    checked={
                      dealItem.isSelectable
                        ? selectedDealItem?.id === item.id
                        : true
                    }
                    onChange={() =>
                      dealItem.isSelectable && handleDealItemChange(item)
                    }
                    disabled={!dealItem.isSelectable}
                    className={`appearance-none border border-[#00274D] rounded-full w-4 h-4 ${
                      dealItem.isSelectable
                        ? "checked:bg-[#00274D] checked:border-[#00274D]"
                        : "bg-gray-200 border-gray-300"
                    } focus:outline-none`}
                  />
                  <label
                    htmlFor={`deal-${dealIndex}-${index}`}
                    className="flex justify-between w-full"
                  >
                    <p className="text-sm font-medium font-poppins">
                      {item.name}
                    </p>
                    {!dealItem.isSelectable && (
                      <p className="text-sm font-medium font-poppins">
                        Included
                      </p>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}

        {dealItem.group?.map((group, groupIndex) => (
          <div key={groupIndex}>
            <OptionGroupHeader
              title={group.name}
              description={
                group.selectionRequired ? "Choose at least one" : "Optional"
              }
              isRequired={group.selectionRequired}
            />

            <ul className="my-2 space-y-2">
              {group.groupOption?.map((option, optionIndex) => (
                <li key={optionIndex} className="flex items-center gap-4">
                  <input
                    type={group.selectionRequired ? "radio" : "checkbox"}
                    id={`${group.name}-${dealIndex}-${optionIndex}`}
                    checked={selectedDealExtras.some(
                      (extra) => extra.id === option.id
                    )}
                    onChange={() => handleDealExtraChange(option)}
                    className={`appearance-none h-5 w-5 border border-gray-300 ${
                      group.selectionRequired
                        ? "rounded-full checked:bg-[#00274D] checked:border-[#00274D]"
                        : "rounded-sm checked:bg-[#00274D] checked:border-[#00274D]"
                    } focus:outline-none focus:ring-none cursor-pointer
                      checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:justify-center checked:before:items-center relative`}
                  />
                  <label
                    htmlFor={`${group.name}-${dealIndex}-${optionIndex}`}
                    className="flex justify-between w-full"
                  >
                    <p className="text-sm font-medium font-poppins">
                      {option.name}
                    </p>
                    <p className="text-sm font-medium font-poppins">
                      {option.price[0]?.price} €
                    </p>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  const renderExtraGroups = () => {
    if (!selectedPizza?.group) return null;

    return selectedPizza.group.map((group, index) => (
      <div key={index}>
        <OptionGroupHeader
          title={group.name}
          description={
            group.selectionRequired ? "Choose at least one" : "Optional"
          }
          isRequired={group.selectionRequired}
        />

        <ul className="my-2 space-y-2">
          {group.groupOption?.map((option, optionIndex) => {
            const priceObj = option.price.find(
              (p) => p.sizeId === selectedSize?.sizeId
            );
            const price = priceObj ? getPrice(priceObj, isDelivery) : 0;

            return (
              <li key={optionIndex} className="flex items-center gap-4">
                <input
                  type={group.selectionRequired ? "radio" : "checkbox"}
                  id={`${group.name}-${optionIndex}`}
                  checked={selectedExtras.some(
                    (extra) => extra.id === option.id
                  )}
                  onChange={() => handleExtraChange(option)}
                  className={`appearance-none h-5 w-5 border border-gray-300 ${
                    group.selectionRequired
                      ? "rounded-full checked:bg-[#00274D] checked:border-[#00274D]"
                      : "rounded-sm checked:bg-[#00274D] checked:border-[#00274D]"
                  } focus:outline-none focus:ring-none cursor-pointer
                    checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:justify-center checked:before:items-center relative`}
                />
                <label
                  htmlFor={`${group.name}-${optionIndex}`}
                  className="flex justify-between w-full"
                >
                  <p className="text-sm font-medium font-poppins">
                    {option.name}
                  </p>
                  <p className="text-sm font-medium font-poppins">{price} €</p>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    ));
  };

  useModalScrollLock();

  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
        <ModalHeader title={selectedPizza?.items?.name} onClose={closeModal} />

        <div className="flex flex-col gap-4 pr-2 overflow-auto">
          {renderDealItems()}
          {renderSizeOptions()}
          {renderExtraGroups()}
        </div>

        <div
          className={`flex gap-2 ${
            !selectedPizza?.hasSizes ? "mt-20" : "mt-4"
          }`}
        >
          <QuantitySelector
            quantity={quantity}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            onIncrease={() => handleQuantityChange(quantity + 1)}
          />
          <AddToCartButton
            isUpdate={!!existingPizza}
            totalPrice={
              buildPizzaData({
                selectedPizza,
                selectedSize,
                selectedExtras,
                selectedDealItem,
                selectedDealExtras,
                quantity,
                isDelivery,
              }).totalPrice
            }
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default PizzaSelectedModal;
