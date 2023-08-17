import * as moment from 'moment'
import { LoadDailyRecord, DeleteDR } from '../../../actions/ContractAPI';
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
import { UpdateModal } from './Modal/DRModal';

const DailyRecords = ({ UserID, BisID, BatchID, user, list, setList, scale, sub_scale }) => {

    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [EditModalShow, setEditModalShow] = useState(false);
    const [ItemID, setItemID] = useState();

    const [Data, setData] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        GetDailyRecord();
    }, [])

    const GetDailyRecord = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadDailyRecord(BisID, BatchID);

            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            // history.push('/my_supplier');
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
        <div className="position-relative mb-5" style={{ height: "92%" }}>
            <div className="position-absolute overflow-auto my-1 px-2 w-100 bg-white" style={{ maxHeight: "75%" }}>
                {
                    Array.isArray(Data) && Data.length ?
                        <table className={`table text-nowrap`}>
                            <thead>
                                <tr className="text-center">
                                    <th className="p-1 border-0" colSpan="15">
                                        <div className="d-flex">
                                            <div className="mr-auto"></div>
                                            <p className="mr-auto py-0 px-2 fs-4 fw-bolder mb-0 text-center">DAILY RECORDS</p>
                                        </div>
                                    </th>
                                </tr>
                                <tr className="text-center">
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Weak</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Age</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Cumulative</span></th>
                                    <th colSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Mortality</span></th>
                                    <th colSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Feed Sent</span></th>
                                    <th colSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Feed Cons</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Feed Stock</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">AVC</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">AVW</span></th>
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">FCR</span></th>
                                    {/* <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">VAC</span></th> */}
                                    <th rowSpan="2" className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Remark</span></th>
                                    <th rowSpan="2" className="py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Action</span></th>
                                </tr>
                                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Daily</span></th>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Total</span></th>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Daily</span></th>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Total</span></th>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Daily</span></th>
                                    <th className="border-right py-0 px-2 align-middle"><span className="fs-6 fw-bolder text-dark">Total</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data.map((item, i) => (
                                    <tr className={`border-bottom text-center ${i === 6 || i === 13 || i === 20 || i === 27 || i === 34 || i === 41 ? "bg-light text-dark" : null}`} key={i}>
                                        {i === 0 ?
                                            <td rowSpan="7" className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">1</span></td>
                                            : i === 7 ?
                                                <td rowSpan="7" className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">2</span></td>
                                                : i === 14 ?
                                                    <td rowSpan="7" className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">3</span></td>
                                                    : i === 21 ?
                                                        <td rowSpan="7" className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">4</span></td>
                                                        : i === 28 ?
                                                            <td rowSpan="7" className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">5</span></td>
                                                            : null
                                        }
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2" >{item.Age}</span></td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.Chick} PCS</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.DMort}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.TMort}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.DFeed}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.TFeed}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.DCons}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.TCons}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{item.FeedStock}</span> </td>

                                        {i === 0 ?
                                            <>
                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                            </>
                                            : i === 6 ?
                                                <>
                                                    <td className="border-right py-0 px-2">{i === 6 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                    <td className="border-right py-0 px-2">{i === 6 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                    <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                </>
                                                : i === 7 ?
                                                    <>
                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                    </>
                                                    : i === 13 ?
                                                        <>
                                                            <td className="border-right py-0 px-2">{i === 13 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                            <td className="border-right py-0 px-2">{i === 13 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                            <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        </>
                                                        : i === 14 ?
                                                            <>
                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                            </>
                                                            : i === 20 ?
                                                                <>
                                                                    <td className="border-right py-0 px-2">{i === 20 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                    <td className="border-right py-0 px-2">{i === 20 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                    <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                                </>
                                                                : i === 21 ?
                                                                    <>
                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                    </>
                                                                    : i === 27 ?
                                                                        <>
                                                                            <td className="border-right py-0 px-2">{i === 27 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                            <td className="border-right py-0 px-2">{i === 27 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                            <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                                        </>
                                                                        : i === 28 ?
                                                                            <>
                                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                                                <td rowSpan="6" className="border-right py-0 px-2" />
                                                                            </>
                                                                            : i === 34 ?
                                                                                <>
                                                                                    <td className="border-right py-0 px-2">{i === 34 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                                    <td className="border-right py-0 px-2">{i === 34 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                                    <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                                                </>
                                                                                : i === 35 ?
                                                                                    <>
                                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                                        <td rowSpan="6" className="border-right py-0 px-2" />
                                                                                    </>
                                                                                    : i === 41 ?
                                                                                        <>
                                                                                            <td className="border-right py-0 px-2">{i === 41 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.TCons && item.Chick ? item.TCons / item.Chick : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                                            <td className="border-right py-0 px-2">{i === 41 ? <span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW ? item.ABW : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> : null}</td>
                                                                                            <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{parseFloat(item.ABW && item.TCons && item.Chick ? item.TCons / (item.ABW * item.Chick) : 0.000).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                                                        </>
                                                                                        : null
                                        }

                                        {/* <td className="border-right py-0 px-2" style={{ wordWrap: "break-word", minWidht: "10px", maxWidth: "80px" }}>
                                                    <span className="d-block fs-6 fw-bold text-center text-dark">Vaccination</span>
                                                </td> */}
                                        <td className="border-right py-0 px-2" style={{ wordWrap: "break-word", minWidht: "10px", maxWidth: "80px" }}>
                                            <span className="d-block fs-6 fw-bold text-center text-dark">{item.Remark ? item.Remark : "N/A"}</span>
                                        </td>
                                        <td className="border-0 py-0 px-2">
                                            <button className="btn px-2 py-1 text-center text-dark" onClick={() => { setItemID(item); setEditModalShow(true) }} ><i className="fs-6 fad fa-edit" /></button>
                                            {
                                                scale === 6 || (scale === 3 && (sub_scale === 9 || sub_scale === 10)) ? <button className="btn px-2 py-1 text-center text-dark" onClick={() => { setItemID(item); setDeleteModalShow(true) }} ><i className="fs-6 fad fa-trash-alt" /></button>
                                                    : null
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        : null
                }
            </div>
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
            {
                ItemID ?
                    <UpdateModal
                        Item={ItemID}
                        show={EditModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => GetDailyRecord()}
                        onHide={() => { setItemID(false); setEditModalShow(false) }}
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

export default connect(mapStateToProps, { logout })(DailyRecords);