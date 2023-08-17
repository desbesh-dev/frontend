import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchInvoiceNo, FetchProfitMargin, Invoice } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchSubscriber, FetchSubscriberList } from '../../../actions/InventoryAPI';
import { GetSuppliers, MyProductList } from '../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
let today = new Date();

const Sells = ({ display, SupplierID, CompanyID, BranchID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Supplier, setSupplier] = useState(null)
    const [View, setView] = useState(false)
    const [Data, setData] = useState(false)
    const [Count, setCount] = useState(null)
    const [Error, setError] = useState({});
    const [Stock, setStock] = useState(0)
    const [MyProList, setMyProList] = useState(false)
    const [SubscriberList, setSubscriberList] = useState([])
    const [Subscriber, setSubscriber] = useState(false)

    const [Date, setDate] = useState(today)
    const [InvoiceNo, setInvoiceNo] = useState(0)
    const [Receiver, setReceiver] = useState(null)
    const [Payment, setPayment] = useState(null)
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(null)
    const [Discount, setDiscount] = useState(null)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)

    const [SellData, setSellData] = useState([])
    const [locale, setLocale] = useState('en');
    const [MarginList, setMarginList] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        SLNo: "",
        ItemCode: "",
        Title: "",
        UnitWeight: "",
        UnitPrice: "",
        Quantity: "",
        Weight: "",
        Rate: "",
        SubTotal: "",
    });
    const { ItemCode, Title, UnitWeight, UnitPrice, Quantity, Weight, Rate, SubTotal } = formData;
    const UnitRate = Percent ? Percent.operation === 12 ? Rate : Percent.operation === 13 ? Rate : UnitPrice ? UnitPrice + (UnitPrice * Percent.margin) / 100 : "" : "";

    useEffect(() => {
        LoadSubscriberList();
        LoadProductItems();
        LoadInvoiceNo();
        LoadProfitMargin();
    }, [])


    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchInvoiceNo('DS');

        if (result !== true) {
            setInvoiceNo(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSubscriberList = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchSubscriberList();

        if (result !== true) {
            setSubscriberList(result.Subscriber);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSubscriber = async (BisID) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchSubscriber(BisID);

        if (result !== true) {
            setSubscriber(result[0]);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadProfitMargin = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchProfitMargin();
        if (result !== true) {
            setMarginList(result);
        } else {
            // history.push('/my_supplier');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSuppliers = async () => {
        var result = await GetSuppliers(SupplierID);
        if (result !== true) {
            setSupplier(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/supplier_items');
        }
    }

    const LoadProductItems = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var ProductItems = await MyProductList();
            if (ProductItems !== true)
                setMyProList(ProductItems.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            // history.push('/my_supplier');
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
            AddRow();
        }
    }

    const AddRow = (e) => {
        if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined) {
            setInfoModalShow(true)
        } else if (Stock < Weight) {
            setInfoModalShow(true)
        } else {
            setSellData([...SellData, formData]);
            setCount(Count + 1);
            setTotal(0.00);
            setVat(0.00);
            setDiscount(0.00);
            setFormData({
                SLNo: "",
                ItemCode: "",
                Title: "",
                UnitWeight: "",
                UnitPrice: "",
                Quantity: "",
                Weight: "",
                Rate: "",
                SubTotal: "",
            });
        }
    }

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = Array.isArray(SellData) && SellData.length ? SellData.map(row => row.Quantity * row.Rate) : 0.00;
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = Array.isArray(SellData) && SellData.length ? SellData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0) : 0;

    const deleteRow = (i) => {
        const newRows = Array.isArray(SellData) && SellData.length ? SellData.splice(i, 1).concat(SellData.slice(i + 1)) : 0;
        setCount(Count - 1)
    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            AddRow();
        }
    }

    const history = useHistory();

    const SaveInvoice = async () => {
        let Sell_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC_ID : "N/A"
        let Sell_Code = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC_Code : "N/A"
        let Stock_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).StockAC_ID : "N/A"
        let Stock_Code = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).StockAC_Code : "N/A"
        let VatTotal = (getTotal() * Vat) / 100
        let GrandTotal = Total === 0 ? getTotal() : Total

        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var data = moment(Date).format('YYYY-MM-DD')
            var result = await Invoice(Subscriber.id, InvoiceNo, data, Vat, VatTotal, Discount, Payment.value, GrandTotal, Payment.value === 2 ? GrandTotal : Payment.value === 3 ? Paid : 0.00, Payment.value === 1 ? GrandTotal : Payment.value === 3 ? Due : 0.00, Count, SellData, Sell_ID, Sell_Code);

            if (result !== true) {
                if (result.error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({ ...updatedState });
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
                    LoadInvoiceNo();
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

    const PaidNDue = (value) => {
        setPaid(value)
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100)
        let Disc = Number(VatCal) - Discount
        let left = Number(Disc) - Number(value)

        // setTotal(left);
        setDue(left);
    }

    const BarcodeGen = (e) => {
        if (Percent.operation === 13) {
            setFormData({
                ...formData,
                "SLNo": Count === 0 ? 1 : Count + 1,
                "Quantity": e.target.value,
                "Weight": (UnitWeight * e.target.value).toFixed(3),
                "Rate": Rate,
                "SubTotal": (Rate * e.target.value).toFixed(2)
            });

        } else if (Percent.operation === 12) {
            setFormData({
                ...formData,
                "SLNo": Count === 0 ? 1 : Count + 1,
                "Quantity": e.target.value,
                "Weight": (UnitWeight * e.target.value).toFixed(3),
                "Rate": Rate,
                "SubTotal": (Rate * e.target.value).toFixed(2)
            });
        } else {
            setFormData({
                ...formData,
                "SLNo": Count === 0 ? 1 : Count + 1,
                "Quantity": e.target.value,
                "Weight": (UnitWeight * e.target.value).toFixed(3),
                "Rate": UnitPrice + (UnitPrice * Percent.margin) / 100,
                "SubTotal": ((UnitPrice + (UnitPrice * Percent.margin) / 100) * e.target.value).toFixed(2)
            });
        }
    }

    const CS_Rate = (e) => {
        setFormData({
            ...formData,
            "SLNo": Count === 0 ? 1 : Count + 1,
            "Rate": e.target.value,
            "SubTotal": (e.target.value * Quantity).toFixed(2)
        });
    }

    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    const Validate = () => {
        if (!isStringNullOrWhiteSpace(Date) && !isStringNullOrWhiteSpace(InvoiceNo) && !isStringNullOrWhiteSpace(Payment))
            return false;
        return true;
    }

    const ClearForm = () => {
        LoadInvoiceNo();
        setSellData([]);
        setSubscriber(false);
        setPayment(false);
        setPercent(false);
        setCount(0);
        setTotal(0.00);
        setVat(0.00);
        setDiscount(0.00);
        setFormData({
            ItemCode: "",
            Title: "",
            UnitWeight: "",
            UnitPrice: "",
            Quantity: "",
            Weight: "",
            Rate: "",
            SubTotal: "",
        });
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">
                    Product Sell
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/rtl_sell">Product Sell</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12 h-100 pl-0">

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center">
                        {
                            Subscriber ?
                                Subscriber.TypeID === 0 ?
                                    <div className="row g-0">
                                        <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

                                        <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                            <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                                src={process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                        </div>
                                        <div className="col-md-10">
                                            <div className="card-body">
                                                <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
                                                {/* <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.UserID.MobileNo}</span></p> */}
                                                <br />
                                                <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    Subscriber.TypeID === 1 || Subscriber.TypeID === 2 || Subscriber.TypeID === 4 ?
                                        <div className="row g-0">
                                            <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

                                            <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                                <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                                    src={Subscriber.UserDetails[0] ? Subscriber.UserDetails[0].Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                            </div>
                                            <div className="col-md-10">
                                                <div className="card-body">
                                                    <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
                                                    <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.UserID.MobileNo}</span></p>

                                                    <small className="text-muted">{Subscriber.UserDetails[0].VillageName + ", " + Subscriber.UserDetails[0].Union + ", " + Subscriber.UserDetails[0].Upazila + ", " + Subscriber.UserDetails[0].Zila + ", " + Subscriber.UserDetails[0].Division}</small>
                                                    <br />
                                                    <br />
                                                    <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        Subscriber.TypeID === 3 ?
                                            <div className="row g-0">
                                                <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

                                                <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                                    <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                                        src={process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                                </div>
                                                <div className="col-md-10">
                                                    <div className="card-body">
                                                        <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
                                                        <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.Contact}</span></p>

                                                        <small className="text-muted">{Subscriber.Address}</small>
                                                        <br />
                                                        <br />
                                                        <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="row w-100">
                                                <p className="fs-6 text-success text-center fw-bold m-0">Please Select Subscriber</p>
                                                <div className="col-sm-12">
                                                    <Select
                                                        menuPlacement="auto"
                                                        menuPosition="fixed"
                                                        menuPortalTarget={document.body}
                                                        borderRadius={"0px"}
                                                        options={SubscriberList}
                                                        name="Division"
                                                        placeholder={"Select Subscriber"}
                                                        styles={CScolourStyles}
                                                        // value={Payment}
                                                        onChange={(e) => LoadSubscriber(e.value)}
                                                        required
                                                        id="Title"
                                                    />
                                                </div>
                                            </div>
                                :
                                <div className="row w-100">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Please Select Subscriber</p>
                                    <div className="col-sm-12">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={SubscriberList}
                                            name="Division"
                                            placeholder={"Select Subscriber"}
                                            styles={CScolourStyles}
                                            // value={Payment}
                                            onChange={(e) => LoadSubscriber(e.value)}
                                            required
                                            id="Title"
                                        />
                                    </div>
                                </div>
                        }
                        <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC : "N/A"}</small>
                    </div >
                    <div className="col-lg-1">
                        <div className="cs_outer" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <form>
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={Date}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        onChange={(e) => setDate(e)}
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Invoice No</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control fw-bold" id="inputEmail3" value={InvoiceNo} disabled
                                    // onChange={(e) => setInvoiceNo(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Payment</label>
                                <div className="col-sm-9">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={[{ value: 1, label: "Due" }, { value: 2, label: "Paid" }, { value: 3, label: "Partial" }]}
                                        name="Division"
                                        placeholder={"Please select payment"}
                                        styles={CScolourStyles}
                                        value={Payment}
                                        onChange={(e) => { setPayment(e); Validate() }}
                                        required
                                        id="Title"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Rate</label>
                                <div className="col-sm-9">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={MarginList ? MarginList.map((option) => ({ label: option.Title, margin: option.ProfitMargin, operation: option.Operation, value: option.id })) : null}
                                        name="Percent"
                                        placeholder={"Please select rate"}
                                        styles={CScolourStyles}
                                        value={Percent}
                                        onChange={(e) => setPercent(e)}
                                        required
                                        id="Percent"
                                    />
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
                                placeholder="Code"
                                value={formData ? ItemCode : ""}
                                required
                                disabled={Percent ? false : true}
                            />
                        </div>
                        <div className="col-sm-4" disabled>
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Select Product</p>
                            <div className="input-group fs-5 fw-bold">
                                {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Array.isArray(MyProList) && MyProList.length ? MyProList.map((item) => ({ ItemCode: item.ItemCode, value: item.ItemCode, label: item.Title, UnitWeight: item.UnitWeight, UnitPrice: item.UnitPrice, Rate: item.MRP, Stock: item.Available })) : []}
                                    name="Title"
                                    placeholder={"Please select product"}
                                    styles={CScolourStyles}
                                    value={Title}
                                    onChange={(e) => { setFormData(e); setStock(e.Stock) }}
                                    required
                                    id="Title"
                                    isDisabled={Percent ? false : true}
                                />
                            </div>
                        </div>
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Wt</p>
                            <input
                                type="text"
                                id="UnitWeight"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Unit Weight"
                                value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                disabled={Percent ? false : true}
                                required
                            />
                        </div>
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Price</p>
                            <input
                                type="number"
                                id="UnitRate"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Unit Price"
                                value={UnitRate ? UnitRate : ""}
                                onChange={(e) => CS_Rate(e)}
                                disabled={Percent ? Percent.operation === 13 ? false : true : true}
                                required
                            />
                        </div>
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
                                disabled={Percent ? false : true}
                                required
                            />
                        </div>
                        <div className="col-sm-1">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Weight</p>
                            <input
                                type="text"
                                id="Weight"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Weight"
                                value={Weight ? Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                disabled
                                required
                            />
                        </div>
                        <div className="col-sm-2 border-right border-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Sub-Total</p>
                            <input
                                type="text"
                                id="SubTotal"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="SubTotal"
                                value={SubTotal ? SubTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                disabled
                                required
                            />
                        </div>

                        <div className="col-auto">
                            <p className="text-center text-dark fw-bold m-0" />
                            <Link to='#'
                                className="btn fs-3 text-center text-success"
                                onKeyDown={(e) => handleKeyDown(e)}
                                type="submit"
                                onClick={(e) => { Percent ? AddRow(e) : e.preventDefault(0) }}
                            >
                                <i className="fad fa-plus"></i>
                            </Link>
                        </div>
                    </form>


                    <InfoMessage
                        header="Stock Unavailable"
                        body_header={`Input quantity is not available. Max quantity weight is- ${Stock}`}
                        body="Please input valid range of quantity"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    <InvalidDate
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InvalidModalShow}
                        onHide={() => setInvalidModalShow(false)}
                    />

                    {Array.isArray(SellData) && SellData.length ?
                        <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                            <thead>
                                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                    <th className="py-1 border-right"><span>S/N</span></th>
                                    <th className="py-1 border-right"><span>Item Code</span></th>
                                    <th className="py-1 border-right"><span>Title</span></th>
                                    <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Quantity</span></th>
                                    <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Weight</span></th>
                                    <th className="py-1 border-right"><span>Rate</span></th>
                                    <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Sub-Total</span></th>
                                    <th className="py-1"><span>Action</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SellData.map((item, i) => (
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{item.ItemCode}</span></td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label}</span></td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="py-0">
                                                <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i)}>
                                                    <i className="fad fa-minus"></i>
                                                </button>
                                            </td>
                                        </tr>

                                    ))
                                }
                                <tr className="text-center border-success bg-white">
                                    <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right">Sub-total </span> </td>
                                    <td className="py-0 border-right"><span className="d-block text-right">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    <td className="px-3 py-0"></td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right">VAT Percent (%) </span> </td>
                                    <td className="py-0 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td>
                                    <td className="px-3 py-0"></td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right ">Discount (tk) </span> </td>
                                    <td className="py-0 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Discount" value={Discount}
                                        onChange={(e) => DiscountCalc(e)} /></td>
                                    <td className="px-3 py-0">
                                    </td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right font-weight-bold">Total Price </span> </td>
                                    <td className="py-0 border-right"><span className="d-block font-weight-bold text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    <td className="px-3 py-0"></td>
                                </tr>
                                {Payment.value === 3 ?
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
                                    : null}
                                <tr className="text-center border border-light mt-3">
                                    <td className="p-1"><span className="d-block text-right fw-bolder">Count:</span> </td>
                                    <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                    <td className="p-1"><span className="d-block text-right fw-bolder">Total Quantity:</span> </td>
                                    <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                    <td className="p-1" colSpan="2"><span className="d-block text-right fw-bolder">{Payment.value === 1 ? "Due: " : Payment.value === 2 ? "Paid: " : "Due: "}</span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? (0).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    <td className="px-3 py-0">
                                        <button className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                            onClick={() => SaveInvoice()}
                                        />
                                    </td>
                                </tr>

                                {/* <tr className="text-center border border-light mt-3">
                                    <td className="py-0"><span className="d-block text-right font-weight-bold">Count:</span> </td>
                                    <td className="py-0"><span className="d-block text-left font-weight-bold">{Count}</span> </td>
                                    <td className="py-0"><span className="d-block text-right font-weight-bold">Total Quantity:</span> </td>
                                    <td className="py-0"><span className="d-block text-left font-weight-bold">{QuantityTotal}</span> </td>
                                    <td className="py-0" colSpan="2"><span className="d-block text-right font-weight-bold">Due: </span> </td>
                                    <td className="py-0"><span className="d-block font-weight-bold">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    <td className="py-0">
                                        <button className="btn fs-3 px-2 py-0 text-success"
                                            onClick={() => SaveInvoice()}
                                        ><i className="fad fa-paper-plane"></i></button>
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                        </div>
                    }
                </div>


            </div>

        </div >

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.location.SupplierID,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(Sells);























// import React, { useState, useEffect, Fragment } from 'react';
// import { Link, Redirect, useHistory } from 'react-router-dom';
// import { logout } from '../../../actions/auth';
// import { GetSuppliers, MyProductList, Purchase } from '../../../actions/SuppliersAPI';
// import { FetchInvoiceNo, FetchProfitMargin, Invoice } from '../../../actions/APIHandler';
// import { connect, useDispatch } from 'react-redux';
// import { DISPLAY_OVERLAY } from '../../../actions/types';
// import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
// import Select from 'react-select';
// import errorIcon from '../../../assets/error.png';
// import infoIcon from '../../../assets/info.png';
// import successIcon from '../../../assets/success.png';
// import warningIcon from '../../../assets/warning.gif';
// import { customHeader, locales } from "../../Suppliers/Class/datepicker";
// import Datepicker from 'react-datepicker';
// import * as moment from 'moment'
// import { FetchSubscriber, FetchSubscriberList } from '../../../actions/InventoryAPI';
// let today = new Date();

// const Sells = ({ display, SupplierID, CompanyID, BranchID, user, list, setList }) => {
//     const [CreateModalShow, setCreateModalShow] = useState(false);
//     const [UpdateModalShow, setUpdateModalShow] = useState(false);
//     const [DeleteModalShow, setDeleteModalShow] = useState(false);
//     const [InvalidModalShow, setInvalidModalShow] = useState(false);
//     const [InfoModalShow, setInfoModalShow] = useState(false);
//     const [Supplier, setSupplier] = useState(null)
//     const [View, setView] = useState(false)
//     const [Data, setData] = useState(false)
//     const [Count, setCount] = useState(null)
//     const [Error, setError] = useState({});
//     const [Stock, setStock] = useState(0)
//     const [MyProList, setMyProList] = useState(false)
//     const [SubscriberList, setSubscriberList] = useState([])
//     const [Subscriber, setSubscriber] = useState(false)

//     const [Date, setDate] = useState(today)
//     const [InvoiceNo, setInvoiceNo] = useState(0)
//     const [Receiver, setReceiver] = useState(null)
//     const [Payment, setPayment] = useState(null)
//     const [Percent, setPercent] = useState(null)
//     const [Vat, setVat] = useState(null)
//     const [Discount, setDiscount] = useState(null)
//     const [Total, setTotal] = useState(0.00)
//     const [Paid, setPaid] = useState(0.00)
//     const [Due, setDue] = useState(0.00)

//     const [SellData, setSellData] = useState([])
//     const [locale, setLocale] = useState('en');
//     const [MarginList, setMarginList] = useState(false);

//     let toastProperties = null;
//     const dispatch = useDispatch();
//     const [formData, setFormData] = useState({
//         SLNo: "",
//         ItemCode: "",
//         Title: "",
//         UnitWeight: "",
//         UnitPrice: "",
//         Quantity: "",
//         Weight: "",
//         Rate: "",
//         SubTotal: "",
//     });
//     const { ItemCode, Title, UnitWeight, UnitPrice, Quantity, Weight, Rate, SubTotal } = formData;
//     const UnitRate = Percent || UnitPrice ? UnitPrice + (UnitPrice * Percent.margin) / 100 : "";

//     useEffect(() => {
//         LoadSubscriberList();
//         LoadProductItems();
//         LoadInvoiceNo();
//         LoadProfitMargin();
//     }, [])


//     const LoadInvoiceNo = async () => {
//         dispatch({ type: DISPLAY_OVERLAY, payload: true });
//         var result = await FetchInvoiceNo('DS');

//         if (result !== true) {
//             setInvoiceNo(result)
//         } else {
//             // history.push('/farm_lists');
//         }
//         dispatch({ type: DISPLAY_OVERLAY, payload: false });
//     }

//     const LoadSubscriberList = async () => {
//         dispatch({ type: DISPLAY_OVERLAY, payload: true });
//         var result = await FetchSubscriberList();

//         if (result !== true) {
//             setSubscriberList(result.Subscriber);
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//         } else {
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//             // history.push('/farm_lists');
//         }
//         dispatch({ type: DISPLAY_OVERLAY, payload: false });
//     }

//     const LoadSubscriber = async (BisID) => {
//         dispatch({ type: DISPLAY_OVERLAY, payload: true });
//         var result = await FetchSubscriber(BisID);

//         if (result !== true) {
//             setSubscriber(result[0]);
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//         } else {
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//             // history.push('/farm_lists');
//         }
//         dispatch({ type: DISPLAY_OVERLAY, payload: false });
//     }

//     const LoadProfitMargin = async () => {
//         dispatch({ type: DISPLAY_OVERLAY, payload: true });
//         var result = await FetchProfitMargin();
//         if (result !== true) {
//             setMarginList(result);
//         } else {
//             // history.push('/my_supplier');
//         }
//         dispatch({ type: DISPLAY_OVERLAY, payload: false });
//     }

//     const LoadSuppliers = async () => {
//         var result = await GetSuppliers(SupplierID);
//         if (result !== true) {
//             setSupplier(result);
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//         } else {
//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//             // history.push('/supplier_items');
//         }
//     }

//     const LoadProductItems = async () => {
//         if (user !== null) {
//             dispatch({ type: DISPLAY_OVERLAY, payload: true });
//             var ProductItems = await MyProductList();
//             if (ProductItems !== true)
//                 setMyProList(ProductItems.data);

//             dispatch({ type: DISPLAY_OVERLAY, payload: false });
//         } else {
//             // history.push('/my_supplier');
//         }
//     }


//     const CScolourStyles = {
//         container: base => ({
//             ...base,
//             flex: 1,
//             fontWeight: "500"
//         }),
//     }

//     const handleKeyDown = (e) => {
//         if (e.keyCode === 13) {
//             AddRow();
//         }
//     }

//     const AddRow = (e) => {
//         if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined) {
//             setInfoModalShow(true)
//         } else if (Stock < Weight) {
//             setInfoModalShow(true)
//         } else {
//             setSellData([...SellData, formData]);
//             setCount(Count + 1);
//             setTotal(0.00);
//             setVat(0.00);
//             setDiscount(0.00);
//             setFormData({
//                 SLNo: "",
//                 ItemCode: "",
//                 Title: "",
//                 UnitWeight: "",
//                 UnitPrice: "",
//                 Quantity: "",
//                 Weight: "",
//                 Rate: "",
//                 SubTotal: "",
//             });
//         }
//     }

//     const getTotal = () => {
//         let TotalPrice = 0.00;
//         const price = Array.isArray(SellData) && SellData.length ? SellData.map(row => row.Quantity * row.Rate) : 0.00;
//         if (price.length > 0) {
//             TotalPrice = price.reduce((acc, val) => acc + val);
//         }
//         return TotalPrice;
//     }
//     const QuantityTotal = Array.isArray(SellData) && SellData.length ? SellData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0) : 0;

//     const deleteRow = (i) => {
//         const newRows = Array.isArray(SellData) && SellData.length ? SellData.splice(i, 1).concat(SellData.slice(i + 1)) : 0;
//         setCount(Count - 1)
//     };

//     const shouldBlur = (e) => {
//         if (e.keyCode === 13) {
//             e.target.blur();
//             AddRow();
//         }
//     }

//     const history = useHistory();

//     const SaveInvoice = async () => {
//         let Sell_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC_ID : "N/A"
//         let Sell_Code = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC_Code : "N/A"
//         let Stock_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).StockAC_ID : "N/A"
//         let Stock_Code = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).StockAC_Code : "N/A"
//         let VatTotal = (getTotal() * Vat) / 100
//         let GrandTotal = Total === 0 ? getTotal() : Total

//         if (user !== null) {
//             dispatch({ type: DISPLAY_OVERLAY, payload: true });
//             var data = moment(Date).format('YYYY-MM-DD')
//             var result = await Invoice(Subscriber.id, InvoiceNo, data, Vat, VatTotal, Discount, Payment.value, GrandTotal, Payment.value === 2 ? GrandTotal : Payment.value === 3 ? Paid : 0.00, Payment.value === 1 ? GrandTotal : Payment.value === 3 ? Due : 0.00, Count, SellData, Sell_ID, Sell_Code);

//             if (result !== true) {
//                 if (result.error) {
//                     const updatedState = {};
//                     for (var pair of result.exception.entries()) {
//                         updatedState[pair[1].field] = pair[1].message;
//                         setError({ ...updatedState });
//                     }
//                     setList([...list, toastProperties = {
//                         id: 1,
//                         title: 'Invalid Data',
//                         description: result.message,
//                         backgroundColor: '#f0ad4e',
//                         icon: warningIcon
//                     }])
//                     dispatch({ type: DISPLAY_OVERLAY, payload: false });
//                 } else {
//                     setList([...list, toastProperties = {
//                         id: 1,
//                         title: result.Title,
//                         description: result.message,
//                         backgroundColor: '#f0ad4e',
//                         icon: result.ico === 1 ? infoIcon : successIcon
//                     }])
//                     LoadInvoiceNo();
//                     dispatch({ type: DISPLAY_OVERLAY, payload: false });
//                 }
//             } else {
//                 setList([...list, toastProperties = {
//                     id: 1,
//                     title: 'Error',
//                     description: "Failed to save product profile. Please try after some moment.",
//                     backgroundColor: '#f0ad4e',
//                     icon: errorIcon
//                 }])
//                 dispatch({ type: DISPLAY_OVERLAY, payload: false });
//             }

//             dispatch({ type: DISPLAY_OVERLAY, payload: false });

//         } else {
//             history.push('/my_supplier');
//         }
//     }

//     const VatCalc = (e) => {
//         setVat(e.target.value)
//         let SubTotal = getTotal();
//         let bat = SubTotal + ((SubTotal * e.target.value) / 100)
//         let Disc = Number(bat) - Number(Discount)
//         let left = Number(Disc) - Paid
//         setTotal(Disc);
//         setDue(left);
//     }

//     const DiscountCalc = (e) => {
//         setDiscount(e.target.value)
//         let SubTotal = getTotal();
//         let VatCal = SubTotal + ((SubTotal * Vat) / 100)
//         let Disc = Number(VatCal) - Number(e.target.value)
//         let left = Number(Disc) - Paid
//         setTotal(Disc);
//         setDue(left);
//     }

//     const PaidCalc = (e) => {
//         setPaid(e.target.value)
//         let SubTotal = getTotal();
//         let VatCal = SubTotal + ((SubTotal * Vat) / 100)
//         let Disc = Number(VatCal) - Discount
//         let left = Number(Disc) - Number(e.target.value)

//         // setTotal(left);
//         setDue(left);
//     }

//     const PaidNDue = (value) => {
//         setPaid(value)
//         let SubTotal = getTotal();
//         let VatCal = SubTotal + ((SubTotal * Vat) / 100)
//         let Disc = Number(VatCal) - Discount
//         let left = Number(Disc) - Number(value)

//         // setTotal(left);
//         setDue(left);
//     }

//     const BarcodeGen = (e) => {
//         setFormData({
//             ...formData,
//             "SLNo": Count === 0 ? 1 : Count + 1,
//             "Quantity": e.target.value,
//             "Weight": (UnitWeight * e.target.value).toFixed(3),
//             "Rate": (UnitPrice + (UnitPrice * Percent.margin) / 100).toFixed(6),
//             "SubTotal": ((UnitPrice + (UnitPrice * Percent.margin) / 100) * e.target.value).toFixed(2)
//         });
//     }

//     const isStringNullOrWhiteSpace = (str) => {
//         return str === undefined || str === null || str === "";
//     }

//     const Validate = () => {
//         if (!isStringNullOrWhiteSpace(Date) && !isStringNullOrWhiteSpace(InvoiceNo) && !isStringNullOrWhiteSpace(Payment))
//             return false;
//         return true;
//     }

//     const ClearForm = () => {
//         LoadInvoiceNo();
//         setSellData([]);
//         setSubscriber(false);
//         setPayment(false);
//         setPercent(false);
//         setCount(0);
//         setTotal(0.00);
//         setVat(0.00);
//         setDiscount(0.00);
//         setFormData({
//             ItemCode: "",
//             Title: "",
//             UnitWeight: "",
//             UnitPrice: "",
//             Quantity: "",
//             Weight: "",
//             Rate: "",
//             SubTotal: "",
//         });
//     }

//     return (
//         <div className="row h-100 m-0 d-flex justify-content-center">
//             <div className="header mb-4">
//                 <p className="display-6 d-flex justify-content-center m-0">
//                     Product Sell
//                 </p>
//                 <nav aria-label="breadcrumb">
//                     <ol className="breadcrumb d-flex justify-content-center">
//                         <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//                         <li className="breadcrumb-item"><Link to="/rtl_sell">Product Sell</Link></li>
//                     </ol>
//                 </nav>
//             </div>
//             <div className="col-lg-12 h-100 pl-0">

//                 <div className="row d-flex bg-white mx-auto">
//                     <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center">
//                         {
//                             Subscriber ?
//                                 Subscriber.TypeID === 0 ?
//                                     <div className="row g-0">
//                                         <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

//                                         <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
//                                             <img className="img-fluid mx-auto d-block rounded-start" alt="..."
//                                                 src={process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
//                                         </div>
//                                         <div className="col-md-10">
//                                             <div className="card-body">
//                                                 <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
//                                                 {/* <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.UserID.MobileNo}</span></p> */}
//                                                 <br />
//                                                 <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     :
//                                     Subscriber.TypeID === 1 || Subscriber.TypeID === 2 || Subscriber.TypeID === 4 ?
//                                         <div className="row g-0">
//                                             <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

