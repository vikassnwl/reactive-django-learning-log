import {
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "../actions/types";

const initialState = {
  isAuthenticated: null,
  user_id: null,
  user_name: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case LOGOUT_FAIL:
    case AUTHENTICATED_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        isAuthenticated: true,
        user_id: action.user_id,
        user_name: action.user_name,
      };
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case AUTHENTICATED_FAIL:
    case REGISTER_FAIL:
      return {
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
