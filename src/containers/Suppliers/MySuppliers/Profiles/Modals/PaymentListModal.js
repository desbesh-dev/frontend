
import moment from "moment";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

export const PaymentListModal = (props) => {
    const { user } = useSelector((state) => state.auth);
    const [Item, setItem] = useState(false)
    return (
        <Modal
            {...props}
            size="medium"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            dialogClassName="modal-md"
        >
            <Modal.Header className="py-2 border-bottom-0" closeButton>
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark text-center m-0 justify-content-center w-100">
                    Payment Voucher List <br />
                    <small>Party payment receipt details following the invoice</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                {
                    Array.isArray(props.PaymentList) && props.PaymentList.length ?
                        <div className='tableFixHead w-100' style={{ height: '300px' }}>
                            <table className={`table table-hover table-borderless bg-white text-nowrap`}>
                                <thead className='bg-white'>
                                    <tr className="text-center">
                                        <th className="py-1 border-center"><span>S/N</span></th>
                                        <th className="py-1 border-center"><span>Date</span></th>
                                        <th className="py-1 border-center"><span>Voucher No</span></th>
                                        <th className="py-1 border-center"><span>Pay Type</span></th>
                                        {/* <th className="py-1 border-right">Amount</th> */}
                                        <th className="py-1 text-center"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.PaymentList.map((item, i) => (
                                            <tr className="border-bottom text-center fw-bold" key={i}>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="py-0 px-1 border-right text-nowrap">{moment(item.Date).format("DD MMM YY")}</td>
                                                <td className="py-0 px-1 border-right">{item.VoucherNo}</td>
                                                <td className="py-0 px-1 border-right">{item.PaymentMethod ? item.PaymentMethod : "N/A"}</td>
                                                {/* <td className="py-0 border-right text-right"><span className="d-block fw-bold">{(item.DR).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                                <td className="p-0 text-nowrap text-center">
                                                    <span className="d-block fw-bold">{(item.DR).toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                                                    {/* <button className="btn fs-3 px-2 py-0 text-danger"
                                                        onClick={(e) => MoneyReciptPDF(item, props.item, user)}
                                                    ><i className="fad fa-print"></i></button> */}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>Counter payment maybe</p>
                        </div>
                }

                <div className="d-flex justify-content-around align-items-center">
                    <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 px-2 py-0" onClick={() => props.onHide()}><i className="fad fa-times p-0"></i></button>
                </div>
            </Modal.Body>
        </Modal >
    );
}
