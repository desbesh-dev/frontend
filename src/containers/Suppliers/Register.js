import { SaveSupplier } from '../../actions/SuppliersAPI';
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { CreateMessage } from "../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../actions/types';
import { Fragment } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { checkToken } from '../../actions/auth';
import { logout } from '../../actions/auth';
import errorIcon from '../../assets/error.png';

import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';

const SupplierReg = ({ props, display, list, setList, scale, sub_scale }) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const [Error, setError] = useState({});
    const [modalShow, setModalShow] = useState(false);
    let toastProperties = null;

    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [Step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        SupplierName: '',
        Established: '',
        Products: null,
        Address: '',
        Contact: '',
        Email: '',
        Fax: '',
        Website: '',
        Status: 0,
        Logo: '',
        LogoPrv: '',
    });
    const { SupplierName, Products, Address, Contact, Email, Fax, Website, Status, Logo, LogoPrv } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFocus = (e) => e.target.select()

    const onSubmit = async e => {
        setModalShow(false)
        setError({})
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await SaveSupplier(SupplierName, Products, Address, Contact, Email, Fax, Website, 1, Logo, LogoPrv);
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
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to supplier registration. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };

    const ImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFormData({ ...formData, "Logo": file, "LogoPrv": reader.result })
        }
        reader.readAsDataURL(file)
    }

    const ImageRemove = () => {
        setFormData({ ...formData, "LogoPrv": '' })
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


    return (
        <div className="container-fluid">
            <div className="header mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/my_supplier_list">My Suppliers</Link></li>
                        <li className="breadcrumb-item"><Link to="/supplier_reg">Add New Suuplier</Link></li>
                    </ol>
                </nav>
                <p className="display-6 mx-auto d-table m-0">Register New Suppliers</p>

            </div>
            <div className="row h-100 w-100">
                <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                    <div className="tab-pane" role="tabpanel" style={Step === 1 ? { display: "block" } : { display: "none" }}>
                        <div className="row">
                            <div className="col-lg-3 mx-auto d-table h-100 m-0 p-2" style={{ backgroundColor: "#F4F7FC", border: "1px solid #d3d3d3", fontWeight: "bold" }}>
                                <p className='mx-auto d-table border-bottom w-100 mb-2 text-center'>Company Logo</p>

                                <div className="img_container">
                                    <img src={LogoPrv ? LogoPrv : process.env.REACT_APP_API_URL + "/Media/avatar.jpg"} className="image img-fluid rounded-square mx-auto d-table" width="150" alt="avatar" />

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
                                        {LogoPrv ?
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
                            <div className="col-lg-8 ml-3">
                                <table className="table table-hover table-borderless">
                                    <tbody>
                                        <tr>
                                            <td className="py-2">Supplier Title</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Supplier Title'
                                                    name='SupplierName'
                                                    value={SupplierName}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='100'
                                                    required
                                                />
                                                {Error.SupplierName ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.SupplierName}</small></p>
                                                    : null}
                                            </th>
                                        </tr>

                                        <tr>
                                            <td className="py-2" scope="row">Product Types</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    closeMenuOnSelect={false}
                                                    borderRadius={"0px"}
                                                    options={[{ value: 1, label: "Soft Drink" }, { value: 2, label: "Meat" }, { value: 3, label: "Chick" }]}
                                                    name="Products"
                                                    isMulti
                                                    placeholder={"Please select products"}
                                                    styles={colourStyles}
                                                    value={Products}
                                                    onChange={(e) => setFormData({ ...formData, Products: e })}
                                                />
                                                {
                                                    Error.Products ?
                                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Products}</small></p>
                                                        : null
                                                }
                                            </th>
                                        </tr>

                                        <tr>
                                            <td className="py-2" scope="row">Corporate Address</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Corporate Address'
                                                    name='Address'
                                                    value={Address}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
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
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
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
                                            <td className="py-2" scope="row">Email</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='email'
                                                    placeholder='Email'
                                                    name='Email'
                                                    value={Email}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                                {Error.Email ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Email}</small></p>
                                                    : null}
                                            </th>
                                        </tr>

                                        <tr>
                                            <td className="py-2" scope="row">Fax</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='fax'
                                                    placeholder='Fax'
                                                    name='Fax'
                                                    value={Fax}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                                {Error.Fax ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Fax}</small></p>
                                                    : null}
                                            </th>
                                        </tr>

                                        <tr>
                                            <td className="py-2" scope="row">Website</td>
                                            <td className="py-2">:</td>
                                            <th className="py-2">
                                                <input
                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                    type='text'
                                                    placeholder='Domain Address'
                                                    name='Website'
                                                    value={Website}
                                                    onFocus={e => handleFocus(e)}
                                                    onChange={e => onChange(e)}
                                                    maxLength='50'
                                                    required
                                                />
                                                {Error.Website ?
                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Website}</small></p>
                                                    : null}
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>

                    </div>

                    <div className="p-2" role="toolbar" style={{ textAlign: "center" }}>
                        <button className="btn btn-outline-success m-2" type="button" onClick={() => setModalShow(true)}>Submit</button>
                    </div>

                    <CreateMessage
                        header="Supplier Creation"
                        body_header={SupplierName}
                        body={"Are you sure want to create " + SupplierName + "  as supplier company?"}
                        show={modalShow}
                        Click={(e) => onSubmit(e)}
                        onHide={() => setModalShow(false)}
                    />

                </div>
            </div>
        </div>
    )

};
const mapStateToProps = (state, props) => ({
    data: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    props: props
});

export default connect(mapStateToProps, { logout })(SupplierReg);