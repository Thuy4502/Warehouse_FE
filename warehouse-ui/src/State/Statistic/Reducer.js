import {
  GET_MONTHLY_TRANSACTION_REQUEST,
  GET_MONTHLY_TRANSACTION_SUCCESS,
  GET_MONTHLY_TRANSACTION_FAILURE,
  GET_ACCHIEVEMENT_STATISTIC_REQUEST,
  GET_ACCHIEVEMENT_STATISTIC_SUCCESS,
  GET_ACCHIEVEMENT_STATISTIC_FAILURE,
  GET_TOP_SELLING_BOOKS_REQUEST,
  GET_TOP_SELLING_BOOKS_SUCCESS,
  GET_TOP_SELLING_BOOKS_FAILURE,
} from './ActionType';

const initialState = {
  monthlyTransactions: [],
  achievementStatistic: null,
  topSellingBooks: [], 
  loading: false,
  error: null,
};

export const statisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONTHLY_TRANSACTION_REQUEST:
    case GET_ACCHIEVEMENT_STATISTIC_REQUEST:
    case GET_TOP_SELLING_BOOKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_MONTHLY_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        monthlyTransactions: action.payload, 
      };

    case GET_ACCHIEVEMENT_STATISTIC_SUCCESS:
      return {
        ...state,
        loading: false,
        achievementStatistic: action.payload, 
      };

    case GET_TOP_SELLING_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        topSellingBooks: action.payload, 
      };

    case GET_MONTHLY_TRANSACTION_FAILURE:
    case GET_ACCHIEVEMENT_STATISTIC_FAILURE:
    case GET_TOP_SELLING_BOOKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload, 
      };

    default:
      return state;
  }
};
