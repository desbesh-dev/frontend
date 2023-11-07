import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DispatchInvoiceDelete, getLabel } from '../../../../../actions/ContractAPI';
import { logout } from '../../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import infoIcon from '../../../../../assets/info.png';
import successIcon from '../../../../../assets/success.png';

import { PaymentTerms, RtnPursItemDelete } from '../../../../../actions/InventoryAPI';
import { FetchPrintOrder } from '../../../../../actions/PartyAPI';
import { CreateNote, DeleteModal, EditModal, InfoMessage } from "./Modals/ModalForm.js";
// import { InvoicePrint } from '../InvoicePrint';
import { FetchPurchaseInvoice } from '../../../../../actions/SuppliersAPI';
import { InvoicePrint } from './InvoicePrint';
import { NotePrint } from './NotePrint';
// import { OrderPrint } from '../OrderPrint';
const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

const ViewPurchase = ({ user, list, setList, PurchaseID }) => {

    const [NoteItem, setNoteItem] = useState(false);
    const [NoteModalShow, setNoteModalShow] = useState(false);

    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [EditModalShow, setEditModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);

    const [RemoveModalShow, setRemoveModalShow] = useState(false);
    const [ItemID, setItemID] = useState(false);

    const [showFullAddress, setShowFullAddress] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Item, setItem] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [Error, setError] = useState({});

    const [PurchaseMapReturn, setPurchaseMapReturn] = useState([])
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)

    let toastProperties = null;

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        GetInvoiceData();
    }, [])

    const GetInvoiceData = async () => {
        setNoteItem(false);
        setNoteModalShow(false)
        setItem(false);
        var result = await FetchPurchaseInvoice(PurchaseID);
        if (result !== true) {
            setPurchaseMapReturn(result.PurchaseMapReturn)
            setData(result)
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
                history.push('/con_dispatch_report');
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

    const RemoveRtnItem = async (e, id) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RtnPursItemDelete(id);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Item',
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
                GetInvoiceData();
                setItemID(false);
                setRemoveModalShow(false);
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to remove return item. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const getTotal = () => {
        let TotalPrice = 0;
        const price = Data.PurchaseMapData.map(row => row.Remark !== "Bonus" && parseFloat(row.SubTotal));
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    function calculateTotals(dataType) {
        let PurchaseMapData;
        if (dataType === "PurchaseMapData") {
            PurchaseMapData = Data?.PurchaseMapData || [];
            return PurchaseMapData.reduce((acc, { Qty, Weight }) => {
                acc.QuantityTotal += parseFloat(Qty, 10);
                acc.WeightTotal += parseFloat(Weight, 10);
                return acc;
            }, { QuantityTotal: 0, WeightTotal: 0.000 });
        } else if (dataType === "PurchaseMapReturn") {
            PurchaseMapData = PurchaseMapReturn || [];
            return PurchaseMapData.reduce((acc, { Qty, Weight, SubTotal }) => {
                acc.RtnQty += parseFloat(Qty, 10);
                acc.RtnWeight += parseFloat(Weight, 10);
                acc.RtnSubTotal += parseFloat(SubTotal, 10);
                return acc;
            }, { RtnQty: 0, RtnWeight: 0.000, RtnSubTotal: 0.00 });
        }
    }

    const { QuantityTotal = "0", WeightTotal = "0.000" } = calculateTotals("PurchaseMapData");
    const { RtnQty = "0", RtnWeight = "0.000", RtnSubTotal = "0.00" } = calculateTotals("PurchaseMapReturn");

    const deleteRtn = (i) => {
        if (!Array.isArray(PurchaseMapReturn) || !PurchaseMapReturn) return;
        setPurchaseMapReturn([...PurchaseMapReturn.slice(0, i), ...PurchaseMapReturn.slice(i + 1)]);
        setPaid(0.00);
    };

    const PrintOrder = async (e, id) => {
        var result = await FetchPrintOrder(id);
        if (result !== true)
            // OrderPrint(e, result, false)
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    var h = window.innerHeight - 346;

    return (
        <div className="container bg-white rounded px-2" style={{ position: "relative" }}>
            <div className="d-flex justify-content-between my-0 bg-white border-bottom py-2">
                <div className='my-auto text-center'>
                    <p className='display-6 fw-bolder m-0 text-uppercase text-left'><button className=" btn fs-3 fad fa-chevron-left px-2 text-dark text-decoration-none" onClick={() => history.goBack()}></button> Received Invoice</p>
                </div>

                <div className='text-center'>
                    {
                        Data.OrderID &&
                        <button title="View Order" className="btn fs-3 px-3 py-0 fad fa-file-alt text-dark border-right" id="View Order" onClick={(e) => PrintOrder(e, Data.OrderID)} />
                    }
                    <button title="Save PDF" className="btn fs-3 px-3 py-0 fad fa-file-pdf text-dark border-right" id="Save PDF"
                        onClick={(e) => InvoicePrint(e, Data, true)}
                    />
                    <button title="Print" className="btn fs-3 px-3 py-0 fad fa-print text-dark" id="Print"
                        onClick={(e) => InvoicePrint(e, Data, false)}
                    />
                </div>
                {Data ?
                    <div className='text-right'>
                        <button title="Delete Invoice" className="btn fs-3 px-2 py-0 fad fa-trash-alt text-dark" id="view" onClick={() => { setDeleteData(Data); setDeleteModalShow(true) }} />
                    </div> : null}
            </div>

            <div className="row justify-content-center py-2 mt-2 p-0">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between pb-2">
                        {
                            Data ?
                                <div className='my-auto text-left'>
                                    {/* <img className="img-fluid" width="100" height="100" alt="company_logo" src={Data ? Data.CompanyID.Logo : ''} /> */}
                                    <div className="card-body p-0">
                                        <p className="fs-4 fw-bold m-0">{Data?.SisterName}</p>
                                        <p className="text-muted m-0">{`${Data?.SectorName}  (${Data?.ShortCode})`}</p>
                                        <p className='fw-bold m-0'>{`Received Date: ${moment(Data.RcvDate).format("DD MMM YYYY")}`}</p>
                                        <p className='fw-bold m-0'>{`P/O No: ${Data.OrderNo ? Data.OrderNo : "N/A"}`}</p>
                                        <p className='fw-bold m-0'>{`Purchase No: ${Data.PurchaseNo}`}</p>
                                    </div>
                                </div>
                                : null
                        }
                        <div className='text-right'>
                            {
                                Data ?
                                    <div className="card-body p-0">
                                        <p className="fs-4 fw-bold m-0">{Data?.SupplierTitle}</p>
                                        <small className="text-muted p-0">{Data?.SupplierContact}</small>
                                        <div onMouseEnter={() => setShowFullAddress(true)} onMouseLeave={() => setShowFullAddress(false)}>
                                            <p className="fs-6 m-0" style={{ maxWidth: "50ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>
                                                {Data?.SupplierAddress?.substr(0, 50)}
                                            </p>
                                            {
                                                showFullAddress &&
                                                <p className="fs-6 m-0" style={{ display: "block", position: "absolute", backgroundColor: "#f2f2f2", padding: "5px", zIndex: 1 }}>
                                                    {Data.SupplierAddress}
                                                </p>
                                            }
                                        </div>
                                        <p className='fw-bold m-0'>{`Invoice Date: ${moment(Data.InvDate).format("DD MMM YYYY")}`}</p>
                                        <p className="fs-6 fw-bolder m-0">{`Payment Term: ${getLabel(Data?.Payment, PaymentTerms)}`}</p>
                                        <p className='fw-bold m-0'>{`Invoice No: ${Data.InvoiceNo}`}</p>

                                    </div>
                                    :
                                    null
                            }
                            {/* <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC : "N/A"}</small> */}
                        </div>
                    </div>

                    <div className="row pt-2">
                        <div className="col-md-12 text-center">
                            <p className="fs-3 fw-bolder m-0">{`PURCHASE NO# ${Data.PurchaseNo},     INVOICE# ${Data?.InvoiceNo}`}</p>
                        </div>
                    </div> <br />
                    {Array.isArray(Data.PurchaseMapData) && Data.PurchaseMapData.length ?
                        <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                            <table className={`table table-hover table-borderless`}>
                                <thead>
                                    <tr className="text-center text-uppercase">
                                        <th className="p-1 border-right"><span>S/N</span></th>
                                        <th className="p-1 border-right"><span>Code</span></th>
                                        <th className="p-1 border-right"><span>Product Name</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Unit Name</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Unit Qty</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Unit Wt</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Quantity</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Weight</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Rate</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Sub-total</span></th>
                                        <th className="p-1"><span>Return</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Data.PurchaseMapData.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.SLNo}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.Code}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.UnitName === "Retail" ? "L/S" : item.UnitName}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{parseFloat(item.UnitQty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Weight / item.UnitQty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Rate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.SubTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0">
                                                    <button className="btn fs-4 p-0 text-danger" title="Return" onClick={() => { setItem(item); setInfoModalShow(true) }}>
                                                        <i class="fad fa-people-carry"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right">Sub-total </span> </td>
                                        <td className="py-0 border-right text-right px-1">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right">10% GST Included </span> </td>
                                        <td className="py-0 border-right text-right px-1">{parseFloat(Data?.Vat || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right ">Discount (K) </span> </td>
                                        <td className="py-0 border-right text-right px-1">{parseFloat(Data?.Discount || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right fw-bold">Total Price </span> </td>
                                        <td className="py-0 border-right px-1"><span className="d-block fw-bold text-right">{Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr>

                                    {
                                        Array.isArray(PurchaseMapReturn) && PurchaseMapReturn.length ?
                                            <>
                                                <tr className="border-top py-2" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                                    <td className="py-1 d-table-cell" style={{ display: "table-cell", verticalAlign: "bottom" }}><span className="d-block fw-bolder px-1">{Data.Note?.NoteDate || "N/A"}</span></td>
                                                    <td colSpan={5} className="py-1 d-table-cell" style={{ display: "table-cell", verticalAlign: "bottom" }}><span className="d-block fw-bolder px-1">RETURN PRODUCTS</span></td>
                                                    <td colSpan={4} className="py-1 d-table-cell" style={{ display: "table-cell", verticalAlign: "bottom" }}><span className="d-block fw-bold px-1">{Data.Note ? "Debit note has been issued" : "Debit note has not issued yet"}</span>
                                                    </td>
                                                    <td className="p-0 text-center d-table-cell" style={{ display: "table-cell", verticalAlign: "bottom" }}>
                                                        {Data.Note ?
                                                            <button className="btn fs-4 text-danger text-center" title="Debit Note" onClick={(e) => NotePrint(e, Data, false)}>
                                                                <i class="fad fa-print"></i>
                                                            </button>
                                                            :
                                                            <button className="btn fs-4 text-danger text-center" title="Debit Note" onClick={() => { setNoteItem({ SupplierID: Data?.SupplierID, Name: Data?.SupplierTitle, Amount: RtnSubTotal, NoteType: 3, NoteName: "Debit Note", PurchaseID: Data?.id, PurchaseNo: Data?.PurchaseNo, InvoiceNo: Data?.InvoiceNo, Count: Array.isArray(PurchaseMapReturn) && PurchaseMapReturn.length }); setNoteModalShow(true) }}>
                                                                <i class="fad fa-file-edit"></i>
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                                {PurchaseMapReturn.map((item, i) => (
                                                    <tr className="border-bottom text-center" key={i}>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.SLNo}</span></td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.Code}</span></td>
                                                        <td className="p-0 border-right">
                                                            <span className="d-block fw-bold text-left align-items-end px-1">{item.Title}</span>
                                                            <small className="d-block fw-normal text-left text-muted px-1">{item.Remark}</small>
                                                        </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.UnitName === "Retail" ? "L/S" : item.UnitName}</span></td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{parseFloat(item.UnitQty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.UnitWeight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Rate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.SubTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="p-0">
                                                            <button className="btn fs-4 text-danger" title="Delete" onClick={() => { setItemID(item); setRemoveModalShow(true) }}>
                                                                <i class="fad fa-trash"></i>
                                                            </button>
                                                            <button className="btn fs-4 text-danger" title="Remove" onClick={() => deleteRtn(i)}>
                                                                <i class="fad fa-minus"></i>
                                                            </button>

                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="text-center border-success bg-white">
                                                    <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right">Sub-total </span> </td>
                                                    <td className="py-0 border-right text-right px-1">{RtnSubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            </>
                                            : null
                                    }

                                    <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-1 border-right" colSpan="9"><span className="d-block text-right fw-bold">Paid </span> </td>
                                        <td className="py-0 border-right text-right px-1">{parseFloat(Data?.Paid || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>

                                    <td colSpan={11} className="p-1 text-center border border-light mt-3">
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Item: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{Array.isArray(Data.PurchaseMapData) && Data.PurchaseMapData.length}</span></span>
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Total Qty: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{QuantityTotal}</span></span>
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Total Wt: <span className="d-inline-block text-left fw-bolder p-0">{WeightTotal.toLocaleString("en", { minimumFractionDigits: 3 })}</span></span>
                                        {Array.isArray(PurchaseMapReturn) && PurchaseMapReturn.length ?
                                            <Fragment>
                                                <span className="d-inline-block text-right fw-bold mr-3 p-0">Return Items: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{Array.isArray(PurchaseMapReturn) && PurchaseMapReturn.length}</span></span>
                                                <span className="d-inline-block text-right fw-bold mr-3 p-0">Return Qty: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{RtnQty}</span></span>
                                                <span className="d-inline-block text-right fw-bold mr-3 p-0">Return Wt: <span className="d-inline-block text-left fw-bolder p-0">{RtnWeight.toLocaleString("en", { minimumFractionDigits: 3 })}</span></span>
                                            </Fragment>
                                            : null}
                                    </td>


                                </tbody>
                            </table>
                        </div>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                        </div>
                    }

                    <div>
                        {
                            Data ?
                                <div className="col-md-12 d-flex justify-content-between align-items-center mb-4">
                                    <p className='fs-5 fw-bold text-left text-success m-0'>{`Created At- ${moment(Data.CreatedAt).format("DD MMM YYYY, h:mm:S A")}`}</p>
                                    <p className='fs-5 fw-bold text-left text-success m-0'>{`Last Update- ${moment(Data.UpdatedAt).format("DD MMM YYYY, h:mm:S A")}`}</p>
                                    <p className='fs-5 fw-bold text-left text-dark m-0'>Last Updated By: <i class="fad fa-user-tie pr-2"> </i>{Data.UpdatedBy}</p>
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
            <InfoMessage
                header="Return Dispatch Product"
                body_header="Do you want to return the products?"
                body={Item ? InfoModalShow ? Item.Title + ", Quantity-" + Item.Qty.toLocaleString("en", { minimumFractionDigits: 2 }) + ", Weight-" + Item.Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : null : null}
                show={Item ? InfoModalShow : false}
                InfoEdit={() => { setInfoModalShow(false); setEditModalShow(true) }}
                // InfoAction={() => RecallAction(Item)}
                InfoHide={() => setInfoModalShow(false)}
            />
            {Item ?
                <EditModal
                    list={list}
                    setList={setList}
                    EditData={Item}
                    PurchaseID={Data.id}
                    show={Item ? EditModalShow : false}
                    EditReload={() => GetInvoiceData()}
                    EditHide={() => { setItem(false); setEditModalShow(false) }}
                /> : null}

            <DeleteModal
                FullName={DeleteData ? DeleteData.SupplierTitle + ", Invoice No-" + DeleteData.InvoiceNo : null}
                // InvoiceNo={DeleteData ? All of items & quantities <strong>(Invoice No-{DeleteData.InvoiceNo})</strong> will be re-instate to the stock. : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteAction={(e) => DeleteInvoice(e, DeleteData.id)}
                DeleteHide={() => { setDeleteModalShow(false); setDeleteData(false) }}
            />
            {
                ItemID ?
                    <DeleteModal
                        FullName={`Do you want to remove ${ItemID.Title} from return list?`}
                        InvoiceNo={`${ItemID.Title} Qty-${ItemID.Qty} with ${ItemID.Weight}Kg stock will be reinstate the inventory.`}
                        show={ItemID ? RemoveModalShow : false}
                        DeleteAction={(e) => RemoveRtnItem(e, ItemID.id)}
                        DeleteHide={() => { setRemoveModalShow(false); setItemID(false) }}
                    />
                    : null
            }
            {
                NoteItem ?
                    <CreateNote
                        list={list}
                        setList={setList}
                        item={NoteItem}
                        show={NoteItem ? NoteModalShow : false}
                        onReload={() => GetInvoiceData()}
                        onHide={() => { setNoteItem(false); setNoteModalShow(false) }}
                    /> : null
            }
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    PurchaseID: props.match.params.pur_id,
});

export default connect(mapStateToProps, { logout })(ViewPurchase);