import * as moment from 'moment'
import { MyOrders, colourStyles, SendOrder, MyProductList } from '../../../../actions/SuppliersAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../../actions/auth';
import { connect, useDispatch } from 'react-redux';
import { BusinessPro } from '../../../../actions/ContractAPI';

import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

const Batches = ({ CompanyID, BranchID, SupplierID, user, UserID, BisID, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [MyProList, setMyProList] = useState(false);
    const [OrderData, setOrderData] = useState([]);
    const [Error, setError] = useState({});
    const [DDate, setDDate] = useState(false);
    const [OrderNo, setOrderNo] = useState("12120121912033");
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        My_Orders();
        // LoadProductItems();
    }, [])

    const My_Orders = async () => {
        var BisDetials = await BusinessPro(BisID);

        if (BisDetials !== true) {
            setData(BisDetials);
        } else {
            history.push('/not_found');
        }
    }

    const getTotal = () => {
        let TotalPrice = 0;
        const price = OrderData.map(row => row.Quantity * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    const Send_Order = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await SendOrder(user.CompanyID, user.BranchID, SupplierID, OrderNo, getTotal(), DDate, user.User.FullName, OrderData);

            if (result !== true) {
                if (result.error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({
                            ...updatedState,
                        });
                    }
                    setList([...list, toastProperties = {
                        id: 1,
                        title: 'Invalid Data',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: warningIcon
                    }])
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    My_Orders();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save product profile. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });

        } else {
            history.push('/my_supplier');
        }
    }


    return (
        <div className="position-relative mb-5" style={{ height: "92%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-12 justify-content-center align-items-center">
                        <div className="d-flex justify-content-center bg-white py-2 h-100">
                            <div className="col-md-12 justify-content-center align-items-center h-100">

                                <table className={`table table-hover table-borderless table-responsive card-1 d-table justify-content-center position-absolute overflow-auto top-0 start-50 translate-middle-x p-2 m-0`} style={{ maxHeight: "70%" }}>
                                    <thead>
                                        <tr className="text-center">
                                            <td className="p-1" colspan="9"><p className="fs-4 fw-bolder text-center py-2 m-0">BATCH SUMMERY</p></td>
                                        </tr>
                                        <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">No</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Id</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Issue Date</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Condition</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Batch Size</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">P/L</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">FCR</span></th>
                                            <th className="border-right py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">ABW</span></th>
                                            <th className="border-0 py-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Status</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Array.isArray(Data.batches) && Data.batches.length ? Data.batches.map((item, i) => (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.BatchNo}</span></td>
                                                    <td className="border-right p-1"><Link className="d-block fs-6 fw-bold text-center text-dark" to={`/farm_mng/${UserID}/${Data ? Data.id : null}/${item.id}`}>{item.id}</Link></td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{new Date(item.IssueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.CondID.Title}</span> </td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.Size}</span> </td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">23,250.00</span> </td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.FCR}</span> </td>
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.ABW}</span> </td>
                                                    <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.Status ? "Active" : "Closed"}</span> </td>
                                                </tr>
                                            ))
                                                : null
                                        }
                                    </tbody>

                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Batches);