//                                             <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
//                                                 <img className="img-fluid mx-auto d-block rounded-start" alt="..."
//                                                     src={Subscriber.UserDetails[0] ? Subscriber.UserDetails[0].Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
//                                             </div>
//                                             <div className="col-md-10">
//                                                 <div className="card-body">
//                                                     <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
//                                                     <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.UserID.MobileNo}</span></p>

//                                                     <small className="text-muted">{Subscriber.UserDetails[0].VillageName + ", " + Subscriber.UserDetails[0].Union + ", " + Subscriber.UserDetails[0].Upazila + ", " + Subscriber.UserDetails[0].Zila + ", " + Subscriber.UserDetails[0].Division}</small>
//                                                     <br />
//                                                     <br />
//                                                     <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         :
//                                         Subscriber.TypeID === 3 ?
//                                             <div className="row g-0">
//                                                 <p className="fs-6 text-success text-center fw-bold m-0">Subscriber Info</p>

//                                                 <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
//                                                     <img className="img-fluid mx-auto d-block rounded-start" alt="..."
//                                                         src={process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
//                                                 </div>
//                                                 <div className="col-md-10">
//                                                     <div className="card-body">
//                                                         <p className="display-6 fw-bold m-0">{Subscriber.id + ". " + Subscriber.Title}</p>
//                                                         <p className="fs-6 m-0">{Subscriber.Type} <span className="fs-6 fw-bold m-0">{", " + Subscriber.Contact}</span></p>

