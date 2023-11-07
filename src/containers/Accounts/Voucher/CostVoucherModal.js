import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Select from 'react-select';
import { AllConsignee, CostVoucher, LoadCostAccount } from '../../../actions/APIHandler';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { GeneralColourStyles } from '../../../hocs/Class/SelectStyle';

let today = new Date();

export const CostVoucherModal = (props) => {
    const [Click, setClick] = useState(false)
    const [AccLists, setAccLists] = useState(false)
    const [ConsigneeList, setConsigneeList] = useState(false)
    const [Account, setAccount] = useState('')
    const [Amount, setAmount] = useState('')
    const [PaymentMethod, setPaymentMethod] = useState('')
    const [Staff, setStaff] = useState('')
    const [Consignee, setConsignee] = useState('N/A')
    const [Reference, setReference] = useState('')
    const [Narration, setNarration] = useState('')
    const [Error, setError] = useState([])
    let toastProperties = null;

    useEffect(() => {
        LoadAccounts();
    }, [])

    const ActionClick = (e) => {
        setClick(true);
        props.onConfirm();
    }

    const validateFields = () => {
        let valid = true;

        // Validation for Account field
        if (!Account) {
            setError(prevState => ({ ...prevState, COA: 'Please select an account' }));
            valid = false;
        } else {
            setError(prevState => ({ ...prevState, COA: '' }));
        }

        // Validation for Amount field
        if (!Amount || Amount <= 0) {
            setError(prevState => ({ ...prevState, Amount: 'Please enter a valid amount' }));
            valid = false;
        } else {
            setError(prevState => ({ ...prevState, Amount: '' }));
        }

        // Validation for Payment Method field
        if (!PaymentMethod) {
            setError(prevState => ({ ...prevState, PaymentMethod: 'Please select a payment method' }));
            valid = false;
        } else {
            setError(prevState => ({ ...prevState, PaymentMethod: '' }));
        }

        // Validation for Staff field
        if (!Staff) {
            setError(prevState => ({ ...prevState, StaffID: 'Please select a staff member' }));
            valid = false;
        } else {
            setError(prevState => ({ ...prevState, StaffID: '' }));
        }

        // Validation for Narration field
        if (!Narration) {
            setError(prevState => ({ ...prevState, Narration: 'Please enter a narration' }));
            valid = false;
        } else {
            setError(prevState => ({ ...prevState, Narration: '' }));
        }

        return valid;
    };

    const SaveVoucher = async (e) => {
        e.preventDefault()
        const valid = validateFields();

        if (valid) {
            var result = await CostVoucher(Account.COA_Code, Account.value, Amount, PaymentMethod.value, Staff.value, Consignee, Reference, Narration);
            if (result !== true) {
                if (result.error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({ ...updatedState });
                    }
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: 'Invalid Data',
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
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    Clearfiled();
                    props.onHide();
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save voucher. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
            }
        }
    }

    const Clearfiled = () => {
        setAccount(null)
        setAmount('')
        setPaymentMethod(null)
        setStaff(null)
        setConsignee('')
        setReference('')
        setNarration('')
    }

    const LoadConsignee = async () => {
        setConsigneeList(null)
        var result = await AllConsignee(3);
        setConsigneeList(result)
    }

    const LoadAccounts = async (e) => {
        setAccLists(null)
        var result = await LoadCostAccount();
        setAccLists(result.data)
        LoadConsignee()
    }

    const formatOptionLabel = ({ label, username }) => {
        return (
            <div style={{ lineHeight: '1' }}>
                <div className='p-0 m-0' style={{ lineHeight: '1' }}>{label}</div>
                <small className='p-0 m-0 text-muted' style={{ lineHeight: '1' }}>{username}</small>
            </div>
        );
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" title="Close" onClick={() => props.onHide()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <p className="fs-4 fw-bolder text-center px-0 text-uppercase m-0">{"Daily Cost Voucher (Light)"}</p>
                        <small className="text-center text-muted px-0">Please keep a hard copy of your cost voucher for your records</small>


                        <form>
                            <div className='row m-0 p-0'>
                                <div className='col-md-8 text-center px-1'>
                                    <label htmlFor="Account" className="text-center p-0 mt-2 mb-0">Account</label>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={AccLists}
                                        name="Account"
                                        placeholder={"Select account"}
                                        styles={GeneralColourStyles}
                                        value={Account}
                                        onChange={(e) => setAccount(e)}
                                        required
                                        id="Account"
                                    />
                                    {Error.COA ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA}</small></p>
                                        : null}
                                </div>
                                <div className='col-md-4 text-center px-1'>
                                    <label htmlFor="Amount" className="text-center p-0 mt-2 mb-0">Amount</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold text-center"
                                        placeholder='Input Amount'
                                        value={Amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        name="Amount"
                                        id="Amount"
                                    />
                                    {Error.Amount ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Amount}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className='row m-0 p-0'>
                                <div className='col-md-5 text-center m-0 px-1'>
                                    <label htmlFor="PaymentMethod" className="text-center p-0 mt-2 mb-0">Payment Method</label>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={[{ label: "Cash", value: 1 }, { label: "Bank", value: 2 }]}
                                        name="PaymentMethod"
                                        placeholder={"Select Payment"}
                                        styles={GeneralColourStyles}
                                        // value={SectorID ? { label: SectorID.label, value: SectorID.value } : null}
                                        onChange={e => setPaymentMethod(e)}
                                        required
                                        id="PaymentMethod"
                                    />
                                    {Error.PaymentMethod ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PaymentMethod}</small></p>
                                        : null}
                                </div>
                                <div className='col-md-7 text-center m-0 px-1'>
                                    <label htmlFor="Staff" className="text-center p-0 mt-2 mb-0">Staff</label>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={ConsigneeList}
                                        name="Staff"
                                        placeholder={"Select staff"}
                                        styles={GeneralColourStyles}
                                        value={Staff}
                                        onChange={e => setStaff(e)}
                                        required
                                        id="Staff"
                                        formatOptionLabel={formatOptionLabel}
                                    />
                                    {Error.StaffID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.StaffID}</small></p>
                                        : null}
                                </div>
                            </div>

                            <div className='row m-0 p-0'>
                                <div className='col-md-5 text-center m-0 px-1'>
                                    <label htmlFor="Reference" className="text-center p-0 mt-2 mb-0">Reference</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold text-center"
                                        placeholder='Type Reference'
                                        value={Reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        name="Reference"
                                        id="Reference"
                                    />
                                    {Error.Reference ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Reference}</small></p>
                                        : null}
                                </div>
                                <div className='col-md-7 text-center m-0 px-1'>
                                    <label htmlFor="Consignee" className="text-center p-0 mt-2 mb-0">Consignee</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold text-center"
                                        placeholder='Type Consignee Name'
                                        value={Consignee}
                                        onChange={(e) => setConsignee(e.target.value)}
                                        name="Consignee"
                                        id="Consignee"
                                    />
                                    {Error.Consignee ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Consignee}</small></p>
                                        : null}
                                </div>
                            </div>
                            <div className='form-group text-center'>
                                <label htmlFor="Narration" className="text-center p-0 mt-2 mb-0">Narration</label>
                                <textarea
                                    rows={1}
                                    className="form-control fw-bold text-center"
                                    placeholder='Narration of cost'
                                    value={Narration}
                                    onChange={(e) => setNarration(e.target.value)}
                                    name="Narration"
                                    id="Narration"
                                />
                                {Error.Narration ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Narration}</small></p>
                                    : null}

                            </div>
                        </form>



                        <div className="d-flex justify-content-around align-items-center">
                            <button className="btn btn-outline-warning rounded-circle text-center fw-bolder fs-3 mt-3 px-2" onClick={() => props.onHide()}><i className="fad fa-times"></i></button>
                            {Click ? <p className="fs-6 text-left fw-bolder text-dark" style={{ borderRadius: "15px" }}>Please wait...</p> :
                                <button className="btn btn-outline-success rounded-circle text-center fw-bolder fs-2 mt-3" onClick={(e) => SaveVoucher(e)}><i className="fad fa-paper-plane"></i></button>
                            }
                            {/* <button className="btn btn-outline-success" onClick={() => props.onHide()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-4 fw-bold text-center mx-2" onClick={() => null}><i class="fad fa-paper-plane"></i></button> */}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}