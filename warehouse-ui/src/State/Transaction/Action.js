import axios from "axios";
import { API_BASE_URL } from '../../config/apiConfig';

import { 
    CREATE_TRANSACTION_FAILURE, 
    CREATE_TRANSACTION_REQUEST, 
    CREATE_TRANSACTION_SUCCESS, 
    GET_ALL_TRANSACTION_FAILURE, 
    GET_ALL_TRANSACTION_REQUEST, 
    GET_ALL_TRANSACTION_SUCCESS, 
    UPDATE_TRANSACTION_REQUEST, 
    UPDATE_TRANSACTION_FAILURE, 
    UPDATE_TRANSACTION_SUCCESS, 
    GET_ALL_TRANSACTION_HISTORY_SUCCESS,
    GET_ALL_TRANSACTION_HISTORY_REQUEST,
    GET_ALL_TRANSACTION_HISTORY_FAILURE
} from "./ActionType";

export const addTransaction = (transactionData) => async (dispatch) => {
    const token = localStorage.getItem("token"); 
    try {
        dispatch({ type: CREATE_TRANSACTION_REQUEST});

        const response = await axios.post(`${API_BASE_URL}/staff/transaction/add`, transactionData, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("Created transaction ", response.data);

        dispatch({
            type: CREATE_TRANSACTION_SUCCESS,
            payload: response.data,
        });

    } catch (error) {
        console.error('Error creating transaction ', error.response ? error.response.data : error.message);
        dispatch({ type: CREATE_TRANSACTION_FAILURE, payload: error.message });
    }
}

export const updateTransaction = (id, updateData) => async (dispatch) => {
    const token = localStorage.getItem("token");

    console.log("Data to be updated ", updateData);
    try {
        dispatch({ type: UPDATE_TRANSACTION_REQUEST});
        
        const response = await axios.put(`${API_BASE_URL}/stockdepartment/transaction/update/${id}`, updateData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Updated transaction ", response.data);

        dispatch({
            type: UPDATE_TRANSACTION_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from server:', error.request);
        } else {
            console.error('Error in request setup:', error.message);
        }

        dispatch({ type: UPDATE_TRANSACTION_FAILURE, payload: error.message });
    }
}

export const getAllTransaction = (type) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ALL_TRANSACTION_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/stockdepartment/transaction/getAll/${type}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            
        });


        dispatch({
            type: GET_ALL_TRANSACTION_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_TRANSACTION_FAILURE, payload: error.message });
    }
};


export const getTransactionHistories = (type) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ALL_TRANSACTION_HISTORY_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/stockdepartment/transaction/history`, {
            params: { type },
            headers: {
                "Authorization": `Bearer ${token}`
            },
            
        });

        console.log("Ls nhạp ", data)


        dispatch({
            type: GET_ALL_TRANSACTION_HISTORY_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_TRANSACTION_HISTORY_FAILURE, payload: error.message });
    }
};
