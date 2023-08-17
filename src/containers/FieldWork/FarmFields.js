import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { FetchInitData, LoadBatchAssesment, LoadMyFarms, RemoveInitialization } from '../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import { CreateModal, DeleteModal, SellModal, SellSummerizeModal } from './BirdSell/BirdSellModal';
import { StockModal } from "./StockModal.js";


const FarmFields = ({ display, list, setList, scale, sub_scale }) => {
    const [InitData, setInitData] = useState(null)
    const [Data, setData] = useState(null)
    const [FilterData, setFilterData] = useState(null)
    const [View, setView] = useState(false)
    const [Item, setItem] = useState(false)
    const [AccItems, setAccItems] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [DeleteItem, setDeleteItem] = useState(false)
    const [SellModalShow, setSellModalShow] = useState(false)
    const [CreateModalShow, setCreateModalShow] = useState(false)
    const [StockModalShow, setStockModalShow] = useState(false)
    const [SummeryModalShow, setSummeryModalShow] = useState(false)
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const [SearchKey, setSearchKey] = useState('')

    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms();
    }, [])

    const MyFarms = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadMyFarms();
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
        let today = new Date();
        let BirthDate = new Date(DOB);
        let tod = today.getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = (days_diff - 1) + " Days";
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


    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = SearchKey ? item.id === SearchKey.value : true;

        return BothValue
    }).map(function ({ id, FarmID, BatchID, Title, IssueDate, Sell, Status, MobileNo, EntryStatus, details }) {
        return { id, FarmID, BatchID, Title, IssueDate, Sell, Status, MobileNo, EntryStatus, details };
    }) : null

    const history = useHistory();


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">My Field</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/field_work">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/fwr_fields">Field Work</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 px-0">
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button className="btn rounded-0 rounded-start border-right d-flex align-items-center" id="list">
                                <i class="fad fs-3 fa-qrcode text-dark"></i>
                            </button>
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

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn rounded-0 rounded-end border-left d-flex align-items-center" id="grid" title="View"
                                onClick={() => setView(View ? false : true)}>
                                <i class={`fad fs-3 text-dark ${View ? "fa-th-list" : "fa-th"}`}></i>
                            </button>
                        </div>

                    </div>
                </div>
                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "75%" }}>
                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterFarms) && FilterFarms.length ?
                                FilterFarms.map((item, i) => (
                                    <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3 bg-white" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3 bg-white"} key={i} style={item.EntryStatus ? null : { border: "1px solid red" }}>
                                        <Link Title="Click to entry"
                                            to={`/fwr_light_record/${item.FarmID}/${item.BatchID}`}
                                            className="justify-content-center align-items-center box thumbnail card py-2 shadow-none m-0 h-100 w-100">

                                            <div className="img-event justify-content-center d-flex align-items-center flex-wrap h-100" style={{ minHeight: "8vh" }}>
                                                <img src={item ? item.details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                    className="img-fluid" alt="avatar"
                                                    style={{ minWidth: "10vh" }} width="20px" height="20px" />
                                                <small onClick={(e) => { e.preventDefault(); window.open(`tel:${item.MobileNo}`) }} className="group card-title inner list-group-item-text fw-bold border border-light text-dark w-100 text-center px-1 fs-6" style={{ borderRadius: "20px" }}><i class="fad fa-phone-alt pr-2"></i>Make call</small>
                                            </div>

                                            <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2" style={{ minHeight: "15vh" }}>
                                                <p className="group inner list-group-item-text m-0">
                                                    <small className="group card-title inner list-group-item-text fs-4 fw-bold">
                                                        <Link Title="Go to farms to view active batch" to={`/fwr_farm_ladger/${item.FarmID}/${item.BatchID}`}>{item.FarmID + ". " + item.Title}</Link>
                                                    </small>
                                                    <br />
                                                    <small className="group card-title inner list-group-item-text fw-bold">
                                                        <Link Title="Go to user profiles" to='#'
                                                        // to={`/user_profile/${item.details.UserID}`}
                                                        >{item.details.UserID + ". " + item.details.FullName}</Link>
                                                    </small>
                                                    <br />
                                                    <p className="text-success fw-bold m-0">
                                                        {item.EntryStatus ? <i class="fad fa-check"></i> : <i class="fad fa-times text-warning"></i>} {CalculateAge(item.IssueDate)}
                                                    </p>
                                                    <small className="text-muted">
                                                        {moment(item.IssueDate).format("DD MMM YYYY")}
                                                    </small>
                                                </p>
                                                {(parseInt(item.Status) === 1 || parseInt(item.Status) === 2) && (scale === 6 || (scale === 3 && (sub_scale === 4 || sub_scale === 7 || sub_scale === 9 || sub_scale === 10))) ?
                                                    <div className='d-flex'>
                                                        {
                                                            sub_scale === 4 ?
                                                                <Link Title="Daily Record" style={{ borderRadius: "15px" }} className="text-success fw-bold mr-2  p-2 border-left border-right" to={`/fwr_farm_record/${item.FarmID}/${item.BatchID}`} >Record</Link>
                                                                : null
                                                        }
                                                        {
                                                            item.Sell ?
                                                                <Fragment>
                                                                    <Link Title="Sell" style={{ borderRadius: "15px" }} className="text-success fw-bold mr-2 p-2 border-light border-left border-right" onClick={() => LoadInit(item)} to="#">Sell</Link>
                                                                    <Link Title="Batch Closing" style={{ borderRadius: "15px" }} className="text-success fw-bold mr-2  p-2 border-left border-right" onClick={() => FetchBatchAccount(item.BatchID)} to="#">Closing</Link>
                                                                </Fragment>
                                                                : null}
                                                        {/* <Link Title="Sell Report" style={{ borderRadius: "15px" }} className="text-success fw-bold mr-2  px-1 border-left border-right" to={`/fwr_sell_report/${item.FarmID}/${item.BatchID}/${0}/${0}`} >Report</Link> */}

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
                        show={SellModalShow}
                        list={list}
                        setList={setList}
                        Data={InitData}
                        onHide={() => { setSellModalShow(false) }}
                        Create={() => { setCreateModalShow(true); setSellModalShow(false); }}
                        onStock={(item) => { setStockItem(item); setCreateModalShow(false); setSellModalShow(false); setSummeryModalShow(true); }}
                        onRemove={(item) => { setDeleteItem(item); setSellModalShow(false); setDeleteModalShow(true); }}
                    /> : null
            }
            {
                Item ?
                    <CreateModal
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
        </div >
    );
}

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(FarmFields);