import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { FetchProductCode, SaveProductItem, UnitNameList, UpdateProductItem } from "../../../../../actions/SuppliersAPI";
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

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

export const CreateItem = (props) => {

    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        id: '',
        ProductID: props.ProductID,
        Code: '',
        Barcode: '',
        Title: '',
        UnitName: null,
        UnitQty: '',
        UnitWeight: '',
        PackType: null,
        Status: '',
    });

    const { id, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        LoadProductCode();
    }, [])

    const LoadProductCode = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchProductCode();

        if (result !== true) {
            setFormData({ ...formData, Code: result });
        } else {
            props.onHide();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            id: props.item.id,
            ProductID: props.item.ProductID,
            Code: props.item.Code,
            Barcode: props.item.Barcode,
            Title: props.item.Title,
            UnitName: props.item.UnitName,
            UnitQty: props.item.UnitQty,
            UnitWeight: props.item.UnitWeight,
            PackType: props.item.PackType,
            Status: parseInt(props.item.Status) === 1 ? "Available" : parseInt(props.item.Status) === 2 ? "Unavailable" : parseInt(props.item.Status) === 3 ? "Withdraw" : 'N/A',
        });
        props.onHide()

    }

    const PackList = [
        { value: 1, label: "Bolus" },
        { value: 2, label: "Bottle" },
        { value: 3, label: "Carton" },
        { value: 4, label: "Bag" },
        { value: 5, label: "Loose" },
        { value: 6, label: "Container" },
        { value: 7, label: "Aluminium Foil" },
        { value: 8, label: "Injectable/Vial" },
        { value: 9, label: "Paper Board" },
        { value: 10, label: "Paper" },
        { value: 11, label: "Lamitube" },
        { value: 11, label: "Box" },
        { value: 11, label: "Pack" },
        { value: 11, label: "Mini Pack" },
        { value: 12, label: "Casket" },
        { value: 13, label: "Sack" }
    ]
    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }
    const Create_Product_Item = async e => {
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        let Package = 0
        if ([props.SupplierID, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status].some(el => !isStringNullOrWhiteSpace(el))) {
            const result = await SaveProductItem(props.SupplierID, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status);
            if (result !== true) {
                if (result.error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({
                            ...updatedState,
                        });
                    }
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: 'Invalid',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: warningIcon
                    }])
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                } else {
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: 'Success',
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: successIcon
                    }])
                    props.onClose();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to save product item. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2 justify-content-center" closeButton>
                <p className="fs-4 fw-bold text-dark text-center m-0">
                    Add New Product Item <br />
                    <small>Please fill the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table className="table table-bordered px-3">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-2" scope="row">Code</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2 d-flex">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Code'
                                        name='Code'
                                        value={Code}
                                        onChange={e => onChange(e)}
                                        minLength='0'
                                        required
                                        disabled
                                    />
                                </th>
                            </tr>
                            <tr>
                                <td className="py-2" scope="row">Profile ID</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <tr className="py-2 d-flex">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='text'
                                        placeholder='Product ID'
                                        name='ProductID'
                                        value={ProductID}
                                        onChange={e => onChange(e)}
                                        required
                                        disabled
                                    />
                                </tr>
                            </tr>
                            {
                                Error.ProductID ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProductID}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2">Title</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='text'
                                        placeholder='Title'
                                        name='Title'
                                        value={Title}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.Title ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2">Pack Type</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                        borderRadius={"0px"}
                                        options={PackList}
                                        name="PackType"
                                        placeholder={"Please select pack type"}
                                        styles={colourStyles}
                                        value={PackType ? { label: PackType } : null}
                                        onChange={(e) => setFormData({ ...formData, PackType: e.label })}
                                    />
                                </th>
                            </tr>
                            {
                                Error.PackType ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PackType}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2" scope="row">Unit Name</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                        borderRadius={"0px"}
                                        options={UnitNameList}
                                        name="UnitName"
                                        placeholder={"Please select products unit"}
                                        styles={colourStyles}
                                        value={UnitName ? { label: UnitName } : null}
                                        onChange={(e) => setFormData({ ...formData, UnitName: e.label })}
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitName ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitName}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Unit Quantity</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Unit Quantity'
                                        name='UnitQty'
                                        value={UnitQty}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitQty ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitQty}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Unit Weight</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Unit Weight'
                                        name='UnitWeight'
                                        value={UnitWeight}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitWeight ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitWeight}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Barcode</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Barcode'
                                        name='Barcode'
                                        value={Barcode}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.Barcode ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Barcode}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Status</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
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
                            {
                                Error.Status ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        </td>
                                    </tr> : null
                            }
                        </tbody>

                    </table>
                </form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={(e) => Create_Product_Item(e)}>Submit </button>
            </Modal.Footer>
        </Modal >
    );
}






















