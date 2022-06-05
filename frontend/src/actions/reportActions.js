import axios from "axios";
import {
  GET_REPORT_FOR_PERIOD_FAIL,
  GET_REPORT_FOR_PERIOD_REQUEST,
  GET_REPORT_FOR_PERIOD_SUCCESS,
} from "../constants/reportConstants.js";

export const getReportForPeriod = (startDate, endDate) => {
  return async (dispatch, getState) => {
    dispatch({
      type: GET_REPORT_FOR_PERIOD_REQUEST,
    });

    try {
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const dates = {
        startDate,
        endDate,
      };
      const { data } = await axios.get(
        `/api/report/${JSON.stringify(dates)}`,
        config
      );
      dispatch({
        type: GET_REPORT_FOR_PERIOD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_REPORT_FOR_PERIOD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};
