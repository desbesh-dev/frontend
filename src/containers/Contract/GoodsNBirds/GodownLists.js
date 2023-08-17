import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Select from 'react-select';
import { logout } from '../../../actions/auth';
import { DeleteGodown, FetchGodown, FetchInitData, RemoveInitialization } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';


import { findUnique } from '../../../actions/APIHandler';
import { CreateModal, DeleteModal, SellModal, SellSummerizeModal } from '../../FieldWork/BirdSell/BirdSellModal';
import { Delete, Expire, Update } from "./Modals/ModalForm.js";

let today = new Date();
const GodownLists = ({ CompanyID, BranchID, SupplierID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [ExpireModalShow, setExpireModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [SummeryModalShow, setSummeryModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [TransferModalShow, setTransferModalShow] = useState(false);
    const [SellModalShow, setSellModalShow] = useState(false);

    const [GodownItem, setGodownItem] = useState(false)
    const [ParkItem, setParkItem] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [DeleteItem, setDeleteItem] = useState(false)

    const [ParkModalShow, setParkModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [InitData, setInitData] = useState(null)
    const [Item, setItem] = useState(null)

    const [BranchFilter, setBranchFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')
    const [TypeFilter, setTypeFilter] = useState('')
    const [SearchKey, setSearchKey] = useState('')

    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        LoadGodown();
    }, [])

    const LoadGodown = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchGodown();
            if (result.status === 200)
                setData(result.data.Godown);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/');
        }
    }

    const GodownClose = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteGodown(id);
        if (result !== true) {
            LoadGodown();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const LoadInit = async (item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setItem(item)
        setInitData(null);
        var result = await FetchInitData(item.id);
        if (result !== true) {
            setInitData(result.data);
            setSellModalShow(true)
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

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }


    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = TypeFilter && BranchFilter && RepFilter && SearchKey ? item.Type === TypeFilter.value && item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.id === SearchKey.value :
            TypeFilter && BranchFilter && RepFilter ? item.Type === TypeFilter.value && item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                TypeFilter && BranchFilter ? item.Type === TypeFilter.value && item.BranchID === BranchFilter.value :
                    TypeFilter && RepFilter ? item.Type === TypeFilter.value && item.RepID === RepFilter.value :
                        TypeFilter && SearchKey ? item.Type === TypeFilter.value && item.id === SearchKey.value :
                            BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                                BranchFilter && SearchKey ? item.BranchID === BranchFilter.value && item.id === SearchKey.value :
                                    RepFilter && SearchKey ? item.RepID === RepFilter.value && item.id === SearchKey.value :

                                        TypeFilter ? item.Type === TypeFilter.value :
                                            BranchFilter ? item.BranchID === BranchFilter.value :
                                                RepFilter ? item.RepID === RepFilter.value :
                                                    SearchKey ? item.id === SearchKey.value :
                                                        true;
        return BothValue
    }).map(function ({ id, BranchID, BranchName, CompanyID, Title, Type, RepID, RepName, Qty, Weight, UnitCost, TotalCost, CreatedAt, UpdatedAT, UpdatedBy, Accounts }) {
        return { id, BranchID, BranchName, CompanyID, Title, Type, RepID, RepName, Qty, Weight, UnitCost, TotalCost, CreatedAt, UpdatedAT, UpdatedBy, Accounts };
    }) : null

    let unique_search = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.Title) : null;
    let unique_branch = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.BranchID) : null;
    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.RepID) : null;
    let unique_type = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.Type) : null;

    // let Count = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce(function (res, val) {
    //     res = { IssueBird: 0, Quantity: 0 };
    //     res.IssueBird += val.Size;
    //     res.Quantity += val.Quantity;
    //     return res;
    // }, {}) : { IssueBird: 0, Quantity: 0 };

    const Quantity = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Qty, 10), 0) : 0;
    const Cost = Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.reduce((TotalCost, myvalue) => TotalCost + parseFloat(myvalue.TotalCost, 10), 0) : 0;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">

                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className={`d-flex justify-content-between bg-white`}>
                        <p className='display-6 bg-white fw-bolder text-left m-0 w-25'>GODOWN LIST</p>
                        <div className="d-flex justify-content-around align-items-center p-0 w-75 border border-light" style={{ borderRadius: "15px" }}>
                            <p className='text-dark fw-bold m-0 fs-4'>{Array.isArray(FilterFarms) && FilterFarms.length ? "Total: " + FilterFarms.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                            <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                            <Fragment>
                                <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Quantity: " + parseInt(Quantity).toLocaleString("en-BD", { minimumFractionDigits: 0 })} PCS</p>
                                <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                <p className='text-dark fw-bold fs-4 m-0' style={{ borderRadius: "15px" }}>{"Amount: " + Cost.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
                            </Fragment>
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
                                options={Array.isArray(unique_type) && unique_type.length ? unique_type.map((item) => ({ label: item.Type === 1 ? "Live Birds" : item.Type === 2 ? "Processed Birds" : "N/A", value: item.Type })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Type"
                                placeholder={"Select Type"}
                                styles={CScolourStyles}
                                value={TypeFilter}
                                onChange={(e) => setTypeFilter(e)}
                                required
                                id="Type"
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
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.id + ". " + item.Title, value: item.id })) : []}
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
                                    <div className="item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3 p-0" key={i}>
                                        <div className={`justify-content-center align-items-center box thumbnail card py-0 shadow-none m-0 h-100`}>

                                            <div className="card-body d-flex flex-column justify-content-center py-0 px-2" style={{ minHeight: "15vh" }}>
                                                <div className='d-flex justify-content-around align-items-center border-bottom'>
                                                    <div className='row justify-content-center align-items-center w-40'>
                                                        <div className='d-flex justify-content-between align-items-center'>
                                                            <p className="group card-title inner list-group-item-text fw-bold m-0 no-wrap">Quantity: <span className="fw-bolder m-0">{item.Qty.toLocaleString("en", { minimumFractionDigits: 0 })} PCS </span> </p>
                                                            <p className="group card-title inner list-group-item-text fw-bold m-0">AVG Cost: <span className="fw-bolder m-0">BDT {parseFloat(item.UnitCost).toLocaleString("en", { minimumFractionDigits: 2 })} </span> </p>

                                                        </div>
                                                        <div className='d-flex justify-content-between align-items-center'>
                                                            <p className="group card-title inner list-group-item-text fw-bold m-0">Weight: <span className="fw-bolder m-0">{item.Weight.toLocaleString("en", { minimumFractionDigits: 3 })} KG</span></p>

                                                            <p className="group card-title inner list-group-item-text fw-bold m-0">Total Cost: <span className="fw-bolder m-0">BDT {parseFloat(item.TotalCost).toLocaleString("en", { minimumFractionDigits: 2 })}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "60px" }} />
                                                    <p className="group inner list-group-item-text m-0 px-2 w-50 text-right">
                                                        <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.Title}</p>
                                                        <p className="group card-title inner list-group-item-text fw-bold m-0">{item.Type === 1 ? "Live Birds" : item.Type === 2 ? "Proccesed Birds" : "N/A"}</p>
                                                        <p className="m-0">{item.RepName + ", " + item.BranchName + " Branch"} <i class="fad fa-user-tie" /> </p>
                                                        <small className="text-muted m-0">{item.UpdatedBy.FullName + ", " + moment(item.UpdatedAt).format("DD MMM YYYY hh:mm A")} <i class="fad fa-clock" /></small>
                                                    </p>
                                                </div>
                                                <div className='d-flex justify-content-around align-items-center'>
                                                    <div className='d-flex justify-content-between align-items-center w-40 border' style={{ borderRadius: "20px" }}>

                                                        {item.Type === 1 ?
                                                            <Link className="btn p-1 text-dark" Title="Send Product" to={`/gd_invoice/${item.id}`}><i class="fad fa-paper-plane" /> Invoice</Link>
                                                            : null
                                                        }

                                                        <button className="btn p-1 text-dark" Title="Sell" onClick={() => LoadInit(item)}><i class="fad fa-file-invoice" /> Sell</button>

                                                        <Link className="btn p-1 text-dark" Title="Ladger" to={`/gd_ladger/${item.id}`}><i class="fad fa-file-alt" /> Ladger</Link>
                                                        <button className="btn p-1 text-dark" Title="Expire" onClick={() => { setGodownItem(item); setExpireModalShow(true) }}><i class="fad fa-book-dead" /> Expire</button>
                                                    </div>

                                                    <div className='d-flex justify-content-between align-items-center w-40 border' style={{ borderRadius: "20px" }}>
                                                        <button className="btn p-1 text-dark" onClick={() => { setGodownItem(item); setUpdateModalShow(true) }}><i className="fs-6 fad fa-edit" /> Update</button>
                                                        <button className="btn p-1 text-dark" onClick={() => { setDeleteItem(item); setDeleteModalShow(true) }}><i className="fs-6 fad fa-trash-alt" /> Delete</button>
                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-4 fw-bold text-success m-0'>No godown found!</p>
                                </div>
                        }

                    </div>
                </div>
            </div >
            {
                GodownItem ?
                    <Update
                        Data={GodownItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadGodown(); setGodownItem(false); setUpdateModalShow(false); }}
                        onHide={() => { setGodownItem(false); setUpdateModalShow(false); }}
                    />
                    : null
            }
            {
                GodownItem ?
                    <Expire
                        Data={GodownItem}
                        show={ExpireModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadGodown(); setGodownItem(false); setExpireModalShow(false); }}
                        onHide={() => { setGodownItem(false); setExpireModalShow(false); }}
                    />
                    : null
            }


            {DeleteItem ?
                <Delete
                    FullName={`${DeleteItem ? DeleteItem.Title : null}`}
                    show={DeleteModalShow}
                    Click={(e) => GodownClose(e, DeleteItem.id)}
                    onHide={() => { setDeleteItem(false); setDeleteModalShow(false) }}
                />
                : null
            }

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
                        onGodown={(item) => { setGodownItem(Item); setCreateModalShow(false); setSellModalShow(false); setTransferModalShow(true); }}
                        onRemove={(item) => { setDeleteItem(item); setSellModalShow(false); setDeleteModalShow(true); }}
                    /> : null
            }
            {
                Item ?
                    <CreateModal
                        GodownID={Item.id}
                        BusinessID=''
                        BatchID=''
                        show={CreateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadInit(Item); setCreateModalShow(false); setSellModalShow(true); }}
                        onHide={() => { setCreateModalShow(false); }}
                    /> : null
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

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(GodownLists);