import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLabel } from '../../../actions/ContractAPI';
import { PaymentTerms } from '../../../actions/InventoryAPI';

const InvoiceTable = ({ Data, PrintPDF, sendTableIdToParent }) => {
    const tableId = "AgeTable"; // Set the actual table ID

    useEffect(() => {
        // Send the tableId to the parent as soon as the component mounts
        sendTableIdToParent(tableId);
    }, [sendTableIdToParent, tableId]);

    const totals = useMemo(() => {
        let totalPaid = 0, totalDue = 0, aged1To30 = 0, aged31To61 = 0, aged62To92 = 0, agedMore = 0;

        Data.forEach(({ PaidAmount, Due, InvDate }) => {
            const paid = parseFloat(PaidAmount) || 0;
            const due = parseFloat(Due) || 0;
            const daysSinceInvoice = moment().diff(moment(InvDate), 'days');

            totalPaid += paid;
            totalDue += due;

            if (daysSinceInvoice >= 1 && daysSinceInvoice <= 30) aged1To30 += due;
            else if (daysSinceInvoice >= 31 && daysSinceInvoice <= 61) aged31To61 += due;
            else if (daysSinceInvoice >= 62 && daysSinceInvoice <= 92) aged62To92 += due;
            else if (daysSinceInvoice > 92) agedMore += due
        });

        return { totalPaid, totalDue, aged1To30, aged31To61, aged62To92, agedMore };
    }, [Data]);

    const handlePrintPDF = useCallback((e, id) => PrintPDF(e, id), [PrintPDF]);

    return (
        <table id={tableId} className="table table-hover table-borderless bg-white">
            <thead className='bg-white'>
                <tr className="text-center">
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>S/N</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Title</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Date</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Received</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Invoice No</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Days</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Payment Status</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Payment Term</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Paid</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Due</th>
                    <th className="py-1 border-right" colSpan="4" style={{ verticalAlign: 'middle' }}>Aged</th>
                    <th className="py-1 border-right" rowSpan="2" style={{ verticalAlign: 'middle' }}>Action</th>
                </tr>
                <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                    <th className="py-1 border-right">0 - 30 days</th>
                    <th className="py-1 border-right">31 - 60 days</th>
                    <th className="py-1 border-right">61 - 90 days</th>
                    <th className="py-1 border-right">90 + days</th>
                </tr>
            </thead>
            <tbody>
                {Data.map((item, i) => {
                    const { SupplierTitle, PaymentStatus, PaidAmount, Due, InvDate, RcvDate, InvoiceNo, Payment, SupplierID, id } = item;
                    const daysSinceInvoice = moment().diff(moment(InvDate), 'days');
                    const grandTotal = parseFloat(Due).toLocaleString("en", { minimumFractionDigits: 2 });

                    return (
                        <tr className="border-bottom text-center fw-bold" key={id}>
                            <td className="py-0 border-right"><span className="d-block fw-bold">{i + 1}</span></td>
                            <td className="border-right py-1 px-2 text-left"><Link className="fs-6 fw-bolder text-left text-dark text-decoration-none" to={`/my_supplier/${SupplierID}`}>{SupplierTitle}</Link></td>
                            <td className="py-0 px-1 border-right text-nowrap">{moment(InvDate).format("DD MMM YY")}</td>
                            <td className="py-0 px-1 border-right">{moment(RcvDate).format("DD MMM YY")}</td>
                            <td className="py-0 px-1 border-right">{InvoiceNo === "" ? "Docket" : InvoiceNo}</td>
                            <td className="py-0 px-1 border-right">{daysSinceInvoice}</td>
                            <td className="py-0 px-1 border-right">{({ 1: "Partial Paid", 2: "Paid", 3: "Unpaid" }[PaymentStatus] || "N/A")}
                            </td>
                            <td className="py-0 border-right"><small className="d-block fw-bold">{getLabel(Payment, PaymentTerms)}</small></td>
                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                            <td className="py-0 border-right"><span className="d-block fw-bold text-right">{parseFloat(Due).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>

                            {/* Aged Columns */}
                            {[30, 61, 92, Number.MAX_SAFE_INTEGER].map((range, idx) => (
                                <td key={idx} className="py-0 border-right">
                                    {daysSinceInvoice >= (idx === 0 ? 1 : [1, 31, 62, 93][idx]) && daysSinceInvoice <= range
                                        ? <span className="d-block fw-bold text-right">{grandTotal}</span>
                                        : <span className="d-block fw-bold text-right">—</span>}
                                </td>
                            ))}

                            {/* Action Buttons */}
                            <td className="p-0 text-nowrap text-center">
                                <Link className="btn fs-3 px-2 py-0 text-danger" to={`/purs_invoice_preview/${item.id}`}>
                                    <i className="fad fa-eye"></i>
                                </Link>
                                <button className="btn fs-3 px-2 py-0 text-danger" onClick={(e) => handlePrintPDF(e, id)}>
                                    <i className="fad fa-print"></i>
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                <tr className="text-center fw-bold bg-light">
                    <td colSpan="8" className="py-1 border-right fw-bolder">Total</td>
                    {['totalPaid', 'totalDue', 'aged1To30', 'aged31To61', 'aged62To92', 'agedMore'].map((key, index) => (
                        <td key={index} className="py-1 border-right text-right fw-bolder">{totals[key].toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                    ))}
                    <td></td>
                </tr>
            </tfoot>
        </table>
    );
};

export default InvoiceTable;
