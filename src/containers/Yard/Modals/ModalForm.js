import { locale } from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { AllConsignee, FetchSector } from "../../../actions/APIHandler";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import '../../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

// import required css from library
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import { ContainerIssue, ContainerPush, ContainerUpdate } from '../../../actions/YardAPI';
let today = new Date();

export const ViewModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static" >
            <Modal.Header className="py-2 justify-content-center align-items-center" closeButton>
                <p className="text-center m-0">
                    <span className="fs-4">View Container Details</span> <br />
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table className="table table-bordered">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-1 px-2">Date</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.Date ? moment(props.item.Date).format("DD MMM YYYY") : "N/A"}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Unique Serial No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.SerialNo ? props.item.SerialNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Docket No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.DocketNo ? props.item.DocketNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Container No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.ContainerNo ? props.item.ContainerNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Invoice No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.InvoiceNo ? props.item.InvoiceNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Order No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.OrderNo ? props.item.OrderNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Pick-up From</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.From ? props.item.From : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Car No</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.CarNo ? props.item.CarNo : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Driver Name</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.DriverName ? props.item.DriverName : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Sector</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.SectorID ? props.item.SectorName : 'N/A'}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Supplier</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.SupplierID ? props.item.SupplierName : 'N/A'}</th>
                            </tr>
                            <tr>
                                <td className="py-1 px-2">Push-up Date</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.PushDate ? moment(props.item.PushDate).format("DD MMM YYYY") : "N/A"}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Active Status</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.Status === 1 ? "Active" : "Empty"}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Seal Status</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.SealStatus === 1 ? "Broken" : "Sealed"}</th>
                            </tr>
                            <tr>
                                <td className="py-1 px-2">Share Status</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-left">{props.item.Reserve === 1 ? "Shared" : "Reserved"}</th>
                            </tr>


                        </tbody>
                    </table>

                </form>
            </Modal.Body >
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => props.onClose()}>Close</button>
            </Modal.Footer>
        </Modal >
    );
}

