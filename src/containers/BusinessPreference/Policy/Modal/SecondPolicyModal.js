import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../../actions/auth';
import { SaveCondition, UpdateCondition, SaveSecondCond, FetchAccounts, UpdateOtherCond, OperationList, CurrencyList, ConditionScheme, getLabel } from '../../../../actions/ContractAPI';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

export const SecondModal = (props) => {
    const [Error, setError] = useState({});
    const [Accounts, setAccounts] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        SLNo: "",
        Title: "",
        Rate: "",
        Currency: false,
        Operation: false,
        Times: "",
        Status: "",
        COA_ID: false,
    });
    const { SLNo, Title, Type, Rate, Currency, Operation, COA_ID, Status } = formData;

    useEffect(() => {
        LoadAcc();
    }, [])

    const SendSecondCond = async () => {
        const result = await SaveSecondCond(props.CondID, SLNo, Title, Type ? Type.value : "0", Rate, Currency ? Currency.label : "", COA_ID ? COA_ID.value : "", Status);

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
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Other condition setup failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setFormData({
            SLNo: "",
            Title: "",
            Rate: "",
            Currency: "",
            Operation: "",
            Times: "",
            Status: "",
            COA_ID: "",
        });
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => { ClearField(); props.onHide() }} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Set up conditions</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">S/N</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="SLNo"
                                    name="SLNo"
                                    placeholder='S/N'
                                    value={SLNo}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.SLNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SLNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Chick", value: 1 }, { label: "Feed", value: 2 }, { label: "Medicine", value: 3 }, { label: "Basic", value: 4 }]}
                                    name="Operation"
                                    placeholder={"Condition sub-type"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={(e) => setFormData({ ...formData, Operation: e })}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Rate/Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Rate"
                                    name="Rate"
                                    placeholder='Rate/Value'
                                    value={Rate}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Rate ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={CurrencyList}
                                    name="Currency"
                                    placeholder={"Select currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : null}
                                    onChange={(e) => setFormData({ ...formData, Currency: e })}
                                    required
                                    id="Currency"
                                />

                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Associate Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="COA_ID"
                                    placeholder={"Select account"}
                                    styles={CScolourStyles}
                                    value={COA_ID ? COA_ID : null}
                                    onChange={(e) => setFormData({ ...formData, COA_ID: e })}
                                    required
                                    id="COA_ID"
                                />
                                {Error.COA_ID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_ID}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Active Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: !Status ? true : false })}
                                    />
                                    <label class="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => { ClearField(); props.onHide() }}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendSecondCond()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const SecondUpdateModal = (props) => {
    const [Error, setError] = useState({});
    const [Accounts, setAccounts] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        SLNo: props.Data.SLNo,
        Title: props.Data.Title,
        Rate: props.Data.Rate ? props.Data.Rate : "",
        Currency: props.Data.Currency ? { label: props.Data.Currency } : false,
        Operation: props.Data.Operation ? { label: getLabel(parseInt(props.Data.Operation), OperationList), value: props.Data.Operation } : false,
        Times: props.Data.Times,
        Status: props.Data.Status,
        COA_ID: props.Data.COA_ID ? { label: props.Data.COA_ID.COA_Title, value: props.Data.COA_ID.id } : false,
    });
    const { SLNo, Title, Rate, Currency, Operation, Times, Status, COA_ID } = formData;

    useEffect(() => {
        LoadAcc();
    }, [])

    const SendUpdateOC = async () => {
        const result = await UpdateOtherCond(props.Data.id, SLNo, Title, Rate, Currency ? Currency.label : "", Operation ? Operation.value : "", Times, Status, COA_ID ? COA_ID.value : "");

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
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Other condition setup failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setFormData({
            SLNo: props.Data.SLNo,
            Title: props.Data.Title,
            Rate: props.Data.Rate ? props.Data.Rate : "",
            Currency: props.Data.Currency ? { label: props.Data.Currency } : false,
            Operation: props.Data.Operation ? { label: getLabel(parseInt(props.Data.Operation), OperationList), value: props.Data.Operation } : false,
            Times: props.Data.Times,
            Status: props.Data.Status,
            COA_ID: props.Data.COA_ID ? { label: props.Data.COA_ID.COA_Title, value: props.Data.COA_ID.id } : false,
        });
        props.onHide();
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Set up other conditions</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">S/N</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="SLNo"
                                    name="SLNo"
                                    placeholder='S/N'
                                    value={SLNo}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.SLNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SLNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Rate/Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Rate"
                                    name="Rate"
                                    placeholder='Rate/Value'
                                    value={Rate}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Rate ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={CurrencyList}
                                    name="Currency"
                                    placeholder={"Select currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : null}
                                    onChange={(e) => setFormData({ ...formData, Currency: e })}
                                    required
                                    id="Currency"
                                />

                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Operation</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={OperationList}
                                    name="Operation"
                                    placeholder={"Select operation"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={(e) => setFormData({ ...formData, Operation: e })}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Times</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Times"
                                    name="Times"
                                    placeholder='Times'
                                    value={Times}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Times ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Times}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Associate Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="COA_ID"
                                    placeholder={"Select account"}
                                    styles={CScolourStyles}
                                    value={COA_ID ? COA_ID : null}
                                    onChange={(e) => setFormData({ ...formData, COA_ID: e })}
                                    required
                                    id="COA_ID"
                                />

                                {Error.COA_ID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_ID}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Active Status</label>
                                <div className="form-check form-switch">

                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: !Status ? true : false })}
                                    />
                                    <label class="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendUpdateOC()}><i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}