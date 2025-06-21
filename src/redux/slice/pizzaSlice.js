import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDelivery: true,
  cart: [],
  totalAmount: 0,
};

const calculatePizzaTotal = (pizza) => {
  try {
    // Safely parse base price with fallback to 0
    let total = parseFloat(pizza.price || 0) || 0;

    // Calculate extras price
    const extrasTotal = (pizza.extras || []).reduce((sum, group) => {
      const groupTotal = (group.selectedExtras || []).reduce(
        (groupSum, extra) => {
          return groupSum + (parseFloat(extra.price) || 0);
        },
        0
      );
      return sum + groupTotal;
    }, 0);

    // Calculate deal extras price
    const dealExtrasTotal = (pizza.dealExtras || []).reduce((sum, group) => {
      const groupTotal = (group.selectedExtras || []).reduce(
        (groupSum, extra) => {
          return groupSum + (parseFloat(extra.price) || 0);
        },
        0
      );
      return sum + groupTotal;
    }, 0);

    return (
      (total + extrasTotal + dealExtrasTotal) * (parseInt(pizza.quantity) || 1)
    );
  } catch (error) {
    console.error("Error calculating pizza total:", error);
    return 0;
  }
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setDeliveryStatus: (state, action) => {
      state.isDelivery = action.payload;
    },

    addPizzaToCart: (state, action) => {
      const newPizza = action.payload;

      // Find existing pizza by category ID and item ID
      const existingIndex = state.cart.findIndex(
        (pizza) =>
          pizza.id === newPizza.id &&
          pizza.selectedPizzaDetail?.items?.id ===
            newPizza.selectedPizzaDetail?.items?.id
      );

      if (existingIndex >= 0) {
        // Update the existing pizza with new data
        state.cart[existingIndex] = {
          ...newPizza,
          // Preserve the original ID
          id: state.cart[existingIndex].id,
        };
      } else {
        // Add new pizza if it doesn't exist
        state.cart.push(newPizza);
      }

      // Recalculate total amount
      state.totalAmount = state.cart.reduce(
        (total, pizza) => total + calculatePizzaTotal(pizza),
        0
      );
    },
    removePizzaFromCart: (state, action) => {
      const { id, sizeId, extras, dealExtras, selectedPizzaDetail } =
        action.payload;
      state.cart = state.cart.filter(
        (pizza) =>
          !(
            pizza.id === id &&
            pizza.selectedPizzaDetail?.items?.id ===
              selectedPizzaDetail?.items?.id &&
            pizza.sizes[0]?.sizeId === sizeId &&
            JSON.stringify(pizza.extras) === JSON.stringify(extras) &&
            JSON.stringify(pizza.dealExtras) === JSON.stringify(dealExtras)
          )
      );
      state.totalAmount = state.cart.reduce(
        (total, pizza) => total + calculatePizzaTotal(pizza),
        0
      );
    },

    updatePizzaQuantity: (state, action) => {
      const { id, sizeId, extras, dealExtras, quantity, selectedPizzaDetail } =
        action.payload;
      const pizza = state.cart.find(
        (pizza) =>
          pizza.id === id &&
          pizza.selectedPizzaDetail?.items?.id ===
            selectedPizzaDetail?.items?.id &&
          pizza.sizes[0]?.sizeId === sizeId &&
          JSON.stringify(pizza.extras) === JSON.stringify(extras) &&
          JSON.stringify(pizza.dealExtras) === JSON.stringify(dealExtras)
      );

      if (pizza) {
        pizza.quantity = quantity;
        pizza.totalPrice = calculatePizzaTotal(pizza);
      }

      state.totalAmount = state.cart.reduce(
        (total, pizza) => total + calculatePizzaTotal(pizza),
        0
      );
    },

    updateCartPricesForDeliveryStatus: (state) => {
      state.cart.forEach((pizza) => {
        // Update base price
        if (pizza.sizes.length > 0) {
          pizza.price = state.isDelivery
            ? pizza.sizes[0]?.deliveryPrice
            : pizza.sizes[0]?.takeAwayPrice;
        }

        // Update extras prices
        pizza.extras?.forEach((group) => {
          group.selectedExtras?.forEach((extra) => {
            extra.price = state.isDelivery
              ? extra.deliveryPrice
              : extra.takeAwayPrice;
          });
        });

        // Update deal extras prices
        pizza.dealExtras?.forEach((group) => {
          group.selectedExtras?.forEach((extra) => {
            extra.price = state.isDelivery
              ? extra.deliveryPrice
              : extra.takeAwayPrice;
          });
        });

        // Recalculate total price
        pizza.totalPrice = calculatePizzaTotal(pizza);
      });

      state.totalAmount = state.cart.reduce(
        (total, pizza) => total + pizza.totalPrice,
        0
      );
    },

    clearCart: (state) => {
      state.cart = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  addPizzaToCart,
  removePizzaFromCart,
  updatePizzaQuantity,
  setDeliveryStatus,
  updateCartPricesForDeliveryStatus,
  clearCart,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;
