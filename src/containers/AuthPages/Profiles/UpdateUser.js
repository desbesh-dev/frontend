import { ApproveData, Designation, Designation_CEO, FetchBranch, FetchConcern, FetchDesignation, FetchSector, FetchSisterSector, getStaffLabel, ReligionList, RemoveUser, UpdateCredential, UpdateImage } from '../../../actions/APIHandler';
import { Button, Modal } from "react-bootstrap";
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as moment from 'moment'
import Datepicker from 'react-datepicker';
import { customHeader, locales } from "../../../hocs/Class/datepicker";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { DeleteMessage } from "../../Modals/DeleteModal.js";
import { Fragment } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { checkToken } from '../../../actions/auth';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';
let today = new Date();

const UpdateUser = ({ UserData, data, display, list, setList, scale, no }) => {
    const dispatch = useDispatch();
    let history = useHistory();
    let toastProperties = null;

    const [modalShow, setModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [ConcernList, setConcernList] = useState(initialValue);
    const [SectorList, setSectorList] = useState(initialValue);
    const [DesignationList, setDesignationList] = useState(initialValue);
    const [Error, setError] = useState({});
    const [locale, setLocale] = useState('en');
    const [formData, setFormData] = useState({
        username: data.username,
        FirstName: data.DetailID.FirstName,
        LastName: data.DetailID.LastName,
        DOB: data.DetailID.DOB,
        MobileNo: data.DetailID.MobileNo,
        email: data.DetailID.email,
        pass: '',

        Nationality: parseInt(data.DetailID.Nationality) === 1 ? { value: 1, label: "Bangladeshi" } : { value: 2, label: "Papuans" },
        PassportNo: parseInt(data.DetailID.Nationality) === 1 ? data.DetailID.Passport.PassportNo : "",
        IssueDate: today,
        ExpireDate: today,

        Name: data.Name,
        GovtID: data.DetailID.GovtID,
        FatherName: data.DetailID.FatherName,
        MotherName: data.DetailID.MotherName,
        Religion: { label: data.DetailID.Religion },
        Gender: parseInt(data.DetailID.Gender) === 1 ? { value: 1, label: "Male" } : { value: 2, label: "Female" },
        MaritalStatus: parseInt(data.DetailID.MaritalStatus) === 1 ? { value: 0, label: "Married" } : { value: 1, label: "Unmarried" },
        Education: data.DetailID.Education,
        Language: data.DetailID.Language,
        PresentAddress: data.DetailID.PresentAddress,
        PermanentAddress: data.DetailID.PermanentAddress,
        is_block: data.Role.is_block,
        is_active: data.Role.is_active,
        Concern: { label: data.SectorID.SisterID.Title, value: data.SectorID.SisterID.id },
        sector: { label: data.SectorID.SectorTitle, value: data.SectorID.id },
        Designation: { label: data.Role.Title, value: data.Role.No, "Scale": data.Role.Scale },
        avatar: data.avatar,
        avatar_prv: ''
    });

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadConcern();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [])

    var w = window.innerWidth;
    var h = window.innerHeight - 140;

    const LoadConcern = async () => {
        var result = await FetchConcern();
        if (result !== true) {
            setConcernList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const getSector = async (e) => {
        setFormData({ ...formData, "Concern": e })
        var result = await FetchSisterSector(e.value);
        if (result !== true) {
            setSectorList(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }


    const LoadDesignation = async (e) => {
        setFormData({ ...formData, "sector": e })
        var result = await FetchDesignation();
        if (result !== true) {
            setDesignationList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const { id, username, FirstName, LastName, email, NewPass, MobileNo, Name, GovtID, DOB, FatherName, MotherName, Nationality, PassportNo, IssueDate, ExpireDate, Religion, Gender, Occupation, Education, MaritalStatus, Language, PresentAddress, PermanentAddress, avatar, is_block, is_active, avatar_prv, Concern, sector, Designation } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, "Name": FirstName + " " + LastName });
    const handleFocus = (e) => e.target.select()

    const ChangePass = async e => {
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        const result = await UpdateCredential(data.id, email, NewPass, MobileNo);
        if (result.error) {
            const updatedState = {};
            for (var pair of result.error_details.entries()) {
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
                title: 'Success!',
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? infoIcon : successIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });

    };

    const onSubmit = async e => {
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        const PassportID = data.DetailID.Passport ? data.DetailID.Passport.id : null

        const result = await ApproveData(data.id, data.DetailID.id, data.Role.id, PassportID, data.SectorID.id, username, FirstName, LastName, email, NewPass, MobileNo, Name, GovtID, moment(DOB).format("YYYY-MM-DD"), FatherName, MotherName, Nationality, PassportNo, moment(IssueDate).format("YYYY-MM-DD"), moment(ExpireDate).format("YYYY-MM-DD"), Religion, Gender, Occupation, Education, MaritalStatus, Language, PresentAddress, PermanentAddress, is_block, is_active, Concern, sector, Designation, avatar, avatar_prv);
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
                title: 'Invalid Data',
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: warningIcon
            }])
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Success!',
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? infoIcon : successIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });

    };

    const CalculateAge = () => {
        let today = new Date();
        let BirthDate = new Date(DOB);

        let diff = today.getTime() - BirthDate.getTime();
        let year = Math.floor(diff / 31556736000);
        let days_diff = Math.floor((diff % 31556736000) / 86400000);
        let month = Math.floor(days_diff / 30.4167);
        let days = Math.floor(days_diff % 30.4167);
        let age = year + " Year, " + month + " Month, " + days + " Day";
        return age;
    }

    const ImageChange = (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];


        reader.onloadend = () => {
            setFormData({ ...formData, "avatar": file, "avatar_prv": reader.result })
        }
        reader.readAsDataURL(file)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ImageRemove = () => {
        setFormData({ ...formData, "avatar_prv": '' })
    }

    const UploadImage = async e => {
        e.preventDefault();
        const result = await UpdateImage(data.id, avatar);
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
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
    };

    const DeleteUser = async e => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveUser(data.DetailID.id);

        if (result !== true) { history.goBack(); }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
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

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-2">
                <p className="display-6 d-flex justify-content-center m-0">Update User Profile</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        {/* <li className="breadcrumb-item"><Link to={is_staff !== 0 ? `/employee_main/${data.UserInfo.id}` : `/user_profile/${data.UserInfo.id}`}>Profile</Link></li> */}
                        <li className="breadcrumb-item"><p className='text-dark text-bold m-0'>User Profile Update</p></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 px-0">
                <div className="position-absolute overflow-auto mx-auto bg-white pt-3 w-100" style={{ height: h + "px" }}>
                    <div className="col-sm-12 mx-auto">
                        <div className="d-flex border">
                            <hr className="my-auto flex-grow-1" />
                            <div className="px-4 pt-2"><h3 className='text-bold'>General Info</h3></div>
                            <hr className="my-auto flex-grow-1" />
                        </div>
                        <div className="row justify-content-between p-0 m-0">
                            <div className="col-lg-3 h-100 p-0">
                                <div className='d-flex justify-content-center'>
                                    <div className="img_container border" style={{ width: "270px", height: "350px" }}>
                                        <p className='mx-auto d-table border-bottom w-100 mb-2 text-center'>User Picture</p>
                                        <img src={avatar_prv ? avatar_prv : data ? data.avatar : null} className="image img-fluid rounded-square mx-auto d-table" width="150" alt="avatar" />
                                        <div className="middle">
                                            <input
                                                type="file"
                                                id="pic"
                                                className="d-none"
                                                accept="image/*"
                                                onChange={(e) => ImageChange(e)}
                                            />
                                            <label
                                                className='btn btn-outline-success shadow-lg'
                                                for="pic"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Choose avatar"
                                            >
                                                <i class="fad fa-images"></i>
                                            </label>
                                            {avatar_prv ?
                                                <Fragment>
                                                    <label
                                                        className='btn btn-outline-success shadow-lg'
                                                        for="file1"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="Upload avatar"
                                                        onClick={(e) => UploadImage(e)}>
                                                        <i class="fad fa-upload"></i>
                                                    </label>
                                                    <button
                                                        className='btn btn-outline-success shadow-lg'
                                                        for="file1"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="Remove selected image"
                                                        type="button"
                                                        onClick={() => ImageRemove()}>
                                                        <i class="fad fa-minus-circle"></i>

                                                    </button>
                                                </Fragment>
                                                : null}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 p-0">
                                <table className="table table-hover table-bordered">
                                    <tbody className='w-100'>
                                        <tr>
                                            <td className="py-2" scope="row">Id</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2 d-flex">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Id'
                                                    name='Id'
                                                    value={data.id}
                                                    onChange={e => onChange(e)}
                                                    minLength='6'
                                                    required
                                                    disabled
                                                />
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Username</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Username'
                                                    name='username'
                                                    value={username === "" ? data.username : username}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                    disabled
                                                />
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2">First Name</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='First Name'
                                                    name='FirstName'
                                                    value={FirstName === "" ? data.DetailID.FirstName : FirstName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.FirstName ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FirstName}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Last Name</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Last Name'
                                                    name='LastName'
                                                    value={LastName === "" ? data.DetailID.LastName : LastName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.LastName ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.LastName}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Date of Birth</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='date'
                                                    placeholder='Date of Birth'
                                                    name='DOB'
                                                    value={data.DetailID.DOB}
                                                    onChange={e => onChange(e)}
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.DOB ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DOB}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Mobile No</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='number'
                                                    placeholder='Mobile No'
                                                    name='MobileNo'
                                                    value={MobileNo === "" ? data.MobileNo : MobileNo}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='11'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.MobileNo ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MobileNo}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Email</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='emai'
                                                    placeholder='Email'
                                                    name='email'
                                                    value={email === "" ? data.email : email}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                            </th>
                                        </tr>
                                        {Error.email ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.email}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                        <tr>
                                            <td className="py-2" scope="row">Password</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='NewPass'
                                                    placeholder='Type New Password'
                                                    name='NewPass'
                                                    value={NewPass}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => setFormData({ ...formData, "NewPass": e.target.value })}
                                                    maxLength='12'
                                                    isDisabled={false}
                                                />
                                                <div className='d-flex justify-content-center mt-2'>
                                                    <button className='btn btn-outline-success border-light form-rounded px-4' type='button' onClick={e => ChangePass(e)}><i class="fs-5 text-success fad fa-shield-check px-2"></i>Change</button>
                                                </div>
                                            </th>
                                        </tr>
                                        {Error.password ?
                                            <tr>
                                                <td colspan="3" className='p-0'>
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.password}</small></p>
                                                </td>
                                            </tr> : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className="col-sm-12 my-3">
                        <div className="d-flex border">
                            <hr className="my-auto flex-grow-1" />
                            <div className="px-4"><h3 className='text-bold'>Personal Info</h3></div>
                            <hr className="my-auto flex-grow-1" />
                        </div>
                        <div className="col-lg-12 m-0 p-0">
                            <table className="table table-hover table-bordered">
                                <tbody>
                                    <tr>
                                        <td className="py-2" scope="row">Nationality</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <Select
                                                borderRadius={'0px'}
                                                name='Nationality'
                                                placeholder={"Please select nationality"}
                                                styles={colourStyles}
                                                options={[{ label: 'Bangladeshi', value: 1 }, { label: 'Papuans', value: 2 }]}
                                                value={Nationality === "" ? { value: data.DetailID.Nationality, label: data.DetailID.Nationality } : Nationality}
                                                onChange={e => setFormData({
                                                    ...formData, "Nationality": Nationality === "" ? data.DetailID.Nationality : e
                                                })}
                                            />
                                        </th>
                                    </tr>
                                    {Error.Nationality ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Nationality}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    {
                                        parseInt(Nationality.value) === 1 ?
                                            <Fragment>
                                                <tr>
                                                    <td className="py-2">Passport No</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='text'
                                                            placeholder='Passport No'
                                                            name='PassportNo'
                                                            value={PassportNo}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='9'
                                                            required
                                                        />
                                                        {Error.PassportNo ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PassportNo}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Issue Date</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-0 px-3">
                                                        <Datepicker
                                                            portalId="root-portal"
                                                            name='IssueDate'
                                                            selected={IssueDate}
                                                            className="form-control border-0 fw-bolder p-0 py-2 m-0"
                                                            dateFormat="dd MMM yyyy"
                                                            onChange={e => setFormData({ ...formData, "IssueDate": e })}
                                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                                            locale={locales[locale]}
                                                            placeholderText="Issue Date"
                                                            autosuggest="off"
                                                        />
                                                        {Error.IssueDate ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.IssueDate}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Expire Date</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-0 px-3">
                                                        <Datepicker
                                                            portalId="root-portal"
                                                            name='ExpireDate'
                                                            selected={ExpireDate}
                                                            className="form-control border-0 fw-bolder p-0 py-2 m-0"
                                                            dateFormat="dd MMM yyyy"
                                                            onChange={e => setFormData({ ...formData, "ExpireDate": e })}
                                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                                            locale={locales[locale]}
                                                            placeholderText="Expire Date"
                                                            autosuggest="off"
                                                        />
                                                        {Error.ExpireDate ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ExpireDate}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                            </Fragment>
                                            : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Full Name</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Full Name'
                                                name='Name'
                                                value={Name === "" ? data.DetailID.Name : Name}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                minLength='100'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.Name ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Name}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-0" scope="row">Age</td>
                                        <td className="py-0 px-1 text-center">:</td>
                                        <th className="pl-3 py-1 my-auto">{CalculateAge()}</th>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Govt. Id No</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='number'
                                                placeholder='Govt. Id No'
                                                name='GovtID'
                                                value={GovtID === "" ? data.DetailID.GovtID : GovtID}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='20'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.GovtID ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GovtID}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Father/Husband Name</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Father Name'
                                                name='FatherName'
                                                value={FatherName === "" ? data.DetailID.FatherName : FatherName}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='100'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.FatherName ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FatherName}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Mother Name</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Mother Name'
                                                name='MotherName'
                                                value={MotherName === "" ? data.DetailID.MotherName : MotherName}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='100'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.MotherName ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MotherName}</small></p>
                                            </td>
                                        </tr> : null
                                    }

                                    <tr>
                                        <td className="py-2" scope="row">Religion</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <Select className="p-0"
                                                borderRadius={'0px'}
                                                options={[{ label: "Islam", value: 1 }, { label: "Christians", value: 2 }, { label: "Hindus", value: 3 }, { label: "Buddhists", value: 4 }, { label: "Others", value: 5 }]}
                                                name='Religion'
                                                placeholder={"Please select religion"}
                                                styles={colourStyles}
                                                value={Religion === "" ? { value: data.DetailID.Religion, label: data.DetailID.Religion } : Religion}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => setFormData({
                                                    ...formData, "Religion": Religion === "" ? data.DetailID.Religion : e
                                                })}
                                            />
                                        </th>
                                    </tr>
                                    {Error.Religion ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Religion}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Gender</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <Select
                                                borderRadius={'0px'}
                                                options={[{ label: "Male", value: 1 }, { label: "Female", value: 2 }, { label: "Others", value: 3 }]}
                                                name='Gender'
                                                placeholder={"Please select gender"}
                                                styles={colourStyles}
                                                value={Gender === "" ? { value: data.DetailID.Gender, label: data.DetailID.Gender } : Gender}
                                                onChange={e => setFormData({
                                                    ...formData, "Gender": Gender === "" ? data.DetailID.Gender : e
                                                })}
                                            />
                                        </th>
                                    </tr>
                                    {Error.Gender ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Gender}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Maritial Status</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <Select
                                                borderRadius={'0px'}
                                                options={[{ label: "Married", value: 0 }, { label: "Unmarried", value: 1 }]}
                                                name='MaritalStatus'
                                                placeholder={"Please select gender"}
                                                styles={colourStyles}
                                                value={MaritalStatus === "" ? { value: data.DetailID.MaritalStatus, label: data.DetailID.MaritalStatus } : MaritalStatus}
                                                onChange={e => setFormData({
                                                    ...formData, "MaritalStatus": MaritalStatus === "" ? data.DetailID.MaritalStatus : e
                                                })}
                                            />
                                        </th>
                                    </tr>
                                    {Error.MaritalStatus ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MaritalStatus}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Educational Qualification</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Educational Qualification'
                                                name='Education'
                                                value={Education === "" ? data.DetailID.Education : Education}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='500'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.Education ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Education}</small></p>
                                            </td>
                                        </tr> : null
                                    }

                                    <tr>
                                        <td className="py-2" scope="row">Language</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <Select
                                                closeMenuOnSelect={false}
                                                isMulti
                                                styles={colourStyles}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                options={[{ label: "Bangla", value: 0 }, { label: "English", value: 1 }, { label: "Tok Pisin", value: 2 }, { label: "Hiri Motu", value: 3 }]}
                                                value={Language === "" ? { value: data.DetailID.Language.value, label: data.DetailID.Language.label } : Language}
                                                onChange={e => setFormData({
                                                    ...formData, "Language": Language === "" ? data.DetailID.Language : e
                                                })}
                                            />
                                        </th>
                                    </tr>
                                    {Error.Language ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Language}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Present Address</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Mother Name'
                                                name='PresentAddress'
                                                value={PresentAddress === "" ? data.DetailID.PresentAddress : PresentAddress}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='100'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.PresentAddress ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PresentAddress}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                    <tr>
                                        <td className="py-2" scope="row">Permanent Address</td>
                                        <td className="py-2 px-1 text-center">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Mother Name'
                                                name='PermanentAddress'
                                                value={PermanentAddress === "" ? data.DetailID.PermanentAddress : PermanentAddress}
                                                onFocus={e => handleFocus(e)}
                                                onChange={e => onChange(e)}
                                                maxLength='100'
                                                required
                                            />
                                        </th>
                                    </tr>
                                    {Error.PermanentAddress ?
                                        <tr>
                                            <td colspan="3" className='p-0'>
                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PermanentAddress}</small></p>
                                            </td>
                                        </tr> : null
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="col-sm-12">
                        <div className="d-flex border">
                            <hr className="my-auto flex-grow-1" />
                            <div className="px-4 pt-2"><h3 className='text-bold'>Accessability & Collocation</h3></div>
                            <hr className="my-auto flex-grow-1" />
                        </div>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="border py-2 m-2" scope="row"><label className='fw-bolder m-0'>User Access</label></td>
                                    <td className="border py-2 m-2" scope="row"><label className='fw-bolder m-0'>Collocation</label></td>
                                </tr>
                                <tr>
                                    <td className="border py-2 m-2">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="Block"
                                                name="is_block"
                                                checked={is_block}
                                                onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_block ? true : false }) }}
                                            />
                                            <label className="form-check-label" for="Block">Block</label>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="Active"
                                                name="is_active"
                                                checked={is_active}
                                                onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_active ? true : false }) }}
                                            />
                                            <label className="form-check-label" for="Active">Active</label>
                                        </div>
                                    </td>

                                    <td className="border py-2 m-2">
                                        <div className="form-check form-switch p-0">
                                            <Select menuPortalTarget={document.body}
                                                borderRadius={'0px'}
                                                options={ConcernList}
                                                name='Concern'
                                                placeholder={"Select site"}
                                                styles={colourStyles}
                                                value={Concern ? Concern : null}
                                                onChange={e => getSector(e)}
                                            />
                                        </div>
                                        <div className="form-check form-switch p-0 py-2">
                                            <Select menuPortalTarget={document.body}
                                                borderRadius={'0px'}
                                                options={SectorList}
                                                name='sector'
                                                placeholder={"Select sector"}
                                                styles={colourStyles}
                                                value={sector ? sector : null}
                                                onChange={e => LoadDesignation(e)}
                                            />
                                        </div>

                                        <div className="form-check form-switch p-0">
                                            <Select menuPortalTarget={document.body}
                                                borderRadius={'0px'}
                                                options={DesignationList}
                                                name='Designation'
                                                placeholder={"Select designatation"}
                                                styles={colourStyles}
                                                value={Designation ? Designation : null}
                                                onChange={e => setFormData({ ...formData, "Designation": e })}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="row">
                            <div className='d-flex justify-content-center align-item-center'>
                                <button className='btn btn-outline-success form-rounded px-4 m-2' title="Delete" type='button' onClick={() => setModalShow(true)}>Delete</button>
                                <button className='btn btn-outline-success form-rounded px-4 m-2' type='button' onClick={e => onSubmit(e)}>Submit</button>
                            </div>
                            <DeleteMessage
                                Name={Name}
                                show={modalShow}
                                Click={(e) => DeleteUser(e)}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                    </div>

                </div>

            </div>

        </div >
    );
}


const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    data: props.location.state.UserData,
    scale: state.auth.scale,
    no: state.auth.no,
});

export default connect(mapStateToProps, {})(UpdateUser);