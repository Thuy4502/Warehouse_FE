
import { GET_INVENTORY_REPORT_REQUEST, GET_INVENTORY_REPORT_SUCCESS, GET_INVENTORY_REPORT_FAILURE } from "./ActionType";

const initialState = {
    loading: false,
    inventoryReport: [],
    error: null,
};

const inventoryReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INVENTORY_REPORT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_INVENTORY_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                inventoryReport: action.payload,
            };
        case GET_INVENTORY_REPORT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default inventoryReportReducer;
