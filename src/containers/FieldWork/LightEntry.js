import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { LoadMyFarms, BatchPro, SaveDR } from '../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import * as moment from 'moment'
import Select from 'react-select';
import Datepicker from 'react-datepicker';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import { InfoMessage } from "../Modals/ModalForm.js";

let today = new Date();

const LightEntry = ({ display, BatchID, BusinessID, list, setList, scale, sub_scale }) => {
    const initialValue = { value: 0, label: "" };
    const [BatchData, setBatchData] = useState(null)
    const [CSDate, setCSDate] = useState(today)
    const [Age, setAge] = useState(0)
    const [Mort, setMort] = useState("")
    const [Cons, setCons] = useState("")
    const [ABW, setABW] = useState("")
    const [Stock, setStock] = useState(0.000)
    const [TotCons, setTotCons] = useState(0.000)
    const [EntryType, setEntryType] = useState(null)
    const [Remark, setRemark] = useState("")
    const [InfoModalShow, setInfoModalShow] = useState(false)
    const [DateModalShow, setDateModalShow] = useState(false)
    const [ABWModalShow, setABWModalShow] = useState(false)
    const [StockModal, setStockModal] = useState(false)
    const [Error, setError] = useState({});
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms();
    }, [])

    const MyFarms = async () => {
        setCons(0.00);
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var BatchDetials = await BatchPro(BatchID);
        if (BatchDetials !== true) {
            setBatchData(BatchDetials);
            setStock(BatchDetials.StockFeed)
            setTotCons(BatchDetials.Cons)
            setAge(CalculateAge(BatchDetials.IssueDate));
        } else {
            history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SendDR = async (event) => {
        event.preventDefault();
        if (CSDate === null || Age < 0 || Mort === "" || Cons === "" || EntryType === null) {
            setInfoModalShow(true)
        } else if ((ABW === null || ABW === "") & [6, 13, 20, 27, 34, 41].includes(Age)) {
            setABWModalShow(true)
        } else {
            var data = moment(CSDate).format('YYYY-MM-DD')
            const result = await SaveDR(data, Age, BusinessID, BatchID, Mort, Cons, ABW, parseFloat(Stock), EntryType.label, Remark);

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

                } else {
                    MyFarms();
                    setCSDate(today);
                    setMort("");
                    setEntryType(null);
                    setRemark("");

                    // ConsHandler();
                    setList([...list, toastProperties = {
                        id: 1,
                        title: 'Success',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: successIcon
                    }])
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to add daily record. Please try again later",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }

    const CalculateAge = (DOB) => {
        let today = new Date();
        let BirthDate = new Date(DOB);
        let tod = today.getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = days_diff - 1;
        return age;
    }

    const DateHandler = (e) => {
        let IssueDate = new Date(BatchData.IssueDate).getTime();
        let EntryDate = new Date(e).getTime();
        if (EntryDate > IssueDate) {
            let diff = EntryDate - IssueDate;
            let days_diff = Math.floor((diff % 31556736000) / 86400000);
            let age = days_diff;
            setCSDate(e);
            setAge(age);
        } else {
            setDateModalShow(true)
        }
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

    const ConsHandler = () => {
        let stock = parseFloat(Stock) - parseFloat(Cons);
        let tot_cons = parseFloat(TotCons) + parseFloat(Cons);
        if (stock < 0) {
            setStockModal(true);
        } else {
            setStock(Cons ? stock : BatchData.StockFeed);
            setTotCons(Cons ? tot_cons : BatchData.Cons);
        }
    }

    const history = useHistory();

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            {BatchData ?
                <div className="header mb-2">
                    <p className="display-6 d-flex justify-content-center m-0"> {BatchData.Title}</p>
                    <small className="text-muted fs-5 fw-bold d-flex justify-content-center">{`Batch No- ${BatchData.BatchNo}, Batch ID- ${BatchData.id}, Farm ID- ${BatchData.BusinessID}`} </small>
                    <small className="text-success fs-6 fw-bold d-flex justify-content-center">{`Issued- ${moment(BatchData.IssueDate).format("DD MMM YYYY")} & Age ${Age} Days`} </small>
                    {
                        Array.isArray(BatchData.Chicks) && BatchData.Chicks.length ? BatchData.Chicks.map((item, i) => (
                            <p className="fs-6 d-flex justify-content-center m-0"> {(i + 1) + ". " + item}</p>
                        ))
                            : null
                    }
                    <small className="text-success fs-6 fw-bold d-flex justify-content-center"><i className="fad fa-circle align-self-center text-danger pr-2"></i> {`Live ${BatchData.ChickTotal} PC`} </small>
                </div>
                :
                null
            }

            <div className="col-lg-12 h-100 ">
                <div className="row mx-auto mt-2">
                    <div className={`d-flex justify-content-center align-items-center border-bottom`}>
                        <Link to={`${scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ? "/field_monitoring" : "/fwr_fields"}`} className="btn text-primary text-center fw-bolder fs-5"><i className="fad fa-home pr-2"></i>Go to home</Link>
                    </div>
                </div>

                <div className="row justify-content-center align-items-center mt-3 mb-3 m-0 p-0">
                    <div className={`d-flex justify-content-center align-items-center p-0`}>
                        <p className='fs-5 fw-bold text-dark px-1 m-0 border-right bg-white'>{BatchData ? BatchData.LastFeed ? BatchData.FeedTotal + " (" + moment(BatchData.LastFeed).format("DD MMM YYYY") + ")" : BatchData.FeedTotal + " (No Date)" : "0.000"}</p>
                        <p className='fs-5 fw-bold text-dark px-1 m-0 bg-white'>{parseFloat(Stock).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "/" + parseFloat(TotCons).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG"}</p>
                    </div>
                    {/* BatchData ? BatchData.StockFeed.toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "/" + BatchData.Cons.toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" :  */}
                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <Datepicker
                            selected={CSDate}
                            className="form-control border-0 rounded text-center text-dark fw-bolder fs-2 mx-auto"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => DateHandler(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Please select date"
                            disabled={scale === 6 || (scale === 3 && (sub_scale === 6 || sub_scale === 7 || sub_scale === 9 || sub_scale === 10)) ? false : true}
                        />
                    </div>

                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <div className="input-group">
                            <input
                                type="numeric"
                                className="form-control border-0 rounded text-center text-dark fw-bolder fs-2 mx-auto"
                                placeholder="Mortality"
                                value={Mort}
                                onChange={(e) => setMort(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <div className="input-group">
                            <input
                                type="numeric"
                                className="form-control border-0 text-center text-dark fw-bolder fs-2 mx-auto"
                                placeholder="Consumption"
                                value={Cons}
                                onChange={(e) => setCons(e.target.validity.valid ? e.target.value : 0.000)}
                                onBlur={(e) => ConsHandler()}
                            />
                        </div>
                    </div>
                    {
                        BatchData ? [6, 13, 20, 27, 34, 41].includes(Age) ?
                            <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border-0 text-center text-dark fw-bolder fs-2 mx-auto"
                                        placeholder="Average Weight"
                                        value={ABW}
                                        onChange={(e) => setABW(e.target.value)}
                                    />
                                </div>
                            </div>
                            : null : null}
                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2 align-items-center">
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            options={[{ value: 0, label: "From farm" }, { value: 1, label: "From office" }, { value: 2, label: "From home" }, { value: 3, label: "Over the phone" }]}
                            name="Percent"
                            placeholder={"Please select entry from"}
                            styles={CScolourStyles}
                            value={EntryType ? EntryType : ""}
                            onChange={(e) => setEntryType(e)}
                            required
                            id="Percent"
                        />
                    </div>
                    <div className="col-lg-4 col-lg-offset-4 mt-2 px-2">
                        <div className="input-group">
                            <textarea
                                rows="1"
                                className="form-control border-0 text-center text-dark fs-6 mx-auto"
                                placeholder="Remark"
                                value={Remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-end mt-4 m-0 p-0">
                    <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 mt-3" onClick={(e) => SendDR(e)}><i className="fad fa-check"></i></button>
                </div>
            </div >
            <InfoMessage
                header={InfoModalShow ? "Invalid Data" : DateModalShow ? "Invalid Date!" : ABWModalShow ? "ABW Empty" : StockModal ? "Stock Feed Negative" : null}
                body_header={InfoModalShow ? "Input data is not valid. Please fill input field correctly." : DateModalShow ? "You can not daily record before issue date." : ABWModalShow ? "Plese fill Average Body Weight field." : StockModal ? "Stock can not entry negative value" : null}
                body={InfoModalShow ? "Please fill all field correctly" : DateModalShow ? "Please select date after issue date." : ABWModalShow ? "Please type average body weight" : StockModal ? "Please calculate the consumption properly" : null}
                show={InfoModalShow || DateModalShow || ABWModalShow || StockModal}
                onHide={() => { setInfoModalShow(false); setDateModalShow(false); setABWModalShow(false); setStockModal(false) }}
            />
            {/* <InfoMessage
                header="Invalid Date!"
                body_header="You can not daily record before issue date."
                body="Please select date after issue date."
                show={DateModalShow}
                onHide={() => setDateModalShow(false)}
            /> */}
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id,
    BusinessID: props.match.params.bis_id,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { logout })(LightEntry);