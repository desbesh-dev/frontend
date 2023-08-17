import moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { TraceStock } from '../../../../actions/InventoryAPI';
import { customHeader, locales } from '../../../../containers/Suppliers/Class/datepicker';

let today = new Date();
export const StockTrace = (props) => {
    const [Date, setDate] = useState(today)
    const [TraceData, setTraceData] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();

    useEffect(() => {
        DateHandler(props.item.SectorID, props.item.id, Date);
    }, [Date])

    const DateHandler = async (SectorID, id, Date) => {
        const date = moment(Date).format("YYYY-MM-DD")
        var result = await TraceStock(SectorID, id, date);
        if (result !== true) {
            setTraceData(result)
        }
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
                    <span className="fs-4">Stock Trace Modal</span> <br />
                    <span className="fs-6 text-dark fw-bolder">{props.item.Title + " (" + props.item.Code + ")"}</span> <br />
                </p>
            </Modal.Header>
            <Modal.Body>
                <form style={{ height: "320px" }}>
                    <Datepicker
                        selected={Date}
                        className="form-control fs-5 fw-bold round_radius50px text-center w-50 mx-auto"
                        dateFormat="dd MMM yyyy"
                        onChange={(e) => setDate(e)}
                        renderCustomHeader={props => customHeader({ ...props, locale })}
                        locale={locales[locale]}
                        placeholderText="Date"
                    />
                    <table className="table table-bordered mt-2">
                        <tbody className='w-100'>
                            <tr>
                                <td className="py-1 px-2">Last In</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.LastIN) < 0 ? `(${parseFloat(TraceData.LastIN).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.LastIN).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Last Out</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.LastOUT) < 0 ? `(${parseFloat(TraceData.LastOUT).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.LastOUT).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Last Stock</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.LastQTY) < 0 ? `(${parseFloat(TraceData.LastQTY).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.LastQTY).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>
                        </tbody>

                        <tbody className='w-100'>
                            <tr>
                                <td className="py-1 px-2">Today In</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.TodayIN) < 0 ? `(${parseFloat(TraceData.TodayIN).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.TodayIN).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>

                            <tr>
                                <td className="py-1 px-2">Today Out</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.TodayOUT) < 0 ? `(${parseFloat(TraceData.TodayOUT).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.TodayOUT).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>


                            <tr>
                                <td className="py-1 px-2">Current Stock</td>
                                <td className="py-1 px-2 text-center">:</td>
                                <th className="py-1 px-2 text-center">
                                    {parseFloat(TraceData.CurrentQTY) < 0 ? `(${parseFloat(TraceData.CurrentQTY).toLocaleString("en-BD", { minimumFractionDigits: 2 })})` : parseFloat(TraceData.CurrentQTY).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    {TraceData.Available ?
                        <p className='fs-5 fw-bold text-dark text-center'>Last sale invoice available stock is- {parseFloat(TraceData.Available).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " at " + moment(TraceData.Timestamp).format("DD MMM YYYY, hh:mm:ss A")}</p>
                        :
                        <p className='fs-5 fw-bold text-dark text-center'>Not sale yet</p>
                    }

                </form>
            </Modal.Body >
            <Modal.Footer className="justify-content-center">
                <button className="btn btn-outline-success" onClick={() => props.onHide()}>Close</button>
            </Modal.Footer>
        </Modal >
    );
}

