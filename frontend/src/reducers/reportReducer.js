import {
  GET_REPORT_FOR_PERIOD_FAIL,
  GET_REPORT_FOR_PERIOD_REQUEST,
  GET_REPORT_FOR_PERIOD_SUCCESS,
} from "../constants/reportConstants.js";

const initialState = {
  orders: [],
  addedProducts: [],
  getReportForPeriod: {
    loading: false,
    success: false,
    failed: false,
    message: "",
  },
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORT_FOR_PERIOD_REQUEST: {
      return {
        ...state,
        getReportForPeriod: {
          loading: true,
          success: false,
          failed: false,
          message: "",
        },
      };
    }
    case GET_REPORT_FOR_PERIOD_SUCCESS: {
      return {
        ...state,
        getReportForPeriod: {
          loading: false,
          success: true,
          failed: false,
          message: "Reports received",
        },
        orders: action.payload.orders,
        addedProducts: action.payload.addedProducts,
      };
    }
    case GET_REPORT_FOR_PERIOD_FAIL: {
      return {
        ...state,
        getReportForPeriod: {
          loading: false,
          success: false,
          failed: true,
          message: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default reportReducer;
