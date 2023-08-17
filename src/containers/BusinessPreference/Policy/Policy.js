import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { LoadProfile, LoadMyUsers } from '../../../actions/APIHandler';
import { CondList, SaveItem, LoadCondition, RemoveCondRate, CondImplement, DeleteCondition, OperationList, getLabel, RemoveOC, ConditionScheme } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { FaList, FaBorderAll } from "react-icons/fa";
import { AiOutlineScan } from "react-icons/ai";
import Select from 'react-select';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { DeleteMessage } from "../../Modals/DeleteModal.js";
import { Implement } from "../../Modals/ModalForm";
import { CreatePolicyModal, UpdatePolicyModal, OtherModal, OtherUpdateModal } from './Modal/FirstPolicyModal';
import { SecondModal, SecondUpdateModal } from './Modal/SecondPolicyModal';
// import { CondRateModal } from './CondRateModal'

const Policy = ({ display, CompanyID, BranchID, list, setList }) => {
    const [Data, setData] = useState(null)
    const [Cond, setCond] = useState(false)
    const [CondValue, setCondValue] = useState(false)
    const [CreatePolicy, setCreatePolicy] = useState(false)
    const [Error, setError] = useState({});
    const [ConID, setConID] = useState(false);
    const [Status, setStatus] = useState(false);
    const [AddRowID, setAddRowID] = useState(false);
    const [Item, setItem] = useState(false);
    const [RateItem, setRateItem] = useState(false);
    const [ViewItemID, setViewItemID] = useState(false);
    const [Expand, setExpand] = useState(false);

    const [ModalShow, setModalShow] = useState(false);
    const [RateModalShow, setRateModalShow] = useState(false);
    const [ImpModal, setImpModal] = useState(false);
    const [ShowCreatePolicy, setShowCreatePolicy] = useState(false);
    const [ShowUpdatePolicy, setShowUpdatePolicy] = useState(false);
    const [ShowOtherPolicy, setShowOtherPolicy] = useState(false);
    const [ShowSecondPolicy, setShowSecondPolicy] = useState(false);
    const [ShowUpdateOC, setShowUpdateOC] = useState(false);
    const [ShowDeleteOC, setShowDeleteOC] = useState(false);
    let toastProperties = null;
    const [formData, setFormData] = useState({
        SLNo: "",
        From: "",
        To: "",
        Rate: "",
        CondTitle: "",
    });
    const { SLNo, From, To, Rate, CondID, CondTitle } = formData;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        Conditions();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [])

    const Conditions = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadCondition();
        if (result !== true) {
            setData(result.Condition);
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();

    const SendItem = async () => {
        if (parseInt(SLNo) !== "" && parseInt(From) !== "" && parseInt(To) !== "" && parseInt(Rate) !== "" && parseInt(AddRowID)) {


            const result = await SaveItem(SLNo, From, To, Rate, AddRowID);

            if (result !== true) {
                if (result.user_error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({
                            ...updatedState,
                        });
                    }
                    setList([...list, toastProperties = {
                        id: 1,
                        title: 'Invalid Data',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: warningIcon
                    }])

                } else {
                    Conditions();
                    setList([...list, toastProperties = {
                        id: 1,
                        title: 'Success',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: successIcon
                    }])
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to adding rate item. Please try again later",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {

        }
    }

    const PrivatePolicy = async () => {
        // if (SLNo !== "" && From !== "" && To !== "" && Rate !== "" && CondID) {
        const result = await SaveItem(SLNo, From, To, Rate, CondID);

        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                Conditions();
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to adding rate item. Please try again later",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        // }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const DeleteCond = async e => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        // e.preventDefault();
        const result = await DeleteCondition(e);
        if (result !== true) {
            Conditions();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };


    const DeleteRate = async e => {
        setRateModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveCondRate(RateItem.id);
        if (result !== true) {
            Conditions();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const DeleteOC = async (e) => {
        setShowDeleteOC(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveOC(Item.id);
        if (result !== true) {
            Conditions();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const ChartImplement = (e) => {
        if (e.target.checked) {
            setImpModal(true);
            setConID(e.target.id)
        } else {
            setStatus(e.target.checked)
        }
    }

    const UpdateImp = async () => {
        setImpModal(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await CondImplement(ConID, Status, 1);
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                Conditions();
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to implement new condition chart",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-0">
                <p className="display-6 d-flex justify-content-center m-0">
                    Policy Adjustment
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/policy">Policy</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-12 h-100 pl-0">
                <div className="row position-absolute overflow-auto mx-auto w-100 bg-white rounded" style={{ height: "90%" }}>

                    <div className="d-flex justify-content-center bg-white py-2 h-100">
                        <div className="col-md-12 justify-content-center align-items-center h-100">
                            <p className="fs-4 d-flex fw-bold justify-content-center text-uppercase mt-3">Let's setup contract farming conditions</p>
                            <div className="d-flex justify-content-center mb-3">
                                <button className="btn btn-outline-light fs-5 fw-bolder text-center text-success text-uppercase" style={{ borderRadius: "15px" }} onClick={() => setShowCreatePolicy(true)}>
                                    <i class="fad fa-plus pr-2"></i>Create a new condition</button>
                            </div>

                            {Array.isArray(Data) && Data.length ?
                                Data.map((item, i) => (
                                    <table className={`table table-borderless table-responsive d-table border border-light px-3`} style={{ borderRadius: "15px" }}>
                                        <thead>

                                            {/* Condition Title */}
                                            <tr className="text-center">
                                                <td className="p-1" colspan="6">
                                                    <p className="fs-4 fw-bolder text-center p-0 m-0 text-uppercase">{item.CondTitle}</p>
                                                    <p className="fs-6 fw-bold text-center p-0 m-0 text-uppercase">{item.Scheme ? getLabel(parseInt(item.Scheme), ConditionScheme) : "N/A"}</p>
                                                    <small className="fw-bold text-center text-muted py-2 text-uppercase">
                                                        {item.Status === true ? `Implemented  (${new Date(item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')} by ${item.UpdatedBy})` : null}</small>
                                                </td>
                                            </tr>

                                            {/* Condition info && Itmes */}
                                            <tr className="text-center">
                                                <td className="p-1 text-left text-dark" colspan="6">
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <div className="form-check form-switch my-auto border" style={{ borderRadius: "15px" }}>
                                                            <input
                                                                class={`form-check-input pl-2`}
                                                                type="checkbox"
                                                                value={Status}
                                                                id={item.CondID}
                                                                name="Status"
                                                                checked={item.Status}
                                                                onChange={(e) => ChartImplement(e)}
                                                            />
                                                            <label class="form-check-label text-center fw-bold pr-2" for={item.CondID}>{item.Status === true ? "Active" : "Inactive"}</label>
                                                        </div>
                                                        <div className='my-auto text-center'>
                                                            <p className="fs-5 fw-bolder text-success m-0 px-2 border" style={{ borderRadius: "15px" }}>
                                                                {item.Season} Season
                                                            </p>
                                                        </div>
                                                        {item.Scheme === 1 || item.Scheme === 4 ?
                                                            <div className='text-right border' style={{ borderRadius: "15px" }}>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setViewItemID(item.CondID); setShowOtherPolicy(true) }}><i className="fs-6 fad fa-plus" /></button>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setItem(item); setShowUpdatePolicy(true) }}><i className="fs-6 fad fa-edit" /></button>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setItem(item); setModalShow(true) }}><i className="fs-6 fad fa-trash-alt" /></button>
                                                                <button className="btn text-dark py-0 px-2"><i className="fs-6 fad fa-print" /></button>
                                                                {/* <button className="btn text-dark py-0 px-2" onClick={() => setViewItemID(ViewItemID === item.CondID ? false : item.CondID)}><i className="fs-6 fad fa-eye" /></button> */}
                                                            </div>
                                                            :
                                                            <div className='text-right border' style={{ borderRadius: "15px" }}>
                                                                <button className="btn text-dark py-0 px-2"><i className="fs-6 fad fa-print" /></button>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setItem(item); setModalShow(true) }}><i className="fs-6 fad fa-trash-alt" /></button>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setItem(item); setShowUpdatePolicy(true) }}><i className="fs-6 fad fa-edit" /></button>
                                                                <button className="btn text-dark py-0 px-2" onClick={() => { setViewItemID(item.CondID); setShowSecondPolicy(true) }}><i className="fs-6 fad fa-plus" /></button>
                                                                {/* <button className="btn text-dark py-0 px-2" onClick={() => setViewItemID(ViewItemID === item.CondID ? false : item.CondID)}><i className="fs-6 fad fa-eye" /></button> */}
                                                            </div>
                                                        }
                                                    </div>
                                                    {
                                                        (item.Scheme === 1 || item.Scheme === 4) && Array.isArray(item.FirstCond) && item.FirstCond.length ?
                                                            <table className={`table table-borderless table-responsive d-table mt-1 mb-0`}>
                                                                <thead>
                                                                    <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">#</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">SLNo</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Condition Title</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Rate/Value</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Currency</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Operation</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Times</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Account</span></th>
                                                                        <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span></th>
                                                                        <th className="p-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                                                                    </tr>

                                                                </thead>
                                                                {
                                                                    item.FirstCond.map((oc, c) => (
                                                                        <tbody>
                                                                            <tr className="border-bottom border-top text-center">
                                                                                <td className="border-right p-1">
                                                                                    {oc.Currency === "Array[]" ?
                                                                                        <button className="btn py-0 px-1" onClick={() => setExpand(Expand === oc.id ? false : oc.id)}>
                                                                                            <i className={`fs-6 text-dark ${Expand !== oc.id ? "fad fa-chevron-up" : "fad fa-chevron-down"} `} />
                                                                                        </button>
                                                                                        :
                                                                                        <i class="fad fa-dot-circle"></i>
                                                                                    }
                                                                                </td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.SLNo}</span></td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">{oc.Title}</span></td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Rate ? oc.Rate : "N/A"}</span></td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Currency ? oc.Currency : "N/A"}</span></td>
                                                                                <td className="border-right p-1"><span className={`d-block fs-6 fw-bold text-uppercase text-center text-dark px-2`}>
                                                                                    {oc.Operation ? getLabel(parseInt(oc.Operation), OperationList) : "N/A"}
                                                                                </span>
                                                                                </td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Times === 1 ? "First Batch" : "Every Batch"}</span></td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.COA_ID ? oc.COA_ID.COA_Title : null}</span></td>
                                                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Status ? "Active" : "Deactive"}</span></td>
                                                                                <td className="p-1">
                                                                                    <button className="btn text-dark py-0 px-2" onClick={() => { setItem(oc); setModalShow(true) }}><i className="fs-6 fad fa-trash-alt" /></button>
                                                                                    <button className="btn text-dark py-0 px-2" onClick={() => { setItem(oc); setShowUpdateOC(true) }}><i className="fs-6 fad fa-edit" /></button>
                                                                                </td>
                                                                            </tr>


                                                                            <tr>
                                                                                <td className="p-0" colspan="10">
                                                                                    {oc.id === Expand ?
                                                                                        (Array.isArray(oc.Point) && oc.Point.length) || oc.Currency === "Array[]" ?
                                                                                            <table className={`table table-borderless mx-auto table-responsive card-1 d-table w-75`}>
                                                                                                <thead>
                                                                                                    <tr className="text-center" key={oc.id}>
                                                                                                        <td className="p-1 text-left text-dark" colspan="6">
                                                                                                            <div className="d-flex justify-content-between my-0">
                                                                                                                <span className="fs-5 text-success fw-bolder border px-2" style={{ borderRadius: "15px" }}>{oc.Title + " Chart"}</span>
                                                                                                                <div className='my-auto text-center'>
                                                                                                                    {/* <p className="fs-5 fw-bolder text-success m-0 px-2 border" style={{ borderRadius: "15px" }}>Rate & Point Chart</p> */}
                                                                                                                </div>
                                                                                                                <div className='text-right border' style={{ borderRadius: "15px" }}>
                                                                                                                    <button className="btn text-dark py-0 px-2" onClick={() => setAddRowID(oc.id)}><i className="fs-6 fad fa-plus" /></button>
                                                                                                                    <button className="btn text-dark py-0 px-2" onClick={() => setViewItemID(ViewItemID === oc.id ? false : oc.id)}><i className="fs-6 fad fa-eye" /></button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                                                                                        <th className="border-right p-0"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span></th>
                                                                                                        <th className="border-right p-0"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">From</span></th>
                                                                                                        <th className="border-right p-0"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">&#8651;</span></th>
                                                                                                        <th className="border-right p-0"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">To</span></th>
                                                                                                        <th className="border-right p-0"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Rate</span></th>
                                                                                                        <th className="p-0"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                                                                                                    </tr>
                                                                                                </thead>

                                                                                                <tbody>
                                                                                                    {
                                                                                                        AddRowID === oc.id ?
                                                                                                            <tr className="border-bottom text-center" key={1}>
                                                                                                                <td className="p-1">
                                                                                                                    <input
                                                                                                                        type="email"
                                                                                                                        class="form-control text-center"
                                                                                                                        id="SLNo"
                                                                                                                        placeholder="S/N"
                                                                                                                        name="SLNo"
                                                                                                                        value={formData ? SLNo : ""}
                                                                                                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                                                                                                        required
                                                                                                                    />
                                                                                                                    {
                                                                                                                        Error.SLNo ?
                                                                                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SLNo}</small></p>
                                                                                                                            : null
                                                                                                                    }
                                                                                                                </td>
                                                                                                                <td className="p-1">
                                                                                                                    <input
                                                                                                                        type="email"
                                                                                                                        class="form-control text-center"
                                                                                                                        id="From"
                                                                                                                        placeholder="From"
                                                                                                                        name="From"
                                                                                                                        value={formData ? From : ""}
                                                                                                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                                                                                                    />
                                                                                                                    {
                                                                                                                        Error.From ?
                                                                                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.From}</small></p>
                                                                                                                            : null
                                                                                                                    }
                                                                                                                </td>
                                                                                                                <td className="p-1"><span className="d-block fs-6 fw-normal text-center text-dark btn px-2">&#8651;</span></td>
                                                                                                                <td className="p-1">
                                                                                                                    <input
                                                                                                                        type="email"
                                                                                                                        class="form-control text-center"
                                                                                                                        id="To"
                                                                                                                        placeholder="To"
                                                                                                                        name="To"
                                                                                                                        value={formData ? To : ""}
                                                                                                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                                                                                                    />
                                                                                                                    {
                                                                                                                        Error.To ?
                                                                                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.To}</small></p>
                                                                                                                            : null
                                                                                                                    }
                                                                                                                </td>
                                                                                                                <td className="p-1">
                                                                                                                    <input
                                                                                                                        type="email"
                                                                                                                        class="form-control text-center"
                                                                                                                        id="Rate"
                                                                                                                        placeholder="Rate"
                                                                                                                        name="Rate"
                                                                                                                        value={formData ? Rate : ""}
                                                                                                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                                                                                                    />
                                                                                                                    {
                                                                                                                        Error.Rate ?
                                                                                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                                                                                                            : null
                                                                                                                    }
                                                                                                                </td>
                                                                                                                <td className="p-1"><span className="d-block fs-3 fw-normal text-center text-dark px-2 border-left">
                                                                                                                    <i class="fad fa-plus" onClick={() => SendItem()}></i></span> </td>
                                                                                                            </tr>
                                                                                                            : null
                                                                                                    }
                                                                                                    {
                                                                                                        Array.isArray(oc.Point) && oc.Point.length ? oc.Point.map((r, n) => (
                                                                                                            <tr className="border-bottom text-center" key={n}>
                                                                                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{r.SLNo}</span></td>
                                                                                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0 btn">{r.From}</span></td>
                                                                                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0 btn ">&#8651;</span></td>
                                                                                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{r.To}</span></td>
                                                                                                                <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{r.Rate}</span> </td>
                                                                                                                <td className="p-0"><span className="d-block fs-6 fw-bold text-center text-dark p-0"><i class="fad fa-times"
                                                                                                                    onClick={() => { setRateModalShow(true); setRateItem(r) }}></i></span> </td>

                                                                                                            </tr>
                                                                                                        )) : null}


                                                                                                </tbody>
                                                                                            </table>


                                                                                            : null
                                                                                        : null
                                                                                    }
                                                                                </td>
                                                                            </tr>



                                                                        </tbody>))}

                                                            </table>
                                                            :
                                                            Array.isArray(item.SecondCond) && item.SecondCond.length ?
                                                                <table className={`table table-borderless table-responsive d-table mt-1 mb-0`}>
                                                                    <thead>
                                                                        <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">#</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">SLNo</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Condition Title</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Type</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Rate/Value</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Currency</span></th>
                                                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span></th>
                                                                            <th className="p-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                                                                        </tr>
                                                                    </thead>
                                                                    {
                                                                        item.SecondCond.map((oc, c) => (
                                                                            <tbody>
                                                                                <tr className="border-bottom border-top text-center" key={oc.id}>
                                                                                    <td className="border-right p-1">
                                                                                        {oc.Currency === "Array[]" ?
                                                                                            <button className="btn py-0 px-1" onClick={() => setExpand(Expand === oc.id ? false : oc.id)}>
                                                                                                <i className={`fs-6 text-dark ${Expand !== oc.id ? "fad fa-chevron-up" : "fad fa-chevron-down"} `} />
                                                                                            </button>
                                                                                            :
                                                                                            <i class="fad fa-dot-circle"></i>
                                                                                        }
                                                                                    </td>

                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.SLNo}</span></td>
                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">{oc.Title}</span></td>
                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Type}</span></td>
                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Rate ? oc.Rate : "N/A"}</span></td>
                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Currency ? oc.Currency : "N/A"}</span></td>
                                                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-center text-dark px-2">{oc.Status ? "Active" : "Deactive"}</span></td>
                                                                                    <td className="p-1">
                                                                                        <button className="btn text-dark py-0 px-2" onClick={() => { setItem(oc); setModalShow(true) }}><i className="fs-6 fad fa-trash-alt" /></button>
                                                                                        <button className="btn text-dark py-0 px-2" onClick={() => { setItem(oc); setShowUpdateOC(true) }}><i className="fs-6 fad fa-edit" /></button>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}

                                                                </table>
                                                                : null
                                                    }

                                                </td>
                                            </tr>

                                        </thead>

                                    </table>
                                ))
                                :
                                <p className="fs-4 fw-bold d-flex justify-content-center mt-3">No condition has found</p>
                            }

                            <DeleteMessage
                                FullName={Item.CondTitle}
                                show={ModalShow}
                                Click={(e) => DeleteCond(Item.id)}
                                onHide={() => setModalShow(false)}
                            />
                            <DeleteMessage
                                FullName={`${RateItem.From} to ${RateItem.To}`}
                                show={RateModalShow}
                                Click={(e) => DeleteRate(e)}
                                onHide={() => setRateModalShow(false)}
                            />
                            <Implement
                                header="Implement a new condition chart"
                                body_header="Do you want to implement condition chart?"
                                body="Please click ok to implement or close to deny"
                                show={ImpModal}
                                Click={() => UpdateImp()}
                                onHide={() => setImpModal(false)}
                            />
                            <CreatePolicyModal
                                list={list}
                                setList={setList}
                                onReload={() => Conditions()}
                                show={ShowCreatePolicy}
                                onHide={() => setShowCreatePolicy(false)}
                            />
                            <OtherModal
                                CondID={ViewItemID}
                                list={list}
                                setList={setList}
                                onReload={() => Conditions()}
                                show={ShowOtherPolicy}
                                onHide={() => setShowOtherPolicy(false)}
                            />
                            <SecondModal
                                CondID={ViewItemID}
                                list={list}
                                setList={setList}
                                onReload={() => Conditions()}
                                show={ShowSecondPolicy}
                                onHide={() => setShowSecondPolicy(false)}
                            />
                            {Item ?
                                <OtherUpdateModal
                                    Data={Item}
                                    list={list}
                                    setList={setList}
                                    onReload={() => Conditions()}
                                    show={ShowUpdateOC}
                                    onHide={() => { setItem(false); setShowUpdateOC(false) }}
                                /> : null}
                            {Item ?
                                <DeleteMessage
                                    FullName={`${Item.Title}`}
                                    show={ShowDeleteOC}
                                    Click={(e) => DeleteOC(e)}
                                    onHide={() => setShowDeleteOC(false)}
                                /> : null}
                            {Item ?
                                <UpdatePolicyModal
                                    Data={Item}
                                    list={list}
                                    setList={setList}
                                    onReload={() => Conditions()}
                                    show={ShowUpdatePolicy}
                                    onHide={() => { setItem(false); setShowUpdatePolicy(false) }}
                                />
                                : null}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    CompanyID: JSON.parse(localStorage.getItem("user")).CompanyID,
    BranchID: JSON.parse(localStorage.getItem("user")).BranchID
});

export default connect(mapStateToProps, { logout })(Policy);