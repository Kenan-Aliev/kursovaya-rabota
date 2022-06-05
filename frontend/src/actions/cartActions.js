import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_RESET,
} from "../constants/cartConstants";

const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.salePrice,
      countInStock: data.countInStock,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

const resetCartItems = () => {
  return (dispatch) => {
    dispatch({ type: CART_RESET });
    localStorage.removeItem("cartItems");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("shippingAddress");
  };
};

export {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  resetCartItems,
};
