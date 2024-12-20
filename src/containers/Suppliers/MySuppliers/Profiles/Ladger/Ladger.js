import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FetchSupplierLadger } from '../../../../../actions/APIHandler';
import { logout } from '../../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import { customHeader, locales } from "../../../../Suppliers/Class/datepicker";
import { SupplierLadgerPDF } from './LadgerPDF';
let today = new Date();

const Ladger = ({ user, SupplierID, list, setList, Title, Address }) => {
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
    }, [])

    const BisLadger = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        let date_from = moment(oneWeekAgo).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        var result = await FetchSupplierLadger(SupplierID, date_from, date_to);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        setDateFrom(oneWeekAgo);
    }

    const PrvDate = (i) => Array.isArray(Data) && Data.length ? typeof (Data[i - 1]) !== 'undefined' && Data[i - 1] != null ? Data[i - 1].Date : 0 : 0

    const DateHandler = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime()) {
            setDateTo(e);
        } else {
            date_from = moment(e).format("YYYY-MM-DD");
            setDateFrom(e);
            setDateTo(e);
        }
        var result = await FetchSupplierLadger(SupplierID, date_from, date_to);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const groupedTotals = {
        Bank: { totalDebit: 0, totalCredit: 0 },
        Cash: { totalDebit: 0, totalCredit: 0 },
        'Credit Note': { totalDebit: 0, totalCredit: 0 }
    };

    let overallTotalDebit = 0;
    let overallTotalCredit = 0;

    if (Array.isArray(Data) && Data.length > 0) {
        Data.forEach(item => {
            const detail = item.Details;  // Assuming 'Details' is the field name
            const debit = parseFloat(item.Debit || 0); // Get debit value
            const credit = parseFloat(item.Credit || 0); // Get credit value

            // Add to group totals if it matches Bank, Cash, or Credit Note
            if (groupedTotals[detail]) {
                groupedTotals[detail].totalDebit += debit; // Update totalDebit for the group
                groupedTotals[detail].totalCredit += credit; // Update totalCredit for the group
            }

            // Add to overall totals
            overallTotalDebit += debit; // Update overall total debit
            overallTotalCredit += credit; // Update overall total credit
        });
    }

    const summary = {
        totalCash: groupedTotals.Cash.totalCredit,
        totalBank: groupedTotals.Bank.totalCredit,
        totalCreditNote: groupedTotals['Credit Note'].totalCredit,
        totalDebit: overallTotalDebit,
        totalCredit: overallTotalCredit,
        balance: overallTotalCredit - overallTotalDebit
    };


    var h = window.innerHeight - 290;
    return (
        <div className="row justify-content-center align-items-center bg-white m-0 p-0" style={{ zIndex: 999 }}>

            <div className="col-md-12 justify-content-center align-items-center h-100">
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
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => SupplierLadgerPDF(e, '#table', { Title, Address }, user, { DateFrom, DateTo })}><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>

                <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                    <table id='table' className={`table table-hover table-borderless bg-white`}>
                        <thead>
                            <tr className="text-center border-top">
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Date</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Details</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data) && Data.length ? (
                                    <>
                                        {Data.map((item, i, Data) => (
                                            <tr className="border-bottom border-top" >
                                                <td className="border-right text-center py-0 pl-4"><span className="fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span></td>
                                                <td className="border-right py-0 pl-4"><span className="fs-6 fw-bold text-center text-dark">{item.Details}</span></td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Credit) === 0 ? "—" : (item.Credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Debit) === 0 ? "—" : (item.Debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                <td className="border-0 py-0 px-2">
                                                    {/* {parseFloat(item.Balance) < 0 ? ( */}
                                                    <span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                                                    {/* ) : (
                                                    <span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                                                )} */}
                                                </td>
                                            </tr>
                                        ))}
                                        {(() => {
                                            const totalDebit = Data.reduce((acc, item) => acc + parseFloat(item.Debit || 0), 0);
                                            const totalCredit = Data.reduce((acc, item) => acc + parseFloat(item.Credit || 0), 0);
                                            const lastBalance = Data[Data.length - 1].Balance;

                                            return (
                                                <tr className="border-top bg-light fw-bolder">
                                                    <td className="border-right text-center py-0 pl-4" colSpan="2">
                                                        <span className="fs-6 fw-bolder text-center text-dark">Closing Balance</span>
                                                    </td>
                                                    <td className="border-right py-0 px-2">
                                                        <span className="d-block fs-6 fw-bolder text-right text-dark">
                                                            {totalCredit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="border-right py-0 px-2">
                                                        <span className="d-block fs-6 fw-bolder text-right text-dark">
                                                            {totalDebit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="border-0 py-0 px-2">
                                                        <span className="d-block fs-6 fw-bolder text-right text-dark">
                                                            {lastBalance < 0
                                                                ? `(${parseFloat(-lastBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })})`
                                                                : parseFloat(lastBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })()}
                                    </>)
                                    : null
                            }
                        </tbody>

                    </table>
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