export const ItemUpdate = (props) => {

    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        id: props.item.id,
        ProductID: props.item.ProductID,
        Code: props.item.Code,
        Barcode: props.item.Barcode,
        Title: props.item.Title,
        UnitName: props.item.UnitName,
        UnitQty: props.item.UnitQty,
        UnitWeight: props.item.UnitWeight,
        PackType: props.item.PackType,
        Status: parseInt(props.item.Status) === 1 ? "Available" : parseInt(props.item.Status) === 2 ? "Unavailable" : parseInt(props.item.Status) === 3 ? "Withdraw" : 'N/A',
    });

    const { id, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });



    const ClearField = () => {
        setFormData({
            id: props.item.id,
            ProductID: props.item.ProductID,
            Code: props.item.Code,
            Barcode: props.item.Barcode,
            Title: props.item.Title,
            UnitName: props.item.UnitName,
            UnitQty: props.item.UnitQty,
            UnitWeight: props.item.UnitWeight,
            PackType: props.item.PackType,
            Status: parseInt(props.item.Status) === 1 ? "Available" : parseInt(props.item.Status) === 2 ? "Unavailable" : parseInt(props.item.Status) === 3 ? "Withdraw" : 'N/A',
        });
        props.onHide()

    }

    const PackList = [
        { value: 1, label: "Bolus" },
        { value: 2, label: "Bottle" },
        { value: 3, label: "Carton" },
        { value: 4, label: "Bag" },
        { value: 5, label: "Loose" },
        { value: 6, label: "Container" },
        { value: 7, label: "Aluminium Foil" },
        { value: 8, label: "Injectable/Vial" },
        { value: 9, label: "Paper Board" },
        { value: 10, label: "Paper" },
        { value: 11, label: "Lamitube" },
        { value: 11, label: "Box" },
        { value: 11, label: "Pack" },
        { value: 11, label: "Mini Pack" },
        { value: 12, label: "Casket" },
        { value: 13, label: "Sack" }
    ]

    const Update_Product_Item = async e => {
        // if (No === 8 || No === 9) {
        // setUpdateModalShow(false)
        setError({})
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        // var pro_id = NewProductID !== props.item.ProductID ? NewProductID : props.item.ProductID
        const result = await UpdateProductItem(id, ProductID, Code, Barcode, Title, UnitName, UnitQty, UnitWeight, PackType, Status);

        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.error_details.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                props.onClose();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update product item. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

        // }
    };


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2 justify-content-center">
                <p className="fs-4 fw-bold text-dark text-center m-0">
                    Update Product Item <br />
                    <small>Please change the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table className="table table-bordered px-3">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-2" scope="row">Code</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2 d-flex">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Code'
                                        name='Code'
                                        value={Code}
                                        onChange={e => onChange(e)}
                                        minLength='0'
                                        required
                                        disabled
                                    />
                                </th>
                            </tr>
                            <tr>
                                <td className="py-2" scope="row">Profile ID</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <tr className="py-2 d-flex">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='text'
                                        placeholder='Product ID'
                                        name='ProductID'
                                        value={ProductID}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </tr>
                            </tr>
                            {
                                Error.ProductID ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ProductID}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2">Title</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='text'
                                        placeholder='Title'
                                        name='Title'
                                        value={Title}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.Title ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Title}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2">Pack Type</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                        borderRadius={"0px"}
                                        options={PackList}
                                        name="PackType"
                                        placeholder={"Please select pack type"}
                                        styles={colourStyles}
                                        value={PackType ? { label: PackType } : null}
                                        onChange={(e) => setFormData({ ...formData, PackType: e.label })}
                                    />
                                </th>
                            </tr>
                            {
                                Error.PackType ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.PackType}</small></p>
                                        </td>
                                    </tr> : null
                            }
                            <tr>
                                <td className="py-2" scope="row">Unit Name</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                        borderRadius={"0px"}
                                        options={UnitNameList}
                                        name="UnitName"
                                        placeholder={"Please select products unit"}
                                        styles={colourStyles}
                                        value={UnitName ? { label: UnitName } : null}
                                        onChange={(e) => setFormData({ ...formData, UnitName: e.label })}
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitName ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitName}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Unit Quantity</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Unit Quantity'
                                        name='UnitQty'
                                        value={UnitQty}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitQty ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitQty}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Unit Weight</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Unit Weight'
                                        name='UnitWeight'
                                        value={UnitWeight}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.UnitWeight ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitWeight}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Barcode</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Barcode'
                                        name='Barcode'
                                        value={Barcode}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                            {
                                Error.Barcode ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Barcode}</small></p>
                                        </td>
                                    </tr> : null
                            }

                            <tr>
                                <td className="py-2" scope="row">Status</td>
                                <td className="py-2 px-1 text-center">:</td>
                                <th className="py-2">
                                    <Select
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
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
                            {
                                Error.Status ?
                                    <tr>
                                        <td colspan="3" className='p-0'>
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        </td>
                                    </tr> : null
                            }
                        </tbody>

                    </table>
                </form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={(e) => Update_Product_Item(e)}>Submit </button>
            </Modal.Footer>
        </Modal >
    );
}