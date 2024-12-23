import axios from 'axios';
import { GET_ALL_AUTHOR_REQUEST, GET_ALL_AUTHOR_SUCCESS, GET_ALL_AUTHOR_FAILURE, ADD_AUTHOR_REQUEST, ADD_AUTHOR_SUCCESS, ADD_AUTHOR_FAILURE, UPDATE_AUTHOR_REQUEST, UPDATE_AUTHOR_SUCCESS, UPDATE_AUTHOR_FAILURE } from './ActionType';
import { API_BASE_URL } from '../../config/apiConfig';

export const getAllAuthors = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: GET_ALL_AUTHOR_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/api/author/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        dispatch({
            type: GET_ALL_AUTHOR_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_AUTHOR_FAILURE, payload: error.message });
    }
};

export const addAuthor = (author) => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: ADD_AUTHOR_REQUEST });

        const { data } = await axios.post(`${API_BASE_URL}/warehouse_keeper/author/add`, author, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: ADD_AUTHOR_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error adding author:', error.response ? error.response.data : error.message);
        
        dispatch({ 
            type: ADD_AUTHOR_FAILURE, 
            payload: error.response ? error.response.data.message : error.message 
        });
    }
};

export const updateAuthor = (authorId, author) => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: UPDATE_AUTHOR_REQUEST });

        const { data } = await axios.put(`${API_BASE_URL}/warehouse_keeper/author/update/${authorId}`, author, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: UPDATE_AUTHOR_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error updating author:', error.response ? error.response.data : error.message);

        dispatch({ 
            type: UPDATE_AUTHOR_FAILURE, 
            payload: error.response ? error.response.data.message : error.message 
        });
    }
};



