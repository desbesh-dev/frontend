import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { LoadCondList, UpdateContract } from '../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';
import errorIcon from '../../assets/error.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';

export const ContractUpdate = (props) => {
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
        CondTitle: props.item.CondID.Title,
        CondID: props.item.CondID.id,
        SecurityMoney: props.item.SCMoney,
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
        // SecurityMoney: props.item ? props.item.SCMoney : "",
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

    const { CompanyID, BranchID, UserID, CondTitle, Title, CondID, SecurityMoney, Balance, RepName, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact } = formData;
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
        const result = await UpdateContract(props.item.id, props.item.farm[0] ? props.item.farm[0].id : 0, Title, CondID, SecurityMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact);

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
            CondTitle: props.item.CondID.Title,
            CondID: props.item.CondID.id,
            SecurityMoney: props.item.SCMoney,
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
                            <label htmlFor="Title" class="col-form-label">Farm/Shed/Business Title</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Conditions</label>
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
                            <label htmlFor="message-text" class="col-form-label">Security Money</label>
                            <input
                                type="numeric"
                                class="form-control"
                                id="SecurityMoney"
                                name="SecurityMoney"
                                placeholder='Security Money'
                                value={SecurityMoney}
                                onChange={e => onChange(e)}
                            />
                            {Error.SCMoney ?
                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SCMoney}</small></p>
                                : null}
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
                            <label htmlFor="recipient-name" class="col-form-label">Representative</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Shed Size</label>
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
                            <label htmlFor="message-text" class="col-form-label">Floor</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Roof</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Water Pot</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Feed Pot</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Employee Name</label>
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
                            <label htmlFor="recipient-name" class="col-form-label">Emergency Contact</label>
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