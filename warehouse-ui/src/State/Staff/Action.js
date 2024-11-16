import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { 
    ADD_STAFF_FAILURE, 
    ADD_STAFF_REQUEST, 
    ADD_STAFF_SUCCESS, 
    CHANGE_PASSWORD_FAILURE, 
    CHANGE_PASSWORD_REQUEST, 
    CHANGE_PASSWORD_SUCCESS, 
    GET_ALL_STAFF_FAILURE, 
    GET_ALL_STAFF_REQUEST, 
    GET_ALL_STAFF_SUCCESS, 
    UPDATE_PROFILE_FAILURE, 
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS
} from "./ActionType";

export const getAllStaff = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: GET_ALL_STAFF_REQUEST });

        const { data } = await axios.get(`${API_BASE_URL}/stockdepartment/staff/getAll`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });

        dispatch({
            type: GET_ALL_STAFF_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error fetching staffs:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: GET_ALL_STAFF_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};


export const addStaff = (staffData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: ADD_STAFF_REQUEST });

        const { data } = await axios.post(`${API_BASE_URL}/admin/staff/addStaff`, staffData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }, 
        });

        dispatch({
            type: ADD_STAFF_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error adding staff:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: ADD_STAFF_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};

export const updateStaff = (staffId, staffData) => async (dispatch) => {

    console.log("Dữ liệu gọi api ", staffData)
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const { data } = await axios.put(`${API_BASE_URL}/admin/staff/update/${staffId}`, staffData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }, 
        });

        console.log("Thông tin thay đổi trạng thái của nhân viên ", data)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error updating staff:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: UPDATE_PROFILE_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};

export const changePassword = (passwordData) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        dispatch({ type: CHANGE_PASSWORD_REQUEST });

        const { data } = await axios.put(`${API_BASE_URL}/api/change/password`, passwordData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }, 
        });

        dispatch({
            type: CHANGE_PASSWORD_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Error adding staff:', error.response ? error.response.data : error.message);
        dispatch({ 
            type: CHANGE_PASSWORD_FAILURE, 
            payload: error.response ? error.response.data : error.message 
        });
    }
};
