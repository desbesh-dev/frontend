import * as moment from 'moment'
import { LoadBatchAccount, DeleteDR, SaveBatchAcc, LoadBatchAssesment } from '../../../actions/ContractAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory, useRouteMatch } from 'react-router-dom';
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
const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

const BatchAssesment = ({ UserID, BisID, BatchID, user, list, setList, scale, sub_scale, Status }) => {
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Error, setError] = useState([])
    const [Stock, setStock] = useState(false)
    const [CheckAll, setCheckAll] = useState(true)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    let { path, url } = useRouteMatch();
    useEffect(() => {
        FetchBatchAssesment(BatchID);
    }, [])

    const FetchBatchAssesment = async () => {
        if ((scale === 3 && (sub_scale === 5 || sub_scale === 9 || sub_scale === 10)) || (scale === 6 && sub_scale)) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadBatchAssesment(BatchID, 2);
            if (result !== true) {
                setData(result.data.acc_items);
                setStock(result.data.Stock);
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push(url);
        }
    }

    const CheckedAll = () => {
        setCheckAll(CheckAll ? false : true)
        setData(prevValue => [...prevValue].map(el => ({ ...el, Status: 1 })))
    }

    const Checked = (id, Data) => {
        setData(prevValue => [...prevValue].map(el => el.SLNo === id ? ({ ...el, Status: el.Status ? 0 : 1 }) : el))
        setCheckAll(false);
    }

    const getSumColumn = (arr, index) => {
        let sum = 0
        arr.forEach((el, i) => i <= index ? sum += el.DR - el.CR : 0.00)
        // bal(sum, index)
        return (sum).toFixed(2)
    }

    const SendBatchAc = async (Data) => {
        const newData = Data.filter((person) => person.Status === 1);
        const result = await SaveBatchAcc(newData, BatchID);
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                setData(false);
                window.location.reload(false)
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Payment request failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const deleteRow = (i, e) => {
        var len = Data.length;
        const newRows = Data.splice(i, 1).concat(Data.slice(i + 1));
        if (e < len) {
            updateItem();
        }
    };

    const updateItem = () => {
        // if (index !== -1) {
        //     let temporaryarray = [...AccData];
        //     temporaryarray[index] = { ...temporaryarray[index], SLNo: index + 1 };
        //     setAccData(temporaryarray);
        // }
        const newState = Data.map((obj, i) => ({ ...obj, SLNo: i, Balance: getSumColumn(Data, i), CS_Title: obj.CS_Title ? obj.CS_Title : "" }));
        var len = newState.length;
        setData(newState);
    }

    const CustomTitle = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], CS_Title: e.target.value };
            setData(temporaryarray);
        }
        else {

        }
    }

    const TitleBlur = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], CS_Title: parseInt(temporaryarray[index].OpCode) === 22 ? temporaryarray[index].CS_Title === "" ? temporaryarray[index].Title : temporaryarray[index].CS_Title : temporaryarray[index].Title };
            setData(temporaryarray);
            updateItem()
        }
        else {

        }
    }

    const CustomQty = (index, e) => {
        if (index !== -1) {
            let C = Data[index].Rate * e.target.value
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], Qty: isNaN(e.target.value) || e.target.value.toString().length === 0 ? 0.00 : e.target.value, CR: C, Balance: isNaN(e.target.value) || e.target.value.toString().length === 0 ? temporaryarray[index - 1].Balance : temporaryarray[index - 1].Balance - C };
            setData(temporaryarray);
        }
        else {

        }
    }

    const CustomWeight = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], Weight: isNaN(e.target.value) || e.target.value.toString().length === 0 ? 0.000 : e.target.value };
            setData(temporaryarray);
        }
        else {

        }
    }

    const CustomRate = (index, e) => {
        if (index !== -1) {
            let C = Data[index].Qty * e.target.value
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], Rate: isNaN(e.target.value) || e.target.value.toString().length === 0 ? 0.00 : e.target.value, CR: C, Balance: isNaN(e.target.value) || e.target.value.toString().length === 0 ? temporaryarray[index - 1].Balance : temporaryarray[index].Balance - C };
            setData(temporaryarray);
        }
        else {

        }
    }

    const CustomCR = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...Data]; temporaryarray[index] = { ...temporaryarray[index], CR: isNaN(e.target.value) || e.target.value.toString().length === 0 ? 0.00 : e.target.value, Balance: getSumColumn(Data, index) };
            setData(temporaryarray);
        }
        else {

        }
    }

    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>

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
                                                    <p className="mr-auto p-0 fs-4 fw-bolder mb-0 text-center text-uppercase">Batch Assesment</p>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">SLNo</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">ID</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Title</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Quantity</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Weight</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">#</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Rate</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                            <th className="border-top py-2 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Data.map((item, i) => (
                                            parseInt(item.OpCode) === 18 || parseInt(item.OpCode) === 19 || parseInt(item.OpCode) === 20 ?
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td colSpan={9} className="border-right p-0"><span className="d-block fs-6 fw-bolder text-right text-success text-uppercase p-1">
                                                        {parseInt(item.OpCode) === 18 ? "Payment" : parseInt(item.OpCode) === 19 ? "Net Payment" : parseInt(item.OpCode) === 20 ? "Grand Payment" : null}
                                                    </span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bolder text-success text-right text-uppercase px-2" style={{ borderBottomStyle: parseInt(item.OpCode) === 20 ? "double" : null }}>{getSumColumn(Data, i) ? getSumColumn(Data, i).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span> </td>

                                                </tr> :

                                                <tr className={`text-center ${parseInt(item.OpCode) === 22 ? "border-bottom border-warning" : "border-bottom"}`} key={i}>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark">{i}</span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2" >{item.SLNo}</span></td>
                                                    <td className="border-right p-0">
                                                        {parseInt(item.OpCode) === 22 ?
                                                            <span className="d-flex justify-content-left align-items-center">
                                                                <input
                                                                    type="text"
                                                                    className="form-control border-0 text-left fw-bold mx-auto"
                                                                    placeholder={item.CS_Title ? item.CS_Title : item.Title}
                                                                    value={item.CS_Title ? item.CS_Title : item.Title}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => CustomTitle(i, e)}
                                                                    onBlur={(e) => TitleBlur(i, e)}

                                                                />
                                                            </span>
                                                            :
                                                            <span className="d-block fs-6 fw-bold text-left text-dark px-2">{item.Title}</span>
                                                        }
                                                    </td>
                                                    <td className="border-right p-0">
                                                        {parseInt(item.OpCode) === 22 ?
                                                            <span className="d-flex justify-content-left align-items-center">
                                                                <input
                                                                    type="numeric"
                                                                    className="form-control border-0 text-center fw-bold mx-auto"
                                                                    placeholder={item.Qty}
                                                                    value={item.Qty}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => CustomQty(i, e)}
                                                                    onBlur={(e) => updateItem()}
                                                                />
                                                            </span>
                                                            :
                                                            <span className="d-block fs-6 fw-bold text-center text-dark px-2">{(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS</span>
                                                        }

                                                    </td>
                                                    {parseInt(item.OpCode) === 8 || parseInt(item.OpCode) === 9 ?
                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseInt(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS</span> </td>
                                                        :
                                                        <td className="border-right p-0">
                                                            {parseInt(item.OpCode) === 22 ?
                                                                <span className="d-flex justify-content-left align-items-center">
                                                                    <input
                                                                        type="numeric"
                                                                        className="form-control border-0 text-right fw-bold mx-auto"
                                                                        placeholder={item.Weight}
                                                                        value={item.Weight}
                                                                        onFocus={(e) => e.target.select()}
                                                                        onChange={(e) => CustomWeight(i, e)}
                                                                        onBlur={(e) => updateItem()}
                                                                    />
                                                                </span>
                                                                :
                                                                <span className="d-block fs-6 fw-bold text-right text-dark px-2">{(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 2 })} KG</span>
                                                            }

                                                        </td>
                                                    }
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{(item.Point).toLocaleString("en-BD", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="border-right p-0">
                                                        {parseInt(item.OpCode) === 22 ?
                                                            <span className="d-flex justify-content-left align-items-center">
                                                                <input
                                                                    type="numeric"
                                                                    className="form-control border-0 text-right fw-bold mx-auto"
                                                                    placeholder={item.Rate}
                                                                    value={item.Rate}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => CustomRate(i, e)}
                                                                    onBlur={(e) => updateItem()}
                                                                />
                                                            </span>
                                                            :
                                                            <span className="d-block fs-6 fw-bold text-right text-dark px-2">{(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 3 })} ৳</span>
                                                        }
                                                    </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{item.DR ? (item.DR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span> </td>
                                                    <td className="border-right p-0">
                                                        {parseInt(item.OpCode) === 22 ?
                                                            <span className="d-flex justify-content-left align-items-center">
                                                                <input
                                                                    type="numeric"
                                                                    className="form-control border-0 text-right fw-bold mx-auto"
                                                                    placeholder={item.CR}
                                                                    value={item.CR}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => CustomCR(i, e)}
                                                                    onBlur={(e) => updateItem()}
                                                                />
                                                            </span>
                                                            :
                                                            <span className="d-block fs-6 fw-bold text-right text-dark px-2">{item.CR ? (item.CR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span>
                                                        }
                                                    </td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{getSumColumn(Data, i) ? getSumColumn(Data, i).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span> </td>
                                                    {/* <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{getSumColumn(Data, i) ? getSumColumn(Data, i).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span> </td> */}
                                                    {/* <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{item.Balance ? (item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " ৳" : "—"}</span> </td> */}
                                                    <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">
                                                        <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i, i + 1)}>
                                                            <i className="fad fa-minus"></i>
                                                        </button>
                                                    </span> </td>
                                                </tr>

                                        ))}
                                    </tbody>

                                </table>
                                : null
                        }
                        {
                            scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 9 || sub_scale === 10)) ?
                                <div className='d-flex justify-content-center align-items-center'>

                                    <i className="fs-1 fad fa-paper-plane p-3 text-danger border-left border-top border-bottom border-danger bg-gradient bg-white" style={{ borderRadius: "35px", zIndex: "999", marginRight: "-10px" }} />
                                    {
                                        Status === 0 ? <span class="fs-5 text-white px-3 bg-success fw-bold">Batch Closed</span>
                                            : Status === 1 ? <span class="fs-5 text-white px-3 bg-success fw-bold">Active (Batch is not dispatch yet)</span>
                                                : Status === 2 ?
                                                    <Link to="#" className="payment_btn m-0 px-0 text-decoration-none link-white" Title="Request for payment to accounts"
                                                        onClick={() => SendBatchAc(Data)}>
                                                        <span class="payment_btn_inner ml-3">Request for payment</span>
                                                    </Link>
                                                    : Status === 3 ? <span class="fs-5 text-white px-3 bg-success fw-bold">Waiting for accounts approval</span>
                                                        : Status === 4 ? <span class="fs-5 text-white px-3 bg-success fw-bold">Paid</span> : Status === 5 ? <span class="fs-5 text-white px-3 bg-success fw-bold">Payment Hold (Need to full review)</span>
                                                            : null}
                                </div>
                                :
                                null}
                    </div>

                </div>
            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { logout })(BatchAssesment);