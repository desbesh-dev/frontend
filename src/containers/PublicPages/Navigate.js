import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';

const Home = ({ data, login, error, message, scale, sub_scale }) => {

    if (scale === 6 || (scale === 3 && (sub_scale === 1 || sub_scale === 2 || sub_scale === 3 || sub_scale === 5 || sub_scale === 6 || sub_scale === 7 || sub_scale === 9 || sub_scale === 10) && sub_scale !== 4)) {
        return <Redirect to='/wellcome' />
    } else if (scale === 3 && sub_scale === 4) {
        return <Redirect to='/field_work' />
    } else {
        return <Redirect to='/' />
    }
}

const mapStateToProps = state => ({
    data: state.auth.user,
    display: state.OverlayDisplay,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
    message: state.auth.message,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});
export default connect(mapStateToProps, { login })(Home);
