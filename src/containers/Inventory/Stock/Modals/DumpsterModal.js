import moment from 'moment';
import { useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { CreateDumpster } from '../../../../actions/APIHandler';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { customHeader, locales } from '../../../Suppliers/Class/datepicker';

let today = new Date();
export const DumpsterModal = (props) => {
    const [Date, setDate] = useState(today)
    const [Type, setType] = useState(false)
    const [Qty, setQty] = useState('')
    const [Amount, setAmount] = useState(0.00)
    const [Remark, setRemark] = useState('')
    const [Error, setError] = useState([])
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        // Validate Date
        if (!Date) {
            isValid = false;
            errors["Date"] = "Date is required";
        }

        // Validate Type
        if (!Type) {
            isValid = false;
            errors["Type"] = "Type is required";
        }

        // Validate Quantity
        if (!Qty) {
            isValid = false;
            errors["Qty"] = "Quantity is required";
        } else if (Qty < 0) {
            isValid = false;
            errors["Qty"] = "Quantity must be a positive number";
        }

        // Validate Amount
        if (!Amount) {
            isValid = false;
            errors["Amount"] = "Amount is required";
        } else if (Amount < 0) {
            isValid = false;
            errors["Amount"] = "Amount must be a positive number";
        }

        // Validate Remark
        if (!Remark) {
            isValid = false;
            errors["Remark"] = "Remark is required";
        }

        setError(errors); // Update the error state
        return isValid;
    };

    const SaveDumpster = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const dat = moment(Date).format("YYYY-MM-DD")
            const wt = parseFloat(props.item.UnitWeight) * parseFloat(Qty)
            var result = await CreateDumpster(props.item.id, dat, Type, Qty, wt, Amount, Remark, props.item.SectorID)
            if (result !== true) {
                if (result.user_error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({ ...updatedState });
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
                    props.onHide();
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500",
            fontSize: "18px",
            fontWeight: "bold"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#333',
            backgroundColor: state.isSelected ? 'whitesmoke' : '#fff',
            ':hover': {
                backgroundColor: state.isSelected ? 'whitesmoke' : '#f8f9fa'
            }
        }),
        control: (provided, state) => ({
            ...provided,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }),
        singleValue: (provided, state) => ({
            ...provided,
            textAlign: "center",
            justifyContent: "center",
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
    };

    const QtyHandler = (e) => {
        const value = parseFloat(e.target.value) || 0.00
        const amt = value * props.item.Cost
        setAmount(amt)
        setQty(value)
    }

    return (
        <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" backdrop="static" centered>
            <Modal.Header className="py-2 justify-content-center">
                <p className="text-center m-0">
                    <span className="fs-4">Product Dumpster</span> <br />
                    <span className="fs-6 text-dark fw-bolder">{props.item.Title + " (" + props.item.Code + ")"}</span> <br />
                    <small className="text-muted text-dark fw-bold">Please dispose of any expired, damaged, or unwanted products</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form style={{ height: "400px" }}>
                    <Datepicker
                        selected={Date}
                        className="form-control fs-5 fw-bold round_radius50px text-center w-50 mx-auto"
                        dateFormat="dd MMM yyyy"
                        onChange={(e) => setDate(e)}
                        renderCustomHeader={props => customHeader({ ...props, locale })}
                        locale={locales[locale]}
                        placeholderText="Date"
                    />
                    <div className='col-md-8 text-center px-1 mx-auto'>
                        <label htmlFor="Type" className="text-center p-0 mt-2 mb-0">Type</label>
                        <Select
                            className='text-center'
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            options={[{ label: "Expired", value: 1 }, { label: "Damage", value: 2 }, { label: "Theft", value: 3 }, { label: "Robbery/Loot", value: 4 }, { label: "By force", value: 5 }, { label: "Lost", value: 6 }]}
                            name="Type"
                            placeholder={"Select account"}
                            styles={CScolourStyles}
                            value={Type}
                            onChange={(e) => setType(e)}
                            required
                            id="Type"
                        />
                        {Error.Type ? <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Type}</small></p> : null}
                    </div>
                    <div className='col-md-8 text-center px-1 mx-auto'>
                        <label htmlFor="Qty" className="text-center p-0 mt-2 mb-0">Quantity</label>
                        <input
                            type="text"
                            className="form-control fw-bold text-center"
                            placeholder='Input Qty'
                            value={Qty}
                            onChange={(e) => QtyHandler(e)}
                            name="Qty"
                            id="Qty"
                        />
                        {Error.Qty ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                            : null}
                    </div> <div className='col-md-8 text-center px-1 mx-auto'>
                        <label htmlFor="Amount" className="text-center p-0 mt-2 mb-0">Amount</label>
                        <input
                            type="text"
                            className="form-control fw-bold text-center"
                            placeholder='Input Amount'
                            value={Amount.toLocaleString("en", { minimumFractionDigits: 2 })}
                            name="Amount"
                            id="Amount"
                        />
                        {Error.Amount ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Amount}</small></p>
                            : null}
                    </div>
                    <div className='form-group text-center'>
                        <label htmlFor="Remark" className="text-center p-0 mt-2 mb-0">Remark</label>
                        <textarea
                            rows={2}
                            className="form-control fw-bold text-center"
                            placeholder='Remark'
                            value={Remark}
                            onChange={(e) => setRemark(e.target.value)}
                            name="Remark"
                            id="Remark"
                        />
                        {
                            Error.Remark ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Remark}</small></p>
                                : null
                        }
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => props.onHide()}>Close</button>
                <button className="btn btn-outline-success" onClick={(e) => SaveDumpster(e)}>Submit</button>
            </Modal.Footer>
        </Modal>
    );
}