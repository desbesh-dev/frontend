import React, { useEffect, useState, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as moment from 'moment'
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { SaveBirdSell, FetchPartyInvoiceNo, LeftBird } from '../../../actions/ContractAPI';
import { checkToken } from '../../../actions/auth';
import { useSelector, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { BusinessType } from '../../../actions/APIHandler';
import axios from 'axios';

export const SellSummerizeModal = (props) => {
    const { scale, sub_scale } = useSelector((state) => state.auth);

    const [Error, setError] = useState({});
    const [CSDate, setCSDate] = useState(new Date(props.Data.Date));
    const [InvoiceNo, setInvoiceNo] = useState(props.Data.InvoiceNo);
    const [PartyAgent, setPartyAgent] = useState(props.Data.PartyAgent);
    const [Qty, setQty] = useState(props.Data.Qty);
    const [Weight, setWeight] = useState(props.Data.Weight);
    const [Rate, setRate] = useState(props.Data.Rate);
    const [Amount, setAmount] = useState(props.Data.Rate && props.Data.Weight ? parseFloat(props.Data.Rate) * parseFloat(props.Data.Weight) : 0.00);
    const [VatRate, setVatRate] = useState(props.Data.VatRate);
    const [Vat, setVat] = useState(props.Data.Vat);
    const [GrandTotal, setGrandTotal] = useState(props.Data.GrandTotal);
    const [PaidAmount, setPaidAmount] = useState(props.Data.PaidAmount);
    const [Due, setDue] = useState(props.Data.Due);
    const [Discount, setDiscount] = useState(props.Data.Discount);
    const [StockQty, setStockQty] = useState(props.Data.StockQty);
    const [StockWeight, setStockWeight] = useState(props.Data.StockWeight);
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();

    useEffect(() => {
        if (Amount !== null && Amount !== "" && Amount !== 'undefined')
            InitCalc();
    }, [])

    const SellSummery = async () => {
        const result = await LeftBird(props.Data.InvoiceNo, Rate, StockQty, StockWeight, VatRate, Vat, Discount, Number(GrandTotal).toFixed(2), Number(PaidAmount).toFixed(2), Number(Due).toFixed(2));

        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid props.item',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to set stock. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setStockQty(0);
        setStockWeight(0.000);
        setVatRate(0.00);
        setPaidAmount(0.00);
        setDiscount(0.00);
        setError({});
        props.onReload();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const StockQtyCalc = (e) => {
        setStockQty(e.target.value);
        if (props.Data.Weight !== null && props.Data.Weight !== "" && props.Data.qty !== null && props.Data.qty !== "") {
            let avg_wt = parseFloat(props.Data.Weight) / parseFloat(props.Data.Qty)
            let stock_wt = parseFloat(avg_wt) * e.target.value
            setStockWeight(parseFloat(stock_wt).toFixed(3));
        }
        InitCalc();
    }

    const RateCale = (e) => {
        if (Amount !== null && Amount !== "" && Amount !== 'undefined') {
            let price = props.Data.Weight ? e.target.value * parseFloat(props.Data.Weight) : 0.00
            setAmount(price)
            setRate(e.target.value);
            setGrandTotal(price);
            setVat(0);
            setDiscount(0.00);
            setDue(PaidAmount - price);
        } else if (Amount === "") {
            setGrandTotal(0.00);
        }
    }

    const VatCalc = (e) => {
        setVatRate(e.target.value);
        if (Amount !== null && Amount !== "" && Amount !== 'undefined') {
            let vat = (parseFloat(Amount) * parseFloat(e.target.value)) / 100
            if (vat) {
                setVat(vat);
                setGrandTotal((vat + Amount) - Discount);
                let due = (vat + Amount) - Discount - PaidAmount;
                setDue(due);
            } else {
                setGrandTotal(Amount - Discount);
                setVat(0.00);
                let due = Amount - Discount - PaidAmount;
                setDue(due);
            }

            // InitCalc();
        }
    }

    const DiscountCalc = (e) => {
        setDiscount(e.target.value);
        if (GrandTotal !== null && GrandTotal !== "" && GrandTotal !== 'undefined') {
            let disc = (parseFloat(Amount) + parseFloat(Vat)) - e.target.value
            setGrandTotal(disc);
            let due = disc - PaidAmount;
            setDue(due);
        } else {
            // setGrandTotal(Amount + Vat);
        }
        // InitCalc();
    }

    const DueCalc = (e) => {
        setPaidAmount(e.target.value);
        if (GrandTotal !== null && GrandTotal !== "" && GrandTotal !== 'undefined') {
            let due = (parseFloat(Amount) + parseFloat(Vat)) - Discount - e.target.value
            setDue(due);
        } else {
            setDue(0.00);
        }
    }

    const InitCalc = () => {
        let grnd_total = (parseFloat(Amount) + parseFloat(Vat)) - Discount;
        setGrandTotal(grnd_total);
        let due = grnd_total - PaidAmount;
        setDue(due);
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => props.onHide()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Sell Summerization</span>
                        <small className="text-center px-0">(*) Mark field are mandatory</small>
                        <form>
                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">Invoice No</label>
                                <input
                                    type="Parent Account"
                                    class="form-control fw-bold"
                                    value={InvoiceNo}
                                    disabled
                                />
                                {Error.InvoiceNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">Date</label>
                                <Datepicker
                                    selected={CSDate}
                                    className="form-control fw-bold"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setCSDate(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Please select date"
                                    disabled
                                />
                                {Error.Date ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Date}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Agent Name</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="PartyAgent"
                                    name="PartyAgent"
                                    placeholder='Agent Name'
                                    value={PartyAgent}
                                    onChange={e => setPartyAgent(e.target.value)}
                                    disabled
                                />
                                {Error.PartyAgent ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PartyAgent}</small></p>
                                    : null}
                            </div>


                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100 w-100">
                                    <label for="message-text" class="col-form-label p-0">Quantity</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="Qty"
                                        name="Qty"
                                        placeholder='Quantity'
                                        value={parseInt(Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })}
                                        // onChange={e => setQty(e.target.value)}
                                        disabled
                                    />
                                    {Error.Qty ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100 w-100">
                                    <label for="message-text" class="col-form-label p-0">Weight</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="Weight"
                                        name="Weight"
                                        placeholder='Weight'
                                        value={parseFloat(Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                        // onChange={e => setWeight(e.target.value)}
                                        disabled
                                    />
                                    {Error.Weight ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                        : null}
                                </div>
                            </div>


                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">* Stock Qty</label>
                                    <input
                                        type="number"
                                        class="form-control fw-bold"
                                        id="StockQty"
                                        name="StockQty"
                                        placeholder='Stock Qty'
                                        value={StockQty}
                                        onChange={e => StockQtyCalc(e)}
                                    />
                                    {Error.StockQty ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.StockQty}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">* Stock Weight</label>
                                    <input
                                        type="text"
                                        class="form-control fw-bold"
                                        id="StockWeight"
                                        name="StockWeight"
                                        placeholder='Stock Weight'
                                        value={StockWeight.toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                        onChange={e => setStockWeight(e.target.value)}
                                    />
                                    {Error.StockWeight ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.StockWeight}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Rate</label>
                                    <input
                                        type="number"
                                        class="form-control fw-bold"
                                        id="Rate"
                                        name="Rate"
                                        placeholder='Rate'
                                        value={Rate}
                                        onChange={e => RateCale(e)}
                                        disabled={scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ? false : true}
                                    />
                                    {Error.Rate ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Amount</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="Amount"
                                        name="Amount"
                                        placeholder='Amount'
                                        value={parseFloat(Amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                        // onChange={e => setAmount(e.target.value)}
                                        disabled
                                    />
                                    {Error.Amount ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Amount}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Vat Rate</label>
                                    <input
                                        type="number"
                                        class="form-control fw-bold"
                                        id="VatRate"
                                        name="VatRate"
                                        placeholder='Vat Rate'
                                        value={parseFloat(VatRate.toLocaleString("en-BD", { minimumFractionDigits: 2 }))}
                                        onChange={e => VatCalc(e)}
                                    />
                                    {Error.VatRate ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.VatRate}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Vat</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="Vat"
                                        name="Vat"
                                        placeholder='Vat'
                                        value={parseFloat(Vat).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                        // onChange={e => setDue(e.target.value)}
                                        disabled
                                    />
                                    {Error.Vat ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Vat}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Discount</label>
                                    <input
                                        type="number"
                                        class="form-control fw-bold"
                                        id="Discount"
                                        name="Discount"
                                        placeholder='Discount'
                                        value={parseFloat(Discount.toLocaleString("en-BD", { minimumFractionDigits: 2 }))}
                                        onChange={e => DiscountCalc(e)}
                                    />
                                    {Error.Discount ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Discount}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Grand Total</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="GrandTotal"
                                        name="GrandTotal"
                                        placeholder='GrandTotal'
                                        value={parseFloat(GrandTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                        // onChange={e => setDue(e.target.value)}
                                        disabled
                                    />
                                    {Error.GrandTotal ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GrandTotal}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className="form-group d-flex">
                                <div className="row pr-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">* Paid</label>
                                    <input
                                        type="number"
                                        class="form-control fw-bold"
                                        id="PaidAmount"
                                        name="PaidAmount"
                                        placeholder='Paid'
                                        value={parseFloat(PaidAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 }))}
                                        onChange={e => DueCalc(e)}
                                    />
                                    {Error.PaidAmount ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PaidAmount}</small></p>
                                        : null}
                                </div>
                                <div className="row pl-1 m-0 w-100">
                                    <label for="message-text" class="col-form-label p-0">Due</label>
                                    <input
                                        type="numeric"
                                        class="form-control fw-bold"
                                        id="Due"
                                        name="Due"
                                        placeholder='Due'
                                        value={parseFloat(Due).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                        // onChange={e => DueCalc(e)}
                                        disabled
                                    />
                                    {Error.Due ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Due}</small></p>
                                        : null}
                                </div>
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => props.onHide()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SellSummery()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const CreateModal = (props) => {
    const [Error, setError] = useState({});
    const [PartyList, setPartyList] = useState(false);
    const [CSDate, setCSDate] = useState(null);
    const [RepName, setRepName] = useState(null);
    const [RepID, setRepID] = useState(null);
    const [InvoiceNo, setInvoiceNo] = useState(null);
    const [Rate, setRate] = useState(null);
    const [Party, setParty] = useState(null);
    const [PartyAgent, setPartyAgent] = useState(null);
    const [CarNo, setCarNo] = useState(null);
    const [Driver, setDriver] = useState(null);
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        LoadInvoiceNo();
        LoadRep();
        FetchParty();
    }, [])

    const LoadRep = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setRepLists(res.data.Rep);

        } catch (err) {
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyInvoiceNo(props.GodownID ? 'GS' : 'BS');

        if (result !== true) {
            setInvoiceNo(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const FetchParty = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await BusinessType(3);
        if (result !== true) {
            setPartyList(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SendBirdSell = async () => {
        var data = moment(CSDate).format('YYYY-MM-DD')
        const result = await SaveBirdSell(props.GodownID, props.BusinessID, props.BatchID, data, InvoiceNo, Rate, Party, PartyAgent, CarNo, Driver, RepID);
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid props.item',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                LoadInvoiceNo();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to party initialization. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setRepName(null);
        setRepID(null);
        setCSDate(null);
        setInvoiceNo(null);
        setRate(null);
        setParty(null);
        setPartyAgent(null);
        setCarNo(null);
        setDriver(null);
        setError({});
        LoadInvoiceNo();
        props.onHide();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Party Initialization</span>
                        <small className="text-center px-0">(*) Mark field are mandatory</small>
                        <form>
                            <div className="form-group">
                                <label for="recipient-name" class="col-form-label">Representative</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={RepLists}
                                    name="RepName"
                                    placeholder={"Select rep. name"}
                                    styles={CScolourStyles}
                                    value={RepName ? { label: RepName } : null}
                                    onChange={e => { setRepName(e.label); setRepID(e.value) }}
                                    required
                                    id="Rep"
                                />
                                {Error.RepID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">* Invoice No</label>
                                <input
                                    type="Parent Account"
                                    class="form-control fw-bold"
                                    value={InvoiceNo}
                                    disabled
                                />
                                {Error.InvoiceNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">* Date</label>
                                <Datepicker
                                    selected={CSDate}
                                    className="form-control fw-bold"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setCSDate(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Please select date"
                                />
                                {Error.InvoiceNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Rate</label>
                                <input
                                    type="number"
                                    class="form-control fw-bold"
                                    id="Rate"
                                    name="Rate"
                                    placeholder='Sell Rate'
                                    value={Rate}
                                    onChange={e => setRate(e.target.value)}
                                />
                                {Error.Rate ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Party</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={PartyList.BisList}
                                    name="Party"
                                    placeholder={"Select party"}
                                    styles={CScolourStyles}
                                    value={Party ? Party : null}
                                    onChange={e => setParty(e)}
                                    isClearable={true}
                                    id="Party"
                                />
                                {Error.PartyID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PartyID}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">* Party Agent Name</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="PartyAgent"
                                    name="PartyAgent"
                                    placeholder='Agent Name'
                                    value={PartyAgent}
                                    onChange={e => setPartyAgent(e.target.value)}
                                />
                                {Error.PartyAgent ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PartyAgent}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Car No</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="CarNo"
                                    name="CarNo"
                                    placeholder='Car No'
                                    value={CarNo}
                                    onChange={e => setCarNo(e.target.value)}
                                />
                                {Error.CarNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CarNo}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Driver Name</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Driver"
                                    name="Driver"
                                    placeholder='Driver Name'
                                    value={Driver}
                                    onChange={e => setDriver(e.target.value)}
                                />
                                {Error.Driver ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Driver}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendBirdSell()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const SellModal = (props) => {
    const { scale, sub_scale } = useSelector((state) => state.auth);
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => props.onHide()} />
                </div>
                <div className="justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        {Array.isArray(props.Data) && props.Data.length ?
                            <>
                                <div className="text-center">
                                    <p className="fs-4 border-bottom fw-bolder text-dark text-center text-uppercase m-0 mb-2">Sells & Initialize History</p>
                                    {scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ?
                                        <button className="btn fs-4 fw-bold text-center text-success my-1" onClick={() => props.Create()}>
                                            <i class="fad fa-sign-in-alt pr-2"></i>New Party Initializaton</button> : null}
                                </div>
                                {props.Data.map((item, i) => (
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <table className={`table table-borderless table-responsive border w-auto`} style={{ borderRadius: "15px" }}>
                                            <tbody className={`mx-auto d-table ${!item.Status ? 'text-muted' : 'text-dark'}`}>
                                                <tr className="border-bottom text-center">
                                                    <td colSpan={2} className="p-0">
                                                        <Link Title="Click to bird sell" to={item.GodownID ? `/fwr_bird_sell_gd/${item.GodownID}/${item.InvoiceNo}/${item.id}` : `/fwr_bird_sell/${item.BusinessID}/${item.BatchID}/${item.InvoiceNo}/${item.id}`}
                                                            className={`d-block fs-4 fw-bolder text-uppercase text-center px-1 py-1 ${!item.Status ? 'text-muted' : 'text-dark'}`}>{item.InvoiceNo}</Link>
                                                    </td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Agent</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bolder text-left px-1">{item.PartyAgent}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Date</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Party ID</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{!item.Status ? "N/A" : item.PartyID ? item.PartyID.id + ". " + item.PartyID.Title : "N/A"}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Sell Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{parseInt(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS/{parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}KG</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Price Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">R- {parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 })}/P- {parseFloat(item.GrandTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Stock Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{parseFloat(item.StockQty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS/{parseFloat(item.StockWeight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}KG</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Representative</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{item.SalesMan.Details[0].FullName}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Status</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{item.Status === 1 ? "On Loading" : item.Status === 3 ? "Loaded" : "N/A"}</span></td>
                                                </tr>
                                                <tr className="text-center text-white">
                                                    <td colSpan={2} className="py-2 px-1">
                                                        {
                                                            scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ?
                                                                <button style={{ borderRadius: "15px" }} Title="Remove Initialization" onClick={() => props.onRemove(item)} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Remove</button>
                                                                : null
                                                        }
                                                        {
                                                            item.Status ?
                                                                <>
                                                                    <button style={{ borderRadius: "15px" }} Title="Sell Summerization" onClick={() => props.onStock(item)} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Summerize</button>
                                                                    <Link style={{ borderRadius: "15px" }} Title="Sell Report" to={`/fwr_sell_report/${item.BusinessID}/${item.BatchID}/${item.InvoiceNo}/${item.id}`} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Report</Link>
                                                                    <Link style={{ borderRadius: "15px" }} Title="Return" to={`/fwr_bird_sell_return/${item.BusinessID}/${item.BatchID}/${item.InvoiceNo}/${item.id}`} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase px-2 mx-1"><i className="fad fa-inbox-in"></i></Link>
                                                                </>
                                                                : null

                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </>
                            :
                            <div className="text-center">
                                <p className="fs-4 border-bottom fw-bolder text-dark text-center text-uppercase m-0 mb-2">Sells & Initialize History</p>
                                <p className="fs-6 fw-normal text-center py-2">No sell information found</p>
                                {scale === 6 || (scale === 3 && (sub_scale === 5 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ?
                                    <button className="btn fs-4 fw-bold text-center text-success my-1" onClick={() => props.Create()}>
                                        <i class="fad fa-sign-in-alt pr-2"></i>New Party Initializaton</button> : null}
                            </div>
                        }
                        <div className='d-flex justify-content-around align-items-center'>
                            {
                                props.Godown ?
                                    <button className="btn text-right w-auto" onClick={() => props.onGodown()}><i class="fad fa-external-link"></i> Transfer</button>
                                    :
                                    null
                            }
                            <button className="btn text-right w-auto" onClick={props.onHide}><i class="fad fa-times pr-2"></i> Close</button>
                        </div>
                    </div>

                </div>
            </Modal.Body>

        </Modal >
    );
}

export const DeleteModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.MsgHeader}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.HeaderTitle}</h4>
                <p>{props.Msg}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.onDelete}>
                    Delete
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>

            </Modal.Footer>
        </Modal>
    );
}
