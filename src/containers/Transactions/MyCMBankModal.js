import { Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';

import Select from 'react-select';
let today = new Date();

export const MyCMBankModal = (props) => {
    const [Click, setClick] = useState(false)
    const [Bank, setBank] = useState(false)

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

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => props.onHide()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <p className="fs-4 fw-bolder text-center px-0 text-uppercase m-0">My Bank List</p>
                        <small className="text-center text-muted px-0 mb-4 border-bottom">Your all bank in dropdown menu</small>
                        <p className="fs-6 text-center fw-bold text-dark m-0" style={{ borderRadius: "15px" }}>Balance: <span className="fw-bolder fs-4">{Bank ? parseFloat(Bank.balance).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "N/A"}</span> </p>
                        <div className="d-flex justify-content-center p-0 align-items-center">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={props.array}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Cond"
                                placeholder={"Please select bank"}
                                styles={CScolourStyles}
                                value={Bank}
                                onChange={(e) => setBank(e)}
                                required
                                id="Bank"
                            />
                        </div>

                        <div className="d-flex justify-content-around align-items-center">
                            <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 mt-3" onClick={(e) => ActionClick(e, Bank)}><i class="fad fa-check"></i></button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}