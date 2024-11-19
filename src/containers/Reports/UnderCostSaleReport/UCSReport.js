import axios from 'axios';
import * as moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { FetchConcern, fetchServerTimestamp, FetchSisterSector } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchUCSReportPDF, MyProductList } from '../../../actions/InventoryAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import '../../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { UCSReportPDF } from "./UCSReportPDF";

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const UCSReport = ({ user, no }) => {
    const [MyProList, setMyProList] = useState([])
    const [searchKey, setSearchKey] = useState('')
    const [DateTo, setDateTo] = useState(today);
    const [SectorFilter, setSectorFilter] = useState({ label: user.Collocation.Sector, value: user.Collocation.id })
    const [SisterFilter, setSisterFilter] = useState({ label: user.Collocation.Title, value: user.Collocation.SisterID })
    const [SisterList, setSisterList] = useState(false)
    const [SectorList, setSectorList] = useState(false)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');
    const history = useHistory();

    useEffect(() => {
        LoadProductItems();
        LoadConcern();
    }, [])

    const fetchData = useCallback(async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ucs_reports/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
                params: {
                    page: currentPage,
                    page_size: itemsPerPage,
                    date_to: moment(DateTo).format("YYYY-MM-DD"),
                    sect_id: SectorFilter?.value,
                    code: searchKey?.value,
                    print_mode: 0
                },
            });
            setData(res.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [currentPage, itemsPerPage, DateTo, SectorFilter, searchKey]);

    useEffect(() => {
        fetchData(); // Fetch data on page change automatically
    }, [fetchData]);

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const today = new Date();
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
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? '#6495ED' : 'transparent';
            let color = state.isSelected ? 'whitesmoke' : '#333';
            let scale = state.isSelected ? 'scale(1)' : 'scale(1.01)';

            if (state.isFocused) {
                backgroundColor = '#6495ED';
                color = 'whitesmoke';
                scale = 'scale(1.01)';
            }

            return {
                ...provided,
                color,
                backgroundColor,
                paddingTop: "5px",
                paddingBottom: "5px",
                cursor: 'pointer',
                ':focus': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                },
                ':hover': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px"
                },
            };
        },
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "30vh", borderRadius: '20px' }),
        indicatorsContainer: (provided) => ({
            ...provided,
            cursor: 'pointer',
        }),
    };

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

    const PrintPDF = async (e) => {
        e.preventDefault();
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchUCSReportPDF(itemsPerPage, DateTo, SectorFilter, searchKey);

        if (result !== true) {
            UCSReportPDF(e, result.data.results, DateTo, user)
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    // const DateHandler = async (e) => {
    //     if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
    //         setDateTo(e)
    //     else { setDateTo(e) }
    // }

    const handlePageChange = (pageNumber) => {
        setSearchKey(false);
        setCurrentPage(pageNumber);
    };

    const filteredResults = searchKey
        ? data.results.filter(item => item.Code === searchKey.value)
        : data.results;

    var h = window.innerHeight - 167;

    return (
        <div className="row m-0 d-flex justify-content-center">
            <div className="col-lg-12 px-0">
                <div className="row d-flex bg-white mx-auto mb-1 py-1">
                    <div className={`d-flex justify-content-between align-items-center bg-white`}>
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>UNDER COST SALE REPORT</p>
                        <div className="d-flex justify-content-around align-items-center bg-white p-0">
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "50vh", maxHeight: "4vh" }}>
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
                            </div>
                            <div className="d-flex justify-content-end mx-2 w-50">
                                <Datepicker
                                    selected={DateTo}
                                    className="form-control fs-5 fw-bold round_radius50px text-center"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setDateTo(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Date"
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "40vh", maxHeight: "4vh" }}>
                                <Select
                                    options={MyProList}
                                    name="Title"
                                    placeholder={"Search item from current lists"}
                                    styles={CScolourStyles}
                                    value={searchKey}
                                    onChange={(e) => setSearchKey(e)}
                                    required
                                    id="Title"
                                    isClearable={true}
                                    components={{ MenuList: CustomMenuList }}
                                    optionLabel="combinedLabel"
                                    maxMenuHeight={20 * 35}
                                />
                            </div>
                        </div>
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                            // onClick={(e) => UCSReportPDF(e, '#OrderedTable', DateFrom, DateTo, user)}
                            onClick={(e) => PrintPDF(e)}
                        ><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>

                {filteredResults && filteredResults.length ?
                    loading ? (
                        <p className='text-center fs-4'><i class="fad fa-spinner-third"></i> Loading...</p>
                    ) : <>
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table id='OrderedTable' className={`table table-hover table-borderless bg-white`}>
                                <thead>
                                    <tr className="text-center text-uppercase bg-white">
                                        <th className="p-1 border-right"><span>S/N</span></th>
                                        <th className="p-1 border-right"><span>Code</span></th>
                                        <th className="p-1 border-right"><span>Product Name</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Unit Name</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Unit Qty</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Purchase Price</span></th>
                                        <th className="p-1"><span>Sale Price</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredResults?.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{(currentPage - 1) * 50 + (i + 1)}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.Code}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.UnitName}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.UnitQty}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0"> <span className="d-block fw-bold text-right px-1">{parseFloat(item.Rate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={data.count} // You can get this value from the API response
                            paginate={handlePageChange}
                            currentPage={currentPage}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </>
                    :
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                    </div>
                }
            </div>
        </div >
    );
}

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

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    no: state.auth.user.Role.No,
});

export default connect(mapStateToProps, { logout })(UCSReport);