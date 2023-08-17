import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const WaitingUsers = (message, error) => (

    <div className="row h-100">
        <div className='jumbotron mt-5'>
            <h1 className='display-4 text-danger'>{message.message ? message.message : "Dear Subscriber, your account is pending for approval. Please wait until its activate or contact with your respective dealers."}</h1>
            <p className='lead'>We are sorry for this inconvenience</p>
            <hr className='my-4' />
        </div>
    </div>
);

const mapStateToProps = state => ({
    message: state.auth.message,
    error: state.auth.error
});

export default connect(mapStateToProps)(WaitingUsers);
