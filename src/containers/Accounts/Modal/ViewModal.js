import { Modal } from "react-bootstrap";
import React from 'react';
export const ViewModal = (props) => {
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
                        <table className={`table table-borderless table-responsive card-1`}>
                            {props.Acc || props.SubAcc || props.ChildAcc ?
                                <tbody>
                                    <tr className="border-bottom text-center">
                                        <td className="p-1" colspan="2">
                                            <span className="fs-4 fw-bolder text-center py-2 text-uppercase">
                                                {`${props.ChildAcc ? props.ChildAcc.COA_Title : props.SubAcc ? props.SubAcc.COA_Title : props.Acc ? props.Acc.COA_Title : null} ${" Details"}`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Parent Account</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? `${props.SubAcc.COA_Title} [${props.SubAcc.COA_Code}]`
                                                : props.SubAcc ? `${props.Acc.COA_Title} [${props.Acc.COA_Code}]`
                                                    : props.Acc ? `${props.Acc.COA_Title} [${props.Acc.COA_Code}]`
                                                        : null}
                                        </span>
                                        </td>
                                    </tr>

                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Account Title</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">
                                            {props.ChildAcc ? props.ChildAcc.COA_Title : props.SubAcc ? props.SubAcc.COA_Title : props.Acc ? props.Acc.COA_Title : null}
                                        </span></td>
                                    </tr>

                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Short Code</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? props.ChildAcc.COA_Code : props.SubAcc ? props.SubAcc.COA_Code : props.Acc ? props.Acc.COA_Code : null}
                                        </span></td>
                                    </tr>

                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Transaction Type</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? props.ChildAcc.TransType ? "Group" : "Single" : props.SubAcc ? props.SubAcc.TransType ? "Group" : "Single" : props.Acc ? props.Acc.TransType ? "Group" : "Single" : null}
                                        </span></td>
                                    </tr>

                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Account Type</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.Acc.COA_Title}</span></td>
                                    </tr>
                                    {
                                        props.ChildAcc ?
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Sub-Type</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.SubAcc.COA_Title}</span></td>
                                            </tr>
                                            :
                                            null
                                    }

                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Terms</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {
                                                props.ChildAcc ? props.ChildAcc.Terms ?
                                                    "Fixed/Long Term" : "Current/Short Term" :
                                                    props.SubAcc ? props.SubAcc.Terms ? "Fixed/Long Term" : "Current/Short Term" :
                                                        props.Acc ? props.Acc.Terms ? "Fixed/Long Term" : "Current/Short Term"
                                                            : null
                                            }
                                        </span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Money Type</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? props.ChildAcc.MoneyType ? "Bank" : "Cash" : props.SubAcc ? props.SubAcc.MoneyType ? "Bank" : "Cash" : props.Acc ? props.Acc.MoneyType ? "Bank" : "Cash" : null}
                                        </span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Gross Profit</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? props.ChildAcc.GrossProfit ? "Affect" : "N/A" : props.SubAcc ? props.SubAcc.GrossProfit ? "Affect" : "N/A" : props.Acc ? props.Acc.GrossProfit ? "Affect" : "N/A" : null}
                                        </span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Tree  Level</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">
                                            {props.ChildAcc ? props.ChildAcc.TreeLevel : props.SubAcc ? props.SubAcc.TreeLevel : props.Acc ? props.Acc.TreeLevel : null}
                                        </span></td>
                                    </tr>


                                    <tr className="text-center">
                                        <td className="p-1 pt-3" colspan="2">
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center" onClick={() => props.Delete()}><i class="fad fa-trash-alt pr-2"></i>Delete</button>
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => props.Update()}><i class="fad fa-edit pr-2"></i> Update </button>
                                            <button className="btn btn-outline-success" onClick={() => props.onHide()}><i class="fad fa-times pr-2"></i> Close</button>
                                        </td>
                                    </tr>
                                </tbody>
                                : <p className="fs-6 fw-normal text-center py-2 m-0">No data found</p>
                            }
                        </table>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}