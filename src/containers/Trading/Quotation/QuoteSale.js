// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { FetchInvoiceNo, FetchSectorPartyList, Invoice, fetchServerTimestamp } from '../../../actions/APIHandler';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";

import * as moment from 'moment';
import { FetchProduct } from '../../../actions/InventoryAPI';
import { FetchPrintQuote } from '../../../actions/PartyAPI';
import RefundCash from '../../../assets/change_amt_icon.png';
import ReceivedCash from '../../../assets/received_amt_icon.png';
import TotalPrice from '../../../assets/total_price.png';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import { Receipt } from '../CounterReceipt';
import { DiscountModal } from '../ViewInvoice/Modals/ModalForm';

import '../../../hocs/react-select/dist/react-select.css';
// import 'react-virtualized-select/styles.css';
// // import 'react-virtualized/styles.css';
import Select from 'react-select';
import { useTbody } from './QuotationTableBody.js';

let today = new Date();

const QuoteSale = ({ user, list, setList, QuoteID, type }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Supplier, setSupplier] = useState(null)
    const [PartyList, setPartyList] = useState(false)
    const [PartyID, setPartyID] = useState('')
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    const [WalkIN, setWalkIN] = useState(null)
    const [Subscriber, setSubscriber] = useState(false)
    const [SellInfo, setSellInfo] = useState(null)

    const [Date, setDate] = useState(today)
    const [InvoiceNo, setInvoiceNo] = useState(0)
    const [Name, setName] = useState('')
    const [Address, setAddress] = useState('')
    const [Payment, setPayment] = useState({ label: "Cash", value: 14 })
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(0)
    const [Discount, setDiscount] = useState(0.0)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)
    const [RefundAmount, setRefundAmount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Available, setAvailable] = useState(0)
    const [SellWeight, setSellWeight] = useState(0)
    const [AutoFire, setAutoFire] = useState(true)
    const [kode, setCode] = useState('')

    const [SaveGrandTotal, setSaveGrandTotal] = useState(false)
    const [SavePaidAmount, setSavePaidAmount] = useState(false)
    const [SaveChangeAmt, setSaveChangeAmt] = useState(false)
    const [DiscModal, setDiscModal] = useState(false)
    const [GrantDisc, setGrantDisc] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    let [SellData, setSellData] = useState([]);
    const [forceRender, setForceRender] = useState(false);
    const lastKeyTimeRef = useRef(window.Date.now());

    let toastProperties = null;
    const dispatch = useDispatch();
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
        Available: 0,
    };
    const [formData, setFormData] = useState(initialState);

    const { Code, Barcode, Title, UnitName, UnitQty, UnitWeight, UnitPrice, Qty, Weight, Rate, SubTotal } = formData;
    let Count = SellData.length;


    useEffect(() => {

        if (type)
            WalkNParty_Toggle({ target: { checked: type } })
        // else
        //     setWalkIN(false)
        LoadInvoiceNo();
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };
    }, [])

    useEffect(() => {
        LoadProductItems();
    }, [currentPage]);

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setMyProList([])
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

    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchInvoiceNo();

        if (result !== true) {
            setInvoiceNo(result.InvoiceNo)
            setSellInfo(result)
        } else {
            // history.push('/farm_lists');
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
        })
    };

    const handleToggleAutoFire = () => {
        setAutoFire((AutoFire) => !AutoFire);
    };

    const blurProductFocus = () => {
        if (CodeFocus.current) {
            CodeFocus.current.focus();
        }
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
            SaveInvoice(zEvent);
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
            document.activeElement.blur();
            setPayment({ label: "Cash", value: 14 })
            zEvent.preventDefault();
        } else if (zEvent.ctrlKey && zEvent.key.toLowerCase() === "p") {
            zEvent.stopImmediatePropagation();
            zEvent.preventDefault();
            const customEvent = { target: { checked: true } };
            WalkNParty_Toggle(customEvent);
            WalkInFocus.current.focus();
        } else if (zEvent.key === 'Tab') {
            document.activeElement.blur();
            zEvent.preventDefault();
            zEvent.stopImmediatePropagation();
            handleToggleAutoFire();
        } else if (zEvent.shiftKey && zEvent.key.toLowerCase() === "l") {
            zEvent.stopImmediatePropagation();
            zEvent.preventDefault();
            LoadProductItems();
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

    const left_stock = Available - ((parseFloat(UnitQty || 0) * parseFloat(Qty || 0)))
    const availability = left_stock >= 0 ? true : false

    const AddRow = (e) => {
        const { Qty, Code } = formData;
        if (!Qty || !Code) {
            setInvalidModalShow(true);
            return;
        }

        // if (parseFloat(Qty) > parseFloat(Available)) {
        //     setInfoModalShow(true);
        //     return;
        // }
        const dataExistsIndex = SellData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName);

        if (dataExistsIndex === -1) {
            setSellData([...SellData, { ...formData, Available: left_stock }]);
        } else {
            SellData[dataExistsIndex].Qty = parseFloat(SellData[dataExistsIndex].Qty, 10) + parseFloat(formData.Qty, 10);
            SellData[dataExistsIndex].Weight = parseFloat(SellData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            SellData[dataExistsIndex].SubTotal = parseFloat(SellData[dataExistsIndex].SubTotal, 10) + parseFloat(formData.SubTotal, 10);
            SellData[dataExistsIndex].Available = parseFloat(SellData[dataExistsIndex].Available, 10) - parseFloat(formData.Qty, 10);
            const updatedItem = SellData.splice(dataExistsIndex, 1)[0];
            SellData.push(updatedItem);
            setSellData([...SellData]);
        }
        setTotal(0);
        setVat(0);
        setRefundAmount(0.00);
        setSaveChangeAmt(0.00);
        setDiscount(0);
        setFormData(initialState);
        setForceRender(!forceRender);
        document.activeElement.blur();
        if (CodeFocus.current) {
            CodeFocus.current.focus();
        }
    }

    const AutoFireData = async (e, FireData) => {
        if (!FireData.Qty || !FireData.Code) {
            setInvalidModalShow(true);
        } else {
            const dataExistsIndex = SellData.findIndex(item => item.Code === FireData.Code && item.UnitName === FireData.UnitName);

            if (dataExistsIndex === -1) {
                setSellData(prevSellData => [
                    ...prevSellData,
                    { ...FireData, Available: left_stock },
                ]);
            } else {
                SellData[dataExistsIndex].Qty = parseFloat(SellData[dataExistsIndex].Qty, 10) + parseFloat(FireData.Qty, 10);
                SellData[dataExistsIndex].Weight = parseFloat(SellData[dataExistsIndex].Weight, 10) + parseFloat(FireData.Weight, 10);
                SellData[dataExistsIndex].SubTotal = parseFloat(SellData[dataExistsIndex].SubTotal, 10) + parseFloat(FireData.SubTotal, 10);
                SellData[dataExistsIndex].Available = parseFloat(SellData[dataExistsIndex].Available, 10) - parseFloat(FireData.Qty, 10);
                const updatedItem = SellData.splice(dataExistsIndex, 1)[0];
                SellData.push(updatedItem);
                setSellData([...SellData]);
            }

            setTotal(0);
            setVat(0);
            setRefundAmount(0.00);
            setSaveChangeAmt(0.00);
            setDiscount(0);
            setFormData(initialState);
            setForceRender(!forceRender);
        }
    }

    const isValidProduct = (value) => {
        return value !== null && value !== undefined && value.SellPrice !== 0 && value.SellPrice !== null && value.SellPrice !== undefined;
    }

    const BarcodeAction = async (e) => {
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
                UnitPrice: value.UnitPrice,
                Rate: value.SellPrice,
                Qty: parseFloat(Qty, 10),
                Weight: value.UnitWeight * parseFloat(Qty, 10),
                Remark: "N/A",
                SubTotal: parseFloat(Qty, 10) * value.SellPrice,
            }
            setCode(value.Code)
            setFormData(FireData);
            setAvailable(parseFloat(value.Qty || 0));
            if (AutoFire)
                AutoFireData(e, FireData);
            else
                AddRowFocus.current.focus();
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
                UnitPrice: value.UnitPrice,
                Rate: value.SellPrice,
                Qty: parseFloat(Qty, 10),
                Weight: value.UnitWeight * parseFloat(Qty, 10),
                Remark: "N/A",
                SubTotal: parseFloat(Qty, 10) * value.SellPrice,
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

    const EnterKeyEvent = (e) => {
        const value = e.target.value;
        const paddedValue = value.padStart(7, '0');
        if (e.key === "Enter") {
            BarcodeAction(paddedValue);
        }
    }

    const getTotal = () => {
        if (!Array.isArray(SellData) || !SellData.length) return 0.00;
        let val = SellData.reduce((acc, { Qty, Rate }) => acc + Qty * Rate, 0.00);
        return parseFloat(val).toFixed(2);
    };

    const QuantityTotal = Array.isArray(SellData) && SellData.length ? SellData.reduce((total, { Qty }) => total + parseInt(Qty, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(SellData) || !SellData.length) return;
        const itemIDToDelete = SellData[i].ItemID;

        if (Error.hasOwnProperty(itemIDToDelete)) {
            const updatedError = { ...Error };
            delete updatedError[itemIDToDelete];
            setError(updatedError);
            setError(prevState => ({ ...prevState, ItemID: '' }));
            setForceRender(!forceRender)
        }
        setSellData([...SellData.slice(0, i), ...SellData.slice(i + 1)]);
        setPaid(0.00);
    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            AddRow(e);
        }
    }

    const receivedAmountHandler = (e) => {
        if (e.keyCode === 13) {
            if (PaidFocus.current) {
                e.preventDefault();
                PaidFocus.current.focus();
            }
        }
    }

    const history = useHistory();

    const CheackPayment = async (GrandTotal) => {
        await PaidCalc();
        if (parseFloat(Paid) >= parseFloat(GrandTotal) && (parseFloat(Paid) !== 0 || parseFloat(GrandTotal !== 0))) {
            return true;
        } else {
            setNotPayed(true);
            return false;
        }
    };

    const SaveInvoice = async (e) => {
        e.preventDefault();
        const VatTotal = (getTotal() * Vat) / 100;
        const GrandTotal = Total === 0 ? getTotal() : Total;

        let isPaymentValid = await CheackPayment(parseFloat(GrandTotal).toFixed(2));
        if (isPaymentValid) {
            SaveFocus.current.disabled = true;
            SellData = SellData.map((item, index) => ({ ...item, SLNo: index + 1 }));
            dispatch({ type: DISPLAY_OVERLAY, payload: true });

            var data = moment(Date).format("YYYY-MM-DD");
            var result = await Invoice(user.Collocation.CounterID, PartyID, '', data, Vat, VatTotal, Discount, 0, Payment, GrandTotal, Paid, Due, RefundAmount, Count, SellData);
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
                    setSaveGrandTotal(result.CallBack.GrandTotal)
                    setSavePaidAmount(result.CallBack.PaidAmount)
                    setSaveChangeAmt(result.CallBack.RefundAmount)
                    Receipt(e, result.CallBack, true, true);
                    LoadInvoiceNo();
                    ClearForm();
                    setPaid(0.00)
                }
            } else {
                setList([
                    ...list,
                    toastProperties = {
                        id: 1,
                        title: "Error",
                        description: "Failed to save invoice. Please try after some moment.",
                        backgroundColor: "#f0ad4e",
                        icon: errorIcon
                    }
                ]);
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        if (CodeFocus.current)
            CodeFocus.current.focus();

        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
    };

    const VatCalc = (e) => {
        const vat = e.target.value || 0.00;
        setVat(vat);
        const subTotal = getTotal();
        const totalWithVat = subTotal + (subTotal * vat) / 100;
        const disc = totalWithVat - Discount;
        const left = disc - Paid;
        setTotal(disc);
        setDue(left);
    };

    const DiscountCalc = (e = { target: { value: Discount } }) => {
        const discount = e.target.value;
        const maxDiscount = 50;

        if (discount > maxDiscount) {
            return;
        }

        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

        if (discount === '' || regex.test(discount)) {
            setDiscount(discount);
            const subTotal = getTotal();
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            let disc = totalWithVat - discount;
            disc = disc.toFixed(2);
            let left = disc - Paid;
            left = left.toFixed(2);
            setTotal(disc);
            setDue(left);
        }
    };

    const PaidCalc = (e = { target: { value: Paid } }) => {
        const paid = e.target.value || 0.00;
        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

        if (paid === '' || regex.test(paid)) {
            setPaid(prevPaid => paid); // using callback form of setPaid
            const subTotal = getTotal();
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            const disc = totalWithVat - Discount;
            let left = disc - paid;
            left = left.toFixed(2);
            if (left > 0) {
                setRefundAmount(0.00);
                setDue(left);
            } else if (left < 0) {
                setRefundAmount(-left);
                setDue(0.00);
            } else {
                setRefundAmount(0.00);
                setDue(0.00);
            }
        }
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

    const CS_Rate = (e) => {
        setFormData({
            ...formData,
            "SLNo": '',
            "Rate": e.target.value,
            "SubTotal": (e.target.value * Qty).toFixed(2)
        });
    }

    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    const DiscountFocus = (e) => {
        e.preventDefault();
        setDiscModal(false)

        setGrantDisc(true);
        if (discFocus.current)
            discFocus.current.focus();
    }

    const ClearForm = () => {
        LoadInvoiceNo();
        setSellData([]);
        setSubscriber(false);
        setPayment({ label: "Cash", value: 14 });
        setPercent(false);
        setTotal(0.00);
        setVat(0.00);
        setDiscount(0.00);
        setPaid(0.00);
        setDue(0.00);
        setFormData(initialState);
        setForceRender(!forceRender);
        setGrantDisc(false);
        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
    }

    const WalkNParty_Toggle = async (e = { target: { checked: type } }) => {
        if (e.target.checked || type) {
            const storedPartyList = localStorage.getItem("partyList");
            let storedPartyListTimestamp = localStorage.getItem("partyListTimestamp");

            if (storedPartyList && storedPartyListTimestamp) {
                const currentTimestamp = await fetchServerTimestamp();
                if (storedPartyListTimestamp >= currentTimestamp) {
                    setPartyList(JSON.parse(storedPartyList));
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                    return;
                }
            }

            var result = await FetchSectorPartyList();
            if (result !== true) {
                setPartyList(result.Data);
                localStorage.setItem("partyList", JSON.stringify(result.Data));
                localStorage.setItem("partyListTimestamp", new window.Date().getTime());
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                history.push('/my_party_list');
            }
        } else {
            setPartyID(false);
        }
    }

    const handleFocusSelect = (e) => {
        e.target.select();
    };

    const { tableRows } = useTbody(SellData, Error, deleteRow, forceRender);

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

    useEffect(() => {
        if (Array.isArray(PartyList)) {
            GetQuoteData();
        }
    }, [PartyList]);

    let cachedQuoteData;
    const GetQuoteData = async () => {
        let result;
        if (!cachedQuoteData) {
            result = await FetchPrintQuote(QuoteID);

            cachedQuoteData = result;
        } else
            result = cachedQuoteData;

        if (result !== true) {
            setSellData(result.QuoteMapData);
            setName(result.Name)
            setAddress(result.Address)
            let cleanPartyID = result.PartyID.replace(/-/g, "");
            let resultParty = PartyList.find(party => party.value === cleanPartyID);

            setPartyID(resultParty || { label: result.Name, value: result.PartyID })
            setWalkIN(result.PartyID ? true : false)
            setDate(moment(result.Date, 'YYYY-MM-DD').toDate());
            setVat(result.Vat || 0.00)
            setDiscount(result.Discount || 0.00)
            setShipment(result.Shipping || 0.00)
            setDue(result.GrandTotal || 0.00)
        } else {
            history.goBack();
        }
    }

    const lastRow = SellData[SellData.length - 1];
    var h = window.innerHeight - 200;

    return (
        <div className="row d-flex m-0">

            <div className="d-flex py-2 m-0 justify-content-between align-items-center shadow-lg" style={{ zIndex: 1, backgroundColor: "#F4DCC1" }}>
                <div className="justify-content-center align-items-center text-primary w-25">
                    <p className="display-6 m-0 text-left" style={{ fontFamily: "Scream alt" }}>{"COUNTER " + user.Collocation.CounterNo}</p>
                    <p className="fw-bold text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                </div>
                <div className="cs_outer" style={{ height: "30px" }}>
                    <div className="cs_inner"></div>
                </div>

                {
                    Array.isArray(SellData) && SellData.length ?
                        <>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={TotalPrice} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                                    <p className="fw-bold text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"TOTAL PRICE"}</p>
                                </div>
                            </div>
                            <div className="cs_outer" style={{ height: "30px" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={ReceivedCash} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{parseFloat(Paid).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                                    <p className="fw-bold text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"RECEIVED"}</p>
                                </div>
                            </div>
                            <div className="cs_outer" style={{ height: "30px" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={RefundCash} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary">{RefundAmount.toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                                    <p className="fw-bold text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"CHANGE"}</p>
                                </div>
                            </div>
                        </> :

                        <>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={TotalPrice} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{SaveGrandTotal ? SaveGrandTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</p>
                                    <p className="fw-bold text-dark text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"TOTAL PRICE"}</p>
                                </div>
                            </div>
                            <div className="cs_outer" style={{ height: "30px" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={ReceivedCash} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{SavePaidAmount ? parseFloat(SavePaidAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</p>
                                    <p className="fw-bold text-dark text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"RECEIVED"}</p>
                                </div>
                            </div>
                            <div className="cs_outer" style={{ height: "30px" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <div className="d-flex justify-content-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                                <img src={RefundCash} className="img-fluid my-auto ml-0" alt="avatar" style={{ width: '50px', height: '50px' }} />
                                <div className='row px-2'>
                                    <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{SaveChangeAmt ? SaveChangeAmt.toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</p>
                                    <p className="fw-bold text-dark text-left align-self-center text-primary m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"CHANGE"}</p>
                                </div>
                            </div>
                        </>
                }

            </div>

            <div className="row d-flex justify-content-between border-top px-0 ce-gradient5 m-0 h-100" style={{ zIndex: 1 }}>

                <div className="col-lg-8 d-flex flex-wrap justify-content-center">
                    {
                        lastRow &&
                        <div className='row w-100 mb-2'>
                            <div className='d-flex justify-content-between m-0 p-0'>
                                <p className='display-5 bg-gradient bg-primary text-white border border-white fw-bold text-left m-0 w-75 px-4 shadow-lg' style={{ borderRadius: "50px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastRow && lastRow.label ? lastRow.label : lastRow.Title}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-warning text-white border border-white fw-bold text-nowrap m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>PK-</span> {lastRow?.UnitName}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-dark text-white border border-white fw-bold text-nowrap m-0 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>QT-</span> {lastRow?.Qty}</p>
                                <p className='display-5 align-items-center justify-content-end d-flex bg-gradient bg-success text-white border border-white fw-bold m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}>{lastRow?.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}<span className='fs-4'>PGK</span></p>
                            </div>
                        </div>
                    }

                    {
                        Array.isArray(SellData) && SellData.length ?
                            <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                                <table className={`table bg-white table-hover table-borderless fs-3`}>
                                    <thead>
                                        <tr className="text-center border-top">
                                            <th className="py-1 border-right"><span>S/N</span></th>
                                            <th className="py-1 border-right"><span>Title</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Qty</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Wt</span></th>
                                            <th className="py-1 border-right"><span>Rate</span></th>
                                            <th className="py-1 border-right"><span>Sub-Total</span></th>
                                            {/* <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Sub-Total</span></th> */}
                                            <th className="py-1 text-center"><span>Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableRows}
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="5"><span className="d-block text-right">Sub-total </span> </td>
                                            <td className="py-0 border-right" style={{ width: "160px" }}><span className="d-block text-right">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="5"><span className="d-block text-right">10% GST Included </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "160px" }}><input style={{ width: "140px" }} disabled type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="5"><span className="d-block text-right ">Discount (K) </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "160px" }}>
                                                <input
                                                    ref={discFocus}
                                                    style={{ width: "140px" }}
                                                    disabled={!GrantDisc}
                                                    type="text"
                                                    autocomplete="off"
                                                    className="d-block text-right border-0"
                                                    id="Discount"
                                                    value={Discount}
                                                    onChange={(e) => DiscountCalc(e)}
                                                    onFocus={handleFocusSelect}
                                                    onKeyDown={(e) => receivedAmountHandler(e)}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" style={{ width: "160px" }} colSpan="5"><span className="d-block text-right font-weight-bold">Total Price </span> </td>
                                            <td className="py-0 border-right"><span className="d-block font-weight-bold text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-1 border-right" colSpan="5"><span className="d-block text-right fw-bolder fs-3">Paid </span> </td>
                                            <td className="p-1 d-flex justify-content-end border-right" style={{ width: "160px" }}>
                                                <input type="text"
                                                    style={{ width: "150px" }}
                                                    autocomplete="off"
                                                    className="d-block text-right border fs-3 fw-bolder"
                                                    id="Paid"
                                                    value={Paid}
                                                    onFocus={handleFocusSelect}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="text-center border border-light mt-3">
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Items:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Qty:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                            <td className="p-1" colSpan="1"><span className="d-block text-right fw-bolder">{Paid !== 0 && Due !== 0 ? "Due: " : RefundAmount !== 0 && Paid !== 0 ? "Change: " : RefundAmount === 0 && Due === 0 ? "Paid: " : "N/A"}</span> </td>
                                            <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="px-3 py-0">
                                                <button ref={SaveFocus}
                                                    className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                    onClick={(e) => SaveInvoice(e)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p className='fs-3 fw-bold text-center text-success m-0'><br />No Product Punched!</p>
                    }
                </div>

                <div className="col-lg-4 justify-content-center px-0 shadow-sm border-left" style={{ height: h + 55 + "px" }}>
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="cs_outer mx-0" style={{ height: h + "px" }}>
                            <div className="cs_inner"></div>
                        </div>

                        <form className="row justify-content-center mx-2 py-2 px-0 my-0 h-100">
                            <div className='justify-content-start align-items-between m-0 p-0'>
                                <div className="row justify-content-between p-0">
                                    <div className="col-md-5">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Code</p>
                                        <input
                                            ref={CodeFocus}
                                            type="number"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            id="Code"
                                            placeholder="******"
                                            value={Code}
                                            onChange={(e) => setFormData({ ...formData, Barcode: e.target.value, Code: e.target.value })}
                                            onKeyDown={event => EnterKeyEvent(event)}
                                            onFocus={handleFocusSelect}
                                            required
                                            autoFocus
                                        />
                                        <BarcodeReader onScan={BarcodeHandler} />
                                    </div>
                                    <div className="col-md-7 justify-content-center align-items-center">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Barcode</p>
                                        <input
                                            ref={BarcodeFocus}
                                            type="number"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            id="Code"
                                            placeholder="N/A"
                                            value={Barcode || kode}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0 m-0">
                                    <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Select Product</p>
                                    <div className="input-group fs-3 fw-bold p-0">
                                        <Select
                                            ref={ProductFocus}
                                            options={MyProList}
                                            name="Title"
                                            placeholder={"Please select product"}
                                            styles={CScolourStyles}
                                            value={Title}
                                            onChange={(e) => { if (e) { DropdownAction(e.value); setFormData(e); } }}
                                            required
                                            id="Title"
                                            isClearable={true}
                                            components={{ MenuList: CustomMenuList }}
                                            maxMenuHeight={20 * 35}
                                        />
                                    </div>
                                </div>
                                <div className='row my-2 mx-0 p-0'>
                                    <div className={`d-flex justify-content-between align-items-center ${AutoFire ? "border border-warning" : null}`} style={{ borderRadius: "15px" }}>
                                        <p className="text-center fs-3 text-dark fw-bold m-0">{UnitName + " Size: " + UnitQty}</p>
                                        <p className={`text-center fs-3 text-dark fw-bold ${Title !== "" ? (availability ? "bg-success text-white" : "bg-warning text-white") : null} px-2 m-0`} style={{ borderRadius: Title !== "" ? "15px" : null }}>{Title !== "" ? (availability ? "Available" : "Unavailable") : "N/A"}</p>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="Block"
                                                name="AutoFire"
                                                checked={AutoFire}
                                                onChange={(e) => setAutoFire(!AutoFire ? true : false)}
                                            />
                                            <label className="form-check-label" for="Block">Auto Fire</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0">
                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Unit Wt</p>
                                        <input
                                            type="text"
                                            id="UnitWeight"
                                            className="form-control fs-3 fw-bold p-0 text-center m-0"
                                            placeholder="0.000"
                                            value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                            // disabled={Percent ? false : true}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Qty</p>
                                        <input
                                            ref={QtyFocus}
                                            type="number"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            name="Qty"
                                            id="Qty"
                                            placeholder="0"
                                            value={Qty}
                                            onChange={(e) => BarcodeGen(e)}
                                            onKeyDown={(e) => shouldBlur(e)}
                                            onFocus={handleFocusSelect}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0">
                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Unit Price</p>
                                        <input
                                            type="number"
                                            id="Rate"
                                            className="form-control fs-3 fw-bold p-0 text-center m-0"
                                            placeholder="0.00"
                                            value={Rate ? Rate : ""}
                                            onChange={(e) => CS_Rate(e)}
                                            disabled={Percent ? Percent.operation === 13 ? false : true : true}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Weight</p>
                                        <input
                                            type="text"
                                            id="Weight"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            placeholder="0.000"
                                            value={Weight ? Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Sub-Total</p>
                                        <input
                                            type="text"
                                            id="SubTotal"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={SubTotal ? SubTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            disabled
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="row justify-content-center align-items-center mx-1">
                                            <Link to='#'
                                                ref={AddRowFocus}
                                                className="btn btn-outline-success fs-3 text-center d-flex justify-content-center align-items-center"
                                                // onKeyDown={(e) => handleKeyDown(e)}
                                                type="submit"
                                                onClick={(e) => availability ? AddRow(e) : null}><i className="fs-3 fad fa-plus pr-2"></i>  ENTER </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='justify-content-center align-self-end my-2 mx-0 p-0'>
                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-6">
                                        <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Received Amount</p>
                                        <input
                                            ref={PaidFocus}
                                            type="text"
                                            id="Paid"
                                            className="form-control fs-3 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={Paid ? Paid.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            onInput={(e) => PaidCalc(e)}
                                            maxLength="8"
                                            required
                                            disabled={!SellData && SellData.length}
                                            onFocus={handleFocusSelect}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    if (SaveFocus.current) {
                                                        SaveFocus.current.focus();
                                                    }
                                            }}

                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="row justify-content-between p-0 m-0" disabled>
                                            <p className="text-center fs-3 text-dark fw-bold m-0 border-bottom">Payment Type</p>
                                            <div className="input-group fs-3 fw-bold p-0">
                                                <Select
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    menuPortalTarget={document.body}
                                                    borderRadius={"0px"}
                                                    options={[{ label: "Cash", value: 14 }, { label: "Card", value: 18 }]}
                                                    name="Payment"
                                                    placeholder={"Payment Type"}
                                                    styles={CScolourStyles}
                                                    value={Payment}
                                                    onChange={(e) => setPayment(e)}
                                                    required
                                                    id="Payment"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className={`row m-0 p-0 ${WalkIN ? "border border-light rounded" : null}`}>

                                {WalkIN !== null ?
                                    <>
                                        <div className="input-group fs-3 fw-bold p-0">
                                            <Select
                                                ref={WalkInFocus}
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                menuPortalTarget={document.body}
                                                borderRadius={"0px"}
                                                options={PartyList}
                                                name="Party"
                                                placeholder={"Please select party"}
                                                styles={CScolourStyles}
                                                value={PartyID}
                                                onChange={(e) => setPartyID(e)}
                                                required
                                                id="Party"
                                            />
                                        </div>
                                        <p className='fs-6 fw-bold'>Credit: <span className='fw-bolder'> {PartyID ? PartyID.Limit : "N/A"}</span></p>
                                    </>
                                    :
                                    <div className="d-flex py-2 m-0 justify-content-center align-items-center w-100 p-0">
                                        <div className="row justify-content-center p-0 w-100">
                                            <input
                                                type="text"
                                                placeholder='Customer Name'
                                                autocomplete="off"
                                                className={`form-control fs-3 fw-bolder p-0 text-center ${Error.Name ? "border-warning bg-warning" : "border-white"}`}
                                                style={{ backgroundColor: "#F4DCC1" }}
                                                id="Name"
                                                value={Name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={handleFocusSelect}
                                            />

                                            <input
                                                type="text"
                                                placeholder='Address'
                                                autocomplete="off"
                                                className={`form-control fs-6 fw-bolder p-0 text-center ${Error.Address ? "border-warning" : "border-white"}`}
                                                style={{ backgroundColor: "#F4DCC1" }}
                                                id="Name"
                                                value={Address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                onFocus={handleFocusSelect}
                                            />
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
                        {NotPayed &&
                            <InfoMessage
                                header="Invoice Not Paid"
                                body_header={`There is total price and payment amount is not equal`}
                                body="Please input paid amount correctly"
                                show={NotPayed}
                                onHide={() => setNotPayed(false)}
                            />
                        }
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

            </div>
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.location.SupplierID,
    user: state.auth.user,
    QuoteID: props.match.params.qt_id,
    type: props.match.params.walk_in,
});

export default connect(mapStateToProps, { logout })(QuoteSale);