import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import { FetchPartyReports } from '../../../../../actions/PartyAPI';
import { logout } from '../../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import { customHeader, locales } from "../../../../Suppliers/Class/datepicker";
import { CRMReportPDF } from '../../BisProfile/CRM/CRMReportPDF';
let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const CRMReports = ({ PartyID, Limit, PartyData, Title, Name, Contact, Address, user }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [Item, setItem] = useState(false)

    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();

    useEffect(() => {
        LoadReports();
        setDateTo(today);
    }, [])

    const LoadReports = async () => {
        setItem(false);
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyReports(PartyID, date_from, date_to);

        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchPartyReports(PartyID, date_from, date_to);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        const worksheetData = [];

        // Define table headers and push to worksheetData
        worksheetData.push(["Party Insights"]);
        worksheetData.push(["", ""]); // Empty row
        worksheetData.push(["Invoice", Data ? parseFloat(Data.TotalInvoice || 0).toLocaleString("en", { minimumFractionDigits: 0 }) : ""]);
        worksheetData.push(["Sale", Data ? parseFloat(Data.TotalSale || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Discount", Data ? parseFloat(Data.TotalDiscount || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Due", Data ? parseFloat(Data.CurrentDue || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Bank", Data ? parseFloat(Data.TotalBank || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Cash", Data ? parseFloat(Data.TotalCash || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["AVG (Week)", Data ? parseFloat(Data.AVGWeek || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["AVG (Month)", Data ? parseFloat(Data.AVGMonth || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);

        worksheetData.push(["", ""]); // Empty row
        worksheetData.push(["Overall Total"]);
        worksheetData.push(["", ""]); // Empty row
        worksheetData.push(["Total Invoice", PartyData ? parseFloat(PartyData.Invoice || 0).toLocaleString("en", { minimumFractionDigits: 0 }) : ""]);
        worksheetData.push(["Total Sale", PartyData ? parseFloat(PartyData.GrandTotal || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Total Refund", PartyData ? parseFloat(PartyData.ReturnTotal || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Total Discount", PartyData ? parseFloat(PartyData.Discount || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Total Paid", PartyData ? parseFloat(PartyData.Paid || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Current Due", PartyData ? parseFloat(PartyData.Due || 0).toLocaleString("en", { minimumFractionDigits: 2 }) : ""]);
        worksheetData.push(["Credit Limit", parseFloat(Limit || 0).toLocaleString("en", { minimumFractionDigits: 2 })]);

        // Add dates with formatting
        worksheetData.push(["Last Invoice Date", Data ? moment(Data.LastInvoiceDate || "N/A").format("DD MMM YY") : ""]);
        worksheetData.push(["Last Payment Date", Data ? moment(Data.LastPaymentDate).format("DD MMM YY") : ""]);
        worksheetData.push(["Business Since", Data ? moment(Data.BusinessSince).format("DD MMM YY") : ""]);

        // Create worksheet and add it to the workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Party Insights");

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, "party_insights.xlsx");
    };

    var h = window.innerHeight - 290;

    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-center bg-white py-1 px-0`}>
                <div className="d-flex mx-2 w-50">
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
                    <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={exportToExcel}><i className="fad fa-file-excel"></i></button>
                    <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => CRMReportPDF(e, '#party_insight', { Title, Name, Contact, Address, Limit }, user, { DateFrom, DateTo })}><i className="fad fa-file-pdf"></i></button>
                </div>
            </div>
            <div className='d-flex justify-content-center align-items-center bg-white'>
                <div className="col-md-6 tableFixHead w-100" style={{ height: h + "px" }}>
                    <table id='party_insight' className={`table table-hover table-borderless bg-white fs-5`}>
                        {Data ?
                            <>
                                <tbody>
                                    <tr className="border-bottom text-center">
                                        <td className="p-1" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">Party Insights</p></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Invoice</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalInvoice || 0).toLocaleString("en", { minimumFractionDigits: 0 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Sale</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalSale || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    {/* <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Refund</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalRefund || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr> */}
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Discount</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalDiscount || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Credit Sale</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.CurrentDue || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Bank</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalBank || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Cash</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.TotalCash || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">AVG (Week)</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.AVGWeek || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">AVG (Month)</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Data.AVGMonth || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                </tbody>
                                {PartyData ?
                                    <tbody>
                                        <tr className="border-bottom text-center">
                                            <td className="p-0" colspan="2"><p className="fs-5 fw-bolder text-center py-2 m-0">Overall Total</p></td>
                                        </tr>
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Invoice</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.Invoice || 0).toLocaleString("en", { minimumFractionDigits: 0 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Sale</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.GrandTotal || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Refund</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.ReturnTotal || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Discount</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.Discount || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Paid</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.Paid || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Current Credit</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(PartyData.Due || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Credit Limit</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(Limit || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Last Invoice Date</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{moment(Data.LastInvoiceDate || "N/A").format("DD MMM YY")}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Last Payment Date</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{moment(Data.LastPaymentDate).format("DD MMM YY")}</span></td>
                                        </tr>
                                        <tr className="border-bottom textenter">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Business Since</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{moment(Data.BusinessSince).format("DD MMM YY")}</span></td>
                                        </tr>
                                    </tbody>
                                    :
                                    null}

                            </>
                            : <p className="fs-6 fw-normal text-center py-2 m-0">No data found</p>
                        }
                    </table>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(CRMReports);