export const CtrRegister = (props) => {
    const [Error, setError] = useState({});
    const [SectorList, setSectorList] = useState([]);
    const [SupplierList, setSupplierList] = useState([]);
    const [DocketNo, setDocketNo] = useState('')
    const [CtrNo, setCtrNo] = useState('')
    const [InvoiceNo, setInvoiceNo] = useState('')
    const [OrderNo, setOrderNo] = useState('')
    const [CarNo, setCarNo] = useState('')
    const [DriverName, setDriverName] = useState('')
    const [From, setFrom] = useState('')
    const [Remark, setRemark] = useState("N/A")
    const [SectorID, setSectorID] = useState('');
    const [Date, setDate] = useState(today);
    const [SupplierID, setSupplierID] = useState('');
    const [PushDate, setPushDate] = useState('');
    const [Status, setStatus] = useState(1);
    const [SealStatus, setSealStatus] = useState(0);
    const [Reserve, setReserve] = useState(0);

    let toastProperties = null;
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        LoadSector();
        LoadConsignee();
    }, [])

    const LoadSector = async () => {
        var result = await FetchSector();
        if (result !== true) {
            setSectorList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        menu: base => ({
            ...base,
            borderRadius: '0px',
            outline: 0,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
            ...base,
            padding: '5px'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    };

    const LoadConsignee = async (e) => {
        var result = await AllConsignee(2);
        setSupplierList(result)
    }

    const validateForm = () => {
        // error messages to be displayed if a field is invalid
        let errors = {};

        if ((!DocketNo || (DocketNo && DocketNo.trim() === "")) && (!InvoiceNo || (InvoiceNo && InvoiceNo.trim() === ""))) {
            errors.DocketNo = "Either Docket No or Invoice No is required";
            errors.InvoiceNo = "Either Docket No or Invoice No is required";
        }

        if (!CtrNo || (CtrNo && CtrNo.trim() === "")) {
            errors.CtrNo = "Container No is required";
        }

        if (!DriverName || (DriverName && DriverName.trim() === "")) {
            errors.DriverName = "Driver Name is required";
        }

        if (!From || (From && From.trim() === "")) {
            errors.From = "From is required";
        }

        if (!CarNo || (CarNo && CarNo.trim() === "")) {
            errors.CarNo = "Car No is required";
        }

        if (!Remark || (Remark && Remark.trim() === "")) {
            errors.Remark = "Remark is required";
        }

        if (!SectorID) {
            errors.SectorID = "SectorID is required";
        }

        if (!Date) {
            errors.Date = "Date is required";
        }

        if (!SupplierID) {
            errors.SupplierID = "SupplierID is required";
        }

        // if (!PushDate) {
        //     errors.PushDate = "Push Date is required";
        // }

        if (Status === null) {
            errors.Status = "Status is required";
        }

        if (SealStatus === null) {
            errors.SealStatus = "Seal Status is required";
        }

        if (Reserve === null) {
            errors.Reserve = "Reserve is required";
        }

        // Return the errors object and a isValid flag.
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }

    const CtrSave = async (e) => {
        e.preventDefault();
        const { errors, isValid } = validateForm();  // Validate the form
        if (!isValid) { setError(errors); return; }
        var data_format = moment(Date).format('YYYY-MM-DD')
        var push_data_format = moment(PushDate).format('YYYY-MM-DD')
        const result = await ContainerIssue(SectorID, data_format, SupplierID, DocketNo, CtrNo, InvoiceNo, OrderNo, CarNo, DriverName, From, push_data_format, Status, SealStatus, Reserve, Remark);
        if (result !== true) {
            if (result.exception) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                props.onLoad(result.CallBack);
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Product Initialize failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const ClearField = () => {
        setSectorID();
        setSupplierID();
        setDate(today);
        setPushDate(null);
        setDocketNo('');
        setCtrNo('');
        setInvoiceNo('');
        setOrderNo('');
        setCarNo('');
        setDriverName('');
        setFrom('');
        setRemark('N/A');
        setReserve(false);
        setSealStatus(false);
        setStatus(1);
        props.onHide();
    }

    const handleInputChange = (name, value) => {
        switch (name) {
            case 'DocketNo':
                setDocketNo(value);
                break;
            case 'CtrNo':
                setCtrNo(value);
                break;
            case 'InvoiceNo':
                setInvoiceNo(value);
                break;
            case 'OrderNo':
                setOrderNo(value);
                break;
            case 'CarNo':
                setCarNo(value);
                break;
            case 'DriverName':
                setDriverName(value);
                break;
            case 'From':
                setFrom(value);
                break;
            case 'Remark':
                setRemark(value);
                break;
            case 'SectorID':
                setSectorID(value);
                break;
            case 'SupplierID':
                setSupplierID(value);
                break;
            case 'Status':
                setStatus(value === '1' ? 0 : 1);
                break;
            case 'SealStatus':
                setSealStatus(value === '1' ? 0 : 1);
                break;
            case 'Reserve':
                setReserve(value === '1' ? 0 : 1);
                break;
            case 'Date':
                setDate(value);
                break;
            case 'PushDate':
                setPushDate(value);
                break;
            default:
                break;
        }

        // If there was an error for this field, clear it
        if (Error[name]) {
            setError((prevState) => ({
                ...prevState,
                [name]: undefined,
            }));
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">
            <Modal.Header className="py-2 justify-content-center align-items-center" closeButton>
                <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Container Issuance</span>
                <small className="text-center px-0 text-muted"> &nbsp; (Please fill up the desired field)</small>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <form>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <Select
                                            menuPortalTarget={document.body}
                                            borderRadius={'0px'}
                                            options={SectorList}
                                            name='SectorID'
                                            placeholder={"Select Site"}
                                            styles={colourStyles}
                                            value={SectorID}
                                            onChange={(selectedOption) => handleInputChange('SectorID', selectedOption)}
                                        />
                                        {Error.SectorID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SectorID}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <Select
                                        menuPortalTarget={document.body}
                                        borderRadius={'0px'}
                                        options={SupplierList}
                                        name='SupplierID'
                                        placeholder={"Supplier"}
                                        styles={colourStyles}
                                        value={SupplierID}
                                        onChange={(selectedOption) => handleInputChange('SupplierID', selectedOption)}
                                    />
                                    {Error.SupplierID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SupplierID}</small></p>
                                        : null}

                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Pick-up From</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="From"
                                            name="From"
                                            placeholder='Pick-up'
                                            value={From}
                                            onChange={(e) => handleInputChange('From', e.target.value)}
                                        />
                                        {Error.From ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.From}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Date</label>
                                        <Datepicker
                                            selected={Date}
                                            className="form-control fs-5 fw-bold round_radius50px text-center"
                                            dateFormat="dd MMM yyyy"
                                            name='Date'
                                            onChange={selectedDate => handleInputChange('Date', selectedDate)}
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Date"
                                        />
                                        {Error.Date ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Date}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Docket No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="DocketNo"
                                            name="DocketNo"
                                            placeholder='Docket No'
                                            value={DocketNo}
                                            onChange={(e) => handleInputChange('DocketNo', e.target.value)}
                                        />
                                        {Error.DocketNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DocketNo}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Container No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="CtrNo"
                                            name="CtrNo"
                                            placeholder='Container No'
                                            value={CtrNo}
                                            onChange={(e) => handleInputChange('CtrNo', e.target.value)}
                                        />
                                        {Error.CtrNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CtrNo}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Invoice No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="InvoiceNo"
                                            name="InvoiceNo"
                                            placeholder='Invoice No'
                                            value={InvoiceNo}
                                            onChange={(e) => handleInputChange('InvoiceNo', e.target.value)}
                                        />
                                        {Error.InvoiceNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Order No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="OrderNo"
                                            name="OrderNo"
                                            placeholder='Order No'
                                            value={OrderNo}
                                            onChange={(e) => handleInputChange('OrderNo', e.target.value)}
                                        />
                                        {Error.OrderNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.OrderNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Car No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="CarNo"
                                            name="CarNo"
                                            placeholder='Car No'
                                            value={CarNo}
                                            onChange={(e) => handleInputChange('CarNo', e.target.value)}
                                        />
                                        {Error.CarNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CarNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Driver Name</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="DriverName"
                                            name="DriverName"
                                            placeholder='Driver Name'
                                            value={DriverName}
                                            onChange={(e) => handleInputChange('DriverName', e.target.value)}
                                        />
                                        {Error.DriverName ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DriverName}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Push Back</label>
                                        <Datepicker
                                            selected={PushDate || null}
                                            className="form-control fs-5 fw-bold round_radius50px text-center"
                                            dateFormat="dd MMM yyyy"
                                            name='PushDate'
                                            onChange={selectedDate => handleInputChange('PushDate', selectedDate)}
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Push Date"
                                        />
                                        {Error.PushDate ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PushDate}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Active Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Status}
                                                id="Status"
                                                name="Status"
                                                checked={Status}
                                                onChange={(e) => handleInputChange('Status', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={Status}>{Status === 1 ? "Active" : "Empty"}</label>
                                            {Error.Status ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Seal Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={SealStatus}
                                                id="SealStatus"
                                                name="SealStatus"
                                                checked={SealStatus}
                                                onChange={(e) => handleInputChange('SealStatus', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={SealStatus}>{SealStatus === 1 ? "Broken" : "Sealed"}</label>
                                            {Error.SealStatus ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SealStatus}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Share Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Reserve}
                                                id="Reserve"
                                                name="Reserve"
                                                checked={Reserve}
                                                onChange={(e) => handleInputChange('Reserve', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={Reserve}>{Reserve === 1 ? "Shared" : "Reserved"}</label>
                                            {Error.Reserve ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Reserve}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label text-center w-100">Remark</label>
                                    <textarea
                                        cols={2}
                                        className="form-control fw-bold text-center"
                                        id="Remark"
                                        name="Remark"
                                        placeholder='Remark'
                                        value={Remark}
                                        onChange={(e) => handleInputChange('Remark', e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                    {Error.Remark ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Remark}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>

                        <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={(e) => CtrSave(e)}>
                                <i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
        </Modal >
    );
}

export const UpdateModal = (props) => {
    const [Error, setError] = useState({});
    const [SectorList, setSectorList] = useState([]);
    const [SupplierList, setSupplierList] = useState([]);
    const [DocketNo, setDocketNo] = useState(props.item.DocketNo ? props.item.DocketNo : '')
    const [CtrNo, setCtrNo] = useState(props.item.ContainerNo ? props.item.ContainerNo : '')
    const [InvoiceNo, setInvoiceNo] = useState(props.item.InvoiceNo ? props.item.InvoiceNo : '')
    const [OrderNo, setOrderNo] = useState(props.item.OrderNo ? props.item.OrderNo : '')
    const [CarNo, setCarNo] = useState(props.item.CarNo ? props.item.CarNo : '')
    const [DriverName, setDriverName] = useState(props.item.DriverName ? props.item.DriverName : '')
    const [From, setFrom] = useState(props.item.From ? props.item.From : '')
    const [Remark, setRemark] = useState(props.item.Remark ? props.item.Remark : "N/A")
    const [SectorID, setSectorID] = useState(props.item.SectorID ? { value: props.item.SectorID, label: props.item.SectorName } : '');
    const [Date, setDate] = useState(props.item.Date ? new window.Date(props.item.Date) : today);
    const [SupplierID, setSupplierID] = useState(props.item.SupplierID ? { value: props.item.SupplierID, label: props.item.SupplierName } : '');
    const [PushDate, setPushDate] = useState(props.item.PushDate ? new window.Date(props.item.PushDate) : '');
    const [Status, setStatus] = useState(props.item.Status);
    const [SealStatus, setSealStatus] = useState(props.item.SealStatus);
    const [Reserve, setReserve] = useState(props.item.Reserve);


    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setSectorID();
        setSupplierID();
        setDate(null);
        setPushDate(null);
        setDocketNo('');
        setCtrNo('');
        setInvoiceNo('');
        setOrderNo('');
        setCarNo('');
        setDriverName('');
        setFrom('');
        setRemark('N/A');
        setReserve('');
        setSealStatus('');
        setStatus('');
        props.onHide();
    }

    useEffect(() => {
        LoadSector();
        LoadConsignee();
    }, [])

    const LoadSector = async () => {
        var result = await FetchSector();
        if (result !== true) {
            setSectorList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    }

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        menu: base => ({
            ...base,
            borderRadius: '0px',
            outline: 0,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
            ...base,
            padding: '5px'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    };

    const LoadConsignee = async (e) => {
        var result = await AllConsignee(2);
        setSupplierList(result)
    }

    const validateForm = () => {
        let errors = {};
        if (!props.item.id || (props.item.id && props.item.id.trim() === "")) {
            errors.id = "Container can't identified";
        }

        if ((!DocketNo || (DocketNo && DocketNo.trim() === "")) && (!InvoiceNo || (InvoiceNo && InvoiceNo.trim() === ""))) {
            errors.DocketNo = "Either Docket No or Invoice No is required";
            errors.InvoiceNo = "Either Docket No or Invoice No is required";
        }

        if (!CtrNo || (CtrNo && CtrNo.trim() === "")) {
            errors.CtrNo = "Container No is required";
        }

        if (!DriverName || (DriverName && DriverName.trim() === "")) {
            errors.DriverName = "Driver Name is required";
        }

        if (!From || (From && From.trim() === "")) {
            errors.From = "From is required";
        }

        if (!CarNo || (CarNo && CarNo.trim() === "")) {
            errors.CarNo = "Car No is required";
        }

        if (!Remark || (Remark && Remark.trim() === "")) {
            errors.Remark = "Remark is required";
        }

        if (!SectorID) {
            errors.SectorID = "SectorID is required";
        }

        if (!Date) {
            errors.Date = "Date is required";
        }

        if (!SupplierID) {
            errors.SupplierID = "SupplierID is required";
        }

        if (Status === null) {
            errors.Status = "Status is required";
        }

        if (SealStatus === null) {
            errors.SealStatus = "Seal Status is required";
        }

        if (Reserve === null) {
            errors.Reserve = "Reserve is required";
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }

    const CtrUpadate = async (e) => {
        e.preventDefault();
        const { errors, isValid } = validateForm();  // Validate the form
        if (!isValid) { setError(errors); return; }
        var data_format = moment(Date).format('YYYY-MM-DD')
        var push_date_format = moment(PushDate).format('YYYY-MM-DD')

        const result = await ContainerUpdate(props.item.id, SectorID, data_format, SupplierID, DocketNo, CtrNo, InvoiceNo, OrderNo, CarNo, DriverName, From, push_date_format, Status, SealStatus, Reserve, Remark);
        if (result !== true) {
            if (result.exception) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                props.onLoad(result.CallBack);
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Product Initialize failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const handleInputChange = (name, value) => {
        switch (name) {
            case 'DocketNo':
                setDocketNo(value);
                break;
            case 'CtrNo':
                setCtrNo(value);
                break;
            case 'InvoiceNo':
                setInvoiceNo(value);
                break;
            case 'OrderNo':
                setOrderNo(value);
                break;
            case 'CarNo':
                setCarNo(value);
                break;
            case 'DriverName':
                setDriverName(value);
                break;
            case 'From':
                setFrom(value);
                break;
            case 'Remark':
                setRemark(value);
                break;
            case 'SectorID':
                setSectorID(value);
                break;
            case 'SupplierID':
                setSupplierID(value);
                break;
            case 'Status':
                setStatus(value === '1' ? 0 : 1);
                break;
            case 'SealStatus':
                setSealStatus(value === '1' ? 0 : 1);
                break;
            case 'Reserve':
                setReserve(value === '1' ? 0 : 1);
                break;
            case 'Date':
                setDate(value);
                break;
            case 'PushDate':
                setPushDate(value);
                break;
            default:
                break;
        }

        if (Error[name]) {
            setError((prevState) => ({
                ...prevState,
                [name]: undefined,
            }));
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">
            <Modal.Header className="py-2 justify-content-center align-items-center" closeButton>
                <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Container Update</span>
                <small className="text-center px-0 text-muted"> &nbsp; (Please fill up the desired field)</small>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        {Error.id ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.id}</small></p>
                            : null}
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Sector</label>
                                        <Select
                                            menuPortalTarget={document.body}
                                            borderRadius={'0px'}
                                            options={SectorList}
                                            name='SectorID'
                                            placeholder={"Select Site"}
                                            styles={colourStyles}
                                            value={SectorID}
                                            onChange={(selectedOption) => handleInputChange('SectorID', selectedOption)}
                                        />
                                        {Error.SectorID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SectorID}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="message-text" className="col-form-label text-center w-100">Supplier</label>
                                    <Select
                                        menuPortalTarget={document.body}
                                        borderRadius={'0px'}
                                        options={SupplierList}
                                        name='SupplierID'
                                        placeholder={"Supplier"}
                                        styles={colourStyles}
                                        value={SupplierID}
                                        onChange={(selectedOption) => handleInputChange('SupplierID', selectedOption)}
                                    />
                                    {Error.SupplierID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SupplierID}</small></p>
                                        : null}

                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Pick-up From</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="From"
                                            name="From"
                                            placeholder='Pick-up'
                                            value={From}
                                            onChange={(e) => handleInputChange('From', e.target.value)}
                                        />
                                        {Error.From ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.From}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Date</label>
                                        <Datepicker
                                            selected={Date}
                                            className="form-control fs-5 fw-bold round_radius50px text-center"
                                            dateFormat="dd MMM yyyy"
                                            name='Date'
                                            onChange={selectedDate => handleInputChange('Date', selectedDate)}
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Date"
                                        />
                                        {Error.Date ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Date}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Docket No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="DocketNo"
                                            name="DocketNo"
                                            placeholder='Docket No'
                                            value={DocketNo}
                                            onChange={(e) => handleInputChange('DocketNo', e.target.value)}
                                        />
                                        {Error.DocketNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DocketNo}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Container No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="CtrNo"
                                            name="CtrNo"
                                            placeholder='Container No'
                                            value={CtrNo}
                                            onChange={(e) => handleInputChange('CtrNo', e.target.value)}
                                        />
                                        {Error.CtrNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CtrNo}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Invoice No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="InvoiceNo"
                                            name="InvoiceNo"
                                            placeholder='Invoice No'
                                            value={InvoiceNo}
                                            onChange={(e) => handleInputChange('InvoiceNo', e.target.value)}
                                        />
                                        {Error.InvoiceNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InvoiceNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Order No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="OrderNo"
                                            name="OrderNo"
                                            placeholder='Order No'
                                            value={OrderNo}
                                            onChange={(e) => handleInputChange('OrderNo', e.target.value)}
                                        />
                                        {Error.OrderNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.OrderNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Car No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="CarNo"
                                            name="CarNo"
                                            placeholder='Car No'
                                            value={CarNo}
                                            onChange={(e) => handleInputChange('CarNo', e.target.value)}
                                        />
                                        {Error.CarNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CarNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Driver Name</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="DriverName"
                                            name="DriverName"
                                            placeholder='Driver Name'
                                            value={DriverName}
                                            onChange={(e) => handleInputChange('DriverName', e.target.value)}
                                        />
                                        {Error.DriverName ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DriverName}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Push Back</label>
                                        <Datepicker
                                            selected={PushDate || null}
                                            className="form-control fs-5 fw-bold round_radius50px text-center"
                                            dateFormat="dd MMM yyyy"
                                            name='PushDate'
                                            onChange={selectedDate => handleInputChange('PushDate', selectedDate)}
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Push Date"
                                        />
                                        {Error.PushDate ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PushDate}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Active Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Status}
                                                id="Status"
                                                name="Status"
                                                checked={Status}
                                                onChange={(e) => handleInputChange('Status', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={Status}>{Status === 1 ? "Active" : "Empty"}</label>
                                            {Error.Status ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Seal Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={SealStatus}
                                                id="SealStatus"
                                                name="SealStatus"
                                                checked={SealStatus}
                                                onChange={(e) => handleInputChange('SealStatus', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={SealStatus}>{SealStatus === 1 ? "Broken" : "Sealed"}</label>
                                            {Error.SealStatus ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SealStatus}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <div className="form-group m-0">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Share Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Reserve}
                                                id="Reserve"
                                                name="Reserve"
                                                checked={Reserve}
                                                onChange={(e) => handleInputChange('Reserve', e.target.value)}
                                            />
                                            <label className="form-check-label text-center fw-bold pr-2" for={Reserve}>{Reserve === 1 ? "Shared" : "Reserved"}</label>
                                            {Error.Reserve ?
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Reserve}</small></p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label text-center w-100">Remark</label>
                                    <textarea
                                        cols={2}
                                        className="form-control fw-bold text-center"
                                        id="Remark"
                                        name="Remark"
                                        placeholder='Remark'
                                        value={Remark}
                                        onChange={(e) => handleInputChange('Remark', e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                    {Error.Remark ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Remark}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>

                        <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={(e) => CtrUpadate(e)}>
                                <i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>

            </Modal.Body >
        </Modal >
    );
}

export const PushBackModal = (props) => {
    const [Error, setError] = useState({});
    const [id, setID] = useState(props.item.id ? props.item.id : '')
    const [PushID, setPushID] = useState(props.item.PushBackID ? props.item.PushBackID : '')
    const [CarNo, setCarNo] = useState('')
    const [DriverName, setDriverName] = useState('')
    const [PickupBy, setPickupBy] = useState('')
    const [Date, setDate] = useState(props.item.PushDate ? new window.Date(props.item.PushDate) : today);

    let toastProperties = null;
    const dispatch = useDispatch();
    let history = useHistory();

    const validateForm = () => {
        let errors = {};

        if (!props.item.id || (props.item.id && props.item.id.trim() === "")) {
            errors.id = "Container can't identified";
        }

        if (!CarNo || (CarNo && CarNo.trim() === "")) {
            errors.CarNo = "Container No is required";
        }

        if (!PickupBy || (PickupBy && PickupBy.trim() === "")) {
            errors.PickupBy = "Picked up is required";
        }

        if (!DriverName || (DriverName && DriverName.trim() === "")) {
            errors.DriverName = "Driver Name is required";
        }

        if (!CarNo || (CarNo && CarNo.trim() === "")) {
            errors.CarNo = "Car No is required";
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }

    const CtrPushBackSave = async (e) => {
        e.preventDefault();
        const { errors, isValid } = validateForm();  // Validate the form
        if (!isValid) { setError(errors); return; }
        var push_data_format = moment(Date).format('YYYY-MM-DD')
        const result = await ContainerPush(id, PushID, push_data_format, CarNo, DriverName, PickupBy);
        if (result !== true) {
            if (result.exception) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Container push up failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const ClearField = () => {
        setDate(today);
        setCarNo('');
        setDriverName('');
        setPickupBy('');
        props.onHide();
    }

    const handleInputChange = (name, value) => {
        switch (name) {
            case 'CarNo':
                setCarNo(value);
                break;
            case 'DriverName':
                setDriverName(value);
                break;
            case 'PickupBy':
                setPickupBy(value);
                break;
            case 'Date':
                setDate(value);
                break;
            default:
                break;
        }

        // If there was an error for this field, clear it
        if (Error[name]) {
            setError((prevState) => ({
                ...prevState,
                [name]: undefined,
            }));
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">
            <Modal.Header className="py-2 justify-content-center align-items-center" closeButton>
                <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Container Push Back</span>
                <small className="text-center px-0 text-muted"> &nbsp; (Please fill up the desired field)</small>
            </Modal.Header>
            <Modal.Body>
                <label htmlFor="message-text" className="col-form-label text-center w-100 fw-bold">{"Container No: " + props.item.ContainerNo}</label>

                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <form>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label text-center w-100">Pick-up By</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold"
                                        id="PickupBy"
                                        name="PickupBy"
                                        placeholder='Pick-up By'
                                        value={PickupBy}
                                        onChange={(e) => handleInputChange('PickupBy', e.target.value)}
                                    />
                                    {Error.PickupBy ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PickupBy}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Date</label>
                                        <Datepicker
                                            selected={Date}
                                            className="form-control fs-5 fw-bold round_radius50px text-center"
                                            dateFormat="dd MMM yyyy"
                                            name='Date'
                                            onChange={selectedDate => handleInputChange('Date', selectedDate)}
                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                            locale={locales[locale]}
                                            placeholderText="Date"
                                        />
                                        {Error.Date ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Date}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Car No</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="CarNo"
                                            name="CarNo"
                                            placeholder='Car No'
                                            value={CarNo}
                                            onChange={(e) => handleInputChange('CarNo', e.target.value)}
                                        />
                                        {Error.CarNo ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CarNo}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center w-100">Driver Name</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="DriverName"
                                            name="DriverName"
                                            placeholder='Driver Name'
                                            value={DriverName}
                                            onChange={(e) => handleInputChange('DriverName', e.target.value)}
                                        />
                                        {Error.DriverName ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DriverName}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                        </form>

                        <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={(e) => CtrPushBackSave(e)}>
                                <i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
        </Modal >
    );
}

export const DeleteModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>
                    Do you want to delete <strong>{props.FullName}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.Click}>
                    Delete
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>

            </Modal.Footer>
        </Modal>
    );
}

export const InfoMessage = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.header}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.body_header}</h4>
                <p>
                    {props.body}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn text-center btn-outline-success" onClick={props.onHide}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}