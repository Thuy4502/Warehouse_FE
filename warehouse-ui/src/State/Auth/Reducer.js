import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    GET_USER_REQUEST, 
    LOGIN_FAILURE, 
    GET_USER_SUCCESS, 
    GET_USER_FAILURE, 
    FORGOT_PASSWORD_REQUEST, 
    FORGOT_PASSWORD_SUCCESS, 
    FORGOT_PASSWORD_FAILURE 
} from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    token: null,
    forgotPasswordMessage: null, 
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case FORGOT_PASSWORD_REQUEST:
            return { ...state, isLoading: true, error: null, forgotPasswordMessage: null };

        case LOGIN_SUCCESS:
            return { ...state, isLoading: false, error: null, token: action.payload };

        case GET_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                user: action.payload,
                token: action.payload.token || state.token,
            };

        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                forgotPasswordMessage: action.payload, 
            };

        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case FORGOT_PASSWORD_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};
