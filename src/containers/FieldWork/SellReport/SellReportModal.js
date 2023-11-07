import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { UpdateScale } from '../../../actions/ContractAPI';

import { useDispatch } from 'react-redux';
import errorIcon from '../../../assets/error.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const UpdateModal = (props) => {
    const [Qty, setQty] = useState(props.Item.Qty ? props.Item.Qty : 0)
    const [Weight, setWeight] = useState(props.Item.Weight ? props.Item.Weight : 0.000)
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setQty(false);
        setWeight(false);
        props.onHide();
    }

    const BirdReturn = async () => {
        if (props.Item.id !== null && props.Item.id !== "" && Qty !== null && Qty !== "" && Weight !== null && Weight !== "") {
            if (Qty !== props.Item.Qty && Weight !== props.Item.Weight && Qty <= props.Item.Qty && Weight <= props.Item.Weight) {
                const result = await UpdateScale(props.Item.id, Qty, Weight);
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
            props.onHide();
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Return Bird</span>
                        {/* <small className="fs-5 fw-bold text-center px-0">{props.Item.ItemCode.Title}</small> */}
                        <small className="text-center px-0">(Please fill up the return quantity & weight)</small>
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
                                    onChange={(e) => setQty(e.target.value)}
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
                                    placeholder='Unit Price'
                                    value={Weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => BirdReturn()}>
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