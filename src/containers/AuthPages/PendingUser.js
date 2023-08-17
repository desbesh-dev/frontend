import { ApproveData, RemoveUser, UpdateImage } from '../../actions/APIHandler';
import { Button, Modal } from "react-bootstrap";
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { DISPLAY_OVERLAY } from '../../actions/types';
import { DeleteMessage } from "../Modals/DeleteModal.js";
import { Fragment } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { checkToken } from '../../actions/auth';

const PendingUser = (UserData) => {

    const dispatch = useDispatch();
    let history = useHistory();

    const [modalShow, setModalShow] = useState(false);
    const data = UserData.location.state.UserData;
    const initialValue = { value: 0, label: "" };
    const [DivisionLists, setDivisionLists] = useState(initialValue);
    const [ZilaLists, setZilaLists] = useState(initialValue);
    const [UpazilaLists, setUpazilaLists] = useState(initialValue);
    const [ZilaCode, setZilaCode] = useState(null);
    const [UnionLists, setUnionLists] = useState(initialValue);
    const [RefLists, setRefLists] = useState(initialValue);
    const [RepLists, setRepLists] = useState(initialValue);
    const [Error, setError] = useState({});

    const [formData, setFormData] = useState({
        id: data.UserInfo.id,
        FirstName: data.UserInfo.FirstName,
        LastName: data.UserInfo.LastName,
        email: data.UserInfo.email,
        MobileNo: data.UserInfo.MobileNo,

        FullName: data.Details.FullName,
        Nid_BirthNo: data.Details.Nid_BirthNo,
        DOB: data.Details.DOB,
        FatherName: data.Details.FatherName,
        MotherName: data.Details.MotherName,
        HoldingNo: data.Details.HoldingNo,
        WardNo: data.Details.WardNo,
        VillageName: data.Details.VillageName,
        Union: data.Details.Union,
        PostalCode: data.Details.PostalCode,
        Upazila: data.Details.Upazila,
        Zila: data.Details.Zila,
        Division: data.Details.Division,
        Nationality: data.Details.Nationality,
        Religion: data.Details.Religion,
        Gender: data.Details.Gender,
        Occupation: data.Details.Occupation,
        EducationalQualification: data.Details.EducationalQualification,
        Image: data.Details.Image,
        ImagePrv: '',
        RefID: data.Ref ? data.Ref.RefID : "",
        RefName: data.Ref ? data.Ref.RefName : "",
        RepID: data.Ref ? data.Ref.RepID : "",
        RepName: data.Ref ? data.Ref.RepName : "",
        NIDCopy: data.Ref ? data.Ref.NIDCopy : "",
        Agreement: data.Ref ? data.Ref.Agreement : "",
        BankCheque: data.Ref ? data.Ref.BankCheque : "",
        FarmRegCopy: data.Ref ? data.Ref.FarmRegCopy : "",
        is_block: data.UserInfo.is_block,
        is_active: data.UserInfo.is_active,
        is_staff: data.UserInfo.is_staff,
        is_subscriber: data.UserInfo.is_subscriber,
    });

    const { id, FirstName, LastName, email, MobileNo, FullName, Nid_BirthNo, DOB, FatherName, MotherName, HoldingNo, WardNo, VillageName, Union, PostalCode, Upazila, Zila, Division, Nationality, Religion, Gender, Occupation, EducationalQualification, Image, RefID, RefName, RepID, RepName, NIDCopy, Agreement, BankCheque, FarmRegCopy, is_block, is_active, is_staff, is_subscriber, ImagePrv } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, "FullName": FirstName + " " + LastName });
    const handleFocus = (e) => e.target.select()
    const onSubmit = async e => {
        setError({})
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await ApproveData(id, FirstName, LastName, email, MobileNo, FullName, Nid_BirthNo, DOB, FatherName, MotherName, HoldingNo, WardNo, VillageName, Union, PostalCode, Upazila, Zila, Division, Nationality, Religion, Gender, Occupation, EducationalQualification, Image, RefID, RepID, NIDCopy, Agreement, BankCheque, FarmRegCopy, is_block, is_active, is_staff, is_subscriber, ImagePrv);
        if (result.error) {
            const updatedState = {};
            for (var pair of result.error_details.entries()) {
                updatedState[pair[1].field] = pair[1].message;
                setError({
                    ...updatedState,
                });
            }
        }
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });

    };
    useEffect(() => {
        // setDisplayOverlay(true);
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        LoadDivision();
        LoadRef();
        LoadRep();

        dispatch({
            type: DISPLAY_OVERLAY,
            payload: false
        });
        // setDisplayOverlay(false);
    }, [])

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

    const LoadDivision = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/union/`, formData, config);
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
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/zila/{e.value}`, formData, config);
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

    const DeleteUser = async e => {
        setModalShow(false)
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await RemoveUser(id);

        if (result !== true) { history.goBack(); }
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

    return (
        <div className="position-absolute overflow-auto mb-5 pb-5" style={{ height: "95%" }}>
            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">
                    Pending User Details
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/LoadPending">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/pendinguser">Pending Users</Link></li>
                    </ol>
                </nav>
            </div>


            <div className="row m-0">
                <div className="col-sm-12 col-md-6 col-lg-6  mx-auto d-table h-100">
                    <div className="d-flex">
                        <hr className="my-auto flex-grow-1" />
                        <div className="px-4"><h1 className='display-6 text-bold'>Account Info</h1></div>
                        <hr className="my-auto flex-grow-1" />
                    </div>
                    <div className="row">
                        <div className="col-lg-3 mx-auto d-table h-100 m-0 p-2" style={{ backgroundColor: "#F4F7FC", border: "1px solid #d3d3d3", fontWeight: "bold" }}>
                            <p className='mx-auto d-table border-bottom w-100 mb-2 text-center'>User Picture</p>
                            <div className="img_container">
                                <img src={ImagePrv ? ImagePrv : data ? process.env.REACT_APP_API_URL + data.Details.Image : ''} className="image img-fluid rounded-square mx-auto d-table" width="150" alt="avatar" />

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
                                        title="Choose Image"
                                    >
                                        <i class="fad fa-images"></i>
                                    </label>
                                    {ImagePrv ?
                                        <Fragment>
                                            <label
                                                className='btn btn-outline-success shadow-lg'
                                                for="file1"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="bottom"
                                                title="Upload Image"
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
                        <div className="col-lg-8 ml-3">
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
                                                value={data.UserInfo.id}
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
                                                value={FirstName === "" ? data.UserInfo.FirstName : FirstName}
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
                                        <td className="py-2">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='text'
                                                placeholder='Last Name'
                                                name='LastName'
                                                value={LastName === "" ? data.UserInfo.LastName : LastName}
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
                                        <td className="py-2">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='date'
                                                placeholder='Date of Birth'
                                                name='DOB'
                                                value={data.Details.DOB}
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
                                        <td className="py-2">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='number'
                                                placeholder='Mobile No'
                                                name='MobileNo'
                                                value={MobileNo === "" ? data.UserInfo.MobileNo : MobileNo}
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
                                        <td className="py-2">:</td>
                                        <th className="py-2">
                                            <input
                                                style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                type='email'
                                                placeholder='Email'
                                                name='email'
                                                value={email === "" ? data.UserInfo.email : email}
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
                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>

                <div className="col-sm-12 col-md-6 col-lg-6  mx-auto d-table h-100 ">
                    <div className="d-flex">
                        <hr className="my-auto flex-grow-1" />
                        <div className="px-4"><h1 className='display-6 text-bold'>Location Details</h1></div>
                        <hr className="my-auto flex-grow-1" />
                    </div>
                    <div className="col-lg-12 m-0 p-0">
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
                                            value={Division === "" ? { value: data.Details.Division, label: data.Details.Division } : { value: Division, label: Division }}
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
                                            value={Zila === "" ? { value: data.Details.Zila, label: data.Details.Zila } : { value: Zila, label: Zila }}
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
                                            value={Upazila === "" ? { value: data.Details.Upazila, label: data.Details.Upazila } : { value: Upazila, label: Upazila }}
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
                                            value={Union === "" ? { value: data.Details.Union, label: data.Details.Union } : { value: Union, label: Union }}
                                            onChange={e => setFormData({
                                                ...formData, "Union": Union === "" ? data.Details.Union : e.label
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
                                            value={VillageName === "" ? data.Details.VillageName : VillageName}
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
                                <tr>
                                    <td className="py-2" scope="row">Ward No</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                            type='text'
                                            placeholder='Ward No'
                                            name='WardNo'
                                            value={WardNo === "" ? data.Details.WardNo : WardNo}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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
                                            value={data.Details.HoldingNo}
                                            onChange={e => onChange(e)}
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
                                            value={PostalCode === "" ? data.Details.PostalCode : PostalCode}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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

                <div className="col-sm-12 col-md-6 col-lg-6 mx-auto d-table h-100">
                    <div className="d-flex">
                        <hr className="my-auto flex-grow-1" />
                        <div className="px-4"><h1 className='display-6 text-bold'>Personal Info</h1></div>
                        <hr className="my-auto flex-grow-1" />
                    </div>
                    <div className="col-lg-12 m-0 p-0">
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
                                            value={FullName === "" ? data.Details.FullName : FullName}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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
                                            value={Nid_BirthNo === "" ? data.Details.Nid_BirthNo : Nid_BirthNo}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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
                                            value={FatherName === "" ? data.Details.FatherName : FatherName}
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
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <input
                                            style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                            type='text'
                                            placeholder='Mother Name'
                                            name='MotherName'
                                            value={MotherName === "" ? data.Details.MotherName : MotherName}
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
                                    <td className="py-2" scope="row">Nationality</td>
                                    <td className="py-2">:</td>
                                    <th className="py-2">
                                        <Select
                                            borderRadius={'0px'}
                                            options={[{ label: 'Bangladeshi' }]}
                                            name='Nationality'
                                            placeholder={"Please select nationality"}
                                            styles={colourStyles}
                                            value={Nationality === "" ? { value: data.Details.Nationality, label: data.Details.Nationality } : { value: Nationality, label: Nationality }}
                                            onChange={e => setFormData({
                                                ...formData, "Nationality": Nationality === "" ? data.Details.Nationality : e.label
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
                                            value={Religion === "" ? { value: data.Details.Religion, label: data.Details.Religion } : { value: Religion, label: Religion }}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => setFormData({
                                                ...formData, "Religion": Religion === "" ? data.Details.Religion : e.label
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
                                            value={Gender === "" ? { value: data.Details.Gender, label: data.Details.Gender } : { value: Gender, label: Gender }}
                                            onChange={e => setFormData({
                                                ...formData, "Gender": Gender === "" ? data.Details.Gender : e.label
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
                                            value={Occupation === "" ? data.Details.Occupation : Occupation}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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
                                            value={EducationalQualification === "" ? data.Details.EducationalQualification : EducationalQualification}
                                            onFocus={e => handleFocus(e)}
                                            onChange={e => onChange(e)}
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

                <div className="col-sm-12 col-md-6 col-lg-6  mx-auto d-table h-100 ">
                    <div className="d-flex">
                        <hr className="my-auto flex-grow-1" />
                        <div className="px-4"><h1 className='display-6 text-bold'>Accessability</h1></div>
                        <hr className="my-auto flex-grow-1" />
                    </div>
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
                                            checked={is_staff ? true : false}
                                            onChange={(e) => { setFormData({ ...formData, [e.target.name]: !is_staff ? true : false }) }}
                                        />
                                        <label className="form-check-label" for="Staff">Staff</label>
                                    </div>
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

                    <div className="col-lg-6 mx-auto d-table h-100">
                        <button className='btn btn-outline-success form-rounded px-4 m-2' title="Hellos" type='button' onClick={() => setModalShow(true)}>Delete</button>
                        <button className='btn btn-outline-success form-rounded px-4' type='button' onClick={e => onSubmit(e)}>Submit</button>
                        <DeleteMessage
                            FullName={FullName}
                            show={modalShow}
                            Click={(e) => DeleteUser(e)}
                            onHide={() => setModalShow(false)}
                        />
                    </div>
                </div>

            </div>

        </div>
    );
}


const mapStateToProps = state => ({
    display: state.OverlayDisplay
});

export default connect(mapStateToProps, {})(PendingUser);