import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { DeleteStock } from '../../actions/InventoryAPI';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import '../../hocs/react-select/dist/react-select.css';
// import 'react-select/dist/react-select.css'
import 'react-virtualized-select/styles.css';
// import 'react-virtualized/styles.css';

import { fetchServerTimestamp } from '../../actions/APIHandler';
import { MyProductList } from '../../actions/SuppliersAPI';
import { BarcodeList } from '../../containers/Suppliers/NationalSuppliers/Profiles/Modal/BarcodePrintModal';
import { ItemUpdate } from '../../containers/Suppliers/NationalSuppliers/Profiles/Modal/Item';
import { AddPack, UpdatePack, ViewPack } from '../../containers/Suppliers/NationalSuppliers/Profiles/Modal/Package';
import { CustomMenuList } from '../../hocs/Class/CustomMenuList';
import { CategoryList } from '../Suppliers/Class/Category';
import { DumpsterModal } from './Modals/DumpsterModal';
import { DeleteModal, InfoMessage } from "./Modals/ModalForm.js";
import { StockTrace } from './Modals/StockTraceModal';

const YardStock = ({ user, list, setList, cat, no }) => {
    const [InitItem, setInitItem] = useState(false);

    const [StockTraceModal, setStockTraceModal] = useState(false);
    const [EditItem, setEditItem] = useState(false);
    const [EditItemModalShow, setEditItemModalShow] = useState(false);

    const [CreateItemModalShow, setCreateItemModalShow] = useState(false);

    const [DumpsterModalShow, setDumpsterModalShow] = useState(false);
    const [CreatePKGModalShow, setCreatePKGModalShow] = useState(false);
    const [PackItemID, setPackItemID] = useState(false);

    const [EditPKG, setEditPKG] = useState(false);
    const [EditPKGModalShow, setEditPKGModalShow] = useState(false);

    const [ViewPKGModalShow, setViewPKGModalShow] = useState(false);

    const [BarcodeItem, setBarcodeItem] = useState(false);
    const [BarcodeModalShow, setBarcodeModalShow] = useState(false);

    const [ItemTitle, setItemTitle] = useState(false);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/yard_stock_list/`, {
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

    const StockDelete = async e => {
        if (parseInt(StockItem.Weight) !== 0.000) {
            setDeleteModalShow(false)
            setInfoModalShow(true);
        } else {
            setDeleteModalShow(false)
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            e.preventDefault();
            const result = await DeleteStock(StockItem.id);
            if (result !== true) {
                // LoadStock();
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    };

    const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "15vh", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

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
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>YARD STOCK</p>
                        {
                            no <= 7 && (
                                <p className='fs-4 bg-white fw-bold text-dark text-nowrap m-0 w-50'>Stock In Liquid: <span className='fw-bold' style={{ fontFamily: "Lato Bold" }}>{parseFloat(data.liquid).toLocaleString("en", { minimumFractionDigits: 2 })} </span> </p>
                            )
                        }
                        <div className="d-flex justify-content-around align-items-center bg-white p-0">
                            {(no <= 7 || (no === 8 && cat === 4)) &&
                                <div className="d-flex justify-content-center mx-2">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={data.sector}
                                        // options={}
                                        defaultValue={{ label: "Select Sector", value: 0 }}
                                        name="Sector"
                                        placeholder={"Sector"}
                                        styles={CScolourStyles}
                                        value={SectorFilter}
                                        onChange={(e) => setSectorFilter(e)}
                                        required
                                        id="Sector"
                                        isClearable={false}
                                        isSearchable={true}
                                    />
                                </div>
                            }

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
                                    isClearable={false}
                                    isSearchable={true}
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "30vh", maxHeight: "4vh" }}>
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
                        {([8, 9, 10, 11].includes(no) && cat !== 4) && <Link Title="Delivery Request" className="btn fs-3 p-2 fad fa-paper-plane text-success border-left" to='yard_request'></Link>}
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
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">CTR No</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Code</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Category</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Title</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit (Wt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit Price</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Wt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Qt)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Stock (Ctn)</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier</span></th>
                                        {(no <= 7 || (no === 8 && cat === 4)) && <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Sector</span></th>}
                                        <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                    </tr>
                                </thead>
                                {
                                    data.results.map((item, i) => (
                                        <tbody>
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.ContainerNo}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Code}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Category}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Title}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{item.Cost.toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{item.Weight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })} PCS</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{parseFloat(item.Ctn).toLocaleString("en", { minimumFractionDigits: 2 })} Ctn</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Status ? "Available" : "Unavailable"}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Supplier}</span> </td>

                                                {(no <= 7 || (no === 8 && cat === 4)) &&
                                                    <td className={`border-right p-1}`}><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Sector}</span> </td>
                                                }
                                                <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>
                                                    <button title="Remove Product" className="btn fs-5 px-2 py-0 fad fa-minus text-dark" onClick={() => { setStockItem(item); setDeleteModalShow(true) }} />
                                                    {/* <button title="Update Product" className="btn fs-5 px-2 py-0 fad fa-edit text-dark" id="print" onClick={(e) => { setStockItem(item); setUpdateModalShow(true) }} /> */}
                                                    <button title="View Package" className="btn fs-4 px-2 py-0 fad fa-eye text-dark" onClick={() => { setPackItemID(item); setViewPKGModalShow(true) }} />
                                                    {no <= 7 ?
                                                        <>
                                                            <button title="Update Item" className="btn fs-4 px-2 py-0 fad fa-edit text-dark" onClick={() => { setEditItem(item); setEditItemModalShow(true) }} />
                                                            <button title="Update Package" className="btn fs-4 px-2 py-0 fad fa-box-open text-dark" onClick={() => { setPackItemID(item); setEditPKGModalShow(true) }} />
                                                        </>
                                                        :
                                                        <button title="Update Package" className="btn fs-4 px-2 py-0 fad fa-box-open text-dark" onClick={() => { setPackItemID(item); setCreatePKGModalShow(true) }} />
                                                    }
                                                    {no === 11 && <button title="Update Item" className="btn fs-4 px-2 py-0 fad fa-edit text-dark" onClick={() => { setEditItem(item); setEditItemModalShow(true) }} />}
                                                    <button title="Package Barcode" className="btn fs-4 px-2 py-0 fal fa-barcode-read text-dark" onClick={() => { setBarcodeItem(item); setBarcodeModalShow(true) }} />
                                                    <button title="Dumpster" className="btn fs-5 px-2 py-0 fad fa-dumpster text-dark" id="trace" onClick={(e) => setDumpsterModalShow(item)} />
                                                    <button title="Stock Trace" className="btn fs-5 px-2 py-0 fad fa-bullseye-pointer text-dark" id="trace" onClick={(e) => setStockTraceModal(item)} />
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
            {/* 
            {
                CreateModalShow ?
                    <InitProductModal
                        show={CreateModalShow}
                        list={list}
                        setList={setList}
                        ProductList={MyProList}
                        onReload={(e) => e.preventDefault()}
                        onHide={() => setCreateModalShow(false)}
                    /> : null
            } */}

            {/* {
                StockItem ?
                    <UpdateModal
                        Item={StockItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        // onReload={() => LoadStock()}
                        onHide={() => { setStockItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            } */}
            {
                StockItem ?
                    <DeleteModal
                        FullName={StockItem.Title}
                        show={DeleteModalShow}
                        Click={(e) => StockDelete(e)}
                        // onReload={() => LoadStock()}
                        onHide={() => { setStockItem(false); setDeleteModalShow(false) }}
                    />
                    : null
            }

            {
                StockTraceModal ?
                    <StockTrace
                        item={{ id: StockTraceModal.ItemID, Code: StockTraceModal.Code, Title: StockTraceModal.Title, SectorID: StockTraceModal.SectorID }}
                        show={StockTraceModal}
                        list={list}
                        setList={setList}
                        onHide={() => { setStockTraceModal(false); }}
                    />
                    : null
            }

            {
                DumpsterModalShow ?
                    <DumpsterModal
                        item={{ id: DumpsterModalShow.ItemID, Code: DumpsterModalShow.Code, Title: DumpsterModalShow.Title, SectorID: DumpsterModalShow.SectorID, Cost: parseFloat(DumpsterModalShow.Cost), UnitWeight: parseFloat(DumpsterModalShow.UnitWeight) }}
                        show={DumpsterModalShow}
                        list={list}
                        setList={setList}
                        onHide={() => { setDumpsterModalShow(false); }}
                    />
                    : null
            }

            {
                EditItemModalShow &&
                <ItemUpdate
                    item={{ ...EditItem, id: EditItem.ItemID }}
                    show={EditItemModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => window.location.reload(false)}
                    onClose={() => { LoadProductItems(); setEditItemModalShow(false); setEditItem(false) }}
                    onHide={() => { setEditItemModalShow(false); setEditItem(false) }}
                />
            }
            {
                CreatePKGModalShow &&
                <AddPack
                    item={{ id: PackItemID.ItemID, Code: PackItemID.Code, Title: PackItemID.Title }}
                    show={CreatePKGModalShow}
                    SupplierID={PackItemID.SupplierID}
                    ProductID={PackItemID.ProductID}
                    list={list}
                    setList={setList}
                    onReload={() => { LoadProductItems(); window.location.reload(false)() }}
                    onClose={() => { setCreatePKGModalShow(false) }}
                    onHide={() => { setCreatePKGModalShow(false); }}
                />
            }
            {
                EditPKGModalShow &&
                <UpdatePack
                    item={{ id: PackItemID.ItemID, Code: PackItemID.Code, Title: PackItemID.Title }}
                    show={EditPKGModalShow}
                    SupplierID={PackItemID.SupplierID}
                    ProductID={PackItemID.ProductID}
                    list={list}
                    setList={setList}
                    onReload={() => LoadProductItems()}
                    onClose={() => { LoadProductItems(); setEditPKGModalShow(false) }}
                    onHide={() => { setEditPKGModalShow(false); }}
                />

            }
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
            <InfoMessage
                header="Remove stock product!"
                body_header="Can not remove product"
                body="Product exist in physical store. So, you can not remove product without null stock"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            />
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
    no: state.auth.no,
    cat: state.auth.cat,
});

export default connect(mapStateToProps, { logout })(YardStock);