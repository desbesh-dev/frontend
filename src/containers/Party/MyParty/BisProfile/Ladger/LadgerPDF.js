import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { convertImgToBase64URL } from "../../../../.././hocs/Base64Uri";
import logo from '../../../../../assets/logo.png';
import watermark from '../../../../../assets/watermark.png';

export const PartyLadgerPDF = async (e, table, Data, user, Tarikh) => {
    var JsBarcode = require('jsbarcode');
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode },
        Name,
        Role: { Title: RoleTitle, No, Scale }
    } = user;


    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const Shop = Sector + " (" + ShortCode + ")";

    let ReportTitle;
    if (moment(Tarikh.DateFrom).isSame(Tarikh.DateTo, 'day')) {
        ReportTitle = "LEDGER (" + moment(Tarikh.DateFrom).format("DD MMM YYYY") + ") ";
    } else {
        ReportTitle = " LEDGER (" + moment(Tarikh.DateFrom).format("DD MMM YYYY") + " to " + moment(Tarikh.DateTo).format("DD MMM YYYY") + ") ";
    }


    const subsTitle = Data.Title;
    const subscriberAd = Data.Address

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 2 || col === 3 || col === 4) {
            data.cell.styles.halign = 'right';
        }
    }

    // const getTotal = () => {
    //     let TotalPrice = 0.00;
    //     const price = item.OrderMapData.map(row => row.OrderQty * row.UnitPrice);
    //     if (price.length > 0) {
    //         TotalPrice = price.reduce((acc, val) => acc + val);
    //     }
    //     return TotalPrice;
    // }
    // const QuantityTotal = item.OrderMapData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.OrderQty, 10), 0);

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const marginTop = 40;
    const doc = new jsPDF(orientation, unit, size);

    let canvas = document.createElement('CANVAS')

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    const marginX = (pageWidth - canvasWidth) / 1;
    const marginY = (pageHeight - canvasHeight) / 2;

    doc.setFontSize(15).setFont(undefined, 'bold').text(CollocationTitle, doc.internal.pageSize.getWidth() / 4, 90, { align: "center" })
    var splitTitle = doc.splitTextToSize(Location, 260); //Text wrap after char
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, doc.internal.pageSize.getWidth() / 4, 105, { align: "center" })

    doc.addImage(imgData, 'JPEG', 110, 30, 60, 40);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    const PartyLeft = 320;
    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subsTitle, PartyLeft, marginTop)
    // doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subscriber, doc.internal.pageSize.getWidth() / 1.5, marginTop, { align: "center" })
    var splitTitle = doc.splitTextToSize(subscriberAd, 260); //Text wrap after char
    doc.setFontSize(9).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitTitle, PartyLeft, 60)

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReportTitle, PartyLeft, 134)


    doc.setFontSize(12).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("TRANSACTION DETAILS", doc.internal.pageSize.getWidth() / 2, 170, { align: "center" })

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    let options = {
        theme: "grid",
        html: table,
        startY: 175,
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [119, 136, 153]
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

    let pageCount = doc.internal.getNumberOfPages()
    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', 80, 320);

        // if (i === pageCount) {
        //     // Prepare by
        //     doc.setDrawColor(97, 97, 97);
        //     doc.setLineWidth(0.5);
        //     doc.setLineDash([1, 1], 0);
        //     doc.line(40, pageHeight - 70, doc.internal.pageSize.getWidth() / 4, pageHeight - 70);
        //     doc.setFillColor(97, 97, 97);
        //     doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Prepared By", doc.internal.pageSize.getWidth() / 9, pageHeight - 60, { align: "left" })

        //     // Checked by
        //     doc.setDrawColor(97, 97, 97);
        //     doc.setLineWidth(0.5);
        //     doc.setLineDash([1, 1], 0);
        //     doc.line(165, pageHeight - 70, 260, pageHeight - 70);
        //     doc.setFillColor(97, 97, 97);
        //     doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Checked By", 215, pageHeight - 60, { align: "center" })


        //     // Authority
        //     doc.setDrawColor(97, 97, 97);
        //     doc.setLineWidth(0.5);
        //     doc.setLineDash([1, 1], 0);
        //     doc.line(280, pageHeight - 70, 395, pageHeight - 70);
        //     doc.setFillColor(97, 97, 97);
        //     doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Authority", 340, pageHeight - 60, { align: "center" })


        //     // Recepient
        //     doc.setDrawColor(97, 97, 97);
        //     doc.setLineWidth(0.5);
        //     doc.setLineDash([1, 1], 0);
        //     doc.line(550, pageHeight - 70, doc.internal.pageSize.getWidth() - 165, pageHeight - 70);
        //     doc.setFillColor(97, 97, 97);
        //     doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Recipient", doc.internal.pageSize.getWidth() - 100, pageHeight - 60, { align: "center" })

        // }

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);
        var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

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