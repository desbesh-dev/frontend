import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { findUnique } from '../../../actions/APIHandler';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import Select from 'react-select';
import { FetchUsers, ForceLogoutUser, LogOutAllDevice } from '../../../actions/AdminApi';

const Backup = ({ display, user, scale, sub_scale, auth }) => {
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();
    const [SearchKey, setSearchKey] = useState('')
    const [BranchFilter, setBranchFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        BackupRun();
    }, [])

    const BackupRun = async () => {
        var result = await FetchUsers();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header justify-content-center">
                <p className="display-6 d-flex justify-content-center m-0">
                    Backup
                </p>
                <button className="btn d-flex btn-outline-success rounded-0 align-items-center justify-content-center mx-auto" id="list" onClick={()=> BackupRun()}>
                    <i class="fad fs-3 fa-qrcode text-dark"></i>  Click to backup
                </button>
            </div>


        </div >
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    auth: state.auth,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(Backup);