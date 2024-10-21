import axios from 'axios';
import { GET_ALL_AUTHOR_REQUEST, GET_ALL_AUTHOR_SUCCESS, GET_ALL_AUTHOR_FAILURE } from './ActionType';
import { API_BASE_URL } from '../../config/apiConfig';

export const getAllAuthors = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: GET_ALL_AUTHOR_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/author/getAll`, {
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
