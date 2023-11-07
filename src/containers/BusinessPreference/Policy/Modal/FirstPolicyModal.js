import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { ConditionScheme, CurrencyList, FetchAccounts, OperationList, SaveCondition, SaveOtherCond, UpdateCondition, UpdateOtherCond, getLabel } from '../../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';

export const CreatePolicyModal = (props) => {
    const [Error, setError] = useState({});
    const [Value, setValue] = useState(null);
    const [Scheme, setScheme] = useState(null);
    const [Title, setTitle] = useState(null);
    const [Season, setSeason] = useState(null);

    let toastProperties = null;
    const dispatch = useDispatch();

    const SendCond = async () => {
        const result = await SaveCondition(Scheme.value, Title, Value, Season.label);

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
                    title: 'Invalid props.item',
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
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to save condition. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setTitle(null); setValue(null); setSeason(null); props.onHide()
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Creating a new condition</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Condition Scheme</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={ConditionScheme}
                                    name="Scheme"
                                    placeholder={"Select season"}
                                    styles={CScolourStyles}
                                    value={Scheme ? Scheme : null}
                                    onChange={e => setScheme(e)}
                                    required
                                    id="Scheme"
                                />
                                {Error.Scheme ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Scheme}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Condition Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Value"
                                    name="Value"
                                    placeholder='Condition Value'
                                    value={Value}
                                    onChange={e => setValue(e.target.value)}
                                />
                                {Error.Value ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Value}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Season</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Winter", value: 0 }, { label: "Summer", value: 1 }, { label: "N/A", value: 2 }]}
                                    name="Season"
                                    placeholder={"Select season"}
                                    styles={CScolourStyles}
                                    value={Season ? Season : null}
                                    onChange={e => setSeason(e)}
                                    required
                                    id="Season"
                                />
                                {Error.Season ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Season}</small></p>
                                    : null}
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendCond()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const UpdatePolicyModal = (props) => {
    const [Error, setError] = useState({});
    const [Title, setTitle] = useState(props.Data.CondTitle);
    const [Scheme, setScheme] = useState({ label: getLabel(parseInt(props.Data.Scheme), ConditionScheme), value: props.Data.Scheme });
    const [Value, setValue] = useState(props.Data.Value);
    const [Season, setSeason] = useState(props.Data.Season);

    let toastProperties = null;
    const dispatch = useDispatch();

    const UpdateCond = async () => {
        const result = await UpdateCondition(props.Data.CondID, Scheme.value, Title, Value, Season);

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
                    title: 'Invalid props.item',
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
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update condition. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setTitle(null); setValue(null); setSeason(null); props.onHide()
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => { ClearField() }} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Updating condition info</span>
                        <small className="text-center px-0">Please change required fields</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Condition Scheme</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={ConditionScheme}
                                    name="Scheme"
                                    placeholder={"Select season"}
                                    styles={CScolourStyles}
                                    value={Scheme ? Scheme : null}
                                    onChange={e => setScheme(e)}
                                    required
                                    id="Scheme"
                                />
                                {Error.Scheme ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Scheme}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Condition Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Condition Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Value"
                                    name="Value"
                                    placeholder='Condition Value'
                                    value={Value}
                                    onChange={e => setValue(e.target.value)}
                                />
                                {Error.Value ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Value}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Season</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Winter", value: 0 }, { label: "Summer", value: 1 }, { label: "N/A", value: 2 }]}
                                    name="Season"
                                    placeholder={"Select season"}
                                    styles={CScolourStyles}
                                    value={Season ? { label: Season } : null}
                                    onChange={e => setSeason(e.label)}
                                    required
                                    id="Season"
                                />
                                {Error.Season ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Season}</small></p>
                                    : null}
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => UpdateCond()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const OtherModal = (props) => {
    const [Error, setError] = useState({});
    const [Accounts, setAccounts] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        SLNo: "",
        Title: "",
        Rate: "",
        Currency: false,
        Operation: false,
        Times: "",
        Status: "",
        COA_ID: false,
    });
    const { SLNo, Title, Rate, Currency, Operation, Times, Status, COA_ID } = formData;

    useEffect(() => {
        LoadAcc();
    }, [])

    const SendOtherCond = async () => {
        const result = await SaveOtherCond(props.CondID, SLNo, Title, Rate, Currency ? Currency.label : "", Operation ? Operation.value : "", Times, Status, COA_ID ? COA_ID.value : "");

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
                    title: 'Invalid props.item',
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
                description: "Other condition setup failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchAccounts();

        if (result !== true) {
            setAccounts(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setFormData({
            SLNo: "",
            Title: "",
            Rate: "",
            Currency: "",
            Operation: "",
            Times: "",
            Status: "",
            COA_ID: "",
        });
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => { ClearField(); props.onHide() }} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Set up other conditions</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">S/N</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="SLNo"
                                    name="SLNo"
                                    placeholder='S/N'
                                    value={SLNo}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.SLNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SLNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Rate/Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Rate"
                                    name="Rate"
                                    placeholder='Rate/Value'
                                    value={Rate}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Rate ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={CurrencyList}
                                    name="Currency"
                                    placeholder={"Select currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : null}
                                    onChange={(e) => setFormData({ ...formData, Currency: e })}
                                    required
                                    id="Currency"
                                />

                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Operation</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={OperationList}
                                    name="Operation"
                                    placeholder={"Select operation"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={(e) => setFormData({ ...formData, Operation: e })}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Times</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Times"
                                    name="Times"
                                    placeholder='Times'
                                    value={Times}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Times ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Times}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Associate Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="COA_ID"
                                    placeholder={"Select account"}
                                    styles={CScolourStyles}
                                    value={COA_ID ? COA_ID : null}
                                    onChange={(e) => setFormData({ ...formData, COA_ID: e })}
                                    required
                                    id="COA_ID"
                                />

                                {Error.COA_ID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_ID}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Active Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: !Status ? true : false })}
                                    />
                                    <label class="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => { ClearField(); props.onHide() }}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendOtherCond()}><i class="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const OtherUpdateModal = (props) => {
    const [Error, setError] = useState({});
    const [Accounts, setAccounts] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        SLNo: props.Data.SLNo,
        Title: props.Data.Title,
        Rate: props.Data.Rate ? props.Data.Rate : "",
        Currency: props.Data.Currency ? { label: props.Data.Currency } : false,
        Operation: props.Data.Operation ? { label: getLabel(parseInt(props.Data.Operation), OperationList), value: props.Data.Operation } : false,
        Times: props.Data.Times,
        Status: props.Data.Status,
        COA_ID: props.Data.COA_ID ? { label: props.Data.COA_ID.COA_Title, value: props.Data.COA_ID.id } : false,
    });
    const { SLNo, Title, Rate, Currency, Operation, Times, Status, COA_ID } = formData;

    useEffect(() => {
        LoadAcc();
    }, [])

    const SendUpdateOC = async () => {
        const result = await UpdateOtherCond(props.Data.id, SLNo, Title, Rate, Currency ? Currency.label : "", Operation ? Operation.value : "", Times, Status, COA_ID ? COA_ID.value : "");

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
                    title: 'Invalid props.item',
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
                ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Other condition setup failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadAcc = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchAccounts();

        if (result !== true) {
            setAccounts(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const ClearField = () => {
        setFormData({
            SLNo: props.Data.SLNo,
            Title: props.Data.Title,
            Rate: props.Data.Rate ? props.Data.Rate : "",
            Currency: props.Data.Currency ? { label: props.Data.Currency } : false,
            Operation: props.Data.Operation ? { label: getLabel(parseInt(props.Data.Operation), OperationList), value: props.Data.Operation } : false,
            Times: props.Data.Times,
            Status: props.Data.Status,
            COA_ID: props.Data.COA_ID ? { label: props.Data.COA_ID.COA_Title, value: props.Data.COA_ID.id } : false,
        });
        props.onHide();
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
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Set up other conditions</span>
                        <small className="text-center px-0">All fields are mendatory</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">S/N</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="SLNo"
                                    name="SLNo"
                                    placeholder='S/N'
                                    value={SLNo}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.SLNo ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SLNo}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Title"
                                    name="Title"
                                    placeholder='Condition Title'
                                    value={Title}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Rate/Value</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Rate"
                                    name="Rate"
                                    placeholder='Rate/Value'
                                    value={Rate}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Rate ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Rate}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Currency</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={CurrencyList}
                                    name="Currency"
                                    placeholder={"Select currency"}
                                    styles={CScolourStyles}
                                    value={Currency ? Currency : null}
                                    onChange={(e) => setFormData({ ...formData, Currency: e })}
                                    required
                                    id="Currency"
                                />

                                {Error.Currency ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Currency}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Operation</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={OperationList}
                                    name="Operation"
                                    placeholder={"Select operation"}
                                    styles={CScolourStyles}
                                    value={Operation ? Operation : null}
                                    onChange={(e) => setFormData({ ...formData, Operation: e })}
                                    required
                                    id="Operation"
                                />
                                {Error.Operation ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Operation}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Times</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Times"
                                    name="Times"
                                    placeholder='Times'
                                    value={Times}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                />
                                {Error.Times ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Times}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Associate Account</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={Accounts}
                                    name="COA_ID"
                                    placeholder={"Select account"}
                                    styles={CScolourStyles}
                                    value={COA_ID ? COA_ID : null}
                                    onChange={(e) => setFormData({ ...formData, COA_ID: e })}
                                    required
                                    id="COA_ID"
                                />

                                {Error.COA_ID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_ID}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Active Status</label>
                                <div className="form-check form-switch">

                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: !Status ? true : false })}
                                    />
                                    <label class="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendUpdateOC()}><i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}