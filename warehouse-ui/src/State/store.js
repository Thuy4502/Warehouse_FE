import { applyMiddleware, legacy_createStore, combineReducers } from "redux";
import { authReducer } from "./Auth/Reducer";
import { thunk } from "redux-thunk";
import categoryReducer from "./Category/Reducer";
import authorReducer from "./Author/Reducer";
import publisherReducer from "./Publisher/Reducer";
import { bookReducer } from "./Book/Reducer";
import transactionRequestReducer from "./TransactionRequest/Reducer";
import transactionReducer from "./Transaction/Reducer";

const rootReducers = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    author: authorReducer,
    publisher: publisherReducer,
    book: bookReducer,
    transactionRequest: transactionRequestReducer,
    transaction: transactionReducer,
});


export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
export default store;
