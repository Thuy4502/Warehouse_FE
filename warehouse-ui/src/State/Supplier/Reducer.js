import {
    GET_ALL_SUPPLIERS_REQUEST,
    GET_ALL_SUPPLIERS_SUCCESS,
    GET_ALL_SUPPLIERS_FAILURE,
    ADD_SUPPLIER_REQUEST,
    ADD_SUPPLIER_SUCCESS,
    ADD_SUPPLIER_FAILURE,
    UPDATE_SUPPLIER_REQUEST,
    UPDATE_SUPPLIER_SUCCESS,
    UPDATE_SUPPLIER_FAILURE
} from './ActionType';

const initialState = {
    suppliers: [],
    supplier: null,  // Thêm supplier để lưu thông tin nhà cung cấp cụ thể
    loading: false,
    error: null
};

const supplierReducer = (state = initialState, action) => {
    switch (action.type) {
        // Lấy tất cả nhà cung cấp
        case GET_ALL_SUPPLIERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_ALL_SUPPLIERS_SUCCESS:
            return {
                ...state,
                loading: false,
                suppliers: action.payload
            };
        case GET_ALL_SUPPLIERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // Thêm nhà cung cấp
        case ADD_SUPPLIER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ADD_SUPPLIER_SUCCESS:
            return {
                ...state,
                loading: false,
                suppliers: [...state.suppliers, action.payload],
                supplier: action.payload  // Cập nhật thông tin của nhà cung cấp mới thêm
            };
        case ADD_SUPPLIER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // Cập nhật nhà cung cấp
        case UPDATE_SUPPLIER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case UPDATE_SUPPLIER_SUCCESS:
            return {
                ...state,
                loading: false,
                suppliers: state.suppliers.map(supplier =>
                    supplier.id === action.payload.id ? action.payload : supplier
                ),
                supplier: action.payload  // Cập nhật thông tin của nhà cung cấp vừa chỉnh sửa
            };

        case UPDATE_SUPPLIER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default supplierReducer;
