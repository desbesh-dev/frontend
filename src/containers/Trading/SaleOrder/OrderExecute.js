import * as moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { FetchInvoiceNo, Invoice, fetchServerTimestamp } from '../../../actions/APIHandler';
import { FetchProduct, PaymentTerms } from '../../../actions/InventoryAPI';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import TotalPrice from '../../../assets/total_price.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { DiscountModal } from './../ViewInvoice/Modals/ModalForm';
// import 'react-virtualized/styles.css';
import { getLabel } from '../../../actions/ContractAPI';
import { FetchOrderData } from '../../../actions/PartyAPI';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import '../../../hocs/react-select/dist/react-select.css';
import { InvoicePrint } from './../InvoicePrint';

let today = new Date();

const OrderExecute = ({ OrderID, user, list, setList }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [PartyData, setPartyData] = useState(null)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    let [OrderData, setOrderData] = useState([])
    const [SellInfo, setSellInfo] = useState(null)

    const [Date, setDate] = useState(today)
    const [OrderDate, setOrderDate] = useState(today)
    const [DeliveryDate, setDeliveryDate] = useState(today)
    const [OrderNo, setOrderNo] = useState(0)
    const [Payment, setPayment] = useState({ label: "COD (Cash on delivery)", value: 12 })
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(null)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Cash, setCash] = useState(0.00)
    const [Bank, setBank] = useState(0.00)
    const [Due, setDue] = useState(0.00)
    const [RefundAmount, setRefundAmount] = useState(0.00)
    const [Available, setAvailable] = useState(0)
    const [Status, setStatus] = useState(0)
    const [DiscPrct, setDiscPrct] = useState(0)
    const [SpecialValue, setSpecialValue] = useState(0)
    const [SellWeight, setSellWeight] = useState(0)
    const [AutoFire, setAutoFire] = useState(0)
    const [kode, setCode] = useState('')
    const [SaveChangeAmt, setSaveChangeAmt] = useState(false)
    const [DiscModal, setDiscModal] = useState(false)
    const [GrantDisc, setGrantDisc] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
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
        ShippedQty: 1,
        Weight: "",
        Rate: "",
        Remark: "N/A",
        SubTotal: "",
    };
    const [formData, setFormData] = useState(initialState);
    const [forceRender, setForceRender] = useState(false);
    const [locale, setLocale] = useState('en');
    let toastProperties = null;

    const dispatch = useDispatch();
    const QtyFocus = useRef(null);
    const PaidFocus = useRef(null);
    const CashFocus = useRef(null);
    const BankFocus = useRef(null);
    const CodeFocus = useRef(null);
    const BarcodeFocus = useRef(null);
    const ProductFocus = useRef(null);
    const WalkInFocus = useRef(null);
    const AddRowFocus = useRef(null);
    const lastEnterPressTime = useRef(null);
    const SaveFocus = useRef(null);
    const discFocus = useRef(null);

    const { Code, Barcode, Title, UnitName, UnitQty, UnitWeight, UnitPrice, Qty, Weight, Rate, Remark, SubTotal } = formData;
    let Count = Array.isArray(OrderData) && OrderData.length;

    useEffect(() => {
        LoadInvoiceNo();
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };
    }, [])

    useEffect(() => {
        LoadInvoiceNo();
        GetOrderData();
    }, [])

    useEffect(() => {
        LoadProductItems();
    }, [currentPage]);

    useEffect(() => {
        PaidCalcOnUpdate();
        DiscountCalc();
        ShipmentCalc();
    }, [OrderData]);

    useEffect(() => {
        if (GrantDisc && discFocus.current) {
            discFocus.current.focus();
        }
    }, [GrantDisc]);

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

    const LoadInvoiceNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchInvoiceNo();
        if (result !== true) {
            setOrderNo(result.OrderNo)
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
        }),
    };

    const handleFocusSelect = (e) => {
        e.target.select();
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
            SaveOrder(zEvent);
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

    const left_stock = Available - parseFloat(UnitQty || 0)
    const availability = left_stock > 0 ? true : false

    const getTotal = useMemo(() => {
        if (!Array.isArray(OrderData) || !OrderData.length) return 0.00;
        return OrderData.reduce((acc, { SubTotal }) => acc + parseFloat(SubTotal), 0.00);
    }, [OrderData]);

    const AddRow = (e) => {
        const { Qty, Code } = formData;

        if (!Qty || !Code) {
            setInvalidModalShow(true);
            return;
        }

        if (parseFloat(SellWeight) > parseFloat(Available)) {
            setInfoModalShow(true);
            return;
        }

        const dataExistsIndex = OrderData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName && item.Remark === formData.Remark);
        if (dataExistsIndex === -1) {
            setOrderData([...OrderData, { ...formData, Available: left_stock, ShippedQty: Qty }]);
            if (parseInt(DiscPrct) === 3)
                setOrderData([...OrderData, { ...formData, Rate: UnitPrice, Available: left_stock, ShippedQty: Qty }]);
            else
                setOrderData([...OrderData, { ...formData, Available: left_stock, ShippedQty: Qty }]);

        } else {
            OrderData[dataExistsIndex].ShippedQty = parseFloat(OrderData[dataExistsIndex].ShippedQty, 10) + parseFloat(formData.Qty, 10);
            OrderData[dataExistsIndex].Qty = parseFloat(OrderData[dataExistsIndex].Qty, 10) + parseFloat(formData.Qty, 10);
            OrderData[dataExistsIndex].Weight = parseFloat(OrderData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            OrderData[dataExistsIndex].SubTotal = parseFloat(OrderData[dataExistsIndex].SubTotal, 10) + parseFloat(formData.SubTotal, 10);
            OrderData[dataExistsIndex].Available = parseFloat(OrderData[dataExistsIndex].Available, 10) - parseFloat(formData.Quantity, 10);
            const updatedItem = OrderData.splice(dataExistsIndex, 1)[0];
            OrderData.push(updatedItem);
            setOrderData([...OrderData]);
        }

        setTotal(0);
        setVat(0);
        setPaid(0.00);
        setBank(0.00);
        setCash(0.00);
        setDiscount(Discount);
        setShipment(Shipment);
        setRefundAmount(0.00);
        setSaveChangeAmt(0.00);

        setFormData(initialState);
        setDiscPrct(0)
        DiscountCalc();
        ShipmentCalc();
        PaymentCalculation();
        setForceRender(!forceRender);
        document.activeElement.blur();
        if (CodeFocus.current) {
            CodeFocus.current.focus();
        }
    }

    const AutoFireData = async (e, FireData) => {
        if (!FireData.Quantity || !FireData.Code) {
            setInvalidModalShow(true);
        } else {
            const dataExistsIndex = OrderData.findIndex(item => item.Code === FireData.Code && item.UnitName === FireData.UnitName && item.Remark === FireData.Remark);

            if (dataExistsIndex === -1) {
                if (parseInt(DiscPrct) === 3)
                    setOrderData(prevSellData => [...prevSellData, { ...FireData, Rate: UnitPrice, Available: left_stock }]);
                else
                    setOrderData(prevSellData => [...prevSellData, { ...FireData, Available: left_stock }]);
            } else {

                OrderData[dataExistsIndex].OrderQty = parseFloat(OrderData[dataExistsIndex].OrderQty, 10) + parseFloat(FireData.OrderQty, 10);
                OrderData[dataExistsIndex].ShippedQty = parseFloat(OrderData[dataExistsIndex].ShippedQty, 10) + parseFloat(FireData.ShippedQty, 10);
                OrderData[dataExistsIndex].Quantity = parseFloat(OrderData[dataExistsIndex].Quantity, 10) + parseFloat(FireData.Quantity, 10);
                OrderData[dataExistsIndex].Weight = parseFloat(OrderData[dataExistsIndex].Weight, 10) + parseFloat(FireData.Weight, 10);
                OrderData[dataExistsIndex].SubTotal = parseFloat(OrderData[dataExistsIndex].SubTotal, 10) + parseFloat(FireData.SubTotal, 10);
                OrderData[dataExistsIndex].Available = parseFloat(OrderData[dataExistsIndex].Available, 10) - parseFloat(FireData.Quantity, 10);
                const updatedItem = OrderData.splice(dataExistsIndex, 1)[0];
                OrderData.push(updatedItem);
                setOrderData([...OrderData]);
            }

            setTotal(0);
            setVat(0);
            setPaid(0.00)
            setBank(0.00)
            setCash(0.00)
            setDiscount(0);
            setRefundAmount(0.00);
            setSaveChangeAmt(0.00);
            setFormData(initialState);
            setDiscPrct(0)
            setForceRender(!forceRender);
        }
    }

    const OrderQT = Array.isArray(OrderData) && OrderData.length ? OrderData.reduce((total, { Qty }) => total + parseInt(Qty, 10), 0) : 0;
    const ShippedQT = Array.isArray(OrderData) && OrderData.length ? OrderData.reduce((total, { ShippedQty }) => total + parseInt(ShippedQty, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(OrderData) || !OrderData.length) return;
        setOrderData([...OrderData.slice(0, i), ...OrderData.slice(i + 1)]);
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

    const receivedAmountHandler = (e) => {
        if (e.keyCode === 13 && PaidFocus.current) {
            e.preventDefault();
            PaidFocus.current.focus();
        }
    }

    const history = useHistory();

    const PaymentCalculation = (e = { target: { value: 0 } }) => {
        const inputValue = e.target.value;
        setPaid(inputValue);

        const subTotal = getTotal;
        const totalWithVat = subTotal + (subTotal * Vat) / 100;
        const disc = totalWithVat - Discount;
        let left = disc - inputValue;
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
    };

    const validatePaymentValues = async () => {
        await PaymentCalculation()
        let isValid = true;

        if ([15, 16, 17, 18].includes(Payment?.value)) {
            if (!Bank || Bank.trim() === "" || Bank === "0") {
                alert("Invalid Bank value.");
                isValid = false;
            }
        } else if ([14].includes(Payment?.value)) {
            if (!Cash || Cash.trim() === "" || Cash === "0") {
                alert("Invalid Cash value.");
                isValid = false;
            }
        } else if (Payment?.value === 19) {
            if (!Cash || Cash.trim() === "" || Cash === "0" || !Bank || Bank.trim() === "" || Bank === "0") {
                alert("Both Cash and Bank values must be valid for partial payment.");
                isValid = false;
            }
        }

        return isValid;
    };

    const SaveOrder = async (e) => {
        let VatTotal = (getTotal * Vat) / 100
        let GrandTotal = (parseFloat(getTotal) + parseFloat(Shipment || 0)) - parseFloat(Discount)
        if (SaveFocus.current)
            SaveFocus.current.disabled = true;
        var SellData = [];
        for (var i = 0; i < OrderData.length; i++) {
            SellData.push(OrderData[i]);
            SellData[i].SLNo = i + 1;
            SellData[i].Quantity = SellData[i].ShippedQty;
        }
        var data = moment(Date).format('YYYY-MM-DD')
        if (validatePaymentValues()) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });

            var result = await Invoice(user.Collocation.CounterID, { value: PartyData.PartyID.id }, OrderID, data, Vat, VatTotal, Discount, Shipment, Payment, GrandTotal, Cash, Bank, Paid, Due, RefundAmount, Count, SellData);
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
                    InvoicePrint(e, result.CallBack, true);
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                    history.goBack();
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
        if (CodeFocus.current)
            CodeFocus.current.focus();

        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
    }

    const VatCalc = (e) => {
        const vat = e.target.value || 0.00;
        setVat(vat);
        const subTotal = getTotal
        const totalWithVat = subTotal + (subTotal * vat) / 100;
        const disc = totalWithVat - Discount;
        const left = disc - Paid;
        setTotal(disc);
        setDue(left);
    };

    const DiscountCalc = (e = { target: { value: Discount } }) => {
        const discount = e.target.value;
        const maxDiscount = 50;

        if (discount > maxDiscount)
            return;

        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

        if (discount === '' || regex.test(discount)) {
            setDiscount(discount);

            const subTotal = getTotal;
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            let disc = (totalWithVat + parseFloat(Shipment)) - discount;
            disc = disc.toFixed(2);
            let left = disc - Paid;
            left = left.toFixed(2);
            setTotal(disc);
            setDue(left);
        }
    };

    const ShipmentCalc = (e = { target: { value: Shipment } }) => {
        const shipment = e.target.value || 0;
        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

        if (shipment === '' || regex.test(shipment)) {
            setShipment(shipment);
            const subTotal = getTotal;
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            let disc = (totalWithVat - parseFloat(Discount)) + parseFloat(shipment);
            disc = disc.toFixed(2);
            let left = disc - Paid;
            left = left.toFixed(2);
            setTotal(disc);
            setDue(left);
        }
    };

    const PaidCalcOnUpdate = () => {
        const paid = Cash + Bank;
        setPaid(paid);

        let payment;
        if (Cash && Bank) payment = { label: "Partial", value: 19 };
        else if (Cash) payment = { label: "Paid in cash", value: 14 };
        else if (Bank) payment = { label: "Paid in bank", value: 18 };
        else payment = { label: "COD (Cash on delivery)", value: 12 };

        setPayment(payment);

        const subTotal = getTotal;
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
    };

    const PaidCalc = (e = { target: { value: Paid } }) => {
        const inputId = e.target.id;
        const inputValue = e.target.value;

        if (inputId === "Cash") {
            setCash(inputValue);
        } else if (inputId === "Bank") {
            setBank(inputValue);
        } else {
            alert(`Unexpected input id: ${inputId}`);
            return;
        }

        const newCash = inputId === "Cash" ? (isNaN(parseFloat(inputValue)) ? 0 : parseFloat(inputValue)) : parseFloat(Cash || 0);
        const newBank = inputId === "Bank" ? (isNaN(parseFloat(inputValue)) ? 0 : parseFloat(inputValue)) : parseFloat(Bank || 0);

        const paid = newCash + newBank;
        setPaid(paid);

        let payment;
        if (newCash && newBank) payment = { label: "Partial", value: 19 };
        else if (newCash) payment = { label: "Paid in cash", value: 14 };
        else if (newBank) payment = { label: "Paid in bank", value: 18 };
        else payment = { label: "COD (Cash on delivery)", value: 12 };

        setPayment(payment);

        const subTotal = getTotal;
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
    };

    const handleKeyDown = (event) => {
        const regex = /^[0-9.]*$/;

        if (event.key === 'Enter') {
            SaveOrder(event);
        } else if (event.key === 'Backspace') {
            return;
        } else if (!regex.test(event.key) || (event.key === "." && event.target.value.includes("."))) {
            event.preventDefault();
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
        const input = e.toString()
        const paddedValue = input.length <= 7 ? input.padStart(7, '0') : input;
        const value = await FetchProduct(paddedValue);
        if (isValidProduct(value)) {
            setFormData({
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
                Qty: Qty,
                Weight: value.UnitWeight * Qty,
                Remark: 'N/A',
                SubTotal: parseFloat(Qty, 10) * value.SellPrice,
            });
            setAvailable(parseFloat(value.Qty || 0));
            const left_stock = Available - parseFloat(UnitQty || 0) > 0 ? true : false

            if (AutoFire && left_stock) {
                AutoFireData(e, formData);
            }
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

    const EnterKeyEvent = (e) => {
        const value = e.target.value;
        const paddedValue = value.padStart(7, '0').slice(0, 7);
        if (e.keyCode === 13)
            BarcodeAction(paddedValue);
    }

    let cachedOrderData;
    const GetOrderData = async () => {
        let result;
        if (!cachedOrderData) {
            result = await FetchOrderData(OrderID);
            cachedOrderData = result;
        } else {
            result = cachedOrderData;
        }
        if (result !== true) {
            setOrderData(result.OrderDataMap);
            setPartyData(result.PartyData)
            setStatus(result.PartyData.Status)
            setOrderDate(moment(result.PartyData.OrderDate, 'YYYY-MM-DD').toDate());
            setDeliveryDate(moment(result.PartyData.DeliveryDate, 'YYYY-MM-DD').toDate());
            setOrderNo(result.PartyData.OrderNo)
            setPayment({ label: getLabel(result.PartyData.Payment, PaymentTerms), value: result.PartyData.Payment })
            setVat(result.PartyData.Vat || 0.00)
            setDiscount(result.PartyData.Discount || 0.00)
            setShipment(result.PartyData.Shipping || 0.00)
            setPaid(result.PartyData.PaidAmount || 0.00)
            setBank(result.PartyData.Bank || 0.00)
            setCash(result.PartyData.Cash || 0.00)
            let bal = parseFloat(result.PartyData.GrandTotal) - parseFloat(result.PartyData.PaidAmount)
            setDue(result.PartyData.Due)
            setRefundAmount(result.PartyData.RefundAmount)
        } else {
            history.goBack();
        }
    }

    const handleFocus = (e) => setFormData({ ...formData, SubTotal: Rate * Qty });

    const SpecialityData = (e) => {
        let remark = Remark;
        if (DiscPrct === 2) {
            const regex = /\(\d+%\)/;
            remark = regex.test(remark) ? remark.replace(regex, `(${e.target.value}%)`) : [remark, `(${e.target.value}%)`].filter(Boolean).join(' ');
        }

        const cases = {
            1: { SubTotal: 0, Remark: "Bonus" },
            2: { SubTotal: SubTotal - ((SubTotal * e.target.value) / 100), Remark: remark },
            3: { SubTotal: UnitPrice * Qty, Remark: remark },
            default: { SubTotal: SubTotal.toFixed(2), Rate: formData.SellPrice, Remark: "N/A" }
        };
        setFormData({ ...formData, ...(cases[DiscPrct] || cases.default) });
    };

    const handleShipmentChange = (index, event) => {
        const newOrderData = [...OrderData];
        const prevValue = newOrderData[index].ShippedQty;
        const currentValue = Math.floor(+event.target.value || 1);
        if (prevValue !== currentValue) {
            const { Rate, UnitWeight } = OrderData[index];
            newOrderData[index].ShippedQty = currentValue;
            newOrderData[index].Available = newOrderData[index].Available + prevValue - currentValue;
            newOrderData[index].SubTotal = currentValue * Rate;
            newOrderData[index].Weight = currentValue * UnitWeight;
            setOrderData(newOrderData);
        }
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

    const RemarkToggle = (e) => {
        let newSubTotal;
        if (e.value === 1)
            newSubTotal = 0;
        else if (e.value === 3)
            newSubTotal = Qty * UnitPrice;
        else
            newSubTotal = Qty * Rate;

        setFormData({ ...formData, Remark: e.label, SubTotal: newSubTotal });
        setDiscPrct(e.value);
    }

    const lastRow = OrderData[OrderData.length - 1];
    var h = window.innerHeight - 200;
    
    return (
        <div className="row d-flex m-0">
            <div className="d-flex py-2 m-0 justify-content-between align-items-center" style={{ zIndex: 1, backgroundColor: "#F4DCC1" }}>
                <div className="justify-content-center align-items-center w-25">
                    <p className="display-6 m-0 text-left text-primary fw-bolder">{"PRODUCT DELIVERY"}</p>
                    <p className="fw-bold text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                </div>

                <div className="d-flex justify-content-center align-items-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                    <i className="display-4 fad fa-sort-numeric-up"></i>
                    <div className='row px-2'>
                        <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>
                            {parseFloat(PartyData?.Limit || 0).toLocaleString('en-PG', { style: 'currency', currency: 'PGK' })}
                        </p>
                        <p className="fw-bold text-dark text-left align-self-center m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"CREDIT LIMIT"}</p>
                    </div>
                </div>

                <div className="cs_outer" style={{ height: "30px" }}>
                    <div className="cs_inner"></div>
                </div>

                <div className="d-flex justify-content-center align-items-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                    <img src={TotalPrice} className="img-fluid mb-0" width="43" height="30" alt="avatar" />
                    <div className='row px-2'>
                        <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{((parseFloat(getTotal) + parseFloat(Shipment || 0) - parseFloat(Discount))).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                        <p className="fw-bold text-dark text-left align-self-center m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"TOTAL PRICE"}</p>
                    </div>
                </div>

                <div className="cs_outer" style={{ height: "30px" }}>
                    <div className="cs_inner"></div>
                </div>

                <div className="d-flex justify-content-center align-items-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                    <i className="display-5 fad fa-percent"></i>
                    <div className='row px-2'>
                        <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{parseFloat(Paid || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                        <p className="fw-bold text-dark text-left align-self-center m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"REMAINING CREDIT"}</p>
                    </div>
                </div>

                <Link className="d-flex justify-content-end align-items-center w-25" to={`/my_party/${PartyData?.PartyID?.PartyID}/${PartyData?.PartyID?.id}`}>
                    <div className='row px-2'>
                        <p className={`fs-4 fw-bold m-0 text-right ${!OrderData && "text-muted"}`} style={{ fontFamily: "MyriadPro" }}>{PartyData?.PartyID?.Title || "N/A"}</p>
                        <p className="fw-bold text-muted text-right align-self-center m-0" style={{ fontFamily: "MyriadPro" }}>{PartyData?.PartyID?.Address || "N/A"}</p>
                    </div>
                </Link>
            </div>

            <div className="row d-flex justify-content-between border-top px-0 h-100 m-0 ce-gradient5" style={{ zIndex: 1 }}>

                <div className="col-lg-8 d-flex flex-wrap justify-content-center">
                    {
                        lastRow &&
                        <div className='row w-100 mb-2'>
                            <div className='d-flex justify-content-between m-0 p-0'>
                                <p className='display-5 bg-gradient bg-primary text-white border border-white fw-bold text-left m-0 w-75 px-4 shadow-lg' style={{ borderRadius: "50px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastRow.label ? lastRow.label : lastRow.Title}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-warning text-white border border-white fw-bold text-nowrap m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>PK-</span> {lastRow?.UnitName}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-dark text-white border border-white fw-bold text-nowrap m-0 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>QT-</span> {lastRow?.ShippedQty}</p>
                                <p className='display-5 align-items-center justify-content-end d-flex bg-gradient bg-success text-white border border-white fw-bold m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}>{lastRow?.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}<span className='fs-4'>PGK</span></p>
                            </div>
                        </div>
                    }
                    {
                        Array.isArray(OrderData) && OrderData.length ?
                            <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                                <table className={`table bg-white table-hover table-borderless fs-4`}>
                                    <thead className='bg-white'>
                                        <tr className="text-center">
                                            <th className="py-1 border-right"><span>S/N</span></th>
                                            <th className="py-1 border-right"><span>Title</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder text-nowrap">Ord. Qty</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder text-nowrap">Del. Qty</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Wt</span></th>
                                            <th className="py-1 border-right"><span>Rate</span></th>
                                            <th className="py-1 border-right"><span>Sub-Total</span></th>
                                            <th className="py-1 text-center"><span>Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            OrderData.slice().reverse().map((item, i) => {
                                                const reversedIndex = OrderData.length - i - 1;
                                                return (
                                                    <tr className="border-bottom text-center" key={reversedIndex}>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{reversedIndex + 1}</span></td>
                                                        <td className="py-0 px-1 border-right">
                                                            <span className="d-block fw-bold text-left text-nowrap" style={{ lineHeight: "1" }}>{item.label ? item.label : item.Title}</span>
                                                            {item.Remark !== "N/A" ?
                                                                <small className="d-block text-muted text-left" style={{ fontSize: '11px', lineHeight: "1" }}>{item.Remark}</small> : null}
                                                        </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="py-0 border-right" style={{ width: "100px" }}>
                                                            <input
                                                                style={{ width: "100px" }}
                                                                min="1"
                                                                onFocus={(event) => event.target.select()}
                                                                type="number"
                                                                autocomplete="off"
                                                                className="d-block fw-bolder text-right border-0"
                                                                id="Shipment"
                                                                value={item.ShippedQty}
                                                                onChange={handleShipmentChange.bind(null, reversedIndex)}
                                                            />
                                                        </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold text-right">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.Rate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="p-0">
                                                            <button className="btn fs-3 px-2 py-0 text-danger" onClick={() => deleteRow(reversedIndex)}>
                                                                <i className="fad fa-minus"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="6"><span className="d-block text-right">Sub-total </span> </td>
                                            <td className="py-0 border-right" style={{ width: "120px" }}><span className="d-block text-right">{getTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="6"><span className="d-block text-right">10% GST Included </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "120px" }}>{parseFloat((parseFloat(getTotal) * 0.10).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                            {/* <td className="py-0 d-flex justify-content-end border-right" style={{ width: "120px" }}><input style={{ width: "105px" }} disabled type="text" autocomplete="off" className="d-block text-right border-0" id="Vat" value={Vat} onChange={(e) => VatCalc(e)} /></td> */}
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" colSpan="6"><span className="d-block text-right ">Discount (K) </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "120px" }}>
                                                <input
                                                    ref={discFocus}
                                                    style={{ width: "105px" }}
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
                                            <td className="py-0 px-1 border-right" colSpan="6"><span className="d-block text-right ">Shipping Cost </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "120px" }}><input style={{ width: "105px" }} onFocus={(event) => event.target.select()} type="text" autocomplete="off" className="d-block text-right border-0" id="Shipment" value={Shipment}
                                                onChange={(e) => ShipmentCalc(e)} /></td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" style={{ width: "120px" }} colSpan="6"><span className="d-block text-right font-weight-bold">Total Price </span> </td>
                                            <td className="py-0 border-right"><span className="d-block font-weight-bold text-right">{((parseFloat(getTotal) + parseFloat(Shipment || 0) - parseFloat(Discount))).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        <tr className="text-center border border-light mt-3">
                                            <td className="p-1"><span className="d-block text-right fw-bold">Items:</span> </td>
                                            <td className="p-1 fw-bold d-flex">
                                                <div className="text-left" style={{ flex: 1 }}>{Count}</div>
                                                <div className="text-right">Order Qty:</div>
                                            </td>
                                            <td className="p-1"><span className="d-block text-left fw-bold">{OrderQT}</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bold">Deliver Qty: </span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bold">{ShippedQT}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bold">{Paid !== 0 && Due !== 0 ? "Due: " : RefundAmount > 0 && Paid > 0 ? "Change: " : RefundAmount === 0 && Due === 0 && Paid !== 0 ? "Paid: " : Due ? "Due: " : "N/A"}</span> </td>
                                            {/* <td className="p-1"><span className="d-block fw-bold text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal === Paid ? 0.00 : Due === 0.00 ? parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : (parseFloat(getTotal) - Paid + parseFloat(Shipment || 0)).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                            <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal === Paid ? 0.00 : Due === 0.00 ? parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="px-3 py-0" colSpan="3">
                                                {Status === 1 ?
                                                    <button className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                        onClick={() => SaveOrder()}
                                                    /> : Status === 2 ?
                                                        <button className="btn fs-3 py-1 fad fa-truck-couch text-success"
                                                        // onClick={() => SaveOrder()}
                                                        /> : null}
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

                <div className="col-lg-4 justify-content-center px-0 shadow-sm border-left" style={{ height: h + 55 + "px" }}>
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="cs_outer mx-0" style={{ height: h + "px" }}>
                            <div className="cs_inner"></div>
                        </div>

                        <form className="row justify-content-center mx-2 py-2 px-0 my-0 h-100">
                            <div className='justify-content-start align-items-between m-0 p-0'>
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
                                        <BarcodeReader onScan={(e) => BarcodeAction(e)} />
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
                                        <p className="text-center fs-4 text-dark fw-bold m-0">{UnitName + " Size: " + UnitQty}</p>
                                        <p className={`text-center fs-4 text-dark fw-bold ${Title !== "" ? (availability ? "bg-success text-white" : "bg-warning text-white") : null} px-2 m-0`} style={{ borderRadius: Title !== "" ? "15px" : null }}>{Title !== "" ? (availability ? "Available" : "Unavailable") : "N/A"}</p>
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
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Unit Wt</p>
                                        <input
                                            type="text"
                                            id="UnitWeight"
                                            className="form-control fs-4 fw-bold p-0 text-center m-0"
                                            placeholder="0.000"
                                            value={UnitWeight ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Qty</p>
                                        <input
                                            ref={QtyFocus}
                                            type="number"
                                            className="form-control fs-4 fw-bold p-0 text-center"
                                            name="Qty"
                                            id="Qty"
                                            placeholder="0"
                                            value={Qty}
                                            onChange={(e) => BarcodeGen(e)}
                                            onKeyDown={(e) => shouldBlur(e)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0">
                                    <div className="col-md-6">
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Unit Price</p>
                                        <input
                                            type="number"
                                            id="UnitPrice"
                                            className="form-control fs-4 fw-bold p-0 text-center m-0"
                                            placeholder="0.00"
                                            value={Rate ? Rate : ""}
                                            onChange={(e) => CS_Rate(e)}
                                            disabled={DiscPrct !== 4}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Weight</p>
                                        <input
                                            type="text"
                                            id="Weight"
                                            className="form-control fs-4 fw-bold p-0 text-center"
                                            placeholder="0.000"
                                            value={Weight ? Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-6">
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Remark</p>
                                        <div className="d-flex fs-4 fw-bold p-0">
                                            <Select
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                menuPortalTarget={document.body}
                                                borderRadius={"0px"}
                                                options={[{ label: "N/A", value: 0 }, { label: "Discount", value: 2 }, ...(PartyData?.PartyID.IsDispatchable ? [{ label: "Bonus", value: 1 }, { label: "Dispatch", value: 3 }, { label: "Custom", value: 4 }] : [])]}
                                                name="Remark"
                                                placeholder={"Please select product"}
                                                styles={CScolourStyles}
                                                value={{ label: Remark, value: 0 }}
                                                onChange={(e) => RemarkToggle(e)}
                                                isDisabled={!PartyData?.PartyID.IsDispatchable}
                                                id="Remark"
                                            />

                                            {(DiscPrct === 2) &&
                                                <input
                                                    type="number"
                                                    style={{ width: "60px", marginLeft: "2px" }}
                                                    className="form-control fs-4 fw-bold p-0 text-center"
                                                    name="SpecialValue"
                                                    id="SpecialValue"
                                                    placeholder="%"
                                                    value={SpecialValue}
                                                    onChange={(e) => setSpecialValue(e.target.value)}
                                                    onBlur={(e) => SpecialityData(e)}
                                                    onFocus={(e) => handleFocus(e)}
                                                    disabled={!Code}
                                                />
                                            }
                                        </div>

                                    </div>

                                    <div className="col-md-6">
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Sub-Total</p>
                                        <input
                                            type="text"
                                            id="SubTotal"
                                            className="form-control fs-4 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={SubTotal ? SubTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            disabled
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
                                            onClick={(e) => availability ? AddRow(e) : null}><i className="fs-3 fad fa-plus pr-2"></i>  ENTER </Link>
                                    </div>
                                </div>
                            </div>

                            <div className='justify-content-center align-self-end my-2 mx-0 p-0'>
                                <div className="d-flex justify-content-between p-0 align-items-end">
                                    <div className="row border rounded justify-content-center mx-1 w-50">
                                        <Datepicker
                                            selected={OrderDate}
                                            className="form-control fw-bolder bg-white border-0 text-center p-0"
                                            dateFormat="dd MMM yyyy"
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Please select date"
                                            onChange={(e) => setOrderDate(e)}
                                            disabled
                                        />
                                        <p className="text-center fs-5 text-dark fw-bold border-top w-75">Order Date</p>

                                        {/* <p className="text-center fs-5 text-dark fw-bolder border-0 text-center py-0">{moment(OrderDate).format("DD MMM YYYY")}</p> */}
                                    </div>

                                    <div className="row border rounded justify-content-center mx-1 w-50">
                                        <Datepicker
                                            selected={DeliveryDate}
                                            className="form-control fw-bolder border-0 text-center p-0"
                                            dateFormat="dd MMM yyyy"
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Please select date"
                                            onChange={(e) => setDeliveryDate(e)}
                                        />
                                        <p className="text-center fs-5 text-dark fw-bold border-top w-75">Delivery Date</p>
                                    </div>
                                </div>

                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-4">
                                        <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Cash</p>
                                        <input
                                            ref={CashFocus}
                                            name='Cash'
                                            type="text"
                                            id="Cash"
                                            className="form-control fs-5 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={Cash ? Cash.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            onChange={(e) => PaidCalc(e)}
                                            maxLength="8"
                                            required
                                            disabled={![14, 19].includes(Payment?.value)}
                                            onKeyDown={handleKeyDown}
                                            onFocus={handleFocusSelect}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Card</p>
                                        <input
                                            ref={BankFocus}
                                            name='Bank'
                                            type="text"
                                            id="Bank"
                                            className="form-control fs-5 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={Bank ? Bank.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            onChange={(e) => PaidCalc(e)}
                                            maxLength="8"
                                            required
                                            disabled={![15, 16, 17, 18, 19].includes(Payment?.value)}
                                            onKeyDown={handleKeyDown}
                                            onFocus={handleFocusSelect}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <div className="row justify-content-between p-0 m-0" disabled>
                                            <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Payment Type</p>
                                            <div className="input-group fs-5 fw-bold p-0">
                                                <Select
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    menuPortalTarget={document.body}
                                                    borderRadius={"0px"}
                                                    options={PaymentTerms}
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
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    OrderID: props.match.params.order_id,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(OrderExecute);