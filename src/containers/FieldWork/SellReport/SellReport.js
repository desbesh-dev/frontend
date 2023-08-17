import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { BatchPro, SellRunningTotal, LoadSellReport, DeleteScale, DeleteReturnScale } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import * as moment from 'moment'
import Select from 'react-select';
import Datepicker from 'react-datepicker';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { UpdateModal, DeleteModal } from "./SellReportModal";

let today = new Date();

const Report = ({ display, BatchID, BusinessID, InvoiceNo, id, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [BatchData, setBatchData] = useState(null)
    const [CSDate, setCSDate] = useState(today)
    const [BSData, setBSData] = useState(false)
    const [BSReturnData, setBSReturnData] = useState(false)
    const [UpdateModalShow, setUpdateModalShow] = useState(false)
    const [InfoModalShow, setInfoModalShow] = useState(false)
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const [RunningValue, setRunningValue] = useState(0)
    const [ScaleItem, setScaleItem] = useState(false);
    const [ReturnSellItem, setReturnItem] = useState(false);

    const [Error, setError] = useState({});
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms();
        SellReportData();
    }, [])

    window.onbeforeunload = () => {
        return false;
    }

    const MyFarms = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var BatchDetials = await BatchPro(BatchID);
        if (BatchDetials !== true) {
            setBatchData(BatchDetials);
            RunningTotal();
        } else {
            history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SellReportData = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadSellReport(BatchID, id);
        if (result !== true) {
            setBSData(result.Scale);
            setBSReturnData(result.Return);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const BirdDelete = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteScale(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid scale',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                SellReportData();
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to delete scale. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const ReturnScaleDelete = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteReturnScale(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid scale',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                SellReportData();
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to delete return scale. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };


    const RunningTotal = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var Running = await SellRunningTotal(id);
        if (Running !== true) {
            setRunningValue(Running);
        } else {
            history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CalculateAge = (DOB) => {
        let today = new Date();
        let BirthDate = new Date(DOB);
        let tod = today.getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = "Age " + days_diff + " Days";
        return age;
    }

    const CScolourStyles = {
        control: (provided, state) => ({
            ...provided,
            flex: 1,
            boxShadow: "none",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
        }),
    }
    const QtyTotal = (item) => item.reduce((Quantity, myvalue) => Quantity + parseInt(myvalue.Qty, 10), 0);
    const WeightTotal = (item) => item.reduce((Weight, myvalue) => Weight + parseFloat(myvalue.Weight, 10), 0);
    const history = useHistory();

    const Load = Array.isArray(BSData) && BSData.length ? BSData.map(item => {
        let Qty = item.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0)
        let Weight = item.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0)
        var value = { "Qty": Qty, "Weight": Weight }
        return value;
    }) : 0

    let totQT = Array.isArray(Load) && Load.length ? Load.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0) : 0
    let totWT = Array.isArray(Load) && Load.length ? Load.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0) : 0.000

    const Return = Array.isArray(BSReturnData) && BSReturnData.length ? BSReturnData.map(item => {
        let Qty = item.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0)
        let Weight = item.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0)
        var value = { "Qty": Qty, "Weight": Weight }
        return value;
    }) : 0

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            {BatchData ?
                <div className="header mb-2">
                    <p className="display-6 d-flex justify-content-center m-0"> {BatchData.Title}</p>
                    <small className="text-muted fs-5 fw-bold d-flex justify-content-center">{`Batch No- ${BatchData.BatchNo}, Batch ID- ${BatchData.id}, Farm ID- ${BatchData.BusinessID}`} </small>
                    {/* <small className="text-success fs-6 fw-bold d-flex justify-content-center">{`Issued- ${moment(BatchData.IssueDate).format("DD MMM YYYY")} & ${CalculateAge(BatchData.IssueDate)}`} </small> */}
                    <small className="text-success fs-6 fw-bold d-flex justify-content-center">Birds Sell to</small>

                    <p className="display-6 d-flex justify-content-center m-0"> {RunningValue.PartyAgent}</p>
                    <small className="text-muted fs-5 fw-bold d-flex justify-content-center">{RunningValue.PartyID ? RunningValue.PartyID.id + ". " + RunningValue.PartyID.Title : null} </small>
                    <small className="text-success fs-6 fw-bold d-flex justify-content-center">
                        <i className="fad fa-circle align-self-center text-danger pr-2"></i> {`Live ${BatchData.ChickTotal} PC`} </small>
                </div>
                :
                null
            }

            <div className="col-lg-12 h-100">
                <div className="row mx-auto my-3">
                    <div className={`d-flex justify-content-center align-items-center border-bottom`}>
                        <p className="btn text-primary text-center fw-bold fs-4 m-0">
                            <i className="fad fa-clipboard-list-check pr-2"></i>{InvoiceNo === '0' ? "All scales accross the party" : InvoiceNo}</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {
                        Array.isArray(BSData) && BSData.length ? BSData.map((item, i, Data) => (
                            <div className="col-md-3 justify-content-center align-items-center">
                                <table className={`table table-hover table-borderles table-responsive card-1 mx-auto d-table`}>
                                    <thead>
                                        {/* <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th colSpan={4} className="border-top-0 px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">{RunningValue.PartyAgent}</span></th>
                                        </tr> */}
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">SLNo</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Qty</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Weight</span></th>
                                            <th className="border-0 px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Action</span></th>
                                        </tr>
                                    </thead>
                                    {
                                        Array.isArray(item) && item.length ? item.map((value, n, Data) => (
                                            <tbody>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1">{n + 1}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1" >{value.Qty}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark px-2 py-1">{value.Weight}</span> </td>
                                                <td className="border-0 py-0 px-2 text-center">
                                                    <button
                                                        onClick={() => { setScaleItem(value); setDeleteModalShow(true) }}
                                                        className="btn fs-5 py-0 px-2 text-danger text-center text-dark border-0" title="Return">
                                                        <i className="fad fa-trash-alt"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { setScaleItem(value); setUpdateModalShow(true) }}
                                                        className="btn fs-5 py-0 px-2 text-danger text-center text-dark border-0" title="Return">
                                                        <i className="fad fa-inbox-in"></i>
                                                    </button>
                                                </td>
                                            </tbody>
                                        ))
                                            : null
                                    }
                                    <tbody>
                                        <td colSpan="4" className="py-0 px-2"><span className="d-block fs-6 fw-bolder text-center text-dark px-2 py-1">{QtyTotal(item) + " PCS,  " + WeightTotal(item).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span></td>
                                    </tbody>

                                </table>
                            </div>
                        ))
                            : null
                    }
                    {
                        Array.isArray(BSReturnData) && Array.isArray(BSReturnData[0]) && BSReturnData.length && BSReturnData[0].length ? BSReturnData.map((item, i, Data) => (
                            <div className="col-md-3 justify-content-center align-items-center">
                                <table className={`table table-hover table-borderles table-responsive card-1 mx-auto d-table`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "1px solid #DEE2E6" }}>
                                            <th colSpan={4} className="border-top-0 px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Return Birds</span></th>
                                        </tr>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">SLNo</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Qty</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Weight</span></th>
                                            <th className="border-0 px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Action</span></th>
                                        </tr>
                                    </thead>
                                    {
                                        Array.isArray(item) && item.length ? item.map((value, n, Data) => (
                                            <tbody>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1">{n + 1}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1" >{value.Qty}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark px-2 py-1">{value.Weight}</span> </td>
                                                <td className="border-0 py-0 px-2 text-center">
                                                    <button
                                                        onClick={() => { setReturnItem(value); setDeleteModalShow(true) }}
                                                        className="btn fs-5 py-0 px-2 text-danger text-center text-dark border-0" title="Delete Scale">
                                                        <i className="fad fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tbody>
                                        ))
                                            : null
                                    }
                                    <tbody>
                                        <td colSpan="4" className="py-0 px-2"><span className="d-block fs-6 fw-bolder text-center text-dark px-2 py-1">{QtyTotal(item) + " PCS,  " + WeightTotal(item).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span></td>
                                    </tbody>

                                </table>
                            </div>
                        ))
                            : null
                    }
                </div>

                <div className="row mx-auto my-3">
                    <div className={`d-flex justify-content-center align-items-center`}>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{totQT !== undefined ? `Initial Load: ${parseInt(totQT).toLocaleString("en", { minimumFractionDigits: 0 })} Pcs, ${parseFloat(totWT).toLocaleString("en", { minimumFractionDigits: 3 })} KG` : "N/A"}</p>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{Return[0] !== undefined ? `Return: ${Return[0].Qty} Pcs, ${Return[0].Weight} KG` : "N/A"}</p>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{RunningValue !== 0 ? `Total Sell: ${RunningValue.Qty} Pcs, ${RunningValue.Weight} KG` : "N/A"}</p>
                    </div>
                </div>
            </div>

            {
                ScaleItem ?
                    <UpdateModal
                        Item={ScaleItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => SellReportData()}
                        onHide={() => { setScaleItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            }

            {
                ScaleItem ?
                    <DeleteModal
                        MsgHeader={"Delete Scale"}
                        HeaderTitle={"The Scale quantity is " + ScaleItem.Qty + "PCS & weight is " + ScaleItem.Weight + " KG"}
                        Msg={"Are you sure to remove scale?"}
                        show={DeleteModalShow}
                        onDelete={(e) => BirdDelete(e, ScaleItem.id)}
                        onHide={() => { setScaleItem(false); setDeleteModalShow(false); }}
                    /> : null
            }
            {
                ReturnSellItem ?
                    <DeleteModal
                        MsgHeader={"Delete Return Scale"}
                        HeaderTitle={"Return scale quantity is " + ReturnSellItem.Qty + "PCS & weight is " + ReturnSellItem.Weight + " KG"}
                        Msg={"Are you sure to remove return scale?"}
                        show={DeleteModalShow}
                        onDelete={(e) => ReturnScaleDelete(e, ReturnSellItem.id)}
                        onHide={() => { setReturnItem(false); setDeleteModalShow(false); }}
                    /> : null
            }

            {/* </div > */}
            {/* <InfoMessage
                header="Invalid Data"
                body_header="Input data is not valid. Please fill input field correctly."
                body="Please fill all field correctly"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            /> */}
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id,
    BusinessID: props.match.params.bis_id,
    InvoiceNo: props.match.params.inv_no,
    id: props.match.params.inv_id
});

export default connect(mapStateToProps, { logout })(Report);