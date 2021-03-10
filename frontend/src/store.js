import { createStore, applyMiddleware } from "redux";
import { authReducer } from "./reducers/auth";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

export const store = createStore(
  authReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
