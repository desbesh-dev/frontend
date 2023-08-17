import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchVoucherNo, LoadAccount, LoadBanks, LoadMainAcc, VoucherSave } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchBatch } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { InfoMessage } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

import Datepicker from 'react-datepicker';

// import required css from library
import "react-datepicker/dist/react-datepicker.css";

let today = new Date()
const PaymentRelease = ({ display, BatchID, CompanyID, BranchID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Fram, setFram] = useState(null)
    const [ActiveBatch, setActiveBatch] = useState(false)
    const [Data, setData] = useState(false)
    const [Error, setError] = useState({});
    const [MyProList, setMyProList] = useState(false)

    const [InvoiceNo, setInvoiceNo] = useState(0)

    const [Reference, setReference] = useState("")
    const [VoucherType, setVoucherType] = useState(null)
    const [Date, setDate] = useState(today)
    const [VoucherNo, setVoucherNo] = useState(0)
    const [Name, setName] = useState(null)
    const [PaymentMethod, setPaymentMethod] = useState(null)
    const [Narration, setNarration] = useState(null)
    const [Count, setCount] = useState(1)

    const [AccTypes, setAccTypes] = useState(null)
    const [Journal, setJournal] = useState(null)
    const [CMPJournal, setCMPJournal] = useState(null)
    const [Percent, setPercent] = useState(null)

    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [TempData, setTempData] = useState(false)

    const [Vat, setVat] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Shipment, setShipment] = useState(0.00)
    const [Total, setTotal] = useState(0.00)
    const [NetTotal, setNetTotal] = useState(0.00)
    const [locale, setLocale] = useState('en');

    const [AccData, setAccData] = useState([])

    const [AccLists, setAccLists] = useState(null)
    const [ContractLists, setContractLists] = useState(null)
    const [SupplierLists, setSupplierLists] = useState(null)
    const [ActiveBankData, setActiveBankData] = useState(null)

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        UserID: "",
        BisID: "",
        BatchID: "",
        SupplierID: "",

        AccountTitle: "",
        AccountID: "",
        COA_Code: "",
        COA_ID: "",

        COA_ID: "",
        SLNo: "",
        Debit: "",
        Credit: "",

        BankID: "",
        BankName: "",
        ACName: "",
        ACNo: "",
        ChequeNo: "",
    });
    const { AccountID, AccountTitle, COA_Code, COA_ID, SLNo, Debit, Credit, BankID, BankName, Branch, ACName, ACNo, ChequeNo } = formData;

    useEffect(() => {
        LoadAccounts();
        LoadBatch();
    }, [])

    const LoadVoucherNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const Type = VoucherType.value === 1 || VoucherType.value === 2 ? "RV" : VoucherType.value === 3 || VoucherType.value === 4 ? "PV" : VoucherType.value === 5 ? "CV" : VoucherType.value === 6 ? "JV" : false;
        if (Type) {
            var result = await FetchVoucherNo(Type);

            if (result !== true) {
                setVoucherNo(result)
            } else {
                // history.push('/farm_lists');
            }
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    // const LoadFarm = async () => {
    //     dispatch({ type: DISPLAY_OVERLAY, payload: true });
    //     var result = await GetFarm(BisID);
    //     
    //     if (result !== true) {
    //         result[0].batches.map(x => x.Status === true ?
    //             setActiveBatch(x)
    //             : null
    //         )
    //         setFram(result[0]);
    //         LoadVoucherNo();
    //         dispatch({ type: DISPLAY_OVERLAY, payload: false });
    //     } else {
    //         dispatch({ type: DISPLAY_OVERLAY, payload: false });
    //         history.push('/farm_lists');
    //     }
    //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
    // }

    const LoadBatch = async () => {
        if (BatchID !== null) {

            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchBatch(BatchID);
            if (result !== true) {
                setData(result);
                setName(result.Details[0].FullName)
                ActiveBankTrigger(result.Bank ? result.Bank : false)
                AccountItemTrigger(result.Account ? result.Account : false)
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/farmer_payment_list');
        }
    }

    const ActiveBankTrigger = (value) => {

        if (value) {
            value.filter(function (item) {
                return item.Status === 1;
            }).map(function ({ id, BankID, AccName, AccNumber }) {

                setActiveBankData({ "BankID": BankID.id, "BankName": BankID.BankName, "Branch": BankID.BranchName, "ACName": AccName, "ACNo": AccNumber })
                setFormData({ ...formData, "BankID": BankID.id, "BankName": BankID.BankName, "Branch": BankID.BranchName, "ACName": AccName, "ACNo": AccNumber })
            })
        }
    }

    const AccountItemTrigger = (value) => {

        if (value) {
            let arr = value.filter(function (item) {
                return item.CR !== "0.00"
            }).map(function ({ id, BatchID, COA, DR, CR }, i) {
                return { "SLNo": i + 1, "id": id, "BatchID": BatchID.id, "COA_ID": COA.id, "COA_Code": COA.COA_Code, "AccountTitle": COA.COA_Title, "Debit": parseFloat(CR), "Credit": parseFloat(DR) }
            })
            setAccData(arr)
            var len = arr.length;
            setCount(len + 1)
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
            AddRow();
        }
    }

    const AddRow = (e) => {
        e.preventDefault()
        setAccData([...AccData, formData]);
        setCount(Count + 1);
        setFormData({
            BatchID: "",
            COA_ID: "",
            SLNo: "",
            Debit: 0,
            Credit: 0,
        });
        setAccTypes(null)
        setReference(null)
    }

    const getTotal = () => {
        let TotalDebit = 0.00;
        let TotalCredit = 0.00;
        const Debit = AccData.map(row => parseFloat(row.Debit));
        const Credit = AccData.map(row => parseFloat(row.Credit));

        if (Debit.length > 0 && Credit.length > 0) {
            TotalDebit = Debit.reduce((acc, val) => acc + val);
            TotalCredit = Credit.reduce((acc, val) => acc + val);
        }
        var Total = { "Debit": TotalDebit, "Credit": TotalCredit }
        return Total
    }

    const deleteRow = (i, e) => {
        var len = AccData.length;

        const newRows = AccData.splice(i, 1).concat(AccData.slice(i + 1));
        setCount(Count - 1);
        if (e < len) {
            updateItem(i, e);
        }
    };

    const updateItem = (index, e) => {
        // if (index !== -1) {
        //     let temporaryarray = [...AccData];
        //     temporaryarray[index] = { ...temporaryarray[index], SLNo: index + 1 };
        //     setAccData(temporaryarray);
        // }
        const newState = AccData.map((obj, i) => {
            return { ...obj, SLNo: i + 1 };
        });
        var len = newState.length;
        setCount(len + 1)
        setAccData(newState);
    }


    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            AddRow();
        }
    }

    const history = useHistory();

    const SaveVoucher = async () => {
        var count = AccData.length;
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format('YYYY-MM-DD')
        var result = await VoucherSave(VoucherType, data, VoucherNo, PaymentMethod, Name, Narration, count, AccData);

        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
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
                LoadVoucherNo();
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to save voucher. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadAccounts = async (e) => {
        setAccLists(null)
        var result = await LoadAccount();
        setAccLists(result.data)

    }

    const LoadJaurnal = async (e) => {
        const Type = e.value === 1 || e.value === 2 ? "RV" : e.value === 3 || e.value === 4 ? "PV" : e.value === 5 ? "CV" : e.value === 6 ? "JV" : false;
        if (Type) {
            var vaucher = await FetchVoucherNo(Type);

            if (vaucher !== true) {
                setVoucherNo(vaucher)
                setVoucherType(e)
                setJournal(null)
                if (e.value === 1 || e.value === 2 || e.value === 3 || e.value === 4) {
                    var result = await LoadMainAcc(e.value === 1 ? 1 : e.value === 2 ? 1 : e.value === 3 ? 1 : e.value === 4 ? 1 : null);

                    setCMPJournal(result.Acc);
                }
                if (e.value === 4) {
                    setNarration("Being batch payment by bank to " + Name + ", voucher no- " + vaucher + ", farm " + Data.BusinessID.id + ". " + Data.BusinessID.Title)
                    setFormData({
                        ...formData,
                        BankID: ActiveBankData.BankID,
                        BankName: ActiveBankData.BankName,
                        ACName: ActiveBankData.ACName,
                        ACNo: ActiveBankData.ACNo
                    });
                } else {
                    setNarration("Being batch payment by cash to " + Name + ", voucher no- " + vaucher + ", farm " + Data.BusinessID.id + ". " + Data.BusinessID.Title)
                    setFormData({
                        BatchID: "",
                        COA_ID: "",
                        SLNo: "",
                    });
                }

                setPaymentMethod(e.value === 4 ? "Bank" : "Cash")
            } else {
                // history.push('/farm_lists');
            }
        }
    }

    const JournalList = [
        { value: 3, label: "Cash Payment" },
        { value: 4, label: "Bank Payment" }
    ]

    const getBanks = async () => {
        const BList = await LoadBanks()

        setBankLists(BList)
    }

    const GenVoucheArr = (e) => {
        setFormData({
            ...formData,
            COA_Code: e.COA_Code,
            COA_ID: e.value,
            BatchID: Data ? Data.id : "",

            SLNo: Count,
            AccountTitle: e.label,
            Debit: 0,
            Credit: 0,
        })
    }



    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-2">
                <p className="display-6 d-flex justify-content-center m-0">Farmer Payment Release</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center mb-2">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Farmer Payment Release</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-md-10 h-100 p-0">
                {
                    Data ?
                        <div className="row d-flex justify-content-center bg-white mx-auto py-2 mx-2">
                            <img
                                src={Data.Details[0].Image ? Data.Details[0].Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                className="img-fluid" alt="avatar" style={{ maxWidth: "15vh" }}
                                width="20px" height="20px" />

                            <div className={`text-center m-0  ${VoucherType ? VoucherType.value === 4 ? null : "border-bottom" : null}`}>
                                <small className="fs-4 fw-bold px-1">
                                    <Link Title="Go to farms to view active batch" to={`/farm_mng/${Data.UserID.id}/${Data.BusinessID.id}/${Data.id}`}>{Data.BusinessID.id + ". " + Data.BusinessID.Title}</Link>
                                </small>
                                <br />

                                <samll className="text-muted fw-bold">Batch No- {Data.BatchNo}, &nbsp; Batch ID- {Data.id}, &nbsp;</samll>
                                <Link Title="Go to user profiles" to={`/user_profile/${Data.UserID.id}`}>{Data.UserID.id + ". " + Data.Details[0].FullName}</Link>
                                <samll className="text-muted fw-bold px-1">&nbsp; {Data.BranchID.id + ". " + Data.BranchID.Name + " Branch"}</samll>
                                <br />
                                <small className='fs-6 m-0 border border-warning text-warning px-2 w-auto' style={{ borderRadius: "15px" }}>
                                    {Data.Status === 0 ? "Batch Closed"
                                        : Data.Status === 1 ? "Active"
                                            : Data.Status === 2 ? "Request for batch review"
                                                : Data.Status === 3 ? "Waiting for accounts approval"
                                                    : Data.Status === 4 ? "Paid"
                                                        : Data.Status === 5 ? "Payment hold"
                                                            : null}
                                </small>
                                <br />
                                <small className="text-muted">
                                    {"H#" + Data.Details[0].HoldingNo + ", Word No- " + Data.Details[0].WardNo + ", Postal Code- " + Data.Details[0].PostalCode}<br />
                                    {Data.Details[0].VillageName + ", " + Data.Details[0].Union + ", " + Data.Details[0].Upazila + ", " + Data.Details[0].Zila + ", " + Data.Details[0].Division}
                                </small>
                                {
                                    VoucherType && VoucherType.value === 4 && BankID ?
                                        <div className='d-flex justify-content-between border'>
                                            <div className='row justify-content-center m-0 border-right'>
                                                <p className='m-0 text-center text-muted'>Bank Name</p>
                                                <p className='m-0 text-center'><span className='text-dark fw-bold'>{BankName}</span></p>
                                            </div>
                                            <div className='row justify-content-center m-0 border-right'>
                                                <p className='m-0 text-center text-muted'>Branch Name</p>
                                                <p className='m-0 text-center'><span className='text-dark fw-bold'>{Branch}</span></p>
                                            </div>
                                            <div className='row justify-content-center m-0 border-right'>
                                                <p className='m-0 text-center text-muted'>A/C Name</p>
                                                <p className='m-0 text-center'><span className='text-dark fw-bold'>{ACName}</span></p>
                                            </div>
                                            <div className='row justify-content-center m-0'>
                                                <p className='m-0 text-center text-muted'>A/C No</p>
                                                <p className='m-0 text-center'><span className='text-dark fw-bold'>{ACNo}</span></p>
                                            </div>

                                        </div>
                                        : null
                                }
                            </div>

                            <div className={`d-flex justify-content-between`}>
                                <p className='m-0 text-left'>Voucher No:&nbsp;<span className='text-dark fw-bold'>{VoucherNo}</span></p>
                                <p className='m-0 text-right'>Date:&nbsp; <span className='text-dark fw-bold'>{moment(Date).format("DD MMM YYYY")}</span></p>
                            </div>

                        </div>
                        :
                        null
                }

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center">
                        <div className="row w-100 py-3">
                            <p className="fs-6 text-success text-center fw-bold m-0">Voucher Types</p>
                            <div className="col-sm-12 px-2">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={JournalList}
                                    name="Division"
                                    placeholder={"Please select voucher type"}
                                    styles={CScolourStyles}
                                    value={VoucherType ? VoucherType : null}
                                    onChange={(e) => LoadJaurnal(e)}
                                    required
                                    id="Title"
                                />
                            </div>
                        </div>
                    </div >

                    <div className="col-lg-1">
                        <div className="cs_outer" style={{ height: "100%" }}>
                            <div className="cs_inner"></div>
                        </div>
                    </div>

                    <div className="col-lg-6 d-flex flex-wrap align-items-center justify-content-center">
                        <form className="w-100">
                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label text-success fw-bold">Date</label>
                                <div className="col-sm-9">
                                    <Datepicker
                                        selected={Date}
                                        className="form-control fw-bold"
                                        dateFormat="dd MMM yyyy"
                                        onChange={(e) => setDate(e)}
                                        renderCustomHeader={props => customHeader({ ...props, locale })}
                                        locale={locales[locale]}
                                        placeholderText="Please select date"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success my-auto fw-bold">Name</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control fw-bold"
                                        id="Name"
                                        value={Name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-3 col-form-label text-success my-auto fw-bold">Narration</label>
                                <div className="col-sm-9">
                                    <textarea
                                        rows="2"
                                        type="text"
                                        className="form-control fw-bold"
                                        id="Narration"
                                        value={Narration}
                                        onChange={(e) => setNarration(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row d-flex justify-content-center m-0">

                    <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
                        <div className="col-sm-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Code</p>
                            <input
                                type="number"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                id="ItemCode"
                                placeholder="Code"
                                value={COA_Code ? COA_Code : ""}
                                required
                                disabled={Percent ? false : true}
                            />
                        </div>
                        <div className="col-sm-5" disabled>
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Select Accounts</p>
                            <div className="input-group fs-5 fw-bold">
                                {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
                                <div className="col-sm-12 px-0">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={AccLists ? AccLists : null}
                                        name="AccItems"
                                        placeholder={"Please select company"}
                                        styles={CScolourStyles}
                                        value={AccountTitle ? { label: AccountTitle, value: AccountID } : null}
                                        onChange={(e) => GenVoucheArr(e)}
                                        required
                                        id="AccTypes"
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="col-sm-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Debit</p>
                            <input
                                type="text"
                                id="Debit"
                                name="Debit"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Debit"
                                value={Debit ? Debit.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                // disabled={Percent ? false : true}
                                required
                            />
                        </div>
                        <div className="col-sm-2 border-right border-2">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Credit</p>
                            <input
                                type="text"
                                id="Credit"
                                name="Credit"
                                className="form-control fs-5 fw-bold p-0 text-center"
                                placeholder="Credit"
                                value={Credit ? Credit.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                // disabled={Percent ? false : true}
                                required
                            />
                        </div>

                        <div className="col-auto">
                            <p className="text-center text-dark fw-bold m-0" />
                            <button className="btn fs-3 p-0 text-success"
                                onClick={(e) => AddRow(e)}
                            >
                                <i className="fad fa-plus"></i>
                            </button>
                        </div>
                    </form>

                    <InfoMessage
                        header="Invalid Data"
                        body_header="Input data is not valid. Please fill input field correctly."
                        body="Please fill all field correctly"
                        show={InfoModalShow}
                        onHide={() => setInfoModalShow(false)}
                    />

                    {
                        Array.isArray(AccData) && AccData.length ?
                            <table className={`table table-hover table-borderless table-responsive card-1 d-table`}>
                                <thead>
                                    <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                        <th className="py-2 border-right"><span>S/N</span></th>
                                        <th className="py-2 border-right"><span>Description</span></th>
                                        <th className="py-2 border-right"><span>Debit</span></th>
                                        <th className="py-2 border-right"><span className="d-block text-right fw-bolder">Credit</span></th>
                                        <th className="py-2"><span>Action</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        AccData.map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-2">{item.AccountTitle}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-2">{parseFloat(item.Debit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-1 border-right"><span className="d-block fw-bold text-right px-2">{parseFloat(item.Credit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0">
                                                    <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i, i + 1)}>
                                                        <i className="fad fa-minus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className="text-center mt-3">
                                        <td className="p-1" colSpan="2"><span className="d-block text-right fw-bold">Total:</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">{getTotal().Debit.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="p-1"><span className="d-block fw-bolder text-right">{getTotal().Credit.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="px-3 py-0">
                                            <button type="button" className="btn fs-3 p-0 text-success"
                                                onClick={() => SaveVoucher()}
                                                disabled={getTotal().Debit === getTotal().Credit ? false : true}
                                            >
                                                <i className="fad fa-paper-plane px-2"></i>
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            :
                            <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                            </div>
                    }
                </div>


            </div>

        </div >
    )
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id
});

export default connect(mapStateToProps, { logout })(PaymentRelease);