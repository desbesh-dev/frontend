import * as moment from 'moment'
import { LoadSellData } from '../../../actions/ContractAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../actions/auth';
import { LoadBranch } from '../../../actions/APIHandler';
import { connect, useDispatch } from 'react-redux';

import { UpdateModal, CreateModal } from "./AccountModals";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';
// import { exportPDF } from '../../Suppliers/Class/OrderPDF';

const AccountSettings = ({ CompanyID, BranchID, BatchID, SupplierID, user, list, setList }) => {

    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [Count, setCount] = useState(null)
    const [BranchItem, setBranchItem] = useState(false);

    const [Branches, setBranches] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        ItemCode: "",
        Title: "",
        UnitWeight: "",
        UnitPrice: "",
        Quantity: "",
    });

    useEffect(() => {
        LoadBR();
    }, [])


    const LoadBR = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadBranch();
        if (result !== true) {
            setBranches(result);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>
            <div className="header mb-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center" m-0>
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/acc_settings">Account Settings</Link></li>
                    </ol>
                </nav>
                <p className="display-6 d-flex justify-content-center m-0">Account Settings</p>

            </div>
            <div className="position-absolute overflow-auto my-1 w-100 h-100">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-8 justify-content-center align-items-center">
                        <p className="fs-4 d-flex fw-bold justify-content-center text-uppercase mt-3">Let's setup accounts</p>
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-outline-light fs-5 fw-bolder text-center text-success text-uppercase" style={{ borderRadius: "15px" }}
                                onClick={() => setCreateModalShow(true)}
                            >
                                <i class="fad fa-plus pr-2"></i>Create a new</button>
                        </div>
                        <div className="row justify-content-center align-items-center">
                            {
                                Array.isArray(Branches) && Branches.length ? Branches.map((item, i) => (
                                    <table className={`table table-borderless table-responsive card-1 d-table`}>
                                        <tbody>
                                            <tr className="text-center text-success" key={i}>
                                                <td class="p-1" colspan="6"><span class="fs-4 fw-bolder text-center py-2 text-uppercase">
                                                    {item.BranchID + ". " + item.Name} Branch</span><br />
                                                    <small class="fs-6 text-center text-muted py-2 text-uppercase">
                                                        {item.VillageName + ", " + item.Union + ", " + item.Upazila + ", " + item.Zila + ", " + item.Division}
                                                    </small>
                                                </td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1" rowSpan="6"><span className="d-block fs-6 fw-bolder text-uppercase text-center text-dark px-2">General Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Cash Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.CashAC ? item.CashAC : "N/A"}</span></td>
                                                <td className="p-1" rowSpan="14"> <button className="btn fs-3 fw-bold text-center text-dark px-2" onClick={() => { setBranchItem(item); setUpdateModalShow(true) }}>
                                                    <i class="fad fa-edit"></i></button></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Sell Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.SellAC ? item.SellAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Purchase Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.PurchaseAC ? item.PurchaseAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Payable Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.PayableAC ? item.PayableAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Receivable Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.ReceivableAC ? item.ReceivableAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Stock Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.StockAC ? item.StockAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1" rowSpan="6"><span className="d-block fs-6 fw-bolder text-uppercase text-center text-dark px-2">Contract Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Bird Sell Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.BatchSellAC ? item.BatchSellAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Product Sent Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.ProductSentAC ? item.ProductSentAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch Payment Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.BatchPaymentAC ? item.BatchPaymentAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch Payment Payable Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.BatchPaymentPayableAC ? item.BatchPaymentPayableAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Saving Payment Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.SavingPaymentAC ? item.SavingPaymentAC : "N/A"}</span></td>
                                            </tr>
                                            <tr className="border-bottom border-top text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Saving Payment Payable Account</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.SavingPaymentPayableAC ? item.SavingPaymentPayableAC : "N/A"}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ))
                                    :
                                    <button className="btn fs-3 fw-bold text-center text-dark px-2" onClick={() => { setBranchItem(BranchID); setUpdateModalShow(true) }}>
                                        <i class="fad fa-edit"></i></button>
                            }

                        </div>
                    </div>
                </div>
            </div >
            {
                BranchItem ?
                    <UpdateModal
                        BranchID={BranchID}
                        Item={BranchItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => LoadBR()}
                        onHide={() => { setBranchItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            }

            <CreateModal
                BranchID={BranchID}
                Item={BranchItem}
                show={CreateModalShow}
                list={list}
                setList={setList}
                onReload={() => LoadBR()}
                onHide={() => { setBranchItem(false); setCreateModalShow(false) }}
            />
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    BranchID: state.auth.user.BranchID
});

export default connect(mapStateToProps, { logout })(AccountSettings);