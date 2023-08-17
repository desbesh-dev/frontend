import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../../../actions/auth';
import { UpdateContract, LoadCondList } from '../../../../../actions/ContractAPI';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import infoIcon from '../../../../../assets/info.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';
import { UpdatePartyInfo } from "../../../../../actions/APIHandler";

export const PartyInfo = (props) => {

    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [CondList, setCondList] = useState(initialValue);
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        Title: props.item.Title,
        Name: props.item.Name
    });

    const { Title, Name } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const SendContract = async () => {
        const result = await UpdatePartyInfo(props.item.id, Title, Name);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
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
                description: "Failed to update contract farm. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const ClearField = () => {
        setFormData({
            Title: props.item.Title,
            Name: props.item.Name
        })
        setNext(false)
        props.onHide()
    }


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    Update Party General Info <br />
                    <small>Please change the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label for="Title" class="col-form-label">Title</label>
                        <input
                            type="text"
                            class="form-control"
                            id="Title"
                            name="Title"
                            placeholder='Farm/Shed/Business Title'
                            value={Title}
                            onChange={e => onChange(e)}
                        />
                        {Error.Title ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label for="Name" class="col-form-label">Name</label>
                        <input
                            type="text"
                            class="form-control"
                            id="Name"
                            name="Name"
                            placeholder='Name'
                            value={Name}
                            onChange={e => onChange(e)}
                        />
                        {Error.Name ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Name}</small></p>
                            : null}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={() => SendContract()}>Submit </button>
            </Modal.Footer>
        </Modal >
    );
}