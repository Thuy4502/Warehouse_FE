import axios from 'axios';
import { FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./ActionType";
import { API_BASE_URL } from '../../config/apiConfig';

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });


export const login = (userData) => async (dispatch) => {
    localStorage.clear();
    dispatch(loginRequest());
    try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, userData);
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
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const user = response.data;
        localStorage.setItem("staffId", user.data.staffId)
        localStorage.setItem("role", user.data.account.role.roleName);
        localStorage.setItem("img", user.data.img);

        dispatch(getUserSuccess(user));
    } catch (error) {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
        dispatch(getUserFailure(error.response ? error.response.data.message : error.message));
    }
};


export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const accountRequest = { email, username: "", password: "", roleId: null };

        const response = await axios.put(
            `${API_BASE_URL}/api/forgot-password`, 
            accountRequest,  
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Kết quả forgot password", response)

        dispatch({
                type: "FORGOT_PASSWORD_SUCCESS",
                payload: response.data,
        });
        const message = response.data.message;
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: message });
    } catch (error) {
        const errorMessage =
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: errorMessage });
        console.error("Error in forgotPassword:", errorMessage);
    }
};


