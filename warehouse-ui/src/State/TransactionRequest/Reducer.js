import {
    CREATE_TRANSACTION_REQ_REQUEST,
    CREATE_TRANSACTION_REQ_SUCCESS,
    CREATE_TRANSACTION_REQ_FAILURE,
    UPDATE_TRANSACTION_REQ_REQUEST,
    UPDATE_TRANSACTION_REQ_SUCCESS,
    UPDATE_TRANSACTION_REQ_FAILURE,
   
  } from './ActionType'
import { GET_ALL_TRANSACTION_REQ_FAILURE, GET_ALL_TRANSACTION_REQ_REQUEST, GET_ALL_TRANSACTION_REQ_SUCCESS } from './ActionType';

  const initialState = {
    loading: false,
    transactionRequest: null, 
    transactionRequests: [], 
    error: null,
  };
  
  const transactionRequestReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_TRANSACTION_REQ_REQUEST:
      case UPDATE_TRANSACTION_REQ_REQUEST:
      case GET_ALL_TRANSACTION_REQ_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case CREATE_TRANSACTION_REQ_SUCCESS:
      case UPDATE_TRANSACTION_REQ_SUCCESS:
        return {
          ...state,
          loading: false,
          transactionRequest: action.payload,
        };
  
      case GET_ALL_TRANSACTION_REQ_SUCCESS:
        return {
          ...state,
          loading: false,
          transactionRequests: action.payload, 
        };
  
      case CREATE_TRANSACTION_REQ_FAILURE:
      case UPDATE_TRANSACTION_REQ_FAILURE:
      case GET_ALL_TRANSACTION_REQ_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  
  export default transactionRequestReducer;
  