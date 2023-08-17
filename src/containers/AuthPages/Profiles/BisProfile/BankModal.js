import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import * as moment from 'moment'
import { Button, Modal, Spinner } from "react-bootstrap";
import Select from 'react-select';
import { SaveBirdSell, FetchPartyInvoiceNo, LeftBird } from '../../../../actions/ContractAPI';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import Datepicker from 'react-datepicker';
import { getBranch, LoadBanks, SaveBisBank } from '../../../../actions/APIHandler';

export const AddBankModal = (props) => {
    const [Error, setError] = useState({});
    const [BankLists, setBankLists] = useState(null);
    const [BBLists, setBBLists] = useState(null);
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        getBanks();
    }, [])

    const [formData, setFormData] = useState({
        AccName: false,
        AccNumber: false,
        BankName: "",
        BankBranchName: "",
        BankID: "",
        Status: 0,
    });

    const { AccName, AccNumber, BankName, BankBranchName, BankID, Status } = formData;
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const getBanks = async () => {
        const BList = await LoadBanks()
        setBankLists(BList)
    }

    const LoadBankBranch = async (e) => {
        setFormData({ ...formData, "BankName": e.label, "BankBranchName": "" })
        const BBList = await getBranch(e.label)
        if (BBList.data) {
            setBBLists(BBList.data)
        } else {
            setBBLists(false)
        }
    }
    const BankBranchHandler = (e) => { setFormData({ ...formData, "BankBranchName": e.label, "BankID": e.value }) }


    const AddBisBank = async () => {
        const result = await SaveBisBank(props.UserID, props.BusinessID, AccName, AccNumber, BankID, Status);
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
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to save bank account. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            ...formData,
            AccName: false,
            AccNumber: false,
            BankName: "",
            BankBranchName: "",
            BankID: "",
            Status: 0,
        });
        props.onReload();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Add New Bank Account</span>
                        <small className="text-center px-0">(*) Mark field are mandatory</small>
                        <form>
                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">Bank Name</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={BankLists ? BankLists : ""}
                                    name="BankName"
                                    placeholder="Select bank name"
                                    styles={CScolourStyles}
                                    value={BankName ? { value: null, label: BankName } : null}
                                    onChange={e => LoadBankBranch(e)}
                                    required
                                    id="BankName"
                                />
                                {Error.BankName ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BankName}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="IssueDate" class="col-form-label">Branch Name</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={BBLists}
                                    name="BankBranchName"
                                    placeholder={"Select branch name"}
                                    styles={CScolourStyles}
                                    value={BankID ? { value: BankID, label: BankBranchName } : null}
                                    onChange={e => BankBranchHandler(e)}
                                    required
                                    id="BankBranchName"
                                />
                                {Error.BBLists ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BBLists}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Account Name</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="AccName"
                                    name="AccName"
                                    placeholder='Account name'
                                    value={AccName ? AccName : ""}
                                    onChange={e => onChange(e)}
                                />
                                {Error.AccName ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccName}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label for="message-text" class="col-form-label">Account Number</label>
                                <input
                                    type="number"
                                    class="form-control fw-bold"
                                    id="AccNumber"
                                    name="AccNumber"
                                    placeholder='Account Number'
                                    value={AccNumber ? AccNumber : ""}
                                    onChange={e => onChange(e)}
                                />
                                {Error.AccNumber ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccNumber}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => AddBisBank()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const UpdateBankModal = (props) => {
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
                <div className="justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        {Array.isArray(props.Data) && props.Data.length ?
                            <>
                                <div className="text-center">
                                    <p className="fs-4 border-bottom fw-bolder text-dark text-center text-uppercase m-0">Sells & Initialize History</p>
                                    <button className="btn fs-4 fw-bold text-center text-success my-1" onClick={() => props.Create()}>
                                        <i class="fad fa-sign-in-alt pr-2"></i>New Party Initializaton</button>
                                </div>
                                {props.Data.map((item, i) => (
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <table className={`table table-borderless table-responsive border w-auto`} style={{ borderRadius: "15px" }}>
                                            <tbody className={`mx-auto d-table ${!item.Status ? 'text-muted' : 'text-dark'}`}>
                                                <tr className="border-bottom text-center">
                                                    <td colSpan={2} className="p-0">
                                                        <Link Title="Click to bird sell" to={`/bird_sell/${item.BusinessID}/${item.BatchID}/${item.InvoiceNo}/${item.id}`}
                                                            className={`d-block fs-4 fw-bolder text-uppercase text-center px-1 py-1 ${!item.Status ? 'text-muted' : 'text-dark'}`}>{item.InvoiceNo}</Link>
                                                    </td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Agent</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bolder text-left px-1">{item.PartyAgent}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Date</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Party ID</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{!item.Status ? "N/A" : item.PartyID ? item.PartyID : "N/A"}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Sell Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{parseFloat(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS/{parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}KG</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Price Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">R- {parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 })}/P- {parseFloat(item.GrandTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right px-1 py-0"><span className="d-block fs-6 fw-bold text-uppercase text-left px-2">Stock Figure</span></td>
                                                    <td className="px-1 py-0"><span className="d-block fs-6 fw-bold text-left px-1">{parseFloat(item.StockQty).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS/{parseFloat(item.StockWeight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}KG</span></td>
                                                </tr>
                                                <tr className="text-center text-white">
                                                    <td colSpan={2} className="py-2 px-1">
                                                        <button style={{ borderRadius: "15px" }} Title="Remove Initialization" onClick={() => props.onRemove(item)} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Remove</button>
                                                        {item.Status ?
                                                            <>
                                                                <button style={{ borderRadius: "15px" }} Title="Sell Summerization" onClick={() => props.onStock(item)} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Summerize</button>
                                                                <Link style={{ borderRadius: "15px" }} Title="Sell Report" to={`/sell_report/${item.BusinessID}/${item.BatchID}/${item.InvoiceNo}/${item.id}`} className="btn bg-gradient btn-outline-success fs-6 text-center text-uppercase p-1 mx-1">Report</Link>
                                                            </>
                                                            : null

                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </>
                            :
                            <>
                                <p className="fs-6 fw-normal text-center py-2">No sell information found</p>
                                <button style={{ borderRadius: "25px" }} className="btn btn-outline-success fs-4 fw-bolder w-auto text-center py-2 mb-2" onClick={() => props.Create()}>
                                    <i class="fad fa-sign-in-alt pr-2"></i>New Party Initializaton</button>
                            </>
                        }
                        <div className='d-flex justify-content-center align-items-center'>
                            <button className="btn text-right w-auto" onClick={props.onHide}><i class="fad fa-times pr-2"></i>Close</button>
                        </div>
                    </div>

                </div>
            </Modal.Body>

        </Modal >
    );
}

export const DeleteBankModal = (props) => {
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