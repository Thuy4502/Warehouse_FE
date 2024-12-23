import axios from "axios";
import { ADD_BOOK_FAILURE, ADD_BOOK_REQUEST, ADD_BOOK_SUCCESS, ADD_BOOKS_BY_EXCEL_FAILURE, ADD_BOOKS_BY_EXCEL_REQUEST, ADD_BOOKS_BY_EXCEL_SUCCESS, FIND_BOOK_BY_ID_FAILURE, FIND_BOOK_BY_ID_REQUEST, FIND_BOOK_BY_ID_SUCCESS, GET_ALL_BOOK_REQUEST, GET_ALL_BOOK_SUCCESS, UPDATE_BOOK_FAILURE, UPDATE_BOOK_REQUEST, UPDATE_BOOK_SUCCESS } from "./ActionType"
import { API_BASE_URL } from '../../config/apiConfig';
import { GET_ALL_AUTHOR_FAILURE } from "../Author/ActionType";


export const addBook = (bookData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({type: ADD_BOOK_REQUEST});
        const {data} = await axios.post(`${API_BASE_URL}/warehouse_keeper/book/add`, bookData, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            timeout: 5000,
        });

        console.log("Created product ", data);

        dispatch({
            type: ADD_BOOK_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error creating product:', error.response ? error.response.data : error.message);
        dispatch({ type: ADD_BOOK_FAILURE, payload: error.message });
    }
}

export const addBookByExcel = (bookData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    console.log("Data excel ", bookData);
    try {
        dispatch({type: ADD_BOOKS_BY_EXCEL_REQUEST});
        const {data} = await axios.post(`${API_BASE_URL}/warehouse_keeper/book/addByExcel`, bookData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Created product ", data);

        dispatch({
            type: ADD_BOOKS_BY_EXCEL_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error creating product:', error.response ? error.response.data : error.message);
        dispatch({ type: ADD_BOOKS_BY_EXCEL_FAILURE, payload: error.message });
    }
}




export const findBookById = (id) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: FIND_BOOK_BY_ID_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/book/id/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        dispatch({
            type: FIND_BOOK_BY_ID_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching book:', error.response ? error.response.data : error.message);
        dispatch({ type: FIND_BOOK_BY_ID_FAILURE, payload: error.message });
    }
};

export const updateBook = (id, bookData) => async (dispatch) => {
    const token = localStorage.getItem("token");

    console.log("Dữ liệu thay đổi ", bookData)
    try {
        dispatch({type: UPDATE_BOOK_REQUEST});
        
        const { data } = await axios.put(`${API_BASE_URL}/warehouse_keeper/book/update/${id}`, bookData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        console.log("Update product ", data);
        dispatch({ type: 'UPDATE_BOOK_SUCCESS', payload: response.data });
    } catch (error) {
        if (error.response) {
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from server:', error.request);
        } else {
            console.error('Error in request setup:', error.message);
        }
        
        dispatch({ type: UPDATE_BOOK_FAILURE, payload: error.message });
    }
}

export const getAllBooks = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ALL_BOOK_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/api/book/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });

        dispatch({
            type: GET_ALL_BOOK_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        dispatch({ type: GET_ALL_AUTHOR_FAILURE, payload: error.message });
    }
};


