import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { ADD_SUPPLIER_FAILURE, ADD_SUPPLIER_REQUEST, ADD_SUPPLIER_SUCCESS, GET_ALL_SUPPLIERS_FAILURE, GET_ALL_SUPPLIERS_REQUEST, GET_ALL_SUPPLIERS_SUCCESS, UPDATE_SUPPLIER_FAILURE, UPDATE_SUPPLIER_REQUEST, UPDATE_SUPPLIER_SUCCESS } from "./ActionType";


export const getAllSupplier = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({type: GET_ALL_SUPPLIERS_REQUEST});
        const {data} = await axios.get(`${API_BASE_URL}/api/supplier/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: GET_ALL_SUPPLIERS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error getting supplier:', error.response ? error.response.data : error.message);
        dispatch({ type:GET_ALL_SUPPLIERS_FAILURE, payload: error.message });
    }
}


export const addSupplier = (supplierData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({type: ADD_SUPPLIER_REQUEST});
        const {data} = await axios.post(`${API_BASE_URL}/warehouse_keeper/supplier/add`, supplierData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Added supplier ", data);

        dispatch({
            type: ADD_SUPPLIER_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error creating supplier:', error.response ? error.response.data : error.message);
        dispatch({ type: ADD_SUPPLIER_FAILURE, payload: error.message });
    }
}

export const updateSupplier = (id, supplierData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        dispatch({
            type: UPDATE_SUPPLIER_FAILURE,
            payload: "Token not found. Please log in again.",
        });
        return;
    }

    try {
        dispatch({ type: UPDATE_SUPPLIER_REQUEST });
        const { data } = await axios.put(
            `${API_BASE_URL}/warehouse_keeper/supplier/update/${id}`,
            supplierData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Updated supplier:", data);

        dispatch({
            type: UPDATE_SUPPLIER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error("Error updating supplier:", error.response ? error.response.data : error.message)
        const errorMessage = error.response
            ? error.response.data.message || error.response.statusText
            : error.message || "Something went wrong";

        dispatch({
            type: UPDATE_SUPPLIER_FAILURE,
            payload: errorMessage,
        });
    }
};




