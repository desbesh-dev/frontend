import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../../../actions/auth';
import { UpdateStock } from '../../../../../actions/InventoryAPI';
import { FetchAccounts, getLabel, RecallProduct } from '../../../../../actions/ContractAPI';

import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import infoIcon from '../../../../../assets/info.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

export const EditModal = (props) => {
    const [id, setID] = useState(props.EditData.id ? props.EditData.id : null)
    const [ItemCode, setItemCode] = useState(props.EditData.ItemCode ? props.EditData.ItemCode : null)
    const [Qty, setQty] = useState(props.EditData.Qty ? props.EditData.Qty : "")
    const [Weight, setWeight] = useState(props.EditData.Weight ? props.EditData.Weight : "")
    const [SubTotal, setSubTotal] = useState(props.EditData.SubTotal ? props.EditData.SubTotal : "")
    const [Status, setStatus] = useState()
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setID(false);
        setQty(false);
        setWeight(false);
        setSubTotal(false);
        props.EditReload();
        props.EditHide();
    }

    const RecallAction = async () => {
        const result = await RecallProduct(id, ItemCode, Qty, Weight, SubTotal);

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

    const QtyValidate = () => {
        if (parseFloat(Qty) <= parseFloat(props.EditData.Qty)) {
            RecallAction();
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Return Product Quantity Adjustment</span>
                        <small className="fs-5 fw-bold text-center text-success px-0">{props.EditData.Title}</small>
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
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => QtyValidate()}><i class="fad fa-edit pr-2"></i> Return </button>
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
                <p>All of items & quantities <strong>(Invoice No-{props.InvoiceNo})</strong> will be re-instate to the stock.</p>
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
                <button className="btn btn-outline-success" onClick={props.InfoAction}>Return</button>
                <button className="btn btn-outline-danger" onClick={props.InfoEdit}>Edit</button>
                <button className="btn text-center btn-outline-success" onClick={props.InfoHide}>Cancel</button>
            </Modal.Footer>
        </Modal>
    );
}