//                                                         <small className="text-muted">{Subscriber.Address}</small>
//                                                         <br />
//                                                         <br />
//                                                         <button className='btn btn-outline-warning fw-bold py-0' onClick={() => ClearForm()}><i class="fad fa-user-times"></i> Clear</button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             :
//                                             <div className="row w-100">
//                                                 <p className="fs-6 text-success text-center fw-bold m-0">Please Select Subscriber</p>
//                                                 <div className="col-sm-12">
//                                                     <Select
//                                                         menuPlacement="auto"
//                                                         menuPosition="fixed"
//                                                         menuPortalTarget={document.body}
//                                                         borderRadius={"0px"}
//                                                         options={SubscriberList}
//                                                         name="Division"
//                                                         placeholder={"Select Subscriber"}
//                                                         styles={CScolourStyles}
//                                                         // value={Payment}
//                                                         onChange={(e) => LoadSubscriber(e.value)}
//                                                         required
//                                                         id="Title"
//                                                     />
//                                                 </div>
//                                             </div>
//                                 :
//                                 <div className="row w-100">
//                                     <p className="fs-6 text-success text-center fw-bold m-0">Please Select Subscriber</p>
//                                     <div className="col-sm-12">
//                                         <Select
//                                             menuPlacement="auto"
//                                             menuPosition="fixed"
//                                             menuPortalTarget={document.body}
//                                             borderRadius={"0px"}
//                                             options={SubscriberList}
//                                             name="Division"
//                                             placeholder={"Select Subscriber"}
//                                             styles={CScolourStyles}
//                                             // value={Payment}
//                                             onChange={(e) => LoadSubscriber(e.value)}
//                                             required
//                                             id="Title"
//                                         />
//                                     </div>
//                                 </div>
//                         }
//                         <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).SellAC : "N/A"}</small>
//                     </div >
//                     <div className="col-lg-1">
//                         <div className="cs_outer" style={{ height: "100%" }}>
//                             <div className="cs_inner"></div>
//                         </div>
//                     </div>

