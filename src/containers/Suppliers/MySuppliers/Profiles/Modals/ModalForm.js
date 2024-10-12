import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { UpdateInvoiceNo, UpdateStock } from '../../../../../actions/InventoryAPI';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FetchBranch } from "../../../../../actions/APIHandler";
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import infoIcon from '../../../../../assets/info.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

export const InitProductModal = (props) => {
    const initialValue = { value: 0, label: "" };
    const [ItemCode, setItemCode] = useState(props.Item.ItemCode ? props.Item.ItemCode : null)
    const [UnitWeight, setUnitWeight] = useState(props.Item.UnitWeight ? props.Item.UnitWeight : null)
    const [UnitPrice, setUnitPrice] = useState(props.Item.UnitPrice ? props.Item.UnitPrice : null)
    const [Qty, setQty] = useState('')
    const [Weight, setWeight] = useState('')
    const [Price, setPrice] = useState('')
    const [MinRequired, setMinRequired] = useState("5")
    const [Status, setStatus] = useState(props.Item.Status ? props.Item.Status : false)
    const [Error, setError] = useState({});
    const [BranchList, setBranchList] = useState();
    const [Branch, setBranch] = useState();

    let toastProperties = null;
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        LoadBranch();
    }, [])

    const PropLoadSet = () => {
        setItemCode(null);
        setUnitWeight(null);
        setUnitPrice(null);
        setQty(null);
        setWeight(null);
        setPrice(null);
        setMinRequired(null);
        setStatus(null);
        setError(null);
        props.onHide();
    }

    const StockUpdate = async () => {
        const result = await UpdateStock(props.Item.id, Qty, Weight, UnitPrice, MinRequired, Status);

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
                description: "Stock update failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const QuantityCalc = (e) => {
        let weight = props.Item.UnitWeight * e.target.value
        let price = props.Item.UnitPrice * e.target.value
        setWeight(weight)
        setPrice(price)
        setQty(e.target.value)
    }

    const LoadBranch = async () => {
        var result = await FetchBranch();
        if (result !== true) {
            setBranchList(result.Branch);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", height: "25px", borderRadius: '0px' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                cursor: isDisabled ? 'not-allowed' : 'default',
                borderRadius: '20px',
            };
        },
        menu: base => ({
            ...base,
            borderRadius: '0px',
            outline: 0,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
            ...base,
            padding: '5px'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '25px',
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '25px',
            padding: '0 3px',
            color: 'black'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    };

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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Initialize Product Stock</span>
                        <div className="form-check form-switch p-0">
                            <Select menuPortalTarget={document.body}
                                borderRadius={'0px'}
                                options={BranchList}
                                name='Branch'
                                placeholder={"Select destination branch"}
                                styles={colourStyles}
                                value={Branch}
                                onChange={e => setBranch(e)}
                            />
                        </div>
                        <small className="fs-5 fw-bold text-center px-0">{props.Item.Title}</small>
                        <small className="text-center px-0 text-muted">(Please fill up the desired field)</small>
                        <form>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center">Item Code</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="ItemCode"
                                            name="ItemCode"
                                            placeholder='Item Code'
                                            value={ItemCode}
                                            onChange={(e) => setItemCode(e.target.value)}
                                            disabled
                                        />
                                        {Error.ItemCode ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ItemCode}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Unit Weight</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="UnitWeight"
                                            name="UnitWeight"
                                            placeholder='Unit Weight'
                                            value={UnitWeight}
                                            onChange={(e) => setUnitWeight(e.target.value)}
                                            disabled
                                        />
                                        {Error.UnitWeight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitWeight}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Unit Price</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="UnitPrice"
                                            name="UnitPrice"
                                            placeholder='Unit Price'
                                            value={UnitPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                            onChange={(e) => setUnitPrice(e.target.value)}

                                        />
                                        {Error.UnitPrice ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitPrice}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Qty"
                                            name="Qty"
                                            placeholder='Quantity'
                                            value={Qty}
                                            onChange={(e) => QuantityCalc(e)}
                                        />
                                        {Error.Qty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Weight</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Weight"
                                            name="Weight"
                                            placeholder='Unit Price'
                                            value={Weight.toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                            onChange={(e) => setWeight(e.target.value)}
                                            disabled
                                        />
                                        {Error.Weight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Price</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Price"
                                            name="Price"
                                            placeholder='Total Price'
                                            value={Price.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Minimum Quantity</label>
                                <input
                                    type="text"
                                    className="form-control fw-bold"
                                    id="MinRequired"
                                    name="MinRequired"
                                    placeholder='Minimum Quantity'
                                    value={MinRequired}
                                    onChange={(e) => setMinRequired(e.target.value)}
                                />
                                {Error.MinRequired ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MinRequired}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Active Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setStatus(!Status ? true : false)}
                                    />
                                    <label className="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => StockUpdate()}>
                                <i className="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
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

export const InfoMessage = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.header}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.body_header}</h4>
                <p>
                    {props.body}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn text-center btn-outline-success" onClick={props.onHide}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}

export const UpdatePurchaseInvoice = (props) => {
    const [id, setid] = useState(props.item.id ? props.item.id : null)
    const [InvoiceNo, setInvoiceNo] = useState(props.item.InvoiceNo ? props.item.InvoiceNo : null)
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();
    let history = useHistory();

    const PropLoadSet = () => {
        setInvoiceNo('');
        setError({});
        props.onHide();
    }

    const StockUpdate = async () => {
        if (InvoiceNo) {
            const result = await UpdateInvoiceNo(props.item.id, InvoiceNo);
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
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])

                } else {
                    props.setList([...props.list, toastProperties = {
                        id: 2,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])
                    props.onReload();
                    PropLoadSet();
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 3,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        }
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Add Invoice No</span>
                        <small className="fs-5 fw-bold text-center px-0">{props.item.PurchaseNo}</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" className="d-flex col-form-label justify-content-center">Invoice No</label>
                                <input
                                    type="text"
                                    className="form-control fw-bold text-center"
                                    id="InvoiceNo"
                                    name="InvoiceNo"
                                    placeholder='Invoice No'
                                    value={InvoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                />
                                {Error.InvoiceNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => StockUpdate()}>
                                <i className="fab fa-pushed pr-2"></i> Enclose </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
        </Modal >
    );
}