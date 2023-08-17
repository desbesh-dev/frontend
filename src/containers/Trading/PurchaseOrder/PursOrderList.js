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

import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { DeleteModal, UpdateModal } from "./Modals/ModalForm.js";

import VirtualizedSelect from "react-virtualized-select";
import 'react-virtualized-select/styles.css';
// import 'react-virtualized/styles.css';
import { DeletePursOrder } from '../../../actions/InventoryAPI';
import { FetchPrintPO } from '../../../actions/PartyAPI';
import '../../../hocs/react-select/dist/react-select.css';
import { POPrint } from './POPrint';
import { Pagination } from './QuoteListPagination';

let today = new Date();
const PursOrderList = ({ user, list, setList, no }) => {
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

    var h = window.innerHeight - 215;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">
                {/* ORDER HISTORY */}
                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">

                    <div className="d-flex justify-content-between align-items-center bg-white p-0">
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap my-0 px-2'>PURCHASE ORDER LISTS</p>
                        <div className="d-flex justify-content-around mx-2 w-100">
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Order: {parseFloat(Data?.count).toLocaleString("en-GB", { minimumFractionDigits: 0 })}</p>
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
                FullName={DeleteData ? DeleteData.Name + ", P/O No-" + DeleteData.OrderNo : null}
                QuoteNo={DeleteData ? DeleteData.OrderNo : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteClick={(e) => PODelete(e, DeleteData.id)}
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

export default connect(mapStateToProps, { logout })(PursOrderList);