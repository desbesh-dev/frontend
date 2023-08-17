import * as moment from 'moment'

import { FaCodeBranch, FaUserTie } from "react-icons/fa";
import React, { Fragment, useEffect, useState } from 'react';
import { GetCompany, LoadProfile, BankCMPUpdate, LoadBanks, RemoveCMPBank, SaveCMPBank, UpdateImage, getBranch } from '../../actions/APIHandler';
import { IoImagesOutline, IoRemoveCircleOutline, } from "react-icons/io5";
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { CreateMessage } from "../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import { logout } from '../../actions/auth';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';

const BusinessProfiles = ({ display, user, list, setList }) => {
    const [Data, setData] = useState(false)
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [TempData, setTempData] = useState(false)
    const [View, setView] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [DivisionLists, setDivisionLists] = useState(initialValue);
    const [ZilaLists, setZilaLists] = useState(initialValue);
    const [UpazilaLists, setUpazilaLists] = useState(initialValue);
    const [ZilaCode, setZilaCode] = useState(null);
    const [UnionLists, setUnionLists] = useState(initialValue);
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

        // id: Data.UserInfo.id,
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
        NIDCopy: false,
        Agreement: false,
        BankCheque: false,
        TradeLicence: false,
        is_block: false,
        is_active: false,
        is_ceo: false,

        AccName: false,
        AccNumber: false,
        BankName: "",
        BankBranchName: "",
        Address: "",
        Telephone: "",
        BankID: "",
        Status: 2,
    });

    useEffect(() => {
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        LoadCopmany();
    }, [])

    const {
        Name,
        Domain,
        Established,
        BusinessEmail,
        ContactNo,
        LogoPrv,
        Logo,
        BranchID,
        BranchName,
        BranchEmail,
        FirstName,
        LastName,
        email,
        MobileNo,
        password,
        con_pass,
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
        NIDCopy,
        Agreement,
        BankCheque,
        TradeLicence,
        is_block,
        is_active,
        is_ceo,
        ImagePrv,

        AccName,
        AccNumber,
        BankName,
        BankBranchName,
        Address,
        Telephone,
        BankID,
        Status
    } = formData;

    const onChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            FullName: FirstName + " " + LastName,
        });

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

    const onSubmit = async (e) => {
        setError({});
        // dispatch({
        //     type: DISPLAY_OVERLAY,
        //     payload: true
        // });
        e.preventDefault();
        // const result = await SaveCompany(
        //   Name,
        //   Domain,
        //   Established,
        //   BusinessEmail,
        //   ContactNo,
        //   LogoPrv,
        //   Logo,
        //   FirstName,
        //   LastName,
        //   email,
        //   MobileNo,
        //   password,
        //   con_pass,
        //   FullName,
        //   Nid_BirthNo,
        //   DOB,
        //   FatherName,
        //   MotherName,
        //   HoldingNo,
        //   WardNo,
        //   VillageName,
        //   Union,
        //   PostalCode,
        //   Upazila,
        //   Zila,
        //   Division,
        //   Nationality,
        //   Religion,
        //   Gender,
        //   Occupation,
        //   EducationalQualification,
        //   Image,
        //   RefID,
        //   RepID,
        //   NIDCopy,
        //   Agreement,
        //   BankCheque,
        //   TradeLicence,
        //   is_block,
        //   is_active,
        //   is_ceo,
        //   ImagePrv
        // );
        // 
        // if (result.error) {
        //   const updatedState = {};
        //   for (var pair of result.error_details.entries()) {
        //     updatedState[pair[1].field] = pair[1].message;
        //     setError({
        //       ...updatedState,
        //     });
        //   }
        // }
        // dispatch({
        //   type: DISPLAY_OVERLAY,
        //   payload: false,
        // });
        // 
    };

    const ImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFormData({ ...formData, Image: file, ImagePrv: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const ImageRemove = () => {
        setFormData({ ...formData, ImagePrv: "" });
    };

    const LogoChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setFormData({ ...formData, Logo: file, LogoPrv: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const LogoRemove = () => {
        setFormData({ ...formData, LogoPrv: "" });
    };

    const LoadCopmany = async () => {
        var CompanyData = await GetCompany(user.CompanyID);

        if (CompanyData !== true) {
            setData(CompanyData);
            setFormData({
                Name: CompanyData.data[0].Company.Name,
                Domain: CompanyData.data[0].Company.Domain,
                Established: CompanyData.data[0].Company.Established,
                BusinessEmail: CompanyData.data[0].Company.BusinessEmail,
                ContactNo: CompanyData.data[0].Company.ContactNo,
                LogoPrv: CompanyData.data[0].Company.LogoPrv,
                Logo: CompanyData.data[0].Company.Logo,

                BranchID: CompanyData.data[0].CP_Branch.BranchID,
                BranchName: CompanyData.data[0].CP_Branch.Name,
                BranchEmail: CompanyData.data[0].CP_Branch.BranchEmail,

                id: CompanyData.data[0].Ceo.id,
                FirstName: CompanyData.data[0].Ceo.FirstName,
                LastName: CompanyData.data[0].Ceo.LastName,
                email: CompanyData.data[0].Ceo.email,
                MobileNo: CompanyData.data[0].Ceo.MobileNo,

                FullName: CompanyData.data[0].Details.FullName,
                Nid_BirthNo: CompanyData.data[0].Details.Nid_BirthNo,
                DOB: CompanyData.data[0].Details.DOB,
                FatherName: CompanyData.data[0].Details.FatherName,
                MotherName: CompanyData.data[0].Details.MotherName,
                HoldingNo: CompanyData.data[0].Details.HoldingNo,
                WardNo: CompanyData.data[0].Details.WardNo,
                VillageName: CompanyData.data[0].Details.VillageName,
                Union: CompanyData.data[0].Details.Union,
                PostalCode: CompanyData.data[0].Details.PostalCode,
                Upazila: CompanyData.data[0].Details.Upazila,
                Zila: CompanyData.data[0].Details.Zila,
                Division: CompanyData.data[0].Details.Division,
                Nationality: CompanyData.data[0].Details.Nationality,
                Religion: CompanyData.data[0].Details.Religion,
                Gender: CompanyData.data[0].Details.Gender,
                Occupation: CompanyData.data[0].Details.Occupation,
                EducationalQualification: CompanyData.data[0].Details.EducationalQualification,
                Image: CompanyData.data[0].Details.Image,
                ImagePrv: "",

                AccName: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.AccName : "",
                AccNumber: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.AccNumber : "",
                BankName: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.BankName : "",
                BankBranchName: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.BranchName : "",
                Address: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.Address : "",
                Telephone: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.Telephone : "",
                BankID: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.BankID : "",
                Status: CompanyData.data[0].Bank ? CompanyData.data[0].Bank.Status : 2,
            });

        } else {

        }


        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
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
    const FetchUser = async (id) => {
        var User_Data = await LoadProfile(id);

        // history.push('/pending_user', { UserData: User_Data.data });
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
        if (!Data || !Data.data[0]) {
            setFormData({
                ...formData,
                AccName: false,
                AccNumber: false,
                BanckName: "",
                BankBranchName: "",
                Address: "",
                Telephone: "",
                BankID: "",
                Status: 2,
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
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await SaveCMPBank(AccName, AccNumber, BankID, Status);
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
        const UserBankID = Data.data[0].Bank.BankID
        setError({})
        setUpdateModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await BankCMPUpdate(AccName, AccNumber, BankID, Status, UserBankID);
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
        const result = await RemoveCMPBank(BankID);

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
                    "Status": 2,
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

    return (
        <div className="position-relative h-100">
            <div className="position-absolute overflow-auto mb-5 pb-5 w-100 h-100 ">
                <div className="header mb-4 mx-auto d-table">
                    <p className="display-6 m-0">
                        Your Business Profile
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb d-flex justify-content-center">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/business_profiles">Business Profiles</Link></li>
                        </ol>
                    </nav>
                </div>

                <div className="row m-0 w-100 mx-auto d-table h-100">
                    <div className="col-sm-12 col-md-6 col-lg-6 mx-auto d-table h-100">
                        <div className="accordion accordion-flush" id="accordionFlushExample">

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "CMP_Detils" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "CMP_Detils" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="CMP_Detils" onClick={() => setStep(Step === "CMP_Detils" ? null : "CMP_Detils")}>
                                        Company Details
                                    </button>
                                </p>
                                <div id="CMP_Detils" className={`accordion-collapse collapse ${Step === "CMP_Detils" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                        <div className="row mx-auto d-table"
                                            style={{
                                                backgroundColor: "#F4F7FC",
                                                border: "1px solid #d3d3d3",
                                                fontWeight: "bold",
                                                maxWidth: "180px",
                                            }}>
                                            <p className="mx-auto d-table border-bottom w-100 mb-2 text-center">
                                                Logo
                                            </p>

                                            <div className="img_container">
                                                <img
                                                    src={LogoPrv ? LogoPrv : Logo ? process.env.REACT_APP_API_URL + Logo : `${process.env.REACT_APP_API_URL}/Media/logo.png`}
                                                    className="image img-fluid rounded-square mx-auto d-table"
                                                    width="150"
                                                    alt="SoftaPoul_Logo"
                                                />

                                                <div className="middle">
                                                    <input
                                                        type="file"
                                                        id="img_logo"
                                                        className="d-none"
                                                        accept="image/*"
                                                        onChange={(e) => LogoChange(e)}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success shadow-lg m-1"
                                                        for="img_logo"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Choose Logo"
                                                    >
                                                        <i class="fad fa-images"></i>
                                                    </label>
                                                    {LogoPrv ? (
                                                        <Fragment>
                                                            <button
                                                                className="btn btn-outline-success shadow-lg"
                                                                for="img_logo"
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="bottom"
                                                                title="Remove selected image"
                                                                type="button"
                                                                onClick={() => LogoRemove()}
                                                            >
                                                                <i class="fad fa-minus-circle"></i>
                                                            </button>
                                                        </Fragment>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <table className="table table-hover table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-2">Company Name</td>
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
                                                                placeholder="Company Name"
                                                                name="Name"
                                                                value={Name}
                                                                onFocus={(e) => handleFocus(e)}
                                                                onChange={(e) => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                                placeholder="Domain Name"
                                                                name="Domain"
                                                                value={Domain}
                                                                onFocus={(e) => handleFocus(e)}
                                                                onChange={(e) => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                                placeholder="Established"
                                                                name="Established"
                                                                value={Established}
                                                                onChange={(e) => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
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
                                                        <td className="py-2" scope="row">
                                                            Office Contact No
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
                                                                onBlur={(e) => onBlur(e)}
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
                                                            Business Email
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
                                                                placeholder="Business Email"
                                                                name="BusinessEmail"
                                                                value={BusinessEmail}
                                                                onFocus={(e) => handleFocus(e)}
                                                                onChange={(e) => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength="50"
                                                                required
                                                            />
                                                            {Error.BusinessEmail ? (
                                                                <p className="mx-auto d-table text-center text-warning m-0">
                                                                    <small>{Error.BusinessEmail}</small>
                                                                </p>
                                                            ) : null}
                                                        </th>
                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`accordion-button ${Step === "CP_Detils" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "CMP_Detils" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="CP_Detils" onClick={() => setStep(Step === "CP_Detils" ? null : "CP_Detils")}>
                                        Corporate Office
                                    </button>
                                </p>
                                <div id="CP_Detils" className={`accordion-collapse collapse ${Step === "CP_Detils" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">

                                        <div className="row">
                                            <table className="table table-hover table-borderless">
                                                <tbody>
                                                    <tr>
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
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength="50"
                                                                required
                                                            />
                                                            {Error.BranchID ? (
                                                                <p className="mx-auto d-table text-center text-warning m-0">
                                                                    <small>{Error.BranchID}</small>
                                                                </p>
                                                            ) : null}
                                                        </th>
                                                    </tr>

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
                                                                name="BranchName"
                                                                value={BranchName}
                                                                onFocus={(e) => handleFocus(e)}
                                                                onChange={(e) => onChange(e)}
                                                                onBlur={(e) => onBlur(e)}
                                                                maxLength="50"
                                                                required
                                                            />
                                                            {Error.BranchName ? (
                                                                <p className="mx-auto d-table text-center text-warning m-0">
                                                                    <small>{Error.BranchName}</small>
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
                                                                value={Division === "" ? { value: Division, label: Division } : { value: Division, label: Division }}
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
                                                                value={Zila === "" ? { value: Zila, label: Zila } : { value: Zila, label: Zila }}
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
                                                                value={Upazila === "" ? { value: Upazila, label: Upazila } : { value: Upazila, label: Upazila }}
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
                                                                value={Union === "" ? { value: Union, label: Union } : { value: Union, label: Union }}
                                                                onChange={e => setFormData({
                                                                    ...formData, "Union": Union === "" ? Union : e.label
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
                                                                value={VillageName === "" ? VillageName : VillageName}
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
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingTwo">
                                    <button className={`accordion-button ${Step === "Step2" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded={Step === "Step2" ? "true" : "false"} aria-controls="flush-collapseTwo"
                                        id="Step2" onClick={() => setStep(Step === "Step2" ? null : "Step2")}>
                                        Cheif Executing Officer
                                    </button>
                                </p>
                                <div id="flush-collapseTwo" className={`accordion-collapse collapse ${Step === "Step2" ? "show" : null}`} aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
                                </div>
                            </div>

                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingThree">
                                    <button className={`accordion-button ${Step === "Step3" ? "collapse show" : "collapsed"} shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ backgroundColor: "rgba(40, 167, 69,0.1)", borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded={Step === "Step3" ? "true" : "false"} aria-controls="flush-collapseThree"
                                        id="Step3" onClick={() => setStep(Step === "Step3" ? null : "Step3")}>
                                        Branches
                                    </button>
                                </p>
                                <div id="Step3" className={`accordion-collapse collapse ${Step === "Step3" ? "show" : null}`} aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        <p className="bg-white mx-auto d-table p-4 border border-light-3 rounded-circle shadow-sm m-0">
                                            <p className="display-3 fw-bolder text-success mx-auto d-table m-0">
                                                {Data ? Data.data[0].TotBranch : null}
                                            </p>
                                            Total Branch
                                        </p>
                                    </div>

                                    {
                                        Data ? Data.data[1].map((item) => (
                                            <div className="card text-center">
                                                <div className="card-body p-3">
                                                    <Link onClick={() => FetchUser(item.BranchID)}>
                                                        <h6 className="fw-bold text-success display-6  m-0">{item.BranchID + ". " + item.Name + " Branch"}</h6>
                                                    </Link>
                                                    <p className="card-text mb-1">
                                                        <small className="text-muted">Estd. {moment(item.Established).format('DD MMM YYYY')}</small>
                                                    </p>
                                                    <p className="card-text m-0">{item.VillageName + ", " + item.Union + ", " + item.Upazila + ", " + item.Zila + ", " + item.Division}</p>
                                                    <h6 className="fw-bold text-success m-0">{item.BranchEmail}</h6>
                                                    <h6 className="fw-bold text-success mb-2"> <a href={"tel:" + item.ContactNo}>{item.ContactNo}</a></h6>

                                                    <Link to={`/employee_main/${item.ManagerID}`}
                                                        className="card-link">
                                                        {
                                                            item.Manager ?
                                                                <Fragment>
                                                                    <FaUserTie />
                                                                    {" " + item.Manager}
                                                                </Fragment>
                                                                : null
                                                        } </Link>
                                                    <Link
                                                        to={{ pathname: `/update_branch`, FetchBranchID: item.BranchID }}
                                                        className="card-link"
                                                    >
                                                        Update
                                                    </Link>
                                                    <Link to="#" className="card-link">View</Link>
                                                </div>

                                            </div>
                                        ))
                                            :
                                            null
                                    }

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
                                                    Data ? Data.data[0].Bank ? <>
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

                                            {/* Add Bank Confirmation  */}
                                            <CreateMessage
                                                header="Add New Bank"
                                                body_header={BankName}
                                                body={"Are you sure want to add " + BankName + " " + BankBranchName + " Branch?"}
                                                show={CreateModalShow}
                                                Click={(e) => AddBank(e)}
                                                onHide={() => setCreateModalShow(false)}
                                            />

                                            {/* Update Confirmation  */}
                                            <CreateMessage
                                                header="Update Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to update " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={UpdateModalShow}
                                                Click={(e) => UpdateBank(e)}
                                                onHide={() => setUpdateModalShow(false)}
                                            />

                                            {/* Delete Confirmation */}
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

export default connect(mapStateToProps, { logout })(BusinessProfiles);