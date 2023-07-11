import { combineReducers } from "redux";
import userReducer from "./middleware/userauth.jsx";

const rootReducer = combineReducers({
  auth: userReducer,
});

export default rootReducer;
