import { GET_ALL_PUBLISHER_SUCCESS, GET_ALL_PUBLISHER_REQUEST, GET_ALL_PUBLISHER_FAILURE} from "./ActionType";


const initialState = {
    publishers: [],
    loading: false,
    error: null,
};

const publisherReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_PUBLISHER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ALL_PUBLISHER_SUCCESS:
            return {
                ...state,
                loading: false,
                publishers: action.payload, 
            };
        case GET_ALL_PUBLISHER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, 
            };
        default:
            return state;
    }
};

export default publisherReducer;
