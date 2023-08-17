import * as moment from 'moment'
import { LoadSellData } from '../../../actions/ContractAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../actions/auth';
import { connect, useDispatch } from 'react-redux';

import { CreateMessage, InfoMessage } from "../../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';
import { exportPDF } from '../../Suppliers/Class/OrderPDF';

const Sells = ({ CompanyID, BranchID, BatchID, SupplierID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [Data, setData] = useState(false)
    const [MyProList, setMyProList] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    const [Rows, setRows] = useState([])
    const [TempData, setTempData] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [RefLists, setRefLists] = useState(initialValue);
    const [RepLists, setRepLists] = useState(initialValue);
    const [Toggle, setToggle] = useState(false);
    const [DDate, setDDate] = useState(false);
    const [OrderNo, setOrderNo] = useState("12120121912033");
    const [Amount, setAmount] = useState(0.00);
    const [Expand, setExpand] = useState(false);
    const [AccordLbl, setAccordLbl] = useState("Add New Product");

    const [BirdSell, setBirdSell] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    useEffect(() => {
        SellData();
    }, [])

    const SellData = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadSellData(BatchID);
        if (result !== true) {
            setBirdSell(result);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const getTotal = () => {
        var Sum = false;
        const value = Array.isArray(BirdSell) && BirdSell.length ? BirdSell.map(row => row) : 0;
        let SellDate

        if (value.length > 0) {
            if (value.length > 1) {
                SellDate = value.filter((data) => data.PartyAgent === "Stock Bird") ? (value[value.length - 2]).Date : (value[value.length - 1]).Date;
            }
            let count = value.filter((data) => data.PartyAgent !== "Stock Bird") ? value.length - 1 : value.length;
            let CountTotal = value.length;
            let QuantityTotal = value.reduce((TotalQuantity, currentValue) => TotalQuantity + parseInt(currentValue.Qty, 10), 0);
            let WeightTotal = value.reduce((total, currentValue) => total = total + parseFloat(currentValue.Weight), 0);
            let RateAVG = value.reduce((total, currentValue) => total = total + parseFloat(currentValue.Rate), 0) / CountTotal;
            let AmountTotal = value.reduce((total, currentValue) => total = total + parseFloat(currentValue.GrandTotal), 0);
            let AVGSize = WeightTotal / QuantityTotal;
            Sum = { "Date": SellDate, "Count": count, "Qty": QuantityTotal, "Weight": WeightTotal, "AVGSize": AVGSize, "Rate": RateAVG, "Amount": AmountTotal };
        }
        return Sum;
    }

    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-11 justify-content-center align-items-center">
                        <table className={`table table-hover table-borderles table-responsive card-1 d-table justify-content-center align-items-center position-absolute overflow-auto top-0 start-50 translate-middle-x p-2 m-0`} style={{ maxHeight: "70%" }}>
                            <thead>
                                <tr className="text-center">
                                    <th className="p-1 border-0" colSpan="11">
                                        <p className="fs-4 fw-bolder text-center py-2 m-0">BIRD SELL</p>
                                    </th>
                                </tr>
                                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">S/N</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Quantity</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Weight</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Size</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Stock Qty</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Stock Wt</span></th>
                                    <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Rate</span></th>
                                    <th className="p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Amount</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(BirdSell) && BirdSell.length ? BirdSell.map((item, i) => (
                                        <tr className={`border-bottom text-center ${item.PartyAgent === "Stock Bird" ? "bg-light" : null}`} key={i}>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.PartyAgent === "Stock Bird" ? "Stock" : i + 1}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark" px-2>{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2" >{parseFloat(item.Qty ? item.Qty : 0).toLocaleString() + " PCS"}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Weight ? item.Weight : 0.000).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Size ? item.Size : 0.000).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.StockQty ? item.StockQty : 0).toLocaleString() + " PCS"}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.StockWeight ? item.StockWeight : 0.000).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.Rate ? item.Rate : 0.00).toLocaleString("en-BD", { minimumFractionDigits: 2, style: 'currency', currency: 'BDT' })}</span> </td>
                                            <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.GrandTotal ? item.GrandTotal : 0.00).toLocaleString("en-BD", { minimumFractionDigits: 2, style: 'currency', currency: 'BDT' })}</span> </td>
                                        </tr>
                                    ))
                                        : null
                                }
                                <tr className="text-center border border-light mt-3">
                                    <td className="p-1"><span className="d-block fw-bolder text-center">{getTotal() ? getTotal().Count + " Party" : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-center">{getTotal() ? moment(getTotal().Date).format('DD MMM YYYY') : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-center">{getTotal() ? getTotal().Qty.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{getTotal() ? getTotal().Weight.toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{getTotal() ? getTotal().AVGSize.toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">N/A</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">N/A</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{getTotal() ? parseFloat(getTotal().Rate).toLocaleString("en-BD", { minimumFractionDigits: 2, style: 'currency', currency: 'BDT' }) : "N/A"}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{getTotal() ? parseFloat(getTotal().Amount).toLocaleString("en-BD", { minimumFractionDigits: 2, style: 'currency', currency: 'BDT' }) : "N/A"}</span> </td>
                                </tr>
                            </tbody>

                        </table>
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

export default connect(mapStateToProps, { logout })(Sells);