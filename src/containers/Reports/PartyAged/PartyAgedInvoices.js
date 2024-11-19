import axios from 'axios';
import * as moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchSisterSector } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { getLabel } from '../../../actions/ContractAPI';
import { PaymentTerms } from '../../../actions/InventoryAPI';
import { FetchPartyAgedInvoicesList } from '../../../actions/PartyAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { PartyAgedInvoicePDF } from './PartyAgedInvoicePDF';
let today = new Date();

const DueInvoices = ({ data, no }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(today);
    const [sharpnessValue, setSharpnessValue] = useState(null);
    const [OrderBy, setOrderBy] = useState(null)
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [SectorFilter, setSectorFilter] = useState({ label: data.Collocation.Sector, value: data.Collocation.id })
    const [SisterFilter, setSisterFilter] = useState({ label: data.Collocation.Title, value: data.Collocation.SisterID })
    const [SisterList, setSisterList] = useState(false)
    const [SectorList, setSectorList] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    // Define sharpness of overdue options
    const sharpnessOptions = [
        { label: "1-6 days", value: 1 },
        { label: "7-13 days", value: 2 },
        { label: "14-20 days", value: 3 },
        { label: "21+ days", value: 4 }
    ];

    useEffect(() => {
        LoadConcern();
        setDateFrom(today);
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/party_aged_invoice_list/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
                params: {
                    page: currentPage,
                    page_size: itemsPerPage,
                    date_from: moment(DateFrom).format("YYYY-MM-DD"),
                    date_to: moment(DateTo).format("YYYY-MM-DD"),
                    sis_id: SisterFilter?.value,
                    sect_id: SectorFilter?.value,
                    sharpness: sharpnessValue?.value,
                    order_by: OrderBy?.value,
                },
            });
            setData(res.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, DateFrom, DateTo, SisterFilter, SectorFilter, sharpnessValue, OrderBy]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFetchButtonClick = () => {
        fetchData(); // Manually trigger the data fetch when button is clicked
    };

    useEffect(() => {
        fetchData(); // Fetch data on page change automatically
    }, [fetchData]);

    const LoadDueInvoices = async (e) => {
        e.preventDefault();
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyAgedInvoicesList(moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"), SisterFilter, SectorFilter, sharpnessValue, OrderBy);

        if (result !== true)
            PartyAgedInvoicePDF(e, result.data, false, DateFrom, DateTo, data.Name, SisterFilter?.label + " (" + SectorFilter?.label + ")", sharpnessValue?.label, OrderBy?.label)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px', minWidth: '200px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const LoadConcern = async () => {
        var result = await FetchConcern();
        if (result !== true) {
            setSisterList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const getSector = async (e) => {
        setSectorFilter(false)
        setSisterFilter(e)
        var result = await FetchSisterSector(e.value);
        if (result !== true) {
            setSectorList(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    // var h = window.innerHeight - 100;
    var h = window.innerHeight - 167;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>

                    <div className="d-flex">
                        <p className='display-6 bg-white fw-bolder m-0 text-nowrap pr-3'>PARTY AGED INVOICES</p>
                        <Datepicker
                            selected={DateFrom}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => setDateFrom(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>to</p>
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

                    <div className="d-flex justify-content-end">

                        {no <= 7 &&
                            <>
                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={SisterList}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Sister"
                                        placeholder={"Sister"}
                                        styles={CScolourStyles}
                                        value={SisterFilter}
                                        onChange={e => getSector(e)}
                                        required
                                        id="Sister"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                </div>

                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={SectorList}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Sector"
                                        placeholder={"Sector"}
                                        styles={CScolourStyles}
                                        value={SectorFilter}
                                        onChange={(e) => setSectorFilter(e)}
                                        required
                                        id="Sector"
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={!SisterFilter}
                                    />
                                </div>
                            </>
                        }
                        {/* Add sharpness of overdue selector here */}
                        <div className="d-flex justify-content-center mx-2 w-70">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={sharpnessOptions}  // Sharpness of overdue options
                                defaultValue={{ label: "Overdue Sharpness", value: 0 }}
                                name="OverdueSharpness"
                                placeholder={"Overdue Sharpness"}
                                styles={CScolourStyles}
                                value={sharpnessValue}
                                onChange={(e) => setSharpnessValue(e)}  // Handle sharpness selection
                                required
                                id="OverdueSharpness"
                                isClearable={true}
                                isSearchable={true}
                            />
                        </div>
                        <div className="d-flex justify-content-center mx-2 w-70">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={[
                                    { label: "Party Title (ASC)", value: 1 },
                                    { label: "Party Title (DESC)", value: 2 },
                                    { label: "Age (ASC)", value: 3 },
                                    { label: "Age (DESC)", value: 4 },
                                ]}
                                defaultValue={{ label: "Order By", value: 0 }}
                                name="Order"
                                placeholder={"Order By"}
                                styles={CScolourStyles}
                                value={OrderBy}
                                onChange={(e) => setOrderBy(e)}  // Handle sharpness selection
                                required
                                id="Order"
                                isClearable={true}
                                isSearchable={true}
                            />
                        </div>
                        <button className="btn btn-outline-success" onClick={handleFetchButtonClick}> Submit</button>
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => LoadDueInvoices(e)}><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>
                {Data && Data.results &&
                    <>
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless bg-white`}>
                                <thead>
                                    <tr className="text-center border-top">
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Date</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Invoice No</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Party</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Contact</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Payment Terms</span></th>
                                        <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Amount</span></th>
                                        <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Age</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Array.isArray(Data.results) && Data.results.length ? Data.results.map((item, i, Data) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap"> {(currentPage - 1) * 50 + (i + 1)}</span> </td>
                                                <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{moment(item.Date).format("DD MMM YYYY")}</span> </td>
                                                <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.InvoiceNo}</span></td>
                                                <td className="border-right py-1 px-2 text-left"><Link className="fs-6 fw-bolder text-left text-dark text-decoration-none" to={`/my_party/${item.Party}/${item.PartyID}`}>{item.PartyTitle}</Link> <br /> <small className='p-0 m-0 text-left'>{item.Address} </small></td>
                                                <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.Contact}</span></td>
                                                <td className="border-right py-1 px-2">
                                                    <span className="fs-5 fw-bold text-left d-block text-dark">
                                                        {getLabel(item.Payment, PaymentTerms)} &nbsp;
                                                        {parseInt(item.PaymentStatus) === 1 ? (<small className="border border-warning bg-gradient px-1 text-warning" style={{ borderRadius: "15px" }}>Partially Paid</small>) : null}
                                                    </span>

                                                </td>
                                                <td className="border-right py-1 px-2"><span className="fs-5 fw-bolder text-right d-block text-dark">{parseFloat(item.Due).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-right py-1 px-2"><span className="fs-5 fw-bold text-center text-dark text-white bg-gradient bg-warning px-2" style={{ borderRadius: "15px" }}>{item.age}</span> </td>
                                            </tr>
                                        ))
                                            : null
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
                        />
                    </>
                }

            </div>

            <div className="col-md-12 justify-content-center align-items-center h-100">

            </div>
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    data: state.auth.user,
    display: state.OverlayDisplay,
    accounts: state.auth.accounts,
    no: state.auth.no
});

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 11;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
        const halfMaxPages = Math.floor(maxPagesToShow / 2);
        if (currentPage <= halfMaxPages) {
            endPage = maxPagesToShow;
        } else if (currentPage >= totalPages - halfMaxPages) {
            startPage = totalPages - maxPagesToShow + 1;
        } else {
            startPage = currentPage - halfMaxPages;
            endPage = currentPage + halfMaxPages;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="pagination justify-content-center py-2 m-0" style={{ borderTop: "3px solid #DEE2E6" }}>
            {currentPage > 1 && (
                <li className="btn btn-outline-warning mx-2" onClick={() => paginate(currentPage - 1)}>
                    <i class="fad fa-chevron-left"></i> Previous
                </li>
            )}
            {startPage > 1 && (
                <li className="btn btn-outline-success mx-2" onClick={() => paginate(1)}>
                    1
                </li>
            )}
            {startPage > 2 && (
                <li className="btn btn-secondary" onClick={() => paginate(startPage - 1)}>
                    . . .
                </li>
            )}
            {pageNumbers.map((number) => (
                <li
                    key={number}
                    className={number === currentPage ? 'btn btn-outline-success mx-2 active' : 'btn btn-outline-success mx-2'}
                    onClick={() => paginate(number)}>
                    {number}
                </li>
            ))}
            {endPage < totalPages - 1 && (
                <li className="btn btn-secondary" onClick={() => paginate(endPage + 1)}>
                    . . .
                </li>
            )}
            {endPage < totalPages && (
                <li className="btn btn-outline-success mx-2" onClick={() => paginate(totalPages)}>
                    {totalPages}
                </li>
            )}
            {currentPage < totalPages && (
                <li className="btn btn-outline-warning mx-2" onClick={() => paginate(currentPage + 1)}>
                    Next <i class="fad fa-chevron-right"></i>
                </li>
            )}
        </ul>
    );
};
export default connect(mapStateToProps, { logout })(DueInvoices);