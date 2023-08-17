import * as moment from 'moment'
import { LoadWeeklyData } from '../../../actions/ContractAPI';
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

const WeeklyReports = ({ CompanyID, BranchID, BisID, BatchID, SupplierID, user, list, setList }) => {


    const [WeeklyData, setWeeklyData] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        FetchWeeklyData();
    }, [])


    const FetchWeeklyData = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadWeeklyData(BisID, BatchID);

        if (result !== true) {
            setWeeklyData(result);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const MortIncreaseRate = (i) => {
        //outside accumulator to hold the running total
        let c = 0;
        let p = 0;

        //new obj to hold results with running total
        let b = Array.isArray(WeeklyData) && WeeklyData.length ? WeeklyData.map((x, i) => ({ ...x, "rtotal": c = parseInt(x.TMort, 10), "prv": p = parseInt(x.TMort, 10) - c }), 0) : 0

        //show results, use console.table if in a browser console

    }

    const MortValue = (i) => Array.isArray(WeeklyData) && WeeklyData.length ? WeeklyData[i - 1].TMort : 0

    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-11 justify-content-center align-items-center">
                        <table className={`table table-hover table-borderles table-responsive card-1 d-table justify-content-center align-items-center position-absolute overflow-auto top-0 start-50 translate-middle-x p-2 m-0`} style={{ maxHeight: "70%" }}>
                            <thead>
                                <tr className="text-center">
                                    <th className="p-1 border-0" colSpan="11">
                                        <p className="fs-4 fw-bolder text-center py-2 m-0">WEEKLY REPORTS</p>
                                    </th>
                                </tr>
                                <tr className="text-center" style={{ borderBottom: "2px solid #DEE2E6" }}>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Week</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Quantity</span></th>
                                    <th colSpan="3" className="border-right px-2 py-0 align-middle"><span className="fs-6 fw-bolder text-dark">Mortality</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">TFC</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">AFC</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">ABW</span></th>
                                    <th rowSpan="2" className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">FCR</span></th>
                                    <th rowSpan="2" className="p-2 align-middle"><span className="fs-6 fw-bolder text-dark">ACTUAL FCR</span></th>
                                </tr>
                                <tr className="text-center p-0" style={{ borderBottom: "3px solid #DEE2E6" }} key={0}>
                                    <th className="border-right p-0 align-middle"><span className="fs-6 fw-bolder text-dark">Expire</span></th>
                                    <th className="border-right p-0 align-middle"><span className="fs-6 fw-bolder text-dark">Rate(%)</span></th>
                                    <th className="border-right p-0 align-middle"><span className="fs-6 fw-bolder text-dark">Change(%)</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(WeeklyData) && WeeklyData.length ? WeeklyData.map((item, i) => (
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.Age === 6 ? "First Week" : item.Age === 13 ? "Second Week" : item.Age === 20 ? "Third Week" : item.Age === 27 ? "Fourth Week" : item.Age === 35 ? "Fifth Week" : item.Age === 42 ? "Sixth Week" : "N/A"}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark" px-2>{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2">{item.Chick.toLocaleString() + " PCS"}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2">{parseFloat(item.TMort ? item.TMort : 0) + " PCS"}</span></td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2">{parseFloat(item.TMort && item.BatchSize ? (item.TMort * 100) / item.BatchSize : 0.00).toFixed(2) + "%"}</span></td>
                                            <td className="border-right p-0">
                                                <div className="d-flex justify-content-between align-items-center px-2">
                                                    <i className={`${i !== 0 ? parseInt((parseInt(item.TMort) - MortValue(i)) - MortValue(i)) > 0 ? "fad fa-sort-amount-up text-warning" : "fad fa-sort-amount-down text-dark" : "fad fa-sort-alt"}`}></i>
                                                    <span className="fs-6 fw-bold text-right text-dark btn">{i !== 0 ? (((parseInt(item.TMort) - MortValue(i)) - MortValue(i)) / MortValue(i) * 100).toFixed(2) + "%" : parseFloat(item.TMort && item.BatchSize ? (item.TMort * 100) / item.BatchSize : 0.00).toFixed(2) + "%"}</span>
                                                </div>
                                            </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.TCons).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.ABW && item.TCons && item.BatchSize ? item.TCons / (item.ABW * item.BatchSize) : 0.000).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-0 p-0"><span className="d-block fs-6 fw-bold text-right text-dark px-2">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                    ))
                                        : null
                                }
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

export default connect(mapStateToProps, { logout })(WeeklyReports);