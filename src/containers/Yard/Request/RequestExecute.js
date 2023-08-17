import * as moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'react-virtualized-select/styles.css';
import { PaymentTerms } from '../../../actions/InventoryAPI';
import { FetchRequestData, SaveDocket } from '../../../actions/YardAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
// import { DiscountModal } from './../ViewInvoice/Modals/ModalForm';
// import 'react-virtualized/styles.css';
import { getLabel } from '../../../actions/ContractAPI';
import '../../../hocs/react-select/dist/react-select.css';
// import { InvoicePrint } from './../InvoicePrint';

let today = new Date();

const OrderExecute = ({ RequestID, user, list, setList }) => {
    const [NotPayed, setNotPayed] = useState(false);
    const [InvalidModalShow, setInvalidModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [SectorData, setSectorData] = useState(null)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState([])
    let [RequestData, setRequestData] = useState([])
    const [SellInfo, setSellInfo] = useState(null)

    const [Date, setDate] = useState(today)
    const [DeliveryDate, setDeliveryDate] = useState(today)
    const [RequestNo, setRequestNo] = useState(0)
    const [Payment, setPayment] = useState({ label: "COD (Cash on delivery)", value: 12 })
    const [Percent, setPercent] = useState(null)
    const [Vat, setVat] = useState(null)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)
    const [RefundAmount, setRefundAmount] = useState(0.00)
    const [Available, setAvailable] = useState(0)
    const [Status, setStatus] = useState(0)
    const [DiscPrct, setDiscPrct] = useState(0)
    const [SpecialValue, setSpecialValue] = useState(0)
    const [SellWeight, setSellWeight] = useState(0)
    const [AutoFire, setAutoFire] = useState(0)
    const [kode, setCode] = useState('')

    const [SaveGrandTotal, setSaveGrandTotal] = useState(false)
    const [SavePaidAmount, setSavePaidAmount] = useState(false)
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
    const CodeFocus = useRef(null);
    const BarcodeFocus = useRef(null);
    const ProductFocus = useRef(null);
    const WalkInFocus = useRef(null);
    const AddRowFocus = useRef(null);
    const lastEnterPressTime = useRef(null);
    const SaveFocus = useRef(null);
    const discFocus = useRef(null);

    const { Code, Barcode, Title, UnitName, UnitQty, UnitWeight, UnitPrice, Qty, Weight, Rate, Remark, SubTotal } = formData;
    let Count = Array.isArray(RequestData) && RequestData.length;

    useEffect(() => {
        document.addEventListener("keydown", handleShortKey);
        return () => {
            document.removeEventListener("keydown", handleShortKey);
        };

    }, [])

    useEffect(() => {
        GetOrderData();
    }, []);

    useEffect(() => {
        PaidCalc();
    }, [RequestData]);

    useEffect(() => {
        if (GrantDisc && discFocus.current) {
            discFocus.current.focus();
        }
    }, [GrantDisc]);

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
            ExecOrder(zEvent);
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
            // LoadProductItems();
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

    const getTotal = useMemo(() => {
        if (!Array.isArray(RequestData) || !RequestData.length) return 0.00;
        return RequestData.reduce((acc, { ShippedQty, Rate }) => acc + ShippedQty * Rate, 0.00);
    }, [RequestData]);

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

        const dataExistsIndex = RequestData.findIndex(item => item.Code === formData.Code && item.UnitName === formData.UnitName && item.Remark === formData.Remark);
        if (dataExistsIndex === -1) {
            setRequestData([...RequestData, { ...formData, Available: left_stock, ShippedQty: Qty }]);
            if (parseInt(DiscPrct) === 3)
                setRequestData([...RequestData, { ...formData, Rate: UnitPrice, Available: left_stock, ShippedQty: Qty }]);
            else
                setRequestData([...RequestData, { ...formData, Available: left_stock, ShippedQty: Qty }]);
        } else {
            RequestData[dataExistsIndex].ShippedQty = parseFloat(RequestData[dataExistsIndex].ShippedQty, 10) + parseFloat(formData.Qty, 10);
            RequestData[dataExistsIndex].Qty = parseFloat(RequestData[dataExistsIndex].Qty, 10) + parseFloat(formData.Qty, 10);
            RequestData[dataExistsIndex].Weight = parseFloat(RequestData[dataExistsIndex].Weight, 10) + parseFloat(formData.Weight, 10);
            RequestData[dataExistsIndex].SubTotal = parseFloat(RequestData[dataExistsIndex].SubTotal, 10) + parseFloat(formData.SubTotal, 10);
            RequestData[dataExistsIndex].Available = parseFloat(RequestData[dataExistsIndex].Available, 10) - parseFloat(formData.Quantity, 10);
            const updatedItem = RequestData.splice(dataExistsIndex, 1)[0];
            RequestData.push(updatedItem);
            setRequestData([...RequestData]);
        }

        setTotal(0);
        setVat(0);
        setDiscount(Discount);
        setShipment(Shipment);
        setRefundAmount(0.00);
        setSaveChangeAmt(0.00);

        setFormData(initialState);
        setDiscPrct(0)
        DiscountCalc();
        ShipmentCalc();
        PaidCalc();
        setForceRender(!forceRender);
        document.activeElement.blur();
        if (CodeFocus.current) {
            CodeFocus.current.focus();
        }
    }

    const OrderQT = Array.isArray(RequestData) && RequestData.length ? RequestData.reduce((total, { Qty }) => total + parseInt(Qty, 10), 0) : 0;
    const ShippedQT = Array.isArray(RequestData) && RequestData.length ? RequestData.reduce((total, { ShippedQty }) => total + parseInt(ShippedQty, 10), 0) : 0;

    const deleteRow = (i) => {
        if (!Array.isArray(RequestData) || !RequestData.length) return;
        setRequestData([...RequestData.slice(0, i), ...RequestData.slice(i + 1)]);
        setPaid(0.00);
    };

    const receivedAmountHandler = (e) => {
        if (e.keyCode === 13) {
            if (PaidFocus.current) {
                e.preventDefault();
                PaidFocus.current.focus();
            }
        }
    }

    const history = useHistory();

    const ExecOrder = async (e) => {
        let VatTotal = (getTotal * Vat) / 100
        let GrandTotal = (parseFloat(getTotal) + parseFloat(Shipment || 0)) - parseFloat(Discount)
        if (SaveFocus.current)
            SaveFocus.current.disabled = true;
        var ReqData = [];
        for (var i = 0; i < RequestData.length; i++) {
            ReqData.push(RequestData[i]);
            ReqData[i].SLNo = i + 1;
            ReqData[i].Quantity = RequestData[i].ShippedQty;
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format('YYYY-MM-DD')

        var result = await SaveDocket(RequestID, data, GrandTotal, Count, ReqData);
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
                // InvoicePrint(e, result.CallBack, true);
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
        if (CodeFocus.current)
            CodeFocus.current.focus();

        if (SaveFocus.current)
            SaveFocus.current.disabled = false;
    }

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

    const PaidCalc = (e = { target: { value: Paid } }) => {
        const paid = e.target.value;
        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;
        if (paid === '' || regex.test(paid)) {
            setPaid(prevPaid => paid); // using callback form of setPaid
            const subTotal = getTotal;
            const totalWithVat = subTotal + (subTotal * Vat) / 100;
            const disc = (totalWithVat - parseFloat(Discount)) + parseFloat(Shipment);
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

    let cachedOrderData;
    const GetOrderData = async () => {
        let result;
        if (!cachedOrderData) {
            result = await FetchRequestData(RequestID);
            cachedOrderData = result;
        } else {
            result = cachedOrderData;
        }
        if (result !== true) {
            setRequestData(result.RequestDataMap);
            setSectorData(result.SectorData)
            setStatus(result.SectorData.Status)
            setDate(moment(result.SectorData.Date, 'YYYY-MM-DD').toDate());
            setDeliveryDate(moment(result.SectorData.DeliveryDate, 'YYYY-MM-DD').toDate());
            setRequestNo(result.SectorData.RequestNo)
            setPayment({ label: getLabel(result.SectorData.Payment, PaymentTerms), value: result.SectorData.Payment })
            setVat(result.SectorData.Vat || 0.00)
            setDiscount(result.SectorData.Discount || 0.00)
            setShipment(result.SectorData.Shipping || 0.00)
            setPaid(result.SectorData.PaidAmount || 0.00)
            setDue(result.SectorData.GrandTotal || 0.00)
            setRefundAmount(result.SectorData.RefundAmount)
        } else {
            history.goBack();
        }
    }

    const handleShipmentChange = (index, event) => {
        const newRequestData = [...RequestData];
        const prevValue = newRequestData[index].ShippedQty;
        const currentValue = Math.floor(+event.target.value || 1);
        if (prevValue !== currentValue) {
            const { Rate, UnitWeight } = RequestData[index];
            newRequestData[index].ShippedQty = currentValue;
            newRequestData[index].Available = newRequestData[index].Available + prevValue - currentValue;
            newRequestData[index].SubTotal = currentValue * Rate;
            newRequestData[index].Weight = currentValue * UnitWeight;
            setRequestData(newRequestData);
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

    var h = window.innerHeight - 200;

    return (
        <div className="row d-flex m-0">
            <div className="d-flex py-2 m-0 justify-content-between align-items-center" style={{ zIndex: 1, backgroundColor: "#F4DCC1" }}>
                <div className="justify-content-center align-items-center w-25">
                    <p className="display-6 m-0 text-left text-primary fw-bolder">{"REQUEST EXECUTE"}</p>
                    <p className="fw-bold text-dark text-left align-self-center m-0" ><i className="fad fa-user-clock text-center"></i> {user.Name}</p>
                </div>

                <div className="justify-content-center align-items-center border border-2 border-white w-75 shadow-lg flex-column" style={{ borderRadius: "25px" }}>
                    {/* First row */}
                    <div className="row">
                        <div className="col-md-6 d-flex justify-content-center align-items-center p-1">
                            <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>Requested By: </p>
                            <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>{SectorData?.RequestedID?.Title}</p>
                            <small className="d-block text-right fw-bolder">({SectorData?.RequestedID?.SectorTitle})</small>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center p-1">
                            <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>Requested For: </p>
                            <p className="text-center fs-4 text-dark fw-bold m-0 border-bottom px-2" style={{ whiteSpace: 'nowrap' }}>{SectorData?.RequestForID?.Title}</p>
                            <small className="d-block text-right fw-bolder">({SectorData?.RequestForID?.SectorTitle})</small>
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="d-flex justify-content-center align-items-center">
                        <div className='fs-6 fw-bold justify-content-center'>
                            <span>Order Date: <span>{moment(Date).format("DD MMM YYYY")}</span> </span>,
                            &nbsp;
                            <span>Delivery Date: <span>{moment(DeliveryDate).format("DD MMM YYYY")}</span> </span>,
                            &nbsp;
                            <span>Request No: <span>{RequestNo}</span> </span>
                        </div>
                    </div>
                </div>


            </div>
            <div className="row d-flex justify-content-between border-top px-0 h-100 m-0 ce-gradient5" style={{ zIndex: 1 }}>

                <div className="d-flex flex-wrap justify-content-center">
                    {
                        Array.isArray(RequestData) && RequestData.length ?
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
                                            RequestData.slice().reverse().map((item, i) => {
                                                const reversedIndex = RequestData.length - i - 1;
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
                                            <td className="p-1"><span className="d-block text-right fw-bold">{Paid !== 0 && Due !== 0 ? "Due: " : RefundAmount !== 0 && Paid !== 0 ? "Change: " : RefundAmount === 0 && Due === 0 ? "Paid: " : Due ? "Due: " : "N/A"}</span> </td>
                                            <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal.toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal === Paid ? 0.00 : Due === 0.00 ? parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="px-3 py-0" colSpan="3">
                                                {Status === 1 ?
                                                    <button className="btn fs-3 py-1 fad fa-paper-plane text-success"
                                                        onClick={() => ExecOrder()}
                                                    /> : Status === 2 ?
                                                        <button className="btn fs-3 py-1 fad fa-truck-couch text-success"
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
            </div >
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    RequestID: props.match.params.id,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(OrderExecute);