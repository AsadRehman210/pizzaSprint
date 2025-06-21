import { useCallback, useEffect, useMemo, useState } from "react";

export const getPrice = (priceObj, isDelivery) => {
  if (!priceObj) return 0;
  if (priceObj.price !== undefined) return Number(priceObj.price) || 0;

  const price = isDelivery ? priceObj?.deliveryPrice : priceObj?.takeAwayPrice;
  return Number(price) || 0;
};

export const findExistingPizza = (cart, selectedPizza) => {
  return cart.find(
    (item) =>
      item.id === selectedPizza?.id &&
      item.selectedPizzaDetail?.items?.id === selectedPizza?.items?.id
  );
};

export const getInitialSize = (existingPizza, selectedPizza) => {
  if (!selectedPizza) return null;

  if (existingPizza?.sizes?.length > 0) {
    return (
      selectedPizza?.items?.price?.find(
        (size) => size.sizeId === existingPizza?.sizes[0]?.sizeId
      ) || selectedPizza?.items?.price?.[0]
    );
  }

  return selectedPizza?.items?.price?.[0] || null;
};

export const getInitialDealSize = (existingPizza, selectedPizza) => {
  if (!selectedPizza) return null;

  if (existingPizza?.selectableItems) {
    const dealItem = selectedPizza?.items?.dealItems?.[0];
    if (dealItem?.selectableItems) {
      return dealItem.selectableItems.find(
        (item) => item.id === Object.values(existingPizza.selectableItems)[0].id
      );
    }
  }
  return selectedPizza?.items?.dealItems?.[0]?.selectableItems?.[0] || null;
};

export const getInitialExtras = (existingPizza, selectedPizza) => {
  if (!existingPizza?.extras) return [];

  const allSelectedExtras = existingPizza.extras.flatMap(
    (group) => group.selectedExtras
  );

  return (
    selectedPizza?.group?.flatMap((group) =>
      group.groupOption.filter((extra) =>
        allSelectedExtras.some((selected) => selected.id === extra.id)
      )
    ) || []
  );
};

export const getInitialDealExtras = (existingPizza, selectedPizza) => {
  if (existingPizza?.dealExtras?.length > 0) {
    return existingPizza.dealExtras.flatMap((group) => group.selectedExtras);
  }

  const dealGroups = selectedPizza?.items?.dealItems?.[0]?.group;
  if (dealGroups) {
    return dealGroups.flatMap((group) =>
      group.groupOption.filter((option) => option.isDefault)
    );
  }

  return [];
};

// Custom hooks
export const useModalScrollLock = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "17px";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
};

export const usePizzaState = (selectedPizza, cart) => {
  const existingPizza = useMemo(
    () => findExistingPizza(cart, selectedPizza),
    [cart, selectedPizza]
  );

  const [selectedSize, setSelectedSize] = useState(() =>
    getInitialSize(existingPizza, selectedPizza)
  );
  const [selectedDealSize, setSelectedDealSize] = useState(() =>
    getInitialDealSize(existingPizza, selectedPizza)
  );
  const [selectedExtras, setSelectedExtras] = useState(() =>
    getInitialExtras(existingPizza, selectedPizza)
  );
  const [dealSelectedExtras, setDealSelectedExtras] = useState(() =>
    getInitialDealExtras(existingPizza, selectedPizza)
  );
  const [quantity, setQuantity] = useState(existingPizza?.quantity || 1);

  return {
    selectedSize,
    setSelectedSize,
    selectedDealSize,
    setSelectedDealSize,
    selectedExtras,
    setSelectedExtras,
    dealSelectedExtras,
    setDealSelectedExtras,
    quantity,
    setQuantity,
    existingPizza,
  };
};

