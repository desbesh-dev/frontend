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
import VirtualizedSelect from "react-virtualized-select";
import 'react-virtualized-select/styles.css';
// import 'react-virtualized/styles.css';

import { PaymentTerms } from '../../../actions/InventoryAPI';
import { FetchPurchaseInvoice } from '../../../actions/SuppliersAPI';
import '../../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { InvoicePrint } from '../../Suppliers/MySuppliers/Profiles/ViewInvoice/InvoicePrint';
import { Pagination } from '../SellReport/SellReportPagination';
import { DeleteModal, UpdateModal } from "./Modals/ModalForm.js";

let today = new Date();
const PurchaseReport = ({ list, setList, no }) => {
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [Date, setDate] = useState(today)
    const [Data, setData] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [StockItem, setStockItem] = useState(false)

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(150);

    const [SectorFilter, setSectorFilter] = useState(null);
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchase_report/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            params: {
                date: date,
                page: currentPage,
                page_size: itemsPerPage,
                sister: SisterFilter?.value,
                sector: SectorFilter?.value,
                pay_type: PayTypeFilter?.value,
                no: SearchKey?.value,
            },
        });
        setData(res.data);
        setLoading(false);
    }, [Date, currentPage, itemsPerPage, SectorFilter, PayTypeFilter, SearchKey]);

    useEffect(() => {
        fetchData(Date);
    }, [fetchData]);

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
        var result = await FetchPurchaseInvoice(item.id);
        if (result !== true)
            InvoicePrint(e, result, false)
    }

    var h = window.innerHeight - 215;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 px-0">
                {/* ORDER HISTORY */}
                <div className="row d-flex bg-white mx-auto my-2 py-1 m-0">
                    <div className="d-flex justify-content-between align-items-center bg-white p-0">
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap my-0 px-2'>PURCHASE REPORTS</p>
                        <div className="d-flex justify-content-around mx-2 w-100">
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Invoice: {parseFloat(Data?.count).toLocaleString("en-GB", { minimumFractionDigits: 0 })}</p>
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Purchase: {parseFloat(Data?.Purchase).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Liquid: {parseFloat(Data?.Liquid).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                            <p className='text-dark fs-4 fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>Due: {parseFloat(Data?.Due).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="d-flex justify-content-end mx-2">
                            <Datepicker
                                selected={Date}
                                className="form-control fw-bold round_radius50px text-center p-0 m-0"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => setDate(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
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
                                onChange: (e) => setSisterFilter(e),
                                id: "Sister"
                            },
                            {
                                label: "Sector Filter",
                                options: Data.Sector,
                                value: SectorFilter,
                                onChange: (e) => setSectorFilter(e),
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
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                // options={Data.map}
                                options={PaymentTerms}
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
                                options={Data.no}
                                name="Title"
                                menuBuffer={100}
                                required
                                id="Title"
                                value={SearchKey}
                                optionLabel="combinedLabel"
                                onChange={(e) => setSearchKey(e)}
                            />
                        </div>

                    </div>
                </div>

                {Data?.results?.length ? (
                    loading ? (
                        <p className='text-center fs-4'><i class="fad fa-spinner-third"></i> Loading...</p>
                    ) : <>
                        <div className='tableFixHead w-100 bg-white' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless table-responsive card-1 d-table mt-1`}>
                                <thead>
                                    <tr className="text-center">
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Rec. Date</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Purchase No</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Invoice No</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Qty</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Weight</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Amount</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Vat</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Discount</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Paid</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Due</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Credit</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Payment</span></th>
                                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Reciever</span></th>
                                        {no <= 7 && <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Sector</span></th>}
                                        <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        Data.results.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="border-right p-1" style={{ whiteSpace: 'nowrap' }}><span className="d-block fs-6 fw-bold text-center text-dark p-0">{moment(item.RcvDate).format('DD MMM YYYY')}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.SupplierTitle}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.PurchaseNo}</span> </td>

                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.InvoiceNo}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Vat).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{getLabel(parseInt(item.Payment), PaymentTerms)}</span></td>
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Receiver}</span></td>
                                                {no <= 7 && <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.SectorNo + ". " + item.SectorTitle}</span></td>}
                                                <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                                    <button title="Delete Invoice" className="btn fs-5 px-2 py-0 fad fa-trash-alt text-dark" onClick={() => { setDeleteData(item); setDeleteModalShow(true) }} />
                                                    <button title="Print Invoice" className="btn fs-5 px-2 py-0 fad fa-print text-dark" onClick={(e) => GetInvoiceData(e, item)} />
                                                    <Link title="Show Invoice" className="btn fs-5 px-2 py-0 fad fa-eye text-dark" id="view" to={`/purs_invoice_preview/${item.id}`} />
                                                </span>
                                                </td>

                                            </tr>
                                        ))
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
                        <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
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
                FullName={DeleteData ? DeleteData.FarmTitle + ", Invoice No-" + DeleteData.PurchaseNo : null}
                PurchaseNo={DeleteData ? DeleteData.PurchaseNo : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteClick={(e) => DeleteInvoice(e, DeleteData.id)}
                onHide={() => { setDeleteModalShow(false); setDeleteData(false) }}
            />
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

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
});

export default connect(mapStateToProps, { logout })(PurchaseReport);