import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { DeleteDR, FetchContractFWRLadger, LoadBatchAccount, LoadDailyRecord } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import * as moment from 'moment';
import { exportPDF } from '../../Contract/FarmManagement/Reports/Receipt';

const BatchAccounts = ({ display, list, setList, BatchID, BusinessID }) => {
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [ItemID, setItemID] = useState();
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        GetBatchAccount();
        // handleCheckAll(Data);
    }, [])

    const GetBatchAccount = async () => {
        if (BusinessID !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadBatchAccount(BusinessID);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/fwr_field');
        }
    }


    const RemoveDR = async e => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        const result = await DeleteDR(ItemID.id);
        if (result !== true) {
            window.location.reload(false)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Batch Accounts</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/field_work">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Batch Account</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 px-0">

                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "75%" }}>
                    {
                        Array.isArray(Data.AccountList) && Data.AccountList.length ?
                            <table className={`table text-nowrap`} id="table">
                                <thead>
                                    <tr className="text-center">
                                        <th className="p-1 border-0" colSpan="14">
                                            {/* <div className="d-flex">
                                                <div className="mr-auto"></div>
                                                <p className="mr-auto p-0 fs-4 fw-bolder mb-0 text-center">DAILY RECORDS</p>
                                                <p className="fs-4 fw-bolder p-0 mb-0"><i class="fad fa-layer-plus"></i></p>
                                            </div> */}
                                            <div className='d-flex justify-content-center'>
                                                <button className="btn text-center fs-3 fw-bolder px-2 mb-0" title="Receipt (PDF)"
                                                    onClick={(e) => exportPDF(e, Data, 0)}
                                                >
                                                    <i class="fad fa-receipt"></i>
                                                </button>
                                                <button className="btn text-center fs-3 fw-bolder px-2 mb-0" id="print" title="Receipt Print"
                                                    onClick={(e) => exportPDF(e, Data, 1)}
                                                >
                                                    <i class="fad fa-print"></i>
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                    <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">SLNo</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Title</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Quantity</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Weight</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">#</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Rate</span></th>
                                        <th className="border-top py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Amount</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Data.AccountList.map((item, i) => (
                                        parseInt(item.OpCode) === 18 || parseInt(item.OpCode) === 19 || parseInt(item.OpCode) === 20 ?
                                            <tr className="border-bottom text-center" key={i}>
                                                <td colSpan={6} className="border-right p-0">
                                                    <span className="d-block fs-6 fw-bolder text-right text-success text-uppercase p-1">
                                                        {parseInt(item.OpCode) === 18 ? "Payment" : parseInt(item.OpCode) === 19 ? "Net Payment" : parseInt(item.OpCode) === 20 ? "Grand Payment" : null}
                                                    </span>
                                                </td>
                                                <td className="border-0 p-0">
                                                    <span className="d-block fs-6 fw-bolder text-success text-right text-uppercase px-2" style={{ borderBottomStyle: parseInt(item.OpCode) === 20 ? "double" : null }}>
                                                        {parseFloat(item.Amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                            </tr>
                                            :
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark">{item.OpCode === 18 || item.OpCode === 19 || item.OpCode === 20 ? i = i - 1 : i + 1}</span></td>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-left text-dark px-2">{item.Title}</span></td>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{parseFloat(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS</span> </td>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 })} KG</span> </td>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Point).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 })} </span> </td>
                                                <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.DR) !== 0 ? (item.DR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : parseFloat(item.CR) !== 0 ? "—" + (item.CR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00 "}</span> </td>
                                            </tr>
                                    ))}
                                </tbody>

                            </table>
                            : null
                    }
                </div>

            </div>
        </div >

    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id,
    BusinessID: props.match.params.bis_id
});

export default connect(mapStateToProps, { logout })(BatchAccounts);