export const usePizzaHandlers = ({
  setSelectedSize,
  setSelectedDealSize,
  selectedExtras,
  setSelectedExtras,
  dealSelectedExtras,
  setDealSelectedExtras,
  setQuantity,
}) => {
  const handleSizeChange = (size) => setSelectedSize(size);
  const handleDealSizeChange = (item) => setSelectedDealSize(item);

  const toggleExtra = (extra, currentExtras, setExtras) => {
    setExtras(
      currentExtras.includes(extra)
        ? currentExtras.filter((item) => item !== extra)
        : [...currentExtras, extra]
    );
  };

  const handleExtraChange = (extra) =>
    toggleExtra(extra, selectedExtras, setSelectedExtras);

  const handleDealExtraChange = (extra) =>
    toggleExtra(extra, dealSelectedExtras, setDealSelectedExtras);

  const handleIncreaseQuantity = () => setQuantity((q) => q + 1);
  const handleDecreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return {
    handleSizeChange,
    handleDealSizeChange,
    handleExtraChange,
    handleDealExtraChange,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  };
};

export const usePizzaCalculations = ({
  selectedSize,
  selectedExtras,
  dealSelectedExtras,
  quantity,
  isDelivery,
}) => {
  const calculateTotalPrice = useCallback(() => {
    let total = getPrice(selectedSize, isDelivery);

    selectedExtras.forEach((extra) => {
      const extraPriceObj = extra.price.find(
        (p) => p.sizeId === selectedSize?.sizeId
      );
      if (extraPriceObj) {
        total += getPrice(extraPriceObj, isDelivery);
      }
    });

    dealSelectedExtras.forEach((extra) => {
      const priceObj = extra.price?.[0];
      if (priceObj) {
        total += getPrice(priceObj, isDelivery);
      }
    });

    return total * quantity;
  }, [selectedSize, selectedExtras, dealSelectedExtras, quantity, isDelivery]);

  return { calculateTotalPrice };
};

export const buildPizzaData = ({
  selectedPizza,
  selectedSize,
  selectedExtras,
  selectedDealSize,
  dealSelectedExtras,
  quantity,
  isDelivery,
  calculateTotalPrice,
}) => {
  const dealExtras =
    selectedPizza?.items?.itemType === "deal"
      ? selectedPizza.items.dealItems[0]?.group?.map((group) => ({
          groupId: group.id,
          groupName: group.name,
          groupOption: group.groupOption,
          selectedExtras: group.groupOption
            .filter((option) =>
              dealSelectedExtras.some((selected) => selected.id === option.id)
            )
            .map((extra) => ({
              id: extra.id,
              name: extra.name,
              price: getPrice(extra.price?.[0], isDelivery) || 0,
            })),
        }))
      : [];

  const extras = selectedPizza?.group
    ?.map((group) => {
      const selectedGroupExtras = selectedExtras
        .filter((extra) =>
          group.groupOption.some((option) => option.id === extra.id)
        )
        .map((extra) => {
          const priceObj = extra.price.find(
            (p) => p.sizeId === selectedSize?.sizeId
          );
          return {
            name: extra.name,
            price: getPrice(priceObj, isDelivery) || 0,
            id: extra.id,
            groupId: group.id,
            deliveryPrice: priceObj?.deliveryPrice || 0,
            takeAwayPrice: priceObj?.takeAwayPrice || 0,
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
    .filter(Boolean);

  return {
    id: selectedPizza?.id,
    name: selectedPizza?.items?.name,
    totalPrice: calculateTotalPrice(),
    price: getPrice(selectedSize, isDelivery) || 0,
    sizes: selectedPizza?.hasSizes
      ? [
          {
            size: selectedSize?.sizeName,
            price: getPrice(selectedSize, isDelivery),
            sizeId: selectedSize?.sizeId,
            deliveryPrice: selectedSize?.deliveryPrice,
            takeAwayPrice: selectedSize?.takeAwayPrice,
          },
        ]
      : [],
    extras,
    dealSize:
      selectedPizza?.items?.itemType === "deal" ? selectedDealSize : null,
    dealExtras,
    quantity,
    discountedPrice: selectedPizza?.discountedPrice,
    isDelivery,
    selectedPizzaDetail: selectedPizza,
  };
};
