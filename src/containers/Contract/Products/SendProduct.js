import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchInvoiceNo, FetchMargin } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { GetActiveBatch, Invoice } from '../../../actions/ContractAPI';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
// import { exportPDF } from '../Class/OrderPDF';
// import DatePicker from "../../Suppliers/Class/datepicker";
import * as moment from 'moment';
import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

// import required css from library
import "react-datepicker/dist/react-datepicker.css";

let today = new Date();
const SendProduct = ({ display, BisID, CompanyID, BranchID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Fram, setFram] = useState(null)
    const [ActiveBatch, setActiveBatch] = useState(false)
    const [Data, setData] = useState(false)
    const [Count, setCount] = useState(0)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState(false)
    const [MarginList, setMarginList] = useState(false)

    const [Date, setDate] = useState(today)
    const [InvoiceNo, setInvoiceNo] = useState("")
    const [Receiver, setReceiver] = useState(null)
    const [Payment, setPayment] = useState(null)
    const [Stock, setStock] = useState(null)
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [NetTotal, setNetTotal] = useState(0.00)
    const [locale, setLocale] = useState('en');

    const [SellData, setPurchaseData] = useState([])
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

    const UnitRate = Percent || UnitPrice ? UnitPrice + (UnitPrice * Percent.value) / 100 : "";


    useEffect(() => {
        LoadFarm();
        LoadProductItems();
        LoadInvoiceNo();
        Margin();
    }, [])

    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchInvoiceNo('CI');

        if (result !== true) {
            setInvoiceNo(result)
        } else {
            history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadFarm = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await GetActiveBatch(BisID);
        if (result !== true && result.length !== 0) {
            setFram(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadProductItems = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var ProductItems = await MyProductList();
            if (ProductItems !== true)
                setMyProList(ProductItems.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_supplier');
        }
    }

    const Margin = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await FetchMargin(1);

        if (result !== true) {
            setMarginList(result)
            setPercent({ label: result[0].label, value: result[0].value })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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
        e.preventDefault();
        if (Date === "" || Date === undefined || InvoiceNo === "" || InvoiceNo === undefined || formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined) {
            setInvalidModalShow(true)
        } else if (Stock < Weight) {
            setInfoModalShow(true)
        } else {
            setPurchaseData([...SellData, formData]);
            setCount(Count + 1);
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
        const price = SellData.map(row => row.Quantity * row.Rate);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice
    }

    const netPrice = () => {
        let Disc = 0.00;
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100);
        Disc = Number(VatCal) - Number(Discount);
        return Disc
    }

    const TotalPrice = () => {
        let Ship = 0.00;
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100);
        Ship = Number(VatCal) - Number(Discount) + Number(Shipment);
        return parseFloat(Ship).toFixed(2)
    }

    const QuantityTotal = SellData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0);

    const deleteRow = (i) => {
        const newRows = SellData.splice(i, 1).concat(SellData.slice(i + 1));
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
        let ProductSent_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC_ID : "N/A"
        let ProductSent_Code = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC_Code : "N/A"

        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format('YYYY-MM-DD')
        var result = await Invoice(BisID, Fram.id, InvoiceNo, data, Vat, (getTotal() * Vat) / 100, Discount, Shipment, TotalPrice(), Count, SellData, ProductSent_ID, ProductSent_Code);

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
                description: "Failed to save invoice. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const VatCalc = (e) => {
        setVat(e.target.value)
        let SubTotal = getTotal();
        let Vat = SubTotal + ((SubTotal * e.target.value) / 100)
        let Ship = Number(Vat) + Number(Shipment);
        setNetTotal(Vat);
        setTotal(Ship);
    }

    const DiscountCalc = (e) => {
        setDiscount(e.target.value)
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100);
        let Discount = Number(VatCal) - Number(e.target.value);
        let Ship = Number(VatCal) - Number(e.target.value) + Number(Shipment);
        setNetTotal(Discount);
        setTotal(Ship);
    }

    const ShippingCalc = (e) => {
        setShipment(e.target.value)
        let VatCal = NetTotal === 0.00 ? getTotal() + Number(e.target.value) : NetTotal + Number(e.target.value)
        setTotal(VatCal);
    }

    const BarcodeGen = (e) => {
        let Bar = CompanyID + BranchID + BisID + (InvoiceNo ? InvoiceNo : "") + ItemCode + e.target.value;
        setFormData({
            ...formData,
            "SLNo": Count === 0 ? 1 : Count + 1,
            "Quantity": e.target.value,
            "Weight": (UnitWeight * e.target.value).toFixed(3),
            "Rate": (UnitPrice + (UnitPrice * Percent.value) / 100).toFixed(6),
            "SubTotal": ((UnitPrice + (UnitPrice * Percent.value) / 100) * e.target.value).toFixed(2)
        });
    }

    const update = (e) => {
        e.parentElement.setAttribute('data-value', e.value)
    }

    const CalculateAge = (Placed) => {
        let BirthDate = new window.Date(Placed);
        let tod = new window.Date(Date).getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = days_diff;
        return age;
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">
                    Product Dispatch To Contract Farm
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/rtl_sell">Send Product</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12 h-100 p-0">

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center">
                        {
                            Fram ?
                                <div className="row g-0">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Fram Info</p>

                                    <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                        <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                            src={Fram.UserID.Details[0] ? Fram.UserID.Details[0].Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                    </div>
                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <p className="display-6 fw-bold m-0">{Fram.BusinessID.id + ". " + Fram.BusinessID.Title}</p>
                                            <small className="text-muted">{"Batch Id " + Fram.id + ", Batch No " + Fram.BatchNo + ", Placed- " + moment(Fram.IssueDate).format("DD MMM YYYY") + ", Day- " + CalculateAge(Fram.IssueDate)}</small>
                                            <p className="fs-6 m-0">{Fram.CondID.Title}</p>
                                            <p className="fs-6 m-0">{Fram.farm[0].Employee + ", " + Fram.farm[0].ContactNo}</p>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC : "N/A"}</small>
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
                                    <input
                                        type="text"
                                        className="form-control fw-bold fs-5"
                                        id="InvoiceNo"
                                        value={InvoiceNo}
                                        onChange={(e) => setInvoiceNo(e.target.value)}
                                        disabled
                                        onClick={() => LoadInvoiceNo()}
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
                                        options={MarginList ? MarginList : null}
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
                                    options={Array.isArray(MyProList) && MyProList.length ? MyProList.map((item) => ({ ItemCode: item.ItemCode, value: item.ItemCode, label: item.Title, UnitWeight: item.UnitWeight, UnitPrice: item.UnitPrice, Stock: item.Available })) : []}
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
                                type="text"
                                id="UnitRate"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Unit Price"
                                value={UnitRate ? UnitRate.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                disabled={Percent ? false : true}
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
                            <button className="btn fs-3 p-0 text-success"
                                disabled={Percent ? false : true}
                                onKeyDown={(e) => handleKeyDown(e)}
                                type="submit"
                                onClick={(e) => AddRow(e)}>
                                <i className="fad fa-plus"></i>
                            </button>
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
                                    <th className="py-2 border-right"><span>S/N</span></th>
                                    <th className="py-2 border-right"><span>Item Code</span></th>
                                    <th className="py-2 border-right"><span>Title</span></th>
                                    <th className="py-2 border-right"><span className="d-block text-right fw-bolder">Quantity</span></th>
                                    <th className="py-2 border-right"><span className="d-block text-right fw-bolder">Weight</span></th>
                                    <th className="py-2 border-right"><span>Rate</span></th>
                                    <th className="py-2 border-right"><span className="d-block text-right fw-bolder">Sub-Total</span></th>
                                    <th className="py-2"><span>Action</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SellData.map((item, i) => (
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="p-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                            <td className="p-0 border-right"><span className="d-block fw-bold">{item.ItemCode}</span></td>
                                            <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label}</span></td>
                                            <td className="p-0 border-right"><span className="d-block fw-bold">{(item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="p-0 border-right"><span className="d-block fw-bold">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="p-0 border-right"><span className="d-block fw-bold">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="p-1 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="p-0">
                                                <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i)}>
                                                    <i className="fad fa-minus"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                <tr className="text-center border-success bg-white">
                                    <td className="p-1 border-right" colSpan="6"><span className="d-block text-right fw-bolder">Sub-total </span> </td>
                                    <td className="p-1 border-right">
                                        <span className="d-block text-right fw-bolder">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                                    </td>
                                    <td className="p-1"></td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="p-1 border-right" colSpan="6"><span className="d-block text-right fw-bold">VAT Percent (%) </span> </td>
                                    <td className="p-1 border-right d-flex justify-content-end">
                                        <input
                                            type="text"
                                            autocomplete="off"
                                            className="d-block text-right border-0 fw-bold"
                                            id="Vat"
                                            placeholder="Type Vat"
                                            value={Vat.toLocaleString("en", { minimumFractionDigits: 2 })}
                                            onChange={(e) => VatCalc(e)}
                                            oninput={(e) => update(e)}
                                        />
                                    </td>
                                    <td className="p-1 "></td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="p-1 border-right" colSpan="6"><span className="d-block text-right fw-bold">Discount (tk) </span> </td>
                                    <td className="p-1 border-right d-flex justify-content-end">
                                        <input type="text"
                                            autocomplete="off"
                                            className="d-block text-right border-0 fw-bold"
                                            id="Discount"
                                            placeholder="Type Discount"
                                            value={Discount.toLocaleString("en", { minimumFractionDigits: 2 })}
                                            onChange={(e) => DiscountCalc(e)} /></td>
                                    <td className="p-1">
                                    </td>
                                </tr>
                                <tr className="text-center border-success bg-white">
                                    <td className="p-1 border-right" colSpan="6"><span className="d-block text-right fw-bolder">Total Price </span> </td>
                                    <td className="p-1 border-right">
                                        <span className="d-block fw-bolder text-right">
                                            {netPrice().toLocaleString("en", { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="p-1"></td>
                                </tr>

                                <tr className="text-center border-success bg-white">
                                    <td className="p-1 border-right" colSpan="6"><span className="d-block text-right fw-bold">Shipping Cost</span> </td>
                                    <td className="p-1 border-right d-flex justify-content-end">
                                        <input type="text"
                                            autocomplete="off"
                                            className="d-block text-right border-0 fw-bold"
                                            id="Shipment"
                                            value={Shipment.toLocaleString("en", { minimumFractionDigits: 2 })}
                                            placeholder="Total Shipment Cost"
                                            onChange={(e) => ShippingCalc(e)} /></td>
                                    <td className="p-1">
                                    </td>
                                </tr>


                                <tr className="text-center border border-light mt-3">
                                    <td className="p-1"><span className="d-block text-right fw-bold">Count:</span> </td>
                                    <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                    <td className="p-1"><span className="d-block text-right fw-bold">Total Quantity:</span> </td>
                                    <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                    <td className="p-1" colSpan="2"><span className="d-block text-right fw-bolder">Grand Total: </span> </td>
                                    <td className="p-1"><span className="d-block fw-bolder text-right">{TotalPrice().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    <td className="px-3 py-0">
                                        <button type="button" className="btn fs-3 p-0 text-success"
                                            onClick={() => SaveInvoice()}>
                                            <i className="fad fa-paper-plane px-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                        </div>
                    }
                </div>


            </div>

        </div>

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BisID: props.match.params.id
});

export default connect(mapStateToProps, { logout })(SendProduct);