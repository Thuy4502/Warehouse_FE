import { 
    GET_ALL_AUTHOR_SUCCESS, 
    GET_ALL_AUTHOR_REQUEST, 
    GET_ALL_AUTHOR_FAILURE,
    ADD_AUTHOR_REQUEST,
    ADD_AUTHOR_SUCCESS,
    ADD_AUTHOR_FAILURE,
    UPDATE_AUTHOR_REQUEST,
    UPDATE_AUTHOR_SUCCESS,
    UPDATE_AUTHOR_FAILURE
} from "./ActionType";

const initialState = {
    authors: [],
    author: null, 
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

        case ADD_AUTHOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case ADD_AUTHOR_SUCCESS:
            return {
                ...state,
                loading: false,
                authors: [...state.authors, action.payload],
                author: action.payload, 
            };
        case ADD_AUTHOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_AUTHOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case UPDATE_AUTHOR_SUCCESS:
            return {
                ...state,
                loading: false,
                authors: state.authors.map((author) =>
                    author.authorId === action.payload.authorId ? action.payload : author
                ),
                author: action.payload, 
            };
        case UPDATE_AUTHOR_FAILURE:
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
