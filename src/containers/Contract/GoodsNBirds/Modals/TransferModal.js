import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { CalculateAge, FetchGodown, FetchTFBatchData, SaveTransfer } from '../../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { customHeader, locales } from "../../../Suppliers/Class/datepicker";

let today = new Date();

export const Transfer = (props) => {
    const [Error, setError] = useState({});
    const [GodownList, setGodownList] = useState({});
    const [AVGCost, setAVGCost] = useState(0.00);
    const initialValue = { value: 0, label: "" };
    let toastProperties = null;
    let history = useHistory();
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');
    const [formData, setFormData] = useState({
        GodownID: "",
        GodownTitle: "",
        BranchID: props.Data.BranchID,
        BusinessID: props.Data.FarmID,
        BatchID: props.Data.BatchID,
        Date: today,
        Age: 0,
        Qty: 0,
        Weight: 0.000,
        UnitCost: 0.00,
        TotalCost: 0.00,
        GodownAC: "",
        Godown_Code: "",
        GodownAC_Label: "",
        Type: "",
        Live: "",
    });
    const { BranchID, BusinessID, BatchID, GodownID, GodownTitle, Age, Date, Qty, Weight, UnitCost, TotalCost, GodownAC, Godown_Code, GodownAC_Label, Type, Live } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        LoadGodown();
        FetchFarm();
    }, [])


    const LoadGodown = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchGodown();
        if (result.status === 200)
            setGodownList(result.data.Godown);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const FetchFarm = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchTFBatchData(props.Data.BatchID);
        if (result.status === 200) {
            setAVGCost((result.data.UnitCost).toFixed(2))
            setFormData({ ...formData, "UnitCost": (result.data.UnitCost).toFixed(2), "Live": result.data.Qty, "Age": CalculateAge(new window.Date(result.data.IssueDate)) })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const Submit = async () => {
        var data = moment(Date).format('YYYY-MM-DD')
        const result = await SaveTransfer(BranchID, BusinessID, BatchID, GodownID, data, Age, Qty, Weight, UnitCost, TotalCost);
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
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                ClearField();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Transfer has failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            GodownID: "",
            GodownTitle: "",
            BranchID: props.Data.BranchID,
            BusinessID: props.Data.FarmID,
            BatchID: props.Data.BatchID,
            Date: today,
            Age: 0,
            Qty: 0,
            Weight: 0.000,
            UnitCost: 0.00,
            TotalCost: 0.00,
            GodownAC: "",
            Godown_Code: "",
            GodownAC_Label: "",
            Type: "",
            Live: "",
        });
        setError({});
        props.onReload();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const CalcQuantity = (e) => {
        let Cost = parseFloat(e.target.value * parseFloat(UnitCost))
        setFormData({ ...formData, "Qty": e.target.value, "TotalCost": Cost.toFixed(2) })
    }

    const CalcWeight = (e) => {
        let Cost = parseFloat(e.target.value * parseFloat(UnitCost))
        setFormData({ ...formData, "Weight": e.target.value })
    }

    const CalcCost = (e) => {
        let Cost = parseFloat(e.target.value * Qty)
        setFormData({ ...formData, "UnitCost": e.target.value, "TotalCost": Cost.toFixed(2) })
    }

    const GetAVGCost = (e) => {
        if (UnitCost === "" || UnitCost === undefined || UnitCost === 'undefiend' || UnitCost === 0)
            setFormData({ ...formData, "UnitCost": AVGCost })
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
                        <p className="fs-4 fw-bolder text-center px-0 text-uppercase m-0">Bird Transfer to Godown</p>
                        <p className="fs-6 fw-bold text-center px-0 text-uppercase m-0">{props.Data ? props.Data.BatchID + ". " + props.Data.Title : "N/A"}</p>
                        <p className="fs-6 fw-bold text-center px-0 text-success border-bottom m-0">{props.Data ? props.Data.details.FullName : "N/A"}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-left text-muted px-0">Expire A/C: <span className="fw-bolder">{formData ? GodownAC_Label : "N/A"}</span> </small>
                            <small className="text-right text-success px-0"><span className="fw-bolder">{Type === 1 ? "— Live Birds —" : Type === 2 ? "— Proccesed Birds —" : "N/A"}</span> </small>
                        </div>
                        <form>
                            <div className="form-group mt-3">
                                <p className="m-0 text-center">Date</p>
                                <Datepicker
                                    name="Date"
                                    selected={Date}
                                    className="form-control border rounded text-center text-dark fw-bolder mx-auto"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setFormData({ ...formData, "Date": e })}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Please select date"
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label text-center">From</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="Qty"
                                            name="Qty"
                                            placeholder='Quantity'
                                            // onChange={e => CalcQuantity(e)}
                                            value={props.Data ? props.Data.Title + " (" + parseInt(Live - Qty) + ")" : "N/A"}
                                            disabled
                                        />
                                        {Error.BatchID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchID}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label">To</label>
                                        <div className="d-flex justify-content-center mx-2 w-100">
                                            <Select
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                menuPortalTarget={document.body}
                                                borderRadius={"0px"}
                                                options={Array.isArray(GodownList) && GodownList.length ? GodownList.map((item) => ({ label: item.id + ". " + item.Title, GodownAC: item.Accounts[0].GodownAC.id, Godown_Code: item.Accounts[0].GodownAC.COA_Code, GodownAC_Label: item.Accounts[0].GodownAC.COA_Title, Type: item.Type, value: item.id })) : []}
                                                defaultValue={{ label: "Select godwon", value: 0 }}
                                                name="GodownID"
                                                placeholder={"Search"}
                                                styles={CScolourStyles}
                                                // value={SearchKey}
                                                onChange={(e) => setFormData({ ...formData, "GodownID": e.value, "GodownAC": e.GodownAC, "Godown_Code": e.Godown_Code, "GodownAC_Label": e.GodownAC_Label, "Type": e.Type })}
                                                required
                                                id="GodownID"
                                                isClearable={false}
                                                isSearchable={true}
                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                            />
                                        </div>

                                        {Error.GodownID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GodownID}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label text-center">Transfer Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="Qty"
                                            name="Qty"
                                            placeholder='Quantity'
                                            onChange={e => CalcQuantity(e)}
                                            value={formData ? Qty : ""}
                                            disabled={!GodownID}
                                        />
                                        {Error.Qty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label">Transfer Weight</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="Weight"
                                            name="Weight"
                                            placeholder='Unit Weight'
                                            onChange={e => CalcWeight(e)}
                                            value={Weight}
                                            disabled={!GodownID}
                                        />
                                        {Error.Weight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label text-center">Unit Cost <small className="text-success"> {parseFloat(UnitCost) === parseFloat(AVGCost) ? "(Auto Generated)" : "(Custom Rate)"}</small></label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="UnitCost"
                                            name="UnitCost"
                                            placeholder='Unit Cost'
                                            onChange={e => CalcCost(e)}
                                            onBlur={e => GetAVGCost(e)}
                                            value={UnitCost}
                                            disabled={!GodownID}
                                        />
                                        {Error.UnitCost ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitCost}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group text-center">
                                        <label htmlFor="message-text" className="col-form-label">Total Cost</label>
                                        <input
                                            type="text"
                                            className="form-control text-center fw-bolder"
                                            id="TotalCost"
                                            name="TotalCost"
                                            placeholder='Total Cost'
                                            onChange={e => onChange(e)}
                                            value={TotalCost}
                                            disabled={!GodownID}
                                        />
                                        {Error.TotalCost ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TotalCost}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => Submit()} disabled={!GodownID}><i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}