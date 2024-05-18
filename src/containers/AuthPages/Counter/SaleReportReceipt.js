import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

export const SaleReportReceipt = async (e, item, user, extra) => {
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode },
        Name,
        Role: { Title: RoleTitle, No, Scale }
    } = user;

    let ReportTitle;
    if (moment(extra.FromDate).isSame(extra.ToDate, 'day')) {
        ReportTitle = "SALE SUMMERY- " + moment(extra.FromDate).format("DD MMM YYYY");
    } else {
        const days = moment.duration(moment(extra.ToDate).diff(moment(extra.FromDate))).asDays();
        ReportTitle = parseInt(days) + 1 + " DAYS SALE SUMMERY- " + moment(extra.FromDate).format("DD MMM YYYY") + " to " + moment(extra.ToDate).format("DD MMM YYYY");
    }
    const sector = Sector + " (" + ShortCode + ")";

    const Counter = parseInt(extra.Counter).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 0 });
    const Count = parseInt(extra.Count).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 0 });
    const COGS = parseFloat(extra.Cost).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const GrandTotal = parseFloat(extra.GrandTotal).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Vat = parseFloat(extra.Vat).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Discount = parseFloat(extra.Discount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Shipping = parseFloat(extra.Shipping).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Payment = parseFloat(extra.Payment || 0.00).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const PaidAmount = parseFloat(extra.PaidAmount + extra.Payment).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Due = parseFloat(extra.Due).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const RefundAmount = parseFloat(extra.RefundAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Revenue = (parseFloat(extra.Revenue) - (parseFloat(extra.Discount) + parseFloat(extra.RefundAmount))).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Bank = parseFloat(extra.Bank).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Cash = parseFloat(extra.Cash).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });

    const pageWidth = 78;
    const pageHeight = 120;
    const unit = "mm";
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 4;
    const doc = new jsPDF({ orientation, unit, format: [78, pageHeight] });

    let canvas = document.createElement('CANVAS')

    doc.setFontSize(10).setFont('helvetica', 'bold').text(CollocationTitle.toUpperCase(), pageWidth / 2, 6, { align: "center" })
    doc.setFontSize(11).setFont(undefined, 'normal').text(sector, pageWidth / 2, 10, { align: "center" })

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("———( SALE SUMMERY )———", pageWidth / 2, 15, { align: "center" })
    doc.setFontSize(8).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReportTitle, pageWidth / 2, 20, { align: "center" })

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(0, 21, pageWidth, 21);
    doc.setFillColor(0, 0, 0);

    const ReportDescription = "* The counters range in " + extra.SearchKey.min + " to " + extra.SearchKey.max + " & report in " + extra.ModeFilter.label + " mode."
    var splitTitle = doc.splitTextToSize(ReportDescription, 70); //Text wrap after char
    doc.setFontSize(8).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(splitTitle, marginLeft, 25);


    var body = [
        ["TOTAL COUNTER", " :", Counter],
        ["TOTAL INVOICE", " :", Count],
        ["TOTAL SALE", " :", GrandTotal],
        ["SALE REFUND", " :", RefundAmount],

        ["DUE", " :", Due],
        ["DISCOUNT", " :", Discount],

        ["CASH", " :", Cash],
        ["E-POS", " :", Bank],
        ["PAYMENT", " :", Payment || 0.00],
        ["LIQUID", " :", PaidAmount],
    ];

    doc.autoTable({
        body: body,
        startY: 32,
        theme: "grid",
        margin: { left: 3.5 },
        tableWidth: 70,
        columnStyles: {
            0: {
                cellWidth: 34,
                valign: 'middle',
                halign: 'left',
            },
            1: {
                cellWidth: 6,
                valign: 'middle',
                halign: 'center',
            },
            2: {
                cellWidth: 30,
                valign: 'middle',
                halign: 'right',
            },
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [128, 128, 128]
        },
        styles: {
            fontSize: 10,
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [128, 128, 128],
            cellPadding: 1,  // Set cellPadding to 0 to remove padding
            rowHeight: 5    // Set the rowHeight as desired to control the margin
        },
        minCellHeight: 25,
    });
    const LastY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("LIQUID " + PaidAmount, 35, LastY)

    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
    doc.setFontSize(8).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('DESH BESH ERP', 4, pageHeight - 4);
    doc.setFontSize(8).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Print: " + date.toString(), 52, pageHeight - 4, { align: "center" })

    doc.setProperties({
        title: ReportTitle,
        subject: 'Sale Report',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "Deshbesh ERP"
    });

    window.open(doc.output('bloburl'), { "filename": ReportTitle });

    var oHiddFrame = document.createElement("iframe");
    oHiddFrame.style.position = "fixed";
    oHiddFrame.style.visibility = "hidden";
    oHiddFrame.src = doc.output('bloburl');
    document.body.appendChild(oHiddFrame);
}