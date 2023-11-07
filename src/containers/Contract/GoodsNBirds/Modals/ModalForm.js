import axios from 'axios';
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchBranch, LoadAccount } from "../../../../actions/APIHandler";
import { SaveExpire, SaveGodown, UpdateGodown } from '../../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { customHeader, locales } from "../../../Suppliers/Class/datepicker";

let today = new Date();

export const Create = (props) => {
    const [Error, setError] = useState({});
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [BranchList, setBranchList] = useState(initialValue);
    const [AccLists, setAccLists] = useState(null)
    let toastProperties = null;
    let history = useHistory();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        Title: "",
        Type: "",
        TypeLabel: "",
        Qty: "",
        Weight: "",
        UnitCost: "",
        TotalCost: "",
        RepName: "",
        RepID: "",
        BranchID: "",
        BranchName: "",
        GodownAC: "",
        Godown_Code: "",
        GodownAC_Label: "",
        BirdStockAC: "",
        Expire_Code: "",
        BirdStockAC_Label: "",
        ExpireAC: "",
        BirdStock_Code: "",
        ExpireAC_Label: "",
    });

    useEffect(() => {
        LoadRep();
        LoadBranch();
        FetchAccounts();
    }, [])

    const { Title, Type, TypeLabel, Qty, Weight, UnitCost, TotalCost, RepName, RepID, BranchID, BranchName, GodownAC, Godown_Code, GodownAC_Label, BirdStockAC, Expire_Code, BirdStockAC_Label, ExpireAC, BirdStock_Code, ExpireAC_Label } = formData;
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

    const LoadBranch = async () => {
        var result = await FetchBranch();
        if (result !== true) {
            setBranchList(result.Branch);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const FetchAccounts = async (e) => {
        setAccLists(null)
        var result = await LoadAccount();
        setAccLists(result.data)
    }

    const SaveGD = async () => {
        const result = await SaveGodown(Title, Type, Qty, Weight, UnitCost, TotalCost, RepID, GodownAC, Godown_Code, ExpireAC, Expire_Code, BirdStockAC, BirdStock_Code, BranchID);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                ClearField();
                props.onHide();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Godown creation failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            Title: "",
            Type: "",
            TypeLabel: "",
            Qty: "",
            Weight: "",
            UnitCost: "",
            TotalCost: "",
            RepName: "",
            RepID: "",
            BranchID: "",
            GodownAC: "",
            Godown_Code: "",
            GodownAC_Label: "",
            BirdStockAC: "",
            Expire_Code: "",
            BirdStockAC_Label: "",
            ExpireAC: "",
            BirdStock_Code: "",
            ExpireAC_Label: "",
        });
        setError({});
        props.onHide();
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Creating a New Godown</span>
                        <small className="text-center px-0">Please fill up the field</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Godown Title'
                                    value={Title}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Godown Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Live Birds", value: 1 }, { label: "Processed Bird", value: 2 }]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Type"
                                    placeholder={"Select Bird Type"}
                                    styles={CScolourStyles}
                                    value={TypeLabel ? { label: TypeLabel } : null}
                                    onChange={e => setFormData({ ...formData, "TypeLabel": e.label, "Type": e.value })}
                                    required
                                    id="Type"
                                />
                                {Error.Type ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Type}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="Qty"
                                    name="Qty"
                                    placeholder='Quantity'
                                    value={Qty}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Qty ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Weight</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="Weight"
                                    name="Weight"
                                    placeholder='Weight'
                                    value={Weight}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Unit Cost</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="UnitCost"
                                    name="UnitCost"
                                    placeholder='Unit Cost'
                                    value={UnitCost}
                                    onChange={e => onChange(e)}
                                />
                                {Error.UnitCost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitCost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Total Cost</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="TotalCost"
                                    name="TotalCost"
                                    placeholder='Total Cost'
                                    value={TotalCost}
                                    onChange={e => onChange(e)}
                                />
                                {Error.TotalCost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TotalCost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Representative</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={RepLists}
                                    name="RepName"
                                    placeholder={"Select rep. name"}
                                    styles={CScolourStyles}
                                    value={RepName ? { label: RepName } : null}
                                    onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                    required
                                    id="Rep"
                                />
                                {Error.RepID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Godown Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="GodownAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={GodownAC ? { label: GodownAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "GodownAC_Label": e.label, "GodownAC": e.value, "Godown_Code": e.COA_Code })}
                                    required
                                    id="GodownAC"
                                />
                                {Error.GodownAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GodownAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Bird Stock Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="BirdStockAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={BirdStockAC ? { label: BirdStockAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "BirdStockAC_Label": e.label, "BirdStockAC": e.value, "BirdStock_Code": e.COA_Code })}
                                    required
                                    id="BirdStockAC"
                                />
                                {Error.BirdStockAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdStockAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Expire Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="ExpireAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={ExpireAC ? { label: ExpireAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "ExpireAC_Label": e.label, "ExpireAC": e.value, "Expire_Code": e.COA_Code })}
                                    required
                                    id="ExpireAC"
                                />
                                {Error.ExpireAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ExpireAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Branch</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={BranchList}
                                    name="BranchID"
                                    placeholder={"Select Branch"}
                                    styles={CScolourStyles}
                                    value={BranchID ? { label: BranchName } : null}
                                    onChange={e => setFormData({ ...formData, "BranchID": e.value, "BranchName": e.label, })}
                                    required
                                    id="BranchID"
                                />
                                {Error.BranchID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BranchID}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SaveGD()}><i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const Update = (props) => {
    const [Error, setError] = useState({});
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [BranchList, setBranchList] = useState(initialValue);
    const [AccLists, setAccLists] = useState(null)
    let toastProperties = null;
    let history = useHistory();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        Title: props.Data ? props.Data.Title : "",
        Type: props.Data ? props.Data.Type : "",
        TypeLabel: props.Data ? props.Data.Type === 1 ? "Live Birds" : props.Data.Type === 2 ? "Processed Birds" : "N/A" : "",
        Qty: props.Data ? props.Data.Qty : "",
        Weight: props.Data ? props.Data.Weight : "",
        UnitCost: props.Data ? props.Data.UnitCost : "",
        TotalCost: props.Data ? props.Data.TotalCost : "",
        RepName: props.Data ? props.Data.RepName : "",
        RepID: props.Data ? props.Data.RepID : "",
        BranchID: props.Data ? props.Data.BranchID : "",
        BranchName: props.Data ? props.Data.BranchName : "",

        GodownAC: props.Data ? props.Data.Accounts[0].GodownAC.id : "",
        Godown_Code: props.Data ? props.Data.Accounts[0].GodownAC.Godown_Code : "",
        GodownAC_Label: props.Data ? props.Data.Accounts[0].GodownAC.COA_Title : "",

        BirdStockAC: props.Data ? props.Data.Accounts[0].BirdStockAC.id : "",
        BirdStock_Code: props.Data ? props.Data.Accounts[0].BirdStockAC.BirdStock_Code : "",
        BirdStockAC_Label: props.Data ? props.Data.Accounts[0].BirdStockAC.COA_Title : "",

        ExpireAC: props.Data ? props.Data.Accounts[0].ExpireAC.id : "",
        Expire_Code: props.Data ? props.Data.Accounts[0].ExpireAC.Expire_Code : "",
        ExpireAC_Label: props.Data ? props.Data.Accounts[0].ExpireAC.COA_Title : "",
    });

    useEffect(() => {
        LoadRep();
        LoadBranch();
        FetchAccounts();
    }, [])

    const { Title, Type, TypeLabel, Qty, Weight, UnitCost, TotalCost, RepName, RepID, BranchID, BranchName, GodownAC, Godown_Code, GodownAC_Label, BirdStockAC, BirdStock_Code, BirdStockAC_Label, ExpireAC, Expire_Code, ExpireAC_Label } = formData;
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

    const LoadBranch = async () => {
        var result = await FetchBranch();
        if (result !== true) {
            setBranchList(result.Branch);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const FetchAccounts = async (e) => {
        setAccLists(null)
        var result = await LoadAccount();
        setAccLists(result.data)
    }

    const UpdateGD = async (id) => {
        const result = await UpdateGodown(id, Title, Type, Qty, Weight, UnitCost, TotalCost, RepID, GodownAC, Godown_Code, ExpireAC, Expire_Code, BirdStockAC, BirdStock_Code, BranchID);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                ClearField();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Godown creation failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            Title: props.Data ? props.Data.Title : "",
            Type: props.Data ? props.Data.Type : "",
            TypeLabel: props.Data ? props.Data.Type === 1 ? "Live Birds" : props.Data.Type === 2 ? "Processed Birds" : "N/A" : "",
            Qty: props.Data ? props.Data.Qty : "",
            Weight: props.Data ? props.Data.Weight : "",
            UnitCost: props.Data ? props.Data.UnitCost : "",
            TotalCost: props.Data ? props.Data.TotalCost : "",
            RepName: props.Data ? props.Data.RepName : "",
            RepID: props.Data ? props.Data.RepID : "",
            BranchID: props.Data ? props.Data.BranchID : "",
            BranchName: props.Data ? props.Data.BranchName : "",

            GodownAC: props.Data ? props.Data.Accounts[0].GodownAC.id : "",
            Godown_Code: props.Data ? props.Data.Accounts[0].GodownAC.Godown_Code : "",
            GodownAC_Label: props.Data ? props.Data.Accounts[0].GodownAC.COA_Title : "",

            BirdStockAC: props.Data ? props.Data.Accounts[0].BirdStockAC.id : "",
            BirdStock_Code: props.Data ? props.Data.Accounts[0].BirdStockAC.BirdStock_Code : "",
            BirdStockAC_Label: props.Data ? props.Data.Accounts[0].BirdStockAC.COA_Title : "",

            ExpireAC: props.Data ? props.Data.Accounts[0].ExpireAC.id : "",
            Expire_Code: props.Data ? props.Data.Accounts[0].ExpireAC.Expire_Code : "",
            ExpireAC_Label: props.Data ? props.Data.Accounts[0].ExpireAC.COA_Title : "",
        });
        setError({});
        props.onHide();
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Creating a New Godown</span>
                        <small className="text-center px-0">Please fill up the field</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Godown Title'
                                    value={Title}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Godown Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Live Birds", value: 1 }, { label: "Processed Bird", value: 2 }]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Type"
                                    placeholder={"Select Bird Type"}
                                    styles={CScolourStyles}
                                    value={TypeLabel ? { label: TypeLabel } : null}
                                    onChange={e => setFormData({ ...formData, "TypeLabel": e.label, "Type": e.value })}
                                    required
                                    id="Type"
                                />
                                {Error.Type ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Type}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="Qty"
                                    name="Qty"
                                    placeholder='Quantity'
                                    value={Qty}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Qty ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Weight</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="Weight"
                                    name="Weight"
                                    placeholder='Weight'
                                    value={Weight}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Unit Cost</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="UnitCost"
                                    name="UnitCost"
                                    placeholder='Unit Cost'
                                    value={UnitCost}
                                    onChange={e => onChange(e)}
                                />
                                {Error.UnitCost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitCost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Total Cost</label>
                                <input
                                    type="number"
                                    className="form-control fw-bold"
                                    id="TotalCost"
                                    name="TotalCost"
                                    placeholder='Total Cost'
                                    value={TotalCost}
                                    onChange={e => onChange(e)}
                                />
                                {Error.TotalCost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TotalCost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Representative</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={RepLists}
                                    name="RepName"
                                    placeholder={"Select rep. name"}
                                    styles={CScolourStyles}
                                    value={RepName ? { label: RepName } : null}
                                    onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                    required
                                    id="Rep"
                                />
                                {Error.RepID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Godown Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="GodownAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={GodownAC ? { label: GodownAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "GodownAC_Label": e.label, "GodownAC": e.value, "Godown_Code": e.COA_Code })}
                                    required
                                    id="GodownAC"
                                />
                                {Error.GodownAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GodownAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Bird Stock Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="BirdStockAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={BirdStockAC ? { label: BirdStockAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "BirdStockAC_Label": e.label, "BirdStockAC": e.value, "BirdStock_Code": e.COA_Code })}
                                    required
                                    id="BirdStockAC"
                                />
                                {Error.BirdStockAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdStockAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Expire Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={AccLists}
                                    name="ExpireAC"
                                    placeholder={"Select Account"}
                                    styles={CScolourStyles}
                                    value={ExpireAC ? { label: ExpireAC_Label } : null}
                                    onChange={e => setFormData({ ...formData, "ExpireAC_Label": e.label, "ExpireAC": e.value, "Expire_Code": e.COA_Code })}
                                    required
                                    id="ExpireAC"
                                />
                                {Error.ExpireAC ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ExpireAC}</small></p>
                                    : null}
                            </div>


                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label">Branch</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={BranchList}
                                    name="BranchID"
                                    placeholder={"Select Branch"}
                                    styles={CScolourStyles}
                                    value={BranchID ? { label: BranchName } : null}
                                    onChange={e => setFormData({ ...formData, "BranchID": e.value, "BranchName": e.label, })}
                                    required
                                    id="BranchID"
                                />
                                {Error.BranchID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BranchID}</small></p>
                                    : null}
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => UpdateGD(props.Data.id)}><i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const Delete = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>
                    Do you want to delete <strong>{props.FullName}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.Click}>
                    Delete
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>

            </Modal.Footer>
        </Modal>
    );
}

// export const InfoMessage = (props) => {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered>
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                     {props.header}
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h4>{props.body_header}</h4>
//                 <p>
//                     {props.body}
//                 </p>
//             </Modal.Body>
//             <Modal.Footer>
//                 <button className="btn text-center btn-outline-success" onClick={props.onHide}>Ok</button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

export const Expire = (props) => {
    const [Error, setError] = useState({});
    const initialValue = { value: 0, label: "" };
    let toastProperties = null;
    let history = useHistory();
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');

    let AVGCost = props.Data.Type === 1 ? parseFloat(props.Data.TotalCost / props.Data.Qty).toFixed(2) : props.Data.Type === 2 ? parseFloat(props.Data.TotalCost / props.Data.Weight).toFixed(2) : 0.00
    let AVGWeight = parseFloat(props.Data.Weight / props.Data.Qty).toFixed(3)

    const [formData, setFormData] = useState({
        Date: today,
        Qty: 0,
        Weight: 0.000,
        UnitCost: AVGCost,
        TotalCost: 0.00,
        ExpireAC: props.Data.Accounts[0].ExpireAC.id,
        Expire_Code: props.Data.Accounts[0].ExpireAC.COA_Code,
        ExpireAC_Label: props.Data.Accounts[0] ? props.Data.Accounts[0].ExpireAC.COA_Title : "N/A",
    });

    useEffect(() => {
    }, [])

    const { Date, Qty, Weight, UnitCost, TotalCost, ExpireAC, Expire_Code, ExpireAC_Label } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const Submit = async () => {
        var data = moment(Date).format('YYYY-MM-DD')
        const result = await SaveExpire(props.Data.BranchID, props.Data.id, data, Qty, Weight, UnitCost, TotalCost, ExpireAC, Expire_Code);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                ClearField();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Expire entry failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            Date: today,
            Qty: 0,
            Weight: 0.000,
            UnitCost: 0.00,
            TotalCost: 0.00,
            ExpireAC: "",
            Expire_Code: "",
            ExpireAC_Label: "",
        });
        setError({});
        props.onHide();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const CalcQuantity = (e) => {
        let wt = props.Data.Type === 2 ? parseFloat(e.target.value * AVGWeight) : 0.000
        let Cost = props.Data.Type === 1 ? parseFloat(e.target.value * UnitCost) : props.Data.Type === 2 ? parseFloat(wt * UnitCost) : 0.00

        setFormData({ ...formData, "Qty": e.target.value, "Weight": wt, "TotalCost": Cost.toFixed(2) })
    }

    const CalcWeight = (e) => {
        let Cost = props.Data.Type === 1 ? parseFloat(Qty * UnitCost) : props.Data.Type === 2 ? parseFloat(e.target.value * UnitCost) : 0.00
        setFormData({ ...formData, "Weight": e.target.value, "TotalCost": Cost.toFixed(2) })
    }

    const CalcCost = (e) => {
        let Cost = props.Data.Type === 1 ? parseFloat(e.target.value * Qty) : props.Data.Type === 2 ? parseFloat(e.target.value * Weight) : 0.00
        setFormData({ ...formData, "UnitCost": e.target.value, "TotalCost": Cost.toFixed(2) })
    }

    const GetAVGCost = (e) => {
        if (UnitCost === "" || UnitCost === undefined || UnitCost === 'undefiend' || UnitCost === 0)
            setFormData({ ...formData, "UnitCost": AVGCost })
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
                        <p className="fs-4 fw-bolder text-center px-0 text-uppercase m-0">Expire Entry Form</p>
                        <p className="fs-6 fw-bold text-center px-0 text-uppercase m-0">{props.Data ? props.Data.Title : "N/A"}</p>
                        <p className="fs-6 fw-bold text-center px-0 text-success m-0 border-bottom">{props.Data ? props.Data.Type === 1 ? "— Live Birds —" : props.Data.Type === 2 ? "— Proccesed Birds —" : "N/A" : "N/A"}</p>
                        <small className="text-center text-muted px-0">Expire A/C: <span className="fw-bolder">{formData ? ExpireAC_Label : "N/A"}</span> </small>
                        <form>
                            <div className="form-group mt-3">
                                <p className="m-0 text-center">Date</p>
                                <Datepicker
                                    name="Date"
                                    selected={Date}
                                    className="form-control border rounded text-center text-dark fw-bolder mx-auto"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setFormData({ ...formData, "Date": e })}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Please select date"
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label text-center">Expire Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="Qty"
                                            name="Qty"
                                            placeholder='Quantity'
                                            onChange={e => CalcQuantity(e)}
                                            value={formData ? Qty : ""}
                                        />
                                        {Error.Qty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label">Expire Weight</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="Weight"
                                            name="Weight"
                                            placeholder='Unit Weight'
                                            onChange={e => CalcWeight(e)}
                                            value={Weight}
                                        />
                                        {Error.Weight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label text-center">Unit Cost <small className="text-success"> {parseFloat(UnitCost) === parseFloat(AVGCost) ? "(Auto Generated)" : "(Custom Rate)"}</small></label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="UnitCost"
                                            name="UnitCost"
                                            placeholder='Unit Cost'
                                            onChange={e => CalcCost(e)}
                                            onBlur={e => GetAVGCost(e)}
                                            value={UnitCost}
                                        />
                                        {Error.UnitCost ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitCost}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label">Total Cost</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="TotalCost"
                                            name="TotalCost"
                                            placeholder='Total Cost'
                                            onChange={e => onChange(e)}
                                            value={TotalCost}
                                        />
                                        {Error.TotalCost ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TotalCost}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => Submit()}><i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}
