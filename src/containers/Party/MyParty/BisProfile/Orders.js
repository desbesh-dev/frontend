import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../../../actions/auth';
import { MyOrders, SendOrder } from '../../../../actions/SuppliersAPI';

import Select from 'react-select';
import { AllProductList } from '../../../../actions/APIHandler';
import { FetchOrderNo } from '../../../../actions/InventoryAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { InfoMessage } from "../../../Modals/ModalForm.js";
import { exportPDF } from '../../Class/OrderPDF';

const Orders = ({ CompanyID, BranchID, SupplierID, user, list, setList }) => {
    const [CreateModalShow, setCreateModalShow] = useState(false);
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BankLists, setBankLists] = useState(initialValue)
    const [BBLists, setBBLists] = useState(initialValue)
    const [Data, setData] = useState(false)
    const [MyProList, setMyProList] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    const [Rows, setRows] = useState([])
    const [TempData, setTempData] = useState(false)
    const [Error, setError] = useState({});
    const [Step, setStep] = useState(null)
    const [RefLists, setRefLists] = useState(initialValue);
    const [RepLists, setRepLists] = useState(initialValue);
    const [Toggle, setToggle] = useState(false);
    const [DDate, setDDate] = useState(false);
    const [OrderNo, setOrderNo] = useState();
    const [Amount, setAmount] = useState(0.00);
    const [Expand, setExpand] = useState(false);
    const [AccordLbl, setAccordLbl] = useState("Add New Product");
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        ItemCode: "",
        Title: "",
        UnitWeight: "",
        UnitPrice: "",
        Quantity: "",
    });
    const { ItemCode, Title, UnitWeight, UnitPrice, Quantity } = formData;


    useEffect(() => {
        My_Orders();
        LoadProductItems();
        LoadOrderNo();
    }, [])

    const LoadOrderNo = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchOrderNo('PO');

        if (result !== true) {
            setOrderNo(result)
        } else {
            history.push('/');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const My_Orders = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await MyOrders(user.CompanyID, user.BranchID, SupplierID);
            if (result !== true)
                setData(result.data);
            // 
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_supplier');
        }
    }

    const LoadProductItems = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var ProductItems = await AllProductList(SupplierID);
            if (ProductItems !== true)
                setMyProList(ProductItems.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_supplier');
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    const getTotal = () => {
        let TotalPrice = 0;
        const price = OrderData.map(row => row.Quantity * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = OrderData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Quantity, 10), 0);

    const deleteRow = (i) => {
        // make new rows. note: react state is immutable.
        const newRows = OrderData.splice(i, 1).concat(OrderData.slice(i + 1));
        // setRows({ OrderData: newRows })
        setCount(Count - 1)
    };

    const onSubmit = (e) => {
        if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined || formData.UnitPrice === "" || formData.UnitPrice === undefined) {
            setInfoModalShow(true)
        } else {
            setOrderData([...OrderData, formData]);
            setCount(Count + 1);
            setFormData({
                Title: "",
                UnitWeight: "",
                UnitPrice: "",
                Quantity: "",
                ItemCode: "",
            });
        }
    }
    const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            onSubmit();
        }
    }

    const Send_Order = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await SendOrder(user.CompanyID, user.BranchID, SupplierID, OrderNo, getTotal(), DDate, user.FullName, OrderData);

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
                    My_Orders();
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

        } else {
            history.push('/my_supplier');
        }
    }

    const NewOrder = () => {
        setToggle(false);
        setFormData({
            ItemCode: "",
            Title: "",
            UnitWeight: "",
            UnitPrice: "",
            Quantity: "",
        });
        LoadOrderNo();
        setOrderData([]);
    }

    return (
        <div className="position-relative" style={{ height: "95%" }}>
            <div className="position-absolute overflow-auto my-1 w-100 h-75">

                {
                    Toggle ?
                        <div className="row justify-content-center mx-auto d-table w-100 h-100">

                            <div className={`d-flex justify-content-between bg-white py-2 mt-2 border-bottom`}>
                                <p className='display-6 bg-white text-center m-0'>REQUEST FOR PRODUCT</p>
                                <button className="btn fs-3 p-2 fad fa-list text-success border-left" onClick={() => NewOrder()} />
                            </div>

                            <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">

                                <div className="col-sm-1 d-flex justify-content-center align-items-center">
                                    <p className='fs-6 fw-bold text-left mx-2 my-0'>Order No</p>
                                    <p className="btn fs-6 p-2 fad fa-refresh text-dark border-left"
                                        onClick={() => LoadOrderNo()}
                                    />
                                </div>

                                <div className="col-sm-3 d-flex justify-content-center align-items-center">
                                    <input
                                        type="text"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        id="OrderNo"
                                        placeholder="Order No"
                                        value={OrderNo}
                                        required
                                        disabled
                                    />
                                </div>

                                <div className="col-sm-1 d-flex justify-content-center align-items-center">
                                    <p className='fs-6 fw-bold text-left mx-2 my-0'>Date</p>
                                </div>

                                <div className="col-sm-2 d-flex justify-content-center align-items-center">
                                    <input
                                        type="text"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        id="Today"
                                        placeholder="Today"
                                        value={today}
                                        required
                                    />
                                </div>

                                <div className="col-sm-2 d-flex justify-content-center align-items-center">
                                    <p className='fs-6 fw-bold text-left mx-2 my-0'>Delivery Date</p>

                                </div>

                                <div className="col-sm-3 d-flex align-items-center">
                                    <input
                                        type="date"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        id="DDate"
                                        placeholder="DDate"
                                        value={DDate}
                                        onChange={e => setDDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </form>

                            <form className="row gx-3 bg-white justify-content-between align-items-center m-0 p-2 my-1">
                                <div className="col-sm-1">
                                    <input
                                        type="number"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        id="ItemCode"
                                        placeholder="Item code"
                                        value={formData ? ItemCode : ""}
                                        required
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group fs-5 fw-bold">
                                        {/* <input type="text" className="form-control p-0 text-center" id="specificSizeInputGroupUsername" placeholder="Username" /> */}
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={MyProList.map((item) => ({ ItemCode: item.ItemCode, value: item.ItemCode, label: item.Title, UnitWeight: item.UnitWeight, UnitPrice: item.UnitPrice }))}
                                            name="Division"
                                            placeholder={"Please select product"}
                                            styles={CScolourStyles}
                                            value={
                                                formData ? Title : null
                                            }
                                            onChange={(e) => setFormData(e)}
                                            required
                                            id="Title"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <input
                                        type="text"
                                        id="UnitWeight"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        placeholder="Unit Weight"
                                        value={formData ? UnitWeight.toLocaleString("en", { minimumFractionDigits: 3 }) : ""}
                                        required
                                    />
                                </div>
                                <div className="col-sm-2">
                                    <input
                                        type="text"
                                        id="UnitPrice"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        placeholder="Unit Price"
                                        value={formData ? UnitPrice.toLocaleString("en", { minimumFractionDigits: 2 }) : ""}
                                        required
                                    />
                                </div>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control fs-5 fw-bold p-0 text-center"
                                        name="Quantity"
                                        id="Quantity"
                                        placeholder="Quantity"
                                        value={formData ? Quantity : ""}
                                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                        onKeyDown={(e) => shouldBlur(e)}
                                        required
                                    />
                                </div>

                                <div className="col-auto">
                                    <button
                                        className="btn fs-3 fad fa-plus text-center text-success"
                                        onKeyDown={(e) => handleKeyDown(e)}
                                        type="submit"
                                        onClick={(e) => onSubmit(e)}
                                    />
                                </div>
                            </form>


                            <InfoMessage
                                header="Invalid Data"
                                body_header="Input data is not valid. Please fill input field correctly."
                                // body="Please fill all field correctly?"
                                show={InfoModalShow}
                                onHide={() => setInfoModalShow(false)}
                            />

                            {Array.isArray(OrderData) && OrderData.length ?
                                <table className={`table table-hover table-borderless table-responsive card-1 p-4 mx-auto rounded-0 d-table`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th><span>S/N</span></th>
                                            <th><span>Item Code</span></th>
                                            <th><span>Title</span></th>
                                            <th><span className="d-block text-right font-weight-bold">Unit Weight</span></th>
                                            <th><span className="d-block text-right font-weight-bold">Unit Price</span></th>
                                            <th><span>Quantity</span></th>
                                            <th><span className="d-block text-right font-weight-bold">Price</span></th>
                                            <th><span>Action</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            OrderData.map((item, i) => (
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td><span className="d-block font-weight-bold">{i}</span></td>
                                                    <td><span className="d-block font-weight-bold">{item.ItemCode}</span></td>
                                                    <td><span className="d-block font-weight-bold">{item.label}</span></td>
                                                    <td><span className="d-block text-right font-weight-bold">{(item.UnitWeight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                                    <td><span className="d-block text-right font-weight-bold">{(item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td><span className="d-block font-weight-bold">{item.Quantity}</span> </td>
                                                    <td><span className="d-block text-right font-weight-bold">{(item.Quantity * item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="px-3 py-0">
                                                        <button className="btn fs-3 p-2 fad fa-minus text-danger" onClick={() => deleteRow(i)} />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        <tr className="text-center border-success bg-light">
                                            <td className="p-1"><span className="d-block text-right font-weight-bold">Count:</span> </td>
                                            <td className="p-1"><span className="d-block text-left font-weight-bold">{Count}</span> </td>
                                            <td className="p-1"><span className="d-block text-right font-weight-bold">Total Quantity:</span> </td>
                                            <td className="p-1"><span className="d-block text-left font-weight-bold">{QuantityTotal}</span> </td>
                                            <td className="p-1" colspan="2"><span className="d-block text-right font-weight-bold">Total Price: </span> </td>
                                            <td className="p-1"><span className="d-block font-weight-bold">{getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="p-1"><span className="px-3 py-0">
                                                <button className="btn fs-3 p-2 fad fa-paper-plane text-success"
                                                    onClick={() => Send_Order()}
                                                />
                                            </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                                </div>
                            }
                        </div>
                        :

                        // ORDER HISTORY
                        <div className={`row justify-content-center mx-auto d-table w-100 h-100`}>

                            <div className={`d-flex justify-content-between bg-white py-1 border-bottom`}>
                                <p className='display-6 bg-white m-0'>ORDER HISTORY</p>
                                <div className="d-flex justify-content-end mx-2">
                                    <input className="border rounded-pill px-2 py-0 min-vw-25" type="text" placeholder="Search Keywords" />
                                    <p className='fw-bold text-success my-auto px-1 mx-1 my-0' title="Search" type='button'>Search</p>
                                    <button className="btn fs-3 p-2 fad fa-plus text-success border-left" onClick={() => setToggle(true)} />
                                </div>
                            </div>

                            {Array.isArray(Data) && Data.length ?
                                <table className={`table table-hover table-borderless table-responsive card-1 p-4 mx-auto rounded-0 d-table`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th></th>
                                            <th>Order Date</th>
                                            <th> Order No </th>
                                            <th> Items </th>
                                            <th> Amount </th>
                                            <th> Delivery </th>
                                            <th> Name </th>
                                            <th> Updated </th>
                                            <th> Status </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    {
                                        Data.map((item, i) => (
                                            <tbody className="border">
                                                <tr className="border-bottom text-center" key={i}>
                                                    <td className="px-2 py-0" style={{ width: "20px" }} onClick={() => setExpand(Expand === i ? false : i)}>
                                                        <button className={`btn fs-6 p-2 text-success fw-light border-light ${Expand === i ? "fad fa-chevron-up" : "fad fa-chevron-down"} `} />
                                                    </td>
                                                    <td><span className="d-block">{new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                                    <td><span className="d-block">{item.OrderNo}</span></td>
                                                    <td><span className="d-block">{item.OrderMapData.length}</span></td>
                                                    <td><span className="d-block">{item.Amount}</span></td>
                                                    <td><span className="d-block">{item.DeliveryDate}</span> </td>
                                                    <td><span className="d-block">{item.UpdatedBy}</span> </td>
                                                    <td><span className="d-block">{new Date(item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span> </td>
                                                    <td><span className="d-block">{item.Status}</span> </td>
                                                    <td className="px-3 py-0">
                                                        <button className="btn fs-3 p-2 fad fa-eye text-success" id="view" onClick={(e) => exportPDF(e, item)} />
                                                        <button className="btn fs-3 p-2 fad fa-file-pdf text-success" id="print" onClick={(e) => exportPDF(e, item)} />
                                                        <button className="btn fs-3 p-2 fad fa-trash-alt text-success" onClick={() => exportPDF(item)} />
                                                    </td>
                                                </tr>

                                                {i === Expand ?
                                                    Array.isArray(item.OrderMapData) && item.OrderMapData.length ?
                                                        item.OrderMapData.map((pro, n) => (
                                                            <tr className="text-center boder-bottom" key={n}>
                                                                <td className="p-0" colspan="2">{pro.ItemCode.id} <small className="text-muted"> Code</small></td>
                                                                <td className="p-0" colspan="4">{pro.ItemCode.Title} <small className="text-muted"> Title</small></td>
                                                                <td className="p-0">{pro.OrderQty} <small className="text-muted"> Qty</small></td>
                                                                <td className="p-0">{(pro.OrderQty * pro.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 })} <small className="text-muted"> tk</small></td>
                                                                <td className="p-0">{pro.ReceivedQty === null ? 0 : pro.ReceivedQty}<small className="text-muted"> Qty</small></td>
                                                                <td className="px-3 py-0">
                                                                    <button className="btn fs-3 p-2 fad fa-minus text-danger" onClick={() => deleteRow()} />
                                                                </td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                                            <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                                                        </div>
                                                    : null
                                                }
                                            </tbody>


                                        ))
                                    }
                                </table>
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-center text-success m-0'>No Product Found!</p>
                                </div>
                            }

                        </div>
                }
            </div >

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Orders);