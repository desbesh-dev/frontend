import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { getLabel } from '../../../../../actions/ContractAPI';
import { PaymentTerms } from '../../../../../actions/InventoryAPI';
import logo from '../../../../../assets/logo.png';
import watermark from '../../../../../assets/watermark.png';
import { convertImgToBase64URL } from "../../../../../hocs/Base64Uri";

export const AgedInvoiceListPDF = async (e, item, Data, user, date_from, date_to) => {
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

    const subsTitle = Data.Title;
    const PartyName = Data.Name
    const ContactParty = Data.Contact
    const subscriberAd = Data.Address
    const Limit = Data.Limit
    const PartyLeft = 320;

    const alignCol = (data) => {
        if (data.row.index === body.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [230, 230, 250];
        }
        if (data.row.section === 'body') {
            data.cell.height = 10;
        } else if (data.row.section === 'head') {
            data.cell.height = 20;
        }
        // var col = data.column.index;
        // if (col === 2 && data.cell.raw.includes("\n")) {
        //     data.cell.styles.valign = 'top';
        //     var parts = data.cell.raw.split("\n");
        //     data.cell.text = parts[0];
        //     data.row.height = 20;
        // }
        if (data.row.section === 'body' && data.column.index === 1) {
            const cellValue5 = data.cell.raw;
            const cellValue6 = data.row.raw[2];

            if (cellValue5 === cellValue6) {
                for (let key in data.row.cells) {
                    data.row.cells[key].styles.fillColor = [240, 240, 240];
                    data.row.cells[key].styles.textColor = [0, 0, 0];
                    data.row.cells[key].styles.fontStyle = 'bold';
                }
            }
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

    doc.setFontSize(15).setFont(undefined, 'bold').text(CollocationTitle, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Call: " + Contact + " (Whatsapp/Imo/Wechat)", doc.internal.pageSize.getWidth() / 2, 52, { align: "center" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Office: " + Phone + ", Email: " + Email, doc.internal.pageSize.getWidth() / 2, 64, { align: "center" })
    var splitAddress = doc.splitTextToSize(Location, 360);
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitAddress, doc.internal.pageSize.getWidth() / 2, 74, { align: "center" })

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subsTitle, 20, 40)
    doc.setFontSize(10).setTextColor(54, 69, 79).setFont(undefined, 'normal').text(PartyName, 20, 52)
    doc.setFontSize(10).setTextColor(54, 69, 79).setFont(undefined, 'normal').text(ContactParty, 20, 64)
    var splitAdd = doc.splitTextToSize(subscriberAd, 260);
    doc.setFontSize(9).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitAdd, 20, 74)

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Aged Invoices", 820, 40, { align: "right" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Credit Limit: " + parseFloat(Limit).toLocaleString("en", { minimumFractionDigits: 2 }), 820, 52, { align: "right" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Printed By: " + Name, 820, 64, { align: "right" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Print Time & Date: " + date, 820, 74, { align: "right" })

    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")

    const dateRangeText = d_from !== d_to
        ? `From ${d_from} to ${d_to}         `
        : d_to;

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont(undefined, 'bolditalic').text(dateRangeText, doc.internal.pageSize.getWidth() / 2, 115, { align: "center" });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(0, 100, pageWidth - 0, 100);
    doc.setFillColor(0, 0, 0);

    let totalPaid = 0, totalDue = 0, aged1To30 = 0, aged31To61 = 0, aged62To92 = 0, agedMore = 0;
    item.forEach(({ PaidAmount, Due, GrandTotal, Date }) => {
        const paid = parseFloat(PaidAmount) || 0;
        const due = parseFloat(Due) || 0;
        const grandTotal = parseFloat(GrandTotal) || 0;
        const daysSinceInvoice = moment().diff(moment(Date), 'days');
        totalPaid += paid;
        totalDue += due;
        if (daysSinceInvoice >= 1 && daysSinceInvoice <= 30) aged1To30 += grandTotal;
        else if (daysSinceInvoice >= 31 && daysSinceInvoice <= 61) aged31To61 += grandTotal;
        else if (daysSinceInvoice >= 62 && daysSinceInvoice <= 92) aged62To92 += grandTotal;
        else if (daysSinceInvoice > 92) agedMore += grandTotal;
    });

    const headers = [["S/N", "Date", "Order No", "Invoice No", "Days", "Payment Status", "Payment Term", "Paid", "Due", "1 - 30 days", "31 - 61 days", "62 - 92 days", "More..."]];
    const totalInvoices = item.length;
    const body = item.map((item, i) => {
        const daysSinceInvoice = moment().diff(moment(item.Date), 'days');
        const due = parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 });

        return [
            i + 1,
            moment(item.Date).format("DD MMM YY"),
            item.OrderNo,
            item.InvoiceNo,
            daysSinceInvoice,
            ({ 1: "Partial Paid", 2: "Paid", 3: "Unpaid" }[item.PaymentStatus] || "N/A"),
            getLabel(item.Payment, PaymentTerms),
            parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 }),
            parseFloat(item.Due).toLocaleString("en", { minimumFractionDigits: 2 }),
            (daysSinceInvoice >= 1 && daysSinceInvoice <= 30) ? due : '0',
            (daysSinceInvoice >= 31 && daysSinceInvoice <= 61) ? due : '0',
            (daysSinceInvoice >= 62 && daysSinceInvoice <= 92) ? due : '0',
            (daysSinceInvoice > 92) ? due : '0'
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
        totalPaid.toLocaleString("en", { minimumFractionDigits: 2 }),
        totalDue.toLocaleString("en", { minimumFractionDigits: 2 }),
        aged1To30.toLocaleString("en", { minimumFractionDigits: 2 }),
        aged31To61.toLocaleString("en", { minimumFractionDigits: 2 }),
        aged62To92.toLocaleString("en", { minimumFractionDigits: 2 }),
        agedMore.toLocaleString("en", { minimumFractionDigits: 2 }),
    ]);

    let options = {
        startY: 130,
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
            fillColor: [230, 230, 250],
            textColor: [0, 0, 0],
            fontSize: 10
        },
        columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
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
                doc.setFontSize(12).setFont("helvetica", 'bold').text(name, data.settings.margin.left, 40, { align: "left" });
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(cmpAd, data.settings.margin.left, 50, { align: "left" });
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
    const fileName = `Aged Invoices (${subsTitle}) ${moment(item.Date).format("DD MMM YYYY")}`

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });

    window.open(doc.output('bloburl'), { "filename": fileName });
}

