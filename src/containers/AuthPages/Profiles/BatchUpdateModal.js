import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { LoadCondList, UpdateBatch } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const BatchUpdateModal = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState({});
    const initialValue = { value: 0, label: "" };
    const [CondList, setCondList] = useState(initialValue);
    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        CompanyID: props.CompanyID,
        BranchID: props.BranchID,
        UserID: props.UserID,
        BusinessID: props.BusinessID,
        BatchNo: props.Data ? props.Data.BatchNo : "",
        CondTitle: props.Data ? props.Data.CondID.Title : "",
        CondID: props.Data ? props.Data.CondID.id : "",
        IssueDate: props.Data ? props.Data.IssueDate : "",
        Size: props.Data ? props.Data.Size : "",
        FCR: props.Data ? props.Data.FCR : "",
        ABW: props.Data ? props.Data.ABW : "",
        Cost: props.Data ? props.Data.Cost : "",
        SellRate: props.Data ? props.Data.SellRate : "",
        NetPay: props.Data ? props.Data.NetPay : "",
        GrandPay: props.Data ? props.Data.GrandPay : "",
        SavingRate: props.Data ? props.Data.SavingRate : "",
        Saving: props.Data ? props.Data.Saving : "",
        Status: props.Data ? props.Data.Status : "",
    });

    useEffect(() => {
        Condition();
    }, [])

    const { BatchNo, CondID, CondTitle, IssueDate, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const SendBatch = async () => {
        const result = await UpdateBatch(props.CompanyID, props.BranchID, props.UserID, props.Data.BusinessID.id, props.Data.id, props.Data.BatchNo, CondID, IssueDate, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status);

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
                props.onReload();
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Batch update failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            CompanyID: props.CompanyID,
            BranchID: props.BranchID,
            UserID: props.UserID,
            BusinessID: props.BusinessID,
            BatchNo: props.Data.CompanyID,
            CondTitle: props.Data.CondID.Title,
            CondID: props.Data.CondID.id,
            IssueDate: props.Data.IssueDate,
            Size: props.Data.Size,
            FCR: props.Data.FCR,
            ABW: props.Data.ABW,
            Cost: props.Data.Cost,
            SellRate: props.Data.SellRate,
            NetPay: props.Data.NetPay,
            GrandPay: props.Data.GrandPay,
            SavingRate: props.Data.SavingRate,
            Saving: props.Data.Saving,
            Status: props.Data.Status,
        });
        setError({});

        props.onHide()
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const Condition = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await LoadCondList();
        if (result !== true) {
            setCondList(result)
            // setFormData({ ...formData, CondTitle: result.active.Title, CondID: result.active.value })
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    Update Batch Details <br />
                    <small>Please change the required field</small>
                </p>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => ClearField()} />
                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="IssueDate" class="col-form-label">Batch No</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="BatchNo"
                            name="BatchNo"
                            placeholder='Batch No'
                            value={BatchNo}
                            disabled
                        />
                        {Error.BatchNo ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BatchNo}</small></p>
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
                        <label htmlFor="IssueDate" class="col-form-label">Issue Date</label>
                        <input
                            type="date"
                            class="form-control"
                            id="IssueDate"
                            name="IssueDate"
                            placeholder='Issue Date'
                            value={IssueDate}
                            onChange={e => onChange(e)}
                        />
                        {Error.IssueDate ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.IssueDate}</small></p>
                            : null}
                    </div>

                    <div className="form-group">
                        <label htmlFor="message-text" class="col-form-label">Size</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="Size"
                            name="Size"
                            placeholder='Size'
                            value={Size}
                            onChange={e => onChange(e)}
                        />
                        {Error.Size ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Size}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">FCR</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="FCR"
                            name="FCR"
                            placeholder='FCR'
                            value={FCR}
                            onChange={e => onChange(e)}
                        />
                        {Error.FCR ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FCR}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">ABW</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="ABW"
                            name="ABW"
                            placeholder='ABW'
                            value={ABW}
                            onChange={e => onChange(e)}
                        />
                        {Error.ABW ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ABW}</small></p>
                            : null}
                    </div>

                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Cost</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="Cost"
                            name="Cost"
                            placeholder='Cost'
                            value={Cost}
                            onChange={e => onChange(e)}
                        />
                        {Error.Cost ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Cost}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Sell Rate</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="SellRate"
                            name="SellRate"
                            placeholder='Sell Rate'
                            value={SellRate}
                            onChange={e => onChange(e)}
                        />
                        {Error.SellRate ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SellRate}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Net Total Pay</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="NetPay"
                            name="NetPay"
                            placeholder='Net Total Pay'
                            value={NetPay}
                            onChange={e => onChange(e)}
                        />
                        {Error.NetPay ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.NetPay}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Grand Total Pay</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="GrandPay"
                            name="GrandPay"
                            placeholder='Grand Total Pay'
                            value={GrandPay}
                            onChange={e => onChange(e)}
                        />
                        {Error.GrandPay ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GrandPay}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Saving Rate</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="SavingRate"
                            name="SavingRate"
                            placeholder='Saving Rate'
                            value={SavingRate}
                            onChange={e => onChange(e)}
                        />
                        {Error.SavingRate ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SavingRate}</small></p>
                            : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" class="col-form-label">Savings</label>
                        <input
                            type="numeric"
                            class="form-control"
                            id="Saving"
                            name="Saving"
                            placeholder='Savings'
                            value={Saving}
                            onChange={e => onChange(e)}
                        />
                        {Error.Saving ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Saving}</small></p>
                            : null}
                    </div>
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
                        <label class="form-check-label" for="Status">Status</label>
                        {Error.Status ?
                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                            : null}
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={() => SendBatch()}>Submit </button>

            </Modal.Footer>
        </Modal >
    );
}