//                     <div className="col-lg-6">
//                         <form>
//                             <div className="row mb-3 mt-3">
//                                 <label className="col-sm-3 col-form-label text-success fw-bold">Date</label>
//                                 <div className="col-sm-9">
//                                     <Datepicker
//                                         selected={Date}
//                                         className="form-control fw-bold"
//                                         dateFormat="dd MMM yyyy"
//                                         onChange={(e) => setDate(e)}
//                                         renderCustomHeader={props => customHeader({ ...props, locale })}
//                                         locale={locales[locale]}
//                                         placeholderText="Please select date"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <label className="col-sm-3 col-form-label text-success fw-bold">Invoice No</label>
//                                 <div className="col-sm-9">
//                                     <input type="text" className="form-control fw-bold" id="inputEmail3" value={InvoiceNo} disabled
//                                     // onChange={(e) => setInvoiceNo(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <label className="col-sm-3 col-form-label text-success fw-bold">Payment</label>
//                                 <div className="col-sm-9">
//                                     <Select
//                                         menuPlacement="auto"
//                                         menuPosition="fixed"
//                                         menuPortalTarget={document.body}
//                                         borderRadius={"0px"}
//                                         options={[{ value: 1, label: "Due" }, { value: 2, label: "Paid" }, { value: 3, label: "Partial" }]}
//                                         name="Division"
//                                         placeholder={"Please select payment"}
//                                         styles={CScolourStyles}
//                                         value={Payment}
//                                         onChange={(e) => { setPayment(e); Validate() }}
//                                         required
//                                         id="Title"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="row mb-3">
//                                 <label className="col-sm-3 col-form-label text-success fw-bold">Rate</label>
//                                 <div className="col-sm-9">
//                                     <Select
//                                         menuPlacement="auto"
//                                         menuPosition="fixed"
//                                         menuPortalTarget={document.body}
//                                         borderRadius={"0px"}
//                                         options={MarginList ? MarginList.map((option) => ({ label: option.Title, value: option.ProfitMargin })) : null}
//                                         name="Percent"
//                                         placeholder={"Please select rate"}
//                                         styles={CScolourStyles}
//                                         value={Percent}
//                                         onChange={(e) => setPercent(e)}
//                                         required
//                                         id="Percent"
//                                     />
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>


