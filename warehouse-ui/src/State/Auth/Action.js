import axios from 'axios';
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./ActionType";
import { API_BASE_URL } from '../../config/apiConfig';

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });


export const login = (userData) => async (dispatch) => {
    localStorage.clear();
    dispatch(loginRequest());
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
        const user = response.data;
        console.log("Thông tin đăng nhập ", user);
        if (user.token) {
            localStorage.setItem("token", user.token);
        }
        dispatch(loginSuccess(user)); 
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error response:", errorMessage);
        dispatch(loginFailure(errorMessage));
    }
};


const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = (token) => async (dispatch) => {
    dispatch(getUserRequest());
    try {
        const response = await axios.get(`${API_BASE_URL}/staff/profile`, {
           headers: {
                "Authorization": `Bearer ${token}`
            }
            
        });

        const user = response.data;
        localStorage.setItem("staffId", user.data.staffId)
        localStorage.setItem("role", user.data.account.role.roleName);

        dispatch(getUserSuccess(user));
    } catch (error) {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
        dispatch(getUserFailure(error.response ? error.response.data.message : error.message));
    }
};
