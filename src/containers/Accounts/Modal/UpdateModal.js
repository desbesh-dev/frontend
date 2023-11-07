import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { UpdateAcc } from '../../../actions/APIHandler';
import errorIcon from '../../../assets/error.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const UpdateModal = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [Error, setError] = useState({});
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        COA_Title: props.ChildAcc ? `${props.ChildAcc.COA_Title}` : props.SubAcc ? `${props.SubAcc.COA_Title}` : props.Acc ? `${props.Acc.COA_Title}` : "",
        COA_Code: props.ChildAcc ? `${props.ChildAcc.COA_Code}` : props.SubAcc ? `${props.SubAcc.COA_Code}` : props.Acc ? `${props.Acc.COA_Code}` : "",
        TransType: props.ChildAcc ? `${props.ChildAcc.TransType ? 1 : 0}` : props.SubAcc ? `${props.SubAcc.TransType ? 1 : 0}` : props.Acc ? `${props.Acc.TransType ? 1 : 0}` : null,
        AccType: props.ChildAcc ? `${props.ChildAcc.COA_ID}` : props.SubAcc ? `${props.SubAcc.COA_ID}` : props.Acc ? `${props.Acc.COA_ID}` : "",
        Terms: props.ChildAcc ? `${props.ChildAcc.Terms ? 1 : 0}` : props.SubAcc ? `${props.SubAcc.Terms ? 1 : 0}` : props.Acc ? `${props.Acc.Terms ? 1 : 0}` : "",
        GrossProfit: props.ChildAcc ? `${props.ChildAcc.GrossProfit ? 1 : 0}` : props.SubAcc ? `${props.SubAcc.GrossProfit ? 1 : 0}` : props.Acc ? `${props.Acc.GrossProfit ? 1 : 0}` : "",
        MoneyType: props.ChildAcc ? `${props.ChildAcc.MoneyType ? 1 : 0}` : props.SubAcc ? `${props.SubAcc.MoneyType ? 1 : 0}` : props.Acc ? `${props.Acc.MoneyType ? 1 : 0}` : "",
        TreeLevel: props.ChildAcc ? `${props.ChildAcc.TreeLevel}` : props.SubAcc ? `${props.SubAcc.TreeLevel}` : props.Acc ? `${props.Acc.TreeLevel}` : "",
    });

    let id = props.ChildAcc ? `${props.ChildAcc.id}` : props.SubAcc ? `${props.SubAcc.id}` : props.Acc ? `${props.Acc.id}` : null;
    let ParentID = props.ChildAcc ? `${props.SubAcc.COA_Code}` : props.SubAcc ? `${props.Acc.COA_Code}` : props.Acc ? `${props.Acc.COA_Code}` : null;
    let COA_ID = props.SubAcc ? `${props.SubAcc.COA_ID}` : props.Acc ? `${props.Acc.COA_ID}` : null;

    const { COA_Title, COA_Code, TransType, AccType, Terms, GrossProfit, MoneyType, TreeLevel } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const CallUpdateAcc = async () => {
        const Trans = TransType.value === undefined ? TransType : TransType.value
        const Acc = AccType.value === undefined ? AccType : AccType.value
        const Tarm = Terms.value === undefined ? Terms : Terms.value
        const Money = MoneyType.value === undefined ? MoneyType : MoneyType.value

        const result = await UpdateAcc(ParentID, COA_ID, COA_Title, COA_Code, Trans, Acc, Tarm, GrossProfit, Money, TreeLevel, id);
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
                props.onHide();
                // ClearField();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update account. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        // dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            COA_Title: "",
            COA_Code: "",
            TransType: null,
            AccType: "",
            Terms: "",
            GrossProfit: "",
            MoneyType: "",
            TreeLevel: "",
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
            fontWeight: "500"
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
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
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Update Account</span>
                        <small className="text-center px-0">Please fill up the desire field to update</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="IssueDate" class="col-form-label">Parent Account</label>
                                <input
                                    type="Parent Account"
                                    class="form-control fw-bold"
                                    value={props.SubAcc ? `${props.SubAcc.COA_Title} [${props.SubAcc.COA_Code}]`
                                        : props.Acc ? `${props.Acc.COA_Title} [${props.Acc.COA_Code}]`
                                            : null}
                                    disabled
                                />
                                {Error.ParentID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ParentID}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Account Title</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="COA_Title"
                                    name="COA_Title"
                                    placeholder='Account Title'
                                    value={COA_Title}
                                    onChange={e => onChange(e)}
                                />
                                {Error.COA_Title ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_Title}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Short Code</label>
                                <input
                                    type="numeric"
                                    class="form-control fw-bold"
                                    id="COA_Code"
                                    name="COA_Code"
                                    placeholder='Short Code'
                                    value={COA_Code}
                                    onChange={e => onChange(e)}
                                />
                                {Error.COA_Code ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.COA_Code}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Transaction Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Single", value: 0 }, { label: "Group", value: 1 }]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Cond"
                                    placeholder={"Select condition"}
                                    styles={CScolourStyles}
                                    value={{
                                        label: TransType.label === undefined ? parseInt(TransType) === 0 ? "Single" : "Group" : TransType.label,
                                        value: TransType.value === undefined ? parseInt(TransType) : TransType.value
                                    }}
                                    onChange={e => setFormData({ ...formData, "TransType": e })}
                                    required
                                />
                                {Error.TransType ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TransType}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Account Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[
                                        { label: "Assets", value: 10000 },
                                        { label: "Liabilities", value: 20000 },
                                        { label: "Expense", value: 30000 },
                                        { label: "Revenue", value: 40000 },
                                    ]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Cond"
                                    placeholder={"Select account type"}
                                    styles={CScolourStyles}
                                    value={{
                                        label: AccType.label === undefined ? parseInt(AccType) === 1 ? "Assets" : parseInt(AccType) === 2 ? "Liabilities" : parseInt(AccType) === 3 ? "Expense" : parseInt(AccType) === 4 ? "Revenue" : null : AccType.label,
                                        value: AccType.value === undefined ? AccType : AccType.value
                                    }}
                                    onChange={e => setFormData({ ...formData, "AccType": e })}
                                    required
                                    id="Cond"
                                />
                                {Error.AccType ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccType}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Terms</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Current/Short Terms", value: 0 }, { label: "Fixed/Long Terms", value: 1 }]}
                                    placeholder={"Select condition"}
                                    styles={CScolourStyles}
                                    value={{
                                        label: Terms.label === undefined ? parseInt(Terms) === 0 ? "Current/Short Terms" : "Fixed/Long Terms" : Terms.label,
                                        value: Terms.value === undefined ? parseInt(Terms) : Terms.value
                                    }}
                                    onChange={e => setFormData({ ...formData, "Terms": e })}
                                    required
                                />
                                {Error.Terms ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Terms}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Money Type</label>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Cash", value: 0 }, { label: "Bank", value: 1 }]}
                                    placeholder={"Select condition"}
                                    styles={CScolourStyles}
                                    value={{
                                        label: MoneyType.label === undefined ? parseInt(MoneyType) === 0 ? "Cash" : "Bank" : MoneyType.label,
                                        value: MoneyType.value === undefined ? parseInt(MoneyType) : MoneyType.value
                                    }}
                                    onChange={e => setFormData({ ...formData, "MoneyType": e })}
                                    required
                                />
                                {Error.MoneyType ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MoneyType}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Tree  Level</label>
                                <input
                                    type="numeric"
                                    class="form-control fw-bold"
                                    id="TreeLevel"
                                    name="TreeLevel"
                                    placeholder='Tree  Level'
                                    value={TreeLevel}
                                    onChange={e => onChange(e)}
                                />
                                {Error.TreeLevel ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.TreeLevel}</small></p>
                                    : null}
                            </div>

                            <div className="form-check form-switch fw-bold mb-2">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value={GrossProfit}
                                    id="GrossProfit"
                                    name="GrossProfit"
                                    checked={parseInt(GrossProfit) === 1 ? true : false}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: parseInt(GrossProfit) === 1 ? 0 : 1 })}
                                />
                                <label class="form-check-label" for="Status">Affect Gross Profit</label>
                                {Error.GrossProfit ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GrossProfit}</small></p>
                                    : null}
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => ClearField()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => CallUpdateAcc()}><i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}