import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../../actions/auth';
import { CurrencyList, getLabel } from '../../../../actions/ContractAPI';
import { SaveMargin, UpdateProfitMargin, MarginOperation } from '../../../../actions/APIHandler';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

export const CreateModal = (props) => {
    const [Error, setError] = useState({});
    const [Title, setTitle] = useState(false);
    const [ProfitMargin, setProfitMargin] = useState("");
    const [Currency, setCurrency] = useState(null);
    const [Operation, setOperation] = useState(null);
    const [Status, setStatus] = useState(0);

    let toastProperties = null;
    const dispatch = useDispatch();

    const SendMargin = async () => {
        const result = await SaveMargin(Title, ProfitMargin, Currency.value, Operation.value, Status);

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
                description: "Failed to save margin. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
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
        setError({});
        setProfitMargin("");
        setCurrency(null);
        setTitle("");
        setStatus(0);
        setOperation(null);
        props.onHide();
        props.onReload();
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => { ClearField() }} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Creating a new profit margin</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    name="Title"
                                    placeholder='Profit margin title'
                                    value={Title ? Title : ""}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Profit Margin</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="ProfitMargin"
                                    name="ProfitMargin"
                                    placeholder='Profit margin'
                                    value={ProfitMargin}
                                    onChange={e => setProfitMargin(e.target.value)}
                                />
                                {Error.ProfitMargin ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProfitMargin}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Percentage (%)", value: 0 }, { label: "BDT", value: 1 }]}
                                    name="Currency"
                                    placeholder={"Select Currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : null}
                                    onChange={e => setCurrency(e)}
                                    required
                                    id="Currency"
                                />
                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Margin Operation</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={MarginOperation}
                                    name="Operation"
                                    placeholder={"Select Operation"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={e => setOperation(e)}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
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
                                        onChange={(e) => setStatus(!Status ? true : false)}
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
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendMargin()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const UpdateModal = (props) => {
    const [Error, setError] = useState({});
    const [Title, setTitle] = useState(props.Item.Title ? props.Item.Title : false);
    const [ProfitMargin, setProfitMargin] = useState(props.Item.ProfitMargin ? props.Item.ProfitMargin : false);
    const [Currency, setCurrency] = useState(props.Item.Currency ? { label: parseInt(props.Item.Currency) === 0 ? "Percentage (%)" : parseInt(props.Item.Currency) === 1 ? "BDT" : false, value: parseInt(props.Item.Currency) } : false);
    const [Operation, setOperation] = useState(props.Item.Operation ? { label: getLabel(parseInt(props.Item.Operation), MarginOperation), value: props.Item.Operation } : false);
    const [Status, setStatus] = useState(props.Item.Status ? true : false);

    let toastProperties = null;
    const dispatch = useDispatch();

    const UpdateMargin = async () => {
        const crnc = Currency.value === undefined ? parseInt(props.Item.Currency) ? Currency : "" : Currency.value
        const sts = Status !== null ? Status : props.Item.Status ? true : false
        const opr = Operation ? Operation.value : ""

        const result = await UpdateProfitMargin(Title, ProfitMargin, crnc, opr, sts, props.Item.id);

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
                description: "Profit margin update failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
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
        setError({});
        setTitle(props.Item.Title ? props.Item.Title : "");
        setProfitMargin(props.Item.ProfitMargin ? props.Item.ProfitMargin : "");
        setCurrency(props.Item.Currency ? { label: parseInt(props.Item.Currency) === 0 ? "Percentage (%)" : parseInt(props.Item.Currency) === 1 ? "BDT" : null, value: parseInt(props.Item.Currency) } : null);
        setOperation(props.Item.Operation ? { label: getLabel(parseInt(props.Item.Operation), MarginOperation), value: props.Item.Operation } : false);
        setStatus(props.Item.Status ? true : false);
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => { ClearField() }} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Creating a new profit margin</span>
                        <small className="text-center px-0">Change required field</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    name="Title"
                                    placeholder='Profit margin title'
                                    value={Title ? Title : props.Item.Title ? props.Item.Title : ""}
                                    onChange={e => setTitle(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Profit Margin</label>
                                <input
                                    type="number"
                                    class="form-control fw-bold"
                                    id="ProfitMargin"
                                    name="ProfitMargin"
                                    placeholder='Profit margin'
                                    value={ProfitMargin ? ProfitMargin : props.Item.ProfitMargin ? props.Item.ProfitMargin : ""}
                                    onChange={e => setProfitMargin(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                />
                                {Error.ProfitMargin ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProfitMargin}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Percentage (%)", value: 0 }, { label: "BDT", value: 1 }]}
                                    name="Currency"
                                    placeholder={"Select Currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : props.Item.Currency ? { label: parseInt(props.Item.Currency) === 0 ? "Percentage (%)" : parseInt(props.Item.Currency) === 1 ? "BDT" : null, value: parseInt(props.Item.Currency) } : null}
                                    onChange={e => setCurrency(e)}
                                    required
                                    id="Currency"
                                />
                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Margin Operation</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={MarginOperation}
                                    name="Operation"
                                    placeholder={"Select Operation"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={e => setOperation(e)}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
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
                                        checked={Status !== null ? Status : props.Item.Status ? true : false}
                                        onChange={(e) => setStatus(!Status ? true : false)}
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
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => UpdateMargin()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const DeleteModal = (props) => {
    const [Loading, setLoading] = useState(false)
    const HandleClick = (props) => {

    }
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>
                    Do you want to delete <strong>{props.FullName}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.Click}>
                    Delete
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>

            </Modal.Footer>
        </Modal>
    );
}