import axios from "axios";
import { API_BASE_URL } from '../../config/apiConfig';
import { GET_INVENTORY_REPORT_REQUEST, GET_INVENTORY_REPORT_SUCCESS, GET_INVENTORY_REPORT_FAILURE } from "./ActionType";


export const getInventoryReport = (startDate, endDate) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_INVENTORY_REPORT_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/stockdepartment/inventory_log/inventory-summary?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            
        });

        console.log("Ls nhạp ", data)


        dispatch({
            type: GET_INVENTORY_REPORT_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_INVENTORY_REPORT_FAILURE, payload: error.message });
    }
};