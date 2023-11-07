// @ts-nocheck
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { AllConsignee, FetchConcern, FetchSisterSector, LoadAccount, LoadBanks, VoucherSave } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { GeneralColourStyles } from '../../../hocs/Class/SelectStyle';
import { InfoMessage } from "../../Modals/ModalForm.js";
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

let today = new Date();

const Voucher = ({ list, setList }) => {
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Error, setError] = useState({});
    const [Sister, setSister] = useState(false);
    const [Sector, setSector] = useState(false);
    const [ConsType, setConsType] = useState(false);
    const [Transact, setTransact] = useState(false);

    const [Reference, setReference] = useState("");
    const [VoucherType, setVoucherType] = useState(null);
    const [Date, setDate] = useState(today);
    const [Name, setName] = useState('');
    const [PaymentMethod, setPaymentMethod] = useState('');
    const [Narration, setNarration] = useState('');

    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue);
    const [Bank, setBank] = useState(false);
    const [ACName, setACName] = useState('');
    const [ACNumber, setACNumber] = useState('');
    const [ChequeNo, setChequeNo] = useState('');
    const [TrxNo, setTrxNo] = useState('');
    const [locale, setLocale] = useState('en');
    let [AccData, setAccData] = useState([]);
    const [AccLists, setAccLists] = useState(null);
    const [ConsigneeList, setConsigneeList] = useState(null);
    const [SisterList, setSisterList] = useState(null);
    const [SectorList, setSectorList] = useState(null);

    let Count = AccData.length;
    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        StaffID: "",
        PartyID: "",
        SupplierID: "",

        AccountTitle: "",
        AccountID: "",
        COA_Code: "",
        COA_ID: "",

        SLNo: "",
        Debit: "",
        Credit: "",
    });
    const { AccountID, AccountTitle, COA_Code, COA_ID, SLNo, Debit, Credit, Branch } = formData;

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadConcern();
    }, [])

    const LoadConcern = async () => {
        var result = await FetchConcern();
        if (result !== true) {
            setSisterList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const getSector = async (e) => {
        setSister(e)
        var result = await FetchSisterSector(e.value);
        if (result !== true) {
            setSectorList(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const Clearfiled = () => {
        setSister(false);
        setSector(false);
        setConsType(false);
        setTransact(false);
        setReference('');
        setVoucherType(null);
        setName('');
        setPaymentMethod('');
        setNarration('');
        setBank(false);
        setACName('');
        setACNumber('');
        setChequeNo('');
        setTrxNo('');
        setAccData([]);
    }

    const AddRow = (e) => {
        e.preventDefault()
        if ((VoucherType.value === 2 || VoucherType.value === 4) && Bank === false)
            return

        if (COA_ID && COA_Code && Debit && Credit) {
            setAccData([...AccData, formData]);
            setFormData({
                ...formData,
                AccountID: "",
                SLNo: "",
                AccountTitle: "",
                COA_ID: "",
                COA_Code: "",
                SLNo: "",
                Debit: "",
                Credit: "",
            });
        }
    }

    const getTotal = () => {
        let TotalDebit = 0.00;
        let TotalCredit = 0.00;
        const Debit = AccData.filter(Boolean).map(row => parseFloat(row.Debit));
        const Credit = AccData.filter(Boolean).map(row => parseFloat(row.Credit));

        if (Debit.length > 0 && Credit.length > 0) {
            TotalDebit = Debit.reduce((acc, val) => acc + val);
            TotalCredit = Credit.reduce((acc, val) => acc + val);
        }
        var Total = { "Debit": TotalDebit, "Credit": TotalCredit }
        return Total
    }

    const deleteRow = (i) => {
        if (!Array.isArray(AccData) || !AccData.length) return;
        setAccData([...AccData.slice(0, i), ...AccData.slice(i + 1)]);
    };

    const history = useHistory();

    const SaveVoucher = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var data = moment(Date).format('YYYY-MM-DD')
        AccData = AccData.map((item, index) => ({ ...item, SLNo: index + 1 }));
        var result = await VoucherSave(Sector, data, VoucherType?.value ?? '', Name, PaymentMethod, Narration, Reference, Count, Bank, ACName, ACNumber, ChequeNo, TrxNo, AccData);
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
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                Clearfiled();
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

    const LoadConsignee = async (e) => {
        setTransact(null)
        setFormData({ ...formData, PartyID: '', SupplierID: '', StaffID: '' });
        setConsigneeList(null)
        setConsType(e)
        if (e.value === 4)
            LoadAccounts();
        else
            var result = await AllConsignee(e.value);
        setConsigneeList(result)
    }

    const LoadAccounts = async (e) => {
        setAccLists(null)
        var result = await LoadAccount();
        setAccLists(result.data)
    }

    const LoadJaurnal = async (e) => {
        setConsType(false);
        setConsigneeList(null)
        if (e.value === 2 || e.value === 4)
            getBanks();
        setPaymentMethod(e.value === 2 || e.value === 4 ? "Bank" : "Cash")
        setVoucherType(e)
    }

    const ConsigneeTypes = [
        { value: 1, label: "Parties" },
        { value: 2, label: "Suppliers" },
        { value: 3, label: "Staff" },
        { value: 4, label: "Contra Journal" },
    ]

    const JournalList = [
        { value: 1, label: "Cash Received" },
        { value: 2, label: "Bank Received" },
        { value: 3, label: "Cash Payment" },
        { value: 4, label: "Bank Payment" },
        { value: 5, label: "Contra" },
        { value: 6, label: "Journal" }
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
            SLNo: Count,
            AccountTitle: e.label,
        })
    }

    const TransactHandler = (e) => {
        const fieldMap = {
            1: 'PartyID',
            2: 'SupplierID',
            3: 'StaffID',
            4: 'Contra',
        };
        const fieldName = fieldMap[ConsType.value];
        if (!fieldName) {
            console.error(`Invalid ConsType: ${ConsType}`);
            return;
        }
        setFormData({ ...formData, [fieldName]: e.value });
        setTransact(e);
        LoadAccounts();
    };

    const formatOptionLabel = ({ label, username, Address }) => {
        return (
            <div style={{ lineHeight: '1' }}>
                <div className='p-0 m-0' style={{ lineHeight: '1' }}>{label}</div>
                <small className='p-0 m-0 text-dark' style={{ lineHeight: '1' }}>{username || Address}</small>
            </div>
        );
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-2">
                <p className="display-6 d-flex justify-content-center m-0">Vouchers</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center mb-2">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/voucher">Voucher</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-10 h-100 p-0">

                <div className="row d-flex bg-white mx-auto">
                    <div className="col-lg-5 d-flex flex-wrap align-items-center justify-content-center">
                        <div className="row w-100 py-3">
                            <div className='d-flex justify-content-center p-0'>
                                <div className="col-sm-6 px-2">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Sisters</p>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={SisterList}
                                        name="Division"
                                        placeholder={"Select sister"}
                                        styles={GeneralColourStyles}
                                        value={Sister ? Sister : null}
                                        onChange={(e) => getSector(e)}
                                        required
                                        id="Sister"
                                    />
                                </div>
                                <div className="col-sm-6 px-2">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Sectors</p>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={SectorList}
                                        name="Consignee Type"
                                        placeholder={"Select sector"}
                                        styles={GeneralColourStyles}
                                        value={Sector}
                                        onChange={(e) => setSector(e)}
                                        required
                                        id="Sector"
                                        isDisabled={Sister ? false : true}
                                    />
                                </div>
                            </div>


                            <div className='d-flex justify-content-center p-0'>
                                <div className="col-sm-6 px-2">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Voucher Type</p>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={JournalList}
                                        name="Division"
                                        placeholder={"Select voucher type"}
                                        styles={GeneralColourStyles}
                                        value={VoucherType ? VoucherType : null}
                                        onChange={(e) => LoadJaurnal(e)}
                                        isDisabled={Sister && Sector ? false : true}
                                        required
                                        id="Title"
                                    />
                                </div>
                                <div className="col-sm-6 px-2">
                                    <p className="fs-6 text-success text-center fw-bold m-0">Consignee Type</p>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={ConsigneeTypes}
                                        name="Consignee Type"
                                        placeholder={"Select consignee type"}
                                        styles={GeneralColourStyles}
                                        value={ConsType}
                                        onChange={(e) => LoadConsignee(e)}
                                        required
                                        id="Title"
                                        isDisabled={VoucherType ? false : true}
                                    />
                                </div>
                            </div>


                            <label className="fs-6 text-success text-center fw-bold mt-2 mb-0">Transact</label>
                            <div className="col-sm-12 px-2">
                                {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={ConsigneeList}
                                    name="Consignee"
                                    placeholder={"Please select consignee"}
                                    styles={GeneralColourStyles}
                                    value={Transact}
                                    onChange={(e) => TransactHandler(e)}
                                    required
                                    id="Consignee"
                                    isDisabled={ConsType && ConsType.value !== 4 ? false : true}
                                    formatOptionLabel={formatOptionLabel}
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
                                <label className="col-sm-3 col-form-label text-success fw-bold">Reference</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control fw-bold"
                                        id="Reference"
                                        placeholder={"Reference"}
                                        value={Reference}
                                        onChange={(e) => setReference(e.target.value)}
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
                                        placeholder={"Name"}
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
                                        placeholder={"Narration"}
                                        id="Narration"
                                        value={Narration}
                                        onChange={(e) => setNarration(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {
                    VoucherType ? (VoucherType.value === 2 || VoucherType.value === 4) && (ConsType && Transact) ?
                        <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
                            <div className="col-sm-4">
                                <p className="text-center text-dark fw-bold m-0 border-bottom">Bank</p>
                                <div className="input-group fs-5 fw-bold">
                                    {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={BankLists ? BankLists : null}
                                        name="BankName"
                                        placeholder={"Please select bank"}
                                        styles={GeneralColourStyles}
                                        value={Bank}
                                        onChange={(e) => setBank(e)}
                                        required
                                        id="BankName"
                                    />
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <p className="text-center text-dark fw-bold m-0 border-bottom">A/C Name</p>
                                <input
                                    type="text"
                                    className="form-control fs-5 fw-bold p-0 text-center"
                                    name="ACName"
                                    id="ACName"
                                    placeholder="A/C Name"
                                    value={ACName}
                                    onChange={(e) => setACName(e.target.value)}
                                    // onKeyDown={(e) => shouldBlur(e)}
                                    required
                                />
                            </div>
                            <div className="col-sm-2">
                                <p className="text-center text-dark fw-bold m-0 border-bottom">A/C Number</p>
                                <input
                                    type="number"
                                    className="form-control fs-5 fw-bold p-0 text-center"
                                    name="ACNo"
                                    id="ACNo"
                                    placeholder="A/C Number"
                                    value={ACNumber}
                                    onChange={(e) => setACNumber(e.target.value)}
                                    // onKeyDown={(e) => shouldBlur(e)}
                                    required
                                />
                            </div>
                            <div className="col-sm-2">
                                <p className="text-center text-dark fw-bold m-0 border-bottom">Cheque No</p>
                                <input
                                    type="number"
                                    className="form-control fs-5 fw-bold p-0 text-center"
                                    name="ChequeNo"
                                    id="ChequeNo"
                                    placeholder="Cheque No"
                                    value={ChequeNo}
                                    onChange={(e) => setChequeNo(e.target.value)}
                                    // onKeyDown={(e) => shouldBlur(e)}
                                    required
                                />
                            </div>
                            <div className="col-sm-2">
                                <p className="text-center text-dark fw-bold m-0 border-bottom">Trx No</p>
                                <input
                                    type="number"
                                    className="form-control fs-5 fw-bold p-0 text-center"
                                    name="TrxNo"
                                    id="TrxNo"
                                    placeholder="Trx No/Receipt No/Reference"
                                    value={TrxNo}
                                    onChange={(e) => setTrxNo(e.target.value)}
                                    // onKeyDown={(e) => shouldBlur(e)}
                                    required
                                />
                            </div>
                        </form>
                        :
                        null
                        :
                        null
                }

                <div className="row justify-content-center mx-auto d-table w-100 h-100">
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
                                readOnly={!VoucherType || !ConsType || (!Transact && !ConsType.value === 4)}
                            />
                        </div>
                        <div className="col-sm-5">
                            <p className="text-center text-dark fw-bold m-0 border-bottom">Select Accounts</p>
                            <div className="input-group fs-5 fw-bold">
                                <div className="col-sm-12 px-0">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={AccLists ? AccLists : null}
                                        name="AccItems"
                                        placeholder={"Please select account"}
                                        styles={GeneralColourStyles}
                                        value={AccountTitle ? { label: AccountTitle, value: AccountID } : null}
                                        onChange={(e) => GenVoucheArr(e)}
                                        required
                                        id="AccTypes"
                                        isDisabled={!VoucherType || !ConsType || (!Transact && !ConsType.value === 4)}
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
                                readOnly={!VoucherType || !ConsType || (!Transact && !ConsType.value === 4)}
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
                                readOnly={!VoucherType || !ConsType || (!Transact && !ConsType.value === 4)}
                                required
                            />
                        </div>

                        <div className="col-auto">
                            <p className="text-center text-dark fw-bold m-0" />
                            <button className="btn fs-3 p-0 text-success" onClick={(e) => AddRow(e)} disabled={!VoucherType || !ConsType || (!Transact && !ConsType.value === 4)}
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
                        AccData.filter(Boolean) && AccData?.length ?
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
                                        AccData.filter(Boolean).map((item, i) => (
                                            <tr className="border-bottom text-center" key={i}>
                                                <td className="p-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-left px-2">{item.AccountTitle}</span></td>
                                                <td className="p-0 border-right"><span className="d-block fw-bold text-right px-2">{parseFloat(item.Debit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-1 border-right"><span className="d-block fw-bold text-right px-2">{parseFloat(item.Credit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="p-0">
                                                    <button className="btn fs-3 p-0 text-danger" onClick={() => deleteRow(i)}>
                                                        <i className="fad fa-minus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className="text-center border border-light mt-3">
                                        <td className="p-1" colSpan="2"><span className="d-block text-right fw-bold">Total:</span> </td>
                                        <td className="p-1"><span className="d-block text-right fw-bolder">{parseFloat(getTotal().Debit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="p-1"><span className="d-block fw-bolder text-right">{parseFloat(getTotal().Credit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
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
                                <p className='fs-2 fw-bold text-center text-success m-0'>No Item Found!</p>
                            </div>
                    }
                </div>


            </div>

        </div >
    )
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BisID: props.match.params.id
});

export default connect(mapStateToProps, { logout })(Voucher);