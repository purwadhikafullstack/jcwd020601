import { combineReducers } from "redux";
import userReducer from "./middleware/userauth.jsx";
import transactionReducer from "./middleware/transaction.jsx";
import quantityReducer from "./middleware/quantity.jsx";

const rootReducer = combineReducers({
  auth: userReducer,
  order: transactionReducer,
  qty: quantityReducer,
});

export default rootReducer;
