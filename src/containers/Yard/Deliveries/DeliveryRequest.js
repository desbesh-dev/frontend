import * as moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { FetchInvoiceNo, FetchSector, fetchServerTimestamp } from '../../../actions/APIHandler';
import { FetchProductYard, PaymentTerms, ReqProductList } from '../../../actions/InventoryAPI';
import { DelRequest } from '../../../actions/YardAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { CustomMenuDeliver } from '../../../hocs/Class/CustomMenuDeliver';
import { GeneralColourStyles } from '../../../hocs/Class/SelectStyle';
import '../../../hocs/react-select/dist/react-select.css';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { DiscountModal } from '../../Trading/ViewInvoice/Modals/ModalForm';
import { DeliveryNotePrint } from '../Deliveries/DeliveryNotePrint';

let today = new Date();

const DeliveryRequest = ({ SectorID, user, list, setList }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [SectorList, setSectorList] = useState([])
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    const [Subscriber, setSubscriber] = useState(false)
    const [SellInfo, setSellInfo] = useState(null)
    const [ProValue, setProValue] = useState(null)

    const [RequestForID, setRequestForID] = useState(null)
    const [RequestToID, setRequestToID] = useState(null)
    const [OrderDate, setOrderDate] = useState(today)
    const [DeliveryDate, setDeliveryDate] = useState(today)
    const [OrderNo, setInvoiceNo] = useState(0)
    const [Payment, setPayment] = useState({ label: "CND (Cash next delivery)", value: 13 })
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(null)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)
    const [RefundAmount, setRefundAmount] = useState(0.00)
    const [Available, setAvailable] = useState(0)
    const [DiscPrct, setDiscPrct] = useState(0)
    const [SpecialValue, setSpecialValue] = useState(0)
    const [SellWeight, setSellWeight] = useState(0)
    const [AutoFire, setAutoFire] = useState(0)
    const [WalkIN, setWalkIN] = useState(false)
    const [kode, setCode] = useState('')

    const [DiscModal, setDiscModal] = useState(false)
    const [GrantDisc, setGrantDisc] = useState(false)
    const [CtrNo, setCtrNo] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    let [OrderData, setOrderData] = useState([]);
    const [forceRender, setForceRender] = useState(false);
    const [locale, setLocale] = useState('en');
    let toastProperties = null;

    const dispatch = useDispatch();
    const QtyFocus = useRef(null);
    const PaidFocus = useRef(null);
    const CodeFocus = useRef(null);
    const ProductFocus = useRef(null);
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
        Quantity: 1,
        Weight: "",
        Rate: "",
        Remark: "N/A",
        SubTotal: "",
        CtrID: "",
    };
    const [formData, setFormData] = useState(initialState);

    const { Code, Barcode, Title, UnitName, UnitQty, UnitWeight, UnitPrice, Quantity, Weight, Rate, Remark, SubTotal } = formData;
    let Count = OrderData.length;

    useEffect(() => {
        LoadInvoiceNo();
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };
    }, [])

    useEffect(() => {
        LoadInvoiceNo();
        LoadSector();
    }, [])

    const sect = useRef(null);

    useEffect(() => {
        LoadProductItems();
    }, [currentPage, sect.current]);

    let sect_to = RequestToID && RequestToID.value

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setMyProList([null]);
        localStorage.removeItem("data")
        localStorage.removeItem("dataTimestamp")
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

        var ProductItems = await ReqProductList(currentPage, sect.current, sect_to);
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
            setInvoiceNo(result.OrderNo)
            setSellInfo(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSector = async () => {
        var result = await FetchSector();
        if (result !== true) {
            setSectorList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const ExchangeStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "15vh", borderRadius: '20px' }),
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

    const left_stock = Available - ((parseFloat(UnitQty || 0) * parseFloat(Quantity || 0)))
    const availability = left_stock >= 0 ? true : false

    const AddRow = (e) => {
        const { Quantity, Code } = formData;
        if (!Quantity || !Code) {
            setInvalidModalShow(true);
            return;
        }

        if (parseFloat(Quantity) > parseFloat(Available)) {
            setInfoModalShow(true);
            return;
        }
        const dataExistsIndex = OrderData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName && item.Remark === formData.Remark);

        if (dataExistsIndex === -1) {
            if (parseInt(DiscPrct) === 3)
                setOrderData([...OrderData, { ...formData, Rate: UnitPrice, Available: left_stock }]);
            else
                setOrderData([...OrderData, { ...formData, Available: left_stock }]);
        } else {
            OrderData[dataExistsIndex].Quantity = parseFloat(OrderData[dataExistsIndex].Quantity, 10) + parseFloat(formData.Quantity, 10);
            OrderData[dataExistsIndex].Weight = parseFloat(OrderData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            OrderData[dataExistsIndex].SubTotal = parseFloat(OrderData[dataExistsIndex].SubTotal, 10) + parseFloat(formData.SubTotal, 10);
            OrderData[dataExistsIndex].Available = parseFloat(OrderData[dataExistsIndex].Available, 10) - parseFloat(formData.Quantity, 10);
            const updatedItem = OrderData.splice(dataExistsIndex, 1)[0];
            OrderData.push(updatedItem);
            setOrderData([...OrderData]);
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
            setDiscount(0);
            setFormData(initialState);
            setDiscPrct(0)
            setForceRender(!forceRender);
        }
    }

    const getTotal = () => {
        if (!Array.isArray(OrderData) || !OrderData.length) return 0.00;
        return OrderData.reduce((acc, { Quantity, Rate }) => acc + Quantity * Rate, 0.00);
    };

    const QuantityTotal = Array.isArray(OrderData) && OrderData.length ? OrderData.reduce((total, { Quantity }) => total + parseInt(Quantity, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(OrderData) || !OrderData.length) return;
        setOrderData([...OrderData.slice(0, i), ...OrderData.slice(i + 1)]);
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

    const SaveOrder = async (e) => {
        let VatTotal = (getTotal() * Vat) / 100;
        let GrandTotal = Total === 0 ? getTotal() : Total;
        SaveFocus.current.disabled = true;
        OrderData = OrderData.map((item, index) => ({ ...item, SLNo: index + 1 }));
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var order_date = moment(OrderDate).format("YYYY-MM-DD");
        var delivery_date = moment(DeliveryDate).format("YYYY-MM-DD");
        var result = await DelRequest(user.Collocation.id, RequestToID, RequestForID, order_date, delivery_date, Vat, VatTotal, Discount, Shipment, Payment, GrandTotal, Paid, Due, RefundAmount, Count, OrderData);
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
                DeliveryNotePrint(e, result.CallBack, true);
                LoadInvoiceNo();
                ClearForm();
            }
        } else {
            setList([
                ...list,
                toastProperties = {
                    id: 1,
                    title: "Error",
                    description: "Failed to save product profile. Please try after some moment.",
                    backgroundColor: "#f0ad4e",
                    icon: errorIcon
                }
            ]);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        if (CodeFocus.current)
            CodeFocus.current.focus();

        if (SaveFocus.current)
            SaveFocus.current.disabled = false;

        dispatch({ type: DISPLAY_OVERLAY, payload: false });

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

        if (discount > maxDiscount)
            return;

        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

        if (discount === '' || regex.test(discount)) {
            setDiscount(discount);
            const subTotal = getTotal();
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            let disc = (totalWithVat + parseFloat(Shipment)) - discount;
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

    const ShipmentCalc = (e = { target: { value: Shipment } }) => {
        const shipment = e.target.value || 0;
        setShipment(shipment);
        const subTotal = getTotal();
        const totalWithVat = subTotal + (subTotal * Vat) / 100;
        let disc = (totalWithVat - Discount) + parseFloat(shipment);
        disc = disc.toFixed(2);
        let left = disc - Paid;
        left = left.toFixed(2);
        setTotal(disc);
        setDue(left);
    };

    const BarcodeGen = (e) => {
        setFormData({
            ...formData,
            "SLNo": '',
            "Quantity": e.target.value,
            "Weight": (UnitWeight * e.target.value).toFixed(3),
            "SubTotal": (Rate * e.target.value).toFixed(2)
        });
    }

    const CS_Rate = (e) => {
        setFormData({
            ...formData,
            "SLNo": '',
            "Rate": e.target.value,
            "SubTotal": (e.target.value * Quantity).toFixed(2)
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
        const value = await FetchProductYard(paddedValue, sect.current, sect_to);

        if (isValidProduct(value)) {
            let cond_rate = 0
            if (RequestForID.value === (user.Collocation.id).replace(/-/g, ''))
                cond_rate = value.UnitPrice
            else
                cond_rate = value.SellPrice

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
                Rate: cond_rate,
                Quantity: parseFloat(Quantity, 10),
                Weight: value.UnitWeight * parseFloat(Quantity, 10),
                Remark: "N/A",
                SubTotal: (parseFloat(Quantity, 10) * value.UnitQty) * cond_rate,
                CtrID: value.ContainerID || '',
                // CtrNo: value.ContainerNo || ''
            }
            setFormData(FireData);
            setCode(value.Code)
            setAvailable(parseFloat(value.Qty || 0));
            const left_stock = Available - ((parseFloat(UnitQty || 0) * parseFloat(Quantity || 0))) > 0 ? true : false

            if (AutoFire && left_stock) {
                AutoFireData(e, FireData);
            }
            AddRowFocus.current.focus();
        } else {
            setFormData(initialState);
        }
    };

    const DropdownAction = async (e) => {
        const input = e.value.toString() + '12'
        const paddedValue = input.length <= 7 ? input.padStart(7, '0') : input;
        var value = await FetchProductYard(paddedValue, sect.current, sect_to, e.CtrNo);
        if (isValidProduct(value)) {
            let cond_rate = 0
            if (RequestForID.value === (user.Collocation.id).replace(/-/g, ''))
                cond_rate = value.UnitPrice
            else
                cond_rate = value.SellPrice

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
                Rate: cond_rate,
                Quantity: parseFloat(Quantity, 10),
                Weight: value.UnitWeight * parseFloat(Quantity, 10),
                Remark: "N/A",
                SubTotal: parseFloat(Quantity, 10) * cond_rate,
                CtrID: value.ContainerID || '',
                // CtrNo: value.ContainerNo || ''
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
        if (e.keyCode === 13)
            BarcodeAction(value);
    }

    const handleFocus = (e) => setFormData({ ...formData, SubTotal: Rate * Quantity });

    const SpecialityData = (e) => {
        let remark = Remark;
        if (DiscPrct === 2 || DiscPrct === 3) {
            const regex = /\(\d+%\)/;
            remark = regex.test(remark) ? remark.replace(regex, `(${e.target.value}%)`) : [remark, `(${e.target.value}%)`].filter(Boolean).join(' ');
        }
        const cases = {
            1: { SubTotal: 0, Remark: "Bonus" },
            2: { SubTotal: (SubTotal - ((SubTotal * e.target.value) / 100)).toFixed(2), Remark: remark },
            3: { SubTotal: UnitPrice * Quantity, Remark: remark },
            default: { SubTotal: SubTotal.toFixed(2), Rate: formData.SellPrice, Remark: "N/A" }
        };
        setFormData({ ...formData, ...(cases[DiscPrct] || cases.default) });
    };

    const ClearForm = () => {
        LoadInvoiceNo();
        setOrderData([]);
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
        setRequestToID(null);
        setRequestForID(null);
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

    const RemarkToggle = (e) => {
        let newSubTotal;
        if (e.value === 1)
            newSubTotal = 0;
        else if (e.value === 3)
            newSubTotal = Quantity * UnitPrice;
        else
            newSubTotal = Quantity * Rate;

        setFormData({ ...formData, Remark: e.label, SubTotal: newSubTotal });
        setDiscPrct(e.value);
    }

    const handleRequestToChange = (selectedOption) => {
        if (selectedOption.value === (user.Collocation.id).replace(/-/g, '')) {
            alert('This value is not allowed.');
        } else if (selectedOption.No !== 30) {
            setRequestToID(selectedOption);
            const requestForOption = SectorList.find(option => option.value === user.Collocation.id.replace(/-/g, ''));
            setRequestForID(requestForOption);
            sect.current = selectedOption.value
        } else if (selectedOption.No === 30) {
            setRequestToID(selectedOption);
            sect.current = user.Collocation.id.replace(/-/g, '')
        } else if (selectedOption.value !== (RequestForID && RequestForID.value)) {
            setRequestToID(selectedOption);
            sect.current = selectedOption.value
        } else {
            alert('Cannot select the same sector for both fields');
        }
        setMyProList([]);
        localStorage.removeItem("data")
        localStorage.removeItem("dataTimestamp")
    }

    const handleRequestForChange = (selectedOption) => {
        if (selectedOption.value === '') {
            alert('This value is not allowed.');
        } else if (RequestToID && RequestToID.value === (user.Collocation.id).replace(/-/g, '')) {
            setRequestForID(selectedOption);
        } else if (RequestToID && RequestToID.No !== 30) {
            const requestForOption = SectorList.find(option => option.value === user.Collocation.id.replace(/-/g, ''));
            setRequestForID(requestForOption);
        } else if (selectedOption.value !== (RequestToID && RequestToID.value)) {
            setRequestForID(selectedOption);
        } else {
            alert('Cannot select the same sector for both fields');
        }
    }

    var h = window.innerHeight - 200;
    const lastRow = OrderData[OrderData.length - 1];

    const formatOptionLabel = ({ label, CtrNo, Qty }) => {
        return (
            <div style={{ lineHeight: '1' }}>
                <div className='p-0 m-0' style={{ lineHeight: '1' }}>{label}</div>
                <small className='p-0 m-0' style={{ lineHeight: '1', color: "#333333" }}>{CtrNo + ", Qty- " + Qty}</small>
            </div>
        );
    }

    return (
        <div className="row d-flex m-0">
            <div className="d-flex py-2 m-0 justify-content-between align-items-center" style={{ zIndex: 1, backgroundColor: "#F4DCC1" }}>
                <div className="justify-content-center align-items-center w-25">
                    <p className="display-6 m-0 text-left text-primary fw-bolder">{"PRODUCT REQUISATION"}</p>
                    <p className="fw-bold text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                </div>
                <div className="cs_outer" style={{ height: "30px" }}>
                    <div className="cs_inner"></div>
                </div>

                <div className="d-flex justify-content-center align-items-center border border-2 border-white w-75 shadow-lg" style={{ borderRadius: "25px" }}>
                    <div className="col-md-6 d-flex justify-content-center align-items-center p-1">
                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>Request To</p>
                        <div className="input-group fs-5 fw-bold p-0">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={SectorList}
                                name="RequestToID"
                                placeholder={"Request To"}
                                styles={ExchangeStyles}
                                value={RequestToID}
                                onChange={handleRequestToChange}
                                required
                                id="RequestToID"
                            />
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center align-items-center p-1">
                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>Request For</p>
                        <div className="input-group fs-5 fw-bold p-0">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={SectorList}
                                name="RequestForID"
                                placeholder={"Request For"}
                                styles={ExchangeStyles}
                                value={RequestForID}
                                onChange={handleRequestForChange}
                                required
                                id="RequestForID"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row d-flex justify-content-between border-top px-0 h-100 m-0 ce-gradient5" style={{ zIndex: 1 }}>

                <div className="col-lg-8 d-flex flex-wrap justify-content-center">
                    {
                        lastRow &&
                        <div className='row w-100 mb-2'>
                            <div className='d-flex justify-content-between m-0 p-0'>
                                <p className='display-5 bg-gradient bg-primary text-white border border-white fw-bold text-left m-0 w-75 px-4 shadow-lg' style={{ borderRadius: "50px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastRow?.label}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-warning text-white border border-white fw-bold text-nowrap m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>PK-</span> {lastRow?.UnitName}</p>
                                <p className='display-5 align-items-center justify-content-center d-flex bg-gradient bg-dark text-white border border-white fw-bold text-nowrap m-0 px-4 shadow-lg' style={{ borderRadius: "50px" }}><span className='fs-4'>QT-</span> {lastRow?.Quantity}</p>
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
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Qty</span></th>
                                            <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Wt</span></th>
                                            <th className="py-1 border-right"><span>Rate</span></th>
                                            <th className="py-1 border-right"><span>Sub-Total</span></th>
                                            <th className="py-1 border-right"><span>Available</span></th>
                                            {/* <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Sub-Total</span></th> */}
                                            <th className="py-1 text-center"><span>Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            OrderData.slice().reverse().map((item, i) => {
                                                const reversedIndex = OrderData.length - i - 1;
                                                return (
                                                    <tr className="border-bottom text-center" key={i}>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{reversedIndex + 1}</span></td>
                                                        <td className="py-0 px-1 border-right">
                                                            <span className="d-block fw-bold text-left" style={{ lineHeight: "1" }}>{item.label}</span>
                                                            {item.Remark !== "N/A" ?
                                                                <small className="d-block text-muted text-left" style={{ fontSize: '11px', lineHeight: "1" }}>{item.Remark}</small> : null}
                                                        </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="py-0 border-right text-right fw-bold">{item.Available ? item.Available : "Not Available"}</td>
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
                                            <td className="py-0 px-1 border-right" colSpan="5"><span className="d-block text-right ">Shipping Cost </span> </td>
                                            <td className="py-0 d-flex justify-content-end border-right" style={{ width: "160px" }}><input style={{ width: "140px" }} onFocus={(event) => event.target.select()} type="text" autocomplete="off" className="d-block text-right border-0" id="Shipment" value={Shipment}
                                                onChange={(e) => ShipmentCalc(e)} /></td>
                                        </tr>
                                        <tr className="text-center border-success bg-white">
                                            <td className="py-0 px-1 border-right" style={{ width: "160px" }} colSpan="5"><span className="d-block text-right font-weight-bold">Total Price </span> </td>
                                            <td className="py-0 border-right"><span className="d-block font-weight-bold text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                        {/* <tr className="text-center border-success bg-white">
                                            <td className="p-1 px-1 border-right" colSpan="5"><span className="d-block text-right fw-bolder fs-4">Paid </span> </td>
                                            <td className="p-1 d-flex justify-content-end border-right" style={{ width: "160px" }}>
                                                <input type="text"
                                                    style={{ width: "150px" }}
                                                    autocomplete="off"
                                                    className="d-block text-right border fs-4 fw-bolder"
                                                    id="Paid"
                                                    value={Paid}
                                                    onChange={(e) => PaidCalc(e)} />
                                            </td>
                                        </tr> */}
                                        <tr className="text-center border border-light mt-3">
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Items:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{Count}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bolder">Qty:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bolder">{Paid !== 0 && Due !== 0 ? "Due: " : RefundAmount !== 0 && Paid !== 0 ? "Change: " : RefundAmount === 0 && Due === 0 ? "Paid: " : Due ? "Due: " : "N/A"}</span> </td>
                                            <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="px-3 py-0" colSpan="2">
                                                <button
                                                    ref={SaveFocus}
                                                    className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                    onClick={() => SaveOrder()}
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
                                    <BarcodeReader onScan={BarcodeHandler} />
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
                                    </div>
                                </div>
                                <div className="row justify-content-between p-0 m-0">
                                    <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Select Product</p>
                                    <div className="input-group fs-4 fw-bold p-0">
                                        <Select
                                            ref={ProductFocus}
                                            options={Array.isArray(MyProList) && MyProList.length ? MyProList : []}
                                            name="Title"
                                            placeholder={"Please select product"}
                                            styles={GeneralColourStyles}
                                            value={ProValue}
                                            onChange={(e) => { if (e) { DropdownAction(e); setFormData(e); setCtrNo(e.CtrNo); setProValue(e) } }}
                                            required
                                            id="Title"
                                            isClearable={true}
                                            components={{ MenuList: CustomMenuDeliver }}
                                            maxMenuHeight={25 * 45}
                                            formatOptionLabel={formatOptionLabel}
                                        />
                                    </div>
                                </div>
                                <div className='row my-2 mx-0 p-0'>
                                    <div className={`d-flex justify-content-between align-items-center ${AutoFire ? "border border-warning" : null}`} style={{ borderRadius: "15px" }}>
                                        <p className="text-center fs-4 text-dark fw-bold m-0">{UnitName + " Size: " + UnitQty}</p>
                                        {RequestToID && RequestToID.No === 30 && <p className={`text-center fs-4 text-dark fw-bold bg-success text-white px-2 m-0`} style={{ borderRadius: "15px" }}>{CtrNo}</p>}
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
                                        <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom">Quantity</p>
                                        <input
                                            ref={QtyFocus}
                                            type="number"
                                            className="form-control fs-4 fw-bold p-0 text-center"
                                            name="Quantity"
                                            id="Quantity"
                                            placeholder="0"
                                            value={Quantity}
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
                                                options={[{ label: "N/A", value: 0 }, { label: "Discount", value: 2 }, { label: "Bonus", value: 1 }, { label: "Dispatch", value: 3 }, { label: "Custom", value: 4 }]}
                                                name="Remark"
                                                placeholder={"Please select product"}
                                                styles={GeneralColourStyles}
                                                value={{ label: Remark, value: 0 }}
                                                onChange={(e) => RemarkToggle(e)}
                                                isDisabled={!Code}
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
                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-6">
                                        <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Request Date</p>
                                        <Datepicker
                                            selected={OrderDate}
                                            className="form-control fw-bolder border-0 text-center py-0"
                                            dateFormat="dd MMM yyyy"
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Please select date"
                                            onChange={(e) => setOrderDate(e)}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <div className="row justify-content-between p-0 m-0" disabled>
                                            <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Delivery Date</p>
                                            <div className="input-group text-center fs-4 fw-bold p-0">
                                                <Datepicker
                                                    selected={DeliveryDate}
                                                    className="form-control fw-bolder border-0 text-center py-0"
                                                    dateFormat="dd MMM yyyy"
                                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                                    locale={locales[locale]}
                                                    placeholderText="Please select date"
                                                    onChange={(e) => setDeliveryDate(e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row justify-content-between p-0 align-items-end">
                                    <div className="col-md-6">
                                        <p className="text-center fs-5 text-dark fw-bold m-0 border-bottom">Received Amount</p>
                                        <input
                                            type="text"
                                            id="Paid"
                                            className="form-control fs-5 fw-bold p-0 text-center"
                                            placeholder="0.00"
                                            value={Paid ? Paid.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                            onChange={(e) => PaidCalc(e)}
                                            maxLength="6"
                                            required
                                            disabled={![14, 15, 16, 17, 18, 19].includes(Payment.value)}
                                        />
                                    </div>

                                    <div className="col-md-6">
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
                                                    styles={GeneralColourStyles}
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
    PartyID: props.match.params.party_id,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(DeliveryRequest);