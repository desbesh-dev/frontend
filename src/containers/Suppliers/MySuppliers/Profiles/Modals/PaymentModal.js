
import moment from "moment";
import { useRef, useState } from 'react';
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { LoadBanks } from "../../../../../actions/APIHandler";
import { getPaymentShort } from "../../../../../actions/ContractAPI";
import { PaymentTerms } from '../../../../../actions/InventoryAPI';
import { SupplierPayment } from "../../../../../actions/SuppliersAPI";
import errorIcon from '../../../../../assets/error.png';
import infoIcon from '../../../../../assets/info.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

export const CreatePaymentModal = (props) => {
    const [Click, setClick] = useState(false)
    const [Bank, setBank] = useState(false)
    const [ACName, setACName] = useState('')
    const [ACNumber, setACNumber] = useState('')
    const [ChequeNo, setChequeNo] = useState('')
    const [TrxNo, setTrxNo] = useState('')
    const [BankLists, setBankLists] = useState(false)
    const [IsBank, setIsBank] = useState(false)
    const [IsCard, setIsCard] = useState(false)
    const [IsCheque, setIsCheque] = useState(false)
    const [IsOnline, setIsOnline] = useState(false)
    const [Paid, setPaid] = useState(props.item.PaidAmount)
    const [Due, setDue] = useState(props.item.Due)
    const [Disc, setDisc] = useState(0.00)
    const [PaidAmount, setPaidAmount] = useState(0.00)
    const [Discount, setDiscount] = useState(0.00)
    const [Payment, setPayment] = useState('')
    const [Error, setError] = useState({});
    const discRef = useRef(null);
    const bankRef = useRef(null);
    let toastProperties = null;


    const ActionClick = (e, Bank) => {
        setClick(true);
        props.onConfirm(e, Bank);
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontSize: "18px",
            fontWeight: "bold",
            maxWidth: "400px",
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
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ReduceDue = (e) => {
        const { name, value } = e.target;
        if (e.nativeEvent.inputType === "deleteContentBackward" && value === "") {
            if (name === "PaidAmount") {
                const d = parseFloat(props.item.Due) - parseFloat(Discount);
                const p = parseFloat(props.item.PaidAmount) + parseFloat(Discount);
                setDue(d);
                setPaid(p);
                setPaidAmount('');
                return;
            } else if (name === "Discount") {
                const d = parseFloat(props.item.Due) - parseFloat(PaidAmount);
                const p = parseFloat(props.item.PaidAmount) + parseFloat(PaidAmount);
                setDue(d);
                setPaid(p);
                setDiscount(0.00);
                discRef.current.blur();
                return;
            }
        }

        if (isNaN(value) || value < 0) {
            setError({ ...Error, [name]: "Please enter a valid value" });
            return;
        }
        setError({ ...Error, [name]: null });

        const newValue = value;
        const pre_pay = parseFloat(props.item.PaidAmount, 10);
        const due = parseFloat(props.item.Due, 10);

        if (name === "PaidAmount") {
            const newDue = parseFloat(due) - parseFloat(newValue) - parseFloat(Discount);
            const newPay = parseFloat(pre_pay) + parseFloat(newValue) + parseFloat(Discount);
            if (parseFloat(newDue) >= 0 && parseFloat(newDue) <= parseFloat(due)) {
                setPaidAmount(newValue);
                setPaid(newPay);
                setDue(newDue);
                const { PaidAmount, ...updatedState } = Error;
                setError(updatedState);
            }
        } else if (name === "Discount") {
            const d_pay = parseFloat(newValue) + parseFloat(pre_pay) + parseFloat(PaidAmount);
            const d_due = parseFloat(due) - parseFloat(newValue) - parseFloat(PaidAmount);
            if (parseFloat(d_due) >= 0 && parseFloat(d_due) <= parseFloat(due)) {
                setDiscount(newValue);
                setPaid(d_pay);
                setDue(d_due);
                const { Discount, ...updatedState } = Error;
                setError(updatedState);
            }
        }
    };

    function isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    function isValidPayment(value) {
        return isValidNumber(value) && value > 0;
    }

    function isValidDiscount(value) {
        return isValidNumber(value) && value >= 0;
    }

    function isValidPaidAmount(value, due) {
        return isValidNumber(value) && value >= 0 && value <= due;
    }

    function isValidDue(value) {
        return isValidNumber(value) && value >= 0;
    }

    const validateInputs = (payment, discount, paidAmount, due, bank) => {
        if (!isValidPayment(payment)) {
            setError((prevState) => ({ ...prevState, Payment: "Payment must be select." }));
            return false;
        }
        if (payment === 15 || payment === 16) {
            if (!ACName) {
                setError((prevState) => ({ ...prevState, FrmAccName: "Please enter an account name" }));
                return false;
            }
            if (
                !ACNumber ||
                (typeof ACNumber !== "string" && typeof ACNumber !== "number") || // check if ACNumber is a string or number
                (ACNumber.toString().length >= 8 && ACNumber.toString().length <= 20 && /^\d+$|N\/A/i.test(ACNumber.toString()))
            ) {
                setError((prevState) => ({ ...prevState, FrmAccNumber: "Please enter a valid account number" }));
                return false;
            }
        }

        if (payment === 16) {
            if (!ChequeNo || ChequeNo.length < 6 || ChequeNo.length > 20) {
                setError((prevState) => ({ ...prevState, FrmChequeNo: "Cheque number must be between 6 and 20 characters" }));
                return false;
            }
        }

        if (payment === 17 || payment === 18) {
            if (!TrxNo || TrxNo.length < 6 || TrxNo.length > 20) {
                setError((prevState) => ({ ...prevState, TrxNo: "Cheque number must be between 6 and 20 characters" }));
                return false;
            }
        }
        if (!isValidDiscount(discount)) {
            setError((prevState) => ({ ...prevState, Discount: "Discount must be a non-negative number." }));
            return false;
        }

        if (!isValidPaidAmount(paidAmount, parseFloat(props.item.Due, 10))) {
            setError((prevState) => ({ ...prevState, PaidAmount: `Paid amount must be a number between 0 and ${parseFloat(props.item.Due, 10)}.` }));
            return false;
        }

        if (!isValidDue(parseFloat(props.item.Due, 10))) {
            setError((prevState) => ({ ...prevState, Due: "Due must be a non-negative number." }));
            return false;
        }

        // Check that PaidAmount + Discount is not zero
        if (paidAmount + discount === 0) {
            setError((prevState) => ({ ...prevState, PaidAmount: "Paid amount cannot add up to zero.", Discount: "Discount cannot add up to zero." }));
            return false;
        }

        // Check that PaidAmount + Discount is not greater than Due
        if (paidAmount + discount > parseFloat(props.item.Due, 10)) {
            setError((prevState) => ({ ...prevState, PaidAmount: "Payment cannot be greater than the due amount.", Discount: "Discount cannot be greater than the due amount." }));
            return false;
        }
        return true
    };

    const Pay = async (e) => {
        e.preventDefault();

        const payment = parseInt(Payment.value);
        const bank = Bank?.value;
        const discount = parseFloat(Discount);
        const paidAmount = parseFloat(PaidAmount);
        const due = parseFloat(Due);
        const isValid = validateInputs(payment, discount, paidAmount, due, bank);

        if (isValid) {
            const result = await SupplierPayment(props.item.id, payment, discount, paidAmount, due, IsBank, IsCheque, IsCard, IsOnline, bank, ACName, ACNumber, ChequeNo, TrxNo);

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
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])
                } else {
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])
                    props.onReload();
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: "Invoice payment failed. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        }
    }

    const getBanks = async () => {
        const BList = await LoadBanks()
        setBankLists(BList)
    }

    const BankHandler = (e) => {
        const { Payment, ...updatedState } = Error; // remove Payment field from Error
        setPayment(e);
        setError(updatedState); // set updated error state without Payment field
        switch (parseInt(e.value)) {
            case 15: //Bank Payment
                getBanks();
                setIsCheque(false);
                setIsCard(false);
                setIsOnline(false);
                setIsBank(true);
                break;
            case 16: //Bank Cheque Payment
                getBanks();
                setIsCard(false);
                setIsOnline(false);
                setIsBank(true);
                setIsCheque(true);
                break;
            case 17: //Online Payment WesterUnion, Ria, TransferWise, PayPal etc.
                getBanks();
                setIsCard(false);
                setIsBank(false);
                setIsCheque(false);
                setIsOnline(true);
                break;
            case 18: //Card Payment
                getBanks();
                setIsBank(false);
                setIsCheque(false);
                setIsOnline(false);
                setIsCard(true);
                break;
            default:
                setIsBank(false);
                setIsCheque(false);
                setIsCard(false);
                setIsOnline(false);
                break;
        }
    };

    return (
        <Modal
            {...props}
            size="medium"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            dialogClassName="modal-md"
        >
            <Modal.Header className="py-2 border-bottom-0" closeButton>
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark text-center m-0 justify-content-center w-100">
                    Make Payment <br />
                    <small>Generating Payment Voucher</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <table className="table my-table table-borderless text-nowrap">
                    <tbody>
                        <tr className="border-top">
                            <td>Invoice Date:</td>
                            <td><span className="fw-bold">{moment(props.item?.InvDate).format("DD MMM YYYY") ?? "N/A"}</span></td>
                            <td>Order No:</td>
                            <td><span className="fw-bold">{props.item?.OrderNo ?? "N/A"}</span></td>
                            <td>Items:</td>
                            <td className="fw-bolder text-right"><span>{props.item.Count}</span></td>
                        </tr>
                        <tr>
                            <td>Received Date:</td>
                            <td><span className="fw-bold">{moment(props.item?.RcvDate).format("DD MMM YYYY") ?? "N/A"}</span></td>
                            <td>Purchase No:</td>
                            <td><span className="fw-bold">{props.item?.PurchaseNo ?? "N/A"}</span></td>
                            <td>Amount:</td>
                            <td className="fw-bolder text-right"><span>{parseFloat(props.item.GrandTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                        </tr>
                        <tr className="border-bottom">
                            <td>Payment:</td>
                            <td><span className="fw-bold">{getPaymentShort(props.item?.Payment, PaymentTerms) ?? "N/A"}</span></td>
                            <td>Invoice No:</td>
                            <td><span className="fw-bold">{props.item?.InvoiceNo ?? "N/A"}</span></td>
                            <td>Paid:</td>
                            <td className="fw-bolder text-right"><span>{parseFloat(Paid).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                        </tr>
                        <tr className="border-bottom">
                            <td>Receiver:</td>
                            <td colSpan="3"><span className="fw-bold">{props.item.Receiver}</span></td>
                            <td className="border-left-0">Discount:</td>
                            <td className="fw-bolder text-right"><span>{parseFloat(Discount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                        </tr>
                        <tr className="border-bottom">
                            <td colSpan="5" className="border-left-0 text-right">Due:</td>
                            <td className="fw-bolder text-right"><span>{parseFloat(Due).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                        </tr>
                    </tbody>
                </table>
                <div className="form-group text-center fs-5 fw-bold p-0 mx-auto">
                    <Select
                        className="form-control w-50 mx-auto text-center fw-bolder fs-4 border-0 p-0"
                        menuPlacement="auto"
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        borderRadius={"0px"}
                        options={[{ label: "Paid in cash", short: "Cash", value: 14 },
                        { label: "Paid in bank", short: "Bank", value: 15 },
                        { label: "Paid in cheque", short: "Cheque", value: 16 },
                        { label: "Paid in online", short: "Online", value: 17 },
                        { label: "Paid in visa/debit/credit", short: "Card", value: 18 }]}
                        name="Payment"
                        placeholder={"Payment Type"}
                        styles={CScolourStyles}
                        value={Payment}
                        onChange={(e) => BankHandler(e)}
                        required
                        id="Payment"
                    />
                    {Error.Payment && (
                        <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Payment}</small>
                        </p>
                    )}
                </div>

                {(IsBank || IsCheque || IsOnline || IsCard) &&
                    <>
                        <div className="form-group text-center fw-bold p-0 mx-auto">
                            <label htmlFor="Bank" className="col-form-label">Bank</label>
                            <Select
                                className="form-control w-50 mx-auto text-center fw-bold border-0 p-0"
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={BankLists}
                                name="Bank"
                                placeholder={"Select Bank Name"}
                                styles={CScolourStyles}
                                value={Bank}
                                onChange={(e) => {
                                    const { FrmBankID, ...updatedState } = Error; // remove Payment field from Error
                                    setBank(e);
                                    setError(updatedState); // set updated error state without Payment field
                                }}
                                required
                                id="Bank"
                            />
                            {Error.FrmBankID && (
                                <p className="mx-auto d-table text-center text-warning m-0">
                                    <small>{Error.FrmBankID}</small>
                                </p>
                            )}
                        </div>

                        {(IsBank || IsCheque) &&
                            <div className="d-flex justify-content-center">
                                <div className="form-group text-center pr-1">
                                    <label htmlFor="ACName" className="col-form-label">A/C Name</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control mx-auto text-center fw-bolder"
                                        id="ACName"
                                        name="ACName"
                                        placeholder="Account Name"
                                        value={ACName}
                                        onChange={e => {
                                            const { FrmAccName, ...updatedState } = Error; // remove Payment field from Error
                                            setACName(e.target.value)
                                            setError(updatedState); // set updated error state without Payment field
                                        }}
                                        onFocus={(e) => e.target.select()}
                                    />
                                    {Error.FrmAccName && (
                                        <p className="mx-auto d-table text-center text-warning m-0">
                                            <small>{Error.FrmAccName}</small>
                                        </p>
                                    )}
                                </div>
                                <div className="form-group text-center pl-1">
                                    <label htmlFor="ACNumber" className="col-form-label">A/C No</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control mx-auto text-center fw-bolder"
                                        id="ACNumber"
                                        name="ACNumber"
                                        placeholder="Account Number"
                                        value={ACNumber}
                                        onChange={e => {
                                            const { FrmAccNumber, ...updatedState } = Error; // remove Payment field from Error
                                            setACNumber(e.target.value)
                                            setError(updatedState); // set updated error state without Payment field
                                        }}
                                        onFocus={(e) => e.target.select()}
                                    />
                                    {Error.FrmAccNumber && (
                                        <p className="mx-auto d-table text-center text-warning m-0">
                                            <small>{Error.FrmAccNumber}</small>
                                        </p>
                                    )}
                                </div>
                            </div>
                        }
                        {IsCheque &&
                            <div className="form-group text-center fw-bold p-0 mx-auto">
                                <label htmlFor="ChequeNo" className="col-form-label">Cheque No</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control mx-auto text-center fw-bolder w-75"
                                    id="ChequeNo"
                                    name="ChequeNo"
                                    placeholder="Cheque Number"
                                    value={ChequeNo}
                                    onChange={e => {
                                        const { FrmChequeNo, ...updatedState } = Error; // remove Payment field from Error
                                        setChequeNo(e.target.value)
                                        setError(updatedState); // set updated error state without Payment field
                                    }}
                                    onFocus={(e) => e.target.select()}
                                />
                                {Error.FrmChequeNo && (
                                    <p className="mx-auto d-table text-center text-warning m-0">
                                        <small>{Error.FrmChequeNo}</small>
                                    </p>
                                )}
                            </div>
                        }
                        {(IsOnline || IsCard) &&
                            <div className="form-group text-center fw-bold p-0 mx-auto">
                                <label htmlFor="TrxNo" className="col-form-label">Trx No</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control mx-auto text-center fw-bolder w-50"
                                    id="TrxNo"
                                    name="TrxNo"
                                    placeholder="Transaction No/Receipt No/Reference"
                                    value={TrxNo}
                                    onChange={e => {
                                        const { FrmTrxNo, ...updatedState } = Error; // remove Payment field from Error
                                        setTrxNo(e.target.value)
                                        setError(updatedState); // set updated error state without Payment field
                                    }}
                                    onFocus={(e) => e.target.select()}
                                />
                                {Error.TrxNo && (
                                    <p className="mx-auto d-table text-center text-warning m-0">
                                        <small>{Error.TrxNo}</small>
                                    </p>
                                )}
                            </div>
                        }
                    </>
                }

                <div className="form-group text-center">
                    <label htmlFor="PaidAmount" className="col-form-label">Paid</label>
                    <input
                        type="text"
                        autocomplete="off"
                        className="form-control w-50 mx-auto text-center fw-bolder fs-1"
                        id="PaidAmount"
                        name="PaidAmount"
                        placeholder="0.00"
                        value={PaidAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        onChange={e => ReduceDue(e)}
                        onFocus={(e) => e.target.select()}
                    />
                    {Error.PaidAmount && (
                        <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.PaidAmount}</small>
                        </p>
                    )}
                </div>

                <div className="form-group text-center">
                    <label htmlFor="Discount" className="col-form-label">Discount</label>
                    <input
                        ref={discRef}
                        type="text"
                        autocomplete="off"
                        className="form-control w-50 mx-auto text-center fw-bolder"
                        id="Discount"
                        name="Discount"
                        placeholder="0.00"
                        value={Discount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        onChange={e => ReduceDue(e)}
                        onFocus={(e) => e.target.select()}
                    />
                    {Error.Discount && (
                        <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Discount}</small>
                        </p>
                    )}
                </div>


                <div className="d-flex justify-content-around align-items-center">
                    <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2" onClick={(e) => Pay(e)}><i className="fad fa-check"></i></button>
                    <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 px-2 py-0" onClick={() => props.onHide()}><i className="fad fa-times p-0"></i></button>
                </div>
            </Modal.Body>
        </Modal >
    );
}
