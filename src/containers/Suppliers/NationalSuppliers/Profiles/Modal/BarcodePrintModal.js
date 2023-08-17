import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { FetchBarcode } from "../../../../../actions/InventoryAPI";
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import { BarcodePrint } from "../BarcodePrint";

export const BarcodeList = (props) => {
    const dispatch = useDispatch();

    const ViewPackBarcode = async (e, status) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchBarcode(props.item.id, e.target.name, e.target.id);
        if (result !== true) {
            BarcodePrint(e, result, status)
            props.onHide();
        } else {
            props.onHide();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ViewPackPrintBarcode = async (e, status) => {
        const button = e.target.parentNode;
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchBarcode(props.item.id, button.name, button.id);
        if (result !== true) {
            BarcodePrint(e, result, status)
            props.onHide();
        } else {
            props.onHide();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const ViewBarcode = async (e, status) => {
        var item_dict = {
            "Title": props.item.Title,
            "Barcode": props.item.Barcode,
            "Qty": 1,
            "Pack": "L/S",
        }
        BarcodePrint(e, item_dict, status)
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">
            <Modal.Header className="py-2" closeButton>
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center text-center">Please Select Package type</p>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
                <div className="btn-group-vertical w-50">
                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='CtnBarcode' id='CtnQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Cartoon
                        <button className="btn btn-outline-light py-1 px-2" name='CtnBarcode' id='CtnQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='HalfCtnBarcode' id='HalfCtnQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 1/2 Cartoon
                        <button className="btn btn-outline-light py-1 px-2" style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='TwelveBarcode' id='TwelveQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 12 Pack
                        <button className="btn btn-outline-light py-1 px-2" name='TwelveBarcode' id='TwelveQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='TenBarcode' id='TenQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 10 Pack
                        <button className="btn btn-outline-light py-1 px-2" name='TenBarcode' id='TenQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='EightBarcode' id='EightQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 8 Pack
                        <button className="btn btn-outline-light py-1 px-2" name='EightBarcode' id='EightQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='SixBarcode' id='SixQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 6 Pack
                        <button className="btn btn-outline-light py-1 px-2" name='SixBarcode' id='SixQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='FourBarcode' id='FourQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> 4 Pack
                        <button className="btn btn-outline-light py-1 px-2" name='FourBarcode' id='FourQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='Pack1Barcode' id='Pack1Qty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Pack 1
                        <button className="btn btn-outline-light py-1 px-2" name='Pack1Barcode' id='Pack1Qty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='Pack2Barcode' id='Pack2Qty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Pack 2
                        <button className="btn btn-outline-light py-1 px-2" name='Pack2Barcode' id='Pack2Qty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='Pack3Barcode' id='Pack3Qty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Pack 3
                        <button className="btn btn-outline-light py-1 px-2" name='Pack3Barcode' id='Pack3Qty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='OtherBarcode' id='OtherQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Others Pack
                        <button className="btn btn-outline-light py-1 px-2" name='OtherBarcode' id='OtherQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='WhlslBarcode' id='WhlslQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewPackBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" style={{ width: "30px" }} /> Wholesale/COD
                        <button className="btn btn-outline-light py-1 px-2" name='WhlslBarcode' id='WhlslQty' style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewPackPrintBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>

                    <button className="btn btn-outline-success fs-4 fw-bold mb-2 d-flex align-items-center justify-content-between" name='Barcode' id='BarcodeQty' style={{ borderRadius: "50px" }}
                        onClick={(e) => ViewBarcode(e, false)}>
                        <i className="fs-4 fad fa-box-full pr-2 border-right mr-2" name='Barcode' id='BarcodeQty' style={{ width: "30px" }} /> Retail
                        <button className="btn btn-outline-light py-1 px-2" style={{ borderTopRightRadius: "50px", borderBottomRightRadius: "50px" }} onClick={(e) => {
                            e.stopPropagation();
                            ViewBarcode(e, true);
                        }}><i className="fs-5 fad fa-print"></i></button>
                    </button>
                </div>
            </Modal.Body>
        </Modal >
    )
}