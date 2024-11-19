import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { getLabel } from '../../../actions/ContractAPI';
import { PaymentTerms } from '../../../actions/InventoryAPI';
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";

export const PurchaseReportPDF = async (e, item, date_from, date_to, user, SisterFilter, SectorFilter) => {
    e.preventDefault();
    const name = "DESH BESH GROUP OF COMPANY LTD.";
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode, Phone, Contact, Email },
        Role: { Title: RoleTitle, No, Scale },
        Name
    } = user;

    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

    const alignCol = (data) => {
        if (data.row.index === body.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [238, 241, 198];
        }
        if (data.row.section === 'body') {
            data.cell.height = 10;
        } else if (data.row.section === 'head') {
            data.cell.height = 20;
        }
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    let LastY = null;
    const marginLeft = 20;
    const marginTop = 20;
    const doc = new jsPDF(orientation, unit, size);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 200;
    let height = 20;

    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")
    var site = No >= 7
        ? `${CollocationTitle} (${Sector})`
        : `${(SisterFilter || '')} ${(SectorFilter || '')}`.trim() || "All Sisters and sectors";

    const dateRangeText = d_from !== d_to
        ? `From ${d_from} to ${d_to}`
        : `Date ${d_to}`; // If the dates are the same, set to an empty string

    doc.setFontSize(15).setFont(undefined, 'bold').text(CollocationTitle, 20, 40)
    var splitAddress = doc.splitTextToSize(Location, 360);
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitAddress, 20, 52)

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(site, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" })
    doc.setFontSize(10).setTextColor(54, 69, 79).setFont(undefined, 'normal').text(dateRangeText, doc.internal.pageSize.getWidth() / 2, 52, { align: "center" })

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Purchase Reports", 820, 40, { align: "right" })
    // doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Credit Limit: " + parseFloat(Limit).toLocaleString("en", { minimumFractionDigits: 2 }), 820, 52, { align: "right" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Printed By: " + Name, 820, 52, { align: "right" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Print Time & InvDate: " + date, 820, 64, { align: "right" })

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(0, 74, pageWidth - 0, 74);
    doc.setFillColor(0, 0, 0);

    let totalPaid = 0, totalDue = 0, totalAmount = 0, totalDiscount = 0;
    item.forEach(({ PaidAmount, Due, Discount, GrandTotal }) => {
        const paid = parseFloat(PaidAmount) || 0;
        const due = parseFloat(Due) || 0;
        const grandTotal = parseFloat(GrandTotal) || 0;
        const discTotal = parseFloat(Discount) || 0;
        totalPaid += paid;
        totalDue += due;
        totalDiscount += discTotal;
        totalAmount += grandTotal;
    });

    const headers = [["S/N", "TITLE", "INVOICE DATE", "RECEIVED DATE", "INVOICE NO", "DOCKET NO", "TERMS", "AMOUNT", "DISCOUNT", "PAID", "DUE"]];
    const totalInvoices = item.length;
    const body = item.map((item, i) => {
        const daysSinceInvoice = moment().diff(moment(item.InvDate), 'days');
        const due = parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 });

        return [
            i + 1,
            item.SupplierTitle,
            moment(item.InvDate).format("DD MMM YY"),
            moment(item.RcvDate).format("DD MMM YY"),
            item.InvoiceNo,
            item.DocketNo,
            getLabel(item.Payment, PaymentTerms),
            parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 }),
            parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 }),
            parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 }),
            parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 })
        ];
    });

    body.push([
        null,
        "",
        `Total Invoice: ${totalInvoices}`,
        null,
        "",
        "",
        "Total",
        totalAmount.toLocaleString("en", { minimumFractionDigits: 2 }),
        totalDiscount.toLocaleString("en", { minimumFractionDigits: 2 }),
        totalPaid.toLocaleString("en", { minimumFractionDigits: 2 }),
        totalDue.toLocaleString("en", { minimumFractionDigits: 2 }),
    ]);

    let options = {
        startY: 95,
        head: headers,
        body: body,
        tableWidth: 800,
        margin: { left: marginLeft },
        bodyStyles: {
            lineColor: [26, 189, 156],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 8,
            halign: 'right'
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            lineWidth: 1,
            lineColor: [255, 255, 255],
            fillColor: [179, 193, 0],
            textColor: [0, 0, 0],
            fontSize: 9
        },
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'left' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
            6: { halign: 'center' },
        },
        rowStyles: {
            minCellHeight: 10 // Adjust row height
        },
        didParseCell: function (data) {
            alignCol(data); // Custom alignment
        },
        didDrawPage: function (data) {
            data.settings.margin.top = 60;
            const pageCount = doc.internal.getNumberOfPages();
            if (pageCount !== 1) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont("helvetica", 'bold').text(site, data.settings.margin.left, 40, { align: "left" });
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text("Purchase Reports (" + dateRangeText + ")", data.settings.margin.left, 50, { align: "left" });
            }
            // Footer
            doc.setFontSize(10);
        }
    };

    doc.autoTable(options);

    const pageWidthLandscape = doc.internal.pageSize.getWidth();
    const pageHeightLandscape = doc.internal.pageSize.getHeight();

    const centerX = pageWidthLandscape / 2;
    const centerY = pageHeightLandscape / 2;

    const imageWidth = 800;
    const imageHeight = 500;
    const imageX = centerX - (imageWidth / 2);
    const imageY = centerY - (imageHeight / 2);

    doc.addImage(watermarkData, 'PNG', imageX, imageY, imageWidth, imageHeight);

    let pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);
        var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text("Printed by " + Name + " at " + date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 760, pageHeight - 20);
    }
    const fileName = `Purchase Reports ${dateRangeText}`

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });

    window.open(doc.output('bloburl'), { "filename": fileName });
}

