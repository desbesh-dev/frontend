import moment from "moment";
import React from "react";
import * as XLSX from "xlsx";

const PurchaseReportXLSX = ({ Data, no, getLabel, PaymentTerms }) => {
    const handleExport = () => {
        // Mapping the Data.results to an array of objects
        const exportData = Data.results.map(item => ({
            "Rec. Date": moment(item.RcvDate).format('DD MMM YYYY'),
            "Supplier": item.SupplierTitle,
            "Purchase No": item.PurchaseNo,
            "Invoice No": item.InvoiceNo,
            "Qty": parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 }),
            "Weight": parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 }),
            "Amount": parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 }),
            "Paid": parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 }),
            "Due": parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 }),
            "Credit": parseFloat(item.RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 }),
            "Payment": getLabel(parseInt(item.Payment), PaymentTerms),
            "Receiver": item.Receiver,
            "Sector": no <= 7 ? item.SectorNo + ". " + item.SectorTitle : "", // Only show if no <= 7
        }));

        // Create a worksheet from the exportData
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Purchases");

        // Write the workbook to a file
        XLSX.writeFile(wb, "purchases_data.xlsx");
    };

    return (
        <div>
            <button onClick={handleExport} className="btn btn-primary mb-3">Export to Excel</button>
            <table id="exportTable" className={`table table-hover table-borderless table-responsive card-1 d-table mt-1`}>
                <thead>
                    <tr className="text-center">
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Rec. Date</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Supplier</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Purchase No</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Invoice No</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Qty</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Weight</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Amount</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Paid</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Due</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Credit</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Payment</span></th>
                        <th className="border-right p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Reciever</span></th>
                        {no <= 7 && <th className="p-1"> <span className="fs-6 fw-bolder text-dark text-uppercase p-0">Sector</span></th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        Data.results.map((item, i) => (
                            <tr className="border-bottom text-center" key={i}>
                                <td className="border-right p-1" style={{ whiteSpace: 'nowrap' }}><span className="d-block fs-6 fw-bold text-center text-dark p-0">{moment(item.RcvDate).format('DD MMM YYYY')}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark text-nowrap p-0">{item.SupplierTitle}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.PurchaseNo}</span> </td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-left text-dark p-0">{item.InvoiceNo}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Qty).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-right text-dark p-0">{parseFloat(item.RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark text-nowrap p-0">{getLabel(parseInt(item.Payment), PaymentTerms)}</span></td>
                                <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark text-nowrap p-0">{item.Receiver}</span></td>
                                {no <= 7 && <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark text-nowrap p-0">{item.SectorNo + ". " + item.SectorTitle}</span></td>}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseReportXLSX;
