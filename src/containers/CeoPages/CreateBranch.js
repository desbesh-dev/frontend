import * as moment from 'moment'

import { CreateAccount, SaveBranch } from '../../actions/APIHandler';
import { FaCodeBranch, FaUserTie } from "react-icons/fa";
import React, { Fragment, useEffect, useState } from 'react';
import { IoImagesOutline, IoRemoveCircleOutline, } from "react-icons/io5";
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../actions/auth';
import { connect, useDispatch } from 'react-redux';

import BusinessProfiles from './BusinessProfiles'
import Button from '../../hocs/button/Button';
import { CreateMessage } from "../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';

const CreateBranch = ({ display, user, list, setList }) => {
    const [modalShow, setModalShow] = useState(false);
    const [Data, setData] = useState(false)
    const [TempData, setTempData] = useState(false)
    const [View, setView] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const initialValue = { value: 0, label: "" };
    const [ManagerLists, setManagerLists] = useState(initialValue);
    const [DivisionLists, setDivisionLists] = useState(initialValue);
    const [ZilaLists, setZilaLists] = useState(initialValue);
    const [UpazilaLists, setUpazilaLists] = useState(initialValue);
    const [ZilaCode, setZilaCode] = useState(null);
    const [UnionLists, setUnionLists] = useState(initialValue);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        BranchID: "",
        Name: "",
        Domain: "",
        Established: "",
        ManagerID: "",
        ContactNo: "",
        BranchEmail: "",
        Division: "",
        Zila: "",
        Upazila: "",
        Union: "",
        VillageName: "",
    });

    useEffect(() => {
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        LoadManager();
        LoadDivision();
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
    }, [])

    const {
        BranchID,
        Name,
        Domain,
        Established,
        ManagerID,
        ContactNo,
        BranchEmail,
        Division,
        Zila,
        Upazila,
        Union,
        VillageName,
        Manager,
    } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFocus = (e) => {
        setTempData(e.target.value)
        e.target.select()
    };

    const LoadManager = async () => {
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setManagerLists(res.data.Rep);
        } catch (err) {
        }
    }

    const LoadManagerID = async (e) => {


        setFormData({ ...formData, "ManagerID": e.target.value });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ref_lists/${e.target.value}`, config);
            setFormData({ ...formData, "Manager": res.data[0].FullName, "ManagerID": e.target.value });
        } catch (err) {
            setFormData({ ...formData, "Manager": "Not Found", "ManagerID": e.target.value });
        }
    }

    const LoadDivision = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/division/`, formData, config);
            setDivisionLists(res.data.Data)
        } catch (err) {
        }
    }

    const LoadZila = async (e) => {
        setFormData({ ...formData, "Division": e.label });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/zila/${e.value}`, formData, config);
            setZilaLists(res.data.Data)
        } catch (err) {

        }
    }

    const LoadUpazila = async (e) => {
        setFormData({ ...formData, "Zila": e.label });
        setZilaCode(e.value)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/upazila/${e.value}`, formData, config);
            setUpazilaLists(res.data.Data)
        } catch (err) {
        }
    }

    const LoadUnion = async (e) => {
        setFormData({ ...formData, "Upazila": e.label });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/union/${ZilaCode}/${e.value}`, formData, config);
            setUnionLists(res.data.Data)
        } catch (err) {
        }
    }

    const history = useHistory();

    const BranchUpdateAction = async e => {
        setModalShow(false)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await SaveBranch(user.CompanyID, BranchID, Name, Domain, Established, ManagerID, ContactNo, BranchEmail, Division, Zila, Upazila, Union, VillageName, Manager);

        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to create new branch. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
    };

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", height: "25px", borderRadius: '0px' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                cursor: isDisabled ? 'not-allowed' : 'default',
                borderRadius: '20px',
            };
        },
        menu: base => ({
            ...base,
            borderRadius: '0px',
            outline: 0,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
            ...base,
            padding: '5px'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '25px',
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '25px',
            padding: '0 3px',
            color: 'black'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    };

    const trigger = () => {

        setList([...list, toastProperties = {
            id: 1,
            title: 'Warning',
            description: 'This is a warning toast component',
            backgroundColor: '#f0ad4e',
            icon: warningIcon
        }])


    }
    return (
        <div className="position-relative h-100">
            <div className="position-absolute overflow-auto mb-5 pb-5 w-100 h-100 ">
                <div className="header mb-4">
                    <p className="display-6 d-flex justify-content-center m-0">
                        Creating A New Branch
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb d-flex justify-content-center">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/create_branch">Create Branch</Link></li>
                        </ol>
                    </nav>
                </div>

                <div className="row m-0 w-100 mx-auto d-table h-100">
                    <div className="col-sm-12 col-md-6 col-lg-6 mx-auto d-table h-100">
                        <div className="col-sm-12 col-md-12 col-lg-12 bg-white mx-auto d-table h-100">
                            <div className="row">
                                <table className="table table-hover table-borderless">
                                    <tbody>
                                        {/* <tr>
                                            <td className="py-2">Branch ID</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="text"
                                                    placeholder="Branch ID"
                                                    name="BranchID"
                                                    value={BranchID}
                                                    onFocus={(e) => handleFocus(e)}
                                                    onChange={(e) => onChange(e)}

                                                    maxLength="50"
                                                    required
                                                    disabled
                                                />
                                                {Error.BranchID ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.BranchID}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr> */}
                                        <tr>
                                            <td className="py-2" scope="row">
                                                Branch Name
                                            </td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="text"
                                                    placeholder="Branch Name"
                                                    name="Name"
                                                    value={Name}
                                                    onFocus={(e) => handleFocus(e)}
                                                    onChange={(e) => onChange(e)}

                                                    maxLength="50"
                                                    required
                                                />
                                                {Error.Name ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.Name}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">
                                                Domain Name
                                            </td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="text"
                                                    placeholder="Branch Domain"
                                                    name="Domain"
                                                    value={Domain}
                                                    onFocus={(e) => handleFocus(e)}
                                                    onChange={(e) => onChange(e)}

                                                    maxLength="50"
                                                    required
                                                />
                                                {Error.Domain ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.Domain}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">
                                                Established
                                            </td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="date"
                                                    data-date-format="DD MMMM YYYY"
                                                    placeholder="Established"
                                                    name="Established"
                                                    value={Established}
                                                    onChange={(e) => onChange(e)}

                                                    required
                                                />
                                                {Error.Established ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.Established}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr>


                                        <tr>
                                            <td className="py-2" scope="row">Enroll Manager</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    borderRadius={'0px'}
                                                    options={ManagerLists}
                                                    name='Manager'
                                                    placeholder={"Select manager name"}
                                                    styles={colourStyles}
                                                    value={!Manager ? null : { label: Manager }}
                                                    onChange={e => setFormData({ ...formData, "Manager": e.label, "ManagerID": e.value })}
                                                />
                                            </th>
                                        </tr>
                                        {Error.ManagerID ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ManagerID}</small></p>
                                                </td>
                                            </tr> : null
                                        }

                                        <tr>
                                            <td className="py-2" scope="row">Enroll Manager Id</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Manager ID'
                                                    name='ManagerID'
                                                    value={ManagerID}
                                                    // onFocus={e => handleFocus(e)}
                                                    onChange={e => LoadManagerID(e)}
                                                    minLength='100'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.ManagerID ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ManagerID}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">
                                                Branch Contact No
                                            </td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="number"
                                                    placeholder="Contact Number"
                                                    name="ContactNo"
                                                    value={ContactNo}
                                                    onFocus={(e) => handleFocus(e)}
                                                    onChange={(e) => onChange(e)}

                                                    maxLength="11"
                                                    required
                                                />
                                                {Error.ContactNo ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.ContactNo}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">
                                                Branch Email
                                            </td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "0px solid #F4F7FC",
                                                        fontWeight: "bold",
                                                        width: "100%",
                                                        paddingLeft: "5px",
                                                    }}
                                                    type="email"
                                                    placeholder="Branch Email"
                                                    name="BranchEmail"
                                                    value={BranchEmail}
                                                    onFocus={(e) => handleFocus(e)}
                                                    onChange={(e) => onChange(e)}

                                                    maxLength="50"
                                                    required
                                                />
                                                {Error.BranchEmail ? (
                                                    <p className="mx-auto d-table text-center text-warning m-0">
                                                        <small>{Error.BranchEmail}</small>
                                                    </p>
                                                ) : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Division</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    borderRadius={'0px'}
                                                    options={DivisionLists}
                                                    name='Division'
                                                    placeholder={"Please select division"}
                                                    styles={colourStyles}
                                                    value={Division === "" ? null : { value: Division, label: Division }}
                                                    onChange={e => LoadZila(e)}
                                                />
                                            </th>
                                        </tr>
                                        {Error.Division ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Division}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Zila</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    borderRadius={'0px'}
                                                    options={ZilaLists}
                                                    name='Zila'
                                                    placeholder={"Please select zila"}
                                                    styles={colourStyles}
                                                    value={Zila === "" ? null : { value: Zila, label: Zila }}
                                                    onChange={e => LoadUpazila(e)}
                                                />
                                            </th>
                                        </tr>
                                        {Error.Zila ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Zila}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Upazila</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    borderRadius={'0px'}
                                                    options={UpazilaLists}
                                                    name='Upazila'
                                                    placeholder={"Please select upazila"}
                                                    styles={colourStyles}
                                                    value={Upazila === "" ? null : { value: Upazila, label: Upazila }}
                                                    onChange={e => LoadUnion(e)}
                                                />
                                            </th>
                                        </tr>
                                        {Error.Upazila ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Upazila}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Union</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    borderRadius={'0px'}
                                                    options={UnionLists}
                                                    name='Union'
                                                    placeholder={"Please select union"}
                                                    styles={colourStyles}
                                                    value={Union === "" ? null : { value: Union, label: Union }}
                                                    onChange={e => setFormData({
                                                        ...formData, "Union": e.label
                                                    })}
                                                />
                                            </th>
                                        </tr>
                                        {Error.Union ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Union}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Village Name</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Village Name'
                                                    name='VillageName'
                                                    value={VillageName === "" ? null : VillageName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='100'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.VillageName ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.VillageName}</small></p>
                                                </td>
                                            </tr> : null
                                        }


                                    </tbody>
                                </table>

                            </div>
                            <div className="mx-auto d-table">
                                <button className='btn btn-outline-success form-rounded px-4 m-2' title="Update" type='button' onClick={() => setModalShow(true)}>
                                    Create
                                </button>
                                <CreateMessage
                                    header="Branch Creation"
                                    body_header={Name + " Branch"}
                                    body={"Are you sure want to create " + Name + " branch?"}
                                    show={modalShow}
                                    Click={(e) => BranchUpdateAction(e)}
                                    onHide={() => setModalShow(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(CreateBranch);






