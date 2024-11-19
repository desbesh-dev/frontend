import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../../../assets/logo.png';
import watermark from '../../../../../assets/watermark.png';
import { convertImgToBase64URL } from "../../../../../hocs/Base64Uri";

export const CRMReportPDF = async (e, table, Data, user, Tarikh, summary) => {
    var JsBarcode = require('jsbarcode');
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode, Phone, Contact, Email },
        Role: { Title: RoleTitle, No, Scale },
        Name
    } = user;

    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    let ReportTitle;
    if (moment(Tarikh.DateFrom).isSame(Tarikh.DateTo, 'day')) {
        ReportTitle = "Party Insights (" + moment(Tarikh.DateFrom).format("DD MMM YYYY") + ") ";
    } else {
        ReportTitle = "Party Insights (" + moment(Tarikh.DateFrom).format("DD MMM YYYY") + " to " + moment(Tarikh.DateTo).format("DD MMM YYYY") + ") ";
    }

    const subsTitle = Data.Title;
    const PartyName = Data.Name
    const ContactParty = Data.Contact
    const subscriberAd = Data.Address
    const Limit = Data.Limit

    const alignCol = (data) => {
        var col = data.column.index;
        if (data.row.index === 0 || data.row.index === 9) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [211, 211, 211];
            data.cell.styles.textColor = [0, 0, 0]
        }
        if (col === 0) {
            data.cell.styles.halign = 'left';
        }
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const marginTop = 40;
    const doc = new jsPDF(orientation, unit, size);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();


    doc.setFontSize(15).setFont(undefined, 'bold').text(CollocationTitle, doc.internal.pageSize.getWidth() / 4, 85, { align: "center" })
    var splitAddress = doc.splitTextToSize(Location, 360); //Text wrap after char
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitAddress, doc.internal.pageSize.getWidth() / 4, 100, { align: "center" })
    doc.addImage(imgData, 'JPEG', 110, 30, 60, 40);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    const PartyLeft = 320;
    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subsTitle, PartyLeft, marginTop)
    // doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subscriber, doc.internal.pageSize.getWidth() / 1.5, marginTop, { align: "center" })
    doc.setFontSize(10).setTextColor(54, 69, 79).setFont(undefined, 'normal').text(PartyName, PartyLeft, 52)
    doc.setFontSize(10).setTextColor(54, 69, 79).setFont(undefined, 'normal').text(ContactParty, PartyLeft, 64)

    var splitAdd = doc.splitTextToSize(subscriberAd, 260); //Text wrap after char
    doc.setFontSize(9).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitAdd, PartyLeft, 74)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Credit Limit: " + parseFloat(Limit).toLocaleString("en", { minimumFractionDigits: 2 }), PartyLeft, 100)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Printed By: " + Name, PartyLeft, 110)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("Print Time & Date: " + date, PartyLeft, 120)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReportTitle, PartyLeft, 134)

    let options = {
        theme: "grid",
        html: table,
        startY: 160,
        headStyles: {
            valign: 'middle',
            halign: 'center',
            lineColor: [128, 128, 128]
        },
        bodyStyles: {
            lineColor: [128, 128, 128],
            textColor: [0, 0, 0],
        },
        didParseCell: function (cell, data) {
            alignCol(cell, data);
        },

        didDrawPage: function (data) {
            data.settings.margin.top = 60;
            const pageCount = doc.internal.getNumberOfPages();

            if (pageCount !== 1) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont(undefined, 'bold').text(CollocationTitle, data.settings.margin.left, 40, { align: "left" })
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont(undefined, 'normal').text(Location, data.settings.margin.left, 50, { align: "left" })
            }

            // Footer
            doc.setFontSize(10);
            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
        }
    };
    doc.autoTable(options);
    let LastY = doc.lastAutoTable.finalY + 15;

    let pageCount = doc.internal.getNumberOfPages()
    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', 80, 320);

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);

        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text(date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
    }

    const fileName = ReportTitle + ".pdf"

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).FullName,
        keywords: 'generated by SoftaPoul v6.00 web-version beta',
        creator: "SoftaPoul"
    });

    if (e.target.id === "print") {
        doc.save("fileName");
    }
    else {
        window.open(doc.output('bloburl'), { "filename": "fileName" });
    }
}