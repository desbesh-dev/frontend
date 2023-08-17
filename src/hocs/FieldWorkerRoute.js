import React from "react";
import { useSelector } from 'react-redux';
import { Route } from "react-router-dom";

export var FieldWorkerRoute = ({ component, render, ...rest }) => {
  const { no, scale } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof (no) !== 'undefined' && no !== null && (no === 12) ?
          (component ? React.createElement(component, props) : render(props))
          :
          null
      }}
    />
  )
}