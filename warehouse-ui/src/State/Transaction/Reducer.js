import {
    CREATE_TRANSACTION_REQUEST,
    CREATE_TRANSACTION_SUCCESS,
    CREATE_TRANSACTION_FAILURE,
    UPDATE_TRANSACTION_REQUEST,
    UPDATE_TRANSACTION_SUCCESS,
    UPDATE_TRANSACTION_FAILURE,
    GET_ALL_TRANSACTION_REQUEST,
    GET_ALL_TRANSACTION_SUCCESS,
    GET_ALL_TRANSACTION_FAILURE,
  } from './ActionType';
  
  const initialState = {
    loading: false,
    transaction: null, 
    transactions: [], 
    error: null,
  };
  
  const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_TRANSACTION_REQUEST:
      case UPDATE_TRANSACTION_REQUEST:
      case GET_ALL_TRANSACTION_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case CREATE_TRANSACTION_SUCCESS:
      case UPDATE_TRANSACTION_SUCCESS:
        return {
          ...state,
          loading: false,
          transaction: action.payload, 
        };
  
      case GET_ALL_TRANSACTION_SUCCESS:
        return {
          ...state,
          loading: false,
          transactions: action.payload, 
        };
  
      case CREATE_TRANSACTION_FAILURE:
      case UPDATE_TRANSACTION_FAILURE:
      case GET_ALL_TRANSACTION_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload, 
        };
  
      default:
        return state;
    }
  };
  
  export default transactionReducer;
  