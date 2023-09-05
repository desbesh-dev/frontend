import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DispatchInvoiceDelete, getLabel } from '../../../actions/ContractAPI';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

import { PaymentTerms } from '../../../actions/InventoryAPI';
import { FetchPrintInvoice } from '../../../actions/PartyAPI';
import { FetchDeliveryNote, UpdateDeliveryNote } from '../../../actions/YardAPI';
import { InvoicePrint } from '../../Trading/InvoicePrint';
import { DeliveryNotePrint } from './DeliveryNotePrint';

const DeliveryNoteView = ({ user, list, setList, DeliveryNoteID, cat }) => {
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [Error, setError] = useState({});
    const [showFullAddress, setShowFullAddress] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Item, setItem] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)

    let toastProperties = null;

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        GetDeliveryNoteData();
    }, [])

    const GetDeliveryNoteData = async () => {
        setItem(false);
        var result = await FetchDeliveryNote(DeliveryNoteID);
        if (result !== true) {
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

    const getTotal = () => {
        let TotalPrice = 0;
        const price = Data.DeliveryMapData.map(row => row.Qty * row.Rate);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    function calculateTotals(dataType) {
        let DeliveryMapData;
        if (dataType === "DeliveryMapData") {
            DeliveryMapData = Data?.DeliveryMapData || [];
            return DeliveryMapData.reduce((acc, { Qty, Weight }) => {
                acc.QuantityTotal += parseFloat(Qty, 10);
                acc.WeightTotal += parseFloat(Weight, 10);
                return acc;
            }, { QuantityTotal: 0, WeightTotal: 0.000 });

        }
    }

    const StockIn = async (e) => {
        e.preventDefault();
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await UpdateDeliveryNote(DeliveryNoteID)
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                if (result.exception && result.exception.entries) {
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                    }
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                setData(result.CallBack)
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }

    const GetInvoiceData = async (e) => {
        e.preventDefault()
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setItem(false);
        var result = await FetchPrintInvoice(Data.InvoiceID);
        if (result !== true) {
            InvoicePrint(e, result, false)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const { QuantityTotal = "0", WeightTotal = "0.000" } = calculateTotals("DeliveryMapData");

    const grand_tot = (parseFloat(Data?.GrandTotal || 0.00) - parseFloat(Data?.Discount || 0.00)) + parseFloat(Data?.Shipping || 0.00)
    var h = window.innerHeight - 346;

    return (
        <div className="container bg-white rounded px-2" style={{ position: "relative" }}>
            <div className="d-flex justify-content-between my-0 bg-white border-bottom py-2">
                <div className='my-auto text-center'>
                    <p className='display-6 fw-bolder m-0 text-uppercase text-left'><button className=" btn fs-3 fad fa-chevron-left px-2 text-dark text-decoration-none" onClick={() => history.goBack()}></button>Delivery Note</p>
                </div>

                <div className='text-center'>
                    <button title="View Order" className="btn fs-3 px-3 py-0 fad fa-print text-dark" id="Delivery Note" onClick={(e) => DeliveryNotePrint(e, Data, false)} />
                    {
                        Data.Status === 3 && Data.InvoiceID ?
                            <button title="Stock In" className="btn fs-3 px-3 py-0 fad fa-file-invoice text-dark" id="Invoice" onClick={(e) => GetInvoiceData(e)} />
                            : Data.Status === 2 && cat !== 5 &&
                            < button title="Stock In" className="btn fs-3 px-3 py-0 fad fa-inbox-in text-dark" id="Received" onClick={(e) => StockIn(e)} />
                    }
                    {/* <button title="Stock In" className="btn fs-3 px-3 py-0 fad fa-inbox-in text-dark" id="Received" onClick={(e) => StockIn(e)} /> */}

                    {Data.PartyID ?
                        <>
                            {/* <button title="Save PDF" className="btn fs-3 px-3 py-0 fad fa-file-pdf text-dark border-right" id="Save PDF" onClick={(e) => InvoicePrint(e, Data, true)} /> */}
                            {/* <button title="Print" className="btn fs-3 px-3 py-0 fad fa-print text-dark" id="Print" onClick={(e) => InvoicePrint(e, Data, false)} /> */}
                        </>
                        :
                        <>
                            {/* <button title="Save PDF" className="btn fs-3 px-3 py-0 fad fa-file-pdf text-dark border-right" id="Save PDF" onClick={(e) => Receipt(e, Data, true)} /> */}
                            {/* <button title="Print" className="btn fs-3 px-3 py-0 fad fa-print text-dark" id="Print" onClick={(e) => Receipt(e, Data, false)} /> */}
                        </>
                    }
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
                                        <p className="fs-4 fw-bold m-0">{Data?.ReqToSister}</p>
                                        <p className="text-muted m-0">{`${Data?.ReqToSector}  (${Data?.ReqToShortCode})`}</p>
                                        <p className='fw-bold m-0'>{`${Data?.Sender}`}
                                            <p className='fw-bolder m-0'>{`Order Date: ${moment(Data.Date).format("DD MMM YYYY")}`}</p>
                                            <p className='fw-bolder m-0'>{`Delivery Date: ${moment(Data.DeliveryDate).format("DD MMM YYYY")}`}</p>
                                        </p>
                                    </div>
                                </div>
                                : null
                        }
                        <div className='text-right'>
                            {
                                Data ?
                                    <div className="card-body p-0">
                                        <p className="fs-4 fw-bold m-0">{Data?.ReqForSister}</p>
                                        <small className="text-muted p-0">{Data?.ReqForSector + " (" + Data?.ReqForShortCode + ")"}</small>
                                        <div onMouseEnter={() => setShowFullAddress(true)} onMouseLeave={() => setShowFullAddress(false)}>
                                            <p className="fs-6 m-0" style={{ maxWidth: "50ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>
                                                {Data?.PartyAddress?.substr(0, 50)}
                                            </p>
                                            {
                                                showFullAddress &&
                                                <p className="fs-6 m-0" style={{ display: "block", position: "absolute", backgroundColor: "#f2f2f2", padding: "5px", zIndex: 1 }}>
                                                    {Data.PartyAddress}
                                                </p>
                                            }
                                        </div>
                                        <p className="fs-6 fw-bolder m-0">{`Payment Term: ${getLabel(Data?.Payment, PaymentTerms)}`}</p>
                                    </div>
                                    :
                                    null
                            }
                            {/* <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC : "N/A"}</small> */}
                        </div>
                    </div>

                    <div className="row pt-2">
                        <div className="col-md-12 text-center">
                            <p className="fs-3 fw-bolder m-0">{`DELIVERY NOTE NO# ${Data?.DeliveryNoteNo}`}</p>
                        </div>
                    </div> <br />
                    {Array.isArray(Data.DeliveryMapData) && Data.DeliveryMapData.length ?
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
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Qty</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Weight</span></th>
                                        <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Rate</span></th>
                                        {/* <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Return</span></th> */}
                                        <th className="p-1"><span>Sub-total</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Data.DeliveryMapData.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.SLNo}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.Code}</span></td>
                                                <td className="p-0 border-right">
                                                    <span className="d-block fw-bold text-left px-1">
                                                        {item.Title}
                                                    </span>
                                                    <small className="d-block fw-bold text-warning text-left px-1">
                                                        {item.CtrNo}
                                                    </small>
                                                </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.UnitName === "Retail" ? "L/S" : item.UnitName}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{parseFloat(item.UnitQty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.UnitWeight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Rate).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0"><span className="d-block fw-bold text-right px-1">{parseFloat(item.SubTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                {/* <td className="p-0">
                                                    <button className="btn fs-4 p-0 text-danger" title="Return" onClick={() => { setItem(item); setInfoModalShow(true) }}>
                                                        <i className="fad fa-people-carry"></i>
                                                    </button>
                                                </td> */}
                                            </tr>
                                        ))
                                    }

                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right">Sub-total </span> </td>
                                        <td className="py-0 text-right px-1">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right">10% GST Included </span> </td>
                                        <td className="py-0 text-right px-1">{parseFloat(Data?.Vat || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right ">Discount (K) </span> </td>
                                        <td className="py-0 text-right px-1">{parseFloat(Data?.Discount || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right ">Shipping Cost (K) </span> </td>
                                        <td className="py-0 text-right px-1">{parseFloat(Data?.Shipping || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr className="text-center border-success bg-white">
                                        <td className="py-0 px-1 border-right" colSpan="9"><span className="d-block text-right fw-bold">Total Price </span> </td>
                                        <td className="py-0 px-1"><span className="d-block fw-bold text-right">{parseFloat(grand_tot || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr>

                                    <tr className="text-center border-success bg-white">
                                        <td className="p-1 px-1 border-right" colSpan="9"><span className="d-block text-right fw-bold">Paid </span> </td>
                                        <td className="py-0 text-right px-1">{parseFloat(Data?.Paid || 0.00).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                    </tr>

                                    <td colSpan={11} className="p-1 text-center border border-light mt-3">
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Item: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{Array.isArray(Data.DeliveryMapData) && Data.DeliveryMapData.length}</span></span>
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Total Qty: <span className="d-inline-block text-left fw-bolder mr-3 p-0">{QuantityTotal}</span></span>
                                        <span className="d-inline-block text-right fw-bold mr-3 p-0">Total Wt: <span className="d-inline-block text-left fw-bolder p-0">{WeightTotal.toLocaleString("en", { minimumFractionDigits: 3 })}</span></span>
                                    </td>


                                </tbody>
                            </table>
                        </div>
                        :
                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                            <p className='fs-2 fw-bold text-center text-success m-0'>No Data Found!</p>
                        </div>
                    }

                    <div>
                        {
                            Data ?
                                <div className="col-md-12 d-flex justify-content-between align-items-center mb-4">
                                    <p className='fs-5 fw-bold text-left text-success m-0'>{`Created At- ${moment(Data.CreatedAt).format("DD MMM YYYY, h:mm:S A")}`}</p>
                                    <p className='fs-5 fw-bold text-left text-success m-0'>{`Last Update- ${moment(Data.UpdatedAt).format("DD MMM YYYY, h:mm:S A")}`}</p>
                                    <p className='fs-5 fw-bold text-left text-dark m-0'>Last Updated By: <i className="fad fa-user-tie pr-2"> </i>{Data.UpdatedBy}</p>
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
            {/* <DeleteModal
                FullName={DeleteData ? DeleteData.PartyTitle + ", Invoice No-" + DeleteData.InvoiceNo : null}
                // InvoiceNo={DeleteData ? All of items & quantities <strong>(Invoice No-{DeleteData.InvoiceNo})</strong> will be re-instate to the stock. : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteAction={(e) => DeleteInvoice(e, DeleteData.id)}
                DeleteHide={() => { setDeleteModalShow(false); setDeleteData(false) }}
            /> */}
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    DeliveryNoteID: props.match.params.id,
    cat: state.auth.user.Role.CatCode,
});

export default connect(mapStateToProps, { logout })(DeliveryNoteView);