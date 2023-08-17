import { Button, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState, Fragment } from 'react';
import Select from 'react-select';
import { checkToken } from '../../../actions/auth';
import { colourStyles } from '../../../actions/SuppliersAPI';
import { SaveContract, UpdateContract, LoadCondList, SaveSubDealer, SaveCustomer } from '../../../actions/ContractAPI';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const BusinessReg = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [CondList, setCondList] = useState(initialValue);
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        CompanyID: props.CompanyID,
        BranchID: props.BranchID,
        UserID: props.UserID,
        Title: "",
        SCMoney: "",
        Balance: "",
        RepName: "",
        RepID: "",
        Target: "",
        Currency: "",
        CondTitle: "",
        CondID: "",
        FarmReg: false,
        BlankCheque: false,
        Agreement: false,
        ShedSize: "",
        Floor: "",
        Roof: "",
        WaterPot: "",
        FeedPot: "",
        Employee: "",
        Contact: "",
    });

    useEffect(() => {
        LoadRep();
        Condition();
    }, [])

    const { CompanyID, BranchID, UserID, Title, Target, Currency, CondTitle, CondID, SCMoney, Balance, RepName, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const LoadRep = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setRepLists(res.data.Rep);

        } catch (err) {
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const Condition = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await LoadCondList();

        if (result !== true) {
            setCondList(result)
            setFormData({ ...formData, CondTitle: result[0].label, CondID: result[0].value })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SendContract = async () => {
        const Type = props.TypeID === 1 ? "Contract" : props.TypeID === 2 ? "Sub-dealer" : props.TypeID === 3 ? "Party" : props.TypeID === 4 ? "Customer" : null
        // var contract = (props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, CondID, SCMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact)
        // var sub_dealer_party = (props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, SCMoney, Target, Currency.value, Balance, RepID, FarmReg, BlankCheque, Agreement)
        // var customer = (props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, RepID, FarmReg, BlankCheque, Agreement)

        const result = props.TypeID === 1 ? await SaveContract(props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, CondID, SCMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact) :
            props.TypeID === 2 || props.TypeID === 3 ? await SaveSubDealer(props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, SCMoney, Target, Currency.value, Balance, RepID, FarmReg, BlankCheque, Agreement) : props.TypeID === 4 ? await SaveCustomer(props.CompanyID, props.BranchID, props.UserID, props.TypeID, Type, Title, RepID, FarmReg, BlankCheque, Agreement) : null;


        if (result !== true) {
            if (result.user_error) {
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
                description: "Failed to new business registration. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            CompanyID: "",
            BranchID: "",
            UserID: "",
            Title: "",
            SCMoney: "",
            Balance: "",
            RepName: "",
            RepID: "",
            FarmReg: false,
            BlankCheque: false,
            Agreement: false,
            ShedSize: "",
            Floor: "",
            Roof: "",
            WaterPot: "",
            FeedPot: "",
            Employee: "",
            Contact: "",
        });
        setNext(false)
        const initialValue = { value: 0, label: "" };
        // setRepLists(initialValue);
        setError({});
        props.onHide();
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
            <Modal.Header className="py-2 px-3">
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-left px-2 text-uppercase">{`New ${props.TypeID === 1 ? "Contract Business" : props.TypeID === 2 ? "Sub-dealer" : props.TypeID === 3 ? "Party" : props.TypeID === 4 ? "Customer" : null} Registration`}</span>
                        {!Next ? <small className="text-left">Please fill the business info</small> : <small>Please fill the farm details</small>}
                    </div>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
            </Modal.Header>
            <Modal.Body>
                {!Next ?
                    <form>
                        <div className="form-group">
                            <label for="Title" class="col-form-label">Farm/Shed/Business Title</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Title"
                                name="Title"
                                placeholder='Farm/Shed/Business Title'
                                value={Title}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                : null}
                        </div>
                        {props.TypeID === 1 ?
                            <>
                                <div className="form-group">
                                    <label for="recipient-name" class="col-form-label">Conditions</label>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={CondList}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Cond"
                                        placeholder={"Select condition"}
                                        styles={CScolourStyles}
                                        value={CondID ? { label: CondTitle, value: CondID } : null}
                                        onChange={e => setFormData({ ...formData, "CondTitle": e.label, "CondID": e.value })}
                                        required
                                        id="Cond"
                                    />
                                    {Error.CondID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CondID}</small></p>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label for="message-text" class="col-form-label">Security Money</label>
                                    <input
                                        type="numeric"
                                        class="form-control"
                                        id="SCMoney"
                                        name="SCMoney"
                                        placeholder='Security Money'
                                        value={SCMoney}
                                        onChange={e => onChange(e)}
                                    />
                                    {Error.SCMoney ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SCMoney}</small></p>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label for="recipient-name" class="col-form-label">Balance</label>
                                    <input
                                        type="numeric"
                                        class="form-control"
                                        id="Balance"
                                        name="Balance"
                                        placeholder='Balance'
                                        value={Balance}
                                        onChange={e => onChange(e)}
                                    />
                                    {Error.RepID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Balance}</small></p>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label for="recipient-name" class="col-form-label">Representative</label>
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={RepLists}
                                        name="RepName"
                                        placeholder={"Select rep. name"}
                                        styles={CScolourStyles}
                                        value={RepName ? { label: RepName } : null}
                                        onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                        required
                                        id="Rep"
                                    />
                                    {Error.RepID ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                        : null}
                                </div>
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
                            </>
                            : props.TypeID === 4 ?
                                <>
                                    <div className="form-group">
                                        <label for="recipient-name" class="col-form-label">Balance</label>
                                        <input
                                            type="numeric"
                                            class="form-control"
                                            id="Balance"
                                            name="Balance"
                                            placeholder='Balance'
                                            value={Balance}
                                            onChange={e => onChange(e)}
                                        />
                                        {Error.RepID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Balance}</small></p>
                                            : null}
                                    </div>
                                    <div className="form-group">
                                        <label for="recipient-name" class="col-form-label">Representative</label>
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={RepLists}
                                            name="RepName"
                                            placeholder={"Select rep. name"}
                                            styles={CScolourStyles}
                                            value={RepName ? { label: RepName } : null}
                                            onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                            required
                                            id="Rep"
                                        />
                                        {Error.RepID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                            : null}
                                    </div>

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
                                                Farm/Trade Licence Copy
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
                                </>
                                :
                                <>
                                    <div className="form-group">
                                        <label for="message-text" class="col-form-label">Credit Limit</label>
                                        <input
                                            type="numeric"
                                            class="form-control"
                                            id="SCMoney"
                                            name="SCMoney"
                                            placeholder='Credit Limit'
                                            value={SCMoney}
                                            onChange={e => onChange(e)}
                                        />
                                        {Error.RepID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SCMoney}</small></p>
                                            : null}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <label for="message-text" class="col-form-label">Target</label>
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
                                                <label for="recipient-name" class="col-form-label">Currency</label>
                                                <Select
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    menuPortalTarget={document.body}
                                                    borderRadius={"0px"}
                                                    options={[{ label: "BDT", value: 1 }, { label: "KG", value: 2 }, { label: "PCS", value: 3 }]}
                                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                                    name="Cond"
                                                    placeholder={"Select Currency"}
                                                    styles={CScolourStyles}
                                                    value={Currency ? Currency : null}
                                                    onChange={e => setFormData({ ...formData, Currency: e })}
                                                    required
                                                    id="Cond"
                                                />
                                                {Error.Currency ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label for="recipient-name" class="col-form-label">Balance</label>
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
                                        <label for="recipient-name" class="col-form-label">Representative</label>
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={RepLists}
                                            name="RepName"
                                            placeholder={"Select rep. name"}
                                            styles={CScolourStyles}
                                            value={RepName ? { label: RepName } : null}
                                            onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                            required
                                            id="Rep"
                                        />
                                        {Error.RepID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                            : null}
                                    </div>

                                    <div className="form-group">
                                        <div className="form-check">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                value={FarmReg}
                                                id="FarmReg"
                                                name="FarmReg"
                                                checked={FarmReg}
                                                onChange={(e) => setFormData({ ...formData, [e.target.name]: !FarmReg ? true : false })}
                                            />
                                            <label class="form-check-label" for="FarmReg">
                                                Trade Licence
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-check">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                value={BlankCheque}
                                                id="BlankCheque"
                                                name="BlankCheque"
                                                checked={BlankCheque}
                                                onChange={(e) => setFormData({ ...formData, [e.target.name]: !BlankCheque ? true : false })}
                                            />
                                            <label class="form-check-label" for="BlankCheque">Blank Cheque</label>
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
                                            <label class="form-check-label" for="Agreement">Agreement</label>
                                        </div>
                                    </div>
                                </>
                        }
                    </form>

                    :
                    <form>
                        <small className="text-danger">Not mandatory</small>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Shed Size</label>
                            <input
                                type="text"
                                class="form-control"
                                id="ShedSize"
                                name="ShedSize"
                                placeholder='Shed Size'
                                value={ShedSize}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ShedSize}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="message-text" class="col-form-label">Floor</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Floor"
                                name="Floor"
                                placeholder='Floor'
                                value={Floor}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Floor}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Roof</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Roof"
                                name="Roof"
                                placeholder='Roof'
                                value={Roof}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Roof}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Water Pot</label>
                            <input
                                type="text"
                                class="form-control"
                                id="WaterPot"
                                name="WaterPot"
                                placeholder='WaterPot'
                                value={WaterPot}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.WaterPot}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Feed Pot</label>
                            <input
                                type="text"
                                class="form-control"
                                id="FeedPot"
                                name="FeedPot"
                                placeholder='FeedPot'
                                value={FeedPot}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedPot}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Employee Name</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Employee"
                                name="Employee"
                                placeholder='Employee'
                                value={Employee}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Employee}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Emergency Contact</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Contact"
                                name="Contact"
                                placeholder='Contact'
                                value={Contact}
                                onChange={e => onChange(e)}
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Contact}</small></p>
                                : null}
                        </div>
                    </form>
                }
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                {props.TypeID === 1 ? !Next ?
                    <button onClick={() => setNext(true)} className="btn btn-outline-success"> Next<span aria-hidden="true">&rarr;</span></button> :
                    <Fragment>
                        <button className="btn btn-outline-success" onClick={() => setNext(false)}><span aria-hidden="true">&larr;</span> Back </button>
                        <button className="btn btn-outline-success" onClick={() => SendContract()}>Submit </button>
                    </Fragment>

                    : <button className="btn btn-outline-success" onClick={() => SendContract()}>Submit </button>
                }
            </Modal.Footer>
        </Modal >
    );
}


