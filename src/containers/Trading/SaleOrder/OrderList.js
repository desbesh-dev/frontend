import axios from 'axios';
import * as moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { DeleteModal, UpdateModal } from "./Modals/ModalForm.js";

import VirtualizedSelect from "react-virtualized-select";
import 'react-virtualized-select/styles.css';
// import 'react-virtualized/styles.css';
import { getLabel } from '../../../actions/ContractAPI';
import { DeleteQuote, PaymentTerms } from '../../../actions/InventoryAPI';
import { FetchPrintOrder, FetchPrintQuote, UpdateDlvStatus } from '../../../actions/PartyAPI';
import '../../../hocs/react-select/dist/react-select.css';
import { OrderPrint } from '../../Trading/SaleOrder/OrderPrint';
import { Pagination } from '../Quotation/QuoteListPagination';

let today = new Date();
const OrderList = ({ user, list, setList, no }) => {
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [DateFrom, setDateFrom] = useState(today)
    const [DateTo, setDateTo] = useState(today)
    const [Data, setData] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [StockItem, setStockItem] = useState(false)

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const [SectorFilter, setSectorFilter] = useState(null);
    const [CounterFilter, setCounterFilter] = useState(null);
    const [PayTypeFilter, setPayTypeFilter] = useState(null);
    const [SisterFilter, setSisterFilter] = useState(null);
    const [SearchKey, setSearchKey] = useState(null)

    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchData = useCallback(async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/order_list/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            params: {
                date_from: moment(DateFrom).format("YYYY-MM-DD"),
                date_to: moment(DateTo).format("YYYY-MM-DD"),
                page: currentPage,
                page_size: itemsPerPage,
                sister: SisterFilter?.value,
                sector: SectorFilter?.value,
                order_no: SearchKey?.value,
            },
        });
        setData(res.data);
        setLoading(false);
    }, [Date, currentPage, itemsPerPage, SectorFilter, SearchKey, DateTo, SisterFilter, SectorFilter]);

    useEffect(() => {
        fetchData(Date);
    }, [fetchData]);

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

    const PrintPDF = async (e, item) => {
        // if (item.Status === 2) {
        //     var result = await FetchPrintInvoice(item.SaleID);
        //     if (result !== true)
        //         InvoicePrint(e, result, false)
        //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
        // }
        // else {
        var result = await FetchPrintOrder(item.id);
        if (result !== true)
            OrderPrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        // }
    }

    const QuoteDelete = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteQuote(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Quotation',
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
                description: "Failed to delete quotoation. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const handlePageChange = (pageNumber) => {
        setSearchKey(false);
        setCurrentPage(pageNumber);
    };

    const GetInvoiceData = async (e, item) => {
        var result = await FetchPrintQuote(item.id);
        if (result !== true) {
            OrderPrint(e, result, false)
        }
    }

    const UpdateInvoiceStatus = async (e, item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await UpdateDlvStatus(item.id, item.Status)
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
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
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
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 1: return "Warehouse";
            case 2: return "Shipped";
            case 3: return "Delivered";
            case 4: return "Cancel";
            case 5: return "Postpond";
            default: return "N/A";
        }
    }

    var h = window.innerHeight - 215;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">
                {/* ORDER HISTORY */}
                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">

                    <div className="d-flex justify-content-between align-items-center bg-white p-0">
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap my-0 px-2'>ORDER LISTS</p>
                        <div className="d-flex justify-content-around mx-2 w-100">
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Order: {parseFloat(Data?.count).toLocaleString("en-GB", { minimumFractionDigits: 0 })}</p>
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Amount: {parseFloat(Data?.Sale).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="d-flex justify-content-end mx-2">
                            <Datepicker
                                selected={DateFrom}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => setDateFrom(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date From"
                            />
                            <p className='fw-bold text-success my-auto px-1 mx-1' title="Search">To</p>
                            <Datepicker
                                selected={DateTo}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => DateHandler(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date To"
                            />
                        </div>
                    </div>
                </div>

                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">
                    <div className="d-flex justify-content-around align-items-center bg-white p-0">
                        {no <= 7 && [
                            {
                                label: "Sister Filter",
                                options: Data.Sister,
                                value: SisterFilter,
                                onChange: (e) => { setSisterFilter(e); setCurrentPage(1) },
                                id: "Sister"
                            },
                            {
                                label: "Sector Filter",
                                options: Data.Sector,
                                value: SectorFilter,
                                onChange: (e) => { setSectorFilter(e); setCurrentPage(1) },
                                id: "Title"
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
                                name="Title"
                                menuBuffer={100}
                                required
                                id="Title"
                                value={SearchKey}
                                optionLabel="combinedLabel"
                                onChange={(e) => { setSearchKey(e); setCurrentPage(1) }}
                            />
                        </div>

                    </div>
                </div>


                {Data?.results?.length ? (
                    loading ? (
                        <p className='text-center fs-4'><i className="fad fa-spinner-third"></i> Loading...</p>
                    ) : <>
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless bg-white text-nowrap`}>
                                <thead className='bg-white'>
                                    <tr className="text-center">
                                        <th className="py-1 border-right"><span>S/N</span></th>
                                        <th className="py-1 border-right"><span>Date</span></th>
                                        <th className="py-1 border-right"><span>Name</span></th>
                                        <th className="py-1 border-right"><span>Order No</span></th>
                                        <th className="py-1 border-right">Order Date</th>
                                        <th className="py-1 border-right">Delivery Date</th>
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
                                        <th className="py-1 text-center"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Data.results.map((item, i) => {
                                            let selectValue;
                                            switch (item.Status) {
                                                case 1:
                                                    selectValue = { value: 1, label: "Warehouse" };
                                                    break;
                                                case 2:
                                                    selectValue = { value: 2, label: "Shipped" };
                                                    break;
                                                case 3:
                                                    selectValue = { value: 3, label: "Delivered" };
                                                    break;
                                                case 4:
                                                    selectValue = { value: 4, label: "Cancel" };
                                                    break;
                                                case 5:
                                                    selectValue = { value: 5, label: "Postpond" };
                                                    break;
                                                default:
                                                    selectValue = "N/A";
                                            }

                                            return (
                                                <tr className="border-bottom text-center fw-bold" key={i}>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                    <td className="py-0 px-1 border-right text-nowrap">{moment(item.Date).format("DD MMM YY")}</td>
                                                    <td className="py-0 px-1 border-right text-left">{item.Title}</td>
                                                    <td className="py-0 px-1 border-right">{item.OrderNo}</td>
                                                    <td className="py-0 px-1 border-right">{moment(item.OrderDate).format("DD MMM YY")}</td>
                                                    <td className="py-0 px-1 border-right">{moment(item.DeliveryDate).format("DD MMM YY")}</td>
                                                    <td className="py-0 px-1 border-right">{item.ItemCount}</td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Discount || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Shipping || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.GrandTotal || 0).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Cash || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Bank || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.PaidAmount || 0).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Due || 0).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="py-0 border-right"><small className="d-block fw-bold">{getLabel(item.Payment, PaymentTerms)}</small> </td>
                                                    <td className="py-0 border-right" style={{ width: "120px" }}>
                                                        {item.Status === 2 ?
                                                            <Select
                                                                menuPlacement="auto"
                                                                menuPosition="fixed"
                                                                menuPortalTarget={document.body}
                                                                borderRadius={"0px"}
                                                                options={[
                                                                    { value: 3, label: "Delivered" },
                                                                    { value: 4, label: "Cancel" },
                                                                    { value: 5, label: "Postpond" }
                                                                ]}
                                                                name="Status"
                                                                placeholder={"Status"}
                                                                styles={CScolourStyles}
                                                                value={item.Status || selectValue}
                                                                onChange={(e) => {
                                                                    item.Status = e.value; // Assign the selected status value directly to the item
                                                                    UpdateInvoiceStatus(e, item)
                                                                }}
                                                                required
                                                                id="Status"
                                                            />
                                                            :
                                                            <span className="d-block fw-bold ">{getStatusLabel(item.Status)}</span>
                                                        }
                                                    </td>
                                                    <td className="p-0 text-nowrap">
                                                        {item.Status === 1 ?
                                                            <Link className="btn fs-3 px-2 py-0 text-danger" to={`/order_exc/${item.id}`}><i className="fad fa-truck-container"></i></Link>
                                                            :
                                                            <Link className="btn fs-3 px-2 py-0 text-danger" to={`/sell_invoice_preview/${item.SaleID}`}><i className="fad fa-eye"></i></Link>
                                                        }
                                                        {/* <Link className="btn fs-3 px-2 py-0 text-danger" to={`/order_exc/${item.id}`}><i className="fad fa-truck-couch"></i></Link> */}
                                                        <button className="btn fs-3 px-2 py-0 text-danger" onClick={(e) => PrintPDF(e, item)}> <i className="fad fa-print"></i></button>
                                                    </td>
                                                </tr>

                                            )
                                        })
                                    }
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
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className='fs-2 fw-bold text-center text-success m-0'>No Order Placed!</p>
                    </div>
                }

            </div>
            {
                StockItem ?
                    <UpdateModal
                        Item={StockItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => fetchData(Date)}
                        onHide={() => { setStockItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            }
            <DeleteModal
                FullName={DeleteData ? DeleteData.Name + ", Quote No-" + DeleteData.QuoteNo : null}
                QuoteNo={DeleteData ? DeleteData.QuoteNo : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteClick={(e) => QuoteDelete(e, DeleteData.id)}
                onHide={() => { setDeleteModalShow(false); setDeleteData(false) }}
            />
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
});

export default connect(mapStateToProps, { logout })(OrderList);