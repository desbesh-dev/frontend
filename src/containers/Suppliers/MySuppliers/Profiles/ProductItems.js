import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AddProduct } from '../../../../actions/SuppliersAPI';
import { logout } from '../../../../actions/auth';

import Select from 'react-select';
import { AllProductList } from '../../../../actions/APIHandler';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { CreateMessage } from "../../../Modals/ModalForm.js";
import { BarcodeList } from '../../NationalSuppliers/Profiles/Modal/BarcodePrintModal';
import { CreateItem, ItemUpdate } from '../../NationalSuppliers/Profiles/Modal/Item';
import { AddPack, UpdatePack, ViewPack } from '../../NationalSuppliers/Profiles/Modal/Package';


const ProductItems = ({ list, setList, SupplierID, ProductID, user, No, sub_scale }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [AddModalShow, setAddModalShow] = useState(false);
    const [EditItem, setEditItem] = useState(false);
    const [EditItemModalShow, setEditItemModalShow] = useState(false);

    const [CreateItemModalShow, setCreateItemModalShow] = useState(false);

    const [CreatePKG, setCreatePKG] = useState(false);
    const [CreatePKGModalShow, setCreatePKGModalShow] = useState(false);
    const [PackItemID, setPackItemID] = useState(false);

    const [EditPKG, setEditPKG] = useState(false);
    const [EditPKGModalShow, setEditPKGModalShow] = useState(false);

    const [ViewPKGModalShow, setViewPKGModalShow] = useState(false);

    const [BarcodeItem, setBarcodeItem] = useState(false);
    const [BarcodeModalShow, setBarcodeModalShow] = useState(false);

    const [ItemTitle, setItemTitle] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [NewCode, setNewCode] = useState(0)
    const [SearchKey, setSearchKey] = useState(false)
    const [TempData, setTempData] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [ItemValue, setItemValue] = useState(false)
    const [Visibility, setVisibility] = useState("d-table");
    const [AccordLbl, setAccordLbl] = useState("Add New Product");
    const [Image, setImage] = useState(false)
    const [ImagePrv, setImagePrv] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadProductItems();
        // LoadProductCode();
    }, [])

    const LoadProductItems = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var ProductItems = await AllProductList(SupplierID);
            if (ProductItems !== true)
                setData(ProductItems.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_supplier');
        }
    }

    // const LoadProductCode = async () => {
    //     dispatch({ type: DISPLAY_OVERLAY, payload: true });
    //     var result = await FetchProductCode();

    //     if (result !== true) {
    //         setNewCode(result);
    //     } else {
    //         setStep(null);
    //     }
    //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
    // }


    const isStringNullOrWhiteSpace = (str) => {
        return str === undefined || str === null || str === "";
    }

    const handleFocus = (e) => {
        setTempData(e.target.value)
        e.target.select()
    };


    const Add_Product = async (e, item) => {
        if (No === 3 || No === 6) {
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

    // let unique_search = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Title) : null;

    let ProductList
    ProductList = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = SearchKey ? item.id === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status, UpdatedBy }) {
        return { id, Code, ProductID, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, Status, UpdatedBy };
    }) : null

    var h = window.innerHeight - 352;

    return (
        <div className="position-relative">
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
                            // options={Data.map}
                            options={Array.isArray(Data) && Data.length ? Data.map((item) => ({ label: item.Title, value: item.id })) : []}
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
                                <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase">Action</span> </th>
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

                                        <td className="p-1 text-nowrap" style={{ width: '100px' }}>
                                            <button className="btn fs-4 px-2 py-0 fad fa-box-open text-dark" onClick={() => { setPackItemID(item); setCreatePKGModalShow(true) }} />
                                            {/* <button className="btn fs-4 px-2 py-0 fad fa-box-open text-dark" onClick={(e) => { setItemTitle(item); setEditPKGModalShow(true) }} /> */}
                                            <button className="btn fs-4 px-2 py-0 fal fa-barcode-read text-dark" onClick={() => { setBarcodeItem(item); setBarcodeModalShow(true) }} />
                                            <button className="btn fs-4 px-2 py-0 fad fa-eye text-dark" onClick={() => { setPackItemID(item); setViewPKGModalShow(true) }} />
                                        </td>
                                    </tr>

                                ))
                                    :
                                    <tr className="text-center">
                                        <td colSpan="9" className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark p-0">
                                            No Product Items Found!
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
                        onReload={() => window.location.reload(false)()}
                        onClose={() => { LoadProductItems(); setCreateItemModalShow(false) }}
                        onHide={() => { setCreateItemModalShow(false); }}
                    />
                    : null
            }
            {
                EditPKGModalShow ?
                    <UpdatePack
                        item={ItemTitle}
                        // item={PackItemID}
                        show={EditPKGModalShow}
                        SupplierID={SupplierID}
                        ProductID={ProductID}
                        list={list}
                        setList={setList}
                        onReload={() => window.location.reload(false)()}
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
                        onReload={() => window.location.reload(false)()}
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
                        onReload={() => window.location.reload(false)()}
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
                        onReload={() => window.location.reload(false)()}
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
                        onReload={() => window.location.reload(false)()}
                        onClose={() => { LoadProductItems(); setEditItemModalShow(false); setEditItem(false) }}
                        onHide={() => { setEditItemModalShow(false); setEditItem(false) }}
                    /> : null
            }

            {ItemValue ?
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
    No: state.auth.No,
    sub_scale: state.auth.sub_scale,
    list: props.list,
    setList: props.setList,
});

export default connect(mapStateToProps, { logout })(ProductItems);