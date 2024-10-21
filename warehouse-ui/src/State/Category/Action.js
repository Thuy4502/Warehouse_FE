import axios from 'axios';
import { GET_ALL_CATEGORY_REQUEST, GET_ALL_CATEGORY_SUCCESS, GET_ALL_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE, UPDATE_CATEGORY_REQUEST, UPDATE_CATEGORY_FAILURE } from './ActionType';
import { API_BASE_URL } from '../../config/apiConfig';
import { UPDATE_BOOK_REQUEST, UPDATE_BOOK_SUCCESS } from '../Book/ActionType';

export const getAllCategories = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: GET_ALL_CATEGORY_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/category/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: GET_ALL_CATEGORY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_CATEGORY_FAILURE, payload: error.message });
    }
};


export const addCategory = (category) => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: CREATE_CATEGORY_REQUEST });

        const { data } = await axios.post(`${API_BASE_URL}/category/add`, category, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: CREATE_CATEGORY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error creating categories:', error.response ? error.response.data : error.message);
        dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error.message });
    }
};

export const updateCategory = (id, category) => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: UPDATE_CATEGORY_REQUEST });

        const { data } = await axios.put(`${API_BASE_URL}/category/update/${id}`, category, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: UPDATE_BOOK_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error updating categories:', error.response ? error.response.data : error.message);
        dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: error.message });
    }
};
