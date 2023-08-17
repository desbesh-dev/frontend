import * as moment from 'moment';
import { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import VirtualizedSelect from "react-virtualized-select";
import 'react-virtualized-select/styles.css';
import { SupplierProductAll, SupplierProductDropdown, fetchServerTimestamp } from '../../actions/APIHandler';
import { FetchPurchaseNo, PaymentTerms } from '../../actions/InventoryAPI';
import { GetSuppliers, Purchase } from '../../actions/SuppliersAPI';
import { FetchProductDetails } from '../../actions/YardAPI';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import '../../hocs/react-select/dist/react-select.css';
import { InfoMessage, InvalidDate } from "../Modals/ModalForm.js";
import { customHeader, locales } from "../Suppliers/Class/datepicker";

let today = new Date();

const CtrPurchase = ({ user, list, setList, SupplierID, SectorID, CtrID, CtrNo }) => {
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [InvalidHeader, setInvalidHeader] = useState('N/A');
    const [InvalidBody, setInvalidBody] = useState('N/A');
    let [Supplier, setSupplier] = useState(null)
    const [View, setView] = useState(false)
    const [Data, setData] = useState(false)
    const [Error, setError] = useState({});
    const [PackageList, setPackageList] = useState({ label: "Ctn", value: 1 })
    const [Package, setPackage] = useState({ label: "Ctn", value: 1 })
    const [currentPage, setCurrentPage] = useState(1);
    const [MyProList, setMyProList] = useState([]);
    const [InvDate, setInvDate] = useState(today)
    const [RcvDate, setRcvDate] = useState(today)
    const [InvoiceNo, setInvoiceNo] = useState("")
    const [DocketNo, setDocketNo] = useState("")
    const [SpecialValue, setSpecialValue] = useState(null)
    const [DiscPrct, setDiscPrct] = useState(0)

    const [PurchaseInfo, setPurchaseInfo] = useState(null)
    const [PurchaseNo, setPurchaseNo] = useState("")
    const [OrderNo, setOrderNo] = useState("")
    const [OrderBy, setOrderBy] = useState("")
    const [ReceivedBy, setReceivedBy] = useState(user.Name)
    const [Receiver, setReceiver] = useState(user.Name)
    const [Payment, setPayment] = useState(null)
    const [Vat, setVat] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)

    let [PurchaseData, setPurchaseData] = useState([])
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const initialState = {
        ItemId: "",
        SlNo: "",
        Code: "",
        Barcode: "",
        Title: "",
        UnitName: "",
        UnitQty: "",
        UnitWeight: "",
        UnitPrice: "",
        Quantity: '',
        Weight: "",
        Rate: "",
        Remark: "N/A",
        SubTotal: "",
        Available: 0,
    };
    const [formData, setFormData] = useState(initialState);
    const { ItemID, Code, Title, UnitName, Size, UnitWeight, UnitPrice, Quantity, Weight, SubTotal, Remark, Available } = formData;

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadPurchaseNo();
        LoadSuppliers();
        // LoadProductItems();
    }, [])

    let Count = PurchaseData.length;
    const LoadPurchaseNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPurchaseNo('YP', SectorID);
        if (result !== true) {
            setPurchaseNo(result.PurchaseNo)
            setPurchaseInfo(result)
        } else {
            // history.push('/supplier_items');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    async function LoadSuppliers() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const storedOptions = localStorage.getItem("supplierData");
        let storedOptionsTimestamp = localStorage.getItem("supplierDataTimestamp");

        if (storedOptions && storedOptionsTimestamp) {
            const currentTimestamp = await fetchServerTimestamp();
            if (storedOptionsTimestamp >= currentTimestamp) {
                setSupplier(JSON.parse(storedOptions));
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                history.push('/supplier_items');
                return;
            }
        }

        var result = await GetSuppliers(SupplierID);
        if (result !== true) {
            setSupplier(result);
            localStorage.setItem("supplierData", JSON.stringify(result));
            localStorage.setItem("supplierDataTimestamp", today.getTime());
            LoadSupplierProduct(result.Status);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    useEffect(() => {
        LoadSupplierProduct(Supplier = { Status: 1 });
    }, [currentPage, Supplier]);

    useEffect(() => {
        PaidCalc();
    }, [PurchaseData]);

    const LoadSupplierProduct = async (Status) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        if (Status) {
            var ProductItems = await SupplierProductDropdown(SectorID);
            if (ProductItems !== true)
                setMyProList(ProductItems.data);
        }
        else {
            var ProductItems = await SupplierProductAll(SectorID);
            if (ProductItems !== true)
                setMyProList(ProductItems.data);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        control: base => ({
            ...base,
            border: 0,
            // This line disable the blue border
            boxShadow: 'none'
        })
    }

    const CS_Editor = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        })
    }

    const onSubmit = (e) => {
        const { errors, isValid } = validateForm();  // Validate the form
        if (!isValid) { setError(errors); return; }

        if (formData.Quantity === "" || formData.Quantity === undefined || formData.Code === "" || formData.Code === undefined) {
            setInfoModalShow(true)
        } else {
            e.preventDefault();
            setSpecialValue(null)
            setDiscPrct(0)
            setPurchaseData([...PurchaseData, formData]);
            setFormData({
                ItemID: "",
                Title: "",
                Size: "",
                UnitWeight: "",
                UnitPrice: "",
                Quantity: "",
                Code: "",
                BarCode: "",
                Remark: "N/A",
                Available: 0,
            });
        }
        PaidCalc();
    }

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = PurchaseData.map(row => row.Remark !== "Bonus" && row.SubTotal);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = PurchaseData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0);

    const deleteRow = (i) => {
        if (!Array.isArray(PurchaseData) || !PurchaseData.length) return;
        setPurchaseData([...PurchaseData.slice(0, i), ...PurchaseData.slice(i + 1)]);
        setPaid(0.00);
    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            BarcodeAction(e.target.value);
        }
    }

    const history = useHistory();

    const SavePurchase = async () => {
        let VatTotal = (getTotal() * Vat) / 100
        let GrandTotal = Total === 0 ? getTotal() : Total
        var inv_data = moment(InvDate).format('YYYY-MM-DD')
        var rcv_data = moment(RcvDate).format('YYYY-MM-DD')
        PurchaseData = PurchaseData.map((item, index) => ({ ...item, SLNo: index + 1 }));
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await Purchase(SectorID, CtrID, SupplierID, PurchaseNo, OrderNo, OrderBy, user.id, InvoiceNo, DocketNo, inv_data, rcv_data, user.id, Payment.value, Vat, parseFloat(VatTotal).toFixed(2), Discount, parseFloat(GrandTotal).toFixed(2), Paid, parseFloat(Due).toFixed(2), Count, PurchaseData);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                if (result.exception && result.exception.entries) {
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                    }
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                LoadPurchaseNo();
                ClearField();
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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

    const PaidCalc = (e = { target: { value: 0.00 } }) => {
        const paid = e.target.value || 0.00;
        setPaid(paid);
        let SubTotal = getTotal();
        let VatCal = SubTotal + ((SubTotal * Vat) / 100)
        let Disc = Number(VatCal) - Discount
        let left = Number(Disc) - Number(e.target.value)

        // setTotal(left);
        setDue(left);
    }

    const QuantityHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, "Weight": UnitWeight * e.target.value, "SubTotal": UnitPrice * e.target.value });
    }

    const SpecialityData = (e) => {
        const cases = {
            1: { SubTotal: 0, Remark: "Bonus" },
            2: { SubTotal: SubTotal - ((SubTotal * e.target.value) / 100), Remark: [Remark, `(${e.target.value}%)`].filter(Boolean).join(' ') },
            default: { SubTotal: 0, Remark: "N/A" }
        };

        setFormData({ ...formData, ...(cases[DiscPrct] || cases.default) });
    };

    const handleFocus = (e) => setFormData({ ...formData, SubTotal: UnitPrice * Quantity });

    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    // const Validate = () => {
    //     if (!isStringNullOrWhiteSpace(InvDate) && !isStringNullOrWhiteSpace(PurchaseNo) && !isStringNullOrWhiteSpace(Payment) && !isStringNullOrWhiteSpace(InvoiceNo))
    //         return false;
    //     return true;
    // }

    const validateForm = () => {
        let errors = {};

        if (!SupplierID || (SupplierID && SupplierID.trim() === "")) {
            errors.SupplierID = "Supplier can't identified";
        }

        if (!CtrID || (CtrID && CtrID.trim() === "")) {
            errors.ContainerID = "Container can't identified";
        }

        if ((!DocketNo || (DocketNo && DocketNo.trim() === "")) && (!InvoiceNo || (InvoiceNo && InvoiceNo.trim() === ""))) {
            errors.DocketNo = "Either Docket No or Invoice No is required";
            errors.InvoiceNo = "Either Docket No or Invoice No is required";
        }

        if (!Payment) {
            errors.Payment = "Payment is required";
        }

        if (!Date) {
            errors.Date = "Date is required";
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }

    const BarcodeAction = async (e) => {
        const value = await FetchProductDetails(SectorID, e);
        if (value) {
            setFormData({
                ItemID: value.ItemID,
                Barcode: value.Barcode,
                Code: value.Code,
                value: value.Code,
                label: value.Title,
                Title: value.Title,
                UnitName: value.Package[0].label,
                Size: value.Package[0].UnitQty,
                UnitWeight: value.Package[0].UnitWeight,
                UnitPrice: value.Package[0].UnitPrice,
                Rate: value.SellPrice,
                Quantity: Quantity,
                Weight: value.Package[0].UnitWeight * value.Package[0].UnitQty,
                Remark: "N/A",
                SubTotal: value.Package[0].UnitPrice * Quantity,
                Available: value.Available
            });
            setPackageList(value.Package)
        } else {
            setFormData(initialState);
        }
    };

    const EnterKeyEvent = (e) => {
        if (e.keyCode === 13)
            BarcodeAction(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    const ClearField = () => {
        setSpecialValue(null)
        setDiscPrct(0)
        setPurchaseData([]);
        setFormData(initialState);
        setPayment(null)

        setPurchaseInfo(null)
        setPurchaseNo("")
        setOrderNo("")
        setOrderBy("")
        setReceivedBy(user.Name)
        setReceiver(user.Name)
        setVat(0.00)
        setDiscount(0.00)
        setTotal(0.00)
        setPaid(0.00)
        setDue(0.00)
    }

    const handleInputChange = (name, value) => {
        switch (name) {
            case 'DocketNo':
                setDocketNo(value);
                break;
            case 'InvoiceNo':
                setInvoiceNo(value);
                break;
            case 'OrderNo':
                setOrderNo(value);
                break;
            case 'OrderBy':
                setOrderBy(value);
                break;
            case 'InvDate':
                setInvDate(value);
                break;
            case 'RcvDate':
                setRcvDate(value);
                break;
            case 'Payment':
                setPayment(value);
                break;
            default:
                break;
        }

        if (Error[name]) {
            setError((prevState) => ({
                ...prevState,
                [name]: undefined,
            }));
        }
    };

    var h = window.innerHeight - 450;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center m-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/ctr_list">Container List</Link></li>
                    </ol>
                    <p className="display-6 d-flex justify-content-center m-0">Container Purchase</p>
                </nav>
            </div>

            <div className="col-lg-12 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-4 d-flex flex-wrap align-items-center justify-content-center">
                        {
                            Supplier ?
                                <div className="row g-0">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Supplier Info</p>

                                    <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                        <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                            src={Supplier.Logo ? Supplier.Logo : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                    </div>
                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <p className="display-6 fw-bold m-0">{Supplier.SupplierTitle}</p>
                                            <p className="fs-6 m-0">{Supplier.Address}</p>
                                            <p className="fs-6 m-0">{Supplier.Contact}</p>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className='d-flex flex-column'>
                            <p className="fs-5 fw-bold m-0">{`Container No: ${CtrNo}`}</p>
                            <small className="text-muted text-left fw-bold">* Account- {PurchaseInfo ? PurchaseInfo["AcTitle"] + " [" + PurchaseInfo["AcCode"] + "]" : "N/A"}</small>
                        </div >
                    </div >

                    <div className="col-lg-1">
                        <div className="cs_outer" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                    </div>

                    <div className="col-lg-7 py-2">
                        <div className="row m-0">
                            <table className="table table-bordered m-0">
                                <tbody className='w-100'>
                                    <tr>
                                        <td className="px-1 py-0" scope="row">Invoice Date</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <Datepicker
                                                selected={InvDate}
                                                className="form-control fw-bolder border-0"
                                                dateFormat="dd MMM yyyy"
                                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                                locale={locales[locale]}
                                                placeholderText="Please select date"
                                                onChange={(selectedOption) => handleInputChange('InvDate', selectedOption)}
                                            />
                                        </th>
                                        {Error.InvDate && <small className='text-warning'>{Error.InvDate}</small>}

                                        <td className="px-1 py-0" scope="row">Received Date</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <Datepicker
                                                selected={RcvDate}
                                                className="form-control fw-bolder border-0"
                                                dateFormat="dd MMM yyyy"
                                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                                locale={locales[locale]}
                                                placeholderText="Please select date"
                                                onChange={(selectedOption) => handleInputChange('RcvDate', selectedOption)}
                                            />
                                        </th>
                                        {Error.RcvDate && <small className='text-warning'>{Error.RcvDate}</small>}
                                    </tr>

                                    <tr>
                                        <td className="px-1 py-0" scope="row">Invoice No</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Invoice No"
                                                id="InvoiceNo"
                                                value={InvoiceNo}
                                                onChange={(e) => handleInputChange('InvoiceNo', e.target.value)}
                                            />
                                        </th>
                                        {Error.InvoiceNo && <small className='text-warning'>{Error.InvoiceNo}</small>}

                                        <td className="px-1 py-0" scope="row">Order No</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Order No"
                                                id="OrderNo"
                                                name="OrderNo"
                                                value={OrderNo}
                                                onChange={(e) => handleInputChange('OrderNo', e.target.value)}
                                            />
                                        </th>
                                        {Error.OrderNo && <small className='text-warning'>{Error.OrderNo}</small>}
                                    </tr>

                                    <tr>
                                        <td className="px-1 py-0" scope="row">Docket No</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Docket"
                                                id="DocketNo"
                                                name="DocketNo"
                                                value={DocketNo}
                                                onChange={(e) => handleInputChange('DocketNo', e.target.value)}
                                            />
                                        </th>
                                        {Error.DocketNo && <small className='text-warning'>{Error.DocketNo}</small>}

                                        <td className="px-1 py-0" scope="row">Ordered By</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Ordered By"
                                                id="OrderBy"
                                                name="OrderBy"
                                                value={OrderBy}
                                                onChange={(e) => handleInputChange('OrderBy', e.target.value)}
                                            />
                                        </th>
                                        {Error.OrderBy && <small className='text-warning'>{Error.OrderBy}</small>}
                                    </tr>

                                    <tr>
                                        <td className="px-1 py-0" scope="row">Accounts</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <p className='fs-6 m-0 px-2'>{PurchaseInfo ? PurchaseInfo["AcCode"] : "N/A"}</p>
                                        </th>
                                        <td className="px-1 py-0" scope="row">Purchase No</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Purchase No"
                                                id="PurchaseNo"
                                                name="PurchaseNo"
                                                value={PurchaseNo}
                                                onChange={(e) => setPurchaseNo(e.target.value)}
                                                disabled
                                            />
                                        </th>
                                    </tr>

                                    <tr>
                                        <td className="px-1 py-0" scope="row">Payment Terms</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <Select
                                                className='fw-bolder border-0'
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                menuPortalTarget={document.body}
                                                borderRadius={"0px"}
                                                options={PaymentTerms}
                                                name="Division"
                                                placeholder={"Please select payment"}
                                                styles={CScolourStyles}
                                                value={Payment}
                                                onChange={(e) => handleInputChange('Payment', e)}
                                                required
                                                id="Title"
                                            />
                                        </th>
                                        {Error.Payment && <small className='text-warning'>{Error.Payment}</small>}

                                        <td className="px-1 py-0" scope="row">Received By</td>
                                        <td className="px-1 py-0 text-center">:</td>
                                        <th className="p-0 d-flex">
                                            <input type="text"
                                                className="form-control fw-bolder border-0"
                                                placeholder="Receiver"
                                                id="ReceivedBy"
                                                name="ReceivedBy"
                                                value={ReceivedBy}
                                                onChange={(e) => setReceivedBy(e.target.value)}
                                                disabled
                                            />
                                        </th>
                                        {Error.ReceivedBy && <small className='text-warning'>{Error.ReceivedBy}</small>}

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="row justify-content-center mx-auto d-table w-100 h-100">

                    <div className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
                        <div className="col-sm-1 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Code</p>
                            <BarcodeReader onScan={(e) => BarcodeAction(e)} />
                            <input
                                type="number"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                id="Code"
                                placeholder="Item code"
                                value={formData ? Code : ""}
                                required
                                onChange={(e) => setFormData({ ...formData, Barcode: e.target.value, Code: e.target.value })}
                                onKeyDown={event => EnterKeyEvent(event)}
                            // disabled={Validate()}
                            />
                        </div>
                        <div className="col-sm-3 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Select Product</p>
                            <div className="input-group fs-5 fw-bold">
                                <VirtualizedSelect
                                    options={MyProList}
                                    name="Division"
                                    placeholder={"Please select product"}
                                    styles={CS_Editor}
                                    value={Title ? { label: Title } : null}
                                    onChange={(e) => { BarcodeAction(e.value); }}
                                    // onChange={(e) => FormDataHandler(e)}
                                    required
                                    id="Title"
                                />
                            </div>
                        </div>
                        <div className="col-sm-1 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">UOM</p>
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={PackageList ? PackageList : []}
                                name="Division"
                                placeholder={"Please select product"}
                                styles={CS_Editor}
                                value={{ label: UnitName, value: Size }}
                                onChange={(e) => setFormData({ ...formData, "Size": e.UnitQty, "UnitName": e.label, "UnitPrice": e.UnitPrice, "UnitWeight": e.UnitWeight, "Weight": e.UnitWeight * e.UnitQty, "SubTotal": e.UnitPrice * Quantity })}
                                // onChange={(e) => console.log("change: ", e)}
                                required
                                id="Title"
                            // isDisabled={Validate()}
                            />
                        </div>
                        <div className="col-sm-1 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Size</p>
                            <input
                                type="text"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                name="Size"
                                id="Size"
                                placeholder="Size"
                                value={Size ? Size : ""}
                                required
                                disabled
                            />
                        </div>
                        <div className="col-sm-1 px-0">
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
                            // disabled={Validate()}
                            />
                        </div>

                        <div className="col-sm-1 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Quantity</p>
                            <input
                                type="number"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                name="Quantity"
                                id="Quantity"
                                placeholder="Quantity"
                                value={Quantity}
                                onChange={(e) => QuantityHandler(e)}
                                onKeyDown={(e) => shouldBlur(e)}
                                required
                            // disabled={Validate()}
                            />
                        </div>
                        <div className="col-sm-2 px-0">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Remark</p>
                            <div className='d-flex'>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "N/A", value: 0 }, { label: "Bonus", value: 1 }, { label: "Discount", value: 2 }]}
                                    name="Remark"
                                    placeholder={"Please select product"}
                                    styles={CS_Editor}
                                    value={{ label: Remark, value: 0 }}
                                    onChange={(e) => { setFormData({ ...formData, Remark: e.label, SubTotal: e.value === 1 ? 0 : SubTotal }); setDiscPrct(e.value) }}
                                    required
                                    id="Remark"
                                // isDisabled={Validate()}
                                />

                                {(DiscPrct === 2) ?
                                    <input
                                        type="number"
                                        style={{ width: "50px" }}
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        name="SpecialValue"
                                        id="SpecialValue"
                                        placeholder="%"
                                        value={SpecialValue}
                                        onChange={(e) => setSpecialValue(e.target.value)}
                                        onBlur={(e) => SpecialityData(e)}
                                        onFocus={(e) => handleFocus(e)}
                                    // required
                                    // disabled={Validate()}
                                    />
                                    : null
                                }
                            </div>
                        </div>
                        <div className="col-sm-1 border-right border-2">
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
                        </div>

                        <div className="col-auto">
                            <button
                                className="btn fs-2 fad fa-plus text-center text-success"
                                onKeyDown={(e) => handleKeyDown(e)}
                                type="submit"
                                onClick={(e) => onSubmit(e)}
                            />
                        </div>
                    </div>


                    <InfoMessage
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    {
                        Array.isArray(PurchaseData) && PurchaseData.length ?
                            <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                                <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="py-1 border-right"><span>S/N</span></th>
                                            <th className="py-1 border-right"><span>Item Code</span></th>
                                            <th className="py-1 border-right"><span>Title</span></th>
                                            <th className="py-1 border-right"><span className="d-block fw-bolder">Unit Weight</span></th>
                                            <th className="py-1 border-right"><span className="d-block fw-bolder">Unit Price</span></th>
                                            <th className="py-1 border-right"><span>Qty</span></th>
                                            <th className="py-1 border-right"><span className="d-block fw-bolder">Remark</span></th>
                                            <th className="py-1 border-right"><span className="d-block fw-bolder">Price</span></th>
                                            <th className="py-1"><span>Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            PurchaseData.slice().reverse().map((item, i) => (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold">{PurchaseData.length - i}</span> </td>
                                                    <td className="p-0 border-right"> <span className="d-block fw-bold">{item.Code}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-left px-2">{item.Title}</span></td>
                                                    <td className="p-0 border-right"> <span className="d-block fw-bold text-right px-2">{item.UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-2">{item.UnitPrice.toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-2">{item.Quantity}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold">{item.Remark}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-2">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                    <td className="px-3 py-0"><button className="btn fs-3 py-1 fad fa-minus text-dark fw-bold" onClick={() => deleteRow(PurchaseData.length - i - 1)} /></td>
                                                </tr>
                                            ))
                                        }
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-3 border-right" colSpan="7"><span className="d-block fw-bolder text-right">Sub-total </span> </td>
                                            <td className="p-1 border-right"><span className="d-block fw-bolder text-right">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-3 border-right" colSpan="7"><span className="d-block text-right">VAT Rate (%) </span> </td>
                                            <td className="p-1 d-flex justify-content-end border-right"><input type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-3 border-right" colSpan="7"><span className="d-block text-right ">Discount (K) </span> </td>
                                            <td className="p-1 d-flex justify-content-end border-right">
                                                <input type="text"
                                                    autocomplete="off"
                                                    className="d-block text-right border-0"
                                                    id="Discount"
                                                    value={Discount}
                                                    onChange={(e) => DiscountCalc(e)} />
                                            </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-3 border-right" colSpan="7"><span className="d-block text-right fw-bolder">Total Price </span> </td>
                                            <td className="p-1 border-right"><span className="d-block fw-bolder text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>

                                        {
                                            [14, 15, 16, 17, 18].includes(Payment?.value) ?
                                                <tr className="text-center border-success bg-white">
                                                    <td className="p-1 px-3 border-right" colSpan="7"><span className="d-block text-right fw-bolder fs-4">PAID </span> </td>
                                                    <td className="p-1 d-flex justify-content-end border-right">
                                                        <input type="text"
                                                            autocomplete="off"
                                                            className="d-block text-right border fs-4 fw-bolder"
                                                            id="Paid"
                                                            value={Paid}
                                                            onChange={(e) => PaidCalc(e)} />
                                                    </td>
                                                </tr>
                                                : null
                                        }

                                        <tr className="text-center border border-light mt-3">
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Count:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Total Quantity:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                            <td className="p-1" colSpan="3"><span className="d-block text-right fw-bolder">Due: </span> </td>
                                            <td className="p-1">
                                                <span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? (0).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span>

                                            </td>
                                            <td className="p-1"><span className="px-3 py-0">
                                                <button className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                    onClick={() => SavePurchase()}
                                                />
                                            </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            :
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                            </div>
                    }
                </div >
                <InvalidDate
                    header={InvalidHeader}
                    body_header={InvalidBody}
                    body="Please fill all field correctly"
                    show={InvalidModalShow}
                    onHide={() => setInvalidModalShow(false)}
                />
            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    CtrID: props.location.state.CtrID,
    CtrNo: props.location.state.CtrNo,
    SupplierID: props.location.state.SupplierID,
    SectorID: props.location.state.SectorID,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(CtrPurchase);