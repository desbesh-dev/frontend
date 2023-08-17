import React, { useState, useEffect, Fragment } from 'react';
import { Route, BrowserRouter as Router, Switch, Link, Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import { logout } from '../../../../actions/auth';
import { GetSuppliers, AddSupplier, UpdateImage, UpdateSupLogo } from '../../../../actions/SuppliersAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import Products from './Products';
import ProductItems from './ProductItems';
import Overview from './Overview';
import { CreateMessage } from "../../../Modals/ModalForm.js";
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import unavilable_logo from '../../../../assets/no_logo.jpg';

const SupplierMain = ({ display, SupplierID, user, list, setList, scale, sub_scale }) => {
    let { path, url } = useRouteMatch();
    const [Data, setData] = useState(null)
    const [Image, setImage] = useState(false)
    const [ImagePrv, setImagePrv] = useState(false)
    const dispatch = useDispatch();
    const [Activity, setActivity] = useState(true);
    const [Profile, setProfile] = useState(false);
    const [ProductPro, setProductPro] = useState(false);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [Error, setError] = useState({});
    let toastProperties = null;
    const history = useHistory();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadSuppliers();
    }, [])

    const LoadSuppliers = async () => {
        var result = await GetSuppliers(SupplierID);
        if (result !== true) {
            setData(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/national_supplier_list');
        }
    }


    // const FetchUser = async (id) => {
    //     var User_Data = await LoadProfile(id);
    //     history.push('/pending_user', { UserData: User_Data.data });
    // }

    const Add_Supplier = async (e) => {
        if (user !== null) {
            setCreateModalShow(false)
            setError({})
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            e.preventDefault();
            const result = await AddSupplier(SupplierID);

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
                    LoadSuppliers();
                    dispatch({ type: DISPLAY_OVERLAY, payload: false });
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

        }
    };

    const ImageChange = (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImage(file);
            setImagePrv(reader.result)
        }
        reader.readAsDataURL(file)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ImageRemove = () => {
        setImagePrv('')
    }

    const UploadImage = async e => {
        e.preventDefault();
        const result = await UpdateSupLogo(SupplierID, Image);
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


    return (
        <Fragment>
            <div className={"item grid-group-item list-group-item m-0"}>
                <div className="box thumbnail card py-2 shadow-none m-0 h-100">

                    <div className="img-event d-flex flex-column justify-content-center align-items-end" style={{ minHeight: "12vh", width: "40%" }}>
                        <div className="row mx-auto d-table">
                            <div className="img_container">
                                <img src={ImagePrv ? ImagePrv : Data ? Data.Logo ? Data.Logo : unavilable_logo : unavilable_logo} className="image img-fluid rounded mb-0 mx-auto d-table" alt="avatar" style={{ height: "15vh" }} />
                                {scale === 7 || scale === 8 || scale === 9 ?
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
                                            title="Choose Image">
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
                                                    onClick={(e) => UploadImage(e)}
                                                >
                                                    <i class="fad fa-upload"></i>
                                                </label>
                                                <button
                                                    className='btn btn-outline-success shadow-lg'
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
                                            : null}
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="caption card-body d-flex flex-column justify-content-center align-items-start py-0 px-2 w-50" style={{ minHeight: "12vh", width: "60%" }}>
                        <p className="group inner list-group-item-text fs-5 m-0"><span className="display-6 d-flex justify-content-start m-0">{Data ? Data.SupplierTitle : null}</span></p>
                        <p className="fs-5 fw-bold text-muted m-0">{Data ? Data.Address + ", " + Data.Contact : null}</p>
                        <p className="fs-5 fw-bold text-muted m-0">{Data ? Data.Contact + ", " + Data.Email : null}</p>

                        {Data ?
                            <CreateMessage
                                header="Add Supplier"
                                body_header={Data.CmpName}
                                body={"Do you want to make business with " + Data.CmpName + "?"}
                                show={CreateModalShow}
                                Click={(e) => Add_Supplier(e)}
                                onHide={() => setCreateModalShow(false)}
                            /> : null}
                    </div>
                </div>

            </div >


            <div className="header d-flex justify-content-center bg-white my-1">
                <div className="d-flex justify-content-start overflow-auto">
                    <Link className='fw-bold fs-5 text-success p-2' title="Agents" type='button' to={`${url}/overview`}>Overview</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}>
                        {/* <div className="cs_inner"></div> */}
                    </div>
                    <Link className='fw-bold fs-5 text-success  p-2' title="Agents" type='button' to="#" onClick={() => setCreateModalShow(true)}> Add Supplier</Link>
                    {
                        scale === 7 ?
                            <Fragment>
                                <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                <p className='fw-bold fs-5 text-success p-2 m-0' title="Products" type='button' to={`${url}/overview`}>Transactions</p>
                            </Fragment>
                            :
                            null
                    }
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}>
                        {/* <div className="cs_inner"></div> */}
                    </div>
                    {
                        scale === 7 ?
                            <Fragment>
                                <p className="fw-bold fs-5 text-success p-2 m-0" type='button' id="list" to={`${url}/overview`}>D/O</p>
                                <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                            </Fragment>
                            :
                            null
                    }
                    <Link className='fw-bold fs-5 text-success p-2' title="Products" type='button' to={`${url}/supplier_products`}>Products</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className='fw-bold fs-5 text-success p-2' title="Agents" type='button' to={`${url}/overview`}>Agents</Link>

                    {
                        scale === 7 ?
                            <Fragment>
                                <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                                <p className="fw-bold fs-5 text-success p-2 m-0" type='button' id="grid" to={`${url}/overview`}>Banks</p>
                            </Fragment>
                            :
                            null
                    }
                </div>
            </div>

            <Switch>
                <Route exact path={path}><Overview SupplierID={SupplierID} /> </Route>
                <Route exact path={`${path}/overview`}> <Overview SupplierID={SupplierID} /> </Route>
                <Route exact path={`${path}/supplier_products`}> <Products ProductPro={ProductPro} setProductPro={setProductPro} SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/product_items`}> <ProductItems ProductPro={ProductPro} setProductPro={setProductPro} SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route render={(props) => <Redirect to="/not_found" />} />
            </Switch>
        </Fragment>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    SupplierID: props.match.params.sup_id,
});

export default connect(mapStateToProps, { logout })(SupplierMain);