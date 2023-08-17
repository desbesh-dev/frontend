import * as moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchInvoiceNo, fetchServerTimestamp } from '../../../actions/APIHandler';
import { CreatePO, FetchProduct, FetchProductDetails } from '../../../actions/InventoryAPI';
import { MyProductList, MySuppliers } from '../../../actions/SuppliersAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { Receipt } from '../CounterReceipt';
import { DiscountModal } from '../ViewInvoice/Modals/ModalForm';

import 'react-virtualized-select/styles.css';
import { FetchPrintPO } from '../../../actions/PartyAPI';
import '../../../hocs/react-select/dist/react-select.css';

let today = new Date();

const EditPursOrder = ({ user, list, setList, POID }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    const [SupplierList, setSupplierList] = useState(false)
    const [Supplier, setSupplier] = useState('')
    const [WalkIN, setWalkIN] = useState(false)
    const [PartyData, setPartyData] = useState()
    const [Subscriber, setSubscriber] = useState(false)
    const [SellInfo, setSellInfo] = useState(null)

    const [Date, setDate] = useState(today)
    const [OrderNo, setOrderNo] = useState(0)
    const [Payment, setPayment] = useState({ label: "COD (Cash on delivery)", value: 12 })
    const [PackageList, setPackageList] = useState({ label: "Ctn", value: 1 })
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(null)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)
    const [Available, setAvailable] = useState(0)
    const [DiscPrct, setDiscPrct] = useState(0)
    const [SpecialValue, setSpecialValue] = useState(0)
    const [AutoFire, setAutoFire] = useState(0)
    const [kode, setCode] = useState('')

    const [DiscModal, setDiscModal] = useState(false)
    const [GrantDisc, setGrantDisc] = useState(false)
    const [Name, setName] = useState('')
    const [Address, setAddress] = useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    let [PursData, setPursData] = useState([]);
    const [forceRender, setForceRender] = useState(false);
    const [locale, setLocale] = useState('en');
    let toastProperties = null;

    const dispatch = useDispatch();
    const NameFocus = useRef(null);
    const AddressFocus = useRef(null);
    const QtyFocus = useRef(null);
    const PaidFocus = useRef(null);
    const CodeFocus = useRef(null);
    const BarcodeFocus = useRef(null);
    const ProductFocus = useRef(null);
    const WalkInFocus = useRef(null);
    const AddRowFocus = useRef(null);
    const lastEnterPressTime = useRef(null);
    const SaveFocus = useRef(null);
    const discFocus = useRef(null);

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
        Qty: 1,
        Weight: "",
        Rate: "",
        Remark: "N/A",
        SubTotal: "",
    };
    const [state, setState] = useState(initialState);
    const [formData, setFormData] = useState(initialState);

    const { Code, Barcode, Title, UnitName, UnitQty, UnitWeight, UnitPrice, Qty, Weight, Rate, Remark, SubTotal } = formData;
    let Count = PursData.length;

    useEffect(() => {
        My_Suppliers();
        LoadProductItems();
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };
    }, [])

    useEffect(() => {
        GetPOData();
    }, [])

    let cachedQuoteData;
    const GetPOData = async () => {
        let result;
        if (!cachedQuoteData) {
            result = await FetchPrintPO(POID);

            cachedQuoteData = result;
        } else {
            result = cachedQuoteData;
        }
        if (result !== true) {
            setPursData(result.QuoteMapData);
            setName(result.Name)
            setAddress(result.Address)
            setSupplier({ SupplierTitle: result.Name, value: result.SupplierID, Address: result.Address })
            setDate(moment(result.Date, 'YYYY-MM-DD').toDate());
            setOrderNo(result.QuoteNo)
            setVat(result.Vat || 0.00)
            setDiscount(result.Discount || 0.00)
            setShipment(result.Shipping || 0.00)
            setDue(result.GrandTotal || 0.00)
            if (result.PartyID)
                setWalkIN(true)
        } else {
            history.goBack();
        }
    }

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });

        const storedOptions = localStorage.getItem("data");
        let storedOptionsTimestamp = localStorage.getItem("dataTimestamp");

        if (storedOptions && storedOptionsTimestamp) {
            const currentTimestamp = await fetchServerTimestamp();
            if (storedOptionsTimestamp >= currentTimestamp) {
                setMyProList(JSON.parse(storedOptions));
                setHasMore(false);
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                return;
            }
        }

        var ProductItems = await MyProductList();
        if (ProductItems !== true) {
            setMyProList([...MyProList, ...ProductItems.data]);
            localStorage.setItem("data", JSON.stringify([...MyProList, ...ProductItems.data]));
            localStorage.setItem("dataTimestamp", today.getTime());
            if (ProductItems.data.length === 0) setHasMore(false);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    useEffect(() => {
        if (GrantDisc && discFocus.current) {
            discFocus.current.focus();
        }
    }, [GrantDisc]);

    useEffect(() => {
        setError({});
    }, [Name, Address])

    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchInvoiceNo();
        if (result !== true) {
            setOrderNo(result.OrderNo)
            setSellInfo(result)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuList: provided => ({
            ...provided,
            backgroundColor: 'white',
        }),
    };

    const handleToggleAutoFire = () => {
        setAutoFire((AutoFire) => !AutoFire);
    };

    const blurProductFocus = () => {
        if (CodeFocus.current)
            CodeFocus.current.focus();
    };

    const handleShortKey = (zEvent) => {
        if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "k") {
            document.activeElement.blur();
            if (CodeFocus.current) {
                zEvent.preventDefault();
                zEvent.stopImmediatePropagation();
                CodeFocus.current.focus();
            }
        }
        else if (zEvent.key === 'F9') {
            document.activeElement.blur();
            if (PaidFocus.current) {
                zEvent.preventDefault();
                zEvent.stopImmediatePropagation();
                PaidFocus.current.focus();
            }
        } else if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "q") {
            document.activeElement.blur();
            if (QtyFocus.current) {
                zEvent.preventDefault();
                zEvent.stopImmediatePropagation();
                QtyFocus.current.focus();
            }
        } else if (zEvent.key === 'F8') {
            document.activeElement.blur();
            if (QtyFocus.current) {
                zEvent.preventDefault();
                zEvent.stopImmediatePropagation();
                QtyFocus.current.focus();
            }
        } else if (zEvent.key === 'F10') {
            document.activeElement.blur();
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            setDiscModal(true);
        } else if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "s") {
            document.activeElement.blur();
            SavePurchaseOrder(zEvent);
            zEvent.preventDefault();
        } else if ((zEvent.ctrlKey && zEvent.key.toLowerCase() === "f") || zEvent.key === 'F1') {
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            document.activeElement.blur();
            if (ProductFocus.current) {
                ProductFocus.current.focus();
                zEvent.preventDefault();
                zEvent.stopImmediatePropagation();
            }
        } else if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "b") {
            document.activeElement.blur();
            setPayment({ label: "Card", value: 18 })
            zEvent.preventDefault();
        } else if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "l") {
            zEvent.stopImmediatePropagation();
            zEvent.preventDefault();
            LoadProductItems();
        } else if (zEvent.key === 'Tab') {
            document.activeElement.blur();
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            handleToggleAutoFire();
        } else if (zEvent.key === 'Enter') {
            setInfoModalShow(false)
            setNotPayed(false)
            setInvalidModalShow(false)

            const currentTime = new window.Date().getTime();
            const interval = 300;
            if (lastEnterPressTime.current && (currentTime - lastEnterPressTime.current) <= interval) {
                document.activeElement.blur();
                if (SaveFocus.current) {
                    SaveFocus.current.focus();
                    zEvent.preventDefault();
                    zEvent.stopImmediatePropagation();
                }
            }
            lastEnterPressTime.current = currentTime;
        } else if ((zEvent.ctrlKey && zEvent.key.toLowerCase() === "d") || zEvent.key === 'Escape') {
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            blurProductFocus();
        } else if (zEvent.altKey && zEvent.key.toLowerCase() === "alt") {
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            const currentTime = new window.Date().getTime();
            const interval = 300;
            if (lastEnterPressTime.current && (currentTime - lastEnterPressTime.current) <= interval) {
                blurProductFocus();
            }
            lastEnterPressTime.current = currentTime;
        } else if (zEvent.ctrlKey && zEvent.shiftKey && zEvent.key.toLowerCase() === "e") {
            SaveFocus.current.disabled = false;
        }
    };

    const AddRow = (e) => {
        const { Qty, Code } = formData;
        if (!Qty || !Code) {
            setInvalidModalShow(true);
            return;
        }

        const dataExistsIndex = PursData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName);

        if (dataExistsIndex === -1) {
            setPursData([...PursData, formData]);
        } else {
            PursData[dataExistsIndex].Qty = parseFloat(PursData[dataExistsIndex].Qty, 10) + parseFloat(formData.Qty, 10);
            PursData[dataExistsIndex].Weight = parseFloat(PursData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            const updatedItem = PursData.splice(dataExistsIndex, 1)[0];
            PursData.push(updatedItem);
            setPursData([...PursData]);
        }

        setTotal(0);
        setVat(0);
        setDiscount(0);
        setFormData(initialState);
        setDiscPrct(0)
        setForceRender(!forceRender);
        document.activeElement.blur();
        if (CodeFocus.current) {
            CodeFocus.current.focus();
        }
    }

    const getTotal = () => {
        if (!Array.isArray(PursData) || !PursData.length) return 0.00;
        return PursData.reduce((acc, { Qty, Rate }) => acc + Qty * Rate, 0.00);
    };

    const QuantityTotal = Array.isArray(PursData) && PursData.length ? PursData.reduce((total, { Qty }) => total + parseInt(Qty, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(PursData) || !PursData.length) return;
        setPursData([...PursData.slice(0, i), ...PursData.slice(i + 1)]);
        setPaid(0.00);
    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            if (Code && !Title) {
                const paddedValue = Code.padStart(7, '0');
                BarcodeAction(paddedValue);
                if (CodeFocus.current)
                    CodeFocus.current.focus();
            }
        }
    }

    const history = useHistory();

    const SavePurchaseOrder = async (e) => {
        let VatTotal = (getTotal() * Vat) / 100;
        let GrandTotal = Total === 0 ? getTotal() : Total;
        SaveFocus.current.disabled = true;
        PursData = PursData.map((item, index) => ({ ...item, SLNo: index + 1 }));
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format("YYYY-MM-DD");
        var result = await CreatePO(Supplier, data, Count, PursData);

        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
                }
                setList([
                    ...list,
                    toastProperties = {
                        id: 1,
                        title: "Invalid Data",
                        description: result.message,
                        backgroundColor: "#f0ad4e",
                        icon: warningIcon
                    }
                ]);
            } else {
                setList([
                    ...list,
                    toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: "#f0ad4e",
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }
                ]);
                Receipt(e, result.CallBack, true);
                LoadInvoiceNo();
                ClearForm();
            }
        } else {
            setList([...list, toastProperties = { id: 1, title: "Error", description: "Failed to save product profile. Please try after some moment.", backgroundColor: "#f0ad4e", icon: errorIcon }]);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        if (CodeFocus.current)
            CodeFocus.current.focus();

        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const BarcodeGen = (e) => {
        setFormData({
            ...formData,
            "SLNo": '',
            "Qty": e.target.value,
            "Weight": (UnitWeight * e.target.value).toFixed(3),
            "SubTotal": (Rate * e.target.value).toFixed(2)
        });
    }

    const DiscountFocus = (e) => {
        e.preventDefault();
        setDiscModal(false)

        setGrantDisc(true);
        if (discFocus.current)
            discFocus.current.focus();
    }

    const isValidProduct = (value) => {
        return value !== null && value !== undefined && value.SellPrice !== 0 && value.SellPrice !== null && value.SellPrice !== undefined;
    }

    const BarcodeAction = async (e) => {
        const value = await FetchProductDetails(e);
        if (value) {
            setFormData({
                ItemID: value.ItemID,
                Barcode: value.Barcode,
                Code: value.Code,
                value: value.Code,
                label: value.Title,
                Title: { label: value.Title },
                UnitName: value.Package[0].label,
                UnitQty: value.Package[0].UnitQty,
                UnitWeight: value.Package[0].UnitWeight,
                Qty: Qty,
                Weight: value.Package[0].UnitWeight * value.Package[0].UnitQty,
            });
            setPackageList(value.Package)
        } else {
            setFormData(initialState);
        }
    };

    const DropdownAction = async (e) => {
        const input = e.toString()
        const paddedValue = input.length <= 7 ? input.padStart(7, '0') : input;
        const value = await FetchProduct(paddedValue);
        if (isValidProduct(value)) {
            const FireData = {
                ItemID: value.ItemID,
                Barcode: value.Barcode,
                Code: value.Code,
                value: value.Code,
                label: value.Title,
                Title: { label: value.Title },
                UnitName: value.UnitName,
                UnitQty: value.UnitQty,
                UnitWeight: value.UnitWeight,
                Qty: parseFloat(Qty, 10),
                Weight: value.UnitWeight * parseFloat(Qty, 10),
            }
            setCode(value.Code)
            setFormData(FireData);
            setAvailable(parseFloat(value.Qty || 0));
            AddRowFocus.current.focus();
        } else {
            setFormData(initialState);
        }
    };

    const BarcodeHandler = async (e) => {
        document.activeElement.blur();
        await BarcodeAction(e);
    };

    // const EnterKeyEvent = (e) => {
    //     const value = e.target.value;
    //     const paddedValue = value.padStart(7, '0').slice(0, 7);
    //     if (e.keyCode === 13)
    //         BarcodeAction(paddedValue);
    // }

    const EnterKeyEvent = (e) => {
        if (e.keyCode === 13)
            BarcodeAction(e.target.value);
    }

    const ClearForm = () => {
        LoadInvoiceNo();
        setPursData([]);
        setSubscriber(false);
        setPayment({ label: "COD (Cash on delivery)", value: 12 });
        setPercent(false);
        setTotal(0.00);
        setVat(0.00);
        setDiscount(0.00);
        setFormData(initialState);
        setPaid(0.00);
        setDue(0.00);
        setForceRender(!forceRender);
        setGrantDisc(false);
        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
    }

    const handleFocusSelect = (e) => {
        e.target.select();
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const My_Suppliers = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await MySuppliers();
        setSupplierList(result);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    var h = window.innerHeight - 200;
    const lastRow = PursData[PursData.length - 1];

    return (
        <div className="row d-flex justify-content-between border-top px-0 h-100 m-0 ce-gradient5" style={{ zIndex: 1 }}>
            <div className="col-lg-8 d-flex flex-wrap justify-content-center ce-gradient5 pr-0">
                <div className="d-flex py-2 m-0 justify-content-between align-items-top w-100" style={{ zIndex: 1, height: "90px", backgroundColor: "#F4DCC1" }}>
                    <div className="justify-content-center align-items-center border border-2 border-white w-25" style={{ borderRadius: "25px" }}>
                        <p className="display-6 px-2 m-0 text-left text-primary fw-bolder">{"EDIT PURCHASE ORDER"}</p>
                        {/* <p className="fs-6 m-0 text-left text-primary fs-6" style={{ fontFamily: "Scream alt" }}>{"COUNTER " + user.Collocation.CounterNo}</p> */}
                        <p className="fw-bold px-2 text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                    </div>

                    <div className="d-flex justify-content-center align-items-center border border-2 border-white w-25 shadow-lg mr-2" style={{ borderRadius: "25px" }}>
                        <i class="display-3 fad fa-list-ol"></i>
                        <div className='row px-2'>
                            <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{Count}</p>
                            <p className="fw-bold text-dark text-left align-self-center m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"TOTAL ITEM"}</p>
                        </div>
                    </div>

                </div>
                {
                    lastRow &&
                    <div className='row w-100 mb-2'>
                        <div className='d-flex justify-content-between m-0 p-0'>
                            <p className='display-5 bg-gradient bg-primary text-white border border-white fw-bold text-left m-0 w-75 px-4 shadow-lg' style={{ borderRadius: "50px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastRow && lastRow.label ? lastRow.label : lastRow.Title}</p>
                            <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-warning text-white border border-white fw-bold text-nowrap m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>PK-</span> {lastRow?.UnitName}</p>
                            <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-dark text-white border border-white fw-bold text-nowrap m-0 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>QT-</span> {lastRow?.Qty}</p>
                        </div>
                    </div>
                }
                {
                    Array.isArray(PursData) && PursData.length ?
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table className={`table bg-white table-hover table-borderless fs-4`}>
                                <thead className='bg-white'>
                                    <tr className="text-center">
                                        <th className="py-1 border-right"><span>S/N</span></th>
                                        <th className="py-1 border-right"><span>Title</span></th>
                                        <th className="py-1 border-right"><span>Package</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Qty</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Wt</span></th>
                                        <th className="py-1 text-center"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        PursData.slice().reverse().map((item, i) => {
                                            const reversedIndex = PursData.length - i - 1;
                                            return (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{reversedIndex + 1}</span></td>
                                                    <td className="py-0 px-1 border-right">
                                                        <span className="d-block fw-bold text-left" style={{ lineHeight: "1" }}>{item.label ? item.label : item.Title}</span>
                                                        {item.Remark !== "N/A" ?
                                                            <small className="d-block text-muted text-left" style={{ fontSize: '11px', lineHeight: "1" }}>{item.Remark}</small> : null}
                                                    </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{item.UnitName}</span></td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="p-0">
                                                        <button className="btn fs-3 px-2 py-0 text-danger" onClick={() => deleteRow(reversedIndex)}> <i className="fad fa-minus"></i></button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr className="text-center border border-light mt-3">
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Items:</span> </td>
                                        <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Qty:</span> </td>
                                        <td className="p-1" colSpan="2"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                        <td className="px-3 py-0" >
                                            <button
                                                ref={SaveFocus}
                                                className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                onClick={() => SavePurchaseOrder()}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className={`d-flex justify-content-center align-items-center`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Punched!</p>
                        </div>
                }
            </div>

            <div className="col-lg-4 justify-content-center px-0 shadow-sm border-left" style={{ height: h + 148 + "px" }}>

                <div className="d-flex justify-content-center align-items-center h-100 ce-gradient5_reverse">
                    <form className="row justify-content-center px-2 py-0 m-0 h-100">

                        <div className={`justify-content-center align-self-center m-0 p-0 ${Supplier === '' ? 'd-none' : 'd-block'}`}>

                            <div className="row justify-content-between p-0">
                                <div className="col-md-5">
                                    <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Code</p>
                                    <input
                                        ref={CodeFocus}
                                        type="number"
                                        className="form-control fs-4 fw-bold p-0 text-center"
                                        id="Code"
                                        placeholder="******"
                                        value={Code}
                                        onChange={(e) => setFormData({ ...formData, Barcode: e.target.value, Code: e.target.value })}
                                        onKeyDown={event => EnterKeyEvent(event)}
                                        onFocus={handleFocusSelect}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="col-md-7 justify-content-center align-items-center">
                                    <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Barcode</p>
                                    <input
                                        type="number"
                                        className="form-control fs-4 fw-bold p-0 text-center"
                                        id="Code"
                                        placeholder="N/A"
                                        value={Barcode || kode}
                                        disabled
                                    />
                                    <BarcodeReader onScan={(e) => BarcodeHandler(e)} />
                                </div>
                            </div>

                            <div className="row justify-content-between p-0 m-0">
                                <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Select Product</p>
                                <div className="input-group fs-4 fw-bold p-0">
                                    <Select
                                        ref={ProductFocus}
                                        options={MyProList}
                                        name="Title"
                                        placeholder={"Please select product"}
                                        styles={CScolourStyles}
                                        value={Title}
                                        onChange={(e) => { if (e) { BarcodeAction(e.value); setFormData(e); } }}
                                        required
                                        id="Title"
                                        isClearable={true}
                                        components={{ MenuList: CustomMenuList }}
                                        maxMenuHeight={20 * 35}
                                    />
                                </div>
                            </div>

                            <div className="row justify-content-between p-0">
                                <div className="col-md-6">
                                    <p className="text-center text-dark fw-bold m-0 border-bottom fs-4">UOM</p>
                                    <div className="input-group fs-4 fw-bold p-0">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={PackageList ? PackageList : []}
                                            name="Title"
                                            placeholder={"Please select product"}
                                            styles={CScolourStyles}
                                            value={{ label: UnitName, value: UnitQty }}
                                            onChange={(e) => setFormData({ ...formData, "UnitQty": e.UnitQty, "UnitName": e.label, "UnitPrice": e.UnitPrice, "UnitWeight": e.UnitWeight, "Weight": e.UnitWeight * e.UnitQty, "SubTotal": e.UnitPrice * Qty })}
                                            required
                                            id="Title"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-center text-dark fw-bold m-0 border-bottom fs-4">Unit Qty</p>
                                    <input
                                        type="text"
                                        className="form-control fs-4 fw-bold p-0 text-center"
                                        name="UnitQty"
                                        id="UnitQty"
                                        placeholder="Unit Qty"
                                        value={UnitQty ? UnitQty : ""}
                                        required
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="row justify-content-between p-0">
                                <div className="col-md-6">
                                    <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Unit Wt</p>
                                    <input
                                        type="text"
                                        id="UnitWeight"
                                        className="form-control fs-4 fw-bold p-0 text-center m-0"
                                        placeholder="0.000"
                                        value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                        // disabled={Percent ? false : true}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Qty</p>
                                    <input
                                        ref={QtyFocus}
                                        // onFocus={(e) => e.target.select()}
                                        type="number"
                                        className="form-control fs-4 fw-bold p-0 text-center"
                                        name="Qty"
                                        id="Qty"
                                        placeholder="0"
                                        value={Qty}
                                        onChange={(e) => BarcodeGen(e)}
                                        onKeyDown={(e) => shouldBlur(e)}
                                        // disabled={Percent ? false : true}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row justify-content-center p-0 mt-4">
                                <div className="row justify-content-center align-items-center mx-1">
                                    <Link to='#'
                                        ref={AddRowFocus}
                                        className="btn btn-outline-success fs-3 text-center justify-content-center align-items-center w-auto px-3"
                                        // onKeyDown={(e) => handleKeyDown(e)}
                                        type="submit"
                                        onClick={(e) => AddRow(e)}><i className="fs-3 fad fa-plus pr-2"></i>  ENTER </Link>
                                </div>
                            </div>
                        </div>


                        <div className={`row m-0 p-0`}>
                            <div className={`d-flex justify-content-around align-items-center h-auto`} style={{ borderRadius: "15px" }}>
                                <div className='d-flex flex-column justify-content-center align-items-center my-2 mx-0 p-0 w-auto'>
                                    <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Date</p>
                                    <Datepicker
                                        selected={Date}
                                        className="form-control fw-bolder border-0 text-center py-0"
                                        dateFormat="dd MMM yyyy"
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                        onChange={(e) => setDate(e)}
                                    />
                                </div>
                            </div>


                            {Supplier === '' ?
                                <div className="input-group fs-4 fw-bold p-0">
                                    <Select
                                        ref={WalkInFocus}
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={SupplierList && SupplierList.map((item) => ({ label: item.SupplierTitle, value: item.id, ...item }))}
                                        name="Supplier"
                                        placeholder={"Please select supplier"}
                                        styles={CScolourStyles}
                                        value={Supplier}
                                        onChange={(e) => setSupplier(e)}
                                        required
                                        id="Supplier"
                                    />
                                </div>
                                :
                                <div className="d-flex py-2 m-0 justify-content-center align-items-top w-100 border border-2 border-white" onClick={() => setSupplier('')}
                                    style={{ backgroundColor: "#D3ECD3", height: "90px", borderRadius: '20px' }}>
                                    <div className="row justify-content-center p-0">
                                        <p className='fs-2 fw-bold text-center m-0'>{Supplier.SupplierTitle}</p>
                                        <p className='fs-6 fw-bold text-center text-muted'>{Supplier.Address}</p>
                                    </div>
                                </div>
                            }

                        </div>
                    </form>

                    <InfoMessage
                        header="Stock Unavailable"
                        body_header={`Input quantity is not available. Max quantity weight is- ${Available} and input weight is- ${Weight}`}
                        body="Please input valid range of quantity"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    {DiscModal &&
                        <DiscountModal
                            show={DiscModal}
                            onFocusDisc={(e) => DiscountFocus(e)}
                            onHide={() => { setGrantDisc(false); setDiscModal(false) }}
                        />
                    }

                    <InvalidDate
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InvalidModalShow}
                        onHide={() => setInvalidModalShow(false)}
                    />
                </div>
            </div>
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    POID: props.match.params.po_id,
});

export default connect(mapStateToProps, { logout })(EditPursOrder);