import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { LoadReceipt, findUnique } from '../../../../actions/APIHandler';
import { getLabel } from '../../../../actions/ContractAPI';
import { PaymentTerms } from '../../../../actions/InventoryAPI';
import { FetchPartyInvoices, FetchPrintInvoice } from '../../../../actions/PartyAPI';
import { logout } from '../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import { customHeader, locales } from "../../../Suppliers/Class/datepicker";
import { InvoicePrint } from '../../../Trading/InvoicePrint';
import { CreatePaymentModal } from './Modals/PaymentModal';
import { ReceiptModal } from './Modals/ReceiptModal';
let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const Invoices = ({ PartyID, list, setList, no }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [SearchKey, setSearchKey] = useState(false)
    const [PayTypeFilter, setPayTypeFilter] = useState(false);
    const [PaymentModalShow, setPaymentModalShow] = useState(false)
    const [ReceiptModalShow, setReceiptModalShow] = useState(false)
    const [Item, setItem] = useState(false)
    const [ReceiptLists, setReceiptLists] = useState(false)

    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        InvoiceList();
        setDateTo(today);
    }, [])

    const InvoiceList = async () => {
        setItem(false);
        setPaymentModalShow(false)
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyInvoices(PartyID, date_from, date_to);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchPartyInvoices(PartyID, date_from, date_to);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const PrintPDF = async (e, id) => {
        var result = await FetchPrintInvoice(id);
        if (result !== true)
            InvoicePrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Payment) : null;


    const FilterInvoice = Data?.length && Data?.filter(({ Payment, InvoiceNo, OrderNo }) =>
        (!PayTypeFilter || Payment === PayTypeFilter.value) &&
        (!SearchKey || InvoiceNo === SearchKey.value || OrderNo === SearchKey.value)
    ).map(({ id, Date, OrderNo, InvoiceNo, ItemCount, VatRate, Vat, Shipping, Discount, GrandTotal, Cash, Bank, PaidAmount, Due, Payment, Operator, Status, PaymentStatus, Return, CreditNote }) => ({
        id, Date, OrderNo, InvoiceNo, ItemCount, VatRate, Vat, Shipping, Discount, GrandTotal, Cash, Bank, PaidAmount, Due, Payment, Operator, Status, PaymentStatus, Return, CreditNote
    }));

    const purchaseOptions = FilterInvoice && FilterInvoice.filter(item => item.OrderNo).map(item => ({
        label: item.OrderNo,
        value: item.OrderNo
    }));

    const invoiceOptions = FilterInvoice && FilterInvoice.filter(item => item.InvoiceNo).map(item => ({
        label: item.InvoiceNo,
        value: item.InvoiceNo
    }));

    const LoadReceiptList = async (inv) => {
        const result = await LoadReceipt(inv)
        if (result) {
            setReceiptLists(result)
            setReceiptModalShow(true)
        }
    }

    const handleReceiptClick = (e, item) => {
        if (item.PaymentStatus === 1) {
            if (e.currentTarget.title === 'View Payment') {
                setItem(item);
                LoadReceiptList(item.InvoiceNo)
            } else if (e.currentTarget.title === 'Make Payment') {
                setItem(item);
                setPaymentModalShow(true);
            }
        } else if (item.PaymentStatus === 2) {
            setItem(item);
            LoadReceiptList(item.InvoiceNo)
        } else if (item.PaymentStatus === 3) {
            setItem(item);
            setPaymentModalShow(true);
        }
    };

    const PaymentButton = (item, no) => {
        const status = parseInt(item.PaymentStatus);
        const actionsMap = {
            1: [
                { icon: <i className="fad fa-hand-holding-usd" />, title: 'Make Payment' },

                { icon: <i className="fad fa-receipt" />, title: 'View Payment' },
            ],
            2: [{ icon: <i className="fad fa-receipt" />, title: 'View Payment' }],
            3: [{ icon: <i className="fad fa-hand-holding-usd" />, title: 'Make Payment' }]
        };

        if (no <= 10 && actionsMap[status]) {
            return actionsMap[status].map(({ icon, title }, index) => (
                <button key={index} className="btn px-2 py-0 text-danger" title={title} onClick={(e) => handleReceiptClick(e, item)}>
                    {icon}
                </button>
            ));
        }
        return null;
    };

    var h = window.innerHeight - 290;
    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white py-1 px-0`}>
                <p className='display-6 bg-white fw-bolder m-0 px-2'>Sale Invoices</p>
                <div className="d-flex justify-content-end align-items-center bg-white p-0 w-75">

                    <div className="d-flex justify-content-end mx-2 w-75">
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            // options={Data.map}
                            options={unique && unique.map(item => ({ label: getLabel(item.Payment, PaymentTerms), value: item.Payment }))}
                            defaultValue={{ label: "Select Dept", value: 0 }}
                            name="PayTypeFilter"
                            placeholder={"Payment Filter"}
                            styles={CScolourStyles}
                            value={PayTypeFilter}
                            onChange={(e) => setPayTypeFilter(e)}
                            required
                            id="PayTypeFilter"
                            isClearable={true}
                            isSearchable={true}
                        />
                    </div>
                    <div className="d-flex justify-content-end mx-2 w-75">
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            options={[
                                { label: "Invoices", options: invoiceOptions },
                                { label: "Order No", options: purchaseOptions }
                            ]}
                            defaultValue={{ label: "Select Dept", value: 0 }}
                            name="SearchKey"
                            placeholder={"Search"}
                            styles={CScolourStyles}
                            value={SearchKey}
                            onChange={(e) => setSearchKey(e)}
                            required
                            id="SearchKey"
                            isClearable={true}
                            isSearchable={true}
                            optionLabel="label"
                        />
                    </div>

                    <div className="d-flex justify-content-end mx-2 w-100">
                        <Datepicker
                            selected={DateFrom}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => setDateFrom(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>To</p>
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
                </div>

            </div>
            {
                Array.isArray(FilterInvoice) && FilterInvoice.length ? (
                    // Initial calculation of totals in a single iteration over the array
                    (() => {
                        let totalDiscount = 0,
                            totalShipping = 0,
                            totalGrandTotal = 0,
                            totalCash = 0,
                            totalBank = 0,
                            totalPaidAmount = 0,
                            totalDue = 0,
                            totalItemCount = 0;

                        FilterInvoice.forEach((item) => {
                            totalDiscount += parseFloat(item.Discount || 0);
                            totalShipping += parseFloat(item.Shipping || 0);
                            totalGrandTotal += parseFloat(item.GrandTotal || 0);
                            totalCash += parseFloat(item.Cash || 0);
                            totalBank += parseFloat(item.Bank || 0);
                            totalPaidAmount += parseFloat(item.PaidAmount || 0);
                            totalDue += parseFloat(item.Due || 0);
                            totalItemCount += parseInt(item.ItemCount || 0, 10);
                        });

                        return (
                            <div className="tableFixHead w-100" style={{ height: h + "px" }}>
                                <table className={`table table-hover table-borderless bg-white`}>
                                    <thead className="bg-white">
                                        <tr className="text-center">
                                            <th className="py-1 border-right">
                                                <span>S/N</span>
                                            </th>
                                            <th className="py-1 border-right">
                                                <span>Date</span>
                                            </th>
                                            <th className="py-1 border-right">
                                                <span>Invoice No</span>
                                            </th>
                                            <th className="py-1 border-right">Items</th>
                                            <th className="py-1 border-right">Discount</th>
                                            <th className="py-1 border-right">Shipping</th>
                                            <th className="py-1 border-right">Total</th>
                                            <th className="py-1 border-right">Cash</th>
                                            <th className="py-1 border-right">Bank</th>
                                            <th className="py-1 border-right">Paid</th>
                                            <th className="py-1 border-right">Due</th>
                                            <th className="py-1 border-right">Payment Term</th>
                                            <th className="py-1 border-right">Status</th>
                                            <th className="py-1 text-center">
                                                <span>Action</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FilterInvoice.map((item, i) => (
                                            <tr className="border-bottom text-center fw-bold" key={i}>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold">{i + 1}</span>
                                                </td>
                                                <td className="py-0 px-1 border-right text-nowrap">
                                                    {moment(item.Date).format("DD MMM YY")}
                                                </td>
                                                <td className="py-0 px-1 border-right">{item.InvoiceNo}</td>
                                                <td className="py-0 px-1 border-right">{item.ItemCount}</td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.Discount).toLocaleString("en", {minimumFractionDigits: 2})}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.Shipping).toLocaleString("en", {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.GrandTotal).toLocaleString("en", {
                                                            minimumFractionDigits: 3,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.Cash).toLocaleString("en", {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.Bank).toLocaleString("en", {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.PaidAmount).toLocaleString("en", {
                                                            minimumFractionDigits: 3,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold text-right">
                                                        {parseFloat(item.Due).toLocaleString("en", {
                                                            minimumFractionDigits: 3,
                                                        })}
                                                    </span>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <small className="d-block fw-bold">
                                                        {getLabel(item.Payment, PaymentTerms)}
                                                    </small>{" "}
                                                </td>
                                                <td className="py-0 border-right">
                                                    <span className="d-block fw-bold ">
                                                        {item.Status === 1
                                                            ? "Delivered"
                                                            : item.Status === 2
                                                                ? "Modified"
                                                                : item.Status === 3
                                                                    ? "Deleted"
                                                                    : item.Status === 4
                                                                        ? "Postponed"
                                                                        : "N/A"}
                                                    </span>{" "}
                                                </td>
                                                <td className="p-0 text-nowrap text-left">
                                                    <Link
                                                        className="btn fs-3 px-2 py-0 text-danger"
                                                        to={`/sell_invoice_preview/${item.id}`}
                                                    >
                                                        <i className="fad fa-eye"></i>
                                                    </Link>
                                                    {PaymentButton(item, no)}
                                                    <button
                                                        className="btn fs-3 px-2 py-0 text-danger"
                                                        onClick={(e) => PrintPDF(e, item.id)}
                                                    >
                                                        <i className="fad fa-print"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* Footer */}
                                    <tfoot>
                                        <tr className="fw-bold text-right bg-light fw-bolder">
                                            <td colSpan="3" className="py-1 border-right text-center"> Totals</td>
                                            <td className="py-1 border-right">{totalItemCount}</td>
                                            <td className="py-1 border-right">{totalDiscount.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                            <td className="py-1 border-right">{totalShipping.toLocaleString("en", { minimumFractionDigits: 2 })} </td>
                                            <td className="py-1 border-right">{totalGrandTotal.toLocaleString("en", { minimumFractionDigits: 3 })}</td>
                                            <td className="py-1 border-right">{totalCash.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                            <td className="py-1 border-right">{totalBank.toLocaleString("en", { minimumFractionDigits: 2 })} </td>
                                            <td className="py-1 border-right">{totalPaidAmount.toLocaleString("en", { minimumFractionDigits: 3 })} </td>
                                            <td className="py-1 border-right">{totalDue.toLocaleString("en", { minimumFractionDigits: 3 })}</td>
                                            <td colSpan="3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        );
                    })()
                ) :
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className="fs-2 fw-bold text-center text-success m-0">
                            No invoice has been issued!
                        </p>
                    </div>

            }

            {
                PaymentModalShow ?
                    <CreatePaymentModal
                        list={list}
                        setList={setList}
                        item={Item}
                        show={Item ? PaymentModalShow : false}
                        onReload={() => InvoiceList()}
                        onHide={() => { setItem(false); setPaymentModalShow(false) }}
                    /> : null
            }
            {
                ReceiptModalShow ?
                    <ReceiptModal
                        list={list}
                        setList={setList}
                        item={Item}
                        PaymentList={ReceiptLists}
                        show={Item ? ReceiptModalShow : false}
                        onHide={() => { setItem(false); setReceiptModalShow(false) }}
                    /> : null
            }
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(Invoices);
