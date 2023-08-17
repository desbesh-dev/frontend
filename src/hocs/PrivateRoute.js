import React, { Component } from "react";
import { Route, Redirect, Link } from "react-router-dom";
import { checkAuthenticated, load_user, logout } from '../actions/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import Layout from "./Layout";

export var PrivateRoute = ({ component, render, ...rest }) => {
  const { scale, no } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof (scale) === 'undefined' && scale === null ?
          <Redirect to='/home' />
          :
          scale && no ?
            (component ?
              React.createElement(component, props)
              :
              render(props))
            :
            scale === 6 && no ?
              (component ?
                React.createElement(component, props)
                :
                render(props))
              :
              <Redirect to='/home' />
      }}
    />
  )
}