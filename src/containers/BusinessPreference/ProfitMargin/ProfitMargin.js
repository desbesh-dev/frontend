import * as moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../actions/auth';
import { FetchProfitMargin, DeleteProfitMargin, MarginOperation } from '../../../actions/APIHandler';
import { getLabel } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';

import { CreateModal, UpdateModal, DeleteModal } from "./Modals/UpdateModal";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';
// import { exportPDF } from '../../Suppliers/Class/OrderPDF';

const ProfitMargin = ({ CompanyID, BranchID, BatchID, SupplierID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Item, setItem] = useState(false);
    const [MarginList, setMarginList] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        LoadProfitMargin();
    }, [])


    const LoadProfitMargin = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchProfitMargin();
        if (result !== true) {
            setMarginList(result);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DeleteMargin = async e => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteProfitMargin(Item.id);
        if (result !== true) {
            LoadProfitMargin();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>
            <div className="header mb-2">
                <p className="display-6 d-flex justify-content-center m-0">Account Settings</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center" m-0>
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/acc_settings">Account Settings</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="position-absolute overflow-auto my-1 w-100 h-100">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-12 justify-content-center align-items-center">
                        <p className="fs-4 d-flex fw-bold justify-content-center text-uppercase mt-3">Let's setup profit margin</p>
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-outline-light fs-5 fw-bolder text-center text-success text-uppercase" style={{ borderRadius: "15px" }}
                                onClick={() => setCreateModalShow(true)}>
                                <i class="fad fa-plus pr-2"></i>Create a new</button>
                        </div>
                        {
                            Array.isArray(MarginList) && MarginList.length ?
                                <table className={`table table-borderless table-responsive card-1 d-table`}>
                                    <thead>
                                        <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Title</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Profit Margin</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Currency</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Operation</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Updated At</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Updated By</span></th>
                                            <th className="border-right p-1"><span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span></th>
                                            <th className="p-1"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MarginList.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{i + 1}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0 btn">{item.Title}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0 btn ">{item.ProfitMargin}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{parseInt(item.Currency) === 0 ? "Percentage(%)" : parseInt(item.Currency) === 1 ? "BDT" : "N/A"}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                                    {item.Operation ? getLabel(parseInt(item.Operation), MarginOperation) : "N/A"}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{moment(item.UpdatedAt).format("DD MMM YYYY")}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.UpdatedBy}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Status ? "Active" : "Deactive"}</span> </td>
                                                <td className="p-1">
                                                    <button className="btn text-dark py-0 px-2"
                                                        onClick={() => { setItem(item); setDeleteModalShow(true) }}
                                                    ><i className="fs-6 fad fa-trash-alt" /></button>
                                                    <button className="btn text-dark py-0 px-2"
                                                        onClick={() => { setItem(item); setUpdateModalShow(true) }}
                                                    ><i className="fs-6 fad fa-edit" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                :
                                null
                        }

                    </div>
                </div>
            </div >
            <CreateModal
                show={CreateModalShow}
                list={list}
                setList={setList}
                onReload={() => LoadProfitMargin()}
                onHide={() => { setCreateModalShow(false) }}
            />
            {
                Item ?
                    <UpdateModal
                        Item={Item}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadProfitMargin() }}
                        onHide={() => { setItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            }
            {
                Item ?
                    <DeleteModal
                        FullName={Item.Title}
                        show={DeleteModalShow}
                        Click={(e) => DeleteMargin(e)}
                        onReload={() => { LoadProfitMargin() }}
                        onHide={() => { setItem(false); setDeleteModalShow(false) }}
                    />
                    : null
            }
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(ProfitMargin);