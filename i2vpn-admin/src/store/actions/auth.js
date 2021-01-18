import * as actionTypes from "./actionTypes";
import axios from "../../axios.js";
export const authSigninStart = () => {
  return {
    type: actionTypes.AUTH_SIGNIN_START,
  };
};

export const authSigninSuccess = (token,email) => {
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    token: token,
    email: email,   
  };
};

export const authSigninFail = (error) => {
  return {
    type: actionTypes.AUTH_SIGNIN_FAIL,
    error: error,
  };
};

export const signout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email"); 
  return {
    type: actionTypes.AUTH_SIGNOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {}, expirationTime * 1000);
  };
};

export const authSignin = (email, password, remember_me) => {
  return (dispatch) => {
    dispatch(authSigninStart());

    const authData = {
      email: email,
      password: password,
      remember_me: remember_me,
    };

    axios
      .post("api/auth/admin-login", authData)
      .then((response) => {
        response.data.Logdate = Date.now();
        const expirationDate = new Date(
          new Date().getTime() + response.data.Logdate * 1000
        );
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("email", email);
        
        dispatch(
          authSigninSuccess(
            response.data.access_token,
            response.data.Logdate,
            email
          )
        );
        window.location.hash='/';

        dispatch(checkAuthTimeout(response.data.Logdate));
      })
      .catch((err) => {
        console.log(err)
        dispatch(authSigninFail("The password or email is incorrect"));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");  

    if (!token) {
      dispatch(signout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(signout());
      } else {
        dispatch(authSigninSuccess(token, email));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
