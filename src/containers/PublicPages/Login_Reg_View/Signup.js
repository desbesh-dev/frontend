import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";

import axios from "axios";
import Select from "react-select";
import { signup } from "../../../actions/auth";
import { DISPLAY_OVERLAY } from "../../../actions/types";

const Signup = ({ signup, isAuthenticated }) => {
  const dispatch = useDispatch();
  let history = useHistory();

  const [accountCreated, setAccountCreated] = useState(false);
  const [Next, setNext] = useState(false);
  const initialValue = { value: 0, label: "" };
  const [DivisionLists, setDivisionLists] = useState(initialValue);
  const [ZilaLists, setZilaLists] = useState(initialValue);
  const [UpazilaLists, setUpazilaLists] = useState(initialValue);
  const [ZilaCode, setZilaCode] = useState(null);
  const [UnionLists, setUnionLists] = useState(initialValue);
  // const [DetailsError, setDetailsError] = useState({});
  const [Error, setError] = useState({});
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    con_pass: "",
    MobileNo: "",

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
  });



  useEffect(() => {
    LoadDivision();
  }, []);

  const {
    FirstName,
    LastName,
    email,
    password,
    con_pass,
    MobileNo,
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
  } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      FullName: FirstName + " " + LastName,
    });

  const onSubmit = (e) => {
    dispatch({
      type: DISPLAY_OVERLAY,
      payload: true,
    });
    e.preventDefault();

    if (password === con_pass) {
      var status = signup(
        FirstName,
        LastName,
        email,
        password,
        con_pass,
        MobileNo,
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
        Image
      );
      status.then((value) => {
        const updatedState = {};
        for (var pair of value.data.exception.entries()) {
          updatedState[pair[1].field] = pair[1].message;
          setError({
            ...updatedState,
          });
        }

        if (value.data.user_error) {



          setAccountCreated(false);
          dispatch({
            type: DISPLAY_OVERLAY,
            payload: false,
          });
          setNext(false);
        } else if (value.data.details_error) {

          setAccountCreated(false);
          setNext(true);
          dispatch({
            type: DISPLAY_OVERLAY,
            payload: false,
          });
        } else {
          setAccountCreated(true);
          dispatch({
            type: DISPLAY_OVERLAY,
            payload: false,
          });
        }
      });

      // if (status){
      //     setAccountCreated(true);
      // }
    }


    dispatch({
      type: DISPLAY_OVERLAY,
      payload: false,
    });
  };

  const LoadDivision = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/union/`,
        formData,
        config
      );
      setDivisionLists(res.data.Data);
      // var data = {};
      // let optionItems = res.data.Data.map(countries =>{
      //     var data = { value: countries.DivisionCode, label: countries.Name };
      //     return data
      // });
    } catch (err) {

    }
  };

  const LoadZila = async (e) => {
    setFormData({ ...formData, Division: e.label });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/zila/{e.value}`,
        formData,
        config
      );
      setZilaLists(res.data.Data);
    } catch (err) {

    }
  };

  const LoadUpazila = async (e) => {
    setFormData({ ...formData, Zila: e.label });
    setZilaCode(e.value);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/upazila/${e.value}`,
        formData,
        config
      );
      setUpazilaLists(res.data.Data);
    } catch (err) {

    }
  };

  const LoadUnion = async (e) => {
    setFormData({ ...formData, Upazila: e.label });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/union/${ZilaCode}/${e.value}`,
        formData,
        config
      );
      setUnionLists(res.data.Data);
    } catch (err) {

    }
  };

  const continueWithGoogle = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`
      );
      window.location.replace(res.data.authorization_url);
    } catch (err) { }
  };

  const continueWithFacebook = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`
      );
      window.location.replace(res.data.authorization_url);
    } catch (err) { }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  if (accountCreated) {
    return <Redirect to="/login" />;
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderRadius: "20px",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        // color: '#FFF',
        cursor: isDisabled ? "not-allowed" : "default",
        borderRadius: "20px",
      };
    },
    menu: (base) => ({
      ...base,
      borderRadius: "20px",
      marginTop: "1px",
      border: "1px solid rgba(38, 41, 228, 0.5)",
      outline: 0,
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: (base) => ({
      ...base,
      padding: "5px",
    }),
  };
  return (
    <div className="row h-100">
      <div className="col-sm-12 col-md-10 col-lg-8 mx-auto d-table h-100">
        <div className="d-table-cell align-middle">
          <div className="container mt-5">
            <h1>Sign Up</h1>

            <form onSubmit={(e) => onSubmit(e)}>
              {!Next ? (
                <div>
                  <p>Please type general information</p>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="Number"
                        placeholder="Mobile No"
                        name="MobileNo"
                        value={MobileNo}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.MobileNo ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.MobileNo}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="email"
                        placeholder="email*"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                      />
                      {Error.email ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.email}</small>
                        </p>
                      ) : null}
                    </div>

                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="First Name*"
                        name="FirstName"
                        value={FirstName}
                        onChange={(e) => onChange(e)}
                        required
                      />
                      {Error.FirstName ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.FirstName}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Last Name*"
                        name="LastName"
                        value={LastName}
                        onChange={(e) => onChange(e)}
                        required
                      />
                      {Error.LastName ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.LastName}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="password"
                        placeholder="password*"
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.password ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.password}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="password"
                        placeholder="Confirm password*"
                        name="con_pass"
                        value={con_pass}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.con_pass ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.con_pass}</small>
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNext(true)}
                    className="btnCustom btnCustom-outline-secondary form-rounded mb-5 px-4"
                  >
                    {" "}
                    Next <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              ) : (
                <dive>
                  <br />
                  <label>Please type user details</label>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Nid or Birth Certificate No*"
                        name="Nid_BirthNo"
                        value={Nid_BirthNo}
                        onChange={(e) => onChange(e)}
                        required
                      />
                      {Error.Nid_BirthNo ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Nid_BirthNo}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="date"
                        placeholder="Date of birth*"
                        name="DOB"
                        value={DOB}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            DOB: event.target.value,
                          })
                        }
                        required
                      />
                      {Error.DOB ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.DOB}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Father name*"
                        name="FatherName"
                        value={FatherName}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.FatherName ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.FatherName}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Mother name*"
                        name="MotherName"
                        value={MotherName}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.MotherName ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.MotherName}</small>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <br />
                  <label>Please type user address</label>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <input
                        className="form-control form-rounded pl-3"
                        type="Number"
                        placeholder="Holding no"
                        name="HoldingNo"
                        value={HoldingNo}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.HoldingNo ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.HoldingNo}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-4">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Ward No*"
                        name="WardNo"
                        value={WardNo}
                        onChange={(e) => onChange(e)}
                        minLength="1"
                        required
                      />
                      {Error.WardNo ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.WardNo}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-4">
                      <input
                        className="form-control form-rounded pl-3"
                        borderRadius={"20px"}
                        type="text"
                        placeholder="Village name*"
                        name="VillageName"
                        value={VillageName}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.VillageName ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.VillageName}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-4">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={DivisionLists}
                        name="Division"
                        placeholder={"Please select division"}
                        styles={colourStyles}
                        // value={Nationality}
                        onChange={(e) => LoadZila(e)}
                        required
                      />
                      {Error.Division ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Division}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-4">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={ZilaLists}
                        name="Zila"
                        placeholder={"Please select zila"}
                        styles={colourStyles}
                        onChange={(e) => LoadUpazila(e)}
                        required
                      />
                      {Error.Zila ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Zila}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-4">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={UpazilaLists}
                        name="Upazila"
                        placeholder={"Please select upazila"}
                        styles={colourStyles}
                        onChange={(e) => LoadUnion(e)}
                        required
                      />
                      {Error.Upazila ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Upazila}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={UnionLists}
                        name="Union"
                        placeholder={"Please select union"}
                        styles={colourStyles}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Union: e.label,
                          })
                        }
                        required
                      />
                      {Error.Union ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Union}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Postal code*"
                        name="PostalCode"
                        value={PostalCode}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.PostalCode ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.PostalCode}</small>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <br />
                  <label>Please type user other information</label>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={[{ label: "Bangladeshi" }]}
                        name="Nationality"
                        placeholder={"Please select nationality"}
                        styles={colourStyles}
                        // value={Nationality}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Nationality: e.label,
                          })
                        }
                      />
                      {Error.Nationality ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Nationality}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
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
                        // value={Religion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Religion: e.label,
                          })
                        }
                      />
                      {Error.Religion ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Religion}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <Select menuPortalTarget={document.body}
                        className="form-rounded"
                        borderRadius={"20px"}
                        options={[
                          { label: "Male", value: 1 },
                          { label: "Female", value: 2 },
                          { label: "Others", value: 3 },
                        ]}
                        name="Gender"
                        placeholder={"Please select gender"}
                        styles={colourStyles}
                        // value={Gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            Gender: e.label,
                          })
                        }
                      />
                      {Error.Gender ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Gender}</small>
                        </p>
                      ) : null}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Occupation*"
                        name="Occupation"
                        value={Occupation}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.Occupation ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Occupation}</small>
                        </p>
                      ) : null}
                    </div>

                    <div className="form-group col-md-6">
                      <input
                        className="form-control form-rounded pl-3"
                        type="text"
                        placeholder="Educational qualification*"
                        name="EducationalQualification"
                        value={EducationalQualification}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                        required
                      />
                      {Error.EducationalQualification ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.EducationalQualification}</small>
                        </p>
                      ) : null}
                    </div>

                    <div className="form-group col-md-6">
                      <span className="control-fileupload form-rounded pl-3">
                        <label htmlFor="file1" className="text-right">
                          Please choose your image.
                        </label>
                        <input
                          type="file"
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              Image: event.target.files[0],
                            })
                          }
                          accept=".jpg"
                          id="file1"
                        />
                      </span>
                      {Error.Image ? (
                        <p className="text-center text-warning m-0">
                          <small>{Error.Image}</small>
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    className="btnCustom btnCustom-outline-secondary form-rounded px-4"
                    type="submit"
                  >
                    Register
                  </button>
                </dive>
              )}
            </form>

            <button
              className="btn btn-danger mt-3"
              onClick={continueWithGoogle}
            >
              Continue With Google
            </button>
            <br />
            <button
              className="btn btn-primary mt-3"
              onClick={continueWithFacebook}
            >
              Continue With Facebook
            </button>
            <p className="mt-3">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { signup })(Signup);
