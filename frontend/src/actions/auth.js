import axios from "axios";
import {
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "./types";

export const login = (username, password) => (dispatch) => {
  const data = {
    username: username,
    password: password,
  };
  axios.post("/api/login/", data).then((res) => {
    if (res.data.success) {
      dispatch({
        type: LOGIN_SUCCESS,
        user_id: res.data.user_id,
        user_name: res.data.user_name,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  });
};

export const logout = () => (dispatch) => {
  axios.get("/api/logout/").then((res) => {
    if (res.data.success) {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    } else {
      dispatch({
        type: LOGOUT_FAIL,
      });
    }
  });
};

export const checkAuthenticated = () => (dispatch) => {
  axios.get("/api/check-authenticated/").then((res) => {
    if (res.data.success) {
      dispatch({
        type: AUTHENTICATED_SUCCESS,
        user_id: res.data.user_id,
        user_name: res.data.user_name,
      });
    } else {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  });
};

export const register = (username, password, confirmPassword) => (dispatch) => {
  const data = {
    username: username,
    password: password,
    password2: confirmPassword,
  };
  axios.post("/api/register/", data).then((res) => {
    if (res.data.success) {
      dispatch({
        type: REGISTER_SUCCESS,
        user_id: res.data.user_id,
        user_name: res.data.user_name,
      });
    } else {
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  });
};
