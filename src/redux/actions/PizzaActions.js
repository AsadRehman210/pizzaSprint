import { addPizzaToCart, removePizzaFromCart, updatePizzaQuantity } from "../slice/pizzaSlice";

// Action to add pizza to the cart with dispatched payload
export const addPizza = (pizzaData) => (dispatch) => {
  dispatch(addPizzaToCart(pizzaData));
};

export const updateQuantity = (id, size, extras, quantity) => (dispatch) => {
    dispatch(updatePizzaQuantity({ id, size, extras, quantity }));
  };

  // Action to remove pizza from the cart with dispatched payload
  export const removePizza = (id, size, extras) => (dispatch) => {
    dispatch(removePizzaFromCart({ id, size, extras }));
  };