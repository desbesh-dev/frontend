import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { CreatePackage, FetchPack, FetchPackNPrice, SavePackage } from "../../../../../actions/SuppliersAPI";
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import errorIcon from '../../../../../assets/error.png';
import successIcon from '../../../../../assets/success.png';
import warningIcon from '../../../../../assets/warning.gif';

export const ViewPack = (props) => {
    const { no, sub_scale } = useSelector((state) => state.auth);

    const [Error, setError] = useState({});
    const [Exist, setExist] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        ItemID: props.item.id,

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
        OtherPrice: "",
        WhlslBarcode: "",
        WhlslQty: "",
        WhlslPrice: "",
    });

    const { ItemID, PurchasePrice, MRP, RetailPrice, CtnBarcode, CtnQty, CtnPrice, HalfCtnBarcode, HalfCtnQty, HalfCtnPrice, TwelveBarcode, TwelveQty, TwelvePrice, TenBarcode, TenQty, TenPrice, EightBarcode, EightQty, EightPrice, SixBarcode, SixQty, SixPrice, FourBarcode, FourQty, FourPrice, Pack1Barcode, Pack1Qty, Pack1Price, Pack2Barcode, Pack2Qty, Pack2Price, Pack3Barcode, Pack3Qty, Pack3Price, OtherBarcode, OtherQty, OtherPrice, WhlslBarcode, WhlslQty, WhlslPrice, } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        LoadProductPackage();
    }, [])

    const LoadProductPackage = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var pack = await FetchPackNPrice(props.item.id);

        if (pack !== true) {
            setExist(true)
            setFormData({
                ItemID: pack.ItemID,
                PurchasePrice: no < 11 ? pack.PurchasePrice : 'N/A',
                MRP: pack.MRP,
                RetailPrice: pack.RetailPrice,

                CtnBarcode: pack.CtnBarcode,
                CtnQty: pack.CtnQty,
                CtnPrice: pack.CtnPrice,
                HalfCtnBarcode: pack.HalfCtnBarcode,
                HalfCtnQty: pack.HalfCtnQty,
                HalfCtnPrice: pack.HalfCtnPrice,
                TwelveBarcode: pack.TwelveBarcode,
                TwelveQty: pack.TwelveQty,
                TwelvePrice: pack.TwelvePrice,
                TenBarcode: pack.TenBarcode,
                TenQty: pack.TenQty,
                TenPrice: pack.TenPrice,
                EightBarcode: pack.EightBarcode,
                EightQty: pack.EightQty,
                EightPrice: pack.EightPrice,
                SixBarcode: pack.SixBarcode,
                SixQty: pack.SixQty,
                SixPrice: pack.SixPrice,
                FourBarcode: pack.FourBarcode,
                FourQty: pack.FourQty,
                FourPrice: pack.FourPrice,
                Pack1Barcode: pack.Pack1Barcode,
                Pack1Qty: pack.Pack1Qty,
                Pack1Price: pack.Pack1Price,
                Pack2Barcode: pack.Pack2Barcode,
                Pack2Qty: pack.Pack2Qty,
                Pack2Price: pack.Pack2Price,
                Pack3Barcode: pack.Pack3Barcode,
                Pack3Qty: pack.Pack3Qty,
                Pack3Price: pack.Pack3Price,
                OtherBarcode: pack.OtherBarcode,
                OtherQty: pack.OtherQty,
                OtherPrice: pack.OtherPrice,
                WhlslBarcode: pack.WhlslBarcode,
                WhlslQty: pack.WhlslQty,
                WhlslPrice: pack.WhlslPrice,
            });
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const ClearField = () => {
        setFormData({
            ItemID: props.item.id,

            PurchasePrice: "",
            MRP: "",
            RetailPrice: "",

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
            OtherPrice: "",
            WhlslBarcode: "",
            WhlslQty: "",
            WhlslPrice: "",
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

        const result = await CreatePackage(ItemID, PurchasePrice, MRP, RetailPrice, WhlslPrice, CtnPrice, HalfCtnPrice, TwelvePrice, TenPrice, EightPrice, SixPrice, FourPrice, Pack1Price, Pack2Price, Pack3Price, OtherPrice);

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
            <Modal.Header className="py-2 justify-content-center">
                <p className="text-center m-0">
                    <span className="fs-4">Product Package & Pricing</span> <br />
                    <span className="fs-6 text-dark fw-bolder">{props.item.Title + " (" + props.item.Code + ")"}</span> <br />

                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table className="table table-bordered">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-1 px-2">Purchase Price</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">{PurchasePrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">MRP</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">{MRP}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Retail Price</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">{RetailPrice}</th>
                            </tr>
                        </tbody>
                    </table>


                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pack</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Barcode</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Quantity</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Price</span> </th>
                            </tr>
                        </thead>
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Cartoon</td>
                                <th className="py-1 px-2 text-center">{CtnBarcode}</th>
                                <th className="py-1 px-2 text-center">{CtnQty}</th>
                                <th className="py-1 px-2 text-center">{CtnPrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>1/2 Cartoon</td>
                                <th className="py-1 px-2 text-center">{HalfCtnBarcode}</th>
                                <th className="py-1 px-2 text-center">{HalfCtnQty}</th>
                                <th className="py-1 px-2 text-center">{HalfCtnPrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>12 Pack</td>
                                <th className="py-1 px-2 text-center">{TwelveBarcode}</th>
                                <th className="py-1 px-2 text-center">{TwelveQty}</th>
                                <th className="py-1 px-2 text-center">{TwelvePrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>10 Pack</td>
                                <th className="py-1 px-2 text-center">{TenBarcode}</th>
                                <th className="py-1 px-2 text-center">{TenQty}</th>
                                <th className="py-1 px-2 text-center">{TenPrice}</th>

                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>8 Pack</td>
                                <th className="py-1 px-2 text-center">{EightBarcode}</th>
                                <th className="py-1 px-2 text-center">{EightQty}</th>
                                <th className="py-1 px-2 text-center">{EightPrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>6 Pack</td>
                                <th className="py-1 px-2 text-center">{SixBarcode}</th>
                                <th className="py-1 px-2 text-center">{SixQty}</th>
                                <th className="py-1 px-2 text-center">{SixPrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>4 Pack</td>
                                <th className="py-1 px-2 text-center">{FourBarcode}</th>
                                <th className="py-1 px-2 text-center">{FourQty}</th>
                                <th className="py-1 px-2 text-center">{FourPrice}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Pack 1</td>
                                <th className="py-1 px-2 text-center">{Pack1Barcode}</th>
                                <th className="py-1 px-2 text-center">{Pack1Qty}</th>
                                <th className="py-1 px-2 text-center">{Pack1Price}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Pack 2</td>
                                <th className="py-1 px-2 text-center">{Pack2Barcode}</th>
                                <th className="py-1 px-2 text-center">{Pack2Qty}</th>
                                <th className="py-1 px-2 text-center">{Pack2Price}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Pack 3</td>
                                <th className="py-1 px-2 text-center">{Pack3Barcode}</th>
                                <th className="py-1 px-2 text-center">{Pack3Qty}</th>
                                <th className="py-1 px-2 text-center">{Pack3Price}</th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Other Pack</td>
                                <th className="py-1 px-2 text-center">{OtherBarcode}</th>
                                <th className="py-1 px-2 text-center">{OtherQty}</th>
                                <th className="py-1 px-2 text-center">{OtherPrice} </th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2" colSpan={1}>Wholesale</td>
                                <th className="py-1 px-2 text-center">{WhlslBarcode}</th>
                                <th className="py-1 px-2 text-center">{WhlslQty}</th>
                                <th className="py-1 px-2 text-center">{WhlslPrice}</th>
                            </tr>

                        </tbody>

                    </table>
                </form>
            </Modal.Body >
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success"> <i class="fad fa-print"></i> Print </button>
            </Modal.Footer>
        </Modal >
    );
}

export const UpdatePack = (props) => {

    const [Error, setError] = useState({});
    const [Exist, setExist] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        ItemID: props.item.id,
        CtnBarcode: '',
        CtnQty: '',
        HalfCtnBarcode: '',
        HalfCtnQty: '',
        TwelveBarcode: '',
        TwelveQty: '',
        TenBarcode: '',
        TenQty: '',
        EightBarcode: '',
        EightQty: '',
        SixBarcode: '',
        SixQty: '',
        FourBarcode: '',
        FourQty: '',
        Pack1Barcode: '',
        Pack1Qty: '',
        Pack2Barcode: '',
        Pack2Qty: '',
        Pack3Barcode: '',
        Pack3Qty: '',
        OtherBarcode: '',
        OtherQty: '',
        WhlslBarcode: '',
        WhlslQty: ''
    });

    const { ItemID, CtnBarcode, CtnQty, HalfCtnBarcode, HalfCtnQty, TwelveBarcode, TwelveQty, TenBarcode, TenQty, EightBarcode, EightQty, SixBarcode, SixQty, FourBarcode, FourQty, Pack1Barcode, Pack1Qty, Pack2Barcode, Pack2Qty, Pack3Barcode, Pack3Qty, OtherBarcode, OtherQty, WhlslBarcode, WhlslQty } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    useEffect(() => {
        LoadProductPackage();
    }, [])

    const LoadProductPackage = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var pack = await FetchPack(props.item.id);

        if (pack !== true) {
            setExist(true)
            setFormData({
                ItemID: pack.ItemID,

                CtnBarcode: pack.CtnBarcode,
                CtnQty: pack.CtnQty,
                HalfCtnBarcode: pack.HalfCtnBarcode,
                HalfCtnQty: pack.HalfCtnQty,
                TwelveBarcode: pack.TwelveBarcode,
                TwelveQty: pack.TwelveQty,
                TenBarcode: pack.TenBarcode,
                TenQty: pack.TenQty,
                EightBarcode: pack.EightBarcode,
                EightQty: pack.EightQty,
                SixBarcode: pack.SixBarcode,
                SixQty: pack.SixQty,
                FourBarcode: pack.FourBarcode,
                FourQty: pack.FourQty,
                Pack1Barcode: pack.Pack1Barcode,
                Pack1Qty: pack.Pack1Qty,
                Pack2Barcode: pack.Pack2Barcode,
                Pack2Qty: pack.Pack2Qty,
                Pack3Barcode: pack.Pack3Barcode,
                Pack3Qty: pack.Pack3Qty,
                OtherBarcode: pack.OtherBarcode,
                OtherQty: pack.OtherQty,
                WhlslBarcode: pack.WhlslBarcode,
                WhlslQty: pack.WhlslQty
            });
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            ItemID: props.item.id,

            CtnBarcode: '',
            CtnQty: '',
            HalfCtnBarcode: '',
            HalfCtnQty: '',
            TwelveBarcode: '',
            TwelveQty: '',
            TenBarcode: '',
            TenQty: '',
            EightBarcode: '',
            EightQty: '',
            SixBarcode: '',
            SixQty: '',
            FourBarcode: '',
            FourQty: '',
            Pack1Barcode: '',
            Pack1Qty: '',
            Pack2Barcode: '',
            Pack2Qty: '',
            Pack3Barcode: '',
            Pack3Qty: '',
            OtherBarcode: '',
            OtherQty: '',
            WhlslBarcode: '',
            WhlslQty: '',
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


        const result = await SavePackage(props.item.id, CtnBarcode, CtnQty, HalfCtnBarcode, HalfCtnQty, TwelveBarcode, TwelveQty, TenBarcode, TenQty, EightBarcode, EightQty, SixBarcode, SixQty, FourBarcode, FourQty, Pack1Barcode, Pack1Qty, Pack2Barcode, Pack2Qty, Pack3Barcode, Pack3Qty, OtherBarcode, OtherQty, WhlslBarcode, WhlslQty);

        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
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
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    };

    const AutoBarcode = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            CtnBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '01',
            HalfCtnBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '02',
            TwelveBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '03',
            TenBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '04',
            EightBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '05',
            SixBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '06',
            FourBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '07',
            Pack1Barcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '08',
            Pack2Barcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '09',
            Pack3Barcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '10',
            OtherBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '11',
            WhlslBarcode: props.item.Code.toString().padStart(5, '0').slice(0, 5) + '12',
        })
    }

    function AutoGen(e) {
        e.preventDefault();
        const button = e.target.parentNode;
        let code = props.item.Code.toString().padStart(5, '0').slice(0, 5) + button.id
        setFormData({ ...formData, [button.name]: code });
    }


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
                <p className="text-center m-0">
                    <span className="fs-4">{Exist ? "Update Product Package Reformation" : "Product Package Reformation"}</span> <br />
                    <span className="fs-6 text-dark fw-bold">{props.item.Title + " (" + props.item.Code + ")"}</span> <br />

                    <small className="text-muted">{Exist ? "Please change the required info" : "Please fill the required info"}</small>
                </p>
            </Modal.Header>
            <Modal.Body className="py-1">
                <form>
                    <div className="d-flex justify-content-center">
                        <button className="btn fs-5 fw-bold text-center" onClick={(e) => AutoBarcode(e)}><i class="fad fa-project-diagram"></i> Generate default barcode for all package</button>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pack</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Barcode</span> </th>
                                <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Quantity</span> </th>
                            </tr>
                        </thead>
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-2">Cartoon</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='CtnBarcode'
                                        value={CtnBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="01" name='CtnBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>
                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='CtnQty'
                                        value={CtnQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">Half Cartoon</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='HalfCtnBarcode'
                                        value={HalfCtnBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="02" name='HalfCtnBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>
                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='HalfCtnQty'
                                        value={HalfCtnQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">12 Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='TwelveBarcode'
                                        value={TwelveBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="03" name='TwelveBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='TwelveQty'
                                        value={TwelveQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">10 Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='TenBarcode'
                                        value={TenBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="04" name='TenBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='TenQty'
                                        value={TenQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">8 Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='EightBarcode'
                                        value={EightBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="05" name='EightBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='EightQty'
                                        value={EightQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">6 Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='SixBarcode'
                                        value={SixBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="06" name='SixBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='SixQty'
                                        value={SixQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">4 Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='FourBarcode'
                                        value={FourBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="07" name='FourBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='FourQty'
                                        value={FourQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">Pack 1</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack1Barcode'
                                        value={Pack1Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="08" name='Pack1Barcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack1Qty'
                                        value={Pack1Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">Pack 2</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack2Barcode'
                                        value={Pack2Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="09" name='Pack2Barcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack2Qty'
                                        value={Pack2Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">Pack 3</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack3Barcode'
                                        value={Pack3Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="10" name='Pack3Barcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack3Qty'
                                        value={Pack3Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" scope="row">Other Pack</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='OtherBarcode'
                                        value={OtherBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="11" name='OtherBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='OtherQty'
                                        value={OtherQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2">Wholesale</td>
                                <td className="py-2 px-1">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '90%', fontWeight: "bold", paddingLeft: "5px", textAlign: "center", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='WhlslBarcode'
                                        value={WhlslBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                    <button className="btn text-dark px-0" id="12" name='WhlslBarcode' style={{ width: "10%" }} onClick={(e) => AutoGen(e)}><i class="fad fa-location"></i></button>

                                </td>
                                <td className="py-2 d-flex justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", width: '100px', fontWeight: "bold", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='WhlslQty'
                                        value={WhlslQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                        </tbody>

                    </table>
                </form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={(e) => Create_Product_Item(e)}>{Exist ? "Update" : "Save"} </button>
            </Modal.Footer>
        </Modal >
    );
}

export const AddPack = (props) => {

    const [Error, setError] = useState({});
    const [Exist, setExist] = useState(false);
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        ItemID: props.item.id,

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
        OtherPrice: "",
        WhlslBarcode: "",
        WhlslQty: "",
        WhlslPrice: "",
    });

    const { ItemID, PurchasePrice, MRP, RetailPrice, CtnBarcode, CtnQty, CtnPrice, HalfCtnBarcode, HalfCtnQty, HalfCtnPrice, TwelveBarcode, TwelveQty, TwelvePrice, TenBarcode, TenQty, TenPrice, EightBarcode, EightQty, EightPrice, SixBarcode, SixQty, SixPrice, FourBarcode, FourQty, FourPrice, Pack1Barcode, Pack1Qty, Pack1Price, Pack2Barcode, Pack2Qty, Pack2Price, Pack3Barcode, Pack3Qty, Pack3Price, OtherBarcode, OtherQty, OtherPrice, WhlslBarcode, WhlslQty, WhlslPrice } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        LoadProductPackage();
    }, [])

    const LoadProductPackage = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var pack = await FetchPackNPrice(props.item.id);

        if (pack !== true) {
            setExist(true)
            setFormData({
                ItemID: pack.ItemID,
                PurchasePrice: pack.PurchasePrice,
                MRP: pack.MRP,
                RetailPrice: pack.RetailPrice,

                CtnBarcode: pack.CtnBarcode,
                CtnQty: pack.CtnQty,
                CtnPrice: pack.CtnPrice,
                HalfCtnBarcode: pack.HalfCtnBarcode,
                HalfCtnQty: pack.HalfCtnQty,
                HalfCtnPrice: pack.HalfCtnPrice,
                TwelveBarcode: pack.TwelveBarcode,
                TwelveQty: pack.TwelveQty,
                TwelvePrice: pack.TwelvePrice,
                TenBarcode: pack.TenBarcode,
                TenQty: pack.TenQty,
                TenPrice: pack.TenPrice,
                EightBarcode: pack.EightBarcode,
                EightQty: pack.EightQty,
                EightPrice: pack.EightPrice,
                SixBarcode: pack.SixBarcode,
                SixQty: pack.SixQty,
                SixPrice: pack.SixPrice,
                FourBarcode: pack.FourBarcode,
                FourQty: pack.FourQty,
                FourPrice: pack.FourPrice,
                Pack1Barcode: pack.Pack1Barcode,
                Pack1Qty: pack.Pack1Qty,
                Pack1Price: pack.Pack1Price,
                Pack2Barcode: pack.Pack2Barcode,
                Pack2Qty: pack.Pack2Qty,
                Pack2Price: pack.Pack2Price,
                Pack3Barcode: pack.Pack3Barcode,
                Pack3Qty: pack.Pack3Qty,
                Pack3Price: pack.Pack3Price,
                OtherBarcode: pack.OtherBarcode,
                OtherQty: pack.OtherQty,
                OtherPrice: pack.OtherPrice,
                WhlslBarcode: pack.WhlslBarcode,
                WhlslQty: pack.WhlslQty,
                WhlslPrice: pack.WhlslPrice,
            });
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ClearField = () => {
        setFormData({
            ItemID: props.item.id,

            PurchasePrice: "",
            MRP: "",
            RetailPrice: "",

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
            OtherPrice: "",
            WhlslBarcode: "",
            WhlslQty: "",
            WhlslPrice: "",
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


        const result = await CreatePackage(ItemID, PurchasePrice, MRP, RetailPrice, WhlslPrice, CtnPrice, HalfCtnPrice, TwelvePrice, TenPrice, EightPrice, SixPrice, FourPrice, Pack1Price, Pack2Price, Pack3Price, OtherPrice);

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
                description: "Failed to save product package. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
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
            <Modal.Header className="py-2 justify-content-center">
                <p className="text-center m-0">
                    <span className="fs-4">{Exist ? "Update Product Package Price" : "Product Package Pricing"}</span> <br />
                    <span className="fs-6 text-dark fw-bold">{props.item.Title + " (" + props.item.Code + ")"}</span> <br />

                    <small className="text-muted">{Exist ? "Please change the required info" : "Please fill the required info"}</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table className="table table-bordered">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-2">Purchase Price</td>
                                <td className="py-2">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Unit Price'
                                        name='PurchasePrice'
                                        value={PurchasePrice}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>

                            <tr>
                                <td className="py-2">MRP</td>
                                <td className="py-2">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='MRP'
                                        name='MRP'
                                        value={MRP}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>

                            <tr>
                                <td className="py-2">Retail Price</td>
                                <td className="py-2">:</td>
                                <th className="py-2">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px" }}
                                        type='number'
                                        placeholder='Retail Price'
                                        name='RetailPrice'
                                        value={RetailPrice}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        required
                                    />
                                </th>
                            </tr>
                        </tbody>
                    </table>


                    <table className="table table-bordered">
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Pack</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Barcode</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Quantity</span> </th>
                                <th className="border-right-0 p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Price</span> </th>
                            </tr>
                        </thead>
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-2" colSpan={1}>Cartoon</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='CtnBarcode'
                                        value={CtnBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='CtnQty'
                                        value={CtnQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='CtnPrice'
                                        value={CtnPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>


                            <tr>
                                <td className="py-2" colSpan={1}>Half Cartoon</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='HalfCtnBarcode'
                                        value={HalfCtnBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='HalfCtnQty'
                                        value={HalfCtnQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='HalfCtnPrice'
                                        value={HalfCtnPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>12 Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='TwelveBarcode'
                                        value={TwelveBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='TwelveQty'
                                        value={TwelveQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='TwelvePrice'
                                        value={TwelvePrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>10 Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='TenBarcode'
                                        value={TenBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>

                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='TenQty'
                                        value={TenQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>

                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='TenPrice'
                                        value={TenPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>

                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>8 Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='EightBarcode'
                                        value={EightBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='EightQty'
                                        value={EightQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='EightPrice'
                                        value={EightPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>6 Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='SixBarcode'
                                        value={SixBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">

                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='SixQty'
                                        value={SixQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='SixPrice'
                                        value={SixPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>4 Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='FourBarcode'
                                        value={FourBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='FourQty'
                                        value={FourQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='FourPrice'
                                        value={FourPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>Pack 1</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack1Barcode'
                                        value={Pack1Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack1Qty'
                                        value={Pack1Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='Pack1Price'
                                        value={Pack1Price}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>Pack 2</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack2Barcode'
                                        value={Pack2Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack2Qty'
                                        value={Pack2Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='Pack2Price'
                                        value={Pack2Price}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>Pack 3</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='Pack3Barcode'
                                        value={Pack3Barcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='Pack3Qty'
                                        value={Pack3Qty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='Pack3Price'
                                        value={Pack3Price}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>Other Pack</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='OtherBarcode'
                                        value={OtherBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='OtherQty'
                                        value={OtherQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='OtherPrice'
                                        value={OtherPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="py-2" colSpan={1}>Wholesale</td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100%", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Barcode'
                                        name='WhlslBarcode'
                                        value={WhlslBarcode}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Qty'
                                        name='WhlslQty'
                                        value={WhlslQty}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                                <td className="py-2 justify-content-center">
                                    <input
                                        style={{ backgroundColor: "#F4F7FC", border: "0px", fontWeight: "bold", width: "100px", paddingLeft: "5px", textAlign: "center" }}
                                        type='text'
                                        placeholder='Price'
                                        name='WhlslPrice'
                                        value={WhlslPrice}
                                        //onFocus={e => handleFocus(e)}
                                        onChange={e => onChange(e)}
                                        //onBlur={(e) => onBlur(e)}
                                        maxLength='50'
                                        required
                                    />
                                </td>
                            </tr>

                        </tbody>

                    </table>
                </form>
            </Modal.Body >
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                <button className="btn btn-outline-success" onClick={(e) => Create_Product_Item(e)}>Submit </button>
            </Modal.Footer>
        </Modal >
    );
}









