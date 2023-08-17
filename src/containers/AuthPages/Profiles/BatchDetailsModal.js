import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';


export const BatchDetailsModal = (props) => {
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
                            {props.item ?
                                <tbody>
                                    <tr className="border-bottom text-center">
                                        <td className="p-1" colspan="2"><span className="fs-4 fw-bolder text-center py-2">Batch Details- <span className="text-primary"> {props.item.Status ? " Active" : " Closed"}</span></span></td>
                                    </tr>
                                    {props.item.id ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch ID</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.id}</span></td>
                                        </tr>
                                        : null}
                                    {props.item.BatchNo ?
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch No</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.BatchNo}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.CondID ?
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Condition</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.CondID.Title}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.IssueDate ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Issue Date</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.IssueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.Size ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch Size</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Size}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.NetPay ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Net Pay</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.NetPay}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.GrandPay ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Grand Pay</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.GrandPay}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.SavingRate ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Saving Rate</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.SavingRate}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.Saving ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Saving</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Saving}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.ABW ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">AVG Body Weight</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.ABW}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.FCR ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Cons. Ratio</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.FCR}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.Cost ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">AVG Cost (KG)</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Cost}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.SellRate ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">AVG Sell Rate</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.SellRate}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.Status ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Status</span></td>
                                            <td className="p-1 text-danger"><span className="d-block fs-5 text-left text-dark fw-bolder text-info">{props.item.Status ? "Active" : "Closed"}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.UpdatedBy ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Operator</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.UpdatedBy}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.UpdatedAt ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated At</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                        </tr>
                                        : null
                                    }
                                    {props.item.CreatedAt ?
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Created At</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                        </tr>
                                        : null
                                    }

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