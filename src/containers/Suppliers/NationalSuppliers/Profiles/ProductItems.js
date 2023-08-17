import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AddProduct, FetchProductCode, ProductItemList, UpdateProductImage } from '../../../../actions/SuppliersAPI';
import { logout } from '../../../../actions/auth';

import Select from 'react-select';
import { findUnique } from '../../../../actions/APIHandler';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { CreateMessage } from "../../../Modals/ModalForm.js";
import { BarcodeList } from './Modal/BarcodePrintModal';
import { CreateItem, ItemUpdate } from './Modal/Item';
import { AddPack, UpdatePack, ViewPack } from './Modal/Package';

const ProductProfiles = ({ list, setList, SupplierID, ProductID, user, no, sub_scale }) => {
    const [AddModalShow, setAddModalShow] = useState(false);
    const [EditItem, setEditItem] = useState(false);
    const [EditItemModalShow, setEditItemModalShow] = useState(false);

    const [CreateItemModalShow, setCreateItemModalShow] = useState(false);

    const [CreatePKGModalShow, setCreatePKGModalShow] = useState(false);
    const [PackItemID, setPackItemID] = useState(false);

    const [EditPKGModalShow, setEditPKGModalShow] = useState(false);

    const [ViewPKGModalShow, setViewPKGModalShow] = useState(false);

    const [BarcodeItem, setBarcodeItem] = useState(false);
    const [BarcodeModalShow, setBarcodeModalShow] = useState(false);

    const [ItemTitle, setItemTitle] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [NewCode, setNewCode] = useState(0)
    const [SearchKey, setSearchKey] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [ItemValue, setItemValue] = useState(false)
    const [AccordLbl, setAccordLbl] = useState("Add New Product");
    const [Image, setImage] = useState(false)
    const [ImagePrv, setImagePrv] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        id: "",
        NewProductID: "",
        Code: "",
        Barcode: "",
        Title: "",
        PackType: "",
        UnitName: null,
        UnitQty: null,
        UnitWeight: null,
        Status: null,

        PurchasePrice: "",
        MRP: "",
        RetailPrice: "",
        WhlslPrice: "",

        CtnBarcode: "",
        CtnQty: "",
        CtnPrice: "",
        HalfCtnBarcode: "",
        HalfCtnQty: "",
        HalfCtnPrice: "",
        TwelveBarcode: "",
        TwelveQty: "",
        TwelvePrice: "",
        TenBarcode: "",
        TenQty: "",
        TenPrice: "",
        EightBarcode: "",
        EightQty: "",
        EightPrice: "",
        SixBarcode: "",
        SixQty: "",
        SixPrice: "",
        FourBarcode: "",
        FourQty: "",
        FourPrice: "",
        Pack1Barcode: "",
        Pack1Qty: "",
        Pack1Price: "",
        Pack2Barcode: "",
        Pack2Qty: "",
        Pack2Price: "",
        Pack3Barcode: "",
        Pack3Qty: "",
        Pack3Price: "",
        OtherBarcode: "",
        OtherQty: "",
        OterPrice: "",
    });

    useEffect(() => {
        LoadProductItems();
        LoadProductCode();
    }, [])

    const LoadProductCode = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchProductCode();
        if (result !== true) {
            setNewCode(result);
        } else {
            setStep(null);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadProductItems = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var ProductItems = await ProductItemList(ProductID);
        if (ProductItems !== true)
            setData(ProductItems.data);

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ImageChange = (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImage(file)
            setImagePrv(reader.result)
        }

        reader.readAsDataURL(file)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ImageRemove = () => {
        setImagePrv(false)
    }

    const UploadImage = async e => {
        e.preventDefault();
        const result = await UpdateProductImage(ProductID, Image);
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
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: result.Title,
                description: result.message,
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
    };

    const Add_Product = async (e, item) => {
        if (no === 3 || no === 6) {
            setAddModalShow(false)
            setError({})
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            e.preventDefault();
            const result = await AddProduct(user.CompanyID, user.BranchID, SupplierID, item.id);

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
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? infoIcon : successIcon
                    }])
                    LoadProductItems();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Failed to add product. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    };

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "40vh", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_search = Array.isArray(Data.ProItems) && Data.ProItems.length ? findUnique(Data.ProItems, d => d.Title) : null;

    let ProductList
    ProductList = Array.isArray(Data.ProItems) && Data.ProItems.length ? Data.ProItems.filter(function (item) {
        let BothValue = SearchKey ? item.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status, UpdatedBy }) {
        return { id, Code, ProductID, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status, UpdatedBy };
    }) : null

    var h = window.innerHeight - 352;

    return (
        <div className="position-relative">
            <div className="row justify-content-center mx-auto d-table w-100">
                <div className="row align-items-center bg-white mx-0 py-2">
                    <div className="col-sm-5 col-md-6">
                        <p className="display-6 fw-bold d-flex justify-content-center m-0">
                            {Data && Data.Title}
                        </p>
                        {/* <img src={Data.Image ? process.env.REACT_APP_API_URL + Data.Image : process.env.REACT_APP_API_URL + "/Media/no_imge.jpg"} className="img-fluid rounded mb-0 mx-auto d-table" alt="avatar" style={{ width: "30%" }} /> */}
                        <div className="img_container">
                            <img src={ImagePrv ? ImagePrv : Data.Image ? process.env.REACT_APP_API_URL + Data.Image : ''} className="image img-fluid rounded-square mx-auto d-table" width="150" alt="avatar" style={{ width: "30%" }} />
                            {(no === 7 || no === 8 || no === 9) &&
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
                                        <i className="fad fa-images"></i>
                                    </label>
                                    {ImagePrv &&
                                        <Fragment>
                                            <label
                                                className='btn btn-outline-success shadow-lg'
                                                for="file1"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="bottom"
                                                title="Upload Image"
                                                onClick={(e) => UploadImage(e)}>
                                                <i className="fad fa-upload"></i>
                                            </label>
                                            <button
                                                className='btn btn-outline-success shadow-lg'
                                                for="file1"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="bottom"
                                                title="Remove selected image"
                                                type="button"
                                                onClick={() => ImageRemove()}>
                                                <i className="fad fa-minus-circle"></i>

                                            </button>
                                        </Fragment>
                                    }
                                </div>
                            }
                        </div>
                        <p className="fs-6 fw-bold d-flex justify-content-center text-muted m-0">
                            {Data ? Array.isArray(Data.UnitName) && Data.UnitName.length ? Data.UnitName.map((item) => item.label + " ") : null : "N/A"}
                        </p>
                    </div>
                    <div className="col-sm-5 col-md-6">
                        <p className="fs-6 fw-bold d-flex justify-content-center m-0">
                            {Data ? Data.Description : null}
                        </p>
                        <p className="fs-6 fw-bold d-flex justify-content-center m-0">
                            {Data ? Data.Specification : null}
                        </p>
                        <p className="fs-6 fw-bold d-flex justify-content-center m-0">
                            {Data ? Data.Status : null}
                        </p>
                    </div>
                </div>
                {
                    (no <= 7 || no === 11) &&
                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto d-table px-0">
                        <div className="accordion accordion-flush px-0" id="accordionFlushExample">
                            <div className="accordion-item border-0 bg-transparent">
                                <p className="accordion-header m-0" id="flush-headingOne">
                                    <button className={`cs_accordion-button ${Step === "ProductAddition" ? "collapse show" : "collapsed"}  shadow-none py-2 my-1 fs-4 fw-bold text-success bg-white shadow-sm`} style={{ borderLeft: "5px solid #28A745" }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded={Step === "ProductAddition" ? "true" : "false"} aria-controls="flush-collapseOne"
                                        id="ProductAddition" onClick={() => { setCreateItemModalShow(true) }}>
                                        {AccordLbl}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="row justify-content-center mx-auto d-table w-100">

                <div className={`d-flex justify-content-between bg-white py-2 mt-2 border-bottom`}>
                    <div className='my-auto text-center'>
                        <p className='display-6 fw-bold m-0 text-uppercase text-left'><Link className="fad fa-chevron-left px-2 text-dark text-decoration-none" to='#' onClick={() => history.goBack()}></Link> PRODUCT LISTS</p>
                    </div>
                    <div className="d-flex justify-content-end mx-2" style={{ minWidth: "10vh" }}>
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
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
                    <table className={`table table-hover table-borderless bg-white mt-1`}>
                        <thead>
                            <tr className="text-center">
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">S/N</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Code</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Title</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pack Type</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit Name</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit Qty</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Unit Weight</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Status</span> </th>
                                <th className={`${(no <= 7 || no === 11) && "border-right"} p-1`}> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pack & Reform</span> </th>
                                {
                                    (no <= 7 || no === 11) &&
                                    <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase">Action</span> </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(ProductList) && ProductList.length ? ProductList.map((item, n) => (
                                    <tr className="border-bottom text-center" key={n}>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{n + 1}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Code}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.Title}</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.PackType}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.UnitName}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.UnitQty}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.UnitWeight}</span> </td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">{item.Status}</span> </td>
                                        <td className={`${(no <= 7 || no === 11) && "border-right"} p-1 text-nowrap`} style={{ width: '200px' }}><span className="d-block fs-6 fw-bold text-center text-dark p-0 text-nowrap">
                                            <button title="Create Package" className="btn fs-4 px-2 py-0 fad fa-box text-dark" onClick={() => { setPackItemID(item); setCreatePKGModalShow(true) }} />
                                            {
                                                (no <= 7 || no === 11) &&
                                                <button title="Update Package" className="btn fs-4 px-2 py-0 fad fa-box-open text-dark" onClick={(e) => { setItemTitle(item); setEditPKGModalShow(true) }} />
                                            }
                                            <button title="Package Barcode" className="btn fs-4 px-2 py-0 fal fa-barcode-read text-dark" onClick={() => { setBarcodeItem(item); setBarcodeModalShow(true) }} />
                                            <button title="View Package" className="btn fs-4 px-2 py-0 fad fa-eye text-dark" onClick={() => { setPackItemID(item); setViewPKGModalShow(true) }} />
                                        </span> </td>
                                        {
                                            (no <= 7 || no === 11) &&
                                            <td className="p-1 text-nowrap" style={{ width: '100px' }}>

                                                <Fragment>
                                                    <button title="Delete Item" className="btn fs-4 px-2 py-0 fad fa-trash text-dark" />
                                                    <button title="Update Item" className="btn fs-4 px-2 py-0 fad fa-edit text-dark" onClick={() => { setEditItem(item); setEditItemModalShow(true) }} />
                                                </Fragment>
                                            </td>
                                        }
                                    </tr>
                                ))
                                    :
                                    <tr className="text-center">
                                        <td colSpan="8" className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                            no Product Items Found!
                                        </span></td>
                                    </tr>
                            }
                        </tbody>
                    </table>

                </div>
            </div>
            {
                CreateItemModalShow ?
                    <CreateItem
                        item={EditItem}
                        show={CreateItemModalShow}
                        SupplierID={SupplierID}
                        ProductID={ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { LoadProductItems(); setCreateItemModalShow(false) }}
                        onHide={() => { setCreateItemModalShow(false); }}
                    />
                    : null
            }
            {
                EditPKGModalShow ?
                    <UpdatePack
                        item={ItemTitle}
                        show={EditPKGModalShow}
                        SupplierID={SupplierID}
                        ProductID={ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { LoadProductItems(); setEditPKGModalShow(false) }}
                        onHide={() => { setEditPKGModalShow(false); }}
                    />
                    : null
            }
            {
                CreatePKGModalShow ?
                    <AddPack
                        item={PackItemID}
                        show={CreatePKGModalShow}
                        SupplierID={SupplierID}
                        ProductID={ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { LoadProductItems(); setCreatePKGModalShow(false) }}
                        onHide={() => { setCreatePKGModalShow(false); }}
                    />
                    : null
            }
            {
                ViewPKGModalShow ?
                    <ViewPack
                        item={PackItemID}
                        show={ViewPKGModalShow}
                        SupplierID={SupplierID}
                        ProductID={ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { setViewPKGModalShow(false) }}
                        onHide={() => { setViewPKGModalShow(false); }}
                    />
                    : null
            }
            {
                BarcodeModalShow ?
                    <BarcodeList
                        item={BarcodeItem}
                        show={BarcodeModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { setBarcodeModalShow(false) }}
                        onHide={() => { setBarcodeModalShow(false); }}
                    />
                    : null
            }

            {
                EditItemModalShow ?
                    <ItemUpdate
                        item={EditItem}
                        show={EditItemModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)}
                        onClose={() => { LoadProductItems(); setEditItemModalShow(false); setEditItem(false) }}
                        onHide={() => { setEditItemModalShow(false); setEditItem(false) }}
                    /> : null
            }

            {
                ItemValue ?
                    <CreateMessage
                        header="Add To My Product"
                        body_header={ItemValue.Title}
                        body={"Do you want to add " + ItemValue.Title + " in your product list?"}
                        show={AddModalShow}
                        Click={(e) => Add_Product(e, ItemValue)}
                        onHide={() => setAddModalShow(false)}
                    /> : null}
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no,
    sub_scale: state.auth.sub_scale,
    list: props.list,
    setList: props.setList,
    SupplierID: props.match.params.sup_id,
    ProductID: props.match.params.id,
});

export default connect(mapStateToProps, { logout })(ProductProfiles);