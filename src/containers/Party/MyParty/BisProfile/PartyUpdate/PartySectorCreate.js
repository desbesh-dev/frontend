import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { CreatePartySector, PartyStatusList } from "../../../../../actions/APIHandler";
import { getLabel } from '../../../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

export const PartySectorCreate = (props) => {

    const [Next, setNext] = useState(false)
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        PartyID: { label: props.Title, value: props.item.PartyID },
        SectorID: props.item.SectorID.id,
        Address: props.item.Address,
        Contact: props.item.Contact,
        Limit: props.item.Limit,
        SCMoney: props.item.SCMoney,
        Balance: props.item.Balance,
        Target: props.item.Target,
        Currency: props.item.Currency,
        FarmReg: props.item.FarmReg ? true : false,
        BlankCheque: props.item.BlankCheque ? true : false,
        Agreement: props.item.Agreement ? true : false,
        Status: props.item ? { label: getLabel(props.item.Status, PartyStatusList), value: props.item.Status } : false
    });

    const { PartyID, SectorID, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const SendContract = async () => {
        const result = await CreatePartySector(PartyID, SectorID, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
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
                    title: 'Success',
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
                description: "Failed to update contract farm. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const ClearField = () => {
        setFormData({
            PartyID: props.item.PartyID,
            SectorID: props.item.SectorID.id,
            Address: props.item.Address,
            Contact: props.item.Contact,
            Limit: props.item.Limit,
            SCMoney: props.item.SCMoney,
            Balance: props.item.Balance,
            Target: props.item.Target,
            Currency: props.item.Currency,
            FarmReg: props.item.FarmReg ? true : false,
            BlankCheque: props.item.BlankCheque ? true : false,
            Agreement: props.item.Agreement ? true : false,
            Status: props.item ? { label: getLabel(props.item.Status, PartyStatusList), value: props.item.Status } : false
        })
        setNext(false)
        props.onHide()
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    Update Party Sector <br />
                    <small>Please change the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Party</label>
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            options={props.PartyList}
                            defaultValue={{ label: "Select Dept", value: 0 }}
                            name="Status"
                            placeholder={"Select Party"}
                            styles={CScolourStyles}
                            value={PartyID}
                            onChange={e => setFormData({ ...formData, PartyID: e })}
                        />
                        {Error.Status ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="Contact" class="col-form-label">Address</label>
                        <input
                            type="text"
                            class="form-control"
                            id="Address"
                            name="Address"
                            placeholder='Address'
                            value={Address}
                            onChange={e => onChange(e)}
                        />
                        {Error.Address ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Address}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="Contact" class="col-form-label">Conact No</label>
                        <input
                            type="text"
                            class="form-control"
                            id="Contact"
                            name="Contact"
                            placeholder='Contact No'
                            value={Contact}
                            onChange={e => onChange(e)}
                        />
                        {Error.Contact ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Contact}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="message-text" class="col-form-label">Security Money</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="SCMoney"
                            name="SCMoney"
                            placeholder='Security Money'
                            value={SCMoney}
                            onChange={e => onChange(e)}
                        />
                        {
                            Error.SCMoney ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SCMoney}</small></p>
                                : null
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Balance</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="Balance"
                            name="Balance"
                            placeholder='Balance'
                            value={Balance}
                            onChange={e => onChange(e)}
                        />
                        {Error.Balance ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Balance}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="message-text" class="col-form-label">Credit Limit</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="Limit"
                            name="Limit"
                            placeholder='Credit Limit'
                            value={Limit}
                            onChange={e => onChange(e)}
                        />
                        {Error.Limit ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Limit}</small></p>
                            : null}
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Target</label>
                                <input
                                    type="numeric"
                                    class="form-control"
                                    id="Target"
                                    name="Target"
                                    placeholder='Target'
                                    value={Target}
                                    onChange={e => onChange(e)}
                                />
                                {Error.Target ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Target}</small></p>
                                    : null}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="recipient-name" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "PGK", value: 1 }, { label: "USD", value: 2 }, { label: "KG", value: 3 }, { label: "PCS", value: 4 }]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Cond"
                                    placeholder={"Select Currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? { label: parseInt(Currency) === 1 ? "PGK" : parseInt(Currency) === 2 ? "USD" : parseInt(Currency) === 3 ? "KG" : parseInt(Currency) === 4 ? "PCS" : "", value: Currency } : null}
                                    onChange={e => setFormData({ ...formData, Currency: e.value })}
                                />
                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>
                        </div>
                    </div>
                    {props.access <= 7 ?
                        <div className="form-group">
                            <label htmlFor="recipient-name" class="col-form-label">Status</label>
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={PartyStatusList}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Status"
                                placeholder={"Select Status"}
                                styles={CScolourStyles}
                                value={Status}
                                onChange={e => setFormData({ ...formData, Status: e })}
                            />
                            {Error.Status ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                : null}
                        </div>
                        : null
                    }
                    <div className="form-group">
                        <div className="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value={Agreement}
                                id="FarmReg"
                                name="FarmReg"
                                checked={FarmReg}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: !FarmReg ? true : false })}
                            />
                            <label class="form-check-label" for="FarmReg">
                                Farm Registratioin Copy
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value={Agreement}
                                id="BlankCheque"
                                name="BlankCheque"
                                checked={BlankCheque}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: !BlankCheque ? true : false })}
                            />
                            <label class="form-check-label" for="BlankCheque">
                                Blank Cheque
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value={Agreement}
                                id="Agreement"
                                name="Agreement"
                                checked={Agreement}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: !Agreement ? true : false })}
                            />
                            <label class="form-check-label" for="Agreement">
                                Agreement
                            </label>
                        </div>
                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={() => SendContract()}>Submit </button>
            </Modal.Footer>
        </Modal >
    );
}