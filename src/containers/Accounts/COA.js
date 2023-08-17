import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { FetchSector, LoadAccounts, RemoveAcc } from '../../actions/APIHandler';
import { AllProductList } from '../../actions/APIHandler';
import { GetFarm, Invoice } from '../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import * as moment from 'moment'
import { DISPLAY_OVERLAY } from '../../actions/types';
import { InfoMessage } from "../Modals/ModalForm.js";
import Select from 'react-select';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';
// import { exportPDF } from '../Class/OrderPDF';
// import DatePicker from "../../Suppliers/Class/datepicker";
import { customHeader, locales } from "../Suppliers/Class/datepicker";

import DatePicker from "react-datepicker";
import Datepicker from 'react-datepicker';

// import required css from library
import "react-datepicker/dist/react-datepicker.css";
import { ViewModal } from './Modal/ViewModal';
import { CreateModal } from './Modal/CreateModal';
import { UpdateModal } from './Modal/UpdateModal';
import { DeleteMessage } from './Modal/DeleteModal';


const COA = ({ SectorID, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [ViewModalShow, setViewModalShow] = useState(false)
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const [SectorList, setSectorList] = useState(null)
    const [Fram, setFram] = useState(null)
    const [ActiveBatch, setActiveBatch] = useState(false)
    const [Accounts, setAccounts] = useState(false)
    const [scale, setscale] = useState(false)
    const [Subscale, setSubscale] = useState(false)
    const [Acc, setAcc] = useState(false)
    const [SubAcc, setSubAcc] = useState(false)
    const [ChildAcc, setChildAcc] = useState(false)

    let toastProperties = null;
    const dispatch = useDispatch();
    useEffect(() => {
        LoadAcc();
        getSector();
    }, [])

    const LoadAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadAccounts();

        if (result !== true) {
            setAccounts(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const getSector = async () => {
        var result = await FetchSector();
        if (result !== true) {
            setSectorList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const history = useHistory();

    const DeleteAcc = async e => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        let id = ChildAcc ? `${ChildAcc.id}` : SubAcc ? `${SubAcc.id}` : Acc ? ` ${Acc.id}` : null

        const result = await RemoveAcc(id);
        if (result !== true) {
            LoadAcc();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/voucher">COA</Link></li>
                    </ol>
                </nav>
                <p className="display-6 d-flex justify-content-center m-0">Chart of Accounts</p>
            </div>
            <div className="col-lg-8 h-100 p-0 justify-content-center">
                <ul className="tree p-4 bg-white">
                    <div className="d-flex justify-content-center mb-3">
                        <button className="btn btn-outline-light fs-5 fw-bolder text-center text-success text-uppercase" style={{ borderRadius: "15px" }}
                            onClick={() => setCreateModalShow(true)}>
                            <i class="fad fa-plus pr-2"></i>Create a new</button>
                    </div>
                    {
                        Array.isArray(Accounts) && Accounts.length ? Accounts.map((item, i) => (
                            <li class="branch fs-4 fw-bold w-100" key={i}>
                                <button className={`btn p-0 w-100 text-left fs-4 ${scale === item.main_acc.id ? "border-bottom" : null}`}
                                    onClick={() => setscale(scale === item.main_acc.id ? false : item.main_acc.id)}>
                                    <i class={`indicator ${scale === item.main_acc.id ? "fad fa-minus" : "fad fa-plus"} pr-1`}></i>
                                    {`${item.main_acc.COA_Title} [${item.main_acc.COA_Code}]`}
                                </button>
                                <ul>
                                    <li className={`branch ${scale === item.main_acc.id ? "d-block" : "d-none"}`}>
                                        <button className="btn p-0 text-left"
                                            onClick={() => { setAcc(item.main_acc); setCreateModalShow(true) }}
                                        >
                                            <i class="indicator fad fa-plus-circle pr-1"></i> Add New</button>
                                    </li>
                                    {
                                        Array.isArray(item.sub_acc) && item.sub_acc.length ? item.sub_acc.map((sub, n) => (
                                            <li className={`branch ${scale === item.main_acc.id ? "d-block" : "d-none"}`} key={n}>
                                                <button className={`btn p-0 text-left w-75 ${Subscale === sub.sub_acc.id ? "fw-bolder" : null}`}
                                                    onClick={() => setSubscale(Subscale === sub.sub_acc.id ? false : sub.sub_acc.id)}>
                                                    {`${sub.sub_acc.COA_Title} [${sub.sub_acc.COA_Code}]`}

                                                    {
                                                        Array.isArray(sub.child_acc) && sub.child_acc.length ?
                                                            <i class={`indicator ${Subscale === sub.sub_acc.id ? "fad fa-minus" : "fad fa-plus"} pl-2`}></i>
                                                            : null
                                                    }
                                                </button>
                                                <button className="btn p-0 text-left"
                                                    onClick={() => { setAcc(item.main_acc); setSubAcc(sub.sub_acc); setChildAcc(false); setViewModalShow(true) }}>
                                                    <i class="fs-6 fad fa-eye" ></i>
                                                </button>
                                                <ul>

                                                    <li className={`branch ${Subscale === sub.sub_acc.id && sub.sub_acc.TransType ? "d-block" : "d-none"}`}>
                                                        <button className="btn p-0 text-left"
                                                            onClick={() => { setAcc(item.main_acc); setSubAcc(sub.sub_acc); setCreateModalShow(true) }}
                                                        >
                                                            <i class="indicator fad fa-plus-circle pr-1 sm"></i> Add New</button>
                                                    </li>
                                                    {
                                                        Array.isArray(sub.child_acc) && sub.child_acc.length ? sub.child_acc.map((child, x) => (
                                                            <li className={`branch ${Subscale === sub.sub_acc.id ? "d-block d-flex align-items-center" : "d-none"}`} key={x}>
                                                                <button className={`btn py-2 text-left w-75 ${Subscale === sub.sub_acc.id ? "d-block" : "d-none"}`} key={x}>
                                                                    {`${child.COA_Title} [${child.COA_Code}]`}
                                                                </button>
                                                                <button className="btn p-0 text-left" onClick={() => { setAcc(item.main_acc); setSubAcc(sub.sub_acc); setChildAcc(child); setViewModalShow(true) }}>
                                                                    <i class="fs-6 fad fa-eye px-1"></i>
                                                                </button>
                                                            </li>
                                                        ))
                                                            :
                                                            null
                                                    }
                                                </ul>
                                            </li>
                                        ))
                                            :
                                            null
                                    }
                                </ul>
                            </li>
                        ))
                            :
                            null
                    }
                </ul>

            </div>
            {
                Acc || SubAcc || ChildAcc ?
                    <ViewModal
                        SectorID={SectorID}
                        Acc={Acc}
                        SubAcc={SubAcc}
                        ChildAcc={ChildAcc}
                        show={ViewModalShow}
                        list={list}
                        setList={setList}
                        onHide={() => { setViewModalShow(false); setAcc(false); setSubAcc(false); setChildAcc(false); }}
                        Update={() => { setUpdateModalShow(true); setViewModalShow(false); }}
                        Delete={() => { setDeleteModalShow(true); setViewModalShow(false); }}
                    />
                    : null
            }
            {
                <CreateModal
                    SectorID={SectorID}
                    Sectors={SectorList}
                    Acc={Acc}
                    SubAcc={SubAcc}
                    ChildAcc={ChildAcc}
                    show={CreateModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => LoadAcc()}
                    onHide={() => { setCreateModalShow(false); setAcc(false); setSubAcc(false); setChildAcc(false); }}
                />
            }
            {
                Acc || SubAcc || ChildAcc ?
                    <UpdateModal
                        SectorID={SectorID}
                        Acc={Acc}
                        SubAcc={SubAcc}
                        ChildAcc={ChildAcc}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => LoadAcc()}
                        onHide={() => { setUpdateModalShow(false); setAcc(false); setSubAcc(false); setChildAcc(false); }}
                    />

                    : null
            }

            {
                Acc || SubAcc || ChildAcc ?
                    <DeleteMessage
                        FullName={ChildAcc ? `${ChildAcc.COA_Title} [${ChildAcc.COA_Code}]` : SubAcc ? `${SubAcc.COA_Title} [${SubAcc.COA_Code}]` : Acc ? ` ${Acc.COA_Title} [${Acc.COA_Code}]` : null}
                        show={DeleteModalShow}
                        Click={(e) => DeleteAcc(e)}
                        onHide={() => setDeleteModalShow(false)}
                    />
                    : null
            }


        </div>

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BisID: props.match.params.id
});

export default connect(mapStateToProps, { logout })(COA);