//                 <div className="row justify-content-center mx-auto d-table w-100 h-100">

//                     <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
//                         <div className="col-sm-1">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Code</p>
//                             <input
//                                 type="number"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 id="ItemCode"
//                                 placeholder="Code"
//                                 value={formData ? ItemCode : ""}
//                                 required
//                                 disabled={Percent ? false : true}
//                             />
//                         </div>
//                         <div className="col-sm-4" disabled>
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Select Product</p>
//                             <div className="input-group fs-5 fw-bold">
//                                 {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
//                                 <Select
//                                     menuPlacement="auto"
//                                     menuPosition="fixed"
//                                     menuPortalTarget={document.body}
//                                     borderRadius={"0px"}
//                                     options={Array.isArray(MyProList) && MyProList.length ? MyProList.map((item) => ({ ItemCode: item.ItemCode, value: item.ItemCode, label: item.Title, UnitWeight: item.UnitWeight, UnitPrice: item.UnitPrice, Stock: item.Available })) : []}
//                                     name="Title"
//                                     placeholder={"Please select product"}
//                                     styles={CScolourStyles}
//                                     value={Title}
//                                     onChange={(e) => { setFormData(e); setStock(e.Stock) }}
//                                     required
//                                     id="Title"
//                                     isDisabled={Percent ? false : true}
//                                 />
//                             </div>
//                         </div>
//                         <div className="col-sm-1">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Wt</p>
//                             <input
//                                 type="text"
//                                 id="UnitWeight"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 placeholder="Unit Weight"
//                                 value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
//                                 disabled={Percent ? false : true}
//                                 required
//                             />
//                         </div>
//                         <div className="col-sm-1">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Unit Price</p>
//                             <input
//                                 type="text"
//                                 id="UnitRate"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 placeholder="Unit Price"
//                                 value={UnitRate ? UnitRate.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
//                                 disabled={Percent ? false : true}
//                                 required
//                             />
//                         </div>
//                         <div className="col-sm-1">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Quantity</p>
//                             <input
//                                 type="number"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 name="Quantity"
//                                 id="Quantity"
//                                 placeholder="Quantity"
//                                 value={Quantity}
//                                 onChange={(e) => BarcodeGen(e)}
//                                 onKeyDown={(e) => shouldBlur(e)}
//                                 disabled={Percent ? false : true}
//                                 required
//                             />
//                         </div>
//                         <div className="col-sm-1">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Weight</p>
//                             <input
//                                 type="text"
//                                 id="Weight"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 placeholder="Weight"
//                                 value={Weight ? Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
//                                 disabled
//                                 required
//                             />
//                         </div>
//                         <div className="col-sm-2 border-right border-2">
//                             <p className="text-center text-dark fw-bold m-0 border-bottom">Sub-Total</p>
//                             <input
//                                 type="text"
//                                 id="SubTotal"
//                                 className="form-control fs-5 fw-bold p-0 text-center"
//                                 placeholder="SubTotal"
//                                 value={SubTotal ? SubTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
//                                 disabled
//                                 required
//                             />
//                         </div>