export const BusinessUpdate = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [CondList, setCondList] = useState(initialValue);
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        CompanyID: props.CompanyID,
        BranchID: props.BranchID,
        UserID: props.UserID,
        Title: props.item.Title,
        CondTitle: props.item.TypeID === 1 ? props.item.CondID.Title : null,
        CondID: props.item.TypeID === 1 ? props.item.CondID.id : null,
        SCMoney: props.item.SCMoney,
        Balance: props.item.Balance,
        RepName: props.item.RepID.FirstName + " " + props.item.RepID.LastName,
        RepID: props.item.RepID.id,
        FarmReg: props.item.FarmReg ? true : false,
        BlankCheque: props.item.BlankCheque ? true : false,
        Agreement: props.item.Agreement ? true : false,

        ShedSize: props.item.farm[0] ? props.item.farm[0].ShedSize : "",
        Floor: props.item.farm[0] ? props.item.farm[0].Floor : "",
        Roof: props.item.farm[0] ? props.item.farm[0].Roof : "",
        WaterPot: props.item.farm[0] ? props.item.farm[0].WaterPot : "",
        FeedPot: props.item.farm[0] ? props.item.farm[0].FeedPot : "",
        Employee: props.item.farm[0] ? props.item.farm[0].Employee : "",
        Contact: props.item.farm[0] ? props.item.farm[0].ContactNo : "",
        // CompanyID: props.CompanyID,
        // BranchID: props.BranchID,
        // UserID: props.UserID,
        // Title: props.item ? props.item.Title : "",
        // SCMoney: props.item ? props.item.SCMoney : "",
        // Balance: props.item ? props.item.Balance : "",
        // RepName: props.item ? props.item.RepID.FirstName + " " + props.item.RepID.LastName : "",
        // RepID: props.item ? props.item.RepID.id : "",
        // FarmReg: props.item ? props.item.FarmReg ? true : false : false,
        // BlankCheque: props.item ? props.item.BlankCheque ? true : false : false,
        // Agreement: props.item ? props.item.Agreement ? true : false : false,

        // ShedSize: props.item ? props.item.farm[0].ShedSize : "",
        // Floor: props.item ? props.item.farm[0].Floor : "",
        // Roof: props.item ? props.item.farm[0].Roof : "",
        // WaterPot: props.item ? props.item.farm[0].WaterPot : "",
        // FeedPot: props.item ? props.item.farm[0].FeedPot : "",
        // Employee: props.item ? props.item.farm[0].Employee : "",
        // Contact: props.item ? props.item.farm[0].ContactNo : "",
    });

    useEffect(() => {
        LoadRep();
        Condition();
    }, [])

    const { CompanyID, BranchID, UserID, CondTitle, Title, CondID, SCMoney, Balance, RepName, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const LoadRep = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setRepLists(res.data.Rep);

        } catch (err) {
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const SendContract = async () => {
        const result = await UpdateContract(props.item.id, props.item.farm[0] ? props.item.farm[0].id : 0, Title, CondID, SCMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact);

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

    const Condition = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await LoadCondList();
        if (result !== true) {
            setCondList(result.cond)
            // setFormData({ ...formData, CondTitle: result.active.Title, CondID: result.active.value })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            CompanyID: props.CompanyID,
            BranchID: props.BranchID,
            UserID: props.UserID,
            Title: props.item.Title,
            CondTitle: props.item.TypeID === 1 ? props.item.CondID.Title : null,
            CondID: props.item.TypeID === 1 ? props.item.CondID.id : null,
            SCMoney: props.item.SCMoney,
            Balance: props.item.Balance,
            RepName: props.item.RepID.FirstName + " " + props.item.RepID.LastName,
            RepID: props.item.RepID.id,
            FarmReg: props.item.FarmReg ? true : false,
            BlankCheque: props.item.BlankCheque ? true : false,
            Agreement: props.item.Agreement ? true : false,

            ShedSize: props.item.farm[0] ? props.item.farm[0].ShedSize : "",
            Floor: props.item.farm[0] ? props.item.farm[0].Floor : "",
            Roof: props.item.farm[0] ? props.item.farm[0].Roof : "",
            WaterPot: props.item.farm[0] ? props.item.farm[0].WaterPot : "",
            FeedPot: props.item.farm[0] ? props.item.farm[0].FeedPot : "",
            Employee: props.item.farm[0] ? props.item.farm[0].Employee : "",
            Contact: props.item.farm[0] ? props.item.farm[0].ContactNo : "",
        })
        setNext(false)
        const initialValue = { value: 0, label: "" };
        // setRepLists(initialValue);

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
                    Update Business/Farm Details <br />
                    <small>Please change the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                {!Next ?
                    <form>
                        <div className="form-group">
                            <label for="Title" class="col-form-label">Farm/Shed/Business Title</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Title"
                                name="Title"
                                placeholder='Farm/Shed/Business Title'
                                value={Title}
                                onChange={e => onChange(e)}
                            />
                            {Error.Title ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Conditions</label>
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={CondList}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Cond"
                                placeholder={"Select condition"}
                                styles={CScolourStyles}
                                value={CondID ? { label: CondTitle, value: CondID } : null}
                                onChange={e => setFormData({ ...formData, "CondTitle": e.label, "CondID": e.value })}
                                required
                                id="Cond"
                            />
                            {Error.CondID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CondID}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="message-text" class="col-form-label">Security Money</label>
                            <input
                                type="numeric"
                                class="form-control"
                                id="SCMoney"
                                name="SCMoney"
                                placeholder='Security Money'
                                value={SCMoney}
                                onChange={e => onChange(e)}
                            />
                            {Error.SCMoney ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SCMoney}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Balance</label>
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
                            <label for="recipient-name" class="col-form-label">Representative</label>
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={RepLists}
                                name="RepName"
                                placeholder={"Select rep. name"}
                                styles={CScolourStyles}
                                value={RepName ? { label: RepName } : null}
                                onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                required
                                id="Rep"
                            />
                            {Error.RepID ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RepID}</small></p>
                                : null}
                        </div>

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

                    :
                    <form>
                        <small className="text-danger">Not mandatory</small>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Shed Size</label>
                            <input
                                type="text"
                                class="form-control"
                                id="ShedSize"
                                name="ShedSize"
                                placeholder='Shed Size'
                                value={ShedSize}
                                onChange={e => onChange(e)}
                            />
                            {Error.ShedSize ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ShedSize}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="message-text" class="col-form-label">Floor</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Floor"
                                name="Floor"
                                placeholder='Floor'
                                value={Floor}
                                onChange={e => onChange(e)}
                            />
                            {Error.Floor ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Floor}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Roof</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Roof"
                                name="Roof"
                                placeholder='Roof'
                                value={Roof}
                                onChange={e => onChange(e)}
                            />
                            {Error.Roof ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Roof}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Water Pot</label>
                            <input
                                type="text"
                                class="form-control"
                                id="WaterPot"
                                name="WaterPot"
                                placeholder='WaterPot'
                                value={WaterPot}
                                onChange={e => onChange(e)}
                            />
                            {Error.WaterPot ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.WaterPot}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Feed Pot</label>
                            <input
                                type="text"
                                class="form-control"
                                id="FeedPot"
                                name="FeedPot"
                                placeholder='FeedPot'
                                value={FeedPot}
                                onChange={e => onChange(e)}
                            />
                            {Error.FeedPot ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedPot}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Employee Name</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Employee"
                                name="Employee"
                                placeholder='Employee'
                                value={Employee}
                                onChange={e => onChange(e)}
                            />
                            {Error.Employee ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Employee}</small></p>
                                : null}
                        </div>
                        <div className="form-group">
                            <label for="recipient-name" class="col-form-label">Emergency Contact</label>
                            <input
                                type="text"
                                class="form-control"
                                id="Contact"
                                name="Contact"
                                placeholder='Contact'
                                value={Contact}
                                onChange={e => onChange(e)}
                            />
                            {Error.Contact ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Contact}</small></p>
                                : null}
                        </div>
                    </form>
                }
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                {
                    !Next ?
                        <button onClick={() => setNext(true)} className="btn btn-outline-success"> Next<span aria-hidden="true">&rarr;</span></button> :
                        <Fragment>
                            <button className="btn btn-outline-success" onClick={() => setNext(false)}><span aria-hidden="true">&larr;</span> Back </button>
                            <button className="btn btn-outline-success" onClick={() => SendContract()}>Submit </button>
                        </Fragment>
                }
            </Modal.Footer>
        </Modal >
    );
}