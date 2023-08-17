import React from "react";
import { connect } from 'react-redux';

const Overlay = ({ display }) => {


  return (
    <div className={display ? "row h-100 w-100 d-block" : "row h-100 w-100 d-none"}>
      {/* <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100 "> */}
      <div className="loader text-center">
        <div className="loader-inner">
          <div className="lds-roller mb-3">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <h4 className="text-uppercase font-weight-bold">Loading</h4>
          <p className="font-italic text-muted"><strong className="countdown text-dark font-weight-bold">Please wait...</strong></p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  display: state.auth.OverlayDisplay
});

export default connect(mapStateToProps, {})(Overlay);
