import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchRecallProducts } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { EditModal } from './ModalForm';
let today = new Date();

const Return = ({ display, list, setList, scale, sub_scale }) => {
    const [InitData, setInitData] = useState(null)
    const [BranchFilter, setBranchFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')
    const [Data, setData] = useState(null)
    const [CS_Date, setCS_Date] = useState(today)

    const [FilterData, setFilterData] = useState(null)
    const [View, setView] = useState(false)
    const [Item, setItem] = useState(false)
    const [EditModalShow, setEditModalShow] = useState(false)
    const [SearchKey, setSearchKey] = useState('')
    const [locale, setLocale] = useState('en');

    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        RecallFarm();
    }, [])

    const RecallFarm = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchRecallProducts();
        setData(result);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CalculateAge = (Dispatch) => {
        let BirthDate = new Date(Dispatch);
        let tod = new Date(CS_Date).getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = days_diff + " Days";
        return age;
    }


    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_search = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Title) : null;
    let unique_branch = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.BranchName) : null;

    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && RepFilter && SearchKey ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.id === SearchKey.value :
            BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                    BranchFilter ? item.BranchID === BranchFilter.value :
                        RepFilter ? item.RepID === RepFilter.value :
                            SearchKey ? item.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, BranchID, BranchName, FarmID, BatchID, RepID, RepName, Title, IssueDate, Sell, Status, details, Dispatched, Closing, InvoiceNo, Contact, SaleMapID, ItemCode, ProductTitle, Qty, Weight, SubTotal }) {
        return { id, BranchID, BranchName, FarmID, BatchID, RepID, RepName, Title, IssueDate, Sell, Status, details, Dispatched, Closing, InvoiceNo, Contact, SaleMapID, ItemCode, ProductTitle, Qty, Weight, SubTotal };
    }) : null

    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.RepName) : null;

    const history = useHistory();

    // const LoadInvoice = async () => {
    //     dispatch({ type: DISPLAY_OVERLAY, payload: true });
    //     var result = await FetchInvoice(Item.InvoiceNo);
    //     if (result.status === 200) {
    //         setData(result.data[0]);
    //     }
    //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
    // }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header m-0">
                <p className="display-6 d-flex justify-content-center m-0">Recallable Farms</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/recall_products">Recallable Farms</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-11 h-100 px-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className="d-flex justify-content-around p-0">
                        <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{Array.isArray(Data) && Data.length ? "Farms: " + Data.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                        {/* {
                            Array.isArray(Count) && Count.length ? Count.map((item, i) => (
                                <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{item.name + " " + item.value.toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                            )) : null
                        } */}
                    </div>
                </div>
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">
                        <div className="d-flex justify-content-center mx-2" style={{ width: "300px" }}>
                            <Datepicker
                                selected={CS_Date}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                // onChange={(e) => DateHandler(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                        </div>
                        <div className="d-flex justify-content-center mx-2 w-25">
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
                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.FarmID + ". " + item.Title, value: item.id })) : []}
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

                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "75%" }}>
                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterFarms) && FilterFarms.length ?
                                FilterFarms.map((item, i) => (
                                    <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3 p-0" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3 p-0"} key={i}>
                                        <div Title="Click to receive product in stock" className={`justify-content-center align-items-center box thumbnail card py-0 shadow-none m-0 h-100`}>
                                            <div className="img-event mx-auto d-flex flex-column justify-content-center align-items-center h-100" style={{ minHeight: "8vh" }}>
                                                <img src={item ? item.details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                    className="img-fluid" alt="avatar"
                                                    style={{ minWidth: "10vh" }} width="20px" height="20px" />
                                            </div>

                                            <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2" style={{ minHeight: "15vh" }}>
                                                <div className='d-flex justify-content-around align-items-center border-bottom'>
                                                    <p className="group inner list-group-item-text m-0 px-2">
                                                        <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">
                                                            <Link Title="Go to farms to view active batch" to={`/fwr_farm_ladger/${item.FarmID}/${item.BatchID}`}>{item.FarmID + ". " + item.Title}</Link>
                                                        </p>
                                                        <p className="group card-title inner list-group-item-text fw-bold m-0">
                                                            <Link Title="Go to user profiles" to='#'
                                                            // to={`/user_profile/${item.details.UserID}`}
                                                            >{item.details.UserID + ". " + item.details.FullName}</Link>
                                                        </p>
                                                        <p className="text-muted m-0">{"Issuded: " + moment(item.IssueDate).format("DD MMM YYYY")}</p>
                                                        <p className="text-muted m-0">{"Dispatched: " + moment(item.Dispatched).format("DD MMM YYYY")}</p>
                                                        <p className="text-muted m-0">{"Contact No: " + item.Contact}</p>
                                                    </p>
                                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "60px" }} />
                                                    <p className="group inner list-group-item-text m-0 px-2">
                                                        <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.RepID + ". " + item.RepName + " (" + item.BranchName + ")"}</p>
                                                        <span className="fs-6 fw-bolder text-left text-dark">{"Closing: " + moment(item.Closing).format("DD MMM YYYY") + " | " + CalculateAge(item.Dispatched)}</span>
                                                        <div className="m-0 text-success">
                                                            <span>Invoice No: </span>
                                                            <Link title="Show Invoice" className="btn fs-5 px-1 py-0 text-dark" to={`/prv_dispatch_invoice/${item.InvoiceNo}`}>
                                                                <i className="fad fa-eye"></i> {item.InvoiceNo}
                                                            </Link>
                                                        </div>
                                                        <p className="m-0 text-success">{item.ProductTitle}</p>
                                                        <p className="m-0 text-success">{"Code: " + item.ItemCode + " | Quantity: " + item.Qty + " | Weight: " + item.Weight}</p>
                                                    </p>
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center mt-2'>
                                                    <Link Title="Received" style={{ borderRadius: "15px" }} className="btn btn-outline-success fw-bold mr-2 px-2"
                                                        onClick={() => { setEditModalShow(true); setItem(item) }}
                                                        to="#"><i className="fad fa-inbox-in"></i> Received</Link>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-4 fw-bold text-success m-0'>No farm found!</p>
                                </div>
                        }

                    </div>
                </div>
            </div >

            {Item ?
                <EditModal
                    list={list}
                    setList={setList}
                    EditData={Item}
                    show={Item ? EditModalShow : false}
                    EditReload={() => RecallFarm()}
                    EditHide={() => { setEditModalShow(false); setItem(false) }}
                /> : null}
        </div >
    );
}

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(Return);