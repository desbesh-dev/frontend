import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState } from 'react';

export const UpdateMessage = (props) => {
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
                    Update Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>
                    Do you want to update <strong>{props.FullName}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.Click}>
                    Confirm
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Cancel</button>

            </Modal.Footer>
        </Modal>
    );
}