import { combineReducers } from "redux";
import userReducer from "./middleware/userauth.jsx";
import transactionReducer from "./middleware/transaction.jsx";

const rootReducer = combineReducers({
  auth: userReducer,
  order: transactionReducer,
});

export default rootReducer;
