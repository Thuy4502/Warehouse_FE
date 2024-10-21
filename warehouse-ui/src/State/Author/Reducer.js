import { GET_ALL_AUTHOR_SUCCESS, GET_ALL_AUTHOR_REQUEST, GET_ALL_AUTHOR_FAILURE} from "./ActionType";


const initialState = {
    authors: [],
    loading: false,
    error: null,
};

const authorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_AUTHOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ALL_AUTHOR_SUCCESS:
            return {
                ...state,
                loading: false,
                authors: action.payload,
            };
        case GET_ALL_AUTHOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default authorReducer;
