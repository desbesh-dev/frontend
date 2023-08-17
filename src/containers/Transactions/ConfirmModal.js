import * as moment from 'moment';
import { useState } from 'react';
import { Modal } from "react-bootstrap";

let today = new Date();

export const ConfirmModal = (props) => {
    const [Click, setClick] = useState(false)
    const ActionClick = (e) => {
        setClick(true);
        props.onConfirm();
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
                        <p className="fs-4 fw-bolder text-center px-0 text-uppercase m-0">{props.Voucher ? props.Voucher.VoucherType.label + " Confirmation" : "N/A"}</p>
                        <small className="text-center text-muted px-0">Please verify your transaction</small>
                        <p className="fs-6 fw-bold text-center border-bottom px-0 m-0">{props.Voucher ? props.Voucher.Consignee.label : "N/A"}</p>
                        <p className="fs-6 fw-bold text-muted text-center border-bottom px-0 m-0">{props.Voucher ? props.Voucher.Batch : "N/A"}</p>
                        <div className="d-flex justify-content-between align-items-center p-0" style={{ borderRadius: "15px" }}>
                            <p className="fs-6 text-left text-dark w-100 bg-gradient bg-light my-1 py-0 px-2 mx-0" style={{ borderBottomLeftRadius: "15px", borderTopLeftRadius: "15px" }}>Date: <span className="fw-bold">{props.Voucher ? moment(props.Voucher.Date).format("DD MMM YYYY") : "N/A"}</span> </p>
                            <p className="fs-6 text-right text-dark w-100 bg-gradient bg-light my-1 py-0 px-2 mx-0" style={{ borderBottomRightRadius: "15px", borderTopRightRadius: "15px" }}><span className="fw-bold">{props.Voucher ? props.Voucher.VoucherNo : "N/A"}</span> </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-0" style={{ borderRadius: "15px" }}>
                            <p className="fs-6 text-left text-dark w-100 my-1 py-0 px-2 mx-0 border">Bank: <span className="fw-bold">{props.Bank ? props.Bank.BankName : "N/A"}</span> </p>
                            <p className="fs-6 text-right text-dark w-100 my-1 py-0 px-2 mx-0 border">Branch: <span className="fw-bold">{props.Bank ? props.Bank.BranchName : "N/A"}</span> </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-0" style={{ borderRadius: "15px" }}>
                            <p className="fs-6 text-left text-dark w-100 my-1 py-0 px-2 mx-0 border">A/C: <span className="fw-bold">{props.Bank ? props.Bank.AccName : "N/A"}</span> </p>
                            <p className="fs-6 text-center text-dark w-100 my-1 py-0 px-2 mx-0 border">A/C No: <span className="fw-bold">{props.Bank ? props.Bank.AccNumber : "N/A"}</span> </p>
                            <p className="fs-6 text-right text-dark w-100 my-1 py-0 px-2 mx-0 border">Cheque No: <span className="fw-bold">{props.Bank ? props.Bank.ChequeNo : "N/A"}</span> </p>
                        </div>

                        {
                            Array.isArray(props.VoucherMap) && props.VoucherMap.length ?
                                <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                                    <thead>
                                        <tr className="text-center border" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="py-1 border-right"><span>S/N</span></th>
                                            <th className="py-1 border-right"><span>Title</span></th>
                                            <th className="py-1 border-right"><span>DR</span></th>
                                            <th className="py-1"><span>CR</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            props.VoucherMap.sort((a, b) => a.SLNo - b.SLNo).map((item, i) => (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.SLNo}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1 text-left">{item.AccountTitle + " (" + item.COA_Code + ")"}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1 text-right">{item.Debit === 0 || item.Debit === "" ? "—" : parseFloat(item.Debit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="px-3 py-0"><span className="d-block fw-bold px-1 text-right">{item.Credit === 0 || item.Credit === "" ? "—" : parseFloat(item.Credit).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                : null
                        }
                        <p className="fs-6 text-left fw-bolder text-dark" style={{ borderBottomLeftRadius: "15px", borderTopLeftRadius: "15px" }}>Narration: <span className="fw-bold">{props.Voucher ? props.Voucher.Narration : "N/A"}</span> </p>

                        <div className="d-flex justify-content-around align-items-center">
                            <button className="btn btn-outline-warning rounded-circle text-center fw-bolder fs-3 mt-3 px-2" onClick={() => props.onHide()}><i className="fad fa-long-arrow-left"></i></button>
                            {Click ? <p className="fs-6 text-left fw-bolder text-dark" style={{ borderRadius: "15px" }}>Please wait...</p> :
                                <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 mt-3" onClick={(e) => ActionClick()}><i class="fad fa-paper-plane"></i></button>
                            }
                            {/* <button className="btn btn-outline-success" onClick={() => props.onHide()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-4 fw-bold text-center mx-2" onClick={() => null}><i class="fad fa-paper-plane"></i></button> */}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}