import * as moment from 'moment'
import { MyOrders, colourStyles, SendOrder, MyProductList } from '../../../actions/SuppliersAPI';
import { LoadLadger, LoadSellReport } from '../../../actions/ContractAPI';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../actions/auth';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const SellReport = ({ UserID, BisID, BatchID, SupplierID, user, list, setList }) => {

    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [BSData, setBSData] = useState(false)
    const [BSReturnData, setBSReturnData] = useState(false)
    const [Data, setData] = useState(false)
    const [MyProList, setMyProList] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        SellReportData();
    }, [])


    const SellReportData = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadSellReport(BatchID, 0);
        if (result !== true) {
            setBSData(result.Scale);
            setBSReturnData(result.Return);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const QtyTotal = (item) => item.reduce((Quantity, myvalue) => Quantity + parseInt(myvalue.Qty, 10), 0);
    const WeightTotal = (item) => item.reduce((Weight, myvalue) => Weight + parseFloat(myvalue.Weight, 10), 0);

    const Load = Array.isArray(BSData) && BSData.length ? BSData.map(item => {
        let Qty = item.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0)
        let Weight = item.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0)
        var value = { "Qty": Qty, "Weight": Weight }
        return value;
    }) : 0

    let totQT = Array.isArray(Load) && Load.length ? Load.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0) : 0
    let totWT = Array.isArray(Load) && Load.length ? Load.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0) : 0.000

    const Return = Array.isArray(BSReturnData) && BSReturnData.length ? BSReturnData.map(item => {
        let Qty = item.reduce((sum, part) => sum + parseInt(part.Qty, 10), 0)
        let Weight = item.reduce((sum, part) => sum + parseFloat(part.Weight, 10), 0)
        var value = { "Qty": Qty, "Weight": Weight }
        return value;
    }) : 0

    return (
        <div className="position-relative mb-5 mt-2" style={{ height: "90%" }}>

            <div className="position-absolute overflow-auto w-100 h-75 bg-white">
                <p className="fs-4 fw-bolder text-center py-2 m-0">SELL REPORT</p>

                <div className="row justify-content-center mx-2">
                    {
                        Array.isArray(BSData) && BSData.length ? BSData.map((item, i, Data) => (
                            <div className="col-md-3 justify-content-center align-items-center">
                                <table className={`table table-hover border`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">SLNo</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Qty</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-dark">Weight</span></th>
                                        </tr>
                                    </thead>
                                    {
                                        Array.isArray(item) && item.length ? item.map((value, n, Data) => (
                                            <tbody>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1">{n + 1}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2 py-1" >{value.Qty}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark px-2 py-1">{value.Weight}</span> </td>
                                            </tbody>
                                        ))
                                            : null
                                    }
                                    <tbody>
                                        <td colSpan="3" className="py-0 px-2"><span className="d-block fs-6 fw-bolder text-center text-dark px-2 py-1">{QtyTotal(item) + " PCS,  " + WeightTotal(item).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span></td>
                                    </tbody>

                                </table>
                            </div>
                        ))
                            : null
                    }{
                        Array.isArray(BSReturnData) && BSReturnData.length ? BSReturnData.map((item, i, Data) => (
                            <div className="col-md-3 justify-content-center align-items-center">
                                <table className={`table table-hover border`}>
                                    <thead>
                                        <tr className="text-center" style={{ borderBottom: "1px solid #DEE2E6" }}>
                                            <th colSpan={3} className="border-top-0 px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-warning">Return Birds</span></th>
                                        </tr>
                                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-danger">SLNo</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-danger">Qty</span></th>
                                            <th className="border-top-0 border-right px-2 py-1 align-middle"><span className="fs-6 fw-bolder text-danger">Weight</span></th>
                                        </tr>
                                    </thead>
                                    {
                                        Array.isArray(item) && item.length ? item.map((value, n, Data) => (
                                            <tbody>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-danger px-2 py-1">{n + 1}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-danger px-2 py-1" >{value.Qty}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-danger px-2 py-1">{value.Weight}</span> </td>
                                            </tbody>
                                        ))
                                            : null
                                    }
                                    <tbody>
                                        <td colSpan="3" className="py-0 px-2"><span className="d-block fs-6 fw-bolder text-center text-danger px-2 py-1">{QtyTotal(item) + " PCS,  " + WeightTotal(item).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG"}</span></td>
                                    </tbody>

                                </table>
                            </div>
                        ))
                            : null
                    }
                </div>
                <div className="row mx-auto my-3">
                    <div className={`d-flex justify-content-center align-items-center`}>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{totQT !== undefined ? `Initial Load: ${parseInt(totQT).toLocaleString("en", { minimumFractionDigits: 0 })} Pcs, ${parseFloat(totWT).toLocaleString("en", { minimumFractionDigits: 3 })} KG` : "N/A"}</p>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{Return[0] !== undefined ? `Return: ${parseInt(Return[0].Qty).toLocaleString("en", { minimumFractionDigits: 0 })} Pcs, ${parseFloat(Return[0].Weight).toLocaleString("en", { minimumFractionDigits: 3 })} KG` : "N/A"}</p>
                        <p className='fs-6 fw-bolder text-dark px-2 justify-content-center border bg-white mx-2' style={{ borderRadius: "20px" }}>{totQT !== undefined && Return[0] !== undefined ? `Total Sell: ${parseInt(totQT - Return[0].Qty).toLocaleString("en", { minimumFractionDigits: 0 })} Pcs, ${parseFloat(totWT - Return[0].Weight).toLocaleString("en", { minimumFractionDigits: 3 })} KG` : `Total Sell: ${parseInt(totQT).toLocaleString("en", { minimumFractionDigits: 0 })} Pcs, ${parseFloat(totWT).toLocaleString("en", { minimumFractionDigits: 3 })} KG`}</p>
                    </div>
                </div>
            </div >

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    // BisID: props.BisID,
    // BatchID: props.BatchID,
    // UserID: props.UserID
});

export default connect(mapStateToProps, { logout })(SellReport);