//                         <div className="col-auto">
//                             <p className="text-center text-dark fw-bold m-0" />
//                             <Link to='#'
//                                 className="btn fs-3 text-center text-success"
//                                 onKeyDown={(e) => handleKeyDown(e)}
//                                 type="submit"
//                                 onClick={(e) => { Percent ? AddRow(e) : e.preventDefault(0) }}
//                             >
//                                 <i className="fad fa-plus"></i>
//                             </Link>
//                         </div>
//                     </form>


//                     <InfoMessage
//                         header="Stock Unavailable"
//                         body_header={`Input quantity is not available. Max quantity weight is- ${Stock}`}
//                         body="Please input valid range of quantity"
//                         show={InfoModalShow}
//                         onHide={() => setInfoModalShow(false)}
//                     />

//                     <InvalidDate
//                         header="Invalid Data"
//                         body_header="Input data is not valid. Please fill input field correctly."
//                         body="Please fill all field correctly"
//                         show={InvalidModalShow}
//                         onHide={() => setInvalidModalShow(false)}
//                     />

//                     {Array.isArray(SellData) && SellData.length ?
//                         <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
//                             <thead>
//                                 <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
//                                     <th className="py-1 border-right"><span>S/N</span></th>
//                                     <th className="py-1 border-right"><span>Item Code</span></th>
//                                     <th className="py-1 border-right"><span>Title</span></th>
//                                     <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Quantity</span></th>
//                                     <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Weight</span></th>
//                                     <th className="py-1 border-right"><span>Rate</span></th>
//                                     <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Sub-Total</span></th>
//                                     <th className="py-1"><span>Action</span></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     SellData.map((item, i) => (
//                                         <tr className="border-bottom text-center" key={i}>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold">{item.ItemCode}</span></td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label}</span></td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                             <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                             <td className="py-0">
//                                                 <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i)}>
//                                                     <i className="fad fa-minus"></i>
//                                                 </button>
//                                             </td>
//                                         </tr>

