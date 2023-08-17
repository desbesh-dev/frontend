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

export const EmployeeActivity = (UserID, display, user, list, setList) => {
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

    const HandleBank = () => {
        if (!Data || !Data.data.Bank) {
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
        const result = await SaveBank(CompanyID, BranchID, UserID, AccName, AccNumber, BankID);
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
        const UserBankID = Data.data.Bank.BankID

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
        <div className="position-relative h-100">
            <div className="position-absolute overflow-auto mb-5 pb-5 w-100 h-75">
                <p className='display-6 d-flex justify-content-center mb-4 m-0'>Activity</p>

                <div className="row d-flex justify-content-center mb-70">
                    <div className="col-md-10">
                        <div className="main-card mb-3 cs_card">
                            <div className="cs_card-body">
                                <h5 className="card-title">Job Action</h5>
                                <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-success"></i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title">Meeting with client</h4>
                                                <p>Meeting with USA Client, today at <a href="javascript:void(0);" data-abc="true">12:00 PM</a></p> <span className="vertical-timeline-element-date">9:30 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-warning"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <p>Another meeting with UK client today, at <b className="text-danger">3:00 PM</b></p>
                                                <p>Yet another one, at <span className="text-success">5:00 PM</span></p> <span className="vertical-timeline-element-date">12:25 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-danger"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title">Discussion with team about new product launch</h4>
                                                <p>meeting with team mates about the launch of new product. and tell them about new features</p> <span className="vertical-timeline-element-date">6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-primary"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title text-success">Discussion with marketing team</h4>
                                                <p>Discussion with marketing team about the popularity of last product</p> <span className="vertical-timeline-element-date">9:00 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-success"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title">Purchase new hosting plan</h4>
                                                <p>Purchase new hosting plan as discussed with development team, today at <a href="javascript:void(0);" data-abc="true">10:00 AM</a></p> <span className="vertical-timeline-element-date">10:30 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-warning"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <p>Another conference call today, at <b className="text-danger">11:00 AM</b></p>
                                                <p>Yet another one, at <span className="text-success">1:00 PM</span></p> <span className="vertical-timeline-element-date">12:25 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-warning"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <p>Another meeting with UK client today, at <b className="text-danger">3:00 PM</b></p>
                                                <p>Yet another one, at <span className="text-success">5:00 PM</span></p> <span className="vertical-timeline-element-date">12:25 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-danger"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title">Discussion with team about new product launch</h4>
                                                <p>meeting with team mates about the launch of new product. and tell them about new features</p> <span className="vertical-timeline-element-date">6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-primary"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title text-success">Discussion with marketing team</h4>
                                                <p>Discussion with marketing team about the popularity of last product</p> <span className="vertical-timeline-element-date">9:00 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-success"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <h4 className="timeline-title">Purchase new hosting plan</h4>
                                                <p>Purchase new hosting plan as discussed with development team, today at <a href="javascript:void(0);" data-abc="true">10:00 AM</a></p> <span className="vertical-timeline-element-date">10:30 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vertical-timeline-item vertical-timeline-element">
                                        <div> <span className="vertical-timeline-element-icon bounce-in"> <i className="badge badge-dot badge-dot-xl badge-warning"> </i> </span>
                                            <div className="vertical-timeline-element-content bounce-in">
                                                <p>Another conference call today, at <b className="text-danger">11:00 AM</b></p>
                                                <p>Yet another one, at <span className="text-success">1:00 PM</span></p> <span className="vertical-timeline-element-date">12:25 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default connect(mapStateToProps, { logout })(EmployeeActivity);