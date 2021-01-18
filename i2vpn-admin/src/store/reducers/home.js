import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
    todaySession: null,
    onlineNow: null,
    serversConnection: null,
    // topServersConnection: null,
    // deadServers: null,   
};

const todaySessionStart = (state, action) => {
  return updateObject(state, {
    todaySession: action.todaySession,
  });
};

const onlineNowStart = (state, action) => {
  return updateObject(state, {
    onlineNow: action.onlineNow,
  });
};

const serversConnectionStart =(state, action) => {
  return updateObject(state, {
    serversConnection: action.serversConnection,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SIGNIN_SUCCESS:
      return todaySessionStart(state, action);
    case actionTypes.AUTH_SIGNIN_SUCCESS:
      return onlineNowStart(state, action);
    case actionTypes.AUTH_SIGNIN_SUCCESS:
      return serversConnectionStart(state, action);   
    default:
      return state;
  }
};

export default reducer;