//                                     ))
//                                 }
//                                 <tr className="text-center border-success bg-white">
//                                     <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right">Sub-total </span> </td>
//                                     <td className="py-0 border-right"><span className="d-block text-right">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                     <td className="py-0" className="px-3 py-0"></td>
//                                 </tr>
//                                 <tr className="text-center border-success bg-white">
//                                     <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right">VAT Percent (%) </span> </td>
//                                     <td className="py-0 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td>
//                                     <td className="py-0" className="px-3 py-0"></td>
//                                 </tr>
//                                 <tr className="text-center border-success bg-white">
//                                     <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right ">Discount (tk) </span> </td>
//                                     <td className="py-0 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Discount" value={Discount}
//                                         onChange={(e) => DiscountCalc(e)} /></td>
//                                     <td className="py-0" className="px-3 py-0">
//                                     </td>
//                                 </tr>
//                                 <tr className="text-center border-success bg-white">
//                                     <td className="py-0 px-3 border-right" colSpan="6"><span className="d-block text-right font-weight-bold">Total Price </span> </td>
//                                     <td className="py-0 border-right"><span className="d-block font-weight-bold text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                     <td className="py-0" className="px-3 py-0"></td>
//                                 </tr>
//                                 {Payment.value === 3 ?
//                                     <tr className="text-center border-success bg-white">
//                                         <td className="p-1 px-3 border-right" colSpan="6"><span className="d-block text-right fw-bolder fs-4">PAID </span> </td>
//                                         <td className="p-1 d-flex justify-content-end border-right">
//                                             <input type="text"
//                                                 autocomplete="off"
//                                                 className="d-block text-right border fs-4 fw-bolder"
//                                                 id="Paid"
//                                                 value={Paid}
//                                                 onChange={(e) => PaidCalc(e)} />
//                                         </td>
//                                     </tr>
//                                     : null}
//                                 <tr className="text-center border border-light mt-3">
//                                     <td className="p-1"><span className="d-block text-right fw-bolder">Count:</span> </td>
//                                     <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
//                                     <td className="p-1"><span className="d-block text-right fw-bolder">Total Quantity:</span> </td>
//                                     <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
//                                     <td className="p-1" colSpan="2"><span className="d-block text-right fw-bolder">{Payment.value === 1 ? "Due: " : Payment.value === 2 ? "Paid: " : "Due: "}</span> </td>
//                                     <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? (0).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                     <td className="p-1" className="px-3 py-0">
//                                         <button className="btn fs-3 py-1 fad fa-paper-plane text-success"
//                                             onClick={() => SaveInvoice()}
//                                         />
//                                     </td>
//                                 </tr>

