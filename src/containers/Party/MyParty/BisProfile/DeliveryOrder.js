import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { getLabel } from '../../../../actions/ContractAPI';
import { PaymentTerms } from '../../../../actions/InventoryAPI';
import { FetchPartyOrder, FetchPrintOrder, UpdateDlvStatus } from '../../../../actions/PartyAPI';
import { logout } from '../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { customHeader, locales } from "../../../Suppliers/Class/datepicker";
import { OrderPrint } from '../../../Trading/SaleOrder/OrderPrint';

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const DeliveryOrder = ({ user, PartyID, MyPartyID, id, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [Status, setStatus] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        OrderList();
        setDateTo(today);
    }, [])

    const UpdateInvoiceStatus = async (e, item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await UpdateDlvStatus(item.id, item.Status)
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

    const OrderList = async () => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyOrder(PartyID, date_from, date_to);

        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchPartyOrder(PartyID, date_from, date_to);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const PrintPDF = async (e, item) => {
        var result = await FetchPrintOrder(item.id);
        if (result !== true)
            OrderPrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500",
        }),
        menuList: provided => ({
            ...provided,
            backgroundColor: 'white',
        }),
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 1: return "Warehouse";
            case 2: return "Shipped";
            case 3: return "Delivered";
            case 4: return "Cancel";
            case 5: return "Postpond";
            default: return "N/A";
        }
    }

    var h = window.innerHeight - 290;

    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white py-1 px-0`}>
                <p className='display-6 bg-white fw-bolder m-0'>Delivery of Order</p>
                <div className="d-flex justify-content-end">
                    <Datepicker
                        selected={DateFrom}
                        className="form-control fs-5 fw-bold round_radius50px text-center"
                        dateFormat="dd MMM yyyy"
                        onChange={(e) => setDateFrom(e)}
                        renderCustomHeader={props => customHeader({ ...props, locale })}
                        locale={locales[locale]}
                        placeholderText="Date"
                    />
                    <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>To</p>
                    <Datepicker
                        selected={DateTo}
                        className="form-control fs-5 fw-bold round_radius50px text-center"
                        dateFormat="dd MMM yyyy"
                        onChange={(e) => DateHandler(e)}
                        renderCustomHeader={props => customHeader({ ...props, locale })}
                        locale={locales[locale]}
                        placeholderText="Date"
                    />

                    {/* <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                                    onClick={(e) => exportPDF(e, BisData, UserData, Tarikh, Data, '#table', '#NestTable')}
                                // onClick={(e) => GenPDF()}

                                ><i className="fad fa-file-pdf"></i></button> */}
                    {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                </div>
            </div>
            {
                Array.isArray(Data) && Data.length ?
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless bg-white text-nowrap`}>
                            <thead className='bg-white'>
                                <tr className="text-center">
                                    <th className="py-1 border-right"><span>S/N</span></th>
                                    <th className="py-1 border-right"><span>Date</span></th>
                                    <th className="py-1 border-right"><span>Order No</span></th>
                                    <th className="py-1 border-right">Order Date</th>
                                    <th className="py-1 border-right">Delivery Date</th>
                                    <th className="py-1 border-right">Items</th>
                                    <th className="py-1 border-right">Discount</th>
                                    <th className="py-1 border-right">Shipping</th>
                                    <th className="py-1 border-right">Total</th>
                                    <th className="py-1 border-right">Cash</th>
                                    <th className="py-1 border-right">Bank</th>
                                    <th className="py-1 border-right">Paid</th>
                                    <th className="py-1 border-right">Due</th>
                                    <th className="py-1 border-right">Payment Term</th>
                                    <th className="py-1 border-right">Status</th>
                                    <th className="py-1 text-center"><span>Action</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Data.map((item, i) => {
                                        let selectValue;
                                        switch (item.Status) {
                                            case 1:
                                                selectValue = { value: 1, label: "Warehouse" };
                                                break;
                                            case 2:
                                                selectValue = { value: 2, label: "Shipped" };
                                                break;
                                            case 3:
                                                selectValue = { value: 3, label: "Delivered" };
                                                break;
                                            case 4:
                                                selectValue = { value: 4, label: "Cancel" };
                                                break;
                                            case 5:
                                                selectValue = { value: 5, label: "Postpond" };
                                                break;
                                            default:
                                                selectValue = "N/A";
                                        }

                                        return (
                                            <tr className="border-bottom text-center fw-bold" key={i}>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="py-0 px-1 border-right text-nowrap">{moment(item.Date).format("DD MMM YY")}</td>
                                                <td className="py-0 px-1 border-right">{item.OrderNo}</td>
                                                <td className="py-0 px-1 border-right">{moment(item.OrderDate).format("DD MMM YY")}</td>
                                                <td className="py-0 px-1 border-right">{moment(item.DeliveryDate).format("DD MMM YY")}</td>
                                                <td className="py-0 px-1 border-right">{item.ItemCount}</td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Shipping).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Cash).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Bank).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Due).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                <td className="py-0 border-right"><small className="d-block fw-bold">{getLabel(item.Payment, PaymentTerms)}</small> </td>
                                                <td className="py-0 border-right" style={{ width: "120px" }}>
                                                    {item.Status === 2 ?
                                                        <Select
                                                            menuPlacement="auto"
                                                            menuPosition="fixed"
                                                            menuPortalTarget={document.body}
                                                            borderRadius={"0px"}
                                                            options={[
                                                                { value: 3, label: "Delivered" },
                                                                { value: 4, label: "Cancel" },
                                                                { value: 5, label: "Postpond" }
                                                            ]}
                                                            name="Status"
                                                            placeholder={"Status"}
                                                            styles={CScolourStyles}
                                                            value={Status || selectValue}
                                                            onChange={(e) => {
                                                                item.Status = e.value; // Assign the selected status value directly to the item
                                                                UpdateInvoiceStatus(e, item)
                                                            }}
                                                            required
                                                            id="Status"
                                                        />
                                                        :
                                                        <span className="d-block fw-bold ">{getStatusLabel(item.Status)}</span>
                                                    }
                                                </td>
                                                <td className="p-0 text-nowrap">
                                                    {item.Status === 1 ?
                                                        <Link className="btn fs-3 px-2 py-0 text-danger" to={`/order_exc/${item.id}`}><i className="fad fa-truck-container"></i></Link>
                                                        :
                                                        <Link className="btn fs-3 px-2 py-0 text-danger" to={`/sell_invoice_preview/${item.SaleID}`}><i className="fad fa-eye"></i></Link>
                                                    }
                                                    {/* <Link className="btn fs-3 px-2 py-0 text-danger" to={`/order_exc/${item.id}`}><i className="fad fa-truck-couch"></i></Link> */}
                                                    <button className="btn fs-3 px-2 py-0 text-danger" onClick={(e) => PrintPDF(e, item)}> <i className="fad fa-print"></i></button>
                                                </td>
                                            </tr>

                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className='fs-2 fw-bold text-center text-success m-0'>No Order Placed!</p>
                    </div>
            }
        </div>

    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(DeliveryOrder);