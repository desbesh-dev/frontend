import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../../actions/auth';
import { FetchInvoice, RecallProduct, DispatchInvoiceDelete } from '../../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import * as moment from 'moment'
import Select from 'react-select';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

import { exportPDF } from './InvoicePDF';
import { Search } from 'semantic-ui-react';

import { EditModal, DeleteModal, InfoMessage } from "./Modals/ModalForm.js";

const ContractDispatchReport = ({ CompanyID, BranchID, SupplierID, user, list, setList, InvoiceNo }) => {
    var JsBarcode = require('jsbarcode');
    let canvas = document.createElement('CANVAS')
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [EditModalShow, setEditModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Item, setItem] = useState(false)
    const [DeleteData, setDeleteData] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    const [Error, setError] = useState({});
    const [SearchKey, setSearchKey] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadInvoice();
    }, [])

    const LoadInvoice = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchInvoice(InvoiceNo);
            if (result.status === 200) {
                setData(result.data[0]);
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/con_dispatch_report');
        }
    }

    const RecallAction = async (item) => {
        const result = await RecallProduct(item.id, item.ItemCode, item.Qty, item.Weight, item.SubTotal);
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
            LoadInvoice();
            setInfoModalShow(false);

        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Product return failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
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
        const price = OrderData.map(row => row.Quantity * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = Data ? Data.sellmap.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Qty, 10), 0) : "0";
    const WeightTotal = Data ? Data.sellmap.reduce((TotalWeight, myvalue) => TotalWeight + parseInt(myvalue.Weight, 10), 0) : "0.000";

    const deleteRow = (i) => {
        // make new rows. note: react state is immutable.
        const newRows = OrderData.splice(i, 1).concat(OrderData.slice(i + 1));
        // setRows({ OrderData: newRows })
        setCount(Count - 1)
    };


    const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    // const ImageEncode = async () => {
    //     const imgUrl = process.env.REACT_APP_API_URL + user.Logo;
    //     
    //     var img = new Image();
    //     img.src = imgUrl;
    //     img.crossOrigin = '';

    //     var canvas = document.createElement('canvas'),
    //         ctx = canvas.getContext('2d');

    //     canvas.height = img.naturalHeight;
    //     canvas.width = img.naturalWidth;
    //     ctx.drawImage(img, 0, 0);

    //     var b64 = await canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
    //     

    //     return b64;
    // }

    //for the demonstration purposes I used proxy server to avoid cross origin error

    // const filtered = Array.isArray(Data) && Data.length ? Data.filter(entry => Object.values(entry.ItemCode.Title).some(val => typeof val === "string" && val.includes(SearchKey))) : false;

    const findArrayElementByTitle = (Data, SearchKey) => {
        return Data.find((element) => {
            return element.ItemCode.Title === SearchKey;
        })
    }

    JsBarcode(canvas, Data.InvoiceNo, {
        font: "monospace",
        format: "CODE128",
        height: 25,
        displayValue: false,
        fontSize: 18,
        textMargin: 2,
        // textPosition: "top",
        // marginTop: 15,
        lineColor: "#3E4676",
    }).blank(2).render()

    return (
        <div className="position-relative h-100">
            <div className="container bg-white rounded">
                <div className="d-flex justify-content-between my-0 border-bottom py-2">
                    <div className='my-auto text-center'>
                        <p className='display-6 fw-bolder m-0 text-uppercase text-left'><Link className="fad fa-chevron-left px-2 text-dark text-decoration-none" to={`/con_dispatch_report`}></Link> Dispatch Invoice</p>
                    </div>

                    <div className='text-center'>
                        <button title="Generate PDF" className="btn fs-3 px-3 py-0 fad fa-file-pdf text-dark border-right" id="view"
                            onClick={(e) => exportPDF(e, Data, false)}
                        />
                        <button title="Print" className="btn fs-3 px-3 py-0 fad fa-print text-dark border-right" id="print"
                            onClick={(e) => exportPDF(e, Data, true)}
                        />
                        <Link title="POS Print" className="btn fs-3 px-3 py-0 fad fa-vote-yea text-dark" id="view"
                            // to={`/prv_dispatch_invoice/${item.InvoiceNo}`} 
                            to="#"
                        />
                    </div>
                    {Data ?
                        <div className='text-right'>
                            <button title="Delete Invoice" className="btn fs-3 px-2 py-0 fad fa-trash-alt text-dark" id="view"
                                onClick={() => { setDeleteData(Data); setDeleteModalShow(true) }}
                            />
                        </div> : null}
                </div>

                <div className="row justify-content-center py-2 mt-2 p-0">
                    <div className="col-md-10 col-md-offset-3 body-main">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-between pb-2">
                                {
                                    Data ?
                                        <div className='my-auto text-left'>
                                            {/* <img className="img-fluid" width="100" height="100" alt="company_logo" src={Data ? Data.CompanyID.Logo : ''} /> */}
                                            <div className="card-body p-0">
                                                <p className="fs-4 fw-bold m-0">{Data.CompanyID.Name}</p>
                                                <p className="text-muted m-0">{Data.BranchID.BranchID + ". " + Data.BranchID.Name + " Branch"}</p>
                                                <p className='fw-bold m-0'>{Data.BranchID.ContactNo}
                                                    {/* {"H#" + Data.BranchID.HoldingNo + ", Word No- " + Data.BranchID.WardNo + ", Postal Code- " + Data.BranchID.PostalCode}<br />
                                                    {Data.BranchID.VillageName + ", " + Data.BranchID.Union + ", " + Data.BranchID.Upazila + ", " + Data.BranchID.Zila + ", " + Data.BranchID.Division} */}
                                                </p>
                                                <small>{Data.BranchID.BranchEmail}</small>
                                            </div>
                                        </div>
                                        : null
                                }
                                <div className='text-right'>
                                    {
                                        Data ?
                                            <div className="card-body p-0">
                                                <p className="fs-4 fw-bold m-0">{Data.id + ". " + Data.BusinessID.Title}</p>
                                                <small className="text-muted p-0">{"Batch Id " + Data.BatchID.id + ", Batch No " + Data.BatchID.BatchNo}</small>
                                                <p className="fs-6 m-0">{Data.BatchID.CondID.Title}</p>
                                                <p className="fs-6 m-0">{Data.farm[0].Employee + ", " + Data.farm[0].ContactNo}</p>
                                            </div>
                                            :
                                            null
                                    }
                                    <small className="text-muted text-left fw-bold">* Account- {JSON.parse(localStorage.getItem("accounts")) ? JSON.parse(localStorage.getItem("accounts")).ProductSentAC : "N/A"}</small>
                                </div>
                            </div>

                            <div className="row pt-2">
                                <div className="col-md-12 text-center">
                                    <p className="fs-3 fw-bolder m-0">INVOICE</p>
                                    <p className="fs-4 fw-normal m-0">{Data.InvoiceNo}</p>
                                </div>
                            </div> <br />
                            {Array.isArray(Data.sellmap) && Data.sellmap.length ?
                                <table className={`table table-hover table-borderless table-responsive d-table`}>
                                    <thead>
                                        <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="p-1 border-right"><span>S/N</span></th>
                                            <th className="p-1 border-right"><span>Code</span></th>
                                            <th className="p-1 border-right"><span>Product Name</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Quantity</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Weight</span></th>
                                            <th className="p-1"><span>Return</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Data.sellmap.map((item, i) => (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1">{i + 1}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.ItemCode}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td className="p-0">
                                                        <button className="btn fs-4 p-0 text-danger" title="Return" onClick={() => { setItem(item); setInfoModalShow(true) }}>
                                                            <i className="fad fa-inbox-in"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            Array.isArray(Data.CallBack) && Data.CallBack.length ?
                                                <>
                                                    <tr className="border-bottom text-left">
                                                        <td colSpan={6} className="p-0"><span className="d-block fw-normal px-1">RECALL PRODUCTS</span></td>
                                                    </tr>
                                                    {Data.CallBack.map((item, i) => (
                                                        <tr className="border-bottom text-center" key={i}>
                                                            <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.SLNo}</span></td>
                                                            <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.ItemCode}</span></td>
                                                            <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                                            <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                            <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                            <td className="p-0"></td>
                                                        </tr>))}
                                                </>
                                                : null
                                        }


                                        <tr className="text-center border border-light mt-3">
                                            <td className="p-1"><span className="d-block text-right fw-bold">Count:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{Data ? Data.sellmap.length : 0}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bold">Total Quantity:</span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{QuantityTotal}</span> </td>
                                            <td className="p-1"><span className="d-block text-right fw-bold">Total Weight: </span> </td>
                                            <td className="p-1"><span className="d-block text-left fw-bolder">{WeightTotal.toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                                </div>
                            }

                            <div>
                                {
                                    Data ?
                                        <div className="col-md-12 d-flex justify-content-between align-items-center mb-4">
                                            <p className='fs-5 fw-bold text-left text-success m-0'>{Data ? "Date: " + moment(Data.Date).format("DD MMM YYYY") : null}</p>
                                            <img className="img my-auto" width="40%" alt="company_logo" src={Data ? canvas.toDataURL() : ''} />
                                            <p className='fs-5 fw-bold text-left text-dark m-0'><i class="fad fa-user-tie pr-2"> </i>{Data.SalesMan.id + ". " + Data.SalesMan.FirstName + " " + Data.SalesMan.LastName}</p>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <InfoMessage
                header="Return Dispatch Product"
                body_header="Do you want to return the products?"
                body={Item ? InfoModalShow ? Item.Title + ", Quantity-" + Item.Qty.toLocaleString("en", { minimumFractionDigits: 2 }) + ", Weight-" + Item.Weight.toLocaleString("en", { minimumFractionDigits: 3 }) : null : null}
                show={Item ? InfoModalShow : false}
                InfoEdit={() => { setInfoModalShow(false); setEditModalShow(true) }}
                InfoAction={() => RecallAction(Item)}
                InfoHide={() => setInfoModalShow(false)}
            />
            {Item ?
                <EditModal
                    list={list}
                    setList={setList}
                    EditData={Item}
                    show={Item ? EditModalShow : false}
                    EditReload={() => LoadInvoice()}
                    EditHide={() => { setEditModalShow(false); setItem(false) }}
                /> : null}

            <DeleteModal
                FullName={DeleteData ? DeleteData.BusinessID.Title + ", Invoice No-" + DeleteData.InvoiceNo : null}
                InvoiceNo={DeleteData ? DeleteData.InvoiceNo : null}
                show={DeleteData ? DeleteModalShow : false}
                DeleteAction={(e) => DeleteInvoice(e, DeleteData.id)}
                DeleteHide={() => { setDeleteModalShow(false); setDeleteData(false) }}
            />
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    InvoiceNo: props.match.params.inv_no,
});

export default connect(mapStateToProps, { logout })(ContractDispatchReport);