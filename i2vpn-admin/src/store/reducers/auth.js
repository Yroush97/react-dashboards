import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  email: null,
  error: null,
  status: null,
  loading: false,
  authRedirectPath: "/",
  Logdate: null,
};

const authSigninStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authSigninSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    error: null,
    loading: false,
    Logdate: action.Logdate,
    email: action.email,  
  });
};

const authSigninFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authSignout = (state, action) => {
  return updateObject(state, { token: null, status: null });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SIGNIN_START:
      return authSigninStart(state, action);
    case actionTypes.AUTH_SIGNIN_SUCCESS:
      return authSigninSuccess(state, action);
    case actionTypes.AUTH_SIGNIN_FAIL:
      return authSigninFail(state, action);
    case actionTypes.AUTH_SIGNOUT:
      return authSignout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
