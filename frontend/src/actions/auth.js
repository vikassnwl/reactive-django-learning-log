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

export const login = (username, password, alert, loader) => (dispatch) => {
  const data = {
    username: username,
    password: password,
  };
  loader(true);
  axios.post("/api/login/", data).then((res) => {
    loader(false);
    if (res.data.success) {
      dispatch({
        type: LOGIN_SUCCESS,
        user_id: res.data.user_id,
        user_name: res.data.user_name,
      });
    } else {
      alert(res.data.error);
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  });
};

export const logout = (loader) => (dispatch) => {
  loader(true);
  axios.get("/api/logout/").then((res) => {
    loader(false);
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

export const checkAuthenticated = (loader) => (dispatch) => {
  loader(true);
  axios.get("/api/check-authenticated/").then((res) => {
    loader(false);
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

export const register = (
  username,
  password,
  confirmPassword,
  alert,
  loader
) => (dispatch) => {
  const data = {
    username: username,
    password: password,
    password2: confirmPassword,
  };
  loader(true);
  axios.post("/api/register/", data).then((res) => {
    loader(false);
    if (res.data.success) {
      dispatch({
        type: REGISTER_SUCCESS,
        user_id: res.data.user_id,
        user_name: res.data.user_name,
      });
    } else {
      alert(res.data.error);
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  });
};
