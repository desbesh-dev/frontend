
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline, } from "react-icons/io5";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

import { DISPLAY_OVERLAY } from "../../../actions/types";
import { Fragment } from "react";
import Select from "react-select";
import axios from "axios";
import { checkToken, logout } from "../../../actions/auth";
import { SaveCompany } from "../../../actions/AdminApi";
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

const CreateCompany = ({ display, setList, list }) => {
  const dispatch = useDispatch();
  let history = useHistory();
  let toastProperties = null
  const [Error, setError] = useState({});

  const [modalShow, setModalShow] = useState(false);
  const initialValue = { value: 0, label: "" };
  const [DivisionLists, setDivisionLists] = useState(initialValue);
  const [ZilaLists, setZilaLists] = useState(initialValue);
  const [UpazilaLists, setUpazilaLists] = useState(initialValue);
  const [ZilaCode, setZilaCode] = useState(null);
  const [UnionLists, setUnionLists] = useState(initialValue);
  const [RefLists, setRefLists] = useState(initialValue);
  const [RepLists, setRepLists] = useState(initialValue);
  const [Step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    Name: "",
    ShortCode: "",
    DomainName: "",
    Established: "",
    BusinessEmail: "",
    ContactNo: "",
    LogoPrv: "",
    Logo: "",

    FirstName: "",
    LastName: "",
    UserEmail: "",
    MobileNo: "",
    UsrPass: "",
    con_pass: "",
    FullName: "",
    Nid_BirthNo: "",
    DOB: "",
    FatherName: "",
    MotherName: "",
    HoldingNo: "",
    WardNo: "",
    VillageName: "",
    Union: "",
    PostalCode: "",
    Upazila: "",
    Zila: "",
    Division: "",
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
  });

  const {
    Name,
    ShortCode,
    DomainName,
    Established,
    BusinessEmail,
    ContactNo,
    LogoPrv,
    Logo,
    FirstName,
    LastName,
    UserEmail,
    MobileNo,
    UsrPass,
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
  } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      FullName: FirstName + " " + LastName,
    });
  const handleFocus = (e) => e.target.select();

  const onSubmit = async (e) => {
    setError({});
    // dispatch({
    //     type: DISPLAY_OVERLAY,
    //     payload: true
    // });
    e.preventDefault();
    const result = await SaveCompany(
      Name,
      ShortCode,
      DomainName,
      Established,
      BusinessEmail,
      ContactNo,
      LogoPrv,
      Logo,
      FirstName,
      LastName,
      UserEmail,
      MobileNo,
      UsrPass,
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
      RepID,
      NIDCopy,
      Agreement,
      BankCheque,
      TradeLicence,
      is_block,
      is_active,
      is_ceo,
      ImagePrv
    );

    if (result !== true) {
      if (result.error) {
        const updatedState = {};
        for (var pair of result.exception.entries()) {
          updatedState[pair[1].field] = pair[1].message;
          setError({ ...updatedState });
        }
        setList([...list, toastProperties = {
          id: 1,
          title: 'Invalid Data',
          description: result.message,
          backgroundColor: '#f0ad4e',
          icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
        }])
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
      } else {
        setList([...list, toastProperties = {
          id: 1,
          title: result.Title,
          description: result.message,
          backgroundColor: '#f0ad4e',
          icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
        }])
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
      }
    } else {
      setList([...list, toastProperties = {
        id: 1,
        title: 'Error',
        description: "Failed to save product profile. Please try after some moment.",
        backgroundColor: '#f0ad4e',
        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
      }])
      dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }
    dispatch({ type: DISPLAY_OVERLAY, payload: false });

  };


  useEffect(() => {
    LoadDivision();
    LoadRef();
    LoadRep();
  }, []);

  const LoadRef = async () => {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        // 'Accept': 'application/json'
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ref_lists/`,
        config
      );
      setRefLists(res.data.Ref);
    } catch (err) { }
  };

  const LoadRefId = async (e) => {
    setFormData({ ...formData, RefID: e.target.value });
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ref_lists/${e.target.value}`,
        config
      );
      setFormData({
        ...formData,
        RefName: res.data[0].FullName,
        RefID: e.target.value,
      });
    } catch (err) {
      setFormData({ ...formData, RefName: "Not Found", RefID: e.target.value });
    }
  };

  const LoadRep = async () => {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        // 'Accept': 'application/json'
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rep_lists/`,
        config
      );
      setRepLists(res.data.Rep);
    } catch (err) { }
  };

  const LoadRepId = async (e) => {
    setFormData({ ...formData, RepID: e.target.value });
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ref_lists/${e.target.value}`,
        config
      );
      setFormData({
        ...formData,
        RepName: res.data[0].FullName,
        RepID: e.target.value,
      });
    } catch (err) {
      setFormData({ ...formData, RepName: "Not Found", RepID: e.target.value });
    }
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
  };

  const LoadDivision = async () => {
    const config = { headers: { "Content-Type": "application/json", }, };
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/division/`, config);
      setDivisionLists(res.data.Data);
    } catch (err) { }
  };

  const LoadZila = async (e) => {
    setFormData({ ...formData, Division: e.label });
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/zila/${e.value}`, config);
      setZilaLists(res.data.Data);
    } catch (err) {

    }
  };

  const LoadUpazila = async (e) => {
    setFormData({ ...formData, Zila: e.label });
    setZilaCode(e.value);
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/upazila/${e.value}`, config);
      setUpazilaLists(res.data.Data);
    } catch (err) { }
  };

  const LoadUnion = async (e) => {
    setFormData({ ...formData, Upazila: e.label });
    const config = {
      headers: { "Content-Type": "application/json" }
    };
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/union/${ZilaCode}/${e.value}`, config);
      setUnionLists(res.data.Data);
    } catch (err) { }
  };

  const ImageChange = (e) => {

    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => { setFormData({ ...formData, Image: file, ImagePrv: reader.result }); };

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
    <div className="container-fluid">
      <div className="header mb-4">
        <p className="display-6 m-0"> Register A New Business</p>
        {/* <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/LoadPending">Pending Users</Link></li>
          </ol>
        </nav> */}
      </div>

      <div className="row h-100">
        <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
          <div
            id="smartwizard-default-success"
            className="wizard wizard-success mb-4 sw sw-theme-default sw-justified"
          >
            <ul className="nav">
              <li className="nav-item">
                <a className={Step === 1 ? "nav-link inactive active" : "nav-link inactive done"} onClick={() => setStep(1)}>
                  Company Details
                  <br />
                  <small>Fill the company details</small>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    Step === 2
                      ? "nav-link inactive active"
                      : "nav-link inactive done"
                  }
                  onClick={() => setStep(2)}
                >
                  Account Info
                  <br />
                  <small>Fill the accounts information</small>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    Step === 3
                      ? "nav-link inactive active"
                      : "nav-link inactive done"
                  }
                  onClick={() => setStep(3)}
                >
                  Personal Info
                  <br />
                  <small>Fill the personal information</small>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    Step === 4
                      ? "nav-link inactive active"
                      : "nav-link inactive done"
                  }
                  onClick={() => setStep(4)}
                >
                  Location Details
                  <br />
                  <small>Fill the location details</small>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    Step === 5
                      ? "nav-link inactive active"
                      : "nav-link inactive done"
                  }
                  onClick={() => setStep(5)}
                >
                  Reference & Accessability
                  <br />
                  <small>Reference with user access</small>
                </a>
              </li>
            </ul>

            <div className="tab-content" style={{ height: "auto" }}>
              <div className="tab-pane" role="tabpanel" style={Step === 1 ? { display: "block" } : { display: "none" }}>
                <div className="row">
                  <div className="col-lg-3 mx-auto d-table h-100 m-0 p-2" style={{ backgroundColor: "#F4F7FC", border: "1px solid #d3d3d3", fontWeight: "bold", maxWidth: "180px" }}>
                    <p className="mx-auto d-table border-bottom w-100 mb-2 text-center">Logo</p>

                    <div className="img_container">
                      <img
                        src={
                          LogoPrv
                            ? LogoPrv
                            : `${process.env.REACT_APP_API_URL}/Media/logo.png`
                        }
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
                  <div className="col-lg-8 p-0">
                    <table className="table table-hover table-borderless">
                      <tbody>
                        <tr>
                          <td className="py-2">Company Name</td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <input
                              style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                              type="text"
                              placeholder="Company Name"
                              name="Name"
                              value={Name}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.Name ? (<p className="mx-auto d-table text-center text-warning m-0"> <small>{Error.Name}</small></p>) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2">Short Name</td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <input
                              style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                              type="text"
                              placeholder="Company short Name"
                              name="ShortCode"
                              value={ShortCode}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="11"
                              required
                            />
                            <small>Max: 11 Character, no any special character & symbol allowed</small>
                            {Error.ShortCode ? (<p className="mx-auto d-table text-center text-warning m-0"> <small>{Error.ShortCode}</small></p>) : null}
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
                              name="DomainName"
                              value={DomainName}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.DomainName ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.DomainName}</small>
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
                          <td className="py-2" scope="row">Business Email</td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <input style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                              type="email"
                              placeholder="Business Email"
                              name="BusinessEmail"
                              value={BusinessEmail}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
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
                        <tr>
                          <td className="py-2" scope="row">
                            Division
                          </td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <Select menuPortalTarget={document.body}
                              borderRadius={"0px"}
                              options={DivisionLists}
                              name="Division"
                              placeholder={"Please select division"}
                              styles={colourStyles}
                              value={
                                Division ? { value: Division, label: Division } : null
                              }
                              onChange={(e) => LoadZila(e)}
                            />
                            {Error.Division ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.Division}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Zila
                          </td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <Select menuPortalTarget={document.body}
                              borderRadius={"0px"}
                              options={ZilaLists}
                              name="Zila"
                              placeholder={"Please select zila"}
                              styles={colourStyles}
                              value={Zila ? { value: Zila, label: Zila } : null}
                              onChange={(e) => LoadUpazila(e)}
                            />
                            {Error.Zila ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.Zila}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Upazila/City Corporation
                          </td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <Select menuPortalTarget={document.body}
                              borderRadius={"0px"}
                              options={UpazilaLists}
                              name="Upazila"
                              placeholder={"Please select upazila"}
                              styles={colourStyles}
                              value={
                                Upazila ? { value: Upazila, label: Upazila } : null
                              }
                              onChange={(e) => LoadUnion(e)}
                            />
                            {Error.Upazila ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.Upazila}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Union
                          </td>
                          <td className="py-2">:</td>
                          <th className="py-2">
                            <Select menuPortalTarget={document.body}
                              borderRadius={"0px"}
                              options={UnionLists}
                              name="Union"
                              placeholder={"Please select union"}
                              styles={colourStyles}
                              value={Union ? { value: Union, label: Union } : null}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  Union: e.label,
                                })
                              }
                            />
                            {Error.Union ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.Union}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Village/Road Name
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
                              placeholder="Village Name"
                              name="VillageName"
                              value={VillageName}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="100"
                              required
                            />
                            {Error.VillageName ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.VillageName}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div className="tab-pane" role="tabpanel" style={Step === 2 ? { display: "block" } : { display: "none" }}>
                <div className="row">
                  <div className="col-lg-3 mx-auto d-table h-100 m-0 p-2" style={{ backgroundColor: "#F4F7FC", border: "1px solid #d3d3d3", fontWeight: "bold", maxWidth: "180px" }}>
                    <p className="mx-auto d-table border-bottom w-100 mb-2 text-center">User Picture</p>

                    <div className="img_container">
                      <img
                        src={
                          ImagePrv
                            ? ImagePrv
                            : process.env.REACT_APP_API_URL + "/Media/avatar.jpg"
                        }
                        className="image img-fluid rounded-square mx-auto d-table"
                        width="150"
                        alt="avatar"
                      />

                      <div className="middle">
                        <input
                          type="file"
                          id="img"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => ImageChange(e)}
                        />
                        <label
                          className="btn btn-outline-success shadow-lg m-1"
                          for="img"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Choose Image"
                        >
                          <i class="fad fa-images"></i>
                        </label>
                        {ImagePrv ? (
                          <Fragment>
                            <button
                              className="btn btn-outline-success shadow-lg"
                              for="file1"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Remove selected image"
                              type="button"
                              onClick={() => ImageRemove()}
                            >
                              <i class="fad fa-minus-circle"></i>
                            </button>
                          </Fragment>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 p-0">
                    <table className="table table-hover table-borderless">
                      <tbody>
                        <tr>
                          <td className="py-2">First Name</td>
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
                              placeholder="First Name"
                              name="FirstName"
                              value={FirstName}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.FirstName ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.FirstName}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>

                        <tr>
                          <td className="py-2" scope="row">
                            Last Name
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
                              placeholder="Last Name"
                              name="LastName"
                              value={LastName}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.LastName ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.LastName}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Date of Birth
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
                              placeholder="Date of Birth"
                              name="DOB"
                              value={DOB}
                              onChange={(e) => onChange(e)}
                              required
                            />
                            {Error.DOB ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.DOB}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Mobile No
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
                              placeholder="Mobile No"
                              name="MobileNo"
                              value={MobileNo}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="11"
                              required
                            />
                            {Error.MobileNo ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.MobileNo}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Email
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
                              placeholder="Email"
                              name="UserEmail"
                              value={UserEmail}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.email ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.email}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Password
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
                              type="password"
                              placeholder="Password"
                              name="UsrPass"
                              value={UsrPass}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.password ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.password}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                        <tr>
                          <td className="py-2" scope="row">
                            Confirm Password
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
                              type="password"
                              placeholder="Confirm Password"
                              name="con_pass"
                              value={con_pass}
                              onFocus={(e) => handleFocus(e)}
                              onChange={(e) => onChange(e)}
                              maxLength="50"
                              required
                            />
                            {Error.con_pass ? (
                              <p className="mx-auto d-table text-center text-warning m-0">
                                <small>{Error.con_pass}</small>
                              </p>
                            ) : null}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane p-0 m-0"
                role="tabpanel"
                style={Step === 3 ? { display: "block" } : { display: "none" }}
              >
                <table className="table table-hover table-borderless">
                  <tbody>
                    <tr>
                      <td className="py-2" scope="row">
                        Full Name
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
                          placeholder="Full Name"
                          name="FullName"
                          value={FullName}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          minLength="100"
                          required
                        />
                        {Error.FullName ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.FullName}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-0" scope="row">
                        Age
                      </td>
                      <td className="py-0">:</td>
                      <th className="pl-3 py-0">{CalculateAge()}</th>
                    </tr>
                    <tr>
                      <td className="py-2">NID/Birth No</td>
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
                          placeholder="Nid/Birth No"
                          name="Nid_BirthNo"
                          value={Nid_BirthNo}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="20"
                          required
                        />
                        {Error.Nid_BirthNo ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Nid_BirthNo}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Father Name
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
                          placeholder="Father Name"
                          name="FatherName"
                          value={FatherName}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="100"
                          required
                        />
                        {Error.FatherName ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.FatherName}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Mother Name
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
                          placeholder="Mother Name"
                          name="MotherName"
                          value={MotherName}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="100"
                          required
                        />
                        {Error.MotherName ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.MotherName}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Nationality
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={[{ label: "Bangladeshi" }]}
                          name="Nationality"
                          placeholder={"Please select nationality"}
                          styles={colourStyles}
                          value={
                            Nationality
                              ? { value: Nationality, label: Nationality }
                              : null
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Nationality: e.label,
                            })
                          }
                        />
                        {Error.Nationality ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Nationality}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Religion
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          className="p-0"
                          borderRadius={"0px"}
                          options={[
                            { label: "Islam", value: 1 },
                            { label: "Christians", value: 2 },
                            { label: "Hindus", value: 3 },
                            { label: "Buddhists", value: 4 },
                            { label: "Others", value: 5 },
                          ]}
                          name="Religion"
                          placeholder={"Please select religion"}
                          styles={colourStyles}
                          value={
                            Religion ? { value: Religion, label: Religion } : null
                          }
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Religion: e.label,
                            })
                          }
                        />
                        {Error.Religion ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Religion}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Gender
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={[
                            { label: "Male", value: 1 },
                            { label: "Female", value: 2 },
                            { label: "Others", value: 3 },
                          ]}
                          name="Gender"
                          placeholder={"Please select gender"}
                          styles={colourStyles}
                          value={Gender ? { value: Gender, label: Gender } : null}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Gender: e.label,
                            })
                          }
                        />
                        {Error.Gender ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Gender}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Occupation
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
                          placeholder="Occupation"
                          name="Occupation"
                          value={Occupation}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="200"
                          required
                        />
                        {Error.Occupation ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Occupation}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Educational Qualification
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
                          placeholder="Educational Qualification"
                          name="EducationalQualification"
                          value={EducationalQualification}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="500"
                          required
                        />
                        {Error.EducationalQualification ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.EducationalQualification}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className="tab-pane"
                role="tabpanel"
                style={Step === 4 ? { display: "block" } : { display: "none" }}
              >
                <table className="table table-hover table-borderless">
                  <tbody>
                    <tr>
                      <td className="py-2" scope="row">
                        Division
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={DivisionLists}
                          name="Division"
                          placeholder={"Please select division"}
                          styles={colourStyles}
                          value={
                            Division ? { value: Division, label: Division } : null
                          }
                          onChange={(e) => LoadZila(e)}
                        />
                        {Error.Division ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Division}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Zila
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={ZilaLists}
                          name="Zila"
                          placeholder={"Please select zila"}
                          styles={colourStyles}
                          value={Zila ? { value: Zila, label: Zila } : null}
                          onChange={(e) => LoadUpazila(e)}
                        />
                        {Error.Zila ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Zila}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Upazila/City Corporation
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={UpazilaLists}
                          name="Upazila"
                          placeholder={"Please select upazila"}
                          styles={colourStyles}
                          value={
                            Upazila ? { value: Upazila, label: Upazila } : null
                          }
                          onChange={(e) => LoadUnion(e)}
                        />
                        {Error.Upazila ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Upazila}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Union
                      </td>
                      <td className="py-2">:</td>
                      <th className="py-2">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={UnionLists}
                          name="Union"
                          placeholder={"Please select union"}
                          styles={colourStyles}
                          value={Union ? { value: Union, label: Union } : null}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Union: e.label,
                            })
                          }
                        />
                        {Error.Union ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.Union}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Village/Road Name
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
                          placeholder="Village Name"
                          name="VillageName"
                          value={VillageName}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="100"
                          required
                        />
                        {Error.VillageName ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.VillageName}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>

                    <tr>
                      <td className="py-2" scope="row">
                        Ward No
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
                          placeholder="Ward No"
                          name="WardNo"
                          value={WardNo}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="2"
                          required
                        />
                        {Error.WardNo ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.WardNo}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Holding No
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
                          placeholder="Holding No"
                          name="HoldingNo"
                          value={HoldingNo}
                          onChange={(e) => onChange(e)}
                          minLength="6"
                          required
                        />
                        {Error.HoldingNo ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.HoldingNo}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                    <tr>
                      <td className="py-2" scope="row">
                        Postal Code
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
                          placeholder="Postal Code"
                          name="PostalCode"
                          value={PostalCode}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => onChange(e)}
                          maxLength="11"
                          required
                        />
                        {Error.PostalCode ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.PostalCode}</small>
                          </p>
                        ) : null}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className="tab-pane"
                role="tabpanel"
                style={Step === 5 ? { display: "block" } : { display: "none" }}
              >
                <label className="fw-bolder m-0">Reference</label>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="border py-2 m-2 w-50" scope="row">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={RefLists}
                          name="RefName"
                          placeholder={"Select referral name"}
                          styles={colourStyles}
                          value={!RefName ? null : { label: RefName }}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              RefName: e.label,
                              RefID: e.value,
                            })
                          }
                        />
                        {Error.RefID ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.RefID}</small>
                          </p>
                        ) : null}
                      </td>
                      <td className="border py-2 m-2">
                        <input
                          style={{
                            backgroundColor: "#F4F7FC",
                            border: "0px solid #F4F7FC",
                            fontWeight: "bold",
                            width: "100%",
                            paddingLeft: "5px",
                          }}
                          type="text"
                          placeholder="Reference Id"
                          name="RefID"
                          value={RefID ? RefID : null}
                          onChange={(e) => LoadRefId(e)}
                          minLength="10"
                          required
                        />
                        {Error.RefID ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.RefID}</small>
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <label className="fw-bolder m-0">Representative</label>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="border py-2 m-2 w-50" scope="row">
                        <Select menuPortalTarget={document.body}
                          borderRadius={"0px"}
                          options={RepLists}
                          name="RepName"
                          placeholder={"Select rep. name"}
                          styles={colourStyles}
                          value={RepName ? { label: RepName } : null}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              RepName: e.label,
                              RepID: e.value,
                            })
                          }
                        />
                        {Error.RepID ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.RepID}</small>
                          </p>
                        ) : null}
                      </td>
                      <td className="border py-2 m-2">
                        <input
                          style={{
                            backgroundColor: "#F4F7FC",
                            border: "0px solid #F4F7FC",
                            fontWeight: "bold",
                            width: "100%",
                            paddingLeft: "5px",
                          }}
                          type="text"
                          placeholder="Rep. ID"
                          name="RepID"
                          value={RepID ? RepID : null}
                          onFocus={(e) => handleFocus(e)}
                          onChange={(e) => LoadRepId(e)}
                          minLength="100"
                          required
                        />
                        {Error.RepID ? (
                          <p className="mx-auto d-table text-center text-warning m-0">
                            <small>{Error.RepID}</small>
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="border py-2 m-2" scope="row">
                        <label className="fw-bolder m-0">Hard Copies</label>
                      </td>
                      <td className="border py-2 m-2" scope="row">
                        <label className="fw-bolder m-0">User Access</label>
                      </td>
                    </tr>
                    <tr>
                      <td className="border py-2 m-2" scope="row">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Nid"
                            name="NIDCopy"
                            checked={NIDCopy}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !NIDCopy ? true : false,
                              });
                            }}
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
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !Agreement ? true : false,
                              });
                            }}
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
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !BankCheque ? true : false,
                              });
                            }}
                          />
                          <label className="form-check-label" for="BankCheque">
                            Blank Cheque
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="TradeLicence"
                            name="TradeLicence"
                            checked={TradeLicence}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !TradeLicence ? true : false,
                              });
                            }}
                          />
                          <label className="form-check-label" for="TradeLicence">
                            Trade Licence
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
                            checked={is_block}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !is_block ? true : false,
                              });
                            }}
                          />
                          <label className="form-check-label" for="Block">
                            Block
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Active"
                            name="is_active"
                            checked={is_active}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !is_active ? true : false,
                              });
                            }}
                          />
                          <label className="form-check-label" for="Active">
                            Active
                          </label>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="CEO"
                            name="is_ceo"
                            checked={is_ceo}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [e.target.name]: !is_ceo ? true : false,
                              });
                            }}
                          />
                          <label className="form-check-label" for="CEO">
                            CEO (Chief Executive Officer)
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-2" role="toolbar" style={{ textAlign: "center" }}>
              {Step === 1 ? null : (
                <button
                  className="btn btn-outline-success m-2"
                  type="button"
                  onClick={() => setStep(Step === 1 ? 2 : Step - 1)}
                >
                  <span aria-hidden="true">&larr;</span>
                  {" Previous"}
                </button>
              )}

              {Step === 5 ? (
                <button
                  className="btn btn-outline-success m-2"
                  type="button"
                  onClick={(e) => onSubmit(e)}
                >
                  {"Submit"}
                </button>
              ) : (
                <button
                  className="btn btn-outline-success m-2"
                  type="button"
                  onClick={() => setStep(Step === 5 ? 4 : Step + 1)}
                >
                  {"Next"} <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  display: state.OverlayDisplay,
  data: state.auth.user,
});

export default connect(mapStateToProps, { logout })(CreateCompany);
