import * as moment from 'moment'
import { LoadProfitNLoss, DeleteDR } from '../../../actions/ContractAPI';
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
import { exportPDF } from '../../Suppliers/Class/OrderPDF';
import { inWords } from '../../../hocs/NumberToWord';

const ProfitNLoss = ({ UserID, BisID, BatchID, user, list, setList }) => {
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
        GetProfitNLoss(BatchID);
    }, [])

    const GetProfitNLoss = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadProfitNLoss(BatchID);
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

    const CheckedAll = () => {
        setCheckAll(CheckAll ? false : true)
        setData(prevValue => [...prevValue].map(el => el.OpCode <= 18 ? ({ ...el, Status: 1 }) : ({ ...el, Status: 0 })))
    }

    const Checked = (id, Data) => {
        setData(prevValue => [...prevValue].map(el => el.SLNo === id ? ({ ...el, Status: el.Status ? 0 : 1 }) : el))
        setCheckAll(false);
    }
    
    let Balance = (Data) => Data.reduce(function (bal, myvalue) {
        let data = ('dr' in myvalue) ? bal += parseFloat(myvalue.dr, 10) : bal -= parseFloat(myvalue.cr, 10)
        return data;
    }, 0)

    const getSumColumn = (arr, index) => {
        let sum = 0
        arr.forEach((el, i) => i <= index ? sum += el.DR - el.CR : 0.00)
        return sum
    }

    return (
        <div className="position-relative mb-5" style={{ height: "92%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-12 justify-content-center align-items-center">
                        {
                            Array.isArray(Data) && Data.length ?
                                <table className={`table table-hover`} style={{ maxHeight: "70%" }}>
                                    <thead>
                                        <tr className="text-center">
                                            <th className="p-1 border-0" colspan="14">
                                                <div className="d-flex">
                                                    <div className="mr-auto"></div>
                                                    <p className="mr-auto p-0 fs-4 fw-bolder mb-0 text-center text-uppercase">Profit & Loss</p>
                                                    <p className="fs-4 fw-bolder p-0 mb-0"><i class="fad fa-layer-plus"></i></p>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">SLNo</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Items</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Count</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Unit Price</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Quantity</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                            <th className="border-top py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Data.map((item, i) => (
                                            <>
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark">{i + 1}</span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-left text-dark px-2">{parseInt(item.order) === 4 ? "Batch Sell" : item.title}</span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{parseFloat(item.count).toLocaleString("en-BD", { minimumFractionDigits: 0 })}</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.avg).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳"}</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.qty).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{('dr' in item) ? parseFloat(item.dr).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : 0.00 + " ৳"}</span> </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{('cr' in item) ? parseFloat(item.cr).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : 0.00 + " ৳"}</span> </td>
                                                    <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.balance) !== 0.00 ? parseFloat(item.balance).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : + "0.00 ৳"}</span> </td>
                                                </tr>
                                            </>
                                        ))}
                                        <tr className="border-bottom text-center" key={50}>
                                            <td colSpan={6} className="border-0 p-0">
                                                <small className="d-block fw-normal text-center font-italic text-muted text-uppercase p-1">{inWords(Balance(Data))}</small>
                                            </td>
                                            <td className="border-right p-0">
                                                <span className="d-block fs-6 fw-bolder text-right text-success text-uppercase p-1">{Balance(Data) > 0 ? "Net Profit" : "Net Loss"}</span>
                                            </td>
                                            <td className="border-0 p-0"><span className="d-block fs-6 fw-bolder text-right text-success text-uppercase p-1" style={{ borderBottomStyle: "double" }}>
                                                {Balance(Data).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳"}
                                            </span>
                                            </td>
                                        </tr>
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

export default connect(mapStateToProps, { logout })(ProfitNLoss);