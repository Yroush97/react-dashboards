import * as actionTypes from "./actionTypes";
import API from "../../shared/api"

export const authOnline = (onlineNow) => {
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    onlineNow: onlineNow,   
  };
};

export const authSessions = (todaySession) => { 
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    todaySession: todaySession,   
  };
};

export const authServers = (serversConnection) => {
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    serversConnection: serversConnection,   
  };
};

export const authTopServers = (topServersConnection) => {
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    topServersConnection: topServersConnection,   
  };
};

export const authDeadServers = (deadServers) => {
  return {
    type: actionTypes.AUTH_SIGNIN_SUCCESS,
    deadServers: deadServers,   
  };
};

export const homeState = () => {  
  return (dispatch) => {
      API.getOnlineNow().then(data => dispatch(authOnline(data)))
      API.getTodaySessions().then(data => dispatch(authSessions(data)))
      API.getServersConnection().then(data => {
        let sum =0;
        data.map(element => {
        if(element.is_active === 1)sum = sum + element.connections_count});
        dispatch(authServers(sum))
      })
      API.getTopServersConnections().then(data => dispatch(authTopServers(data)))
      API.getServersDead().then(data => dispatch(authDeadServers(data)))
    };
};