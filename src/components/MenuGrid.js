import { Button, Modal, Spinner } from "react-bootstrap";


export const MenuGrid = (props) => {

    return (
        <Modal
            {...props}
            size="md"
            className="come-from-modal right fade stick-up"
            // class="modal fade stick-up disable-scroll"
            id="filtersModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="filtersModal"
            aria-hidden="false"
        // aria-labelledby="contained-modal-title-vcenter"
        >
            {/* <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    New Business Registration <br />
                    {!Next ? <small>Please fill the business info</small> : <small>Please fill the farm details</small>}
                </p>
            </Modal.Header> */}
            <Modal.Body closeButton>

                <div class="d-flex justify-content-center">
                    <div className="col-7"></div>
                </div>

            </Modal.Body>
        </Modal >
    );
}