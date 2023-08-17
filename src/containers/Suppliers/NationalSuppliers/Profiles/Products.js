import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ProductProList, SaveProductPro, UnitNameList, UpdateProductImage, UpdateProductPro } from '../../../../actions/SuppliersAPI';
import { logout } from '../../../../actions/auth';

import Select from 'react-select';
import { findUnique } from '../../../../actions/APIHandler';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { CreateMessage } from "../../../Modals/ModalForm.js";
import { CategoryList } from '../../Class/Category';

const Products = ({ SupplierID, list, setList, ProdcutPro, setProductPro, no }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [SearchKey, setSearchKey] = useState(false)
    const [TempData, setTempData] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [Visibility, setVisibility] = useState("d-table");
    const [AccordLbl, setAccordLbl] = useState("Add New Product Profile");
    let toastProperties = null;
    const dispatch = useDispatch();


    const [formData, setFormData] = useState({
        id: "",
        Title: "",
        Description: null,
        Specification: null,
        UnitName: null,
        Category: null,
        Status: null,
        Image: "",
        ImagePrv: ""
    });

    useEffect(() => {
        LoadProductList()
    }, [])

    const LoadProductList = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var ProductList = await ProductProList(SupplierID);
        if (ProductList !== true)
            setData(ProductList.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const { id, Title, Description, Specification, UnitName, Category, Status, Image, ImagePrv } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onBlur = (e) => {
        if (e.target.value === "") { setFormData({ ...formData, [e.target.name]: TempData, }); }
    }

    const handleFocus = (e) => {
        setTempData(e.target.value)
        e.target.select()
    };

    const Create_Product_Pro = async e => {
        e.preventDefault();
        setCreateModalShow(false)
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await SaveProductPro(SupplierID, Title, Description, Specification, UnitName, Category, Status, Image, ImagePrv);
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
                LoadProductList();
                AccordionToggle();
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to save product profile. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };

    const Update_Product_Pro = async e => {
        setUpdateModalShow(false)
        setError({})
        dispatch({
            type: DISPLAY_OVERLAY,
            payload: true
        });
        e.preventDefault();
        const result = await UpdateProductPro(SupplierID, id, Title, Description, Specification, UnitName, Category, Status, Image, ImagePrv);
        if (result !== true) {
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
                LoadProductList();
                AccordionToggle();
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update product profile. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
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
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ImageRemove = () => {
        setFormData({ ...formData, "ImagePrv": '' })
    }

    const UploadImage = async e => {
        e.preventDefault();
        const result = await UpdateProductImage(id, Image);
    };

    const AccordionToggle = () => {
        setFormData({
            id: "",
            Title: "",
            Description: "",
            Specification: "",
            UnitName: null,
            Category: null,
            Status: null,
            Image: "",
            ImagePrv: ""
        });
        setStep(Step === "ProductAddition" ? null : "ProductAddition");
        setVisibility(Visibility === "d-none" ? "d-table" : "d-none")
        setAccordLbl("Add New Product Profile")
    }

    const EditProduct = (item) => {
        setFormData(item)
        setFormData({
            id: item.id,
            Title: item.Title,
            Description: item.Description,
            Specification: item.Specification,
            UnitName: item.UnitName,
            Category: item.Category,
            Status: item.Status,
            Image: "",
            ImagePrv: item.Image
        });

        setStep(Step === "ProductAddition" ? null : "ProductAddition");
        setVisibility(Visibility === "d-none" ? "d-table" : "d-none")
        setAccordLbl("Update Product")
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "40vh", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_search = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Title) : null;

    let ProductList
    ProductList = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = SearchKey ? item.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, Title, UnitName, Category, Description, Specification, Image, Status, SupplierID, UpdatedAt, UpdatedBy }) {
        return { id, Title, UnitName, Category, Description, Specification, Image, Status, SupplierID, UpdatedAt, UpdatedBy };
    }) : null

    var h = window.innerHeight - 352;

    return (
        <div className="position-relative h-100">

            <div className="row justify-content-center mx-auto d-table w-100 h-100">
                {
                    no <= 7 || no === 11 ?
                        <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table px-0">
                            <div className="accordion accordion-flush px-0" id="accordionFlushExample">
                                <div className="accordion-item border-0 bg-transparent">
                                    <p className="accordion-header m-0" id="flush-headingOne">
                                        <button
                                            className={`cs_accordion-button ${Step === "ProductAddition" ? "collapse show" : "collapsed"} shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`}
                                            style={{ borderLeft: "5px solid #28A745" }}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseOne"
                                            aria-expanded={Step === "ProductAddition" ? "true" : "false"}
                                            aria-controls="flush-collapseOne"
                                            id="ProductAddition" onClick={() => AccordionToggle()}>
                                            {AccordLbl}
                                        </button>
                                    </p>
                                    <div id="ProductAddition" className={`accordion-collapse collapse ${Step === "ProductAddition" ? "show" : null}`} aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{}}>
                                        <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table h-100">
                                            <div className="row mb-5">
                                                <div className="col-lg-3 justify-content-center mx-auto d-table"
                                                    style={{
                                                        backgroundColor: "#F4F7FC",
                                                        border: "1px solid #d3d3d3",
                                                        fontWeight: "bold",
                                                        maxWidth: "180px",
                                                    }}>
                                                    <p className="mx-auto d-table border-bottom w-100 mb-2 text-center">Product Image</p>

                                                    <div className="img_container">
                                                        <img
                                                            src={ImagePrv ? ImagePrv : process.env.REACT_APP_API_URL + "/Media/upload_images.png"}
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
                                                                title="Choose Logo"
                                                            >
                                                                <i className="fad fa-images"></i>
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
                                                                        <i className="fad fa-minus-circle"></i>
                                                                    </button>
                                                                </Fragment>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {Error.Image ?
                                                        <tr>
                                                            <td colspan="3" className='p-0'>
                                                                <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Image}</small></p>
                                                            </td>
                                                        </tr> : null
                                                    }
                                                </div>


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
                                                                    disabled
                                                                />
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2">Title</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <input
                                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                    type='text'
                                                                    placeholder='Title'
                                                                    name='Title'
                                                                    value={Title}
                                                                    onFocus={e => handleFocus(e)}
                                                                    onChange={e => onChange(e)}
                                                                    onBlur={(e) => onBlur(e)}
                                                                    maxLength='50'
                                                                    required
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.Title ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                        <tr>
                                                            <td className="py-2" scope="row">Description</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <input
                                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                    type='text'
                                                                    placeholder='Description'
                                                                    name='Description'
                                                                    value={Description}
                                                                    onFocus={e => handleFocus(e)}
                                                                    onChange={e => onChange(e)}
                                                                    onBlur={(e) => onBlur(e)}
                                                                    maxLength='50'
                                                                    required
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.Description ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Description}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                        <tr>
                                                            <td className="py-2" scope="row">Specification</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <input
                                                                    style={{ backgroundColor: "#F4F7FC", border: "0px solid #F4F7FC", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                                                    type='text'
                                                                    placeholder='Specification'
                                                                    name='Specification'
                                                                    value={Specification}
                                                                    onChange={e => onChange(e)}
                                                                    onBlur={(e) => onBlur(e)}
                                                                    required
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.Specification ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Specification}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                        <tr>
                                                            <td className="py-2" scope="row">Product Unit</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <Select
                                                                    menuPortalTarget={document.body}
                                                                    borderRadius={"0px"}
                                                                    options={UnitNameList}
                                                                    name="UnitName"
                                                                    isMulti
                                                                    placeholder={"Please select products unit"}
                                                                    styles={colourStyles}
                                                                    value={UnitName}
                                                                    onChange={(e) => setFormData({ ...formData, UnitName: e })}
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.UnitName ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitName}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                        <tr>
                                                            <td className="py-2" scope="row">Category</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <Select
                                                                    menuPortalTarget={document.body}
                                                                    borderRadius={"0px"}
                                                                    options={CategoryList}
                                                                    name="Category"
                                                                    placeholder={"Select product category"}
                                                                    styles={colourStyles}
                                                                    value={Category ? { label: Category } : null}
                                                                    onChange={(e) => setFormData({ ...formData, Category: e.label })}
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.Category ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Category}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                        <tr>
                                                            <td className="py-2" scope="row">Status</td>
                                                            <td className="py-2">:</td>
                                                            <th className="py-2">
                                                                <Select
                                                                    menuPortalTarget={document.body}
                                                                    borderRadius={"0px"}
                                                                    options={[{ value: 1, label: "Available" }, { value: 2, label: "Unavilable" }, { value: 3, label: "Withdraw" }]}
                                                                    name="Status"
                                                                    placeholder={"Select product status"}
                                                                    styles={colourStyles}
                                                                    value={Status ? { label: Status } : null}
                                                                    onChange={(e) => setFormData({ ...formData, Status: e.label, })}
                                                                />
                                                            </th>
                                                        </tr>
                                                        {Error.Status ?
                                                            <tr>
                                                                <td colspan="3" className='p-0'>
                                                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                                                </td>
                                                            </tr> : null
                                                        }
                                                    </tbody>

                                                </table>

                                                <div className="flex-1 text-center">
                                                    {
                                                        AccordLbl === "Update Product" ?
                                                            <button className='btn btn-outline-success form-rounded px-4  m-2' type='button' title="Update bank account" onClick={e => setUpdateModalShow(true)}>Update</button>
                                                            :
                                                            <button className='btn btn-outline-success form-rounded px-4' title="Add new bank account" type='button' onClick={e => setCreateModalShow(true)}>Submit</button>
                                                    }
                                                </div>

                                                {/* Add Bank Confirmation  */}
                                                <CreateMessage
                                                    header="Add New Product Profile Profile"
                                                    body_header={Title}
                                                    body={"Are you sure want to add " + Title + "?"}
                                                    show={CreateModalShow}
                                                    Click={(e) => Create_Product_Pro(e)}
                                                    onHide={() => setCreateModalShow(false)}
                                                />

                                                {/* Update Confirmation  */}
                                                <CreateMessage
                                                    header="Update Product Info"
                                                    body_header={Title}
                                                    body={"Are you sure want to update " + Title + "?"}
                                                    show={UpdateModalShow}
                                                    Click={(e) => Update_Product_Pro(e)}
                                                    onHide={() => setUpdateModalShow(false)}
                                                />

                                                {/* Delete Confirmation */}
                                                {/* <CreateMessage
                                                header="Remove Bank Info"
                                                body_header={BankName}
                                                body={"Are you sure want to remove " + BankName + " " + BankBranchName + " Branch info?"}
                                                show={DeleteModalShow}
                                                Click={(e) => DeleteBank(e)}
                                                onHide={() => setDeleteModalShow(false)}
                                            /> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        :
                        null
                }

                <div className={`d-flex justify-content-between bg-white py-2 border-bottom ${Visibility}`}>
                    <div className='my-auto text-center'>
                        <p className='display-6 fw-bold m-0 text-uppercase text-left'><Link className="fad fa-chevron-left px-2 text-dark text-decoration-none" to={`${no === 7 || no === 8 || no === 9 ? `/bis_national_supplier_list` : `/national_supplier_list`}`}></Link> PRODUCT PROFILES</p>
                    </div>
                    <div className="d-flex justify-content-end mx-2" style={{ minWidth: "10vh" }}>
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            // options={Data.map}
                            options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.Title, value: item.id })) : []}
                            defaultValue={{ label: "Select Dept", value: 0 }}
                            name="Division"
                            placeholder={"Search"}
                            styles={CScolourStyles}
                            value={SearchKey}
                            onChange={(e) => setSearchKey(e)}
                            required
                            id="Title"
                            isClearable={true}
                            isSearchable={true}
                        />
                    </div>
                </div>

                <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                    <table className={`table table-hover table-borderless bg-white mt-1 ${Visibility}`}>
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span> </th>
                                <th className="border-right p-1" style={{ width: "300px" }}> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Product ID</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Title</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Category</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit Names</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span> </th>
                                <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase">Action</span> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(ProductList) && ProductList.length ? ProductList.map((item, n) => (
                                    <tr className="border-bottom text-center" key={n}>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{n + 1}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.id}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.Title}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Category}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{Array.isArray(item.UnitName) && item.UnitName.length ? item.UnitName.map((item) => item.label + " ") : "N/A"}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Status}</span> </td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                            {
                                                no <= 7 || no === 11 ?
                                                    <Fragment>
                                                        <button className="btn fs-4 px-2 py-0 fad fa-trash text-dark" />
                                                        <button className="btn fs-4 px-2 py-0 fad fa-edit text-dark" onClick={() => EditProduct(item)} />
                                                    </Fragment>
                                                    :
                                                    null
                                            }
                                            <Link className="btn fs-4 px-2 py-0 fad fa-eye text-dark" to={`${`/product_item/${item.SupplierID}/${item.id}`}`} onClick={() => setProductPro(item)}
                                            />
                                        </span>
                                        </td>
                                    </tr>
                                ))
                                    :
                                    <tr className="text-center">
                                        <td colSpan="7" className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                            No Product Found!
                                        </span></td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
    sub_scale: state.auth.sub_scale,
    setProdcutPro: props.setProdcutPro,
    ProdcutPro: props.ProdcutPro,
    setList: props.setList,
    list: props.list,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(Products);