import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { DeleteStock } from '../../actions/InventoryAPI';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import '../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../Suppliers/Class/datepicker";

import { FetchPurchaseInvoice } from '../../actions/SuppliersAPI';
import { InvoicePrint } from '../Suppliers/MySuppliers/Profiles/ViewInvoice/InvoicePrint';
import moment, { locale } from 'moment';
import { BarcodeList } from '../Suppliers/NationalSuppliers/Profiles/Modal/BarcodePrintModal';
import { CtrRegister, DeleteModal, PushBackModal, UpdateModal, ViewModal } from "./Modals/ModalForm.js";
let today = new Date();

const ContainerList = ({ user, list, setList, no, cat }) => {
    const [EditItem, setEditItem] = useState(false);
    const [EditItemModalShow, setEditItemModalShow] = useState(false);
    const [ItemID, setItemID] = useState(false);
    const [PushItemID, setPushItemID] = useState(false);
    const [ViewModalShow, setViewModalShow] = useState(false);
    const [BarcodeItem, setBarcodeItem] = useState(false);
    const [BarcodeModalShow, setBarcodeModalShow] = useState(false);

    const [Date, setDate] = useState(today);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [PushModalShow, setPushModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [MyProList, setMyProList] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [SectorFilter, setSectorFilter] = useState(false);
    const [StatusFilter, setStatusFilter] = useState(false);
    const [SupplierFilter, setSupplierFilter] = useState(false);

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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_ctr_list/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            params: {
                page: currentPage,
                page_size: itemsPerPage,
                sector: SectorFilter?.value,
                status: StatusFilter?.value,
                supplier: SupplierFilter?.value,
                code: SearchKey?.value,
                date: moment(Date).format("YYYY-MM-DD")
            },
        });
        setData(res.data);
        setLoading(false);
    }, [currentPage, itemsPerPage, SectorFilter, SupplierFilter, StatusFilter, SearchKey, Date]);

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

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "10vh", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    MyProList.forEach(option => {
        option.combinedLabel = `${option.label} (${option.value})`;
    });

    const PrintPDF = async (e, id) => {
        var result = await FetchPurchaseInvoice(id);
        if (result !== true)
            InvoicePrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    var h = window.innerHeight - 167;

    return (
        <div className="row m-0 d-flex justify-content-center">
            <div className="col-lg-12 px-0">
                <div className="row d-flex bg-white mx-auto mb-1 py-1">
                    <div className={`d-flex justify-content-between align-items-center bg-white`}>
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>CONTAINERS</p>
                        <p className='fs-4 bg-white fw-bold text-dark text-nowrap m-0 w-50'>Stock In Liquid: <span className='fw-bold' style={{ fontFamily: "Lato Bold" }}>{parseFloat(data.liquid).toLocaleString("en", { minimumFractionDigits: 2 })} </span> </p>

                        <div className="d-flex justify-content-around align-items-center bg-white p-0">

                            <div className="d-flex justify-content-center mx-2" style={{ minWidth: "30vh", maxHeight: "4vh" }}>
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
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>

                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "15vh", maxHeight: "4vh" }}>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    // options={data.results.map}
                                    options={[{ value: 1, label: "Active" }, { value: 0, label: "Empty" }, { value: 2, label: "Push Back" },]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Status"
                                    placeholder={"Status"}
                                    styles={CScolourStyles}
                                    value={StatusFilter}
                                    onChange={(e) => setStatusFilter(e)}
                                    required
                                    id="Status"
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "20vh", maxHeight: "4vh", zIndex: 999 }}>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    // options={data.results.map}
                                    options={data.search}
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
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "10vh", maxHeight: "4vh", zIndex: 999 }}>
                                <Datepicker
                                    selected={Date || null}
                                    className="form-control fs-5 fw-bold round_radius50px text-center"
                                    dateFormat="dd MMM yyyy"
                                    name='Date'
                                    onChange={(e) => setDate(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Date"
                                />
                            </div>
                        </div>
                        <button className="btn fs-3 p-2 fad fa-plus-octagon text-success border-left" onClick={(e) => setCreateModalShow(true)} />
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
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Date</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Container No</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">From</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">USN</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Remark</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Seal</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Shared</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Sector</span></th>
                                        <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                    </tr>
                                </thead>
                                {
                                    data.results.map((item, i) => (
                                        <tbody>
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{i + 1}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.ContainerNo}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.From}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.SerialNo}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.Remark}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Status ? "Active" : "Empty"}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.SealStatus ? "Broken" : "Sealed"}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Reserve ? "Reserved" : "Shared"}</span> </td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.SupplierName}</span> </td>
                                                <td className={`border-right p-1}`}><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>{item.SectorName}</span> </td>

                                                <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0" style={{ whiteSpace: 'nowrap' }}>
                                                    <button title="View Container" className="btn fs-4 px-2 py-0 fad fa-eye text-dark" onClick={() => { setItemID(item); setViewModalShow(true) }} />
                                                    {
                                                        item.hasInvoice ?
                                                            <>
                                                                <Link className="btn px-2 py-0 text-danger" title="View Details" to={`/purs_invoice_preview/${item.InvoiceID}`}><i className="fad fa-file-invoice"></i></Link>
                                                                <button className="btn px-2 py-0 text-danger" title="Print View" onClick={(e) => PrintPDF(e, item.InvoiceID)}><i className="fad fa-print"></i></button>
                                                            </>
                                                            :
                                                            (cat === 4 || item.SectorID === user.Collocation.id) &&
                                                            <Link title="Invoice" className="btn fs-4 px-2 py-0 fad fa-download text-dark" to={{
                                                                pathname: `/ctr_purchase/${item.id}`,
                                                                state: { SupplierID: item.SupplierID, SectorID: item.SectorID, CtrID: item.id, CtrNo: item.ContainerNo }
                                                            }} />
                                                    }
                                                    {no === 8 && cat === 4 && <>
                                                        <button title="Update Container" className="btn fs-4 px-2 py-0 fad fa-edit text-dark" onClick={() => { setEditItem(item); setEditItemModalShow(true) }} />
                                                        <button title="Push Back" className="btn fs-4 px-2 py-0 fad fa-sign-out-alt text-dark" style={{ transform: "rotate(-90deg)" }} onClick={() => { setPushItemID(item); setPushModalShow(true) }} />
                                                    </>}
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
                CreateModalShow ?
                    <CtrRegister
                        show={CreateModalShow}
                        list={list}
                        setList={setList}
                        ProductList={MyProList}
                        onReload={(e) => e.preventDefault()}
                        onLoad={(e) => {
                            if (data && Array.isArray(data.results)) {
                                const updatedData = data.results.concat(e);
                                setData({ ...data, results: updatedData });
                                setCreateModalShow(false)
                            }
                        }}
                        onHide={() => setCreateModalShow(false)}
                    /> : null
            }

            {
                PushItemID &&
                <PushBackModal
                    item={PushItemID}
                    show={PushModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => { setStatusFilter({ value: 2, label: 'Push Back' }); setPushItemID(false); setPushModalShow(false) }}
                    onHide={() => { setPushItemID(false); setPushModalShow(false) }}
                />
            }
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
                EditItemModalShow &&
                <UpdateModal
                    item={EditItem}
                    show={EditItemModalShow}
                    list={list}
                    setList={setList}
                    onLoad={(e) => {
                        if (data && Array.isArray(data.results)) {
                            let updatedData = data.results.map(item => {
                                if (item.id === e.id) { // Replace 'id' with your unique identifier
                                    return { ...item, ...e }; // If it's the item we want to update, return the updated item
                                }
                                return item; // Otherwise, return the item unchanged
                            });

                            setData({ ...data, results: updatedData });
                            setEditItemModalShow(false)
                        }
                    }}
                    onClose={() => { setEditItemModalShow(false) }}
                    onHide={() => { setEditItemModalShow(false); }}
                />

            }
            {
                ViewModalShow &&
                <ViewModal
                    item={ItemID}
                    show={ViewModalShow}
                    list={list}
                    setList={setList}
                    onClose={() => setViewModalShow(false)}
                    onHide={() => setViewModalShow(false)}
                />
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
            {/* <InfoMessage
                header="Remove stock product!"
                body_header="Can not remove product"
                body="Product exist in physical store. So, you can not remove product without null stock"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            /> */}
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
    cat: state.auth.user.Role.CatCode,
});

export default connect(mapStateToProps, { logout })(ContainerList);