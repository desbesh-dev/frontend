import moment from "moment";
import { useEffect, useRef, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { AddNote, VerifyUser } from "../../../../actions/APIHandler";
import { ReturnSellItem } from '../../../../actions/InventoryAPI';
import barcodeScan from '../../../../assets/BarcodeScan.gif';
import errorIcon from '../../../../assets/error.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

export const EditModal = (props) => {

    const [id, setID] = useState(props.EditData.id ? props.EditData.id : null)
    const [ItemID, setItemID] = useState(props.EditData.ItemID ? props.EditData.ItemID : null)
    const [Code, setCode] = useState(props.EditData.Code ? props.EditData.Code : null)

    const [UnitName, setUnitName] = useState(props.EditData.UnitName ? props.EditData.UnitName : "")
    const [UnitQty, setUnitQty] = useState(props.EditData.UnitQty ? props.EditData.UnitQty : null)
    const [UnitWeight, setUnitWeight] = useState(props.EditData.UnitWeight ? props.EditData.UnitWeight : "")
    const [UnitPrice, setUnitPrice] = useState(props.EditData.UnitPrice ? props.EditData.UnitPrice : "")
    const [Weight, setWeight] = useState(props.EditData.Weight ? props.EditData.Weight : null)
    const [Qty, setQty] = useState(props.EditData.Qty ? props.EditData.Qty : "")
    const [Rate, setRate] = useState(props.EditData.Rate ? props.EditData.Rate : "")
    const [SubTotal, setSubTotal] = useState(props.EditData.SubTotal ? props.EditData.SubTotal : "")
    const [Remark, setRemark] = useState(props.EditData.Remark ? props.EditData.Remark : "")
    const [Status, setStatus] = useState()
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = (e) => {
        e.preventDefault();
        setID(false);
        setQty(false);
        setWeight(false);
        setSubTotal(false);
        setUnitName(false);
        setUnitQty(false);
        setUnitWeight(false);
        setUnitPrice(false);
        setWeight(false);
        setQty(false);
        setRate(false);
        setSubTotal(false);
        setID(false);
        setRemark(false);
        setStatus(false);
        props.EditHide();
        props.EditReload();
    }

    const ReturnAction = async (e) => {
        e.preventDefault();
        const result = await ReturnSellItem(props.InvoiceID, ItemID, props.EditData.SLNo, Code, UnitName, UnitQty, UnitWeight, UnitPrice, Weight, Qty, Rate, SubTotal, Remark);
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
                PropLoadSet(e);
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Product return failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const QuantityCalc = (e) => {
        if (e.target.value <= parseFloat(props.EditData.Qty)) {
            setError({});
            let weight = props.EditData.UnitWeight * e.target.value
            weight = parseFloat(weight).toFixed(2)
            let Total = e.target.value * props.EditData.Rate
            setWeight(weight)
            setQty(e.target.value)
            setSubTotal(Total)
        }
    }

    const QtyValidate = (e) => {
        e.preventDefault();
        if (parseFloat(Qty) <= parseFloat(props.EditData.Qty)) {
            ReturnAction(e);
        } else {
            setError({ Qty: "Quantity can not large then " + props.EditData.Qty })
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
                    <button className="btn-close fs-5" Title="Close" onClick={(e) => PropLoadSet(e)} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Product Inventory Adjustment</span>
                        <small className="fs-5 fw-bold text-center text-success px-0">{props.EditData.Title}</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Quantity</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Qty"
                                    name="Qty"
                                    placeholder='Quantity'
                                    value={Qty}
                                    onChange={(e) => QuantityCalc(e)}
                                // onBlur={(e) => QtyValidate(e)}
                                />
                                {Error.Qty ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Weight</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Weight"
                                    name="Weight"
                                    placeholder='Weight'
                                    value={Weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    disabled
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Reason for Return</label>
                                <textarea
                                    rows="5"
                                    class="form-control fw-bold"
                                    id="Remark"
                                    name="Remark"
                                    placeholder='Remark'
                                    value={Remark}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setRemark(e.target.value)}
                                    required
                                />

                                {Error.Remark ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Remark}</small></p>
                                    : null}
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={(e) => PropLoadSet(e)}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={(e) => QtyValidate(e)}><i class="fad fa-edit pr-2"></i> Return </button>
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
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>{props.InvoiceNo}</p>
                <small>NB. Accounts will not be affected</small>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.DeleteAction}>Delete</button>
                <button className="btn btn-outline-success" onClick={props.DeleteHide}>Close</button>
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
                <Modal.Title id="contained-modal-title-vcenter" className="fs-4">
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
                {/* <button className="btn btn-outline-success" onClick={props.InfoAction}>Return</button> */}
                <button className="btn btn-outline-danger" onClick={props.InfoEdit}>Yes</button>
                <button className="btn text-center btn-outline-success" onClick={props.InfoHide}>Cancel</button>
            </Modal.Footer>
        </Modal>
    );
}

export const CreateNote = (props) => {
    const [Click, setClick] = useState(false)
    const [Bank, setBank] = useState(false)
    const [Details, setDetails] = useState('')
    const [Advice, setAdvice] = useState('')
    const [Error, setError] = useState({});

    let toastProperties = null;


    const ActionClick = (e, Bank) => {
        setClick(true);
        props.onConfirm(e, Bank);
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontSize: "18px",
            fontWeight: "bold",
            maxWidth: "400px",
        }),
        menuList: (provided, state) => {
            return {
                ...provided,
                textAlign: "center"
            };
        },
        valueContainer: (base, state) => ({
            ...base,
            justifyContent: "center"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const SaveNote = async (e) => {
        e.preventDefault();
        const result = await AddNote(props.item.PartyID, '', props.item.NoteType, props.item.InvoiceID, '', Details, Advice, props.item.Count, props.item.Amount, 2);
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
                description: "Note generation has been failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    return (
        <Modal
            {...props}
            size="small"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">
            <Modal.Header className="py-2" closeButton>
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark text-center m-0 justify-content-center w-100">
                    Generating Note <br />
                    <small>Generating notes required details & advice</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <div className="row justify-content-center align-items-center">
                    <div className="d-flex justify-content-between">
                        <p className="fs-6 text-center fw-bold text-dark m-0">Date: <span className="fw-bolder">{moment(new Date()).format("DD MMM YYYY")}</span></p>
                        <p className="fs-6 text-center fw-bold text-dark m-0">Name: <span className="fw-bolder"> {props.item.Name}</span></p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-6 text-center fw-bold text-dark m-0">Type: <span className="fw-bolder">{props.item.NoteName}</span></p>
                        <p className="fs-6 text-center fw-bold text-dark m-0">Invoice No: <span className="fw-bolder"> {props.item.InvoiceNo}</span></p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-6 text-center fw-bold text-dark m-0">Items: <span className="fw-bolder">{props.item.Count}</span></p>
                        <p className="fs-6 text-center fw-bold text-dark m-0">Amount: <span className="fw-bolder"> {parseFloat(props.item.Amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Details" class="col-form-label">Details</label>
                        <textarea
                            rows="2"
                            class="form-control"
                            id="Details"
                            name="Details"
                            placeholder='Why return the products?'
                            value={Details}
                            onChange={e => setDetails(e.target.value)}
                        />
                        {Error.Details ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Details}</small></p>
                            : null}
                    </div>

                    <div className="form-group">
                        <label htmlFor="Advice" class="col-form-label">Advice</label>
                        <textarea
                            rows="2"
                            class="form-control"
                            id="Advice"
                            name="Advice"
                            placeholder='What do you want to say?'
                            value={Advice}
                            onChange={e => setAdvice(e.target.value)}
                        />
                        {Error.Advice ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Advice}</small></p>
                            : null}
                    </div>

                    <div className="d-flex justify-content-around align-items-center">
                        <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2" onClick={(e) => SaveNote(e)}><i class="fad fa-check"></i></button>
                        <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 px-2 py-0" onClick={() => props.onHide()}><i class="fad fa-times p-0"></i></button>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const DiscountModal = (props) => {
    const [QRCode, setQRCode] = useState('')
    const QRCodeFocus = useRef(null);

    const handleMouseDown = (e) => {
        if (QRCodeFocus.current && e.target !== QRCodeFocus.current) {
            e.preventDefault();
            QRCodeFocus.current.focus();
        }
    };

    useEffect(() => {
        QRCodeFocus.current.focus();

        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const VerifyQRCode = async (e, id) => {
        var result = await VerifyUser(id);
        if (result !== true && parseInt(result.data.No) === 8)
            props.onFocusDisc(e)
    }

    const EnterKeyEvent = (e) => {
        const value = e.target.value;
        if (e.key === "Enter") {
            VerifyQRCode(e, value);
        }
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            centered>
            <Modal.Header>
                <Modal.Title className="fs-3" id="contained-modal-title-vcenter">Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="fs-4 text-center">Please scan your ID card</p>
                <input
                    ref={QRCodeFocus}
                    type="text"
                    className="form-control fw-bold text-center"
                    id="QRCode"
                    name="Scan Barcode"
                    placeholder='QRCode'
                    value={QRCode}
                    onChange={(e) => setQRCode(e.target.value)}
                    onKeyDown={(e) => EnterKeyEvent(e)}
                />
                <img className="d-flex img-fluid justify-content-center mx-auto" src={barcodeScan} width={280} height={280} />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn text-center btn-outline-success mx-auto" onClick={props.onHide}>Close</button>
            </Modal.Footer>
        </Modal>
    );
}