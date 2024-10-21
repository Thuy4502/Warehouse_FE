import axios from 'axios';
import { GET_ALL_PUBLISHER_REQUEST, GET_ALL_PUBLISHER_SUCCESS, GET_ALL_PUBLISHER_FAILURE } from './ActionType';
import { API_BASE_URL } from '../../config/apiConfig';

export const getAllPublisher = () => async (dispatch) => {
    const token = localStorage.getItem("token");

    try {
        dispatch({ type: GET_ALL_PUBLISHER_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/publisher/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: GET_ALL_PUBLISHER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_PUBLISHER_FAILURE, payload: error.message });
    }
};
