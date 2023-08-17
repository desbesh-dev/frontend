import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { logout } from '../../../actions/auth';
import { CalculateAge, FetchInitData, FetchLiveStock, ParkBatch, RemoveInitialization } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';


import { findUnique } from '../../../actions/APIHandler';
import { CreateModal, DeleteModal, SellModal, SellSummerizeModal } from '../../FieldWork/BirdSell/BirdSellModal';
import { StockModal } from '../../FieldWork/StockModal';
import { InfoMessage, ParkModal } from "./Modals/ModalForm.js";
let today = new Date();
const LiveStock = ({ CompanyID, BranchID, SupplierID, user, list, setList }) => {
    const [StockModalShow, setStockModalShow] = useState(false);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [SummeryModalShow, setSummeryModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [AccItems, setAccItems] = useState(false)
    const [ParkItem, setParkItem] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [DeleteItem, setDeleteItem] = useState(false)

    const [SellModalShow, setSellModalShow] = useState(false);
    const [ParkModalShow, setParkModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [InitData, setInitData] = useState(null)
    const [Item, setItem] = useState(null)

    const [BranchFilter, setBranchFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')
    const [SearchKey, setSearchKey] = useState('')

    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadLiveStock();
    }, [])

    const LoadLiveStock = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchLiveStock();

            if (result.status === 200)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/');
        }
    }

    const BatchPark = async e => {
        if (!ParkItem) {
            setParkModalShow(false)
        } else {
            setParkModalShow(false)
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            e.preventDefault();
            const result = await ParkBatch(ParkItem.id, ParkItem.Sell ? 0 : 1);

            if (result !== true) {
                if (result.error) {
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
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    LoadLiveStock();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to parked the batch. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    };


    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
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

    const LoadInit = async (item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setItem(item)
        setInitData(null);
        var result = await FetchInitData(0, item.id);
        if (result !== true) {
            setInitData(result.data);
            setSellModalShow(true)
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const BirdStatus = (value) => {
        if (value === 100)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-dark px-3 py-0" style={{ borderRadius: "15px" }}>Parked</span>
            )
        else if (value === 1)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-secondary px-3 py-0" style={{ borderRadius: "15px" }}>Boarding Period</span>
            )
        else if (value === 2)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-primary px-3 py-0" style={{ borderRadius: "15px" }}>Growing Period</span>
            )
        else if (value === 3)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-warning px-3 py-0" style={{ borderRadius: "15px" }}>Matured</span>
            )
        else if (value === 4)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-danger px-3 py-0" style={{ borderRadius: "15px" }}>Ready To Sell</span>
            )
        else if (value === 10)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-secondary px-3 py-0" style={{ borderRadius: "15px" }}>Boarding Period</span>
            )
        else if (value === 20)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-primary px-3 py-0" style={{ borderRadius: "15px" }}>Growing Period</span>
            )
        else if (value === 30)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-warning px-3 py-0" style={{ borderRadius: "15px" }}>Matured</span>
            )
        else if (value === 40)
            return (
                <span className="fs-6 fw-bold text-center text-white bg-gradient bg-danger px-3 py-0" style={{ borderRadius: "15px" }}>Ready To Sell</span>
            )
    }

    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && RepFilter && SearchKey ? item.BranchID.id === BranchFilter.value && item.BusinessID.RepID.id === RepFilter.value && item.BusinessID.id === SearchKey.value :
            BranchFilter && RepFilter ? item.BranchID.id === BranchFilter.value && item.BusinessID.RepID.id === RepFilter.value :
                BranchFilter && SearchKey ? item.BranchID.id === BranchFilter.value && item.BusinessID.id === SearchKey.value :
                    RepFilter && SearchKey ? item.BusinessID.RepID.id === RepFilter.value && item.BusinessID.id === SearchKey.value :
                        BranchFilter ? item.BranchID.id === BranchFilter.value :
                            RepFilter ? item.BusinessID.RepID.id === RepFilter.value :
                                SearchKey ? item.BusinessID.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, BranchID, BusinessID, CondID, IssueDate, Size, Quantity, Expire, BatchNo, UnitCons, UnitPrice, Cost, Sell, Status }) {
        return { id, BranchID, BusinessID, CondID, IssueDate, Size, Quantity, Expire, BatchNo, UnitCons, UnitPrice, Cost, Sell, Status };
    }) : null

    let unique_search = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.BusinessID.id) : null;
    let unique_branch = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.BranchID.id) : null;
    let unique_status = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.EntryStatus) : null;
    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.BusinessID.RepID.id) : null;

    // let Count = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce(function (res, val) {
    //     res = { IssueBird: 0, LiveBird: 0 };
    //     res.IssueBird += val.Size;
    //     res.LiveBird += val.Quantity;
    //     return res;
    // }, {}) : { IssueBird: 0, LiveBird: 0 };

    const LiveBird = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0) : 0;
    const IssuedBird = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Size, 10), 0) : 0;
    const Expire = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce((TotalExpire, myvalue) => TotalExpire + parseInt(myvalue.Expire, 10), 0) : 0;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className={`d-flex justify-content-between bg-white`}>
                        <p className='display-6 bg-white fw-bolder text-left m-0 w-25'>LIVE STOCK</p>
                        <div className="d-flex justify-content-around align-items-center p-0 w-75 border border-light" style={{ borderRadius: "15px" }}>
                            <p className='text-dark fw-bold m-0 fs-4'>{Array.isArray(FilterFarms) && FilterFarms.length ? "Farms: " + FilterFarms.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                            <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                            {IssuedBird & LiveBird ?
                                <Fragment>
                                    <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Issued Birds: " + parseInt(IssuedBird).toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                    <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Live Birds: " + parseInt(LiveBird).toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                    <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Expire: " + parseInt(Expire).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS"}</p>
                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                    <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Mortality: " + (100 * parseInt(Expire) / parseInt(IssuedBird)).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + "%"}</p>
                                </Fragment>
                                : null}
                        </div>
                    </div>
                </div>

                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">
                        <div className="d-flex justify-content-center mx-2 w-25">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_branch) && unique_branch.length ? unique_branch.map((item) => ({ label: item.BranchID.id + ". " + item.BranchID.Name, value: item.BranchID.id })) : []}
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
                                options={Array.isArray(unique_rep) && unique_rep.length ? unique_rep.map((item) => ({ label: item.BusinessID.RepID.id + ". " + item.BusinessID.RepID.FirstName + " " + item.BusinessID.RepID.LastName, value: item.BusinessID.RepID.id })) : []}
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
                        {/* <div className="d-flex justify-content-center mx-2 w-50">
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
                        </div> */}
                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.BusinessID.id + ". " + item.BusinessID.Title, value: item.BusinessID.id })) : []}
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

                <div className="position-absolute overflow-auto mx-auto w-100" style={{ height: "80%" }}>
                    {Array.isArray(FilterFarms) && FilterFarms.length ?
                        <table className={`table table-hover table-borderless table-responsive card-1 d-table mt-1 text-nowrap`}>
                            <thead>
                                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">SLNo</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Farm ID</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Farm Name</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Batch ID/No</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Age</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Live Birds</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">AVG Cons.</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Unit Cost</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Total Cost</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Batch Status</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Representative</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase py-0 px-2">Branch</span></th>
                                    <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                </tr>
                            </thead>
                            {
                                FilterFarms.map((item, i) => (
                                    <tbody>
                                        <tr className="border-bottom text-center" key={i}>
                                            {/* <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">{moment(item.Date).format('DD MMM YYYY')}</span></td> */}
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">{i + 1}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">{'Type' in item ? item.id : item.BusinessID.id}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark py-0 px-2">{item.BusinessID.Title}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">{item.id + "/" + item.BatchNo}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">{CalculateAge(item.IssueDate)} Days</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark py-0 px-2">{item.Quantity.toLocaleString("en", { minimumFractionDigits: 0 })} PCS</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark py-0 px-2">{parseFloat(item.UnitCons).toLocaleString("en", { minimumFractionDigits: 3 })} GM</span> </td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark py-0 px-2">BDT {parseFloat(item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark py-0 px-2">BDT {parseFloat(item.Cost).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                            <td className="border-right p-1">{!item.Sell ?
                                                item.CondID.Season === "Winter" ? CalculateAge(item.IssueDate) <= 10 ? BirdStatus(1) : CalculateAge(item.IssueDate) <= 25 ? BirdStatus(2) : CalculateAge(item.IssueDate) >= 25 ? BirdStatus(3) : CalculateAge(item.IssueDate) >= 28 ? BirdStatus(4) : null :
                                                    item.CondID.Season === "Summer" ? CalculateAge(item.IssueDate) <= 5 ? BirdStatus(10) : CalculateAge(item.IssueDate) <= 25 ? BirdStatus(20) : CalculateAge(item.IssueDate) >= 25 ? BirdStatus(30) : CalculateAge(item.IssueDate) >= 28 ? BirdStatus(40) : null : null
                                                : BirdStatus(100)
                                            }</td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark py-0 px-2"><i class="fad fa-user-tie pr-2"> </i>{item.BusinessID.RepID.id + ". " + item.BusinessID.RepID.FirstName + " " + item.BusinessID.RepID.LastName}</span> </td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark py-0 px-2">{item.BranchID.Name}</span> </td>
                                            <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark py-0 px-2">
                                                <button title="Batch Park" className="btn fs-5 px-2 py-0 fad fa-tags text-dark" onClick={() => { setParkItem(item); setParkModalShow(true) }} />
                                                {
                                                    item.Sell ?
                                                        <button Title="Initializations" className="btn fs-5 px-2 py-0 text-dark fad fa-ballot-check" onClick={() => LoadInit(item)} />
                                                        : null
                                                }
                                                {/* <button title="Update Product" className="btn fs-5 px-2 py-0 fad fa-edit text-dark" id="print" onClick={(e) => { setStockItem(item); setUpdateModalShow(true) }} /> */}
                                                {/* <button title="Product Profile" className="btn fs-5 px-2 py-0 fad fa-sync-alt text-dark" id="view" onClick={(e) => exportPDF(e, item)} />
                                                <button title="Product Profile" className="btn fs-5 px-2 py-0 fad fa-eye text-dark" id="view" onClick={(e) => exportPDF(e, item)} /> */}
                                            </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))
                            }
                        </table>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                        </div>
                    }
                </div>
            </div >
            {
                InitData ?
                    <SellModal
                        Godown={false}
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
                ParkItem ?
                    <ParkModal
                        FullName={ParkItem.id + "/" + ParkItem.BatchNo + ". " + ParkItem.BusinessID.Title}
                        show={ParkModalShow}
                        Value={ParkItem.Sell}
                        Click={(e) => BatchPark(e)}
                        onReload={() => LoadLiveStock()}
                        onHide={() => { setParkItem(false); setSellModalShow(false) }}
                    />
                    : null
            }
            {
                Item ?
                    <CreateModal
                        GodownID=''
                        BusinessID={Item.BusinessID.id}
                        BatchID={Item.id}
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
                        Msg={"Are you sure to remove initialization with party " + DeleteItem.PartyAgent + "? All of sell quantity & weight permanently wiped out."}
                        show={DeleteModalShow}
                        onDelete={(e) => DeleteInvoice(e, DeleteItem.InvoiceNo)}
                        onHide={() => { setDeleteModalShow(false); setSellModalShow(true); }}
                    /> : null
            }
            <InfoMessage
                header="Remove stock product!"
                body_header="Can not remove product"
                body="Product exist in physical store. So, you can not remove product without null stock"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            />
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(LiveStock);