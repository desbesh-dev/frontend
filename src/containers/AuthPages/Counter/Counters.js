import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { CounterVoucherSave, LoadCounter, findUnique } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { customHeader, locales } from "../../../hocs/Class/datepicker";
import { CreateMessage } from '../ModalForm';
import RangeSlider from './RangeSlider';
import { SaleReportPDF } from './SaleReportPDF';
import { SaleReportReceipt } from './SaleReportReceipt';
let today = new Date();

const Counters = ({ list, setList, user, scale, no }) => {
    const [Data, setData] = useState(null)
    const [Payment, setPayment] = useState(0.00)
    const [Error, setError] = useState(false)
    const dispatch = useDispatch();
    const [SectorFilter, setSectorFilter] = useState(null);
    const [SisterFilter, setSisterFilter] = useState(null);
    const [ModeFilter, setModeFilter] = useState({ label: "Both (Walk-in & Party)", value: 3 });
    const [SearchKey, setSearchKey] = useState({ min: 1, max: 50 })
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(today);
    const [VoucherItem, setVoucherItem] = useState(false);
    const [VoucherModal, setVoucherModal] = useState(false);
    const [locale, setLocale] = useState('en');
    let toastProperties = null;

    useEffect(() => {
        Counters();
    }, [ModeFilter])

    const Counters = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setVoucherItem(false);
        setVoucherModal(false);
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        var result = await LoadCounter(date_from, date_to, ModeFilter.value);
        setData(result.Counters);
        setPayment(result.Payment)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime()) {
            setDateTo(e);
        } else {
            date_from = moment(e).format("YYYY-MM-DD");
            setDateFrom(e);
            setDateTo(e);
        }
        var result = await LoadCounter(date_from, date_to, ModeFilter.value);
        setData(result.Counters);
        setPayment(result.Payment)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.SisterTitle) : null;
    const sisterOptions = unique?.map(({ SisterTitle, ShortCode }) => ({
        label: SisterTitle,
        value: ShortCode
    })) ?? [];

    const FilterCounter = Data?.length && Data.filter(({ ShortCode, SectorID, No }) =>
        (!SisterFilter || ShortCode === SisterFilter.value) && (!SectorFilter || SectorID === SectorFilter.value) &&
        (!SearchKey || (No >= SearchKey.min && No <= SearchKey.max))
    ).map(({ id, StaffID, No, Category, SectorID, SisterTitle, ShortCode, SectorTitle, total_grand, Name, Designation, Nationality, LastLogin, avatar }) => ({
        id, StaffID, No, Category, SectorID, SisterTitle, ShortCode, SectorTitle, total_grand, Name, Designation, Nationality, LastLogin, avatar
    }));

    let unique_sectors = Array.isArray(FilterCounter) && FilterCounter.length ? findUnique(FilterCounter, d => d.SectorTitle) : null;
    const sectorOptions = unique_sectors?.map(({ SectorTitle, SectorID }) => ({
        label: SectorTitle,
        value: SectorID
    })) ?? [];

    const { Count = 0, Sub = 0, Cost = 0, GrandTotal = 0, Vat = 0, Discount = 0, Shipping = 0, PaidAmount = 0, Due = 0, RefundAmount = 0, RefundCost = 0, Revenue = (GrandTotal - RefundAmount) - (Cost - RefundCost), Bank = 0, Cash = 0 } = Array.isArray(FilterCounter)
        ? FilterCounter.reduce((acc, cur) => {
            return {
                Count: acc.Count + cur.total_grand.Count,
                Sub: acc.Sub + (cur.total_grand.Sub || 0),
                Cost: acc.Cost + (cur.total_grand.Cost || 0),
                GrandTotal: acc.GrandTotal + (cur.total_grand.GrandTotal || 0),
                Vat: acc.Vat + (cur.Vat || 0),
                Discount: acc.Discount + (cur.total_grand.Discount || 0),
                Shipping: acc.Shipping + (cur.total_grand.Shipping || 0),
                PaidAmount: acc.PaidAmount + (cur.total_grand.PaidAmount || 0),
                Bank: acc.Bank + (cur.total_grand.Bank || 0),
                Cash: acc.Cash + (cur.total_grand.Cash || 0),
                Due: acc.Due + (cur.total_grand.Due || 0),
                RefundAmount: acc.RefundAmount + (cur.total_grand.RefundAmount || 0),
                RefundCost: acc.RefundCost + (cur.total_grand.ReturnAmountCost || 0)
            };
        }, { Count: 0, Sub: 0, Cost: 0, GrandTotal: 0, Vat: 0, Discount: 0, Shipping: 0, PaidAmount: 0, Due: 0, RefundAmount: 0, RefundCost: 0, Bank: 0, Cash: 0 }) : { Count: 0, Sub: 0, Cost: 0, GrandTotal: 0, Vat: 0, Discount: 0, Shipping: 0, PaidAmount: 0, Due: 0, RefundAmount: 0, RefundCost: 0, Revenue: 0, Bank: 0, Cash: 0 };

    var h = window.innerHeight - 230;

    const CounterVoucher = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        setVoucherItem(item);
        setVoucherModal(true);
    }

    const SaveVoucher = async () => {
        const data = moment(DateTo).format('YYYY-MM-DD');
        let totalGrand = VoucherItem.total_grand;
        let vla = {};

        // Fill the object based on the conditions
        if (totalGrand.Cash) vla.Cash = totalGrand.Cash;
        if (totalGrand.Bank) vla.Bank = totalGrand.Bank;

        // Calculate 'Sell' only once
        let cash = parseFloat(totalGrand.Cash || 0);
        let bank = parseFloat(totalGrand.Bank || 0);
        if (cash || bank) vla.Sell = cash + bank;

        const result = await CounterVoucherSave(data, vla, VoucherItem.No, totalGrand.GrandTotal, VoucherItem.id);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
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
                Counters();
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: "Failed to save voucher. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }

    const extra = { FromDate: DateFrom, ToDate: DateTo, SisterFilter, SectorFilter, SearchKey, ModeFilter, Counter: FilterCounter?.length, Count, Sub, Cost, GrandTotal, Vat, Discount, Shipping, PaidAmount, Due, RefundAmount, RefundCost, Revenue, Bank, Cash, Payment: SearchKey.min === 1 ? Payment : 0 }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center m-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/counter_list">Counters</Link></li>
                    </ol>
                </nav>

                <p className="display-6 d-flex justify-content-center">Counters</p>
            </div>

            <div className="col-lg-11 h-100 p-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">
                    <div className="d-flex justify-content-around align-items-center bg-white p-0">
                        {no <= 7 && [
                            {
                                label: "Sister Filter",
                                options: sisterOptions,
                                value: SisterFilter,
                                onChange: (e) => setSisterFilter(e),
                                id: "Sister"
                            },
                            {
                                label: "Sector Filter",
                                options: sectorOptions,
                                value: SectorFilter,
                                onChange: (e) => setSectorFilter(e),
                                id: "Sector"
                            }
                        ].map(({ label, options, value, onChange, id }, index) => (
                            <div key={index} className="d-flex justify-content-center mx-2 w-25">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={options}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Division"
                                    placeholder={label}
                                    styles={CScolourStyles}
                                    value={value}
                                    onChange={onChange}
                                    required
                                    id={id}
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>
                        ))}
                        <div className="d-flex justify-content-center mx-2 w-25">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={[{ value: 1, label: "Walk-in" }, { value: 2, label: "Parties" }, { value: 3, label: "Both" },]}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder="Mode"
                                styles={CScolourStyles}
                                value={ModeFilter}
                                onChange={(e) => setModeFilter(e)}
                                required
                                id='ModeFilter'
                                isClearable={false}
                                isSearchable={false}
                            />
                        </div>
                        <div className="d-flex justify-content-end mx-2 w-25">
                            <RangeSlider min={0} max={50} value={50} onChange={(e) => setSearchKey(e)} />
                        </div>
                        <div className="d-flex justify-content-end mx-2">
                            <Datepicker
                                selected={DateFrom}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => setDateFrom(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                            <p className='fw-bold text-success my-auto px-1 mx-1' title="Search">To</p>
                            <Datepicker
                                selected={DateTo}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => DateHandler(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                        </div>
                        <button className='btn border-left fs-5' title="Print sale report" onClick={(e) => SaleReportReceipt(e, FilterCounter, user, extra)}><i className="fad fa-receipt"></i></button>
                        <button className='btn fs-5' title="Print sale report" onClick={(e) => SaleReportPDF(e, FilterCounter, user, extra)}><i className="fad fa-print"></i></button>
                    </div>
                </div>
                <div className="row d-flex mx-auto my-2 py-1 border" style={{ borderRadius: "15px" }}>
                    <div className="d-flex justify-content-around p-0">
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}><i className="fal fa-desktop"></i>  {FilterCounter?.length} Counter</p>

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Invoice: <span className='fw-bolder'>{parseInt(Count).toLocaleString('en-PG', { minimumFractionDigits: 0 })}</span></p>

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Sale: <span className='fw-bolder'>{parseFloat(GrandTotal).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Discount: <span className='fw-bolder'>{parseFloat(Discount).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Refund: <span className='fw-bolder'>{parseFloat(RefundAmount || 0.00).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                        {
                            parseInt(ModeFilter?.value) !== 1 &&
                            <>
                                <div className="cs_outer m-0" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                                <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Due: <span className='fw-bolder'>{parseFloat(Due).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                            </>
                        }

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Cash: <span className='fw-bolder'>{parseFloat(Cash).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                        <div className="cs_outer m-0" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                        <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>E-POS: <span className='fw-bolder'>{parseFloat(Bank).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                        {SearchKey.min === 1 ?
                            <>
                                <div className="cs_outer m-0" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                                <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Payment: <span className='fw-bolder'>{parseFloat(Payment || 0.00).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>

                                <div className="cs_outer m-0" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                                <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Liquid: <span className='fw-bolder'>{parseFloat(PaidAmount + Payment).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>
                            </>
                            :
                            <>
                                <div className="cs_outer m-0" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                                <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Liquid: <span className='fw-bolder'>{parseFloat(PaidAmount).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>
                            </>
                        }

                        {no <= 2 && <>
                            <div className="cs_outer m-0" style={{ height: "100%" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Cost: <span className='fw-bolder'>{parseFloat(Cost).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>
                            <div className="cs_outer m-0" style={{ height: "100%" }}>
                                <div className="cs_inner"></div>
                            </div>
                            <p className='text-dark fw-bold m-0 px-2 text-uppercase' style={{ borderRadius: "15px" }}>Revenue: <span className='fw-bolder'>{parseFloat(Revenue).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</span></p>
                        </>
                        }
                    </div>
                </div>
                <div className="position-absolute overflow-auto mx-auto w-100" style={{ height: h + "px" }}>
                    <div id="products" className="row view-group justify-content-center m-0 p-0">
                        {
                            FilterCounter?.map((item, i) => (
                                <div className={"item col-xs-3 col-lg-3 grid-group-item mb-3"} key={i}>
                                    <Link to={`/counter_sale_report/${item.No}/${moment(DateFrom).format("YYYY-MM-DD")}/${moment(DateTo).format("YYYY-MM-DD")}`}
                                        className="justify-content-center align-items-center box thumbnail card p-0 shadow-none m-0 h-100 py-2">
                                        <div className="img-event d-flex justify-content-around align-items-center border border-info w-100 py-3">
                                            <img
                                                src={process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid rounded-circle" alt="avatar"
                                                style={{ width: "7vh", height: "7vh" }} />
                                            <div className="cs_outer m-0" style={{ height: "100%" }}>
                                                <div className="cs_inner"></div>
                                            </div>
                                            <i className="display-3 fal fa-desktop"></i>
                                        </div>

                                        <div className="caption card-body d-flex flex-column p-0 h-100 w-100 m-0">
                                            <div className="group inner list-group-item-text fs-5 m-0 justify-content-center">
                                                <div className='bg-warning text-center'>
                                                    <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0 bg-warning text-center text-light" style={{ fontFamily: "Scream alt" }}>{"COUNTER " + item.No}</p>
                                                    <small className="text-center text-white m-0">{item.id}</small>
                                                </div>
                                                <p className="fs-5 fw-bold m-0 text-muted text-center">{item.Category === 1 ? "Retail" : item.Category === 2 ? "Wholesale" : parseInt(item.Category) === 3 ? "Retail & Wholesale" : "None"}</p>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="fs-5 fw-bold text-dark m-0">Invoice:</p>
                                                    <small className="fs-5 fw-bolder text-dark">{parseInt(item.total_grand.Count).toLocaleString('en-PG')}</small>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="fs-5 fw-bold text-dark m-0">Sale:</p>
                                                    <small className="fs-5 fw-bolder text-dark">{parseFloat(item.total_grand.GrandTotal).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="fs-5 fw-bold text-dark m-0">Discount:</p>
                                                    <small className="fs-5 fw-bolder text-dark">{parseFloat(item.total_grand.Discount).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>

                                                {parseInt(ModeFilter?.value) !== 1 &&
                                                    <div className='d-flex justify-content-between align-items-center px-2'>
                                                        <p className="text-dark m-0">Due:</p>
                                                        <small className="fw-bold fs-5 text-dark">{parseFloat(item.total_grand.Due).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                    </div>

                                                }
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="text-dark m-0">Cash:</p>
                                                    <small className="fw-bold fs-5 text-dark">{parseFloat(item.total_grand.Cash).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="text-dark m-0">E-POS:</p>
                                                    <small className="fw-bold fs-5 text-dark">{parseFloat(item.total_grand.Bank).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="text-dark m-0">Refund:</p>
                                                    <small className="fw-bold fs-5 text-dark">{parseFloat(item.total_grand.RefundAmount).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center px-2'>
                                                    <p className="text-dark m-0">Liquid:</p>
                                                    <small className="fw-bold fs-5 text-dark">{parseFloat(item.total_grand.PaidAmount).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                </div>
                                                {no <= 2 &&
                                                    <>
                                                        <div className='d-flex justify-content-between align-items-center px-2 border-bottom'>
                                                            <p className="fs-5 fw-bold text-dark m-0">Cost:</p>
                                                            <small className="fs-5 fw-bolder text-dark">{parseFloat(item.total_grand.Cost).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                        </div>
                                                        <div className='d-flex justify-content-between align-items-center px-2'>
                                                            <p className="fs-5 fw-bold text-success m-0">Revenue:</p>
                                                            <small className="fs-5 fw-bolder text-success">{((parseFloat(item.total_grand.GrandTotal) - parseFloat(item.total_grand.RefundAmount)) - parseFloat(item.total_grand.Cost)).toLocaleString('en-PG', { minimumFractionDigits: 2, style: 'currency', currency: 'PGK' })}</small>
                                                        </div>
                                                    </>
                                                }

                                                <br />
                                                <div className='row text-right px-2 m-0'>
                                                    <small className="fw-bold text-muted m-0"><i className="fad fa-user-clock"></i> {item.Name ? item.Name : "No Name"}</small>
                                                    <small className="fw-bold text-muted m-0"> <i className="fad fa-history"></i> {moment(item.LastLogin).format("DD MMM YYYY | hh:mm:ss A")}</small>
                                                    {item.total_grand.GrandTotal > 0 && ModeFilter.value === 1 ?
                                                        <button className='btn btn-outline-success border border-light py-0' onClick={(e) => CounterVoucher(e, item)}>Voucher</button>
                                                        : item.total_grand.GrandTotal <= 0 ? <p className='border-top text-center'>Product not sold out</p> : <p className='border-top text-center'>Select 'Walk-in' mode for creating voucher</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </Link>

                                </div>

                            )) ??
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-2 fw-bold text-success m-0'>No counter found!</p>
                            </div>
                        }

                    </div>
                </div>
                {
                    VoucherItem ?
                        <CreateMessage
                            header="Generating Counter Voucher"
                            body_header={`This process generate a sale voucher for counter ${VoucherItem.No}?`}
                            // body={`The total sale of K${VoucherItem.total_grand.GrandTotal} will credit K${VoucherItem.total_grand.Cash} to cash and debit K${VoucherItem.total_grand.Bank} to the bank`}
                            body={`The total sale of K${VoucherItem.total_grand.GrandTotal} will credit ${VoucherItem.total_grand.Cash !== 0 && VoucherItem.total_grand.Bank !== 0
                                ? `K${VoucherItem.total_grand.Cash} to cash and debit K${VoucherItem.total_grand.Bank} to the bank`
                                : VoucherItem.total_grand.Cash !== 0 && VoucherItem.total_grand.Bank === 0
                                    ? `& K${VoucherItem.total_grand.Cash} debit to the cash` :
                                    VoucherItem.total_grand.Bank !== 0
                                        ? `& K${VoucherItem.total_grand.Bank} debit to the bank`
                                        : ''
                                }`}
                            show={VoucherItem ? VoucherModal : false}
                            Click={(e) => SaveVoucher(e)}
                            onHide={() => { setVoucherItem(false); setVoucherModal(false) }}
                        />
                        : null}
            </div >
        </div >
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(Counters);