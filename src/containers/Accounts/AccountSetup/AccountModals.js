import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../actions/auth';
import { BranchAcc, FetchBranch } from '../../../actions/APIHandler';
import { FetchAccounts, getLabel } from '../../../actions/ContractAPI';

import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const UpdateModal = (props) => {

    const initialValue = { value: 0, label: "" };
    const [Accounts, setAccounts] = useState(initialValue);

    const [CashAC, setCashAC] = useState(props.Item.CashAC ? { label: props.Item.CashAC, value: parseInt(props.Item.CashAC_ID) } : false)
    const [SellAC, setSellAC] = useState(props.Item.SellAC ? { label: props.Item.SellAC, value: parseInt(props.Item.SellAC_ID) } : false)
    const [PurchaseAC, setPurchaseAC] = useState(props.Item.PurchaseAC ? { label: props.Item.PurchaseAC, value: parseInt(props.Item.PurchaseAC_ID) } : false)
    const [PayableAC, setPayableAC] = useState(props.Item.PayableAC ? { label: props.Item.PayableAC, value: parseInt(props.Item.PayableAC_ID) } : false)
    const [ReceivableAC, setReceivableAC] = useState(props.Item.ReceivableAC ? { label: props.Item.ReceivableAC, value: parseInt(props.Item.ReceivableAC_ID) } : false)
    const [StockAC, setStockAC] = useState(props.Item.StockAC ? { label: props.Item.StockAC, value: parseInt(props.Item.StockAC_ID) } : false)
    const [BatchSellAC, setBatchSellAC] = useState(props.Item.BatchSellAC ? { label: props.Item.BatchSellAC, value: parseInt(props.Item.BatchSellAC_ID) } : false)
    const [ProductSentAC, setProductSentAC] = useState(props.Item.ProductSentAC ? { label: props.Item.ProductSentAC, value: parseInt(props.Item.ProductSentAC_ID) } : false)

    const [BatchPaymentAC, setBatchPaymentAC] = useState(props.Item.BatchPaymentAC ? { label: props.Item.BatchPaymentAC, value: parseInt(props.Item.BatchPaymentAC_ID) } : false)
    const [BatchPaymentPayableAC, setBatchPaymentPayableAC] = useState(props.Item.BatchPaymentPayableAC ? { label: props.Item.BatchPaymentPayableAC, value: parseInt(props.Item.BatchPaymentPayableAC_ID) } : false)
    const [SavingPaymentAC, setSavingPaymentAC] = useState(props.Item.SavingPaymentAC ? { label: props.Item.SavingPaymentAC, value: parseInt(props.Item.SavingPaymentAC_ID) } : false)
    const [SavingPaymentPayableAC, setSavingPaymentPayableAC] = useState(props.Item.SavingPaymentPayableAC ? { label: props.Item.SavingPaymentPayableAC, value: parseInt(props.Item.SavingPaymentPayableAC_ID) } : false)

    const [Next, setNext] = useState(false)
    const [Error, setError] = useState({});
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();


    useEffect(() => {
        LoadAcc();
    }, [])

    const PropLoadSet = () => {
        setCashAC(false);
        setSellAC(false);
        setPurchaseAC(false);
        setPayableAC(false);
        setReceivableAC(false);
        setBatchSellAC(false);
        setProductSentAC(false);
        setStockAC(false);
        setBatchPaymentAC(false);
        setBatchPaymentPayableAC(false);
        setSavingPaymentAC(false);
        setSavingPaymentPayableAC(false);
        props.onHide();
    }

    const LoadAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchAccounts();

        if (result !== true) {
            setAccounts(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CallUpdateAcc = async () => {
        const Cash = CashAC.value === undefined ? parseInt(props.Item.CashAC_ID) ? CashAC : "" : CashAC.value
        const Sell = SellAC.value === undefined ? parseInt(props.Item.SellAC_ID) ? SellAC : "" : SellAC.value
        const Purchase = PurchaseAC.value === undefined ? parseInt(props.Item.PurchaseAC_ID) ? PurchaseAC : "" : PurchaseAC.value
        const Payable = PayableAC.value === undefined ? props.Item.PayableAC_ID ? PayableAC : "" : PayableAC.value
        const Receivable = ReceivableAC.value === undefined ? props.Item.ReceivableAC_ID ? ReceivableAC : "" : ReceivableAC.value
        const BatchSell = BatchSellAC.value === undefined ? parseInt(props.Item.BatchSellAC_ID) ? BatchSellAC : "" : BatchSellAC.value
        const ProductSent = ProductSentAC.value === undefined ? parseInt(props.Item.ProductSentAC_ID) ? ProductSentAC : "" : ProductSentAC.value
        const Stock = StockAC.value === undefined ? parseInt(props.Item.StockAC_ID) ? StockAC : "" : StockAC.value

        const BatchPayment = BatchPaymentAC.value === undefined ? props.Item.BatchPaymentAC_ID ? BatchPaymentAC : "" : BatchPaymentAC.value
        const BatchPaymentPayable = BatchPaymentPayableAC.value === undefined ? parseInt(props.Item.BatchPaymentPayableAC_ID) ? BatchPaymentPayableAC : "" : BatchPaymentPayableAC.value
        const SavingPayment = SavingPaymentAC.value === undefined ? parseInt(props.Item.SavingPaymentAC_ID) ? SavingPaymentAC : "" : SavingPaymentAC.value
        const SavingPaymentPayable = SavingPaymentPayableAC.value === undefined ? parseInt(props.Item.SavingPaymentPayableAC_ID) ? SavingPaymentPayableAC : "" : SavingPaymentPayableAC.value

        const result = await BranchAcc(Cash, Sell, Purchase, Payable, Receivable, BatchSell, ProductSent, Stock, BatchPayment, BatchPaymentPayable, SavingPayment, SavingPaymentPayable, parseInt(props.Item.BranchID));

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
                props.onReload();
                props.onHide();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update account. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        // dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setNext(false)
        const initialValue = { value: 0, label: "" };
        // setRepLists(initialValue);
        setError({});
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">{props.Item.Name} Branch Account</span>
                        <small className="text-center px-0">Please fill up the desired field to update</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Cash Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="CashAC"
                                    placeholder={"Select sell account"}
                                    styles={CScolourStyles}
                                    value={CashAC ? CashAC : props.Item.CashAC ? { label: props.Item.CashAC, value: parseInt(props.Item.CashAC_ID) } : null}
                                    onChange={e => setCashAC(e)}
                                    required
                                />
                                {Error.CashAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CashAC}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Sell Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SellAC"
                                    placeholder={"Select sell account"}
                                    styles={CScolourStyles}
                                    value={SellAC ? SellAC : props.Item.SellAC ? { label: props.Item.SellAC, value: parseInt(props.Item.SellAC_ID) } : null}
                                    onChange={e => setSellAC(e)}
                                    required
                                />
                                {Error.SellAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SellAC}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Purchase Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="PurchaseAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={PurchaseAC ? PurchaseAC : props.Item.PurchaseAC ? { label: props.Item.PurchaseAC, value: parseInt(props.Item.PurchaseAC_ID) } : null}
                                    onChange={e => setPurchaseAC(e)}
                                    required
                                    id="PurchaseAC"
                                />
                                {Error.PurchaseAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PurchaseAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="PayableAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={PayableAC ? PayableAC : props.Item.PayableAC ? { label: props.Item.PayableAC, value: parseInt(props.Item.PayableAC_ID) } : null}
                                    onChange={e => setPayableAC(e)}
                                    required
                                    id="PayableAC"
                                />
                                {Error.PayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PayableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Receivable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="ReceivableAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={ReceivableAC ? ReceivableAC : props.Item.ReceivableAC ? { label: props.Item.ReceivableAC, value: parseInt(props.Item.ReceivableAC_ID) } : null}
                                    onChange={e => setReceivableAC(e)}
                                    required
                                    id="ReceivableAC"
                                />
                                {Error.ReceivableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ReceivableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Stock Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="StockAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={StockAC ? StockAC : props.Item.StockAC ? { label: props.Item.StockAC, value: parseInt(props.Item.StockAC_ID) } : null}
                                    onChange={e => setStockAC(e)}
                                    required
                                    id="StockAC"
                                />
                                {Error.StockAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.StockAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Bird Sell Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchSellAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={BatchSellAC ? BatchSellAC : props.Item.BatchSellAC ? { label: props.Item.BatchSellAC, value: parseInt(props.Item.BatchSellAC_ID) } : null}
                                    onChange={e => setBatchSellAC(e)}
                                    required
                                    id="BatchSellAC"
                                />
                                {Error.BatchSellAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchSellAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Product Sent Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="ProductSentAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={ProductSentAC ? ProductSentAC : props.Item.ProductSentAC ? { label: props.Item.ProductSentAC, value: parseInt(props.Item.ProductSentAC_ID) } : null}
                                    onChange={e => setProductSentAC(e)}
                                    required
                                    id="ProductSentAC"
                                />
                                {Error.ProductSentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProductSentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Batch Payment Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchPaymentAC"
                                    placeholder={"Select batch payment account"}
                                    styles={CScolourStyles}
                                    value={BatchPaymentAC ? BatchPaymentAC : props.Item.BatchPaymentAC ? { label: props.Item.BatchPaymentAC, value: parseInt(props.Item.BatchPaymentAC_ID) } : null}
                                    onChange={e => setBatchPaymentAC(e)}
                                    required
                                    id="BatchPaymentAC"
                                />
                                {Error.BatchPaymentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchPaymentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Batch Payment Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchPaymentPayableAC"
                                    placeholder={"Select batch payment payable account"}
                                    styles={CScolourStyles}
                                    value={BatchPaymentPayableAC ? BatchPaymentPayableAC : props.Item.BatchPaymentPayableAC ? { label: props.Item.BatchPaymentPayableAC, value: parseInt(props.Item.BatchPaymentPayableAC_ID) } : null}
                                    onChange={e => setBatchPaymentPayableAC(e)}
                                    required
                                    id="BatchPaymentPayableAC"
                                />
                                {Error.BatchPaymentPayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchPaymentPayableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Saving Payment Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SavingPaymentAC"
                                    placeholder={"Select saving payment account"}
                                    styles={CScolourStyles}
                                    value={SavingPaymentAC ? SavingPaymentAC : props.Item.SavingPaymentAC ? { label: props.Item.SavingPaymentAC, value: parseInt(props.Item.SavingPaymentAC_ID) } : null}
                                    onChange={e => setSavingPaymentAC(e)}
                                    required
                                    id="SavingPaymentAC"
                                />
                                {Error.SavingPaymentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SavingPaymentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Saving Payment Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SavingPaymentPayableAC"
                                    placeholder={"Select saving payment payable account"}
                                    styles={CScolourStyles}
                                    value={SavingPaymentPayableAC ? SavingPaymentPayableAC : props.Item.SavingPaymentPayableAC ? { label: props.Item.SavingPaymentPayableAC, value: parseInt(props.Item.SavingPaymentPayableAC_ID) } : null}
                                    onChange={e => setSavingPaymentPayableAC(e)}
                                    required
                                    id="SavingPaymentPayableAC"
                                />
                                {Error.SavingPaymentPayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SavingPaymentPayableAC}</small></p>
                                    : null}
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => { PropLoadSet(); props.onHide() }}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => CallUpdateAcc()}><i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const CreateModal = (props) => {

    const initialValue = { value: 0, label: "" };
    const [Accounts, setAccounts] = useState(initialValue);

    const [BranchList, setBranchList] = useState("")
    const [Branch, setBranch] = useState("")
    const [CashAC, setCashAC] = useState("")
    const [SellAC, setSellAC] = useState("")
    const [PurchaseAC, setPurchaseAC] = useState("")
    const [PayableAC, setPayableAC] = useState("")
    const [ReceivableAC, setReceivableAC] = useState("")
    const [StockAC, setStockAC] = useState("")
    const [BatchSellAC, setBatchSellAC] = useState("")
    const [ProductSentAC, setProductSentAC] = useState("")

    const [BatchPaymentAC, setBatchPaymentAC] = useState("")
    const [BatchPaymentPayableAC, setBatchPaymentPayableAC] = useState("")
    const [SavingPaymentAC, setSavingPaymentAC] = useState("")
    const [SavingPaymentPayableAC, setSavingPaymentPayableAC] = useState("")

    const [Next, setNext] = useState(false)
    const [Error, setError] = useState({});
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();


    useEffect(() => {
        LoadAcc();
        LoadBranches();
    }, [])

    const PropLoadSet = () => {
        setBranch(false);
        setCashAC(false);
        setSellAC(false);
        setPurchaseAC(false);
        setPayableAC(false);
        setReceivableAC(false);
        setBatchSellAC(false);
        setProductSentAC(false);
        setStockAC(false);
        setBatchPaymentAC(false);
        setBatchPaymentPayableAC(false);
        setSavingPaymentAC(false);
        setSavingPaymentPayableAC(false);
        props.onHide();
    }

    const LoadAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchAccounts();

        if (result !== true) {
            setAccounts(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CreateAccount = async () => {
        const Cash = CashAC.value === undefined ? null : CashAC.value
        const Sell = SellAC.value === undefined ? null : SellAC.value
        const Purchase = PurchaseAC.value === undefined ? null : PurchaseAC.value
        const Payable = PayableAC.value === undefined ? null : PayableAC.value
        const Receivable = ReceivableAC.value === undefined ? null : ReceivableAC.value
        const BatchSell = BatchSellAC.value === undefined ? null : BatchSellAC.value
        const ProductSent = ProductSentAC.value === undefined ? null : ProductSentAC.value
        const Stock = StockAC.value === undefined ? null : StockAC.value

        const BatchPayment = BatchPaymentAC.value === undefined ? null : BatchPaymentAC.value
        const BatchPaymentPayable = BatchPaymentPayableAC.value === undefined ? null : BatchPaymentPayableAC.value
        const SavingPayment = SavingPaymentAC.value === undefined ? null : SavingPaymentAC.value
        const SavingPaymentPayable = SavingPaymentPayableAC.value === undefined ? null : SavingPaymentPayableAC.value

        const result = await BranchAcc(Cash, Sell, Purchase, Payable, Receivable, BatchSell, ProductSent, Stock, BatchPayment, BatchPaymentPayable, SavingPayment, SavingPaymentPayable, Branch.value);

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
                PropLoadSet();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update account. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        // dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadBranches = async () => {
        var result = await FetchBranch();
        if (result !== true) {
            setBranchList(result.Branch);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            props.onHide();
        }
    }

    const ClearField = () => {
        setNext(false)
        const initialValue = { value: 0, label: "" };
        // setRepLists(initialValue);
        setError({});
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">{props.Item.Name} Branch Account</span>
                        <small className="text-center px-0">Please fill up the desired field to update</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Branch</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={BranchList}
                                    name="Branch"
                                    placeholder={"Select branch"}
                                    styles={CScolourStyles}
                                    value={Branch}
                                    onChange={e => setBranch(e)}
                                    required
                                />
                                {Error.Branch ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Branch}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Cash Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="CashAC"
                                    placeholder={"Select sell account"}
                                    styles={CScolourStyles}
                                    value={CashAC ? CashAC : props.Item.CashAC ? { label: props.Item.CashAC, value: parseInt(props.Item.CashAC_ID) } : null}
                                    onChange={e => setCashAC(e)}
                                    required
                                />
                                {Error.CashAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CashAC}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Sell Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SellAC"
                                    placeholder={"Select sell account"}
                                    styles={CScolourStyles}
                                    value={SellAC ? SellAC : props.Item.SellAC ? { label: props.Item.SellAC, value: parseInt(props.Item.SellAC_ID) } : null}
                                    onChange={e => setSellAC(e)}
                                    required
                                />
                                {Error.SellAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SellAC}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Purchase Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="PurchaseAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={PurchaseAC ? PurchaseAC : props.Item.PurchaseAC ? { label: props.Item.PurchaseAC, value: parseInt(props.Item.PurchaseAC_ID) } : null}
                                    onChange={e => setPurchaseAC(e)}
                                    required
                                    id="PurchaseAC"
                                />
                                {Error.PurchaseAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PurchaseAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="PayableAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={PayableAC ? PayableAC : props.Item.PayableAC ? { label: props.Item.PayableAC, value: parseInt(props.Item.PayableAC_ID) } : null}
                                    onChange={e => setPayableAC(e)}
                                    required
                                    id="PayableAC"
                                />
                                {Error.PayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PayableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Receivable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="ReceivableAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={ReceivableAC ? PayableAC : props.Item.ReceivableAC ? { label: props.Item.ReceivableAC, value: parseInt(props.Item.ReceivableAC_ID) } : null}
                                    onChange={e => setReceivableAC(e)}
                                    required
                                    id="ReceivableAC"
                                />
                                {Error.ReceivableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ReceivableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Stock Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="StockAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={StockAC ? StockAC : props.Item.StockAC ? { label: props.Item.StockAC, value: parseInt(props.Item.StockAC_ID) } : null}
                                    onChange={e => setStockAC(e)}
                                    required
                                    id="StockAC"
                                />
                                {Error.StockAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.StockAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Bird Sell Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchSellAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={BatchSellAC ? BatchSellAC : props.Item.BatchSellAC ? { label: props.Item.BatchSellAC, value: parseInt(props.Item.BatchSellAC_ID) } : null}
                                    onChange={e => setBatchSellAC(e)}
                                    required
                                    id="BatchSellAC"
                                />
                                {Error.BatchSellAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchSellAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Product Sent Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="ProductSentAC"
                                    placeholder={"Select purchase account"}
                                    styles={CScolourStyles}
                                    value={ProductSentAC ? ProductSentAC : props.Item.ProductSentAC ? { label: props.Item.ProductSentAC, value: parseInt(props.Item.ProductSentAC_ID) } : null}
                                    onChange={e => setProductSentAC(e)}
                                    required
                                    id="ProductSentAC"
                                />
                                {Error.ProductSentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProductSentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Batch Payment Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchPaymentAC"
                                    placeholder={"Select batch payment account"}
                                    styles={CScolourStyles}
                                    value={BatchPaymentAC ? BatchPaymentAC : props.Item.BatchPaymentAC ? { label: props.Item.BatchPaymentAC, value: parseInt(props.Item.BatchPaymentAC_ID) } : null}
                                    onChange={e => setBatchPaymentAC(e)}
                                    required
                                    id="BatchPaymentAC"
                                />
                                {Error.BatchPaymentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchPaymentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Batch Payment Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="BatchPaymentPayableAC"
                                    placeholder={"Select batch payment payable account"}
                                    styles={CScolourStyles}
                                    value={BatchPaymentPayableAC ? BatchPaymentPayableAC : props.Item.BatchPaymentPayableAC ? { label: props.Item.BatchPaymentPayableAC, value: parseInt(props.Item.BatchPaymentPayableAC_ID) } : null}
                                    onChange={e => setBatchPaymentPayableAC(e)}
                                    required
                                    id="BatchPaymentPayableAC"
                                />
                                {Error.BatchPaymentPayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchPaymentPayableAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Saving Payment Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SavingPaymentAC"
                                    placeholder={"Select saving payment account"}
                                    styles={CScolourStyles}
                                    value={SavingPaymentAC ? SavingPaymentAC : props.Item.SavingPaymentAC ? { label: props.Item.SavingPaymentAC, value: parseInt(props.Item.SavingPaymentAC_ID) } : null}
                                    onChange={e => setSavingPaymentAC(e)}
                                    required
                                    id="SavingPaymentAC"
                                />
                                {Error.SavingPaymentAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SavingPaymentAC}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Saving Payment Payable Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="SavingPaymentPayableAC"
                                    placeholder={"Select saving payment payable account"}
                                    styles={CScolourStyles}
                                    value={SavingPaymentPayableAC ? SavingPaymentPayableAC : props.Item.SavingPaymentPayableAC ? { label: props.Item.SavingPaymentPayableAC, value: parseInt(props.Item.SavingPaymentPayableAC_ID) } : null}
                                    onChange={e => setSavingPaymentPayableAC(e)}
                                    required
                                    id="SavingPaymentPayableAC"
                                />
                                {Error.SavingPaymentPayableAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SavingPaymentPayableAC}</small></p>
                                    : null}
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => { PropLoadSet(); props.onHide() }}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => CreateAccount()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}