import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { CreateAccount, FetchConcern, FetchDesignation, FetchSisterSector, ReligionList } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import avatar from '../../assets/avatar.jpg';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import { customHeader, locales } from "../../hocs/Class/datepicker";

const Register = ({ data, list, setList, scale, sub_scale }) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const [Error, setError] = useState({});

    const [modalShow, setModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [ConcernList, setConcernList] = useState(initialValue);
    const [SectorList, setSectorList] = useState(initialValue);
    const [DesignationList, setDesignationList] = useState(initialValue);
    const [locale, setLocale] = useState('en');
    const [Step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        UserName: '',
        FirstName: '',
        LastName: '',
        DOB: '',
        MobileNo: '',
        UserMail: '',
        pass: '',
        con_pass: '',

        Nationality: '',
        PassportNo: '',
        IssueDate: '',
        ExpireDate: '',
        FullName: '',
        GovtID: '',
        FatherName: '',
        MotherName: '',
        Religion: '',
        Gender: '',
        MaritalStatus: '',
        Education: '',
        Language: '',
        PresentAddress: '',
        PermanentAddress: '',
        is_block: false,
        is_active: false,

        Concern: '',
        Sector: '',
        Designation: '',


        Image: '',
        ImagePrv: '',
    });

    let toastProperties = null;
    const { UserName, FirstName, LastName, DOB, MobileNo, UserMail, pass, con_pass, Nationality, PassportNo, IssueDate, ExpireDate, FullName, GovtID, FatherName, MotherName, Religion, Gender, MaritalStatus, Education, Language, PresentAddress, PermanentAddress, is_block, is_active, Concern, Sector, Designation, Image, ImagePrv } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, "FullName": FirstName + " " + LastName });
    const handleFocus = (e) => e.target.select()
    
    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    function validity(e) {
        e.preventDefault();
        if (isStringNullOrWhiteSpace(UserName)) {
            setError({ "username": "Please fill the username." })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Username can not be null",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(FirstName)) {
            setError({ "FirstName": "Please fill the first name." })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "First name can not be null",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(DOB)) {
            setError({ "DOB": "Please select the date of birth" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Date of birth not selected",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Nationality)) {
            setError({ "Nationality": "Please select the nationality" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Nationality is not selected",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (parseInt(Nationality.value) === 1 && isStringNullOrWhiteSpace(PassportNo)) {
            setError({ "PassportNo": "Please input the passport number" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Passport number can not be null for Bangaldeshi nationals",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (parseInt(Nationality.value) === 1 && isStringNullOrWhiteSpace(IssueDate)) {
            setError({ "IssueDate": "Please select the issue date" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Issue date is not selected",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (parseInt(Nationality.value) === 1 && isStringNullOrWhiteSpace(ExpireDate)) {
            setError({ "ExpireDate": "Please select the expire date" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Expire date is not selected",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;


        } else if (isStringNullOrWhiteSpace(GovtID)) {
            setError({ "GovtID": "Please input government card/smart card/national card" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Govt. Id no can not be null",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(FatherName)) {
            setError({ "FatherName": "Please input Father/Husband name" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Father/Husband name can not be null",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(MotherName)) {
            setError({ "MotherName": "Please input mother name" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Mother name can not be null",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Religion)) {
            setError({ "Religion": "Please select religion" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Religion is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Gender)) {
            setError({ "Gender": "Please select gender" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Gender is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(MaritalStatus)) {
            setError({ "MaritalStatus": "Please select marital status" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Marital status is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Language)) {
            setError({ "Language": "Please select language" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Language is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(PresentAddress)) {
            setError({ "PresentAddress": "Please select present address" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Present address can not be null!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Concern)) {
            setError({ "Concern": "Please select sister concern name of collaction" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Sister concern of collaction is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Sector)) {
            setError({ "Sector": "Please select the respective sector" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Sector is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (isStringNullOrWhiteSpace(Designation)) {
            setError({ "Designation": "Please select the designation" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Designation is not selected!",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        }
        else if (pass.length === 0) {
            setError({ "password": "Password is required" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Password is empty",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else if (con_pass.length === 0) {
            setError({ "con_pass": "Confirm password is required" })
            setList([...list, toastProperties = {
                id: 1,
                title: 'Warning',
                description: "Confirm password is empty",
                backgroundColor: '#f0ad4e',
                icon: infoIcon
            }])
            return false;
        } else {
            if (pass.length < 6) {
                setError({ "password": "Min lenght is 6" })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Warning',
                    description: "Password min lenght is 6",
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
                return false;
            } else if (con_pass.length < 6) {
                setError({ "con_pass": "Min lenght is 6" })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Warning',
                    description: "Confirm password min lenght is 6",
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
                return false
            } else if (pass.length > 12) {
                setError({ "password": "Max lenght is 12" })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Warning',
                    description: "Password max lenght is 12",
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
                return false
            } else if (con_pass.length > 12) {
                setError({ "con_pass": "Max lenght is 12" })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Warning',
                    description: "Confirm password max lenght is 12",
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
                return false
            } else if (pass !== con_pass) {
                setError({ "password": "Password did not matched", "con_pass": "Password did not matched" })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Warning',
                    description: "Password & Confirm password did not matched",
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
                return false
            } else {
                return true
            }
        }
    }

    const onSubmit = async e => {
        if (await validity(e)) {
            setError({})
            e.preventDefault();
            const result = await CreateAccount(UserName, FirstName, LastName, moment(DOB).format("YYYY-MM-DD"), MobileNo, UserMail, pass, con_pass, Nationality, PassportNo, moment(IssueDate).format("YYYY-MM-DD"), moment(ExpireDate).format("YYYY-MM-DD"), FullName, GovtID, FatherName, MotherName, Religion, Gender, MaritalStatus, Education, Language, PresentAddress, PermanentAddress, is_block, is_active, Concern, Sector, Designation, Image, ImagePrv);
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
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save user profile. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
            dispatch({
                type: DISPLAY_OVERLAY,
                payload: false
            });
        } else {
        }
    };

    useEffect(() => {
        LoadConcern();
    }, [])

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
        setFormData({ ...formData, "Sector": e })
        var result = await FetchDesignation();
        if (result !== true) {
            setDesignationList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

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
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setFormData({ ...formData, "Image": file, "ImagePrv": reader.result })
        }
        reader.readAsDataURL(file)
    }

    const ImageRemove = () => {
        setFormData({ ...formData, "ImagePrv": '' })
    }

    // const UploadImage = async e => {
    //     

    //     e.preventDefault();
    //     const result = await UpdateImage(id, Image);
    //     
    // };

    // const DeleteUser = async e => {
    //     e.preventDefault();
    //     // const result = await RemoveUser(id);
    //     

    //     history.goBack();
    //     setModalShow(false)
    // };


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
            <div className="header mb-4">
                <p className="display-6 mx-auto d-table m-0">
                    Register New User
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/Register">Add new user</Link></li>
                    </ol>
                </nav>
            </div>
            <div className="row h-100 w-100">
                <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">

                    <div id="smartwizard-default-light" className="wizard wizard-success mb-4 sw sw-theme-default sw-justified shadow-none">
                        <ul className="nav fs-4">
                            <li className="nav-item">
                                <a className={Step === 1 ? "nav-link inactive active" : "nav-link inactive done"} onClick={() => setStep(1)}>General Info</a>
                            </li>
                            <li className="nav-item">
                                <a className={Step === 2 ? "nav-link inactive active" : "nav-link inactive done"} onClick={() => setStep(2)}>Personal Info</a>
                            </li>
                            <li className="nav-item">
                                <a className={Step === 3 ? "nav-link inactive active" : "nav-link inactive done"} onClick={() => setStep(3)}>Location & Accessability</a>
                            </li>
                        </ul>

                        <div className="tab-content" style={{ height: "auto" }}>
                            <div className="tab-pane" role="tabpanel" style={Step === 1 ? { display: "block" } : { display: "none" }}>
                                <div className="row justify-content-center m-0 p-0">
                                    <div className="col-lg-3 h-100 m-0 p-2">
                                        <div className='d-flex justify-content-center'>
                                            <div className="img_container border" style={{ width: "270px", height: "350px" }}>
                                                <p className='mx-auto d-table border-bottom w-100 mb-2 text-center'>User Picture</p>
                                                <img src={ImagePrv ? ImagePrv : avatar} className="image img-fluid rounded-square mx-auto d-table" alt="avatar" />

                                                <div className="middle">
                                                    <input
                                                        type="file"
                                                        id="img"
                                                        className="d-none"
                                                        accept="image/*"
                                                        onChange={(e) => ImageChange(e)}
                                                    />
                                                    <label
                                                        className='btn btn-outline-success shadow-lg m-1'
                                                        for="img"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Choose Image"
                                                    >
                                                        <i class="fad fa-images"></i>
                                                    </label>
                                                    {ImagePrv ?
                                                        <Fragment>
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

                                    <div className="col-lg-8 ml-3 my-auto">
                                        <table className="table table-hover table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td className="py-2">Username</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='text'
                                                            placeholder='Username'
                                                            name='UserName'
                                                            value={UserName}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='50'
                                                            required
                                                        />
                                                        {Error.UserName ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UserName}</small></p>
                                                            : null}
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
                                                            value={FirstName}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='50'
                                                            required
                                                        />
                                                        {Error.FirstName ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FirstName}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>

                                                <tr>
                                                    <td className="py-2" scope="row">Last Name</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='text'
                                                            placeholder='Last Name'
                                                            name='LastName'
                                                            value={LastName}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='50'
                                                            required
                                                        />
                                                        {Error.LastName ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.LastName}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Date of Birth</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-0 px-3">
                                                        <Datepicker
                                                            portalId="root-portal"
                                                            name='DOB'
                                                            selected={DOB}
                                                            className="form-control border-0 fw-bolder p-0 py-2 m-0"
                                                            dateFormat="dd MMM yyyy"
                                                            onChange={e => setFormData({ ...formData, "DOB": e })}
                                                            renderCustomHeader={props => customHeader({ ...props, locale })}
                                                            locale={locales[locale]}
                                                            placeholderText="Date of Birth"
                                                            autosuggest="off"
                                                        />
                                                        {Error.DOB ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.DOB}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Mobile No</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='number'
                                                            placeholder='Mobile No'
                                                            name='MobileNo'
                                                            value={MobileNo}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='11'
                                                            required
                                                        />
                                                        {Error.MobileNo ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MobileNo}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Email</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='email'
                                                            placeholder='Email'
                                                            name='UserMail'
                                                            id='UserMail'
                                                            value={UserMail}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            maxLength='50'
                                                        />
                                                        {Error.email ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.email}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Password</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='password'
                                                            placeholder='Password'
                                                            name='pass'
                                                            value={pass}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            minLength={6}
                                                            maxLength={12}
                                                            required
                                                        />
                                                        {Error.password ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.password}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className="py-2" scope="row">Confirm Password</td>
                                                    <td className="py-2 px-1 text-center">:</td>
                                                    <th className="py-2">
                                                        <input
                                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                            type='password'
                                                            placeholder='Confirm Password'
                                                            name='con_pass'
                                                            value={con_pass}
                                                            onFocus={e => handleFocus(e)}
                                                            onChange={e => onChange(e)}
                                                            minLength='6'
                                                            maxLength='12'
                                                            required
                                                        />
                                                        {Error.con_pass ?
                                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.con_pass}</small></p>
                                                            : null}
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>

                            </div>
                            <div className="tab-pane" role="tabpanel" style={Step === 2 ? { display: "block" } : { display: "none" }}>
                                <table className="table table-hover table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="py-2" scope="row">Nationality</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    borderRadius={'0px'}
                                                    options={[{ label: 'Bangladeshi', value: 1 }, { label: 'Papuans', value: 2 }]}
                                                    name='Nationality'
                                                    placeholder={"Please select nationality"}
                                                    styles={colourStyles}
                                                    value={Nationality ? { value: Nationality.value, label: Nationality.label } : null}
                                                    onChange={e => setFormData({ ...formData, "Nationality": e })}
                                                />
                                                {Error.Nationality ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Nationality}</small></p>
                                                    : null}
                                            </th>
                                        </tr>


                                        {parseInt(Nationality.value) === 1 ?
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
                                                    name='FullName'
                                                    value={FullName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    minLength='100'
                                                    required
                                                />
                                                {Error.FullName ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FullName}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
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
                                                    placeholder='Government Id No'
                                                    name='GovtID'
                                                    value={GovtID}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='20'
                                                    required
                                                />
                                                {Error.GovtID ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.GovtID}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Father/Husband Name</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Father/Husband Name'
                                                    name='FatherName'
                                                    value={FatherName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='100'
                                                    required
                                                />
                                                {Error.FatherName ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FatherName}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Mother Name</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Mother Name'
                                                    name='MotherName'
                                                    value={MotherName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='100'
                                                    required
                                                />
                                                {Error.MotherName ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MotherName}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Religion</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <Select menuPortalTarget={document.body} className="p-0"
                                                    borderRadius={'0px'}
                                                    options={ReligionList}
                                                    name='Religion'
                                                    placeholder={"Please select religion"}
                                                    styles={colourStyles}
                                                    value={Religion ? { value: Religion, label: Religion } : null}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => setFormData({
                                                        ...formData, "Religion": e.label
                                                    })}
                                                />
                                                {Error.Religion ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Religion}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Gender</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <Select menuPortalTarget={document.body}
                                                    borderRadius={'0px'}
                                                    options={[{ label: "Male", value: 1 }, { label: "Female", value: 2 }, { label: "Others", value: 3 }]}
                                                    name='Gender'
                                                    placeholder={"Please select gender"}
                                                    styles={colourStyles}
                                                    value={Gender ? { value: Gender, label: Gender } : null}
                                                    onChange={e => setFormData({
                                                        ...formData, "Gender": e.label
                                                    })}
                                                />
                                                {Error.Gender ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Gender}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Marital Status</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    borderRadius={'0px'}
                                                    options={[{ label: "Married", value: 0 }, { label: "Unmarried", value: 1 }]}
                                                    name='MaritalStatus'
                                                    placeholder={"Please select maritial status"}
                                                    styles={colourStyles}
                                                    value={MaritalStatus ? { value: MaritalStatus.value, label: MaritalStatus.label } : null}
                                                    onChange={e => setFormData({
                                                        ...formData, "MaritalStatus": e
                                                    })}
                                                />
                                                {Error.MaritalStatus ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MaritalStatus}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Educational Qualification</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Educational Qualification'
                                                    name='Education'
                                                    value={Education}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='500'
                                                    required
                                                />
                                                {Error.Education ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Education}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Language</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    borderRadius={'0px'}
                                                    options={[{ label: "Bangla", value: 0 }, { label: "English", value: 1 }, { label: "Tok Pisin", value: 2 }, { label: "Hiri Motu", value: 3 }]}
                                                    name='Language'
                                                    placeholder={"Please select language"}
                                                    styles={colourStyles}
                                                    value={Language}
                                                    onChange={e => setFormData({
                                                        ...formData, "Language": e
                                                    })}
                                                />
                                                {Error.Language ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Language}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                            <div className="tab-pane" role="tabpanel" style={Step === 3 ? { display: "block" } : { display: "none" }}>
                                <table className="table table-hover table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="py-2" scope="row">Present Address</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Present Address'
                                                    name='PresentAddress'
                                                    value={PresentAddress}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='200'
                                                    required
                                                />
                                                {Error.PresentAddress ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PresentAddress}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className="py-2" scope="row">Permanent Address</td>
                                            <td className="py-2 px-1 text-center">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Permanent Address'
                                                    name='PermanentAddress'
                                                    value={PermanentAddress}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='200'
                                                    required
                                                />
                                                {Error.PermanentAddress ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PermanentAddress}</small></p>
                                                    : null}
                                            </th>
                                        </tr>

                                    </tbody>
                                </table>
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
                                                        id="Active"
                                                        name="is_active"
                                                        checked={is_active}
                                                        onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_active ? true : false }) }}
                                                    />
                                                    <label className="form-check-label" for="Active">Active</label>
                                                </div>
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
                                            </td>


                                            <td className="border py-2 m-2">
                                                <div className="form-check form-switch p-0">
                                                    <Select menuPortalTarget={document.body}
                                                        borderRadius={'0px'}
                                                        options={ConcernList}
                                                        name='Concern'
                                                        placeholder={"Select site"}
                                                        styles={colourStyles}
                                                        value={Concern ? { value: Concern.value, label: Concern.label } : null}
                                                        onChange={e => getSector(e)}
                                                    />
                                                </div>
                                                <div className="form-check form-switch p-0 py-2">
                                                    <Select menuPortalTarget={document.body}
                                                        borderRadius={'0px'}
                                                        options={SectorList}
                                                        name='Sector'
                                                        placeholder={"Select sector"}
                                                        styles={colourStyles}
                                                        value={Sector ? { value: Sector.value, label: Sector.label } : null}
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
                                                        value={Designation ? { value: Designation.value, label: Designation.label } : null}
                                                        onChange={e => setFormData({ ...formData, "Designation": e })}
                                                    />
                                                </div>
                                            </td>


                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>
                        <div className="p-2" role="toolbar" style={{ textAlign: "center" }}>
                            {Step === 1 ? null : <button className="btn btn-outline-success m-2" type="button" onClick={() => setStep(Step === 1 ? 1 : Step - 1)}><span aria-hidden="true">&larr;</span>{" Previous"}</button>}

                            {Step === 3 ?
                                <button className="btn btn-outline-success m-2" type="button" onClick={(e) => onSubmit(e)}>{"Submit"}</button>
                                :
                                <button className="btn btn-outline-success m-2" type="button" onClick={() => setStep(Step === 3 ? 3 : Step + 1)}>{"Next"} <span aria-hidden="true">&rarr;</span></button>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

};
const mapStateToProps = state => ({
    data: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { logout })(Register);