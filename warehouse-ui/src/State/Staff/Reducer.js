import {
  GET_ALL_STAFF_REQUEST,
  GET_ALL_STAFF_SUCCESS,
  GET_ALL_STAFF_FAILURE,
  ADD_STAFF_REQUEST,
  ADD_STAFF_SUCCESS,
  ADD_STAFF_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from './ActionType';

const initialState = {
  staffs: [],
  staff: null,
  loading: false,
  error: null,
};

export const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_STAFF_REQUEST:
    case ADD_STAFF_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staffs: action.payload,
      };

    case GET_ALL_STAFF_FAILURE:
    case ADD_STAFF_FAILURE:
    case UPDATE_PROFILE_FAILURE:
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staffs: [...state.staffs, action.payload],
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        // staffs: state.staffs.map(staff =>
        //   staff.id === action.payload.id ? action.payload : staff
        // ),
        staff: action.payload,
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};
