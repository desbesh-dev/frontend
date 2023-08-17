import * as moment from 'moment'

import { ApproveData, BankUpdate, Designation, LoadBanks, LoadProfile, RemoveBank, SaveBank, UpdateImage, getBranch } from '../../../actions/APIHandler';
import { FaCodeBranch, FaUserTie } from "react-icons/fa";
import React, { Fragment, useEffect, useState } from 'react';
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Link, Redirect, useHistory } from 'react-router-dom';
import { LoadDivision, getUnion, getUpazila, getZila } from '../../../actions/GeoAPI';
import { checkToken, logout } from '../../../actions/auth';
import { connect, useDispatch } from 'react-redux';

import { CreateMessage } from "../../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

export const EmployeeProfile = (UserID, display, user, list, setList) => {

    const CompanyID = user.CompanyID;
    const BranchID = user.BranchID;
    const BranchName = user.BranchName;
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [BranchLists, setBranchLists] = useState(initialValue)
    const [Data, setData] = useState(false)
    const [TempData, setTempData] = useState(false)
    const [View, setView] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [DivisionLists, setDivisionLists] = useState(initialValue);
    const [ZilaLists, setZilaLists] = useState(initialValue);
    const [UpazilaLists, setUpazilaLists] = useState(initialValue);
    const [ZilaCode, setZilaCode] = useState(null);
    const [UnionLists, setUnionLists] = useState(initialValue);
    const [RefLists, setRefLists] = useState(initialValue);
    const [RepLists, setRepLists] = useState(initialValue);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        Name: "",
        Domain: "",
        Established: "",
        BusinessEmail: "",
        ContactNo: "",
        LogoPrv: "",
        Logo: "",

        BranchID: "",
        BranchName: "",
        BranchEmail: "",
        VillageName: "",
        Union: "",
        Upazila: "",
        Zila: "",
        Division: "",
        UserType: "",
        id: "",
        FirstName: "",
        LastName: "",
        email: "",
        MobileNo: "",
        password: "",
        con_pass: "",
        FullName: "",
        Nid_BirthNo: "",
        DOB: "",
        FatherName: "",
        MotherName: "",
        Nationality: "",
        Religion: "",
        Gender: "",
        Occupation: "",
        EducationalQualification: "",
        Image: "",
        ImagePrv: "",

        RefID: "",
        RefName: "",
        RepID: "",
        RepName: "",
        RoleName: "",
        NIDCopy: false,
        Agreement: false,
        BankCheque: false,
        TradeLicence: false,
        FarmRegCopy: false,
        is_block: false,
        is_active: false,
        is_ceo: false,
        is_subscriber: null,
        is_staff: null,
        is_admin: null,


        AccName: false,
        AccNumber: false,
        BankName: "",
        BankBranchName: "",
        Address: "",
        Telephone: "",
        BankID: "",
    });

    useEffect(() => {
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        FetchUser(UserID);
        getDivision();
        LoadRef();
        LoadRep()
    }, [])

    const {
        id,
        ContactNo,
        FirstName,
        LastName,
        email,
        MobileNo,
        password,
        con_pass,
        UserType,
        FullName,
        Nid_BirthNo,
        DOB,
        FatherName,
        MotherName,
        HoldingNo,
        WardNo,
        VillageName,
        Union,
        PostalCode,
        Upazila,
        Zila,
        Division,
        Nationality,
        Religion,
        Gender,
        Occupation,
        EducationalQualification,
        Image,
        RefID,
        RefName,
        RepID,
        RepName,
        RoleName,
        NIDCopy,
        Agreement,
        BankCheque,
        TradeLicence,
        FarmRegCopy,
        is_block,
        is_active,
        is_ceo,
        ImagePrv,
        is_subscriber,
        is_staff,
        is_admin,

        AccName,
        AccNumber,
        BankName,
        BankBranchName,
        Address,
        Telephone,
        BankID
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, "FullName": FirstName + " " + LastName });
    const onBlur = (e) => {

        if (e.target.value === "") {
            setFormData({
                ...formData,
                [e.target.name]: TempData,
                FullName: FirstName + " " + LastName,
            });
        }
    }

    const handleFocus = (e) => {
        setTempData(e.target.value)
        e.target.select()
    };
    const StaffTrigger = (e) => {
        setFormData({ ...formData, "RoleName": "", "UserType": 0, [e.target.name]: !is_staff ? true : false });
    }

    const getDivision = async () => {
        const DList = await LoadDivision()
        setDivisionLists(DList)
    }

    const LoadZila = async (e) => {
        setFormData({ ...formData, "Division": e.label });
        const ZList = await getZila(e)
        setZilaLists(ZList);
    }

    const LoadUpazila = async (e) => {
        setFormData({ ...formData, "Zila": e.label });
        setZilaCode(e.value)
        const UList = await getUpazila(e)
        setUpazilaLists(UList);
    }

    const LoadUnion = async (e) => {
        setFormData({ ...formData, "Upazila": e.label });
        const UNList = await getUnion(e, ZilaCode)
        setUnionLists(UNList);
    }

    const history = useHistory();
    const FetchUser = async (UserID) => {
        var User_Data = await LoadProfile(UserID);
        if (User_Data !== true) {

            setData(User_Data);
            setFormData({
                id: User_Data.UserInfo.id,
                FirstName: User_Data.UserInfo.FirstName,
                LastName: User_Data.UserInfo.LastName,
                email: User_Data.UserInfo.email,
                MobileNo: User_Data.UserInfo.MobileNo,
                UserType: User_Data.UserInfo.UserType,
                is_subscriber: User_Data.UserInfo.is_subscriber,
                is_staff: User_Data.UserInfo.is_staff,
                is_admin: User_Data.UserInfo.is_admin,
                is_block: User_Data.UserInfo.is_block,
                is_active: User_Data.UserInfo.is_active,

                FullName: User_Data.Details.FullName,
                Nid_BirthNo: User_Data.Details.Nid_BirthNo,
                DOB: User_Data.Details.DOB,
                FatherName: User_Data.Details.FatherName,
                MotherName: User_Data.Details.MotherName,
                HoldingNo: User_Data.Details.HoldingNo,
                WardNo: User_Data.Details.WardNo,
                VillageName: User_Data.Details.VillageName,
                Union: User_Data.Details.Union,
                PostalCode: User_Data.Details.PostalCode,
                Upazila: User_Data.Details.Upazila,
                Zila: User_Data.Details.Zila,
                Division: User_Data.Details.Division,
                ContactNo: User_Data.Details.ContactNo,
                Nationality: User_Data.Details.Nationality,
                Religion: User_Data.Details.Religion,
                Gender: User_Data.Details.Gender,
                Occupation: User_Data.Details.Occupation,
                EducationalQualification: User_Data.Details.EducationalQualification,
                Image: User_Data.Details.Image,
                ImagePrv: "",
                RefID: User_Data.Ref ? User_Data.Ref.RefID : "",
                RefName: User_Data.Ref ? User_Data.Ref.RefName : "",
                RepID: User_Data.Ref ? User_Data.Ref.RepID : "",
                RepName: User_Data.Ref ? User_Data.Ref.RepName : "",
                NIDCopy: User_Data.Ref ? User_Data.Ref.NIDCopy : "",
                Agreement: User_Data.Ref ? User_Data.Ref.Agreement : "",
                BankCheque: User_Data.Ref ? User_Data.Ref.BankCheque : "",
                FarmRegCopy: User_Data.Ref ? User_Data.Ref.FarmRegCopy : "",

                AccName: User_Data.Bank ? User_Data.Bank.AccName : "",
                AccNumber: User_Data.Bank ? User_Data.Bank.AccNumber : "",
                BankName: User_Data.Bank ? User_Data.Bank.BankName : "",
                BankBranchName: User_Data.Bank ? User_Data.Bank.BranchName : "",
                Address: User_Data.Bank ? User_Data.Bank.Address : "",
                Telephone: User_Data.Bank ? User_Data.Bank.Telephone : "",
                BankID: User_Data.Bank ? User_Data.Bank.BankID : "",
            });

        } else {

        }


        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });

        // history.push('/pending_user', { UserData: User_Data });
    }

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


    const getStaffLabel = (value, arr) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                return arr[i].label;
            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    const ImageChange = (e) => {
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFormData({ ...formData, "Image": file, "ImagePrv": reader.result })
        }

        reader.readAsDataURL(file)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
    }

    const ImageRemove = () => {
        setFormData({ ...formData, "ImagePrv": '' })
    }

    const UploadImage = async e => {


        e.preventDefault();
        const result = await UpdateImage(id, Image);

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

    const LoadRef = async () => {
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ref_lists/`, config);
            setRefLists(res.data.Ref);
        } catch (err) {
        }
    }

    const LoadRefId = async (e) => {
        setFormData({ ...formData, "RefID": e.target.value });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ref_lists/${e.target.value}`, config);
            setFormData({ ...formData, "RefName": res.data[0].FullName, "RefID": e.target.value });
        } catch (err) {
            setFormData({ ...formData, "RefName": "Not Found", "RefID": e.target.value });
        }
    }

    const LoadRep = async () => {
        
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
    }

    const LoadRepId = async (e) => {
        setFormData({ ...formData, "RepID": e.target.value });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ref_lists/${e.target.value}`, config);
            setFormData({ ...formData, "RepName": res.data[0].FullName, "RepID": e.target.value });
        } catch (err) {
            setFormData({ ...formData, "RepName": "Not Found", "RepID": e.target.value });
        }
    }

    const getBanks = async () => {
        const BList = await LoadBanks()
        setBankLists(BList)
    }

    const LoadBankBranch = async (e) => {
        setFormData({
            ...formData, "BankName": e.label, "BankBranchName": "", "Address": "", "Telephone": ""
        })
        const BBList = await getBranch(e.label)
        setBBLists(BBList)
    }

    const HandleBank = () => {
        if (!Data || !Data.Bank) {
            setFormData({
                ...formData,
                AccName: false,
                AccNumber: false,
                BanckName: "",
                BankBranchName: "",
                Address: "",
                Telephone: "",
                BankID: "",
            })
        }

        getBanks();
        setTempData(null);
        setError([]);
        setStep(Step === "BankAcc" ? null : "BankAcc");
    }

    const BankBranchHandler = (e) => {
        setFormData({
            ...formData,
            "BankBranchName": e.label,
            "BankID": e.value,
            "Address": e.Address,
            "Telephone": e.Telephone,
        })
    }

    const AddBank = async (e) => {
        setError({})
        setCreateModalShow(false)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await SaveBank(UserID, AccName, AccNumber, BankID);
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
                    title: 'Invalid Data!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to add new bank account info. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const UpdateBank = async (e) => {
        const UserBankID = Data.Bank.BankID

        setError({})
        setUpdateModalShow(false)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await BankUpdate(CompanyID, BranchID, UserID, AccName, AccNumber, BankID, UserBankID);
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
                    title: 'Invalid Data!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to update bank account info. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DeleteBank = async e => {
        setDeleteModalShow(false)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await RemoveBank(BankID);

        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Bank Account',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setFormData({
                    ...formData,
                    "AccName": "",
                    "AccNumber": "",
                    "BankName": "",
                    "BankBranchName": "",
                    "BankID": "",
                    "Address": "",
                    "Telephone": "",
                })
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to remove bank account info. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
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
        <div className="position-relative" style={{ height: "90%" }}>
            <div className="position-absolute overflow-auto mb-5 pb-5 w-100 h-75">

                <p className='display-6 d-flex justify-content-center mb-4'>Profile Details</p>
                <div className="row m-0 w-100 mx-auto d-table h-100">
                    <div className="col-sm-12 col-md-6 col-lg-6 mx-auto d-table h-100">
                        <div className="accordion accordion-flush" id="accordionFlushExample">

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "AccountInfo" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "AccountInfo" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="AccountInfo" onClick={() => setStep(Step === "AccountInfo" ? null : "AccountInfo")}>
                                        Account Info
                                    </button>
                                </p>
                                <div id="AccountInfo" className={`accordion-collapse collapse ${Step === "AccountInfo" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">

                                            <table className="table table-hover table-borderless">
                                                <tbody className='w-100'>
                                                    <tr>
                                                        <td className="py-2" scope="row">Id</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2 d-flex">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='Id'
                                                                name='Id'
                                                                value={id}
                                                                onChange={e => onChange(e)}
                                                                minLength='6'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2">First Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='First Name'
                                                                name='FirstName'
                                                                value={FirstName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Last Name'
                                                                name='LastName'
                                                                value={LastName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='date'
                                                                placeholder='Date of Birth'
                                                                name='DOB'
                                                                value={DOB}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='Mobile No'
                                                                name='MobileNo'
                                                                value={MobileNo}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='email'
                                                                placeholder='Email'
                                                                name='email'
                                                                value={email}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                </tbody>

                                            </table>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "LocDetails" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "LocDetails" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="LocDetails" onClick={() => setStep(Step === "LocDetails" ? null : "LocDetails")}>
                                        Location Details
                                    </button>
                                </p>
                                <div id="LocDetails" className={`accordion-collapse collapse ${Step === "LocDetails" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">

                                            <table className="table table-hover table-borderless">
                                                <tbody>
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
                                                                value={Division === "" ? { value: null, label: null } : { value: Division, label: Division }}
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
                                                                value={Zila === "" ? { value: null, label: null } : { value: Zila, label: Zila }}
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
                                                                value={Upazila === "" ? { value: null, label: null } : { value: Upazila, label: Upazila }}
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
                                                                value={Union === "" ? { value: null, label: null } : { value: Union, label: Union }}
                                                                onChange={e => setFormData({
                                                                    ...formData, "Union": Union === "" ? null : e.label
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
                                                                value={VillageName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                    <tr>
                                                        <td className="py-2" scope="row">Ward No</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Ward No'
                                                                name='WardNo'
                                                                value={WardNo}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='2'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.WardNo ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.WardNo}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2" scope="row">Holding No</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='Holding No'
                                                                name='HoldingNo'
                                                                value={HoldingNo}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                minLength='6'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.HoldingNo ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.HoldingNo}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2" scope="row">Postal Code</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='Postal Code'
                                                                name='PostalCode'
                                                                value={PostalCode}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='11'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.PostalCode ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PostalCode}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                </tbody>
                                            </table>

                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "PersonalInfo" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "PersonalInfo" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="PersonalInfo" onClick={() => setStep(Step === "PersonalInfo" ? null : "PersonalInfo")}>
                                        Personal Info
                                    </button>
                                </p>
                                <div id="PersonalInfo" className={`accordion-collapse collapse ${Step === "PersonalInfo" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">

                                            <table className="table table-hover table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-2" scope="row">Full Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Full Name'
                                                                name='FullName'
                                                                value={FullName === "" ? null : FullName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                minLength='100'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.FullName ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FullName}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-0" scope="row">Age</td>
                                                        <td className="py-0">:</td>
                                                        <th className="pl-3 py-0">{CalculateAge()}</th>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2">NID/Birth No</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='Nid/Birth No'
                                                                name='Nid_BirthNo'
                                                                value={Nid_BirthNo === "" ? null : Nid_BirthNo}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='20'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.Nid_BirthNo ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Nid_BirthNo}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2" scope="row">Father Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Father Name'
                                                                name='FatherName'
                                                                value={FatherName === "" ? null : FatherName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Mother Name'
                                                                name='MotherName'
                                                                value={MotherName === "" ? null : MotherName}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2" scope="row">Nationality</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={[{ label: 'Bangladeshi' }]}
                                                                name='Nationality'
                                                                placeholder={"Please select nationality"}
                                                                styles={colourStyles}
                                                                value={Nationality === "" ? { value: null, label: null } : { value: Nationality, label: Nationality }}
                                                                onChange={e => setFormData({
                                                                    ...formData, "Nationality": Nationality === "" ? null : e.label
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
                                                    <tr>
                                                        <td className="py-2" scope="row">Religion</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select className="p-0"
                                                                borderRadius={'0px'}
                                                                options={[{ label: "Islam", value: 1 }, { label: "Christians", value: 2 }, { label: "Hindus", value: 3 }, { label: "Buddhists", value: 4 }, { label: "Others", value: 5 }]}
                                                                name='Religion'
                                                                placeholder={"Please select religion"}
                                                                styles={colourStyles}
                                                                value={Religion === "" ? { value: null, label: null } : { value: Religion, label: Religion }}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => setFormData({
                                                                    ...formData, "Religion": Religion === "" ? null : e.label
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
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={[{ label: "Male", value: 1 }, { label: "Female", value: 2 }, { label: "Others", value: 3 }]}
                                                                name='Gender'
                                                                placeholder={"Please select gender"}
                                                                styles={colourStyles}
                                                                value={Gender === "" ? { value: null, label: null } : { value: Gender, label: Gender }}
                                                                onChange={e => setFormData({
                                                                    ...formData, "Gender": Gender === "" ? null : e.label
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
                                                        <td className="py-2" scope="row">Occupation</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Occupation'
                                                                name='Occupation'
                                                                value={Occupation}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='200'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.Occupation ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Occupation}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2" scope="row">Educational Qualification</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Educational Qualification'
                                                                name='EducationalQualification'
                                                                value={EducationalQualification}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='500'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.EducationalQualification ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.EducationalQualification}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                </tbody>
                                            </table>

                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "RefAcs" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "RefAcs" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="RefAcs" onClick={() => setStep(Step === "RefAcs" ? null : "RefAcs")}>
                                        Reference & Accessabily
                                    </button>
                                </p>
                                <div id="RefAcs" className={`accordion-collapse collapse ${Step === "RefAcs" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">
                                            <label className='fw-bolder m-0'> Reference</label>
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="border py-2 m-2 w-50" scope="row">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={RefLists}
                                                                name='RefName'
                                                                placeholder={"Select referral name"}
                                                                styles={colourStyles}
                                                                value={!RefName ? null : { label: RefName }}
                                                                onChange={e => setFormData({ ...formData, "RefName": e.label, "RefID": e.value })}
                                                            />
                                                        </td>
                                                        <td className="border py-2 m-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Reference Id'
                                                                name='RefID'
                                                                value={RefID}
                                                                // onFocus={e => ClearRef()}
                                                                onChange={e => LoadRefId(e)}
                                                                minLength='10'
                                                                required
                                                            />
                                                        </td>
                                                    </tr>
                                                    {Error.RefID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>Please select referral name</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                </tbody>
                                            </table>

                                            <label className='fw-bolder m-0'>Representative</label>
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="border py-2 m-2 w-50" scope="row">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={RepLists}
                                                                name='RepName'
                                                                placeholder={"Select rep. name"}
                                                                styles={colourStyles}
                                                                value={!RepName ? null : { label: RepName }}
                                                                onChange={e => setFormData({ ...formData, "RepName": e.label, "RepID": e.value })}
                                                            />
                                                        </td>
                                                        <td className="border py-2 m-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Rep. ID'
                                                                name='RepID'
                                                                value={RepID}
                                                                // onFocus={e => handleFocus(e)}
                                                                onChange={e => LoadRepId(e)}
                                                                minLength='100'
                                                                required
                                                            />
                                                        </td>
                                                    </tr>
                                                    {Error.RepID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>Please select representative name</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                </tbody>
                                            </table>

                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="border py-2 m-2" scope="row"><label className='fw-bolder m-0'>Hard Copies</label></td>
                                                        <td className="border py-2 m-2" scope="row"><label className='fw-bolder m-0'>User Access</label></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border py-2 m-2" scope="row">
                                                            <div className="form-check">
                                                                <input className="form-check-input"
                                                                    type="checkbox"
                                                                    id="Nid"
                                                                    name="NIDCopy"
                                                                    checked={NIDCopy}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !NIDCopy ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="Nid">
                                                                    National Identity Card
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="Agreement"
                                                                    name="Agreement"
                                                                    checked={Agreement}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !Agreement ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="Agreement">
                                                                    Agreement
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="BankCheque"
                                                                    name="BankCheque"
                                                                    checked={BankCheque}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !BankCheque ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="BankCheque">
                                                                    Blank Cheque
                                                                </label>
                                                            </div>
                                                            <div className="form-check mb-2">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="FarmRegCopy"
                                                                    name="FarmRegCopy"
                                                                    checked={FarmRegCopy}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !FarmRegCopy ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="FarmRegCopy">
                                                                    Farm Registration Copy
                                                                </label>
                                                            </div>
                                                        </td>

                                                        <td className="border py-2 m-2">
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="Block"
                                                                    name="is_block"
                                                                    checked={is_block ? true : false}
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
                                                                    checked={is_active ? true : false}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_active ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="Active">Active</label>
                                                            </div>
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="Staff"
                                                                    name="is_staff"
                                                                    checked={is_staff}
                                                                    onChange={(e) => StaffTrigger(e)}
                                                                />
                                                                <label className="form-check-label" for="Staff">Staff</label>
                                                            </div>
                                                            {is_staff ?
                                                                <div className="form-check form-switch p-0">
                                                                    <Select menuPortalTarget={document.body}
                                                                        borderRadius={'0px'}
                                                                        options={Designation}
                                                                        name='UserType'
                                                                        placeholder={"Select designation"}
                                                                        styles={colourStyles}
                                                                        value={UserType ? { value: UserType, label: getStaffLabel(UserType, Designation) } : null}
                                                                        onChange={e => setFormData({ ...formData, "RoleName": e.label, "UserType": e.value })}
                                                                    />
                                                                </div>
                                                                : null
                                                            }
                                                            {Error.UserType ?
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UserType}</small></p>
                                                                : null}
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="Subscriber"
                                                                    name="is_subscriber"
                                                                    checked={is_subscriber ? true : false}
                                                                    onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_subscriber ? true : false }) }}
                                                                />
                                                                <label className="form-check-label" for="Subscriber">Subscriber</label>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "BankAcc" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "BankAcc" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="BankAcc" onClick={() => HandleBank()}>
                                        Bank Accounts
                                    </button>
                                </p>
                                <div id="BankAcc" className={`accordion-collapse collapse ${Step === "BankAcc" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">
                                            <label className='display-6 fw-bolder m-0 text-center'>{BankName ? BankName : null}</label>
                                            <table className="table table-hover table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-2" scope="row">Account Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Account Name'
                                                                name="AccName"
                                                                value={AccName ? AccName : ""}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                minLength='100'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.AccName ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccName}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2">A/C Number</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='A/C Number'
                                                                name='AccNumber'
                                                                value={AccNumber ? AccNumber : ""}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='20'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.AccNumber ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccNumber}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }

                                                    <tr>
                                                        <td className="py-2">Bank Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={BankLists}
                                                                name='BankName'
                                                                placeholder={"Please select bank name"}
                                                                styles={colourStyles}
                                                                value={{ value: null, label: BankName }}
                                                                onChange={e => LoadBankBranch(e)}
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.BankID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BankID}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }

                                                    <tr>
                                                        <td className="py-2">Branch Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={BBLists}
                                                                name='BankBranchName'
                                                                placeholder={"Please select branch"}
                                                                styles={colourStyles}
                                                                value={{ value: BankID, label: BankBranchName }}
                                                                onChange={e => BankBranchHandler(e)}
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.BankID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BankID}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td colspan="3" className='p-0'>
                                                            <p className="text-muted text-center m-0">{Address ? Address : null}</p>
                                                            <p className="text-muted text-center m-0">{Telephone ? Telephone : null}</p>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>

                                            <div className="flex-1 text-center">
                                                {
                                                    Data ? Data.Bank ? <>
                                                        <button className='btn btn-outline-success form-rounded px-4 m-2' title="Remove bank account" type='button' onClick={() => setDeleteModalShow(true)}
                                                        >Remove</button>
                                                        <button className='btn btn-outline-success form-rounded px-4  m-2' type='button' title="Update bank account" onClick={e => setUpdateModalShow(true)}
                                                        >Update</button>
                                                    </> : <button className='btn btn-outline-success form-rounded px-4' type='button' onClick={e => setCreateModalShow(true)}
                                                    >Add New Bank</button>
                                                        :
                                                        <button className='btn btn-outline-success form-rounded px-4' title="Add new bank account" type='button' onClick={e => setCreateModalShow(true)}>Add New Bank</button>
                                                }
                                            </div>

                                            //  Add Bank Confirmation  
                                            <CreateMessage
                                                header="Add New Bank"
                                                body_header={BankName}
                                                body={"Are you sure want to add " + BankName + " " + BankBranchName + " Branch?"}
                                                show={CreateModalShow}
                                                Click={(e) => AddBank(e)}
                                                onHide={() => setCreateModalShow(false)}
                                            />

                                            //  Update Confirmation  
                                            <CreateMessage
                                                header="Update Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to update " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={UpdateModalShow}
                                                Click={(e) => UpdateBank(e)}
                                                onHide={() => setUpdateModalShow(false)}
                                            />

                                            //  Delete Confirmation
                                            <CreateMessage
                                                header="Remove Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to remove " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={DeleteModalShow}
                                                Click={(e) => DeleteBank(e)}
                                                onHide={() => setDeleteModalShow(false)}
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div> 

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "Subscribe" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "Subscribe" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="Subscribe"
                                        onClick={() => setStep(Step === "Subscribe" ? null : "Subscribe")}
                                    >
                                        Subscription
                                    </button>
                                </p>
                                <div id="Subscribe" className={`accordion-collapse collapse ${Step === "Subscribe" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row">
                                            <label className='display-6 fw-bolder m-0 text-center'>{BankName ? BankName : null}</label>
                                            <div className="flex-1 d-flex justify-content-center">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "80%", paddingLeft: "5px" }}
                                                    type='date'
                                                    placeholder='Subsc'
                                                    name='DOB'
                                                    value={DOB}
                                                    onChange={e => onChange(e)}
                                                    onBlur={(e) => onBlur(e)}
                                                    required
                                                />
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "80%", paddingLeft: "5px" }}
                                                    type='date'
                                                    placeholder='Date of Birth'
                                                    name='DOB'
                                                    value={DOB}
                                                    onChange={e => onChange(e)}
                                                    onBlur={(e) => onBlur(e)}
                                                    required
                                                />
                                            </div>

                                            <table className="table table-hover table-borderless">
                                                <tbody>

                                                    <tr>
                                                        <td className="py-2" scope="row">Account Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='text'
                                                                placeholder='Account Name'
                                                                name="AccName"
                                                                value={AccName ? AccName : ""}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                minLength='100'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.AccName ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccName}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td className="py-2">A/C Number</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <input
                                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                type='number'
                                                                placeholder='A/C Number'
                                                                name='AccNumber'
                                                                value={AccNumber ? AccNumber : ""}
                                                                onFocus={e => handleFocus(e)}
                                                                onChange={e => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength='20'
                                                                required
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.AccNumber ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.AccNumber}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }

                                                    <tr>
                                                        <td className="py-2">Bank Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={BankLists}
                                                                name='BankName'
                                                                placeholder={"Please select bank name"}
                                                                styles={colourStyles}
                                                                value={{ value: null, label: BankName }}
                                                                onChange={e => LoadBankBranch(e)}
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.BankID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BankID}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }

                                                    <tr>
                                                        <td className="py-2">Branch Name</td>
                                                        <td className="py-2">:</td>
                                                        <th className="py-2">
                                                            <Select
                                                                borderRadius={'0px'}
                                                                options={BBLists}
                                                                name='BankBranchName'
                                                                placeholder={"Please select branch"}
                                                                styles={colourStyles}
                                                                value={{ value: BankID, label: BankBranchName }}
                                                                onChange={e => BankBranchHandler(e)}
                                                            />
                                                        </th>
                                                    </tr>
                                                    {Error.BankID ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BankID}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                    <tr>
                                                        <td colspan="3" className='p-0'>
                                                            <p className="text-muted text-center m-0">{Address ? Address : null}</p>
                                                            <p className="text-muted text-center m-0">{Telephone ? Telephone : null}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="flex-1 text-center">
                                                {
                                                    Data ? Data.Bank ? <>
                                                        <button className='btn btn-outline-success form-rounded px-4 m-2' title="Remove bank account" type='button' onClick={() => setDeleteModalShow(true)}
                                                        >Remove</button>
                                                        <button className='btn btn-outline-success form-rounded px-4  m-2' type='button' title="Update bank account" onClick={e => setUpdateModalShow(true)}
                                                        >Update</button>
                                                    </> : <button className='btn btn-outline-success form-rounded px-4' type='button' onClick={e => setCreateModalShow(true)}
                                                    >Add New Bank</button>
                                                        :
                                                        <button className='btn btn-outline-success form-rounded px-4' title="Add new bank account" type='button' onClick={e => setCreateModalShow(true)}>Add New Bank</button>
                                                }
                                            </div>

                                            <CreateMessage
                                                header="Add New Bank"
                                                body_header={BankName}
                                                body={"Are you sure want to add " + BankName + " " + BankBranchName + " Branch?"}
                                                show={CreateModalShow}
                                                Click={(e) => AddBank(e)}
                                                onHide={() => setCreateModalShow(false)}
                                            />

                                            <CreateMessage
                                                header="Update Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to update " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={UpdateModalShow}
                                                Click={(e) => UpdateBank(e)}
                                                onHide={() => setUpdateModalShow(false)}
                                            />

                                            <CreateMessage
                                                header="Remove Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to remove " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={DeleteModalShow}
                                                Click={(e) => DeleteBank(e)}
                                                onHide={() => setDeleteModalShow(false)}
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div>
                        */}
                        </div>
                    </div>
                </div>

            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    UserID: props.location.FetchManagerID
});

export default connect(mapStateToProps, { logout })(EmployeeProfile);