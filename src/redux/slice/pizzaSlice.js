import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDelivery: true, // Default to delivery
  cart: [],
  totalAmount: 0,
};

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setDeliveryStatus: (state, action) => {
      state.isDelivery = action.payload;
    },

    addPizzaToCart: (state, action) => {
      const pizzaData = action.payload;

      const existingPizza = state.cart.find(
        (pizza) =>
          pizza.id === pizzaData.id &&
          pizza.sizes[0].size === pizzaData.sizes[0].size &&
          JSON.stringify(pizza.extras) === JSON.stringify(pizzaData.extras)
      );

      if (existingPizza) {
        existingPizza.quantity += pizzaData.quantity;
        existingPizza.totalPrice += pizzaData.totalPrice;
      } else {
        state.cart.push(pizzaData);
      }

      state.totalAmount = state.cart.reduce((total, order) => {
        return total + (order.totalPrice || order.price * order.quantity);
      }, 0);
    },

    removePizzaFromCart: (state, action) => {
      const { id, size, extras } = action.payload;
      state.cart = state.cart.filter(
        (pizza) =>
          !(
            pizza.id === id &&
            pizza.sizes[0].size === size &&
            JSON.stringify(pizza.extras) === JSON.stringify(extras)
          )
      );

      state.totalAmount = state.cart.reduce((total, order) => {
        return total + (order.totalPrice || order.price * order.quantity);
      }, 0);
    },

    updatePizzaQuantity: (state, action) => {
      const { id, size, extras, quantity } = action.payload;

      const existingPizza = state.cart.find(
        (pizza) =>
          pizza.id === id &&
          pizza.sizes[0].size === size &&
          JSON.stringify(pizza.extras) === JSON.stringify(extras)
      );

      if (existingPizza) {
        existingPizza.quantity = quantity;
        existingPizza.totalPrice = existingPizza.price * quantity;
      }

      state.totalAmount = state.cart.reduce((total, order) => {
        return total + (order.totalPrice || order.price * order.quantity);
      }, 0);
    },

    updateCartPricesForDeliveryStatus: (state) => {
      state.cart.forEach((item) => {
        // Update the price based on current delivery status
        item.price = state.isDelivery
          ? item.sizes[0].deliveryPrice
          : item.sizes[0].takeAwayPrice;

        // Update extras prices
        item.extras.forEach((group) => {
          group.selectedExtras.forEach((extra) => {
            extra.price = state.isDelivery
              ? extra.deliveryPrice
              : extra.takeAwayPrice;
          });
        });

        // Recalculate total price
        let singleItemPrice = item.price;
        item.extras.forEach((group) => {
          group.selectedExtras.forEach((extra) => {
            singleItemPrice += extra.price;
          });
        });

        item.totalPrice = singleItemPrice * item.quantity;
      });

      state.totalAmount = state.cart.reduce((total, order) => {
        return total + order.totalPrice;
      }, 0);
    },
  },
});

export const {
  addPizzaToCart,
  removePizzaFromCart,
  updatePizzaQuantity,
  setDeliveryStatus,
  updateCartPricesForDeliveryStatus,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;
