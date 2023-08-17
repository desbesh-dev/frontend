import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { DispatchInvoiceDelete, FetchDispatch } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import { DeleteModal, UpdateModal } from "./Modals/ModalForm.js";

import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

const ContractDispatchReport = ({ scale, sub_scale, user, list, setList }) => {
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Date, setDate] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    const [SearchKey, setSearchKey] = useState(false)
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadDispatch();
    }, [])

    const LoadDispatch = async () => {
        if (user !== null) {
            let ProductSent_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC_ID : "N/A"
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchDispatch(ProductSent_ID, moment(today).format("YYYY-MM-DD"));
            if (result !== true) {
                setData(result.data);
            } else {
                // history.push('/not_found');
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/');
        }
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
                LoadDispatch();
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

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        let ProductSent_ID = JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC_ID : "N/A"
        var result = await FetchDispatch(ProductSent_ID, date);
        if (result !== true) {
            setData(result.data);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        setDate(e)
    }

    // 
    return (
        <div className="position-relative h-100"
        // style={{ height: "95%" }}
        >
            <div className="position-absolute overflow-auto my-1 w-100 h-100">

                {/* ORDER HISTORY */}
                <div className={`row justify-content-center mx-auto d-table w-100 h-100`}>

                    <div className={`d-flex justify-content-between bg-white py-2 mt-2 border-bottom`}>
                        <p className='display-6 bg-white fw-bolder m-0'>DISPATCH REPORT</p>
                        <div className="d-flex justify-content-end" style={{ minWidth: "10vh", maxHeight: "4vh" }}>
                            <Datepicker
                                selected={Date}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => DateHandler(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                            <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                            <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                        </div>
                    </div>

                    {Array.isArray(Data) && Data.length ?
                        <table className={`table table-hover table-borderless table-responsive card-1 d-table mt-1`}>
                            <thead>
                                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Date</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Invoice No</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Farm Name</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Products Summary</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Amount</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Batch ID/No</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Farm ID</span></th>
                                    <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">User ID</span></th>
                                    <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase"> Action </span></th>
                                </tr>
                            </thead>
                            {
                                Data.map((item, i) => (

                                    <tbody>
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{moment(item.Date).format('DD MMM YYYY')}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.InvoiceNo}</span> </td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.FarmTitle}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{
                                                item.Category.map(x => x.ItemCode__ProductID__Category + "- " + x.dcount).join(' & ')
                                            }</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.BatchID + "/" + item.BatchNo}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.FarmID}</span></td>
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.UserID}</span> </td>
                                            <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                                <button title="Delete Invoice" className="btn fs-5 px-1 py-0 fad fa-trash-alt text-dark" onClick={() => { setDeleteData(item); setDeleteModalShow(true) }} />
                                                {/* <button title="Revert Product" className="btn fs-5 px-1 py-0 fad fa-vote-yea text-dark" onClick={() => { setStockItem(item); setDeleteModalShow(true) }} /> */}
                                                <Link title="Show Invoice" className="btn fs-5 px-1 py-0 fad fa-eye text-dark" id="view" to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? `/sr_prv_dispatch_invoice/${item.InvoiceNo}` : `/prv_dispatch_invoice/${item.InvoiceNo}`}`} />
                                            </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))
                            }
                        </table>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                        </div>
                    }
                </div>
            </div >
            {
                StockItem ?
                    <UpdateModal
                        Item={StockItem}
                        show={UpdateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => LoadDispatch()}
                        onHide={() => { setStockItem(false); setUpdateModalShow(false) }}
                    />

                    : null
            }
            <DeleteModal
                FullName={DeleteData ? DeleteData.FarmTitle + ", Invoice No-" + DeleteData.InvoiceNo : null}
                InvoiceNo={DeleteData ? DeleteData.InvoiceNo : null}
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
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { logout })(ContractDispatchReport);