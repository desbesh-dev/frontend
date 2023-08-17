import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { load_user, logout } from '../../../actions/auth';
import { FetchDraft } from '../../../actions/InventoryAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const RequisitionDraft = ({ display, SupplierID, CompanyID, BranchID, user, scale, sub_scale }) => {
    const [Data, setData] = useState(null)
    const [Widget, setWidget] = useState(false)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadDraft();
    }, [])

    const LoadDraft = async () => {
        var result = await FetchDraft(0);
        setData(result);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Draft Product Requests</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/supplier_list">Requisition Draft</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button className="btn btn-success rounded-0 rounded-start" id="list" onClick={() => setView(true)}>
                                List View
                            </button>
                        </div>

                        <div className="d-flex justify-content-center mx-2" style={{ minWidth: "10vh" }}>
                            <input className="border-0 border-start rounded-pill px-2 min-vw-25" type="text" placeholder="Search Keywords" />
                            <p className='fw-bold text-success my-auto px-1' title="Search" type='button'>Search</p>
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-success rounded-0 rounded-end" id="grid" onClick={() => setView(false)}>
                                Grid View
                            </button>
                        </div>

                    </div>
                </div>
                <div className="col-md-12 position-absolute overflow-auto mx-auto mt-3 w-100 bg-white" style={{ height: "80%" }}>
                    {
                        Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                            <Link className="row text-decoration-none bg-white m-0 border-bottom py-2" to={{
                                pathname: `products_requisition`,
                                state: item.RequestNo
                            }}>
                                <p className="fs-4 fw-bold m-0">{item.BranchTo + " Branch"}</p>
                                <p className="fs-6 fw-bold m-0"> <span className="text-muted">Draft No: &nbsp;</span>{item.RequestNo}</p>
                                <p className="fs-6 fw-bold m-0"> <span className="text-muted">Issued Date: &nbsp;</span>{moment(item.Date).format("DD MMM YYYY")}</p>
                                <p className="fs-6 fw-bold m-0"> <span className="text-muted">Delivery Date: &nbsp;</span>{moment(item.DeliveryDate).format("DD MMM YYYY")}</p>
                                <small className="text-muted">
                                    <span>Updated By: &nbsp; {item.UpdatedBy}</span>
                                    <span>,&nbsp; Last Updated AT: &nbsp; {moment(item.UpdatedAt).format("DD MMM YYYY, hh:mm:s A")}</span>
                                </small>
                            </Link>
                        )) :
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-4 fw-bold text-success m-0'>No Draft Saved Yet!</p>
                            </div>
                    }

                </div>
            </div >
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.location.SupplierID,
    CompanyID: state.auth.user.CompanyID,
    BranchID: state.auth.user.BranchID,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout, load_user })(RequisitionDraft);