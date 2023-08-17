import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchBranch } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage } from "../../Modals/ModalForm.js";
// import { exportPDF } from '../Class/OrderPDF';
import * as moment from 'moment';
import Datepicker from 'react-datepicker';
import { AllMyProductList, DeleteDraftItem, FetchDraftRequest, FetchProductRequestNo, RequestOrder, SaveDraftItem, SendDraftRequest } from '../../../actions/InventoryAPI';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
let today = new Date();
const ProductRequisition = ({ display, SupplierID, CompanyID, BranchID, user, req_no, list, setList, setActive }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Count, setCount] = useState(null)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState(false)
    const [Header, setHeader] = useState(req_no)

    const [RequestID, setRequestID] = useState(false)
    const [Date, setDate] = useState(today)
    const [DeliveryDate, setDeliveryDate] = useState(today)
    const [RequestNo, setRequestNo] = useState("")
    const [BranchList, setBranchList] = useState("")
    const [Branch, setBranch] = useState("")
    const [Receiver, setReceiver] = useState(null)
    const [Payment, setPayment] = useState(null)
    const [Vat, setVat] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)

    const [RequestData, setRequestData] = useState([])
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        BarCode: "",
        ItemCode: "",
        Title: "",
        Category: "",
        UnitWeight: "",
        Weight: "",
        UnitPrice: "",
        Quantity: "",
        SubTotal: "",
    });
    const { ItemCode, Category, Title, UnitWeight, UnitPrice, Quantity, Weight, SubTotal } = formData;

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadDraftRequest();
        LoadRequestNo();
        LoadBranches();
        LoadProductItems();
        history.replace();
    }, [])

    const LoadRequestNo = async (req_no) => {
        if (!req_no) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchProductRequestNo('PR');
            if (result !== true) {

                setRequestNo(result)
            } else {
                history.push('/');
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }


    const LoadBranches = async () => {
        var result = await FetchBranch();
        if (result !== true) {
            setBranchList(result.Branch);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const LoadProductItems = async () => {
        if (user !== null) {

            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var ProductItems = await AllMyProductList();
            if (ProductItems !== true)
                setMyProList(ProductItems.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_supplier');
        }
    }

    const LoadDraftRequest = async () => {
        if (req_no) {
            var result = await FetchDraftRequest(req_no);
            if (result !== true) {
                setRequestID(result.RequestID)
                setBranch(result.Branch)
                setRequestNo(result.RequestNo);
                setRequestData(result.RequestMapData)
                setDate(new window.Date(result.Date));
                setDeliveryDate(new window.Date(result.DeliveryDate));
                setActive(701);
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                history.push('/req_draft');
            }
        }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    const onSubmit = (e) => {
        if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined) {
            setInfoModalShow(true)
        } else {
            e.preventDefault();
            setRequestData([...RequestData, formData]);
            setCount(Count + 1);
            setFormData({
                BarCode: "",
                ItemCode: "",
                Title: "",
                Category: "",
                UnitWeight: "",
                Weight: "",
                UnitPrice: "",
                Quantity: "",
                SubTotal: "",
            });
        }
    }

    const AddDraftItem = async (e) => {
        e.preventDefault();

        if (isStringNullOrWhiteSpace(ItemCode) && isStringNullOrWhiteSpace(Title) && isStringNullOrWhiteSpace(UnitWeight) && isStringNullOrWhiteSpace(Quantity) && isStringNullOrWhiteSpace(Weight)) {
            setInfoModalShow(true)
        } else {
            const result = await SaveDraftItem(RequestID, ItemCode, Quantity, UnitPrice, SubTotal, 0);

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
                    onSubmit(e)
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to adding rate item. Please try again later",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }





    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = RequestData.map(row => row.Quantity * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = RequestData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0);
    const WeightTotal = () => {
        let TotalWt = 0.000;
        const wt = RequestData.map(row => row.Quantity * row.UnitWeight);
        if (wt.length > 0) {
            TotalWt = wt.reduce((acc, val) => acc + val);
        }
        return TotalWt;
    }

    const deleteRow = async (e, i, item) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteDraftItem(item.id);
        if (result !== true) {
            const newRows = RequestData.splice(i, 1).concat(RequestData.slice(i + 1));
            setCount(Count - 1)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            onSubmit();
        }
    }

    const history = useHistory();

    const SaveOrder = async (e, Status) => {
        e.preventDefault();
        if (Branch) {
            var IssueDate = moment(Date).format('YYYY-MM-DD')
            var DeliveryDate = moment(Date).format('YYYY-MM-DD')

            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await RequestOrder(Branch.value, RequestNo, IssueDate, DeliveryDate, getTotal(), Status, RequestData);

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
                    // My_Orders();
                    LoadRequestNo();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save product profile. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });

        } else {
            history.push('/my_supplier');
        }
    }

    const SendRequisition = async (e) => {
        e.preventDefault();
        if (Branch && Header && RequestID) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await SendDraftRequest(RequestID);

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
                    history.push('/req_draft')
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save product profile. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });

        } else {
            history.push('/my_supplier');
        }
    }

    const VatCalc = (e) => {
        setVat(e.target.value)
        let SubTotal = getTotal();
        let bat = SubTotal + ((SubTotal * e.target.value) / 100)
        let Disc = Number(bat) - Number(Discount)
        let left = Number(Disc) - Paid
        setTotal(Disc);
        setDue(left);
    }

    const DiscountCalc = (e) => {
        setDiscount(e.target.value)
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100)
        let Disc = Number(VatCal) - Number(e.target.value)
        let left = Number(Disc) - Paid
        setTotal(Disc);
        setDue(left);
    }

    const PaidCalc = (e) => {
        setPaid(e.target.value)
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100)
        let Disc = Number(VatCal) - Discount
        let left = Number(Disc) - Number(e.target.value)

        // setTotal(left);
        setDue(left);
    }

    const BarcodeGen = (e) => {

        let Bar = CompanyID + BranchID + SupplierID + (RequestNo ? RequestNo : "") + ItemCode + e.target.value;
        setFormData({ ...formData, [e.target.name]: e.target.value, "BarCode": Bar, "Weight": UnitWeight * e.target.value, "SubTotal": UnitPrice * e.target.value });
    }

    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    const Validate = () => {
        if (!isStringNullOrWhiteSpace(Date) && !isStringNullOrWhiteSpace(RequestNo) && !isStringNullOrWhiteSpace(Payment))
            return false;
        return true;
    }

    const ClearField = (e) => {
        e.preventDefault();
        setCount("");
        setRequestID(false);
        setBranch(null);
        setRequestNo("");
        setRequestData([]);
        setDate(today);
        setDeliveryDate(today);
        setHeader(false);
        setFormData({
            BarCode: "",
            ItemCode: "",
            Title: "",
            Category: "",
            UnitWeight: "",
            Weight: "",
            UnitPrice: "",
            Quantity: "",
            SubTotal: "",
        });
        LoadRequestNo(false);
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center">
                    Products Requisition {Header ? <span className='text-danger'>&nbsp;(Draft)</span> : null}
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/supplier_list">Products Requisition</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12 h-100 pl-0">

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center py-3">
                        {
                            Branch ?
                                <>
                                    <div className="row g-0">
                                        <p className="fs-6 text-success text-center fw-bold m-0">Branch Info</p>
                                        <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                            <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                                src={user ? process.env.REACT_APP_API_URL + user.Logo : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                        </div>
                                        <div className="col-md-10">
                                            <div className="card-body px-3 py-2">
                                                <p className="display-6 fw-bold m-0">{Branch.label + " Branch"}</p>
                                                <p className="fs-6 m-0">{Branch.Address}</p>
                                                <p className="fs-6 m-0">{Branch.Contact}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='btn btn-outline-warning fw-bold py-0' onClick={(e) => ClearField(e)}><i class="fad fa-user-times"></i> Clear</button>
                                </>
                                :
                                <div className="row w-100">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Please Select Branch</p>
                                    <div className="col-sm-12">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={BranchList}
                                            name="Division"
                                            placeholder={"Please select branch"}
                                            styles={CScolourStyles}
                                            // value={Payment}
                                            onChange={(e) => setBranch(e)}
                                            required
                                            id="Branch"
                                        />
                                    </div>
                                </div>
                        }
                    </div >

                    <div className="col-lg-1">
                        <div className="cs_outer" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                    </div>

                    <div className="col-lg-6 d-flex flex-wrap align-items-center justify-content-center">
                        <form className='w-100'>
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={Date}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Delivery Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={DeliveryDate}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                        onChange={(e) => setDeliveryDate(e)}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Requisition No</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control fw-bold" placeholder="Requisition No" id="inputEmail3" value={RequestNo} disabled />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>


                <div className="row justify-content-center mx-auto d-table w-100 h-100">

                    <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Code</p>
                            <input
                                type="number"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                id="ItemCode"
                                placeholder="Item code"
                                value={formData ? ItemCode : ""}
                                required
                                disabled={!Branch}
                            />
                        </div>
                        <div className="col-sm-5">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Select Product</p>
                            <div className="input-group fs-5 fw-bold">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Array.isArray(MyProList) && MyProList.length ? MyProList.map((item) => ({ ItemCode: item.ItemCode, value: item.ItemCode, Category: item.Category, label: item.Title, UnitWeight: item.UnitWeight, UnitPrice: item.UnitPrice })) : []}
                                    name="Division"
                                    placeholder={"Please select product"}
                                    styles={CScolourStyles}
                                    value={Title}
                                    onChange={(e) => setFormData(e)}
                                    required
                                    id="Title"
                                    isDisabled={!Branch}

                                />
                            </div>
                        </div>
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Wt</p>
                            <input
                                type="text"
                                id="UnitWeight"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Unit Wt"
                                value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                required
                                disabled={!Branch}
                            />
                        </div>
                        {/* <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Price</p>
                            <input
                                type="text"
                                id="UnitPrice"
                                name="UnitPrice"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Unit Price"
                                value={UnitPrice ? UnitPrice.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                required
                                disabled={!Branch}
                            />
                        </div> */}
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Quantity</p>
                            <input
                                type="number"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                name="Quantity"
                                id="Quantity"
                                placeholder="Quantity"
                                value={Quantity}
                                onChange={(e) => BarcodeGen(e)}
                                onKeyDown={(e) => shouldBlur(e)}
                                required
                                disabled={!Branch}
                            />
                        </div>
                        <div className="col-sm-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Weight</p>
                            <input
                                type="text"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                name="Weight"
                                id="Weight"
                                placeholder="Weight"
                                value={Weight ? Weight.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                required
                                disabled
                            />
                        </div>
                        {/* <div className="col-sm-2 border-right border-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Sub-Total</p>
                            <input
                                type="text"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                name="SubTotal"
                                id="SubTotal"
                                placeholder="Sub-total"
                                value={SubTotal ? SubTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                required
                                disabled
                            />
                        </div> */}

                        <div className="col-auto">
                            {
                                Header ?
                                    <button
                                        className="btn fs-2 fad fa-inbox-in text-center text-success"
                                        title='Draft Row'
                                        onKeyDown={(e) => handleKeyDown(e)}
                                        type="submit"
                                        onClick={(e) => { Branch ? AddDraftItem(e) : e.preventDefault() }}
                                    /> :
                                    <button
                                        className="btn fs-2 fad fa-plus text-center text-success"
                                        title='Add Row'
                                        onKeyDown={(e) => handleKeyDown(e)}
                                        type="submit"
                                        onClick={(e) => { Branch ? onSubmit(e) : e.preventDefault() }}
                                    />
                            }
                        </div>
                    </form>


                    <InfoMessage
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    {
                        Array.isArray(RequestData) && RequestData.length ?
                            <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                                <thead>
                                    <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                        <th className="py-1 border-right"><span>S/N</span></th>
                                        <th className="py-1 border-right"><span>Item Code</span></th>
                                        <th className="py-1 border-right"><span>Category</span></th>
                                        <th className="py-1 border-right"><span>Title</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Unit Weight</span></th>
                                        {/* <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Unit Price</span></th> */}
                                        <th className="py-1 border-right"><span>Quantity</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Weight</span></th>
                                        <th className="py-1"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        RequestData.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{item.ItemCode}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.Category}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.UnitWeight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                {/* <td className="p-0 border-right"><span className="d-block fw-bold">{(item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{item.Quantity}</span> </td>
                                                <td className="p-0 border-right px-2"><span className="d-block fw-bold text-right">{(item.UnitWeight * item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="px-3 py-0">
                                                    <button className="btn fs-3 py-1 fad fa-minus text-dark  fw-bold" onClick={(e) => deleteRow(e, i, item)} />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {/* <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block fw-bolder text-right">Sub-total </span> </td>
                                        <td className="p-1 border-right"><span className="d-block fw-bolder text-right">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block text-right">VAT Rate (%) </span> </td>
                                        <td className="p-1 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block text-right ">Discount (tk) </span> </td>
                                        <td className="p-1 d-flex justify-content-end border-right">
                                            <input type="text"
                                                autocomplete="off"
                                                className="d-block text-right border-0"
                                                id="Discount"
                                                value={Discount}
                                                onChange={(e) => DiscountCalc(e)} />
                                        </td>
                                    </tr> */}
                                    {/* <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block text-right fw-bolder">Total Price </span> </td>
                                        <td className="p-1 border-right"><span className="d-block fw-bolder text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr> */}

                                    {/* {Payment.value === 3 ?
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block text-right fw-bolder fs-4">PAID </span> </td>
                                            <td className="p-1 d-flex justify-content-end border-right">
                                                <input type="text"
                                                    autocomplete="off"
                                                    className="d-block text-right border fs-4 fw-bolder"
                                                    id="Paid"
                                                    value={Paid}
                                                    onChange={(e) => PaidCalc(e)} />
                                            </td>
                                        </tr>
                                        : null} */}


                                    <tr className="text-center border border-light mt-3 bg-white">
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Count:</span> </td>
                                        <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Quantity:</span> </td>
                                        <td className="p-1"><span className="d-block text-left fw-bolder px-1 text-right">{QuantityTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Weight: </span> </td>
                                        <td className="p-0 border-right px-2" ><span className="d-block text-right fw-bolder px-1 text-right">{WeightTotal().toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                        {/* <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? (0).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                        <td colSpan="2" className="p-1" className="px-3 py-0 border-right">
                                            <div className={`d-flex justify-content-around align-items-center`}>
                                                {
                                                    Header ?
                                                        <button className="btn fs-3 p-2 fad fa-paper-plane text-success" title='Send Darft Requisition'
                                                            onClick={(e) => SendRequisition(e, RequestID)}
                                                        /> :
                                                        <Fragment>
                                                            <button className="btn fs-3 p-2 fad fa-archive text-success" title='Draft'
                                                                onClick={(e) => SaveOrder(e, 0)}
                                                            />
                                                            <button className="btn fs-3 p-2 fad fa-paper-plane text-success" title='Send Requisition'
                                                                onClick={(e) => SaveOrder(e, 1)}
                                                            />
                                                        </Fragment>
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            :
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                            </div>
                    }
                </div >
            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.match.params.sup_id,
    CompanyID: state.auth.user.CompanyID,
    BranchID: state.auth.user.BranchID,
    user: state.auth.user,
    req_no: props.location.state
});
export default connect(mapStateToProps, { logout })(ProductRequisition);