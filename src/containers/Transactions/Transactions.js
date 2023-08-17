import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchBankAcc, LoadBanks, LoadParty, RunningBalance, VoucherSave } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { FetchBatchList, LoadMyFarms } from '../../actions/ContractAPI';
import { FetchMyBis, FetchMyEmp, FetchMySuppliers } from '../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import BisList from '../AuthPages/Admin/BisList';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { AddBankModal } from './BankModal';
import { ConfirmModal } from './ConfirmModal';
import { MyCMBankModal } from './MyCMBankModal';

let today = new Date();

const Transactions = ({ CompanyID, BranchID, SupplierID, user, UserID, BisID, list, setList, accounts }) => {
    const initialValue = { value: 0, label: "" };
    const [Balance, setBalance] = useState(false);
    const [AddBankModalShow, setAddBankModalShow] = useState(false);
    const [ConfirmModalShow, setConfirmModalShow] = useState(false);
    const [BankModalShow, setBankModalShow] = useState(false);
    const [CSDate, setCSDate] = useState(today);
    const [Disable, setDisable] = useState(false);
    const [SearchKey, setSearchKey] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const [Date, setDate] = useState(today)
    const [VoucherType, setVoucherType] = useState(null)
    const [VoucherNo, setVoucherNo] = useState(0)
    const [Consignee, setConsignee] = useState("")
    const [PaymentMethod, setPaymentMethod] = useState(null)
    const [Narration, setNarration] = useState(null)
    const [Count, setCount] = useState(1)
    const [Amount, setAmount] = useState("")
    const [Name, setName] = useState(null)
    const [VoucherMap, setVoucherMap] = useState([])
    const [Type, setRecipientTypes] = useState(null)

    const [EmployeeList, setEmployeeList] = useState(null)
    const [OwnerList, setOwnerList] = useState(null)
    const [ContractLists, setContractLists] = useState(null)
    const [SupplierLists, setSupplierLists] = useState(null)
    const [PartyLists, setBisLists] = useState(null)
    const [BankLists, setBankLists] = useState(null)
    const [MyCMBAcc, setMyCMBAcc] = useState(null)
    const [BatchList, setBatchList] = useState(null)
    const [Accounts, setAccounts] = useState(null)
    const [SelectAccount, setSelectAccount] = useState(null)
    const [Error, setError] = useState({});

    const BusinessTypeList = [
        { value: 1, label: "Capital" },
        { value: 2, label: "Contract" },
        { value: 3, label: "Sub-dealer" },
        { value: 4, label: "Customer" },
        { value: 5, label: "Supplier" },
        { value: 6, label: "Party" },
        { value: 7, label: "Employee" },
        { value: 8, label: "Owner" },
    ]

    const [formData, setFormData] = useState({
        UserID: "",
        BisID: "",
        BatchID: "",
        SupplierID: "",

        AccountTitle: "",
        AccountID: "",
        COA_Code: "",
        COA_ID: "",

        SLNo: "",
        Debit: "",
        Credit: "",

        BankID: "",
        BankName: "",
        AccName: "",
        AccNumber: "",
        ChequeNo: "",
    });

    const { BatchID, BatchTitle, AccountID, AccountTitle, COA_Code, COA_ID, SLNo, Debit, Credit, BankID, BankName, BankBranchName, AccName, AccNumber, ChequeNo } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        FetchBalance(today);
    }, [])

    const getBanks = async () => {
        const BList = await LoadBanks()
        setBankLists(BList)
    }

    // const LoadVoucherNo = async () => {
    //     dispatch({ type: DISPLAY_OVERLAY, payload: true });
    //     const Type = VoucherType.value === 1 || VoucherType.value === 2 ? "RV" : VoucherType.value === 3 || VoucherType.value === 4 ? "PV" : VoucherType.value === 5 ? "CV" : VoucherType.value === 6 ? "JV" : false;
    //     if (Type) {
    //         var result = await FetchVoucherNo(Type);
    //         if (result !== true) {
    //             setVoucherNo(result)
    //         } else {
    //             // history.push('/farm_lists');
    //         }
    //     }
    //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
    // }

    const FetchBalance = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var csDate = moment(e).format('YYYY-MM-DD')
        var result = await RunningBalance(csDate);
        if (result !== true) {
            setBalance(result)
        } else {
            // history.push('/farm_lists');
        }
        setCSDate(e)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const MyBankAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await FetchBankAcc();
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
                setBankModalShow(false)
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                // setList([...list, toastProperties = {
                //     id: 1,
                //     title: result.Title,
                //     description: result.message,
                //     backgroundColor: '#f0ad4e',
                //     icon: result.ico === 1 ? infoIcon : successIcon
                // }])
                setMyCMBAcc(result)
                setBankModalShow(true)
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to load bank account. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            setBankModalShow(false)
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    // const LoadJaurnal = async (e) => {
    //     const Type = e.value === 1 || e.value === 2 ? "RV" : e.value === 3 || e.value === 4 ? "PV" : e.value === 5 ? "CV" : e.value === 6 ? "JV" : false;
    //     if (Type) {
    //         var result = await FetchVoucherNo(Type);
    //         if (result !== true) {
    //             setVoucherNo(result)
    //             setVoucherType(e)
    //             if (e.value === 1 || e.value === 2 || e.value === 3 || e.value === 4) {
    //                 var acc_result = await LoadMainAcc();
    //                 setAccounts(acc_result);
    //             }
    //             if (e.value === 2 || e.value === 4 || e.value === 5 || e.value === 6) {
    //                 MyBankAcc();
    //                 getBanks();
    //             }
    //             setPaymentMethod(e.value === 1 || e.value === 3 ? { label: "Cash", value: 0 } : "N/A")
    //         } else {
    //             // history.push('/farm_lists');
    //         }
    //     }
    // }

    const CScolourStyles = {
        control: (provided, state) => ({
            ...provided,
            flex: 1,
            boxShadow: "none",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold"
        }),

        menuList: (provided, state) => {
            return {
                ...provided,
                textAlign: "center"
            };
        },
        valueContainer: (base, state) => ({
            ...base,
            justifyContent: "center"
        }),
    }

    const LoadBusinessTypes = async (e) => {
        setRecipientTypes(e)
        if (e.value === 1) {
            // Capital
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setContractLists(null);
            setSupplierLists(false);
            setBisLists(false);
            var result = await LoadParty();
            setContractLists(result)
        } else if (e.value === 2) {
            // Contract
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setContractLists(null);
            setSupplierLists(false);
            setBisLists(false);
            var result = await LoadMyFarms();
            setContractLists(result.farms)
        }
        else if (e.value === 3) {
            // Sub-dealer
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setSupplierLists(false);
            setContractLists(false);
            setBisLists(false);
            var result = await FetchMyBis(2);
            setBisLists(result.data)
        }
        else if (e.value === 4) {
            // Customer
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setSupplierLists(false);
            setContractLists(false);
            setBisLists(false);
            var result = await FetchMyBis(4);
            setBisLists(result.data)
        }
        else if (e.value === 5) {
            // Supplier
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setSupplierLists(false);
            setBisLists(false);
            setContractLists(false);
            var result = await FetchMySuppliers();
            setSupplierLists(result.data)
        } else if (e.value === 6) {
            // Party
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setBisLists(false);
            setSupplierLists(false);
            setContractLists(false);
            var result = await FetchMyBis(3);
            setBisLists(result.data)
        } else if (e.value === 7) {
            // Employee
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setSupplierLists(false);
            setContractLists(false);
            setBisLists(false);
            var result = await FetchMyEmp();
            setEmployeeList(result.data)
        } else if (e.value === 8) {
            // Owner
            setConsignee(false);
            setName(null);
            setEmployeeList(false);
            setOwnerList(false);
            setSupplierLists(false);
            setContractLists(false);
            setBisLists(false);
            // var result = await FetchMyBis(3);
            // setOwnerList(result.data)
        }
    }

    const GetConsignee = async (e) => {
        if (Type.value === 2) {
            setBatchList(false);
            var result = await FetchBatchList(e.value);
            setBatchList(result)
            setName(e.label)
            setConsignee(e)
        } else if (Type.value === 3 || Type.value === 4 || Type.value === 5 || Type.value === 6 || Type.value === 7) {
            setName(e.label)
            setConsignee(e)
        }
        setFormData({
            ...formData,
            UserID: Type ? Type.value === 2 ? e.UserID : "" : "",
            BusinessID: Type ? Type.value === 2 ? e.BusinessID : Type.value === 3 || Type.value === 4 || Type.value === 6 ? e.value : "" : "",
            BatchID: Type ? Type.value === 2 || e.value === 1 ? e.value : "" : "",
            SupplierID: Type ? Type.value === 5 ? e.value : "" : "",
        })
    }

    const AmountHandler = (e) => {
        e.preventDefault()
        if (VoucherType.value === 1)
            setFormData({ ...formData, SLNo: 1, COA_ID: accounts.CashAC_ID, AccountTitle: accounts.CashAC, COA_Code: accounts.CashAC_Code, Debit: e.target.value, Credit: 0 })
        else if (VoucherType.value === 3)
            setFormData({ ...formData, SLNo: 2, COA_ID: accounts.CashAC_ID, AccountTitle: accounts.CashAC, COA_Code: accounts.CashAC_Code, Credit: e.target.value, Debit: 0 })
        else if (VoucherType.value === 2)
            setFormData({ ...formData, Debit: e.target.value, Credit: 0 })
        else if (VoucherType.value === 4)
            setFormData({ ...formData, Credit: e.target.value, Debit: 0 })

        setAmount(e.target.value);
    }

    const AccountHandler = (e) => {
        if (VoucherType.value === 1)
            setFormData({ ...formData, SLNo: 2, COA_ID: e.value, AccountTitle: e.label, COA_Code: e.COA_Code, Debit: 0, Credit: Amount })
        else if (VoucherType.value === 3)
            setFormData({ ...formData, SLNo: 1, COA_ID: e.value, AccountTitle: e.label, COA_Code: e.COA_Code, Debit: Amount, Credit: 0 })
        else if (VoucherType.value === 2)
            setFormData({ ...formData, SLNo: 2, COA_ID: e.value, AccountTitle: e.label, COA_Code: e.COA_Code, Debit: 0, Credit: Amount })
        else if (VoucherType.value === 4)
            setFormData({ ...formData, SLNo: 1, COA_ID: e.value, AccountTitle: e.label, COA_Code: e.COA_Code, Credit: 0, Debit: Amount })
    }

    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    const Validate = () => {
        if (isStringNullOrWhiteSpace(CSDate) && isStringNullOrWhiteSpace(VoucherType) && isStringNullOrWhiteSpace(Consignee) && isStringNullOrWhiteSpace(SelectAccount))
            return false;
        return true;
    }

    const AddRow = (e) => {
        if (Validate() && !isStringNullOrWhiteSpace(Amount)) {
            setDisable(true);
            setVoucherMap([...VoucherMap, formData]);
            setCount(Count + 1);
            setConfirmModalShow(true)
        }
    }

    const SaveVoucher = async () => {
        if (accounts !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var data = moment(Date).format('YYYY-MM-DD')
            var result = await VoucherSave(VoucherType, data, VoucherNo, PaymentMethod.label, Name, Narration, 2, VoucherMap);
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
                    setConfirmModalShow(false)
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    clearField();
                    FetchBalance(CSDate);
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
                deleteRow()
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });

        } else {
            history.push('/my_supplier');
            setConfirmModalShow(false)
        }
    }

    const deleteRow = () => {
        if (VoucherType.value === 1 || VoucherType.value === 2) {
            VoucherMap.splice(1, 1).concat(VoucherMap.slice(1 + 1))
            setConfirmModalShow(false);
        }
        else if (VoucherType.value === 3 || VoucherType.value === 4) {
            VoucherMap.splice(0, 1).concat(VoucherMap.slice(0 + 1))
            setConfirmModalShow(false);
        }
    };

    const clearField = (e) => {
        setVoucherMap([]);
        setDisable(false)
        setFormData({
            UserID: "",
            BisID: "",
            BatchID: "",
            SupplierID: "",

            AccountTitle: "",
            AccountID: "",
            COA_Code: "",
            COA_ID: "",

            SLNo: "",
            Debit: "",
            Credit: "",

            BankID: "",
            BankName: "",
            AccName: "",
            AccNumber: "",
            ChequeNo: "",
        });
        setVoucherType(null);
        setRecipientTypes(null);
        setConsignee(null);
        setAmount("");
        setSelectAccount("");
        setNarration("");
        setConfirmModalShow(false)
    }

    const ModalBankData = (e, acc_data) => {
        if (VoucherType.value === 2)
            setFormData({ ...formData, SLNo: 1, COA_ID: acc_data.value, AccountTitle: acc_data.label, COA_Code: acc_data.COA_Code })
        else if (VoucherType.value === 4)
            setFormData({ ...formData, SLNo: 2, COA_ID: acc_data.value, AccountTitle: acc_data.label, COA_Code: acc_data.COA_Code })

        setBankModalShow(false);
    }

    const BankDataAction = (acc_info) => {
        setFormData({ ...formData, ...acc_info })
        setAddBankModalShow(false);
    }

    const recipientTypeOptions = [
        { label: "Sundry Debtor/Party", value: 1 },
        { label: "Apartment", value: 2 },
        { label: "Others", value: 3 }
    ];

    const payeeTypeOptions = [
        { label: "Sundry Creditor/Supplier", value: 1 },
        { label: "Staff", value: 2 },
        { label: "Others", value: 3 }
    ];

    const voucherTypeOptions = [
        ...recipientTypeOptions,
        { label: "Sundry Creditor/Supplier", value: 4 },
        { label: "Staff", value: 5 },
        { label: "Drawing", value: 6 },
        { label: "Capital", value: 7 }
    ];

    return (
        <Fragment>
            <div className="row d-flex justify-content-center p-0 mb-4">
                <div className="col-lg-6 h-100 p-0 border">
                    <div className="header mb-2 p-0">
                        <p className="fw-bolder display-6 d-flex justify-content-center m-0">TRANSACTION</p>
                        <small className="text-muted fs-5 fw-bold d-flex justify-content-center">Make your transaction by filling required field</small>
                    </div>

                    <div className="row justify-content-center align-items-center border-bottom p-0 mx-0">
                        <div className="d-flex justify-content-between align-items-center col-6 bg-white fs-3 text-dark fw-bolder text-center border-right border-light px-2 py-0"><i className="fad fa-scale-down fa-flip-horizontal text-left"></i> <p className='ml-0 my-0 mr-1'>{!isStringNullOrWhiteSpace(Balance) ? parseFloat(Balance.CashIn).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : 0.00}</p></div>
                        {/* <span className='fs-4 fw-bolder'>&#x09F3;</span>  */}
                        <div className="d-flex justify-content-between align-items-center col-6 bg-white fs-3 text-danger fw-bolder text-center border-left border-light px-2 py-0"><i className="fad fa-scale-up fa-flip-horizontal"></i> <span>{!isStringNullOrWhiteSpace(Balance) ? parseFloat(Balance.CashOut).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : 0.00}</span></div>
                    </div>
                    <div className="row justify-content-center align-items-center border-bottom p-0 m-0">
                        <div className="d-flex justify-content-between align-items-center col-6 bg-white fs-3 text-success fw-bolder text-center border-right border-light px-2 py-0"><i className="fad fa-university"></i><p className='ml-0 my-0 mr-1'>{!isStringNullOrWhiteSpace(Balance) ? parseFloat(Balance.TotalBank).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : 0.00}</p></div>
                        {/* <span className='fs-4 fw-bolder'>&#x09F3;</span>  */}
                        <div className="d-flex justify-content-between align-items-center col-6 bg-white fs-3 text-success fw-bolder text-center border-left border-light px-2 py-0"><i className="fad fa-hand-holding-usd"></i><span>{!isStringNullOrWhiteSpace(Balance) ? parseFloat(Balance.TotalCash).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : 0.00}</span></div>
                    </div>
                    <div className="col-12 p-0 m-0"><p className='bg-white fs-3 text-dark fw-bolder text-center m-0' onClick={() => RunningBalance(Date)}>Liquid- &nbsp;  <i className='fs-2 text-success fw-bolder fad fa-sack-dollar'></i> &nbsp;{!isStringNullOrWhiteSpace(Balance) ? parseFloat(Balance.Total).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : 0.00}</p></div>
                </div>
            </div>

            <div className="row d-flex justify-content-center p-0">
                <div className="col-lg-6 h-100 p-0">
                    <p className='fs-6 text-dark fw-bolder text-center m-0'>{VoucherNo ? VoucherNo : "N/A"}</p>
                    <div className="row justify-content-center align-items-center mt-1 mb-3 m-0 p-0">
                        <Datepicker
                            selected={CSDate}
                            className="form-control border-0 rounded text-center text-dark fw-bolder fs-3 p-0"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => FetchBalance(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Please select date"
                            disabled={Disable}
                        />
                        <div className="col-lg-12 col-lg-offset-4 mt-2 p-0 align-items-center">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={[{ value: 1, label: "Receipt voucher" }, { value: 2, label: "Payment voucher" }, { value: 3, label: "Journal voucher" }, { value: 4, label: "Contra Entry" }]}
                                name="Voucher"
                                placeholder={"Voucher Type"}
                                styles={CScolourStyles}
                                value={VoucherType ? VoucherType : ""}
                                onChange={(e) => setVoucherType(e)}
                                required
                                id="Voucher"
                                isDisabled={Disable}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                        {[1, 2, 3].includes(VoucherType?.value) && (
                            <div className="col-lg-12 col-lg-offset-4 mt-2 p-0 justify-centent-center align-items-center text-center">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius="0"
                                    options={
                                        VoucherType?.value === 1 ? payeeTypeOptions :
                                            VoucherType?.value === 2 ? recipientTypeOptions : VoucherType?.value === 3 ? voucherTypeOptions :
                                                null
                                    }
                                    name="Type"
                                    placeholder={
                                        VoucherType?.value === 1 ? "Payee Type" :
                                            VoucherType?.value === 2 ? "Recipient Type" :
                                                "Recipient/Payee Type"
                                    }
                                    styles={CScolourStyles}
                                    value={Type}
                                    onChange={LoadBusinessTypes}
                                    required
                                    id="Type"
                                    isDisabled={Disable || isStringNullOrWhiteSpace(VoucherType)}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                />
                            </div>
                        )}

                        <div className="col-lg-12 col-lg-offset-4 mt-2 p-0 align-items-center">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(ContractLists) && ContractLists.length ?
                                    ContractLists.map((item) => ({ label: item.Title, value: item.BatchID, BusinessID: item.FarmID, UserID: item.UserID }))
                                    : Array.isArray(SupplierLists) && SupplierLists.length ? SupplierLists :
                                        Array.isArray(PartyLists) && PartyLists.length ? PartyLists
                                            : Array.isArray(BisList) && BisList.length ? BisList :
                                                Array.isArray(EmployeeList) && EmployeeList.length ? EmployeeList
                                                    : []
                                }
                                name="Consignee"
                                placeholder={"Please select consignee"}
                                styles={CScolourStyles}
                                value={Consignee}
                                onChange={(e) => GetConsignee(e)}
                                required
                                id="Consignee"
                                isDisabled={Disable || isStringNullOrWhiteSpace(VoucherType) || isStringNullOrWhiteSpace(Type)}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>

                        {/* <div className={`col-lg-12 col-lg-offset-4 mt-2 p-0 justify-centent-center align-items-center text-center ${Type ? Type.value !== 2 ? "d-none" : null : "d-none"}`}>
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={BatchList}
                                name="BatchID"
                                placeholder={"Select batch"}
                                styles={CScolourStyles}
                                value={BatchTitle ? { label: BatchTitle, value: BatchID } : null}
                                onChange={(e) => setFormData({ ...formData, "BatchID": e.value, "BatchTitle": e.label })}
                                required
                                id="BatchID"
                                isDisabled={Disable || isStringNullOrWhiteSpace(VoucherType) || isStringNullOrWhiteSpace(Type) || isStringNullOrWhiteSpace(Consignee)}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                         */}
                        {/* <div className={`col-lg-12 col-lg-offset-4 mt-2 p-0 justify-centent-center align-items-center text-center ${VoucherType ? VoucherType.value === 2 || VoucherType.value === 4 ? null : "d-none" : "d-none"}`}>
                            <div className="d-flex row justify-content-between align-items-center mt-2 m-0 p-0">
                                <div className="col-4 p-0">
                                    <div className="form-group m-0">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            // options={BisBankList}
                                            defaultValue={{ label: "Select Bank Account", value: 0 }}
                                            name="SenderBank"
                                            placeholder={"Saved Bank List"}
                                            styles={CScolourStyles}
                                            // value={{ value: SenderBank, label: SenderBankLabel }}
                                            // onChange={e => setFormData({ ...formData, SenderBank: e.value, SenderBankLabel: e.label })}
                                            isDisabled={Disable}
                                        />
                                        {Error.SenderBank ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SenderBank}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="form-group m-0">
                                        <button className='btn btn-outline-dark fw-bolder fs-4 w-100' disabled={Disable} onClick={() => setAddBankModalShow(true)}>A/C Info</button>
                                    </div>
                                </div>

                                <div className="col-4 p-0">
                                    <div className="form-group m-0">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={TransferMethodList}
                                            defaultValue={{ label: "Select Dept", value: 0 }}
                                            name="PaymentMethod"
                                            placeholder={"Type"}
                                            styles={CScolourStyles}
                                            value={PaymentMethod}
                                            onChange={e => setPaymentMethod(e)}
                                            isDisabled={Disable}
                                        />
                                        {Error.PaymentMethod ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PaymentMethod}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="col-lg-12 col-lg-offset-4 mt-2 p-0">
                            <div className="input-group">
                                <input
                                    type="numeric"
                                    className="form-control border-0 rounded text-center text-dark fw-bolder fs-3 mx-auto"
                                    placeholder="Amount"
                                    value={Amount}
                                    onChange={(e) => AmountHandler(e)}
                                    onBlur={(e) => AddRow(e)}
                                    disabled={Disable || isStringNullOrWhiteSpace(VoucherType) || isStringNullOrWhiteSpace(Type) || isStringNullOrWhiteSpace(Consignee)}
                                />
                            </div>
                        </div>

                        <div className="col-lg-12 col-lg-offset-4 mt-2 p-0 justify-centent-center align-items-center text-center">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Accounts}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.COA_Code}
                                name="Accounts"
                                placeholder={"Please select accounts"}
                                styles={CScolourStyles}
                                value={SelectAccount}
                                // onChange={(e) => setSelectAccount(e)}
                                onChange={(e) => { AccountHandler(e); setSelectAccount(e) }}
                                required
                                id="Type"
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                disabled={isStringNullOrWhiteSpace(VoucherType) || isStringNullOrWhiteSpace(Type) || isStringNullOrWhiteSpace(Consignee)}
                            />
                        </div>

                        <div className="col-lg-12 col-lg-offset-4 mt-2 p-0">
                            <div className="input-group">
                                <textarea
                                    rows="2"
                                    className="form-control fw-bold border-0 text-center text-dark fs-5 mx-auto my-auto"
                                    placeholder="Narration"
                                    value={Narration}
                                    onChange={(e) => setNarration(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="d-flex justify-content-around align-items-end mt-2 m-0 p-0">
                        <button className="btn btn-warning rounded-circle text-center fw-bolder fs-2 mt-3 px-3" onClick={(e) => clearField(e)}><i className="fad fa-times"></i></button>
                        <Link className="btn btn-outline-dark rounded-circle text-center fw-bolder fs-2 px-3 py-2" to='/cash_flow'><i className="fad fa-sack-dollar"></i></Link>
                        <button className="btn btn-success rounded-circle text-center fw-bolder fs-2 mt-3" onClick={(e) => AddRow(e)}
                            disabled={Array.isArray(VoucherMap) && VoucherMap.length === 1 ? false : true}
                        ><i className="fad fa-long-arrow-right"></i></button>
                    </div>
                </div>
                {
                    Array.isArray(VoucherMap) && VoucherMap.length === 2 ?
                        <ConfirmModal
                            Voucher={{ "Date": CSDate, "VoucherNo": VoucherNo, "VoucherType": VoucherType, "Consignee": Consignee, "Batch": BatchTitle, "PaymentMethod": PaymentMethod, "Narration": Narration }}
                            Bank={{ "BankName": BankName, "BranchName": BankBranchName, "AccName": AccName, "AccNumber": AccNumber, "ChequeNo": ChequeNo }}
                            VoucherMap={VoucherMap}
                            show={VoucherType && ConfirmModalShow}
                            list={list}
                            setList={setList}
                            onConfirm={() => SaveVoucher()}
                            onReload={() => null}
                            onHide={() => deleteRow()}
                        />
                        : null
                }

                {
                    !isStringNullOrWhiteSpace(VoucherType) ?
                        <MyCMBankModal
                            array={MyCMBAcc}
                            show={VoucherType && BankModalShow}
                            list={list}
                            setList={setList}
                            onConfirm={(e, acc_data) => ModalBankData(e, acc_data)}
                            onReload={() => null}
                            onHide={() => { setVoucherType(null); setBankModalShow(false) }}
                        />
                        : null
                }

                <AddBankModal
                    UserID={""}
                    BusinessID={BisID}
                    SupplierID={SupplierID}
                    BatchID={BatchID}
                    BankList={BankLists}
                    show={AddBankModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => { setAddBankModalShow(false); }}
                    onAction={(acc_info) => BankDataAction(acc_info)}
                    onHide={() => { setAddBankModalShow(false); }}
                />

                {/* <InfoMessage
                header={InfoModalShow ? "Invalid Data" : DateModalShow ? "Invalid Date!" : ABWModalShow ? "ABW Empty" : StockModal ? "Stock Feed Negative" : null}
                body_header={InfoModalShow ? "Input data is not valid. Please fill input field correctly." : DateModalShow ? "You can not daily record before issue date." : ABWModalShow ? "Plese fill Average Body Weight field." : StockModal ? "Stock can not entry negative value" : null}
                body={InfoModalShow ? "Please fill all field correctly" : DateModalShow ? "Please select date after issue date." : ABWModalShow ? "Please type average body weight" : StockModal ? "Please calculate the consumption properly" : null}
                show={InfoModalShow || DateModalShow || ABWModalShow || StockModal}
                onHide={() => { setInfoModalShow(false); setDateModalShow(false); setABWModalShow(false); setStockModal(false) }}
            /> */}
                {/* <InfoMessage
                header="Invalid Date!"
                body_header="You can not daily record before issue date."
                body="Please select date after issue date."
                show={DateModalShow}
                onHide={() => setDateModalShow(false)}
            /> */}
            </div >
        </Fragment>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    accounts: state.auth.accounts,
});

export default connect(mapStateToProps, { logout })(Transactions);