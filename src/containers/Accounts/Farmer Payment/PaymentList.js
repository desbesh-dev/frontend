import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchAllFarmPayment, LoadMyFarms } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const PaymentList = ({ display }) => {
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();
    const [BranchFilter, setBranchFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')
    const [SearchKey, setSearchKey] = useState('')

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        // MyFarms();
        GetPaymentList();
    }, [])

    const MyFarms = async () => {
        var result = await LoadMyFarms();
        setData(result.farms);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const GetPaymentList = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchAllFarmPayment();
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_branch = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.BranchName) : null;
    let unique_status = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Status) : null;

    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && RepFilter && SearchKey ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.FarmID === SearchKey.value :
            BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                BranchFilter ? item.BranchID === BranchFilter.value :
                    RepFilter ? item.RepID === RepFilter.value :
                        SearchKey ? item.FarmID === SearchKey.value :
                            true

        return BothValue
    }).map(function ({ id, BranchID, BranchName, BatchID, BatchNo, UserID, Image, FarmID, Title, FullName, Status, RepID, RepName, Dispatched, Account }) {
        return { id, BranchID, BranchName, BatchID, BatchNo, UserID, Image, FarmID, Title, FullName, Status, RepID, RepName, Dispatched, Account };
    }) : null

    let unique_search = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.Title) : null;
    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.RepName) : null;


    var arr = []
    const Summary = () => {
        FilterFarms.map(({ Account }) => arr.push(...Account))
        var result = [];
        arr.reduce(function (res, value) {
            if (!res[value.AccountTitle]) {
                res[value.AccountTitle] = { AccountTitle: value.AccountTitle, Balance: 0 };
                result.push(res[value.AccountTitle])
            }
            res[value.AccountTitle].Balance += value.Balance;
            return res;
        }, {})
        let total = arr.reduce((prev, next) => prev = prev + parseFloat(next.Balance, 10), 0);

        return (
            Array.isArray(result) && result.length ? result.map((item, i) => (
                <>
                    {i === 0 ?
                        <p className='text-dark fs-5 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{"Total: " + total.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
                        : null}
                    <p className='text-dark fs-5 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}> {item.AccountTitle + ": " + item.Balance.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
                </>
            )) : null

        )
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Farmer Payment List</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/farmer_payment_list">Accounting</Link></li>
                        <li className="breadcrumb-item"><Link to="/farmer_payment_list">Farmer Payment</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-10 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className="d-flex justify-content-between p-0">
                        <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{Array.isArray(Data) && Data.length ? "Pending: " + Data.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                        {/* <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{"Total: " + Total.toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p> */}
                        {Array.isArray(FilterFarms) && FilterFarms.length ? Summary() : null}
                    </div>
                </div>
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">
                        <Fragment>
                            <div className="d-flex justify-content-center mx-2 w-50">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Array.isArray(unique_branch) && unique_branch.length ? unique_branch.map((item) => ({ label: item.BranchID + ". " + item.BranchName, value: item.BranchID })) : []}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Division"
                                    placeholder={"Branch"}
                                    styles={CScolourStyles}
                                    value={BranchFilter}
                                    onChange={(e) => setBranchFilter(e)}
                                    required
                                    id="Title"
                                    isClearable={true}
                                    isSearchable={true}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                />
                            </div>
                            <div className="d-flex justify-content-center mx-2 w-50">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Array.isArray(unique_rep) && unique_rep.length ? unique_rep.map((item) => ({ label: item.RepID + ". " + item.RepName, value: item.RepID })) : []}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Division"
                                    placeholder={"Representative"}
                                    styles={CScolourStyles}
                                    value={RepFilter}
                                    onChange={(e) => setRepFilter(e)}
                                    required
                                    id="RepFilter"
                                    isClearable={true}
                                    isSearchable={true}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                />
                            </div>
                        </Fragment>

                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.FarmID + ". " + item.Title, value: item.FarmID })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder={"Search"}
                                styles={CScolourStyles}
                                value={SearchKey}
                                onChange={(e) => setSearchKey(e)}
                                required
                                id="Title"
                                isClearable={true}
                                isSearchable={true}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                    </div>
                </div>


                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "80%" }}>

                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    {/* <Link to={`/rtl_sell/${item.details.UserID}`} */}
                                    <div className="box thumbnail card shadow-none m-0 h-100">

                                        <div className="img-event mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                                            <img
                                                src={item.Image ? process.env.REACT_APP_API_URL + "/Media/" + item.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid" alt="avatar"
                                                style={{ minWidth: "15vh" }} width="20px" height="20px" />
                                        </div>

                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2" style={{ minHeight: "15vh" }}>
                                            <p className="group inner list-group-item-text m-0">
                                                <small className="group card-title inner list-group-item-text fs-4 fw-bold px-1">
                                                    <Link Title="Go to farms to view active batch" to={`/farm_mng/${item.UserID}/${item.FarmID}/${item.BatchID}`}>{item.FarmID + ". " + item.Title}</Link>
                                                </small>
                                                <br />
                                                <small className='d-flex justify-content-between align-items-center bg-light px-1'>
                                                    <span className="text-muted fw-bold">Batch No- {item.BatchNo}, &nbsp; Batch ID- {item.BatchID}, &nbsp; </span>
                                                    <Link Title="Go to user profiles" to={`/user_profile/${item.UserID}`}>{item.UserID + ". " + item.FullName + ","}</Link>
                                                    <span className="text-muted fw-bold px-1">&nbsp; {item.BranchID + ". " + item.BranchName + " Branch,"}</span>
                                                    <span className="text-muted fw-bold px-1">&nbsp; Dispatch- {moment(item.Dispatched).format("DD MMM YYYY")}</span>
                                                </small>
                                                {/* <small className="text-muted">
                                                    {"H#" + item.details.HoldingNo + ", Word No- " + item.details.WardNo + ", Postal Code- " + item.details.PostalCode}<br />
                                                    {item.details.VillageName + ", " + item.details.Union + ", " + item.details.Upazila + ", " + item.details.Zila + ", " + item.details.Division}
                                                </small> */}

                                            </p>
                                            <div className="px-1 border-bottom">
                                                {
                                                    Array.isArray(item.Account) && item.Account.length ? item.Account.map((acc, i) => (
                                                        <table className="d-flex justify-content-between align-items-center">
                                                            <p className='m-0'> {acc.AccountTitle}</p>
                                                            <p className='m-0'> {parseFloat(acc.Balance).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                                                        </table>
                                                    ))
                                                        : null
                                                }
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center px-1 my-1">
                                                <p className='m-0 border border-warning text-warning px-2' style={{ borderRadius: "15px" }}>{item.Status === 0 ? "Batch Closed" : item.Status === 1 ? "Active" : item.Status === 2 ? "Request for batch review" : item.Status === 3 ? "Waiting for accounts approval" : item.Status === 4 ? "Paid" : item.Status === 5 ? "Payment hold" : null}</p>
                                                <Link to={`/farmer_payment_release/${item.BatchID}`} className='btn btn-outline-danger fw-bold m-0 py-0' style={{ borderRadius: "15px" }}>Proceed</Link>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            )) :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-4 fw-bold text-success m-0'>No payment found!</p>
                                </div>
                        }

                    </div>
                </div>
            </div >
        </div>
    );
}

const mapStateToProps = state => ({
    display: state.OverlayDisplay
});

export default connect(mapStateToProps, { logout })(PaymentList);