//                                 {/* <tr className="text-center border border-light mt-3">
//                                     <td className="py-0"><span className="d-block text-right font-weight-bold">Count:</span> </td>
//                                     <td className="py-0"><span className="d-block text-left font-weight-bold">{Count}</span> </td>
//                                     <td className="py-0"><span className="d-block text-right font-weight-bold">Total Quantity:</span> </td>
//                                     <td className="py-0"><span className="d-block text-left font-weight-bold">{QuantityTotal}</span> </td>
//                                     <td className="py-0" colSpan="2"><span className="d-block text-right font-weight-bold">Due: </span> </td>
//                                     <td className="py-0"><span className="d-block font-weight-bold">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
//                                     <td className="py-0">
//                                         <button className="btn fs-3 px-2 py-0 text-success"
//                                             onClick={() => SaveInvoice()}
//                                         ><i className="fad fa-paper-plane"></i></button>
//                                     </td>
//                                 </tr> */}
//                             </tbody>
//                         </table>
//                         :
//                         <div className={`d-flex justify-content-center align-items-center bg-white`}>
//                             <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
//                         </div>
//                     }
//                 </div>


//             </div>

//         </div >

//     );
// }
// const mapStateToProps = (state, props) => ({
//     display: state.OverlayDisplay,
//     SupplierID: props.location.SupplierID,
//     user: state.auth.user
// });

// export default connect(mapStateToProps, { logout })(Sells);