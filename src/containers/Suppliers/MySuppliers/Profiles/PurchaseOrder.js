import axios from 'axios';
import { POPrint } from '../../../Trading/PurchaseOrder/POPrint';
import * as moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { DeletePursOrder } from '../../../../actions/InventoryAPI';
import { FetchPrintPO } from '../../../../actions/PartyAPI';
import { logout } from '../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import { Pagination } from '../../../Trading/PurchaseOrder/QuoteListPagination';
import { customHeader, locales } from "../../Class/datepicker";

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const PurchaseOrder = ({ list, setList, no, SupplierID }) => {
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
    const [SisterFilter, setSisterFilter] = useState(null);
    const [SearchKey, setSearchKey] = useState(null)

    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchData = useCallback(async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purs_order_list/`, {
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
                sup_id: SupplierID,
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

    const PODelete = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeletePursOrder(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Purchase Order',
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
                description: "Failed to delete purchase order. Please try after some moment.",
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
        var result = await FetchPrintPO(item.id);
        if (result !== true) {
            POPrint(e, result, false)
        }
    }


    var h = window.innerHeight - 290;

    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white py-1 px-0`}>
                <p className='display-6 bg-white fw-bolder m-0'>Purchase of Order</p>
                <div className="d-flex justify-content-end">
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

                    {/* <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                                    onClick={(e) => exportPDF(e, BisData, UserData, Tarikh, Data, '#table', '#NestTable')}
                                // onClick={(e) => GenPDF()}

                                ><i class="fad fa-file-pdf"></i></button> */}
                    {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                </div>
            </div>
            {Data?.results?.length ? (
                loading ? (
                    <p className='text-center fs-4'><i className="fad fa-spinner-third"></i> Loading...</p>
                ) : <>
                    <div className='tableFixHead w-100 bg-white' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless text-nowrap`}>
                            <thead>
                                <tr className="text-center">
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Date</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier Name</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">P/O No</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Items</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Qty</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Operator</span></th>
                                    {no <= 7 &&
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Sector</span></th>
                                    }
                                    <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                </tr>
                            </thead>

                            <tbody>
                                {Data.results.map((item, i) => {
                                    const { Index, Date, Name, OrderNo, ItemCount, Qty = 0.00, Weight = 0.000, Vat = 0.00, Discount = 0.00, GrandTotal = 0.00, Operator, SectorTitle, Sister, Count } = item
                                    return (
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{Index}</span></td>
                                            <td className="border-right p-1" style={{ whiteSpace: 'nowrap' }}><span className="d-block fs-6 fw-bold text-center text-dark p-0">{new window.Date(Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>

                                            <td className="border-right p-1"><span className={`d-block fs-6 text-center p-0`}>{Name}</span></td>
                                            <td className="border-right p-1"><span className={`d-block fs-6 text-center p-0`}>{OrderNo}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{ItemCount}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{parseFloat(Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{Operator}</span></td>
                                            {no <= 7 &&
                                                <td className="border-right p-1"><small className="d-block fw-bold text-center text-dark p-0">{`${Sister} (${SectorTitle})`}</small></td>
                                            }
                                            <td rowSpan={parseInt(Count)} className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                                <button title="Delete" className="btn fs-5 px-2 py-0 fad fa-trash-alt text-dark" onClick={() => { setDeleteData(item); setDeleteModalShow(true) }} />
                                                <Link title="Edit" className="btn fs-5 px-2 py-0 fad fa-edit text-dark" to={`/po_edit/${item.id}`} />
                                                {/* <Link title="Sale" className="btn fs-5 px-2 py-0 fad fa-person-dolly text-dark" to={`/quote_sale/${item.id}/${!PartyID ? false : true}`} />
                                                    {PartyID && <Link title="Order" className="btn fs-5 px-2 py-0 fas fa-folder-plus text-dark" to={`/quote_order/${item.id}/${PartyID}`} />} */}
                                                <button title="Print" className="btn fs-5 px-2 py-0 fad fa-print text-dark" onClick={(e) => GetInvoiceData(e, item)} />
                                                {/* <Link title="Show Quote" className="btn fs-5 px-2 py-0 fad fa-eye text-dark" id="view" to={`/po_edit/${item.id}`} /> */}
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
                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                    <p className='fs-2 fw-bold text-center text-success m-0'>No Quotation Found!</p>
                </div>
            }
        </div>

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
});

export default connect(mapStateToProps, { logout })(PurchaseOrder);