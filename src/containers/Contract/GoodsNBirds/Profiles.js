import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Button, Modal, Spinner } from "react-bootstrap";
import { logout, checkToken } from '../../../actions/auth';
import { LoadProfile, LoadMyUsers } from '../../../actions/APIHandler';
import { LoadBusiness, BISTerminate, RemoveBatch } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { BusinessReg, BusinessUpdate } from './BusinessModal';
import { BatchIssuance } from './BatchIssuance';
import { DetailsModal } from './DetailsModal';
import { BatchUpdateModal } from './BatchUpdateModal';
import { BatchDetailsModal } from './BatchDetailsModal';
// import { ContractUpdate } from '../../Contract/ContractUpdate';
import { DeleteMessage } from "../../Modals/DeleteModal";
import { FaList, FaBorderAll } from "react-icons/fa";
import { AiOutlineScan } from "react-icons/ai";
import { Select } from 'semantic-ui-react';
import axios from 'axios';


const Profiles = ({ display, UserID, list, setList, scale, sub_scale }) => {
    const [Data, setData] = useState(null);
    const [View, setView] = useState(false);
    const [ConReg, setConReg] = useState(false);
    const [SubDealerReg, setSubDealerReg] = useState(false);
    const [PartyReg, setPartyReg] = useState(false);
    const [CustomerReg, setCustomerReg] = useState(false);
    const [BType, setBType] = useState(false);
    const [ModalShow, setModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);
    const [ModDetails, setModDetails] = useState(false);
    const [ModBatchDetails, setModBatchDetails] = useState(false);
    const [Item, setItem] = useState(false);
    const [Batch, setBatch] = useState(false);
    const [BatchUpdate, setBatchUpdate] = useState(false);
    const [Issue, setIssue] = useState(false);
    const [BatchNo, setBatchNo] = useState(false);
    const [Business, setBusiness] = useState(false);
    const [BusinessID, setBusinessID] = useState(false);
    const [Expand, setExpand] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        CompanyID: "",
        BranchID: "",
        ID: "",
        Title: "",
        SecurityMoney: "",
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

    const { CompanyID, BranchID, ID, Title, SecurityMoney, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        MyUsers();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [])

    const MyUsers = async () => {
        if (localStorage.getItem("user") !== null) {
            var result = await LoadProfile(UserID);
            if (result !== true) {
                setData(result);
                setFormData({
                    ...formData,
                    CompanyID: result.UserInfo.CompanyID.id,
                    BranchID: result.UserInfo.BranchID.BranchID,
                    ID: result.UserInfo.id
                })
                MyBusiness(result.UserInfo.id)
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_user_lists');
        }
    }

    const MyBusiness = async (id) => {
        if (localStorage.getItem("user") !== null) {
            var result = await LoadBusiness(id);
            if (result !== true) {
                setBusiness(result);
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_user_lists');
        }
    }

    const LoadRef = async (RefID) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadProfile(RefID);
        setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DeleteBusiness = async e => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await BISTerminate(Item.id);
        if (result !== true) {
            MyUsers();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const DeleteBatch = async e => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveBatch(Batch.id);
        if (result !== true) {
            window.location.reload(false)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const FetchUser = async (id) => {
        var User_Data = await LoadProfile(id);
        history.push('/update_user', { UserData: User_Data });
    }


    return (
        <div className="row m-0" style={{ minWidth: "240px" }}>
            <div className="header mb-4">
                {
                    Data ?
                        <div className="row bg-white mb-2">
                            <div className="col-md-2 text-center d-flex justify-content-center p-2">
                                {/* <img class="rounded-circle" src="http://placehold.it/150x150" width="150" alt="Generic placeholder image" /> */}
                                <img
                                    src={Data.Details.Image ? process.env.REACT_APP_API_URL + Data.Details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                    className="img-fluid my-auto" alt="avatar"
                                    style={{ minWidth: "15vh" }} width="20px" height="20px" />
                            </div>
                            <div className="col-md-4 text-md-left my-auto">
                                <p className="fs-5 m-0">
                                    <p className="fs-4 fw-bold m-0">{Data.Details.FullName}</p>
                                    <p className="fs-5 fw-bold m-0">{Data.UserInfo.MobileNo + ", " + Data.UserInfo.email}</p>
                                    <p className="fs-5 fw-normal m-0">
                                        {"H#" + Data.Details.HoldingNo + ", Word No- " + Data.Details.WardNo + ", Postal Code- " + Data.Details.PostalCode}<br />
                                        {Data.Details.VillageName + ", " + Data.Details.Union + ", " + Data.Details.Upazila + ", " + Data.Details.Zila + ", " + Data.Details.Division}
                                    </p>
                                </p>
                            </div>

                            <div className="col-lg-1">
                                <div className="cs_outer" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                            </div>

                            <div className="col-md-5 text-md-right my-auto">
                                <p className="fs-5 m-0">
                                    <p className="fs-4 fw-bold m-0">{Data.UserInfo.BranchID.BranchID + ". " + Data.UserInfo.BranchID.Name + " Branch"}</p>
                                    <p className="fs-5 fw-bold m-0">{"User Id- " + Data.UserInfo.id}</p>
                                    <p className="text-muted fw-bold m-0">{"Since " + new Date(Data.UserInfo.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
                                    <Link to={`/user_profile/${Data.Ref.RefID}`} className="fs-5 fw-bold m-0" onClick={() => LoadRef(Data.Ref.RefID)}>{"Ref: " + Data.Ref.RefName}</Link>
                                </p>
                                {
                                    scale === 6 || (scale === 3 && sub_scale === 10) ?
                                        <button className="btn fs-6 fw-bold text-dark" onClick={() => FetchUser(Data.UserInfo.id)}><i class="fad fa-edit" /> Update</button>
                                        : null
                                }
                            </div>
                        </div>
                        : null
                }
                <div className="row bg-white">
                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"1"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Layer</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"2"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Contract</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"1"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Private</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Debit</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Credit</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Balance</p>
                    </div>
                </div>

            </div>

            <div className="header row m-0 justify-content-center">
                <button className="col-lg-6 col-md-6 col-sm-6 btn border fs-4 fw-bold bg-white text-success"
                    style={{ borderRadius: "50px" }}
                    onClick={() => setBType(true)}>
                    <i className="fs-4 fad fa-plus pr-2 border-right" /> CREATE A BUSINESS
                </button>

                {/* Business Types */}
                <Modal
                    show={BType}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header className="py-2" closeButton onClick={() => setBType(false)}>
                        <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">Please Select Business type</p>
                    </Modal.Header>
                    <Modal.Body className="d-flex justify-content-center">
                        <div className="btn-group-vertical w-50">
                            <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center" style={{ borderRadius: "50px" }}
                                onClick={() => { setBType(false); setConReg(true) }}>
                                <i className="fs-4 fad fa-file-contract pr-2 border-right mr-2" style={{ width: "30px" }} /> CONTRACT
                            </button>

                            <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center" style={{ borderRadius: "50px" }}
                                onClick={() => { setBType(false); setSubDealerReg(true) }}>
                                <i className="fs-4 fad fa-user-tie pr-2 border-right mr-2" style={{ width: "30px" }} /> SUB-DEALER
                            </button>

                            <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center" style={{ borderRadius: "50px" }}
                                onClick={() => { setBType(false); setPartyReg(true) }}>
                                <i class="fs-4 fad fa-handshake-alt pr-2 border-right mr-2" style={{ width: "30px" }} /> PARTY
                            </button>

                            <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center" style={{ borderRadius: "50px" }}
                                onClick={() => { setBType(false); setCustomerReg(true) }}>
                                <i className="fs-4 fad fa-shopping-cart pr-2 border-right mr-2" style={{ width: "30px" }} /> CUSTOMER
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            <table className={`header table table-hover table-borderless table-responsive card-1 d-table mt-3`} style={{ maxHeight: "70%" }}>
                <thead>
                    <tr className="text-center">
                        <td className="p-1" colspan="10"><p className="fs-4 fw-bolder text-center m-0">BUSINESS/FARMS</p></td>
                    </tr>
                    <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">#</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Type</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Id</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Title</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Since</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Security</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Total Batch</span></th>
                        <th className="border-right p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Running</span></th>
                        <th className="border-0 p-2"><span className="fs-6 fw-bolder text-dark text-uppercase">Action</span></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.isArray(Business) && Business.length ? Business.map((item, i) => (
                            <>
                                <tr className="border-bottom text-center" key={i}>
                                    <td className="border-right p-1">
                                        <button className="btn p-1" onClick={() => setExpand(Expand === i ? false : i)}>
                                            <i className={`fs-6 text-dark ${Expand === i ? "fad fa-chevron-up" : "fad fa-chevron-down"} `} />
                                        </button>
                                    </td>
                                    <td className="border-right p-1">
                                        <span className="d-block fs-5 fw-bold text-left text-dark text-uppercase">{item.TypeID === 1 ? item.Type + "- " + item.CondID.Title : item.Type}</span>
                                    </td>
                                    <td className="border-right p-1">{Array.isArray(item.batches) && item.batches.length ? item.batches.map(x => parseInt(x.Status) === 1 ? <Link className="d-block fs-6 fw-bold text-center text-dark btn px-2" to={`/farm_mng/${UserID}/${item.id}/${x.id}`}>{item.id}</Link> : null) : item.id}
                                    </td>
                                    <td className="border-right p-1" > <Link className="d-block fs-6 fw-bold text-left text-dark btn px-2" to={`/business_pro/${UserID}/${item.id}`}>{item.Title}</Link></td>
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.Balance}</span> </td>
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.SCMoney}</span> </td>
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark">{item.count}</span> </td>
                                    <td className="border-right p-1">
                                        <span className="d-block fs-6 fw-bold text-center text-dark">
                                            {Array.isArray(item.batches) && item.batches.length ? item.batches.map(x => x.Status === 1 ? x.BatchNo : null) : "N/A"}
                                        </span>
                                    </td>
                                    <td className="p-1">
                                        <button className="btn text-dark p-1" onClick={() => { setBatchNo(item.count); setBusinessID(item.id); setIssue(true) }}><i className="fs-6 fad fa-plus" /></button>
                                        <button className="btn text-dark p-1" onClick={() => { setBUp(true); setItem(item) }} ><i className="fs-6 fad fa-edit" /></button>
                                        <button className="btn text-dark p-1" onClick={() => { setModalShow(true); setItem(item) }} ><i className="fs-6 fad fa-trash-alt" /></button>
                                        <button className="btn text-dark p-1" onClick={() => { setModDetails(true); setItem(item) }}><i className="fs-6 fad fa-eye" /></button>
                                        {/* <Link className="btn text-dark p-1" to={`/business_pro/${UserID}/${item.id}`}><i className="fs-6 fad fa-eye" /></Link> */}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-0" colspan="10">
                                        {i === Expand ?
                                            Array.isArray(item.batches) && item.batches.length ?
                                                <table className={`table table-hover table-responsive card-1 d-table m-0 rounded-0 my-1 text-primary`} style={{ maxHeight: "70%" }}>
                                                    <thead>
                                                        <tr className="text-center border-top bg-light" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">No</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Id</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Condition</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Issue Date</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Batch Size</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Net Pay</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Saving</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">P/L</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">FCR</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">ABW</span></th>
                                                            <th className="border-right p-0"><span className="fs-6 fw-bolder text-uppercase">Status</span></th>
                                                            <th className="border-0 p-0"><span className="fs-6 fw-bolder text-uppercase">Action</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            item.batches.map((batch, i) => (
                                                                <tr className="border-bottom text-center" key={i}>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.BatchNo}</span></td>
                                                                    <td className="border-right p-0"><Link className="d-block text-primary fs-6 fw-bold text-center btn px-2" to={`/farm_mng/${UserID}/${batch.BusinessID.id}/${batch.id}`}>{batch.id}</Link></td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.CondID.Title}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{new Date(batch.IssueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.Size}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.NetPay}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.Saving}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{"0.00"}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.FCR}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.ABW}</span> </td>
                                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{batch.Status ? "Active" : "Closed"}</span> </td>
                                                                    <td className="p-0">
                                                                        <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setBatchUpdate(true) }} ><i className="fs-6 fad fa-edit" /></button>
                                                                        <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setDeleteModalShow(true) }} ><i className="fs-6 fad fa-trash-alt" /></button>
                                                                        <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setModBatchDetails(true) }}><i className="fs-6 fad fa-eye" /></button>
                                                                    </td>

                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                                : null
                                            : null
                                        }
                                    </td>
                                </tr>
                            </>
                        ))
                            : null
                    }
                </tbody>

            </table>

            <BusinessReg
                CompanyID={CompanyID}
                BranchID={BranchID}
                UserID={ID}
                TypeID={ConReg ? 1 : SubDealerReg ? 2 : PartyReg ? 3 : CustomerReg ? 4 : 0}
                show={ConReg || SubDealerReg || PartyReg || CustomerReg}
                list={list}
                setList={setList}
                onHide={() => { setConReg(false); setSubDealerReg(false); setPartyReg(false); setCustomerReg(false) }}
                onReload={() => window.location.reload(false)()}
            />
            {
                BatchNo === 0 || BatchNo ?
                    <BatchIssuance
                        CompanyID={CompanyID}
                        BranchID={BranchID}
                        UserID={ID}
                        BusinessID={BusinessID}
                        BatchNo={parseInt(BatchNo) + 1}
                        show={Issue}
                        list={list}
                        setList={setList}
                        onReload={() => MyUsers()}
                        onHide={() => setIssue(false)}
                    />
                    : null
            }

            {
                Item ?
                    <>
                        <DeleteMessage
                            FullName={`${Item ? Item.Title : null}`}
                            show={ModalShow}
                            Click={(e) => DeleteBusiness(e)}
                            onHide={() => setModalShow(false)}
                        />
                        <BusinessUpdate
                            CompanyID={CompanyID}
                            BranchID={BranchID}
                            UserID={UserID}
                            item={Item}
                            show={BUp}
                            list={list}
                            setList={setList}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setBUp(false); setItem(false) }}
                        />
                        <DetailsModal
                            show={ModDetails}
                            item={Item}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setModDetails(false); setItem(false) }}
                            Update={() => { setBUp(true); setModDetails(false) }}
                            Delete={() => { setModalShow(true); setModDetails(false) }}
                        />
                    </>

                    : null
            }

            {
                Batch ?
                    <BatchUpdateModal
                        CompanyID={CompanyID}
                        BranchID={BranchID}
                        UserID={ID}
                        BusinessID={BusinessID}
                        BatchNo={parseInt(BatchNo)}
                        Data={Batch}
                        show={BatchUpdate}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)()}
                        onHide={() => { setBatchUpdate(false); setBatch(false) }}
                    />

                    : null
            }
            {
                Batch ?
                    <BatchDetailsModal
                        CompanyID={CompanyID}
                        BranchID={BranchID}
                        UserID={UserID}
                        item={Batch}
                        show={ModBatchDetails}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)()}
                        onHide={() => { setModBatchDetails(false); setBatch(false) }}
                        Update={() => { setBatchUpdate(true); setModBatchDetails(false); }}
                        Delete={() => { setModalShow(true); setModBatchDetails(false); }}
                    />

                    : null
            }


            {
                Batch ?
                    <DeleteMessage
                        FullName={`Batch- ${Batch.BatchNo}`}
                        show={DeleteModalShow}
                        Click={(e) => DeleteBatch(e)}
                        onHide={() => setDeleteModalShow(false)}
                    />
                    : null
            }

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    UserID: props.match.params.id,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,

});

export default connect(mapStateToProps, { logout })(Profiles);