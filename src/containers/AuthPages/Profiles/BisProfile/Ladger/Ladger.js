import jsPDF from 'jspdf';
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FetchBisLadger } from '../../../../../actions/APIHandler';
import { logout } from '../../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import { customHeader, locales } from "../../../../Suppliers/Class/datepicker";
import { exportPDF } from './LadgerPDF';
let today = new Date();

const Ladger = ({ CompanyID, BranchID, BisData, UserData, user, UserID, BisID, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(today);
    const [SearchKey, setSearchKey] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    let Tarikh = DateFrom.getTime() === DateTo.getTime() ? moment(today).format("DD MMM YYYY") : " (" + moment(DateFrom).format("DD MMM YYYY") + " to " + moment(DateTo).format("DD MMM YYYY") + ") "

    useEffect(() => {
        BisLadger();
        setDateTo(today);
    }, [])

    const BisLadger = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchBisLadger(BisID);
            if (result !== true)
                setData(result.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            // history.push(`/farm_mng/${UserID}/${BisID}/${BatchID}`);
        }
    }

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");

        if (DateFrom.getTime() > e.getTime()) {

        } else {
            // dispatch({ type: DISPLAY_OVERLAY, payload: true });
            // // var result = await LoadBirdSellHistory(date);
            // 
            // // if (result !== true) {
            // //     setData(result);
            // // } else {
            // //     // history.push('/not_found');
            // // }
            // dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }
    const PrvDate = (i) => Array.isArray(Data) && Data.length ? typeof (Data[i - 1]) !== 'undefined' && Data[i - 1] != null ? Data[i - 1].Date : 0 : 0


    const GenPDF = () => {
        var doc = new jsPDF();
        doc.autoTable({
            html: '#table',
            didDrawCell: function (data) {
                if (data.column.dataKey === 4 && data.cell.section === 'body') {
                    doc.autoTable({
                        head: [["One", "Two", "Three", "Four", "Five"]],
                        body: [
                            ["1", "2", "3", "4", "5"],
                            ["1", "2", "3", "4", "5"],
                            ["1", "2", "3", "4", "5"],
                            ["1", "2", "3", "4", "5"]
                        ],
                        startY: data.cell.y + 2,
                        margin: { left: data.cell.x + data.cell.padding('left') },
                        tableWidth: 'wrap',
                        theme: 'grid',
                        styles: {
                            fontSize: 7,
                            cellPadding: 1,
                        }
                    });
                }
            },
            columnStyles: {
                0: { cellWidth: 80 }
            },
            bodyStyles: {
                minCellHeight: 8
            }
        });
        doc.save('table.pdf');
    }
    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2 px-0">
                    <div className="col-md-12 justify-content-center align-items-center">
                        <div className={`d-flex justify-content-between bg-white py-2 px-0`}>
                            <p className='display-6 bg-white fw-bolder m-0'>LEDGER</p>
                            <div className="d-flex justify-content-end">
                                <Datepicker
                                    selected={DateFrom}
                                    className="form-control fs-5 fw-bold round_radius50px text-center"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setDateFrom(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Date"
                                />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>To</p>
                                <Datepicker
                                    selected={DateTo}
                                    className="form-control fs-5 fw-bold round_radius50px text-center"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => DateHandler(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Date"
                                />

                                <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                                    onClick={(e) => exportPDF(e, BisData, UserData, Tarikh, Data, '#table', '#NestTable')}
                                // onClick={(e) => GenPDF()}

                                ><i class="fad fa-file-pdf"></i></button>
                                {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center bg-white py-2 h-100">
                            <div className="col-md-12 justify-content-center align-items-center h-100">

                                <table id="table" className={`table table-hover table-borderless table-responsive card-1 d-table justify-content-center position-absolute overflow-auto top-0 start-50 translate-middle-x p-2 m-0`} style={{ maxHeight: "70%" }}>
                                    <thead>
                                        <tr className="text-center border-top" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th colSpan="2" className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Transaction Details</span></th>
                                            {/* <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Details</span></th> */}
                                            {/* <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">J.P. No</span></th> */}
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                            <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                            <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Array.isArray(Data) && Data.length ? Data.map((item, i, Data) => (
                                                <>
                                                    {
                                                        PrvDate(i) !== item.Date ?
                                                            <>
                                                                <tr className="text-center bg-light" key={i}>
                                                                    <td colSpan="5" className="py-0 px-1"><span className="d-block fs-5 fw-bolder text-left text-dark">{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                                                </tr>
                                                            </>
                                                            : null
                                                    }

                                                    <tr>
                                                        <td className="p-0" colSpan="2">
                                                            {
                                                                Array.isArray(item.Details) && item.Details.length ?
                                                                    <table id="NestTable" className={`table table-hover table-responsive card-1 d-table m-0 rounded-0 text-primary`} style={{ maxHeight: "70%" }}>

                                                                        <tbody>
                                                                            {
                                                                                item.Details.map((data, n) => (

                                                                                    <tr className="text-center" key={n + i + 1}>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center px-2">{n + 1}</span></td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-left px-2">{data.Category}</span></td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-left px-2">{data.Title}</span></td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center px-2">{parseFloat(data.Qty).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " QT"}</span> </td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right px-2">{parseFloat(data.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + " WT"}</span></td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right px-2">{parseFloat(data.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " RT"}</span> </td>
                                                                                        <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-right px-2">{parseFloat(data.SubTotal).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " AMT"}</span> </td>
                                                                                        {/* <td className="p-0">
                                                                                            <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setBatchUpdate(true) }} ><i className="fs-6 fad fa-edit" /></button>
                                                                                            <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setDeleteModalShow(true) }} ><i className="fs-6 fad fa-trash-alt" /></button>
                                                                                            <button className="btn p-1 text-primary" onClick={() => { setBatch(batch); setModBatchDetails(true) }}><i className="fs-6 fad fa-eye" /></button>
                                                                                        </td> */}

                                                                                    </tr>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                    : null
                                                            }
                                                        </td>
                                                    </tr>

                                                    <tr className="border-bottom border-top">
                                                        {
                                                            parseInt(item.Order) === 3 ? <td className="border-right py-0 pl-4"><span className="fs-6 fw-bold text-center text-dark">{item.RefNo}</span>
                                                            </td> :
                                                                parseInt(item.SLNo) === 1 ?
                                                                    <td rowSpan={parseInt(item.Count)} colSpan={Array.isArray(item.Details) ? "2" : 0} className="border-right py-0 pl-4"><span className="fs-6 fw-bold text-center text-dark">{Array.isArray(item.Details) ? item.RefNo : moment(item.Date).format("DD MMM YYYY")}</span>
                                                                    </td>
                                                                    : null
                                                        }
                                                        {/* <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-left text-dark btn px-2" >{item.RefNo}</span></td> */}
                                                        {Array.isArray(item.Details) ? null :
                                                            <>
                                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{Array.isArray(item.Details) ? null : item.Details}</span></td>
                                                                {/* <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark btn px-2" >{item.RefNo}</span></td> */}
                                                            </>
                                                        }
                                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Credit) === 0 ? "—" : (item.Credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Debit) === 0 ? "—" : (item.Debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                        <td className="border-0 py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                    </tr>

                                                </>
                                            ))
                                                : null
                                        }
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Ladger);