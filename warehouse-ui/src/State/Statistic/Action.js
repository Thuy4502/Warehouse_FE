import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { GET_ACCHIEVEMENT_STATISTIC_FAILURE, GET_ACCHIEVEMENT_STATISTIC_REQUEST, GET_ACCHIEVEMENT_STATISTIC_SUCCESS, GET_MONTHLY_TRANSACTION_FAILURE, GET_MONTHLY_TRANSACTION_REQUEST, GET_MONTHLY_TRANSACTION_SUCCESS, GET_TOP_SELLING_BOOKS_FAILURE, GET_TOP_SELLING_BOOKS_REQUEST, GET_TOP_SELLING_BOOKS_SUCCESS } from "./ActionType";
import { Construction } from "@mui/icons-material";

export const getAchievementStatistic= () => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ACCHIEVEMENT_STATISTIC_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/api/statistic/achievement`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });

        dispatch({
            type: GET_ACCHIEVEMENT_STATISTIC_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching achievement statistic:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: GET_ACCHIEVEMENT_STATISTIC_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};

export const getMonthlyTransaction= (year) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_MONTHLY_TRANSACTION_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/api/statistic/monthly_transaction/${year}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });

        dispatch({
            type: GET_MONTHLY_TRANSACTION_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching achievement statistic:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: GET_MONTHLY_TRANSACTION_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};

export const getTopSellingBooks = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_TOP_SELLING_BOOKS_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/api/statistic/top_selling_books`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });

        dispatch({
            type: GET_TOP_SELLING_BOOKS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching top selling books statistic:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: GET_TOP_SELLING_BOOKS_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};