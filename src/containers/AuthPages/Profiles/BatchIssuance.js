import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { LoadCondList, SaveBatch } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";

export const BatchIssuance = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState({});
    const initialValue = { value: 0, label: "" };
    const [CondList, setCondList] = useState(initialValue);
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        CompanyID: "",
        BranchID: "",
        UserID: "",
        BusinessID: "",
        BatchNo: "",
        CondTitle: "",
        CondID: "",
        IssueDate: "",
        Size: "",
        FCR: "",
        ABW: "",
        Cost: "",
        SellRate: "",
        NetPay: "",
        GrandPay: "",
        SavingRate: "",
        Saving: "",
        Status: "",
    });

    useEffect(() => {
        Condition();
    }, [])

    const { BatchNo, CondID, CondTitle, IssueDate, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const ClearField = () => {
        setFormData({
            CompanyID: "",
            BranchID: "",
            UserID: "",
            BusinessID: "",
            BatchNo: "",
            IssueDate: "",
            Size: "",
            FCR: "",
            ABW: "",
            Cost: "",
            SellRate: "",
            NetPay: "",
            GrandPay: "",
            SavingRate: "",
            Saving: "",
            Status: "",
        });
        setError({});
        Condition();
        props.onReload();
        props.onHide()
    }

    const SendBatch = async () => {
        var data = moment(IssueDate).format('YYYY-MM-DD')
        const result = await SaveBatch(props.CompanyID, props.BranchID, props.UserID, props.BusinessID, isNaN(props.BatchNo) ? 1 : props.BatchNo, CondID, data, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status);
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
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                props.onReload();
                props.onHide()
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to issuance new batch. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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
            setFormData({ ...formData, CondTitle: result[0].label, CondID: result[0].value })
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
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    New Batch Issuance <br />
                    <small>Please fill the business info</small>
                </p>
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
                            value={isNaN(props.BatchNo) ? 1 : props.BatchNo}
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
                        {/* <input
                            type="date"
                            class="form-control"
                            id="IssueDate"
                            name="IssueDate"
                            placeholder='Issue Date'
                            value={IssueDate}
                            onChange={e => onChange(e)}
                        /> */}
                        <Datepicker
                            selected={IssueDate}
                            className="form-control"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => setFormData({ ...formData, IssueDate: e })}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Please select date"
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
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: !Status ? 1 : 0 })}
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