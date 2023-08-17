import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../actions/auth';
import { colourStyles } from '../../../actions/SuppliersAPI';
import { SaveContract, LoadCondList } from '../../../actions/ContractAPI';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';


export const DetailsModal = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [CondList, setCondList] = useState(initialValue);
    const [Error, setError] = useState({});
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        CompanyID: props.CompanyID,
        BranchID: props.BranchID,
        UserID: props.UserID,
        Title: "",
        SecurityMoney: "",
        Balance: "",
        RepName: "",
        RepID: "",
        CondTitle: "",
        CondID: "",
        FarmReg: false,
        BlankCheque: false,
        Agreement: false,
        ShedSize: "",
        Floor: "",
        Roof: "",
        WaterPot: "",
        FeedPot: "",
        Employee: "",
        Contact: "",
    });

    useEffect(() => {
        // LoadRep();
        // Condition();
    }, [])

    const { CompanyID, BranchID, UserID, Title, CondTitle, CondID, SecurityMoney, Balance, RepName, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const LoadRep = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setRepLists(res.data.Rep);

        } catch (err) {
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const Condition = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await LoadCondList();
        if (result !== true) {
            setCondList(result.cond)
            setFormData({ ...formData, CondTitle: result.active.Title, CondID: result.active.value })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SendContract = async () => {
        const result = await SaveContract(props.CompanyID, props.BranchID, props.UserID, 1, "Contract", Title, CondID, SecurityMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact);

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
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Faled to create new contract farm. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            CompanyID: "",
            BranchID: "",
            UserID: "",
            Title: "",
            SecurityMoney: "",
            Balance: "",
            RepName: "",
            RepID: "",
            FarmReg: false,
            BlankCheque: false,
            Agreement: false,
            ShedSize: "",
            Floor: "",
            Roof: "",
            WaterPot: "",
            FeedPot: "",
            Employee: "",
            Contact: "",
        });
        setNext(false)
        const initialValue = { value: 0, label: "" };
        // setRepLists(initialValue);
        setError({});
        props.onHide();
    }


    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
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
            {/* <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    New Business Registration <br />
                    {!Next ? <small>Please fill the business info</small> : <small>Please fill the farm details</small>}
                </p>
            </Modal.Header> */}
            <Modal.Body>

                <div className="d-flex flex-row-reverse bd-highlight">
                    {/* <button type="button" class="btn-close d-flex align-items-center" aria-label="Close"></button> */}
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                    {/* <i class="fad fa-times"></i> */}
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <table className={`table table-borderless table-responsive card-1`}>
                            {props.item ?
                                <tbody>
                                    <tr className="border-bottom text-center">
                                        <td className="p-1" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">BUSINESS DETAILS</p></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business ID</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.id}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business Type</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Type}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Branch ID</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.BranchID.id}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Subscriber Name</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.UserID.FirstName + " " + props.item.UserID.LastName}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business/Farm/Shed Name</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Title}</span></td>
                                    </tr>

                                    {props.item.TypeID === 1 ?
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Condition</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.CondID.Title}</span></td>
                                        </tr> : null}
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Security Money</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.SCMoney}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Balance</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Balance}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Agreement</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Agreement ? "Signed Up" : "No Agreement"}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Blank Cheque</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.BlankCheque ? "Received" : "No Blank Cheque Received"}</span></td>
                                    </tr><tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Farm/Trade Licence</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.FarmReg ? "Copy has Resereved" : "No Copy has been Resereved"}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Representative</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.RepID.FirstName + " " + props.item.RepID.LastName}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Since</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Last Update</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated by</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.UpdatedBy}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Status</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.Status}</span></td>
                                    </tr>

                                    {
                                        props.item.farm[0] && props.item.TypeID === 1 ?
                                            <Fragment>
                                                <tr className="border-bottom text-center">
                                                    <td className="p-1 pt-3" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">FARM DETAILS</p></td>
                                                </tr>
                                                {/* <tr className="border-bottom text-center">
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Farm ID</span></td>
                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].id}</span></td>
                                </tr> */}
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Shed Size</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].ShedSize}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Roof</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].Roof}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Floor</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].Floor}</span></td>
                                                </tr>

                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Water Pot</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].WaterPot}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Pot</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].FeedPot}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Employee</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].Employee}</span></td>
                                                </tr>

                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Contact No</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].ContactNo}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Last Updated</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(props.item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated by</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{props.item.farm[0].UpdatedBy}</span></td>
                                                </tr>

                                            </Fragment>
                                            : null
                                    }
                                    <tr className="text-center">
                                        <td className="p-1 pt-3" colspan="2">
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center" onClick={() => props.Delete()}><i class="fad fa-trash-alt pr-2"></i>Delete</button>
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => props.Update()}><i class="fad fa-edit pr-2"></i> Update </button>
                                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
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