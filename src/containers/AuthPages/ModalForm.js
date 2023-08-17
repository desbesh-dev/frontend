import { useState } from 'react';
import { Modal } from "react-bootstrap";

export const CreateMessage = (props) => {
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
                <button className="btn btn-outline-success" onClick={props.onHide}>Cancel</button>
                <button className="btn btn-outline-danger" onClick={props.Click}>Confirm</button>
            </Modal.Footer>
        </Modal>
    );
}


export const InfoMessage = (props) => {
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

export const Implement = (props) => {
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
                <button className="btn text-center btn-outline-success" onClick={props.onHide}>Close</button>
                <button className="btn text-center btn-outline-success" onClick={props.Click}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}