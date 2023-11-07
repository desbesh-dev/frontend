import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { SaveBatchStock } from '../../actions/ContractAPI';

import { useDispatch } from 'react-redux';
import errorIcon from '../../assets/error.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';

export const StockModal = (props) => {
    const [id, setID] = useState(props.stock_data.Stock.Return.salemap_id ? props.stock_data.Stock.Return.salemap_id : null)
    const [ItemCode, setItemCode] = useState(props.stock_data.Stock.StockFeed.ItemCode ? props.stock_data.Stock.StockFeed.ItemCode : null)
    const [InvoiceNo, setInvoiceNo] = useState(props.stock_data.Stock.StockFeed.InvoiceNo ? props.stock_data.Stock.StockFeed.InvoiceNo : "")
    const [RecallCode, setRecallCode] = useState(props.stock_data.Stock.Return.id ? props.stock_data.Stock.Return.id : "")
    const [FeedCode, setFeedCode] = useState(props.stock_data.Stock.StockFeed.id ? props.stock_data.Stock.StockFeed.id : "")
    const [FeedQty, setFeedQty] = useState(props.stock_data.Stock.StockFeed.Qty ? props.stock_data.Stock.StockFeed.Qty : 0)
    const [FeedWeight, setFeedWeight] = useState(props.stock_data.Stock.StockFeed.Weight ? props.stock_data.Stock.StockFeed.Weight : "")
    const [FeedRate, setFeedRate] = useState(props.stock_data.Stock.StockFeed.Rate ? props.stock_data.Stock.StockFeed.Rate : "")
    const [FeedAmount, setFeedAmount] = useState(FeedQty * FeedRate)
    const [FeedCOA, setFeedCOA] = useState(props.stock_data.Stock.StockFeed.COA ? props.stock_data.Stock.StockFeed.COA : "")

    const [BirdCode, setBirdCode] = useState(props.stock_data.Stock.StockBird.id ? props.stock_data.Stock.StockBird.id : "")
    const [BirdQty, setBirdQty] = useState(props.stock_data.Stock.StockBird.Qty ? props.stock_data.Stock.StockBird.Qty : "")
    const [BirdWeight, setBirdWeight] = useState(props.stock_data.Stock.StockBird.Weight ? props.stock_data.Stock.StockBird.Weight : "")
    const [BirdRate, setBirdRate] = useState(props.stock_data.Stock.StockBird.Rate ? props.stock_data.Stock.StockBird.Rate : "")
    const [BirdAmount, setBirdAmount] = useState(BirdWeight * BirdRate)
    const [BirdCOA, setBirdCOA] = useState(props.stock_data.Stock.StockBird.COA ? props.stock_data.Stock.StockBird.COA : "")

    const [RecallQty, setRecallQty] = useState(0)
    const [RecallWeight, setRecallWeight] = useState(0.000)
    const [NetPayment, setNetPayment] = useState(props.stock_data.NetPayment ? props.stock_data.NetPayment - FeedAmount - BirdAmount : 0.00)
    const [Point, setPoint] = useState(props.stock_data.Summary ? props.stock_data.Summary.Point : 0.00)
    const [Rate, setRate] = useState(props.stock_data.Summary ? props.stock_data.Summary.Rate : 0.00)

    const [Status, setStatus] = useState()
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setBirdQty(false);
        setBirdWeight(false);
        props.onHide();
    }

    const SendBatchAc = async () => {
        var StockData = [
            FeedQty ? { 'OpCode': props.stock_data.Stock.StockFeed.OpCode, 'PolicyCode': FeedCode, 'InvoiceNo': InvoiceNo, 'Qty': parseFloat(FeedQty).toFixed(2), 'Weight': parseFloat(FeedWeight).toFixed(3), 'Rate': parseFloat(FeedRate).toFixed(2), 'DR': 0.00, 'CR': parseFloat(FeedAmount).toFixed(2), 'COA': FeedCOA, 'Status': 1 } : null,
            BirdQty ? { 'OpCode': props.stock_data.Stock.StockBird.OpCode, 'PolicyCode': BirdCode, 'InvoiceNo': null, 'Qty': parseInt(BirdQty), 'Weight': parseFloat(BirdWeight).toFixed(3), 'Rate': parseFloat(BirdRate).toFixed(2), 'DR': 0.00, 'CR': parseFloat(BirdAmount).toFixed(2), 'COA': BirdCOA, 'Status': 1 } : null,
            RecallQty ? { 'OpCode': props.stock_data.Stock.Return.OpCode, 'PolicyCode': RecallCode, 'InvoiceNo': InvoiceNo, 'Qty': parseFloat(RecallQty).toFixed(2), 'Weight': parseFloat(RecallWeight).toFixed(3), 'Rate': parseFloat(FeedRate).toFixed(2), 'DR': id, 'CR': parseFloat(RecallQty * FeedRate).toFixed(2), 'Status': 0 } : null,
        ]

        const result = await SaveBatchStock(StockData, parseInt(props.stock_data.BatchID));
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.set_list([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid props.item',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                props.set_list([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                PropLoadSet();
            }
        } else {
            props.set_list([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Product return failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const FeedWeightCalc = (e) => {
        setError({});
        if (props.stock_data.Stock.StockFeed.Weight < e.target.value) {
            setRecallWeight(0.000)
            setFeedWeight(0.000)
        } else {
            let qt = parseFloat(e.target.value / props.stock_data.Stock.StockFeed.CondValue);
            let r_wt = props.stock_data.Stock.StockFeed.Weight - e.target.value;
            setNetPayment(props.stock_data.NetPayment && props.stock_data.NetPayment > NetPayment ? props.stock_data.NetPayment - (qt * FeedRate) - BirdAmount : props.stock_data.NetPayment - ((qt * FeedRate) - BirdAmount || 0.00));
            setRecallWeight(r_wt)
            setRecallQty(parseFloat(r_wt / props.stock_data.Stock.StockFeed.CondValue))
            setFeedWeight(e.target.value)
            setFeedQty(qt)
            setFeedAmount(props.stock_data.Stock.StockFeed.Rate * qt)
        }
    }

    const FeedRateCalc = (e) => {
        setError({});
        setNetPayment(props.stock_data.NetPayment && props.stock_data.NetPayment > NetPayment ? props.stock_data.NetPayment - (FeedQty * Math.round(Number(e.target.value) || 0)) - BirdAmount : props.stock_data.NetPayment - (FeedQty * Math.round(Number(e.target.value) || 0) - BirdAmount || 0.00));
        setFeedAmount(FeedQty * e.target.value);
        setFeedRate(e.target.value);
    }

    const BirdRateCalc = (e) => {
        setError({});
        setNetPayment(props.stock_data.NetPayment && props.stock_data.NetPayment > NetPayment ? props.stock_data.NetPayment - (BirdWeight * Math.round(Number(e.target.value) || 0)) - FeedAmount : props.stock_data.NetPayment - (BirdWeight * Math.round(Number(e.target.value) || 0) - FeedAmount || 0.00));
        setBirdAmount(BirdWeight * e.target.value || 0);
        setBirdRate(e.target.value);
    }

    const BirdWeightCalc = (e) => {
        setError({});
        setNetPayment(props.stock_data.NetPayment && props.stock_data.NetPayment > NetPayment ? props.stock_data.NetPayment - (BirdRate * Math.round(Number(e.target.value) || 0)) - FeedAmount : props.stock_data.NetPayment - (BirdRate * Math.round(Number(e.target.value) || 0) - FeedAmount));
        setBirdAmount(parseFloat(e.target.value) * BirdRate);
        setBirdWeight(e.target.value);
    }

    const QtyValidate = () => {
        if (parseFloat(BirdQty) <= parseFloat(props.stock_data.Stock.StockFeed.Qty)) {
            // RecallAction();
        } else {
            setError({ Qty: "Quantity can not large then " + props.stock_data.Stock.StockFeed.Qty })
        }
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Batch Termination Request</span>
                        <small className="fw-bold text-center px-0">Adjust the necessity info & submit to close the batch.</small>
                        <span class="fs-6 text-center text-white w-auto bg-gradient bg-success py-0 my-1" style={{ borderRadius: "15px" }}>
                            Point: <span className="fs-6 fw-bold border-left px-2">{parseFloat(Point).toFixed(2)}</span>
                        </span>
                        <span class={`fs-6 text-center text-white w-auto bg-gradient py-0 mx-2 ${parseFloat(NetPayment) <= 0 ? "bg-warning" : "bg-success"}`} style={{ borderRadius: "15px" }}>
                            Net Payment: <span className="fs-6 fw-bold border-left px-2">{parseFloat(NetPayment).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                        </span>
                        <span class="fs-6 text-center text-white w-auto bg-gradient bg-success py-0 my-1" style={{ borderRadius: "15px" }}>
                            Rate: <span className="fs-6 fw-bold border-left px-2">{parseFloat(Rate).toFixed(2)}</span>
                        </span>

                        <form>

                            <div className="form-group border mt-2" style={{ borderRadius: "15px" }}>
                                <p class="col-form-label fs-6 fw-bold text-center text-success border-bottom mx-2 p-0">Stock Bird</p>
                                <div className="form-group px-2 d-flex">
                                    <div className="row pr-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Quantity</label>
                                        <input
                                            type="number"
                                            class="form-control fw-bold"
                                            id="BirdQty"
                                            name="BirdQty"
                                            placeholder={BirdQty === "" ? props.stock_data.Stock.StockBird.Qty.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : 'Stock Bird Qty'}
                                            value={BirdQty}
                                            onChange={e => setBirdQty(e.target.value)}
                                        />
                                        {Error.BirdQty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdQty}</small></p>
                                            : null}
                                    </div>
                                    <div className="row pl-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Weight</label>
                                        <input
                                            type="number"
                                            class="form-control fw-bold"
                                            id="BirdWeight"
                                            name="BirdWeight"
                                            placeholder='Stock Bird Weight'
                                            value={BirdWeight.toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                            onChange={e => BirdWeightCalc(e)}
                                        />
                                        {Error.BirdWeight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdWeight}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="form-group px-2 d-flex">
                                    <div className="row pr-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Rate</label>
                                        <input
                                            type="number"
                                            class="form-control fw-bold"
                                            id="BirdRate"
                                            name="BirdRate"
                                            placeholder='Stock Bird Rate'
                                            value={BirdRate}
                                            onChange={e => BirdRateCalc(e)}
                                        />
                                        {Error.BirdRate ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdRate}</small></p>
                                            : null}
                                    </div>
                                    <div className="row pl-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Amount</label>
                                        <input
                                            type="text"
                                            class="form-control fw-bold"
                                            id="BirdAmount"
                                            name="BirdAmount"
                                            placeholder='Stock Bird Amount'
                                            value={parseFloat(BirdAmount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                            disabled
                                        // onChange={e => setBirdWeight(e.target.value)}
                                        />
                                        {Error.BirdAmount ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.BirdAmount}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group border mt-2" style={{ borderRadius: "15px" }}>
                                <p class="col-form-label fs-6 fw-bold text-center text-success border-bottom mx-2 p-0">Stock Feed</p>
                                <div className="form-group px-2 d-flex">
                                    <div className="row pr-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Quantity</label>
                                        <input
                                            type="numeric"
                                            class="form-control fw-bold"
                                            id="FeedQty"
                                            name="FeedQty"
                                            placeholder='Stock Feed Qty'
                                            value={parseFloat(FeedQty).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                            disabled
                                        // onChange={e => BirdQtyCalc(e)}
                                        />
                                        {Error.FeedQty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedQty}</small></p>
                                            : null}
                                    </div>
                                    <div className="row pl-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Weight</label>
                                        <input
                                            type="numeric"
                                            class="form-control fw-bold"
                                            id="FeedWeight"
                                            name="FeedWeight"
                                            placeholder={FeedWeight === "" ? props.stock_data.Stock.StockFeed.Weight.toLocaleString("en-BD", { minimumFractionDigits: 3 }) : 'Stock Feed Weight'}
                                            value={FeedWeight.toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                            onChange={e => FeedWeightCalc(e)}
                                        />
                                        {Error.FeedWeight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedWeight}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="form-group px-2 d-flex">
                                    <div className="row pr-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Rate</label>
                                        <input
                                            type="number"
                                            class="form-control fw-bold"
                                            id="FeedRate"
                                            name="FeedRate"
                                            placeholder='Stock Feed Rate'
                                            value={FeedRate}
                                            onChange={e => FeedRateCalc(e)}
                                        />
                                        {Error.FeedRate ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedRate}</small></p>
                                            : null}
                                    </div>
                                    <div className="row pl-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Amount</label>
                                        <input
                                            type="text"
                                            class="form-control fw-bold"
                                            id="FeedAmount"
                                            name="FeedAmount"
                                            placeholder='Stock Feed Amount'
                                            value={parseFloat(FeedAmount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                            // onChange={e => setFeedAmount(e.target.value)}
                                            disabled
                                        />
                                        {Error.FeedAmount ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.FeedAmount}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className={`form-group border mt-2 ${RecallWeight > 0 ? "d-block" : "d-none"}`} style={{ borderRadius: "15px" }}>
                                <p class="col-form-label fs-6 fw-bold text-center text-success border-bottom mx-2 p-0">Recallable Feed</p>
                                <p class="col-form-label fs-6 fw-bold text-center text-dark m-0">{props.stock_data.Stock.StockFeed.Title ? props.stock_data.Stock.StockFeed.ItemCode + ". " + props.stock_data.Stock.StockFeed.Title : null}</p>

                                <div className="form-group px-2 d-flex">
                                    <div className="row pr-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Quantity</label>
                                        <input
                                            type="number"
                                            class="form-control fw-bold"
                                            id="RecallQty"
                                            name="RecallQty"
                                            placeholder='Return Feed Qty'
                                            value={parseFloat(RecallQty).toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                            disabled
                                        // onChange={e => BirdQtyCalc(e)}
                                        />
                                        {Error.RecallQty ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RecallQty}</small></p>
                                            : null}
                                    </div>
                                    <div className="row pl-1 m-0 w-100">
                                        <label htmlFor="message-text" class="col-form-label p-0">* Weight</label>
                                        <input
                                            type="text"
                                            class="form-control fw-bold"
                                            id="RecallWeight"
                                            name="RecallWeight"
                                            placeholder='Return Feed Weight'
                                            value={parseFloat(RecallWeight).toLocaleString("en-BD", { minimumFractionDigits: 3 })}
                                            // onChange={e => setBirdWeight(e.target.value)}
                                            disabled
                                        />
                                        {Error.RecallWeight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.RecallWeight}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => SendBatchAc()}><i class="fad fa-cloud-upload-alt pr-2"></i> Submit</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}
