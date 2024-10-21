import axios from "axios";
import { API_BASE_URL } from '../../config/apiConfig';
import { 
    CREATE_TRANSACTION_REQ_FAILURE, 
    CREATE_TRANSACTION_REQ_REQUEST, 
    CREATE_TRANSACTION_REQ_SUCCESS, 
    GET_ALL_TRANSACTION_REQ_FAILURE, 
    GET_ALL_TRANSACTION_REQ_REQUEST, 
    GET_ALL_TRANSACTION_REQ_SUCCESS, 
    UPDATE_TRANSACTION_REQ_REQUEST, 
    UPDATE_TRANSACTION_REQ_SUCCESS 
} from "./ActionType";

export const addTransactionRequest = (transactionData) => async (dispatch) => {
    const token = localStorage.getItem("token"); // Get the token here
    try {
        dispatch({ type: CREATE_TRANSACTION_REQ_REQUEST });

        const response = await axios.post(`${API_BASE_URL}/transaction_request/create`, transactionData, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("Created transaction request ", response.data);

        dispatch({
            type: CREATE_TRANSACTION_REQ_SUCCESS,
            payload: response.data,
        });

    } catch (error) {
        console.error('Error creating transaction request', error.response ? error.response.data : error.message);
        dispatch({ type: CREATE_TRANSACTION_REQ_FAILURE, payload: error.message });
    }
}

export const updateTransactionRequest = (id, updateData) => async (dispatch) => {
    const token = localStorage.getItem("token");

    console.log("Data to be updated ", updateData);
    try {
        dispatch({ type: UPDATE_TRANSACTION_REQ_REQUEST });
        
        const response = await axios.put(`${API_BASE_URL}/transaction_request/update/${id}`, updateData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Updated transaction request", response.data);

        dispatch({
            type: UPDATE_TRANSACTION_REQ_SUCCESS,
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

        dispatch({ type: CREATE_TRANSACTION_REQ_FAILURE, payload: error.message }); // Corrected error dispatch type
    }
}

export const getAllTransactionRequest = (type) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ALL_TRANSACTION_REQ_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/transaction_request/getAll/${type}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            
        });

        dispatch({
            type: GET_ALL_TRANSACTION_REQ_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_TRANSACTION_REQ_FAILURE, payload: error.message });
    }
};
