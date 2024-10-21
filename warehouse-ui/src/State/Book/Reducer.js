import {
  ADD_BOOK_REQUEST,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_FAILURE,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILURE,
  FIND_BOOK_BY_ID_REQUEST,
  FIND_BOOK_BY_ID_SUCCESS,
  FIND_BOOK_BY_ID_FAILURE,
  UPDATE_BOOK_REQUEST,        
  UPDATE_BOOK_SUCCESS,        
  UPDATE_BOOK_FAILURE,        
} from './ActionType';

const initialState = {
  book: null,
  books: [],
  loading: false,
  error: null,
};

export const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOK_REQUEST:
    case GET_ALL_BOOK_REQUEST:
    case FIND_BOOK_BY_ID_REQUEST:
    case UPDATE_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        book: action.payload,
      };
    case GET_ALL_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload,
      };
    case FIND_BOOK_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        book: action.payload, 
      };
    case UPDATE_BOOK_SUCCESS: 
      return {
        ...state,
        loading: false,
        book: action.payload,
      };

    case ADD_BOOK_FAILURE:
    case GET_ALL_BOOK_FAILURE:
    case FIND_BOOK_BY_ID_FAILURE:
    case UPDATE_BOOK_FAILURE: 
      return {
        ...state,
        loading: false,
        error: action.payload, 
      };

    default:
      return state;
  }
};
