import * as moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../../actions/auth';
import { connect, useDispatch } from 'react-redux';
import { RemoveBisBank, FetchBisBank, EnableBank } from '../../../../actions/APIHandler';

import { DISPLAY_OVERLAY } from '../../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { DeleteMessage } from "./Modals/DeleteModal.js";
import { AddBankModal, Implement } from './BankModal';

const Bank = ({ CompanyID, BranchID, SupplierID, user, PartyID, list, setList }) => {
    const [Error, setError] = useState({});
    const [Data, setData] = useState(false)
    const [AddBankModalShow, setAddBankModalShow] = useState(false);
    const [EnableBankModal, setEnableBankModal] = useState(false);
    const [BankID, setBankID] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);
    const [Item, setItem] = useState(false);
    const [Status, setStatus] = useState(false);
    const [UserData, setUserData] = useState(false)
    const dispatch = useDispatch();
    const history = useHistory();
    let toastProperties = null;

    useEffect(() => {
        LoadBisBanks();
    }, [])

    const LoadBisBanks = async () => {
        var result = await FetchBisBank(PartyID);
        if (result !== true) {
            setData(result);
        } else {
            history.push('/not_found');
        }
    }

    const BankHandler = (e, item) => {
        setStatus(e.target.checked ? false : true)
        setEnableBankModal(true);
        setBankID(item)
    }

    const DeleteBank = async (e) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveBisBank(BankID.id);
        if (result !== true) {
            LoadBisBanks();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const MakeEnable = async () => {
        setEnableBankModal(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await EnableBank(BankID.id, Status);
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
                LoadBisBanks();
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
                description: "Failed to enable bank. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    return (
        <div className="position-relative mb-5" style={{ height: "92%" }}>
            <div className="position-absolute overflow-auto my-1 w-100 h-100 bg-white">
                <div className="d-flex justify-content-center bg-white py-2 h-100">
                    <div className="col-md-6 justify-content-center align-items-center">

                        <div className="row m-0 justify-content-center mb-2">
                            <button className="btn border w-auto fs-4 fw-bold bg-white text-success text-uppercase" style={{ borderRadius: "50px" }}
                                onClick={() => setAddBankModalShow(true)}>
                                <i className="fs-4 fad fa-plus pr-2 border-right" /> Add New Bank Account
                            </button>
                        </div>
                        {
                            Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                                <div className="row border-left border-right border-light border-4 mt-2 py-1" style={{ borderRadius: "20px" }}>
                                    <div className="d-flex justify-content-between">
                                        <div className='col-md-9 p-0'>
                                            <div className='row'>
                                                <label className='fs-4 fw-bolder m-0 text-left'>{item.BankID.BankName}</label>
                                                <label className='fs-6 fw-bold m-0 text-left text-muted'>{item.BankID.BranchName} Branch</label>
                                                <label className='fs-6 fw-bold m-0 text-left'>Name: {item.AccName}</label>
                                                <label className='fs-6 fw-bold m-0 text-left'>A/C No: {item.AccNumber}</label>
                                            </div>
                                        </div>
                                        <div className='col-md-3 p-0 d-flex justify-content-center align-item-center'>
                                            <div className='row justify-content-center'>
                                                <button className='btn fs-3' onClick={() => { setBankID(item); setDeleteModalShow(true) }}><i class="fad fa-trash-alt"></i></button>
                                                <div className="form-check form-switch my-auto border w-auto justify-content-center" style={{ borderRadius: "15px" }}>
                                                    <input
                                                        class={`form-check-input pl-2`}
                                                        type="checkbox"
                                                        id={item.id}
                                                        name="Status"
                                                        checked={Status === item.id ? true : item.Status ? true : false}
                                                        onChange={(e) => BankHandler(e, item)}
                                                    />
                                                    <label class="form-check-label text-center fw-bold pr-2" for={item.id}>{Status === true ? "Enable" : "Disable"}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <label className='fs-6 fw-normal m-0 text-center border-top'><i class="fad fa-map-marker-alt"></i> {item.BankID.Address} {item.BankID.Telephone ? ", " + item.BankID.Telephone : null}</label>
                                </div>
                            )) : null}
                    </div>

                </div>
                <AddBankModal
                    UserID={""}
                    BusinessID={PartyID}
                    BatchID={Item.BatchID}
                    BankList={BankLists}
                    BranchList={BBLists}
                    show={AddBankModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => { LoadBisBanks(); setAddBankModalShow(false); }}
                    onHide={() => { setAddBankModalShow(false); }}
                />
                {BankID ?
                    <Implement
                        header={`${BankID.Status ? "Disable" : "Enable"} Bank Account`}
                        body_header={`Do you want to ${BankID.Status ? "disable" : "enable"} this bank account?`}
                        body={`A/C No- ${BankID.AccNumber}`}
                        show={EnableBankModal}
                        Click={() => MakeEnable()}
                        onHide={() => setEnableBankModal(false)}
                    />
                    : null}
                {BankID ?
                    <DeleteMessage
                        FullName={`${BankID ? BankID.AccName : null} bank account`}
                        show={DeleteModalShow}
                        Click={(e) => DeleteBank(e)}
                        onHide={() => setDeleteModalShow(false)}
                    />
                    : null}

            </div>
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Bank);
