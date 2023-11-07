import React from "react";
import { useSelector } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

export var PrivateRoute = ({ component, render, ...rest }) => {
  const { scale, no } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof (scale) === 'undefined' && scale === null ?
          <Redirect to='/home' />
          :
          scale && no <= 9 ?
            (component ?
              React.createElement(component, props)
              :
              render(props))
            :
            scale === 6 && no <= 9 ?
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