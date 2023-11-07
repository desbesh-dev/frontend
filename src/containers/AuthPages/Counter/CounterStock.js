import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import '../../../hocs/react-select/dist/react-select.css';

import { fetchServerTimestamp } from '../../../actions/APIHandler';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import { CategoryList } from '../../Suppliers/Class/Category';
import { BarcodeList } from '../../Suppliers/NationalSuppliers/Profiles/Modal/BarcodePrintModal';
import { ViewPack } from '../../Suppliers/NationalSuppliers/Profiles/Modal/Package';

const CounterStock = ({ user, list, setList, scale, no }) => {
    const [PackItemID, setPackItemID] = useState(false);

    const [ViewPKGModalShow, setViewPKGModalShow] = useState(false);

    const [BarcodeItem, setBarcodeItem] = useState(false);
    const [BarcodeModalShow, setBarcodeModalShow] = useState(false);

    const [MyProList, setMyProList] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [SectorFilter, setSectorFilter] = useState(false);
    const [Category, setCategory] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [StockItem, setStockItem] = useState(false)
    const [SearchKey, setSearchKey] = useState('')
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_stock_list/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            params: {
                page: currentPage,
                page_size: itemsPerPage,
                sector: SectorFilter?.value,
                category: Category?.label,
                code: SearchKey?.value,
            },
        });
        setData(res.data);
        setLoading(false);
    }, [currentPage, itemsPerPage, SectorFilter, Category, SearchKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = (pageNumber) => {
        setSearchKey(false);
        setCurrentPage(pageNumber);
    };

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

    useEffect(() => {
        LoadProductItems();
    }, []);

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

    MyProList.forEach(option => {
        option.combinedLabel = `${option.label} (${option.value})`;
    });

    const BarcodeHandler = async (e) => {
        document.activeElement.blur();
        setSearchKey({ value: e })
    };

    var h = window.innerHeight - 167;

    return (
        <div className="row m-0 d-flex justify-content-center">
            <div className="col-lg-12 px-0">
                <div className="row d-flex bg-white mx-auto mb-1 py-1">
                    <div className={`d-flex justify-content-between align-items-center bg-white`}>
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>PRODUCT STOCK</p>
                        <div className="d-flex justify-content-around align-items-center bg-white p-0">
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "10vh", maxHeight: "4vh" }}>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    // options={data.results.map}
                                    options={CategoryList}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Category"
                                    placeholder={"Category"}
                                    styles={CScolourStyles}
                                    value={Category}
                                    onChange={(e) => setCategory(e)}
                                    required
                                    id="Category"
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "40vh", maxHeight: "4vh" }}>
                                <Select
                                    options={MyProList}
                                    name="Title"
                                    placeholder={"Please select product"}
                                    styles={CScolourStyles}
                                    value={SearchKey}
                                    onChange={(e) => { setCurrentPage(1); setSearchKey(e) }}
                                    required
                                    id="Title"
                                    isClearable={true}
                                    components={{ MenuList: CustomMenuList }}
                                    optionLabel="combinedLabel"
                                    maxMenuHeight={20 * 35}
                                />
                            </div>

                            <BarcodeReader onScan={BarcodeHandler} />
                        </div>

                    </div>
                </div>
                {data.results && data.results.map && data.results.map.length ?
                    loading ? (
                        <p className='text-center fs-4'><i class="fad fa-spinner-third"></i> Loading...</p>
                    ) : <>
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless no-wrap bg-white m-0`}>
                                <thead>
                                    <tr className="text-center">
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Code</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Category</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Title</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit (Wt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Ctn)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Qt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Wt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Last Received</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Min Qt</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier</span></th>
                                        <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                    </tr>
                                </thead>
                                {
                                    data.results.map((item, i) => (
                                        <tbody>
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Code}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Category}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Title}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-right text-dark p-0">{parseFloat(item.Ctn).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{item.Weight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.LastReceived.toLocaleString("en", { minimumFractionDigits: 2 })} PCS</span> </td>
                                                <td className={`border-right p-1 border-right`}><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.MinRequired.toLocaleString("en", { minimumFractionDigits: 0 })} PCS</span> </td>
                                                <td className={`border-right p-1 border-right`}><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Supplier}</span> </td>
                                                <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>
                                                    <button title="View Package" className="btn fs-4 px-2 py-0 fad fa-eye text-dark" onClick={() => { setPackItemID(item); setViewPKGModalShow(true) }} />
                                                    <button title="Package Barcode" className="btn fs-4 px-2 py-0 fal fa-barcode-read text-dark" onClick={() => { setBarcodeItem(item); setBarcodeModalShow(true) }} />
                                                </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))
                                }
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

            {
                ViewPKGModalShow ?
                    <ViewPack
                        item={{ id: PackItemID.ItemID, Code: PackItemID.Code, Title: PackItemID.Title }}
                        show={ViewPKGModalShow}
                        SupplierID={PackItemID.SupplierID}
                        ProductID={PackItemID.ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)()}
                        onClose={() => { setViewPKGModalShow(false) }}
                        onHide={() => { setViewPKGModalShow(false); }}
                    />
                    : null
            }

            {
                BarcodeModalShow ?
                    <BarcodeList
                        item={{ id: BarcodeItem.ItemID, Title: BarcodeItem.Title, Barcode: BarcodeItem.Barcode }}
                        show={BarcodeModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)()}
                        onClose={() => { setBarcodeModalShow(false) }}
                        onHide={() => { setBarcodeModalShow(false); }}
                    />
                    : null
            }
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

export default connect(mapStateToProps, { logout })(CounterStock);