import axios from 'axios';
import * as moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { DispatchInvoiceDelete, getLabel } from '../../../actions/ContractAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';

import Datepicker from 'react-datepicker';
import { PaymentTerms } from '../../../actions/InventoryAPI';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

import VirtualizedSelect from "react-virtualized-select";
import 'react-virtualized-select/styles.css';
// import 'react-virtualized/styles.css';
import { FetchPrintInvoice } from '../../../actions/PartyAPI';
import { Pagination } from '../../../containers/Inventory/SellReport/SellReportPagination';
import '../../../hocs/react-select/dist/react-select.css';
import { Receipt } from '../CounterReceipt';
import { InvoicePrint } from '../InvoicePrint';

let today = new Date();
const CounterSellReport = ({ user, list, setList, no, counter_no, date_from = today, date_to = today }) => {
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [DateFrom, setDateFrom] = useState(date_from)
    const [DateTo, setDateTo] = useState(date_to)
    const [Data, setData] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [StockItem, setStockItem] = useState(false)

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const [ReturnFilter, setReturnFilter] = useState(null)
    const [SearchKey, setSearchKey] = useState(null)

    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchData = useCallback(async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        setData(false);
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sell_report/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            params: {
                date_from: moment(DateFrom).format("YYYY-MM-DD"),
                date_to: moment(DateTo).format("YYYY-MM-DD"),
                page: currentPage,
                page_size: itemsPerPage,
                counter: counter_no,
                invoice_no: SearchKey?.value,
            },
        });
        setData(res.data);
        setLoading(false);
    }, [DateTo, currentPage, SearchKey]);

    useEffect(() => {
        fetchData(Date);
    }, [fetchData]);

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

    const DeleteInvoice = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DispatchInvoiceDelete(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Invoice',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                fetchData(Date);
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to delete invoice. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const handlePageChange = (pageNumber) => {
        setSearchKey(false);
        setCurrentPage(pageNumber);
    };

    const GetInvoiceData = async (e, item) => {
        var result = await FetchPrintInvoice(item.id);
        if (result !== true) {
            if (item.PartyID)
                InvoicePrint(e, result, false)
            else
                Receipt(e, result, false, true);
        }
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    var h = window.innerHeight - 165;
    
    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">
                {/* ORDER HISTORY */}
                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">
                    <div className="d-flex justify-content-around align-items-center bg-white p-0">
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap my-0 px-2'>SALE REPORTS</p>
                        <p className='text-dark fw-bold m-0 px-2' style={{ borderRadius: "15px" }}>Invoice: <span className='fw-bolder'>{Data?.count}</span></p>
                        <div className="d-flex justify-content-end mx-2 w-25">
                            <VirtualizedSelect
                                style={{
                                    borderRadius: '25px',
                                    border: '1px solid #fff', // optional border styling
                                    backgroundColor: '#F4F7FC'
                                }}
                                menuContainerStyle={{
                                    borderRadius: '10px',
                                    maxHeight: 'none', // removes the maximum height
                                    overflowY: 'visible' // allows the dropdown to expand beyond the visible area
                                }}
                                options={Data.Invoice}
                                name="InvoiceNo"
                                menuBuffer={100}
                                required
                                id="InvoiceNo"
                                value={SearchKey}
                                optionLabel="combinedLabel"
                                onChange={(e) => { setSearchKey(e); setCurrentPage(1) }}
                            />
                        </div>
                        <div className="d-flex justify-content-end mx-2 w-25">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                // options={Data.map}
                                options={[{ label: "Returned Invoice", value: true }, { label: "All Invoice", value: null }]}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Type"
                                placeholder={"Return Filter"}
                                styles={CScolourStyles}
                                value={ReturnFilter}
                                onChange={(e) => setReturnFilter(e)}
                                required
                                id="Type"
                                isClearable={true}
                                isSearchable={true}
                            />
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

                {Data?.results?.length ? (
                    <>
                        <div className='tableFixHead w-100 bg-white' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless text-nowrap`}>
                                <thead>
                                    <tr className="text-center">
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Date</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Invoice No</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Items</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Discount</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Amount</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Bank</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Cash</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Total</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-primary text-uppercase p-0">Due</span>/<span className="fs-6 fw-bolder text-danger text-uppercase p-0">CNG</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Party</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pay Type</span></th>
                                        <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Data.results.map((item, i) => {
                                        const { Date, InvoiceNo, ItemCount, Bank = 0.00, Cash = 0.00, Discount = 0.00, GrandTotal = 0.00, PaidAmount = 0.00, RefundAmount = 0.00, Due = 0.00, PartyName = "Walk-in", Payment, Index, Operator, SectorTitle, Sister, Count, Return } = item
                                        return (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{Index}</span></td>
                                                <td className="border-right p-1" style={{ whiteSpace: 'nowrap' }}><span className="d-block fs-6 fw-bold text-center text-dark p-0">{new window.Date(Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                                                <td className="border-right p-1"><span className={`d-block fs-6 text-center p-0 ${Return ? "fw-bolder text-warning" : "fw-bold text-dark"}`}>{InvoiceNo}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{ItemCount}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(Discount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{parseFloat(Bank).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(Cash).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1">
                                                    {parseFloat(RefundAmount) !== undefined && parseFloat(RefundAmount) !== null && parseFloat(RefundAmount) !== 0 ? (
                                                        <span className="d-block fs-6 fw-bolder text-right text-danger p-0">{parseFloat(RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                                                    ) : (
                                                        parseFloat(RefundAmount) === 0 && parseFloat(Due) === 0 ? (
                                                            <span className="d-block fs-6 fw-bold text-right text-dark p-0">N/A</span>
                                                        ) : (
                                                            parseFloat(Due) !== undefined && parseFloat(Due) !== null && parseFloat(Due) !== 0 ? (
                                                                <span className="d-block fs-6 fw-bolder text-right text-primary p-0">{parseFloat(Due).toLocaleString("en", { minimumFractionDigits: 2 })}</span>
                                                            ) : null
                                                        )
                                                    )}
                                                </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{PartyName}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{getLabel(Payment, PaymentTerms)}</span></td>
                                                <td rowSpan={parseInt(Count)} className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                                    {/* <button title="Delete Invoice" className="btn fs-5 px-2 py-0 fad fa-trash-alt text-dark" onClick={() => { setDeleteData(item); setDeleteModalShow(true) }} /> */}
                                                    <button title="Print Invoice" className="btn fs-5 px-2 py-0 fad fa-print text-dark" onClick={(e) => GetInvoiceData(e, item)} />
                                                    <Link title="Show Invoice" className="btn fs-5 px-2 py-0 fad fa-eye text-dark" id="view" to={`/sell_invoice_preview/${item.id}`} />
                                                </span>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={Data.count} // You can get this value from the API response
                            paginate={handlePageChange}
                            currentPage={currentPage}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            h={h}
                        />
                    </>
                )
                    :
                    loading ? (
                        <p className='text-center fs-4'><i className="fad fa-spinner-third"></i> Loading...</p>
                    ) :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Invoice Found!</p>
                        </div>
                }
            </div>
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
    counter_no: props.match.params.ctr_no,
    date_from: new Date(props.match.params.date_from),
    date_to: new Date(props.match.params.date_to),
});

export default connect(mapStateToProps, { logout })(CounterSellReport);