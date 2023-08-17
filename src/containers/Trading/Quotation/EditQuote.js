import * as moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchSectorPartyList, fetchServerTimestamp } from '../../../actions/APIHandler';
import { CreateQuote, FetchProduct } from '../../../actions/InventoryAPI';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import TotalPrice from '../../../assets/total_price.png';
import warningIcon from '../../../assets/warning.gif';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import { InfoMessage, InvalidDate } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { DiscountModal } from '../ViewInvoice/Modals/ModalForm';

import 'react-virtualized-select/styles.css';
import { FetchPrintQuote } from '../../../actions/PartyAPI';
import '../../../hocs/react-select/dist/react-select.css';

let today = new Date();

const EditQuote = ({ user, list, setList, QuoteID }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    const [PartyList, setPartyList] = useState([])
    const [PartyData, setPartyData] = useState()
    const [Subscriber, setSubscriber] = useState(false)
    const [SellInfo, setSellInfo] = useState(null)

    const [Date, setDate] = useState(today)
    const [PartyID, setPartyID] = useState({})
    const [QuoteNo, setQuoteNo] = useState(0)
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
    const [AutoFire, setAutoFire] = useState(0)
    const [kode, setCode] = useState('')
    const [WalkIN, setWalkIN] = useState(false)
    const [DiscModal, setDiscModal] = useState(false)
    const [GrantDisc, setGrantDisc] = useState(false)
    const [Name, setName] = useState('')
    const [Address, setAddress] = useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    let [QuoteData, setQuoteData] = useState([]);
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
    let Count = QuoteData && QuoteData.length;

    useEffect(() => {
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };
    }, [])

    useEffect(() => {
        GetQuoteData();
    }, [])

    useEffect(() => {
        LoadProductItems();
    }, [currentPage]);

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
            SaveQuote(zEvent);
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

    const left_stock = Available - ((parseFloat(UnitQty || 0) * parseFloat(Qty || 0)))
    const availability = left_stock > 0 ? true : false

    const AddRow = (e) => {
        const { Qty, Code } = formData;
        if (!Qty || !Code) {
            setInvalidModalShow(true);
            return;
        }

        if (parseFloat(Qty) > parseFloat(Available)) {
            setInfoModalShow(true);
            return;
        }
        const dataExistsIndex = QuoteData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName && item.Remark === formData.Remark);

        if (dataExistsIndex === -1) {
            if (parseInt(DiscPrct) === 3)
                setQuoteData([...QuoteData, { ...formData, Rate: UnitPrice, Available: left_stock }]);
            else
                setQuoteData([...QuoteData, { ...formData, Available: left_stock }]);
        } else {
            QuoteData[dataExistsIndex].Qty = parseFloat(QuoteData[dataExistsIndex].Qty, 10) + parseFloat(formData.Qty, 10);
            QuoteData[dataExistsIndex].Weight = parseFloat(QuoteData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            QuoteData[dataExistsIndex].SubTotal = parseFloat(QuoteData[dataExistsIndex].SubTotal, 10) + parseFloat(formData.SubTotal, 10);
            QuoteData[dataExistsIndex].Available = parseFloat(QuoteData[dataExistsIndex].Available, 10) - parseFloat(formData.Qty, 10);
            const updatedItem = QuoteData.splice(dataExistsIndex, 1)[0];
            QuoteData.push(updatedItem);
            setQuoteData([...QuoteData]);
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
        if (!FireData.Qty || !FireData.Code) {
            setInvalidModalShow(true);
        } else {
            const dataExistsIndex = QuoteData.findIndex(item => item.Code === FireData.Code && item.UnitName === FireData.UnitName && item.Remark === FireData.Remark);

            if (dataExistsIndex === -1) {
                if (parseInt(DiscPrct) === 3)
                    setQuoteData(prevSellData => [...prevSellData, { ...FireData, Rate: UnitPrice, Available: left_stock }]);
                else
                    setQuoteData(prevSellData => [...prevSellData, { ...FireData, Available: left_stock }]);
            } else {
                QuoteData[dataExistsIndex].Qty = parseFloat(QuoteData[dataExistsIndex].Qty, 10) + parseFloat(FireData.Qty, 10);
                QuoteData[dataExistsIndex].Weight = parseFloat(QuoteData[dataExistsIndex].Weight, 10) + parseFloat(FireData.Weight, 10);
                QuoteData[dataExistsIndex].SubTotal = parseFloat(QuoteData[dataExistsIndex].SubTotal, 10) + parseFloat(FireData.SubTotal, 10);
                QuoteData[dataExistsIndex].Available = parseFloat(QuoteData[dataExistsIndex].Available, 10) - parseFloat(FireData.Qty, 10);
                const updatedItem = QuoteData.splice(dataExistsIndex, 1)[0];
                QuoteData.push(updatedItem);
                setQuoteData([...QuoteData]);
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
        if (!Array.isArray(QuoteData) || !QuoteData.length) return 0.00;
        return QuoteData.reduce((acc, { Qty, Rate }) => acc + Qty * Rate, 0.00);
    };

    const QuantityTotal = Array.isArray(QuoteData) && QuoteData.length ? QuoteData.reduce((total, { Qty }) => total + parseInt(Qty, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(QuoteData) || !QuoteData.length) return;
        setQuoteData([...QuoteData.slice(0, i), ...QuoteData.slice(i + 1)]);
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
        if (e.keyCode === 13) {
            if (PaidFocus.current) {
                e.preventDefault();
                PaidFocus.current.focus();
            }
        }
    }

    const history = useHistory();

    const SaveQuote = async (e) => {
        let VatTotal = (getTotal() * Vat) / 100;
        let GrandTotal = Total === 0 ? getTotal() : Total;
        SaveFocus.current.disabled = true;
        QuoteData = QuoteData.map((item, index) => ({ ...item, SLNo: index + 1 }));
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format("YYYY-MM-DD");
        var result = await CreateQuote(PartyID, Name, Address, data, Vat, VatTotal, Discount, Shipment, GrandTotal, Paid, Due, RefundAmount, Count, QuoteData);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) { updatedState[pair[1].field] = pair[1].message; setError({ ...updatedState }) }
                setList([...list, toastProperties = { id: 1, title: "Invalid Data", description: result.message, backgroundColor: "#f0ad4e", icon: warningIcon }
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
                ClearForm();
                history.goBack()
            }
        } else {
            setList([...list, toastProperties = { id: 1, title: "Error", description: "Failed to save quotation. Please try after some moment.", backgroundColor: "#f0ad4e", icon: errorIcon }]);
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
            setCode(value.Code)
            setAvailable(parseFloat(value.Qty || 0));
            const left_stock = Available - ((parseFloat(UnitQty || 0) * parseFloat(Qty || 0))) > 0 ? true : false

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

    const BarcodeHandler = async (e) => {
        document.activeElement.blur();
        await BarcodeAction(e);
    };

    const EnterKeyEvent = (e) => {
        const value = e.target.value;
        const paddedValue = value.padStart(7, '0').slice(0, 7);
        if (e.keyCode === 13)
            BarcodeAction(paddedValue);
    }

    // const GetPartyData = async () => {
    //     var result = await FetchPartyData(PartyID);
    //     
    //     if (result !== true) {
    //         setPartyData(result);
    //     } else {
    //         history.push('/parties');
    //     }
    // }

    const handleFocus = (e) => setFormData({ ...formData, SubTotal: Rate * Qty });

    const SpecialityData = (e) => {
        let remark = Remark;
        if (DiscPrct === 2 || DiscPrct === 3) {
            const regex = /\(\d+%\)/;
            remark = regex.test(remark) ? remark.replace(regex, `(${e.target.value}%)`) : [remark, `(${e.target.value}%)`].filter(Boolean).join(' ');
        }

        const cases = {
            1: { SubTotal: 0, Remark: "Bonus" },
            2: { SubTotal: (SubTotal - ((SubTotal * e.target.value) / 100)).toFixed(2), Remark: remark },
            3: { SubTotal: UnitPrice * Qty, Remark: remark },
            default: { SubTotal: SubTotal.toFixed(2), Rate: formData.SellPrice, Remark: "N/A" }
        };

        setFormData({ ...formData, ...(cases[DiscPrct] || cases.default) });
    };

    const ClearForm = () => {
        setPartyID({})
        setQuoteData([]);
        setSubscriber(false);
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

    const WalkNParty_Toggle = async (e) => {
        setWalkIN(!WalkIN ? true : false)
        if (e.target.checked) {
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

    let cachedQuoteData;
    const GetQuoteData = async () => {
        let result;
        if (!cachedQuoteData) {
            result = await FetchPrintQuote(QuoteID);

            cachedQuoteData = result;
        } else {
            result = cachedQuoteData;
        }
        if (result !== true) {
            setQuoteData(result.QuoteMapData);
            setName(result.Name)
            setAddress(result.Address)
            setPartyID({ label: result.Name, value: result.PartyID })
            setDate(moment(result.Date, 'YYYY-MM-DD').toDate());
            setQuoteNo(result.QuoteNo)
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

    var h = window.innerHeight - 200;
    const lastRow = QuoteData && QuoteData[QuoteData.length - 1];


    return (
        <div className="row d-flex justify-content-between border-top px-0 h-100 m-0 ce-gradient5" style={{ zIndex: 1 }}>
            <div className="col-lg-8 d-flex flex-wrap justify-content-center ce-gradient5">
                <div className="d-flex py-2 m-0 justify-content-between align-items-top w-100" style={{ zIndex: 1, height: "90px", backgroundColor: "#F4DCC1" }}>
                    <div className="justify-content-center align-items-center border border-2 border-white w-25" style={{ borderRadius: "25px" }}>
                        <p className="display-6 px-2 m-0 text-left text-primary fw-bolder">{"MAKE A QUOTATION"}</p>
                        {/* <p className="fs-6 m-0 text-left text-primary fs-6" style={{ fontFamily: "Scream alt" }}>{"COUNTER " + user.Collocation.CounterNo}</p> */}
                        <p className="fw-bold px-2 text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                    </div>

                    <div className="d-flex justify-content-center align-items-center border border-2 border-white w-25 shadow-lg" style={{ borderRadius: "25px" }}>
                        <img src={TotalPrice} className="img-fluid mb-0" width="43" height="30" alt="avatar" />
                        <div className='row px-2'>
                            <p className="display-4 fw-bolder m-0 text-left text-primary" style={{ fontFamily: "MyriadPro_bold" }}>{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                            <p className="fw-bold text-dark text-left align-self-center m-0" style={{ fontFamily: "MyriadPro_bold" }}> {"TOTAL PRICE"}</p>
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
                            <p className='display-5 align-items-center justify-content-end d-flex bg-gradient bg-success text-white border border-white fw-bold m-0 w-25 px-4 shadow-lg' style={{ borderRadius: "50px" }}>{lastRow?.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}<span className='fs-4'>PGK</span></p>
                        </div>
                    </div>
                }
                {
                    Array.isArray(QuoteData) && QuoteData.length ?
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
                                        <th className="py-1 text-center"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        QuoteData.slice().reverse().map((item, i) => {
                                            const reversedIndex = QuoteData.length - i - 1;
                                            return (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{reversedIndex + 1}</span></td>
                                                    <td className="py-0 px-1 border-right">
                                                        <span className="d-block fw-bold text-left" style={{ lineHeight: "1" }}>{item.label ? item.label : item.Title}</span>
                                                        {item.Remark !== "N/A" ?
                                                            <small className="d-block text-muted text-left" style={{ fontSize: '11px', lineHeight: "1" }}>{item.Remark}</small> : null}
                                                    </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
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
                                                onClick={() => SaveQuote()}
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

                <div className="d-flex justify-content-center align-items-center h-100" style={{ backgroundColor: "#F4DCC1" }}>
                    <form className="row justify-content-center px-2 py-0 m-0 h-100">
                        <div className='justify-content-center align-self-start m-0 p-0'>

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
                                        disabled={Percent ? Percent.operation === 13 ? false : true : true}
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
                                            options={[{ label: "N/A", value: 0 }, { label: "Discount", value: 2 }, ...(PartyData?.IsDispatchable ? [{ label: "Bonus", value: 1 }, { label: "Dispatch", value: 3 }] : [])]}
                                            name="Remark"
                                            placeholder={"Please select product"}
                                            styles={CScolourStyles}
                                            value={{ label: Remark, value: 0 }}
                                            onChange={(e) => RemarkToggle(e)}
                                            isDisabled={!PartyData?.IsDispatchable}
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


                        <div className={`row m-0 p-0 ${WalkIN ? "border border-light rounded" : null}`}>
                            <div className={`d-flex justify-content-around align-items-center h-auto`} style={{ borderRadius: "15px" }}>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="Walk"
                                        name="WalkIN"
                                        checked={WalkIN}
                                        onChange={(e) => WalkNParty_Toggle(e)}
                                    />
                                    <label className="form-check-label" htmlFor="Walk">{WalkIN ? "Party" : "Walk-in"}</label>
                                </div>

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


                            {WalkIN ?
                                <div>
                                    <div className="input-group fs-4 fw-bold p-0">
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
                                </div>
                                :

                                <div className="d-flex py-2 m-0 justify-content-center align-items-top w-100" style={{ backgroundColor: "#F4DCC1", zIndex: 1, height: "90px" }}>
                                    <div className="row justify-content-center p-0">
                                        <input
                                            ref={NameFocus}
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
                                            ref={AddressFocus}
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
    QuoteID: props.match.params.qt_id,
});

export default connect(mapStateToProps, { logout })(EditQuote);