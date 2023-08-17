import { Link, Redirect, useHistory } from 'react-router-dom';
import { LoadPending, LoadProfile } from '../../actions/APIHandler';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { DISPLAY_OVERLAY } from '../../actions/types';
import { logout } from '../../actions/auth';

const Pending = ({ display }) => {
    const [Data, setData] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        PendingUsers();

    }, [])

    const PendingUsers = async () => {
        var PendingData = await LoadPending();
        setData(PendingData);

        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
    }

    const history = useHistory();
    const FetchUser = async (id) => {
        var User_Data = await LoadProfile(id);
        history.push('/pending_user', { UserData: User_Data.data });
    }

    return (
        <div className="container-fluid">
            <div className="header mb-4">
                <p className="display-6 m-0">
                    Pending User
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/LoadPending">Pending Users</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="row">
                <div className="row h-100 w-100">
                    <div className="col-sm-12 col-md-10 col-lg-8 mx-auto d-table h-100">



                        <div className="d-table-cell align-middle">
                            {
                                Data ? Data.data.PendingUser.map((item) => (
                                    <Link onClick={() => FetchUser(item.id)}>
                                        <div className="card border-secondary rounded mb-3" style={{ maxWidth: "100%" }}>
                                            <div className="row g-0">
                                                <div className="col-md-4">
                                                    <img src={item.details.Image ? item.details.Image : ''} className="img-fluid rounded-start" width="50%" height="120" alt="User" />
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.details.FullName}</h5>
                                                        <p className="card-text">{item.details.HoldingNo + ", " + item.details.WardNo + ", " + item.details.VillageName + ", " + item.details.Union + ", " + item.details.Upazila + ", " + item.details.Zila + ", " + item.details.Division}</p>
                                                        <p className="card-text"><small className="text-muted">{item.is_active ? "Activated" : "Pending"}</small></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                                    : null
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay
});

export default connect(mapStateToProps, { logout })(Pending);