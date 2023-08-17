
import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { LoadMyFarms, BatchPro, SaveScale, SellRunningTotal, ParkedBatchPro, ScaleReturn } from '../../../actions/ContractAPI';
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
import { InfoMessage } from "../../Modals/ModalForm";

let today = new Date();

const BirdSellReturn = ({ display, BatchID, BusinessID, InvoiceNo, InvoiceID, list, setList }) => {
    const initialValue = { value: 0, label: "" };

    const [Wait, setWait] = useState(false)
    const [BatchData, setBatchData] = useState(null)
    const [CSDate, setCSDate] = useState(today)
    const [Pices, setPices] = useState("")
    const [Weight, setWeight] = useState("")
    const [InfoModalShow, setInfoModalShow] = useState(false)
    const [RunningValue, setRunningValue] = useState(0)

    const [Error, setError] = useState({});
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms();
    }, [])

    window.onbeforeunload = () => {
        return false;
    }

    const MyFarms = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var BatchDetials = await ParkedBatchPro(BatchID);
        if (BatchDetials !== true) {
            setBatchData(BatchDetials);
            RunningTotal();
        } else {
            history.push('/fields');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const SendScale = async () => {
        if (Pices !== "" && Weight !== "") {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setWait(true);
            const result = await ScaleReturn(BatchID, InvoiceID, Pices, Weight);
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
                        title: 'Invalid Data',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: warningIcon
                    }])
                    setWait(false);
                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: 'Success',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: successIcon
                    }])
                    setWeight("");
                    RunningTotal();
                    setWait(false);
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to return scale. Please try again later",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                setWait(false);
            }
            setWait(false);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            setWait(false);
            setInfoModalShow(true);
        }
    }

    const RunningTotal = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var Running = await SellRunningTotal(InvoiceID);
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

    const history = useHistory();


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            {BatchData ?
                <div className="header mb-2">
                    <p className="display-6 d-flex justify-content-center m-0"> {RunningValue.PartyAgent}</p>
                    <small className="text-muted fs-5 fw-bold d-flex justify-content-center">{RunningValue.PartyID ? RunningValue.PartyID.id + ". " + RunningValue.PartyID.Title : null} </small>

                    <small className="text-success fs-6 fw-bold d-flex justify-content-center">Birds Return to</small>
                    <p className="display-6 d-flex justify-content-center m-0"> {BatchData.Title}</p>
                    <small className="text-muted fs-5 fw-bold d-flex justify-content-center">{`Batch No- ${BatchData.BatchNo}, Batch ID- ${BatchData.id}, Farm ID- ${BatchData.BusinessID}`} </small>

                </div>
                :
                null
            }

            <div className="col-lg-12 h-100">
                <div className="row mx-auto mt-3">
                    <div className={`d-flex justify-content-center align-items-center border-bottom`}>
                        <p className="btn text-primary text-center fw-bolder fs-5 m-0">
                            <i className="fad fa-clipboard-list-check pr-2"></i>{InvoiceNo}</p>
                    </div>
                </div>


                <div className="row justify-content-center align-items-center mt-3 m-0 p-0">
                    <div className={`d-flex justify-content-center align-items-center p-0`}>
                        <p className='fs-4 fw-bolder text-dark px-2 m-0 bg-white rounded border'>{RunningValue !== 0 ? `${RunningValue.Qty} PCS & Weight ${RunningValue.Weight}` : "N/A"}</p>
                    </div>

                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <Datepicker
                            selected={CSDate}
                            className="form-control border-0 rounded text-center text-dark fw-bolder fs-2 mx-auto"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => setCSDate(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Please select date"
                        />
                    </div>

                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control border-0 rounded text-center text-dark fw-bolder fs-2 mx-auto"
                                placeholder="Pices"
                                value={Pices}
                                onChange={(e) => setPices(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control border-0 text-center text-dark fw-bolder fs-2 mx-auto"
                                placeholder="Weight"
                                value={Weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3 m-0 p-0">
                    <button disabled={Wait}
                        className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2" onClick={() => SendScale()}><i className="fad fa-check"></i></button>
                </div>
            </div >
            <InfoMessage
                header="Invalid Data"
                body_header="Input data is not valid. Please fill input field correctly."
                body="Please fill all field correctly"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            />
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id,
    BusinessID: props.match.params.bis_id,
    InvoiceNo: props.match.params.inv_no,
    InvoiceID: props.match.params.inv_id
});

export default connect(mapStateToProps, { logout })(BirdSellReturn);