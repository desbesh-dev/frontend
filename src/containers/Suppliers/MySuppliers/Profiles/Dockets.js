import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { LoadPaymentVoucher, findUnique } from '../../../../actions/APIHandler';
import { getLabel } from '../../../../actions/ContractAPI';
import { PaymentTerms } from '../../../../actions/InventoryAPI';
import { FetchDocketList, FetchPurchaseInvoice } from '../../../../actions/SuppliersAPI';
import { logout } from '../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import { customHeader, locales } from "../../Class/datepicker";
import { UpdatePurchaseInvoice } from './Modals/ModalForm';
import { PaymentListModal } from './Modals/PaymentListModal';
import { CreatePaymentModal } from './Modals/PaymentModal';
import { InvoicePrint } from './ViewInvoice/InvoicePrint';

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const Dockets = ({ user, PartyID, SupplierID, id, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [PayTypeFilter, setPayTypeFilter] = useState(false);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [SearchKey, setSearchKey] = useState(false)
    const [Item, setItem] = useState(false)
    const [UpdateItem, setUpdateItem] = useState(false)
    const [UpdateModalShow, setUpdateModalShow] = useState(false)
    const [PaymentModalShow, setPaymentModalShow] = useState(false)
    const [ReceiptModalShow, setReceiptModalShow] = useState(false)
    const [PaymentLists, setPaymentLists] = useState(false)

    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        DocketList();
        setDateTo(today);
    }, [])

    const DocketList = async () => {
        setItem(false);
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchDocketList(SupplierID, date_from, date_to);

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
            var result = await FetchDocketList(SupplierID, date_from, date_to);

            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const PrintPDF = async (e, id) => {
        var result = await FetchPurchaseInvoice(id);
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

    const FilterInvoice = Data.length && Data?.filter(({ Payment, DocketNo, PurchaseNo }) =>
        (!PayTypeFilter || Payment === PayTypeFilter.value) &&
        (!SearchKey || DocketNo === SearchKey.value || PurchaseNo === SearchKey.value)
    ).map(({ id, InvDate, RcvDate, OrderNo, PurchaseNo, InvoiceNo, DocketNo, Count, VatRate, Vat, Discount, GrandTotal, PaidAmount, Due, Payment, Receiver, Status, PaymentStatus }) => ({
        id, InvDate, RcvDate, OrderNo, PurchaseNo, InvoiceNo, DocketNo, Count, VatRate, Vat, Discount, GrandTotal, PaidAmount, Due, Payment, Receiver, Status, PaymentStatus
    }));

    const purchaseOptions = FilterInvoice && FilterInvoice.filter(item => item.PurchaseNo).map(item => ({
        label: item.PurchaseNo,
        value: item.PurchaseNo
    }));

    const invoiceOptions = FilterInvoice && FilterInvoice.filter(item => item.DocketNo).map(item => ({
        label: item.DocketNo,
        value: item.DocketNo
    }));

    const LoadReceiptList = async (inv) => {
        const result = await LoadPaymentVoucher(inv)
        if (result) {
            setPaymentLists(result)
            setReceiptModalShow(true)
        }
    }

    const handleReceiptClick = (e, item) => {
        if (item.PaymentStatus === 1) {
            if (e.currentTarget.title === 'View Payment') {
                setItem(item);
                LoadReceiptList(item.PurchaseNo);
                setReceiptModalShow(true);
            } else if (e.currentTarget.title === 'Make Payment') {
                setItem(item);
                setPaymentModalShow(true);
            }
        } else if (item.PaymentStatus === 2) {
            setItem(item);
            LoadReceiptList(item.PurchaseNo);
            setReceiptModalShow(true);
        } else if (item.PaymentStatus === 3) {
            setItem(item);
            setPaymentModalShow(true);
        }
    };

    const renderPaymentButtons = (item) => {
        switch (parseInt(item.PaymentStatus)) {
            case 1:
                return (
                    <>
                        <button className="btn px-2 py-0 text-danger" title='View Payment' onClick={(e) => handleReceiptClick(e, item)}>
                            <i className="fad fa-receipt"></i>
                        </button>
                        <button className="btn px-2 py-0 text-danger" title='Make Payment' onClick={(e) => handleReceiptClick(e, item)}>
                            <i className="fad fa-hand-holding-usd"></i>
                        </button>
                    </>
                );
            case 2:
                return (
                    <button className="btn px-2 py-0 text-danger" title='View Payment' onClick={(e) => handleReceiptClick(e, item)}>
                        <i className="fad fa-receipt"></i>
                    </button>
                );
            case 3:
                return (
                    <button className="btn px-2 py-0 text-danger" title='Make Payment' onClick={(e) => handleReceiptClick(e, item)}>
                        <i className="fad fa-hand-holding-usd"></i>
                    </button>
                );
            default:
                return null;
        }
    };

    var h = window.innerHeight - 246;

    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white my-1 p-0`}>
                <p className='display-6 bg-white text-nowrap fw-bolder m-0 px-1'>Purchase Dockets</p>
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
                                { label: "Dockets", options: invoiceOptions },
                                { label: "Purchase No", options: purchaseOptions }
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
                Array.isArray(FilterInvoice) && FilterInvoice.length ?
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless text-nowrap bg-white`}>
                            <thead className='bg-white'>
                                <tr className="text-center">
                                    <th className="py-1 border-right"><span>S/N</span></th>
                                    <th className="py-1 border-right"><span>Invoice Date</span></th>
                                    <th className="py-1 border-right"><span>Recieved Date</span></th>
                                    <th className="py-1 border-right">Purchase No</th>
                                    <th className="py-1 border-right"><span>Docket No</span></th>
                                    <th className="py-1 border-right">Items</th>
                                    {/* <th className="py-1 border-right">Vat Rate</th>
                                    <th className="py-1 border-right">Vat Total</th> */}
                                    <th className="py-1 border-right">Discount</th>
                                    <th className="py-1 border-right">Total</th>
                                    <th className="py-1 border-right">Paid</th>
                                    <th className="py-1 border-right">Due</th>
                                    <th className="py-1 border-right">Payment Term</th>
                                    <th className="py-1 text-center"><span>Action</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    FilterInvoice.map((item, i) => (
                                        <tr className="border-bottom text-center fw-bold" key={i}>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                            <td className="py-0 px-1 border-right text-nowrap">{moment(item.InvDate).format("DD MMM YY")}</td>
                                            <td className="py-0 px-1 border-right text-nowrap">{moment(item.RcvDate).format("DD MMM YY")}</td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold">{item?.PurchaseNo}</span> </td>
                                            <td className="py-0 px-1 border-right">{item.DocketNo}</td>
                                            <td className="py-0 px-1 border-right">{item.Count}</td>
                                            {/* <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.VatRate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.Vat).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                            <td className="py-0 border-right"><small className="d-block fw-bold">{getLabel(item.Payment, PaymentTerms)}</small> </td>
                                            <td className="p-0 text-nowrap">
                                                <Link className="btn px-2 py-0 text-danger" title="View Details" to={`/purs_invoice_preview/${item.id}`}><i className="fad fa-eye"></i></Link>
                                                {item.InvoiceNo === "" ?
                                                    <>
                                                        <button className="btn px-2 py-0 text-danger" title="Update" onClick={(e) => { setUpdateItem(item); setUpdateModalShow(true) }}><i className="fab fa-pushed"></i></button>
                                                        <Link className="btn px-2 py-0 text-danger" title="Add Docket" to={`/add_docket/${item.id}`}><i className="fad fa-sign-in-alt" style={{ transform: "rotate(90deg)" }}></i></Link>
                                                    </>
                                                    : null
                                                }
                                                <button className="btn px-2 py-0 text-danger" title="Print View" onClick={(e) => PrintPDF(e, item.id)}><i className="fad fa-print"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className='fs-2 fw-bold text-center text-success m-0'>No Invoice Found!</p>
                    </div>
            }
            {
                Item &&
                <CreatePaymentModal
                    list={list}
                    setList={setList}
                    item={Item}
                    show={Item && PaymentModalShow}
                    onReload={() => DocketList()}
                    onHide={() => { setItem(false); setPaymentModalShow(false) }}
                />
            }
            {
                UpdateItem &&
                <UpdatePurchaseInvoice
                    list={list}
                    setList={setList}
                    item={UpdateItem}
                    show={UpdateItem && UpdateModalShow}
                    onReload={() => DocketList()}
                    onHide={() => { setItem(false); setUpdateModalShow(false) }}
                />
            }
            {
                ReceiptModalShow &&
                <PaymentListModal
                    list={list}
                    setList={setList}
                    item={Item && ReceiptModalShow}
                    PaymentList={PaymentLists}
                    show={ReceiptModalShow}
                    onHide={() => { setItem(false); setReceiptModalShow(false) }}
                />
            }
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Dockets);