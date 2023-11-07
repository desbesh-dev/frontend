import React from "react";
import { useSelector } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

export var SalesRepresentativeRoute = ({ component, render, ...rest }) => {
  const { no, sub_scale } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof (no) === 'undefined' && no === null ?
          <Redirect to='/wellcome' />
          :
          ([8, 9, 12].includes(no)) || no <= 7 ?
            (component ? React.createElement(component, props) : render(props))
            :
            <Redirect to='/wellcome' />
      }}
    />
  )
} 