import { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { CreateMessage } from "../Modals/ModalForm.js";

import { PartyStatusList, SaveParty } from '../../actions/APIHandler';

const PartyReg = ({ list, setList, scale, sub_scale, user }) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const [Error, setError] = useState({});
    const [modalShow, setModalShow] = useState(false);
    let toastProperties = null;

    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [Step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        Title: '',
        Name: '',
        Address: '',
        Contact: '',
        SCMoney: '',
        Limit: null,
        Balance: '',
        Target: '',
        Currency: '',
        FarmReg: false,
        BlankCheque: false,
        Agreement: false,
        Status: 0,
        RepName: "",
        RepID: "",
    });
    const { Title, Name, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status, RepName, RepID } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFocus = (e) => e.target.select()

    const onSubmit = async e => {
        setModalShow(false)
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await SaveParty(Title, Name, Address, Contact, SCMoney, Limit, Balance, Target, Currency.value, FarmReg, BlankCheque, Agreement, Status, RepID);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: "Failed to party registration. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    return (
        <div className='header d-flex justify-content-center align-items-center w-100 h-100'>
            <div className='row bg-white w-100 py-4'>
                <div className="header my-4">
                    <p className="fs-2 text-center m-0">New Party Registration</p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb d-flex justify-content-center">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/supplier_reg">Add New Party</Link></li>
                        </ol>
                    </nav>
                </div>
                <div className="row h-100 w-100">
                    <div className="col-sm-8 col-md-8 col-lg-8 mx-auto d-table h-100">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="py-2">Business Name</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            class="form-control"
                                            type='text'
                                            placeholder='Business Name'
                                            name='Title'
                                            value={Title}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
                                            maxLength='80'
                                            required
                                        />
                                        {Error.Title ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                            : null}
                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2">Name</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            class="form-control"
                                            type='text'
                                            placeholder='Name'
                                            name='Name'
                                            value={Name}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
                                            maxLength='80'
                                            required
                                        />
                                        {Error.Name ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Name}</small></p>
                                            : null}
                                    </th>
                                </tr>

                                <tr>
                                    <td className="py-2">Business Address</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            class="form-control"
                                            type='text'
                                            placeholder='Address'
                                            name='Address'
                                            value={Address}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
                                            maxLength='250'
                                            required
                                        />
                                        {Error.Address ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Address}</small></p>
                                            : null}
                                    </th>
                                </tr>

                                <tr>
                                    <td className="py-2" scope="row">Contact</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            class="form-control"
                                            type='number'
                                            placeholder='Contact No'
                                            name='Contact'
                                            value={Contact}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
                                            maxLength='50'
                                            required
                                        />
                                        {Error.Contact ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Contact}</small></p>
                                            : null}
                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2" scope="row">Credit Limit</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
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

                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2" scope="row">Target</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
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

                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2" scope="row">Currency</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={[{ label: "PGK", value: 1 }, { label: "USD", value: 2 }, { label: "KG", value: 3 }, { label: "PCS", value: 4 }]}
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

                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2" scope="row">Balance</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
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

                                    </th>
                                </tr>
                                <tr>
                                    <td className="py-2" scope="row">Security Money</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
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

                                    </th>
                                </tr>
                                {user.Role.No < 8 ?
                                    <tr>
                                        <td className="py-2" scope="row">Status</td>
                                        <td className="py-2">:</td>
                                        <th className="py-2">
                                            <div className="form-group">
                                                <Select
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    menuPortalTarget={document.body}
                                                    borderRadius={"0px"}
                                                    options={PartyStatusList}
                                                    name="Status"
                                                    placeholder={"Select status"}
                                                    styles={CScolourStyles}
                                                    value={Status}
                                                    onChange={e => setFormData({ ...formData, "Status": e })}
                                                    required
                                                    id="Status"
                                                />
                                                {Error.Status ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                                    : null}
                                            </div>Status
                                        </th>
                                    </tr>
                                    : null}

                            </tbody>
                        </table>

                        <div className='d-flex justify-content-around align-items-center border'>
                            <div className="form-group m-0">
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
                                    <label class="form-check-label" for="FarmReg">Trade Licence</label>
                                </div>
                            </div>
                            <div className="form-group m-0">
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
                                    <label class="form-check-label" for="BlankCheque">
                                        Blank Cheque
                                    </label>
                                </div>
                            </div>
                            <div className="form-group m-0">
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
                        </div>
                        <div className="p-2" role="toolbar" style={{ textAlign: "center" }}>
                            <button className="btn btn-outline-success m-2" type="button" onClick={() => setModalShow(true)}>Submit</button>
                        </div>

                        <CreateMessage
                            header="Confirm Party Registration"
                            body_header={Title}
                            body={"Are you sure want to create " + Title + "  as party?"}
                            show={modalShow}
                            Click={(e) => onSubmit(e)}
                            onHide={() => setModalShow(false)}
                        />

                    </div>
                </div>
            </div>
        </div >
    )

};
const mapStateToProps = (state, props) => ({
    data: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    props: props,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(PartyReg);