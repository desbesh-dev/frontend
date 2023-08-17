import React from 'react';
import { connect } from 'react-redux';

const Disable = (message, error) => (
    <div className="row h-100 m-0 d-flex justify-content-center">
        <div className="header mb-4 bg-gradient maintxt align-items-center justify-content-center" style={{ maxHeight: "25vh", textShadow: "2px 1px 0px rgba(0, 0, 0, 0.1)" }}>
            <h1 className='text-danger'>{message.message ? message.message : "No Message"}</h1>
            <p className='lead'>We are sorry for this inconvenience</p>
            <hr className='my-4' />
        </div>
    </div>
);

const mapStateToProps = state => ({
    message: state.auth.message,
    error: state.auth.error
});

export default connect(mapStateToProps)(Disable);