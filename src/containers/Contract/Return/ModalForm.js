import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../actions/auth';
import { UpdateStock } from '../../../actions/InventoryAPI';
import { ClosingRecall, FetchAccounts, getLabel } from '../../../actions/ContractAPI';

import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { RecallProduct } from "../../../actions/ContractAPI";

export const UpdateModal = (props) => {
    const [Qty, setQty] = useState(props.Item.Qty ? props.Item.Qty : null)
    const [Weight, setWeight] = useState(props.Item.Weight ? props.Item.Weight : null)
    const [Cost, setCost] = useState(props.Item.Cost ? props.Item.Cost : false)
    const [MinRequired, setMinRequired] = useState(props.Item.MinRequired ? props.Item.MinRequired : false)
    const [InitStock, setInitStock] = useState(props.Item.InitStock ? props.Item.InitStock : false)
    const [Status, setStatus] = useState(props.Item.Status ? props.Item.Status : false)
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setQty(false);
        setWeight(false);
        setCost(false);
        setMinRequired(false);
        setInitStock(false);
        setStatus(false);
        props.onHide();
    }

    const StockUpdate = async () => {
        const result = await UpdateStock(props.Item.id, Qty, Weight, Cost, MinRequired, InitStock, Status);

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
        let weight = props.Item.ItemCode.UnitWeight * e.target.value
        setWeight(weight)
        setQty(e.target.value)
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Update Stock</span>
                        <small className="fs-5 fw-bold text-center px-0">{props.Item.ItemCode.Title}</small>
                        <small className="text-center px-0">(Please fill up the desired field to update)</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Unit Price</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Cost"
                                    name="Cost"
                                    placeholder='Unit Price'
                                    value={Cost}
                                    onChange={(e) => setCost(e.target.value)}
                                />
                                {Error.Cost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Cost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Quantity</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
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

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Weight</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Weight"
                                    name="Weight"
                                    placeholder='Unit Price'
                                    value={Weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    disabled
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Minimum Quantity</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
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
                                <label for="message-text" class="col-form-label">Initial Stock</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="InitStock"
                                    name="InitStock"
                                    placeholder='Initial Stock'
                                    value={InitStock}
                                    onChange={(e) => setInitStock(e.target.value)}
                                />
                                {Error.InitStock ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InitStock}</small></p>
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
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => StockUpdate()}>
                                <i class="fad fa-edit pr-2"></i> Update </button>
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

export const ParkModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="fs-4 contained-modal-title-vcenter">
                    Batch Parking
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="fs-5">
                <h4>{props.FullName}</h4>
                <p className="fs-6">
                    Do you want to parked this batch for sell?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>
                <button className="btn btn-outline-danger" onClick={props.Click}>{props.Value ? "Re-instate" : "Park"}</button>
            </Modal.Footer>
        </Modal>
    );
}

export const EditModal = (props) => {
    const [id, setID] = useState(props.EditData.id ? props.EditData.id : null)
    const [SaleMapID, setSaleMapID] = useState(props.EditData.SaleMapID ? props.EditData.SaleMapID : null)
    const [ItemCode, setItemCode] = useState(props.EditData.ItemCode ? props.EditData.ItemCode : null)
    const [Qty, setQty] = useState(props.EditData.Qty ? props.EditData.Qty : "")
    const [Weight, setWeight] = useState(props.EditData.Weight ? props.EditData.Weight : "")
    const [SubTotal, setSubTotal] = useState(props.EditData.SubTotal ? props.EditData.SubTotal : "")
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
        props.EditReload();
        props.EditHide();
    }

    const RecallAction = async (e) => {
        e.preventDefault();
        const result = await ClosingRecall(SaleMapID, id, ItemCode, Qty, Weight, SubTotal);
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
        setError({});
        let weight = props.EditData.UnitWeight * e.target.value
        let Total = e.target.value * props.EditData.Rate
        setWeight(weight)
        setQty(e.target.value)
        setSubTotal(Total)
    }

    const QtyValidate = (e) => {
        e.preventDefault();
        if (parseFloat(Qty) <= parseFloat(props.EditData.Qty)) {
            RecallAction(e);
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Product Quantity Adjustment</span>
                        <small className="fs-5 fw-bold text-center text-success px-0">{props.EditData.ProductTitle}</small>
                        <form>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Quantity</label>
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
                                <label for="message-text" class="col-form-label">Weight</label>
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