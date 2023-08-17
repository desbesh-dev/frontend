import * as moment from 'moment'
import { LoadBatchAccount, DeleteDR } from '../../../actions/ContractAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../actions/auth';
import { connect, useDispatch } from 'react-redux';

import { CreateMessage, InfoMessage } from "../../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { DeleteMessage } from '../../Modals/DeleteModal';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';
import { exportPDF } from '../../Contract/FarmManagement/Reports/Receipt'

const BatchAccount = ({ UserID, BisID, BatchID, user, BatchDetails, UserData, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [ItemID, setItemID] = useState();

    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [Data, setData] = useState(false)
    const [Stock, setStock] = useState(false)
    const [CheckAll, setCheckAll] = useState(true)
    const [Amount, setAmount] = useState(0.00);
    const [Expand, setExpand] = useState(false);
    const [AccordLbl, setAccordLbl] = useState("Add New Product");
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        GetBatchAccount(BatchID);
        // handleCheckAll(Data);
    }, [])

    const GetBatchAccount = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadBatchAccount(BatchID);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            // history.push('/my_supplier');
        }
    }

    const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

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

    const getSumColumn = (arr, index) => {
        let sum = 0
        arr.forEach((el, i) => i <= index ? sum += el.DR - el.CR : 0.00)
        return sum
    }
    // arr.forEach((el, i) => i <= 1 ? sum += el[6] - el[5] : el)
    // 

    return (
        <div className="position-relative mb-5" style={{ height: "92%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-12 justify-content-center align-items-center">
                        <div className="d-flex justify-content-around align-items-center">
                            <p className="p-0 fs-4 fw-bolder mb-0 text-center text-uppercase"></p>
                            <p className="p-0 fs-4 fw-bolder mb-0 text-center text-uppercase">Batch Accounts</p>
                            <div className='d-flex'>
                                <button className="btn text-right fs-3 fw-bolder px-2 mb-0" title="Receipt (PDF)"
                                    onClick={(e) => exportPDF(e, Data, 0)}>
                                    <i class="fad fa-receipt"></i>
                                </button>
                                <button className="btn text-right fs-3 fw-bolder px-2 mb-0" id="print" title="Receipt Print"
                                    onClick={(e) => exportPDF(e, Data, 1)}>
                                    <i class="fad fa-print"></i>
                                </button>
                            </div>
                        </div>
                        {
                            Array.isArray(Data.AccountList) && Data.AccountList.length ?
                                <table className={`table table-hover`} style={{ maxHeight: "70%" }} id="table">
                                    <thead>
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
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-left text-dark px-2">{item.CS_Title ? item.CS_Title : item.Title}</span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{parseFloat(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 })} KG</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Point).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 })} </span> </td>
                                                    {parseInt(item.OpCode) === 21 ?
                                                        <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.CR).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                        :
                                                        <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.DR) !== 0 ? (item.DR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : parseFloat(item.CR) !== 0 ? "—" + (item.CR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00 "}</span> </td>
                                                    }
                                                </tr>
                                        ))}
                                    </tbody>

                                </table>
                                : null
                        }
                    </div>
                </div>
            </div >
            {
                ItemID ?
                    <DeleteMessage
                        FullName={`${ItemID.Date} dated mortality ${ItemID.DMort} & Consumption ${ItemID.DCons} with feed sent ${ItemID.DFeed}?`}
                        show={DeleteModalShow}
                        Click={(e) => RemoveDR(e)}
                        onHide={() => setDeleteModalShow(false)}
                    />
                    : null
            }
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(BatchAccount);