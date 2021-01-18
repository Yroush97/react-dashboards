import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';
import axios from "../../../axios";

function Logout() {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.signout());
  }, []);
  return <Redirect to='/login' />;
};



export default (Logout);
