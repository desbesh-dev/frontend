import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage } from "../../Modals/ModalForm.js";
// import { exportPDF } from '../Class/OrderPDF';
import * as moment from 'moment';
import Datepicker from 'react-datepicker';
import { DeleteDraftItem, DeliverProduct, FetchDraftRequest } from '../../../actions/InventoryAPI';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
let today = new Date();
const ReqExecute = ({ display, SupplierID, CompanyID, BranchID, user, req_no, list, setList, setActive }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Count, setCount] = useState(null)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState(false)
    const [Header, setHeader] = useState(req_no)

    const [Substract, setSubstract] = useState(0)
    const [RequestID, setRequestID] = useState(false)
    const [Date, setDate] = useState(today)
    const [DeliveryDate, setDeliveryDate] = useState(today)
    const [RequestNo, setRequestNo] = useState("")
    const [BranchList, setBranchList] = useState("")
    const [Branch, setBranch] = useState("")
    const [Receiver, setReceiver] = useState(null)
    const [Status, setStatus] = useState(0)
    const [Vat, setVat] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [Paid, setPaid] = useState(0.00)
    const [Due, setDue] = useState(0.00)

    const [RequestData, setRequestData] = useState([])
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        BarCode: "",
        ItemCode: "",
        Title: "",
        Category: "",
        UnitWeight: "",
        Weight: "",
        UnitPrice: "",
        Quantity: "",
        ReceivedQty: "",
        SubTotal: "",
    });
    const { ItemCode, Category, Title, UnitWeight, UnitPrice, ReceivedQty, Quantity, Weight, SubTotal } = formData;

    useEffect(() => {
        LoadDraftRequest();
        history.replace();
    }, [])


    const LoadDraftRequest = async () => {
        if (req_no) {
            var result = await FetchDraftRequest(req_no);
            if (result !== true) {
                setStatus(result.Status);
                setRequestID(result.RequestID);
                setBranch(result.Branch);
                setRequestNo(result.RequestNo);
                setRequestData(result.RequestMapData);
                setDate(new window.Date(result.Date));
                setActive(701);
            } else {
                history.push('/req_draft');
            }
        }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    const onSubmit = (e) => {
        if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined) {
            setInfoModalShow(true)
        } else {
            e.preventDefault();
            setRequestData([...RequestData, formData]);
            setCount(Count + 1);
            setFormData({
                BarCode: "",
                ItemCode: "",
                Title: "",
                Category: "",
                UnitWeight: "",
                Weight: "",
                UnitPrice: "",
                Quantity: "",
                ReceivedQty: "",
                SubTotal: "",
            });
        }
    }




    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = RequestData.map(row => row.Quantity * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = RequestData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0);
    const SendTotal = RequestData.reduce((SendQty, myvalue) => SendQty + parseInt(myvalue.ReceivedQty, 10), 0);

    const WeightTotal = () => {
        let TotalWt = 0.000;
        const wt = RequestData.map(row => row.Quantity * row.UnitWeight);
        if (wt.length > 0) {
            TotalWt = wt.reduce((acc, val) => acc + val);
        }
        return TotalWt;
    }

    const deleteRow = async (e, i, item) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await DeleteDraftItem(item.id);
        if (result !== true) {
            const newRows = RequestData.splice(i, 1).concat(RequestData.slice(i + 1));
            setCount(Count - 1)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            onSubmit();
        }
    }

    const history = useHistory();

    const SendProduct = async (e) => {
        e.preventDefault();
        if (Branch && Header && RequestID) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var dd = moment(DeliveryDate).format('YYYY-MM-DD')
            var result = await DeliverProduct(RequestID, dd, getTotal(), RequestData);

            if (result !== true) {
                if (result.error) {
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
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    history.push('/req_draft')
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save product profile. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });

        } else {
            history.push('/my_supplier');
        }
    }

    // const isStringNullOrWhiteSpace = (str) => {
    //     return str === undefined || str === null || str === "";
    // }

    // const Validate = () => {
    //     if (!isStringNullOrWhiteSpace(Date) && !isStringNullOrWhiteSpace(RequestNo) && !isStringNullOrWhiteSpace(Payment))
    //         return false;
    //     return true;
    // }

    const ClearField = (e) => {
        history.push("/req_list")
        e.preventDefault();
        setCount("");
        setRequestID(false);
        setBranch(null);
        setRequestNo("");
        setRequestData([]);
        setDate(today);
        setDeliveryDate(today);
        setHeader(false);
        setFormData({
            BarCode: "",
            ItemCode: "",
            Title: "",
            Category: "",
            UnitWeight: "",
            Weight: "",
            UnitPrice: "",
            Quantity: "",
            ReceivedQty: "",
            SubTotal: "",
        });
    }

    const updateItem = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...RequestData]; temporaryarray[index] = { ...temporaryarray[index], ReceivedQty: Math.round(Number(e.target.value) || 0) };
            setRequestData(temporaryarray);
        }
        else {

        }
    }

    const updateItemBlur = (index, e) => {
        if (index !== -1) {
            let temporaryarray = [...RequestData];
            temporaryarray[index] = {
                ...temporaryarray[index],
                Available: e.target.value !== "" ? parseFloat(temporaryarray[index].Available) - parseFloat(e.target.value) : temporaryarray[index].Stock,
                ReceivedQty: Math.round(Number(e.target.value) || 0),
                Weight: parseFloat(temporaryarray[index].UnitWeight) * parseFloat(temporaryarray[index].ReceivedQty),
                SubTotal: (parseFloat(temporaryarray[index].UnitWeight) * parseFloat(temporaryarray[index].ReceivedQty)) * parseFloat(temporaryarray[index].UnitPrice)
            };
            if (Math.round(Number(e.target.value) || 0) > temporaryarray[index].Stock || Math.round(Number(e.target.value) || 0) > temporaryarray[index].Quantity) {
                temporaryarray[index] = {
                    ...temporaryarray[index], Available: temporaryarray[index].Stock,
                    ReceivedQty: 0
                };
            }
            setRequestData(temporaryarray);

        }
        else {

        }
    }
    const handleFocus = (e) => e.target.select();

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center">Send Product To Branch</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/supplier_list">Products Requisition</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12 h-100 pl-0">

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center py-3">
                        {
                            Branch ?
                                <>
                                    <div className="row g-0">
                                        <p className="fs-6 text-success text-center fw-bold m-0">Branch Info</p>
                                        <div className="col-md-2 d-flex flex-wrap align-items-center justify-content-center">
                                            <img className="img-fluid mx-auto d-block rounded-start" alt="..."
                                                src={user ? process.env.REACT_APP_API_URL + user.Logo : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"} width="120" />
                                        </div>
                                        <div className="col-md-10">
                                            <div className="card-body px-3 py-2">
                                                <p className="display-6 fw-bold m-0">{Branch.label + " Branch"}</p>
                                                <p className="fs-6 m-0">{Branch.Address}</p>
                                                <p className="fs-6 m-0">{Branch.Contact}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='btn btn-outline-warning fw-bold py-0' onClick={(e) => ClearField(e)}><i class="fad fa-user-times"></i> Clear</button>
                                </>
                                :
                                <div className="row w-100">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Please Select Branch</p>
                                    <div className="col-sm-12">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={BranchList}
                                            name="Division"
                                            placeholder={"Please select branch"}
                                            styles={CScolourStyles}
                                            // value={Payment}
                                            onChange={(e) => setBranch(e)}
                                            required
                                            id="Branch"
                                        />
                                    </div>
                                </div>
                        }
                    </div >

                    <div className="col-lg-1">
                        <div className="cs_outer" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                    </div>

                    <div className="col-lg-6 d-flex flex-wrap align-items-center justify-content-center">
                        <form className='w-100'>
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={Date}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                        onChange={(e) => setDate(e)}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Delivery Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={DeliveryDate}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                        onChange={(e) => setDeliveryDate(e)}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Requisition No</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control fw-bold" placeholder="Requisition No" id="inputEmail3" value={RequestNo} disabled />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>


                <div className="row justify-content-center mx-auto d-table w-100 h-100 py-2">

                    <InfoMessage
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    {
                        Array.isArray(RequestData) && RequestData.length ?
                            <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                                <thead>
                                    <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                        <th className="py-1 border-right"><span>S/N</span></th>
                                        <th className="py-1 border-right"><span>Item Code</span></th>
                                        <th className="py-1 border-right"><span>Category</span></th>
                                        <th className="py-1 border-right"><span>Title</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Unit Weight</span></th>
                                        {/* <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Unit Price</span></th> */}
                                        <th className="py-1 border-right"><span>Request Qty</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Weight</span></th>
                                        <th className="py-1 border-right"><span>Send Qty</span></th>
                                        <th className="py-1 border-right"><span className="d-block text-right fw-bolder">Stock</span></th>
                                        <th className="py-1"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        RequestData.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{item.ItemCode}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.Category}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.UnitWeight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                {/* <td className="p-0 border-right"><span className="d-block fw-bold">{(item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{item.Quantity}</span></td>
                                                <td className="p-0 border-right px-2"><span className="d-block fw-bold text-right">{(item.UnitWeight * item.Quantity).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>

                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">
                                                    <input
                                                        type="number"
                                                        className="form-control fs-5 fw-bold p-0 text-center border-none"
                                                        name="Quantity"
                                                        id="Quantity"
                                                        placeholder="Quantity"
                                                        value={item.ReceivedQty ? item.ReceivedQty : ""}
                                                        onChange={(e) => updateItem(i, e)}
                                                        // onChange={(e) => onInputChanged(item.id, e)}
                                                        onKeyDown={(e) => shouldBlur(e)}
                                                        onBlur={(e) => updateItemBlur(i, e)}
                                                        onFocus={handleFocus}
                                                        required
                                                        disabled={!Branch}
                                                    />
                                                    {/* {item.Quantity} */}
                                                </span> </td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{item.Available}</span></td>
                                                <td className="px-3 py-0">
                                                    <button className={`btn fs-3 py-1 fad fa-minus fw-bold`} onClick={(e) => Status === 1 ? deleteRow(e, i, item) : null} disabled={Status === 1 ? false : true} />
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    <tr className="text-center border border-light mt-3 bg-white">
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Count:</span> </td>
                                        <td className="p-1"><span className="d-block text-left fw-bolder">{RequestData.length}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Quantity:</span> </td>
                                        <td className="p-1"><span className="d-block text-left fw-bolder px-1">{QuantityTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Weight: </span> </td>
                                        <td className="p-0 px-2" ><span className="d-block text-left fw-bolder px-1">{WeightTotal().toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">Send Quantity: </span> </td>
                                        <td className="p-0 border-right px-2" ><span className="d-block text-left fw-bolder px-1">{SendTotal.toLocaleString("en", { minimumFractionDigits: 0 })}</span> </td>
                                        {/* <td className="p-1"><span className="d-block fw-bolder text-right">{Paid === 0.00 ? Total === 0.00 ? getTotal().toLocaleString("en", { minimumFractionDigits: 2 }) : Total.toLocaleString("en", { minimumFractionDigits: 2 }) : getTotal() === Paid ? 0.00 : Due === 0.00 ? (0).toLocaleString("en", { minimumFractionDigits: 2 }) : Due.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td> */}
                                        <td colSpan="2" className="p-1" className="px-3 py-0 border-right">
                                            <div className={`d-flex justify-content-around align-items-center`}>

                                                <button className={`btn fs-3 p-2 fad fa-paper-plane`} title='Send Darft Requisition' disabled={Status === 1 ? false : true}
                                                    onClick={(e) => Status === 1 ? SendProduct(e, RequestID) : null}
                                                />

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            :
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                            </div>
                    }
                </div >
            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.match.params.sup_id,
    CompanyID: state.auth.user.CompanyID,
    BranchID: state.auth.user.BranchID,
    user: state.auth.user,
    req_no: props.match.params.req_no
});

export default connect(mapStateToProps, { logout })(ReqExecute);