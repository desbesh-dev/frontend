import React from "react";
import { useSelector } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

export const AssistanceRoute = ({ component, render, ...rest }) => {
  const { no } = useSelector((state) => state.auth);

  if (typeof no === 'undefined' || no === null || !([8, 9, 10, 11].includes(no) || no <= 7)) {
    return <Redirect to='/wellcome' />;
  }

  return <Route {...rest} render={props => (component ? React.createElement(component, props) : render(props))} />;
}







// import React from "react";
// import { useSelector } from 'react-redux';
// import { Redirect, Route } from "react-router-dom";

// export var AssistanceRoute = ({ component, render, ...rest }) => {
//   const { no, sub_scale } = useSelector((state) => state.auth);

//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         return typeof (no) === 'undefined' && no === null ?
//           <Redirect to='/wellcome' />
//           :
//           no in [8, 9, 10, 11] || no <= 7 ?
//             (component ? React.createElement(component, props) : render(props))
//             :
//             <Redirect to='/wellcome' />
//       }}
//     />
//   )
// } 