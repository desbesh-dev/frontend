import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { FarmMonitoring, FetchInitData, LoadBatchAssesment, RemoveInitialization } from '../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import { CreateModal, DeleteModal, SellModal, SellSummerizeModal } from '../FieldWork/BirdSell/BirdSellModal';
import { StockModal } from "../FieldWork/StockModal";
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { Transfer } from './GoodsNBirds/Modals/TransferModal';
let today = new Date();

const FieldMonitoring = ({ display, list, setList, scale, sub_scale }) => {
    const [InitData, setInitData] = useState(null)
    const [BranchFilter, setBranchFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')
    const [Data, setData] = useState(null)
    const [CS_Date, setCS_Date] = useState(today)

    const [FilterData, setFilterData] = useState(null)
    const [View, setView] = useState(false)
    const [Item, setItem] = useState(false)
    const [GodownItem, setGodownItem] = useState(false)
    const [AccItems, setAccItems] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [DeleteItem, setDeleteItem] = useState(false)
    const [SellModalShow, setSellModalShow] = useState(false)
    const [CreateModalShow, setCreateModalShow] = useState(false)
    const [StockModalShow, setStockModalShow] = useState(false)
    const [SummeryModalShow, setSummeryModalShow] = useState(false)
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const [TransferModalShow, setTransferModalShow] = useState(false)
    const [SearchKey, setSearchKey] = useState('')
    const [locale, setLocale] = useState('en');

    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms(today);
    }, [])

    const MyFarms = async (date) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FarmMonitoring(moment(date).format("YYYY-MM-DD"));
        setData(result.farms);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadInit = async (item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setItem(item)
        setInitData(null);
        var result = await FetchInitData(0, item.BatchID);
        if (result !== true) {
            setInitData(result.data);
            setSellModalShow(true)
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const FetchBatchAccount = async (id) => {
        var result = await LoadBatchAssesment(id, 1);
        if (result !== true) {
            setAccItems(result.data);
            setStockModalShow(true)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DeleteInvoice = async (e, inv) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveInitialization(inv);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Invoice',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                LoadInit(Item);
                setSellModalShow(true);
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to delete invoice. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };


    const CalculateAge = (DOB) => {
        let BirthDate = new Date(DOB);
        let tod = new Date(CS_Date).getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = "Age " + (days_diff - 1) + " Days";
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
    let unique_status = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.EntryStatus) : null;

    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && RepFilter && StatusFilter && SearchKey ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.EntryStatus === StatusFilter.value && item.id === SearchKey.value :
            BranchFilter && RepFilter && StatusFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.EntryStatus === StatusFilter.value :
                BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                    BranchFilter ? item.BranchID === BranchFilter.value :
                        RepFilter ? item.RepID === RepFilter.value :
                            StatusFilter ? item.EntryStatus === StatusFilter.value :
                                SearchKey ? item.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, BranchID, BranchName, FarmID, BatchID, RepID, RepName, Title, IssueDate, Sell, Status, details, EntryStatus, Mortality, FeedSent, Consumption, Stock, Remark, EntryFrom }) {
        return { id, BranchID, BranchName, FarmID, BatchID, RepID, RepName, Title, IssueDate, Sell, Status, details, EntryStatus, Mortality, FeedSent, Consumption, Stock, Remark, EntryFrom };
    }) : null

    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.RepName) : null;

    const history = useHistory();

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FarmMonitoring(date);
        if (result !== true) {
            setData(result.farms);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        setCS_Date(e)
    }

    let Count = Array.isArray(FilterFarms) && FilterFarms.length ? Object.values(FilterFarms.reduce((c, { EntryStatus }) => {
        c[EntryStatus] = c[EntryStatus] || { name: EntryStatus ? "Visited: " : "Not Visited: ", value: 0 };
        c[EntryStatus].value++;
        return c;
    }, {})) : null

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header m-0">
                <p className="display-6 d-flex justify-content-center m-0">Monitoring Cell</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/field_monitoring">Monitoring Cell</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-11 h-100 px-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className="d-flex justify-content-around p-0">
                        <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{Array.isArray(Data) && Data.length ? "Farms: " + Data.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                        {
                            Array.isArray(Count) && Count.length ? Count.map((item, i) => (
                                <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{item.name + " " + item.value.toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                            )) : null
                        }
                    </div>
                </div>
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">
                        <div className="d-flex justify-content-center mx-2" style={{ width: "300px" }}>
                            <Datepicker
                                selected={CS_Date}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => DateHandler(e)}
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
                        <div className="d-flex justify-content-center mx-2 w-50">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_status) && unique_status.length ? unique_status.map((item) => ({ label: item.EntryStatus ? "Visited" : "Not Visited", value: item.EntryStatus })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Status"
                                placeholder={"Status"}
                                styles={CScolourStyles}
                                value={StatusFilter}
                                onChange={(e) => setStatusFilter(e)}
                                required
                                id="Title"
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
                                        {/* <Link to={`/rtl_sell/${item.details.UserID}`} */}
                                        <Link Title="Click to make invoice" to={`/fwr_light_record/${item.FarmID}/${item.BatchID}`}
                                            className={`justify-content-center align-items-center box thumbnail card py-0 shadow-none m-0 h-100`} style={item.EntryStatus ? null : { background: "#F4F5F5", border: "1px solid red" }}>

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
                                                        <p className="text-muted m-0">
                                                            {moment(item.IssueDate).format("DD MMM YYYY") + " | " + CalculateAge(item.IssueDate)}
                                                        </p>
                                                        <span className="fs-6 fw-bolder text-left text-dark">{item.EntryStatus ? " (Visited)" : "(Not Visited)"}</span>
                                                    </p>
                                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "60px" }} />
                                                    <p className="group inner list-group-item-text m-0 px-2">
                                                        <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.RepID + ". " + item.RepName + " (" + item.BranchName + ")"}</p>
                                                        {item.EntryStatus ?
                                                            <Fragment>
                                                                <small className="text-muted fw-bold m-0">{item.Mortality !== undefined ? "Expire: " + item.Mortality + " PCS" : null}</small>
                                                                <br />
                                                                <small className="text-muted fw-bold m-0">{item.FeedSent !== undefined ? "Feed: " + item.FeedSent + "BG / Cons: " + (item.Consumption).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG / Stock: " + (item.Stock).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" : null}</small>
                                                                <br />
                                                                <small className="text-muted fw-bold m-0">{item.Remark !== undefined ? "Health: " + item.Remark : null}</small>
                                                                <br />
                                                                <small className="text-muted fw-bold m-0">{item.EntryFrom !== undefined ? item.EntryFrom : null}</small>
                                                            </Fragment>
                                                            : null}
                                                    </p>
                                                </div>
                                                {(parseInt(item.Status) === 1 || parseInt(item.Status) === 2) && (scale === 6 || (scale === 3 && (sub_scale === 4 || sub_scale === 6 || sub_scale === 9 || sub_scale === 10))) ?
                                                    <div className='d-flex justify-content-center align-items-center mt-2'>
                                                        {/* <Link Title="Daily Record" style={{ borderRadius: "15px" }} className="text-success fw-bold ml-2 px-1 border-light border-left border-right" to={`/light_record/${item.FarmID}/${item.BatchID}`}>Entry</Link> */}
                                                        {
                                                            item.Sell ?
                                                                <Link to="#" Title="Sell" style={{ borderRadius: "15px" }} className="btn btn-outline-success fw-bold mr-2 px-2" onClick={() => LoadInit(item)}>Sell</Link> : null}
                                                        {/* <Link Title="Sell Report" style={{ borderRadius: "15px" }} className="text-success fw-bold mr-2  px-1 border-left border-right" to={`/fwr_sell_report/${item.FarmID}/${item.BatchID}/${0}/${0}`} >Report</Link> */}

                                                        <Link Title="Daily Record" style={{ borderRadius: "15px" }} className="btn btn-outline-success fw-bold mr-2 px-2" to={`/fwr_farm_record/${item.FarmID}/${item.BatchID}`} >Record</Link>

                                                        <Link Title="Batch Closing" style={{ borderRadius: "15px" }} className="btn btn-outline-success fw-bold mr-2 px-2" onClick={() => FetchBatchAccount(item.BatchID)} to="#">Closing</Link>
                                                    </div>
                                                    : null
                                                }

                                            </div>

                                        </Link>
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

            {
                InitData ?
                    <SellModal
                        Godown={true}
                        show={SellModalShow}
                        list={list}
                        setList={setList}
                        Data={InitData}
                        onHide={() => { setSellModalShow(false) }}
                        Create={() => { setCreateModalShow(true); setSellModalShow(false); }}
                        onStock={(item) => { setStockItem(item); setCreateModalShow(false); setSellModalShow(false); setSummeryModalShow(true); }}
                        onGodown={(item) => { setGodownItem(Item); setCreateModalShow(false); setSellModalShow(false); setTransferModalShow(true); }}
                        onRemove={(item) => { setDeleteItem(item); setSellModalShow(false); setDeleteModalShow(true); }}
                    /> : null
            }
            {
                Item ?
                    <CreateModal
                        GodownID=''
                        BusinessID={Item.FarmID}
                        BatchID={Item.BatchID}
                        show={CreateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadInit(Item); setCreateModalShow(false); setSellModalShow(true); }}
                        onHide={() => { setCreateModalShow(false); }}
                    /> : null
            }
            {
                AccItems ? !AccItems.error ?
                    <StockModal
                        stock_data={AccItems}
                        show={StockModalShow}
                        list={list}
                        set_list={setList}
                        // onReload={() => setStockModalShow(false)}
                        onHide={() => { setAccItems(false); setStockModalShow(false); }}
                    /> : null : null
            }
            {
                StockItem ?
                    <SellSummerizeModal
                        Data={StockItem}
                        show={SummeryModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadInit(Item); setSummeryModalShow(false); setCreateModalShow(false); setSellModalShow(true); }}
                        onHide={() => { setStockItem(false); setSummeryModalShow(false); setSellModalShow(true); }}
                    /> : null
            }
            {
                DeleteItem ?
                    <DeleteModal
                        MsgHeader={"Remove Initialization"}
                        HeaderTitle={DeleteItem.InvoiceNo + " with agent name " + DeleteItem.PartyAgent}
                        Msg={"Are you sure to remove initialization with party " + DeleteItem.PartyAgent + "? All of sell quantity & weight permanently wiped."}
                        show={DeleteModalShow}
                        onDelete={(e) => DeleteInvoice(e, DeleteItem.InvoiceNo)}
                        onHide={() => { setDeleteModalShow(false); setSellModalShow(true); }}
                    /> : null
            }
            {
                GodownItem ?
                    <Transfer
                        Data={GodownItem}
                        show={TransferModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { MyFarms(CS_Date); LoadInit(Item); setGodownItem(false); setTransferModalShow(false); setSellModalShow(true); }}
                        onHide={() => { LoadInit(Item); setGodownItem(false); setTransferModalShow(false); setSellModalShow(true); }}
                    />
                    : null
            }
        </div >
    );
}

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(FieldMonitoring);