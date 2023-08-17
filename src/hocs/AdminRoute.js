import React, { Component } from "react";
import { Route, Redirect, Link } from "react-router-dom";
import { checkAuthenticated, load_user, logout } from '../actions/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import Layout from "./Layout";

export var AdminRoute = ({ component, render, ...rest }) => {
  const { scale, sub_scale } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof (scale) === 'undefined' && scale === null ?
          <Redirect to='/login' />
          :
          scale === 9 ?
            (component ? React.createElement(component, props) : render(props))
            :
            <Redirect to='/wellcome' />
      }}
    />
  )
}