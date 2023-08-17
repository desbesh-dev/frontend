import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../../.././hocs/Base64Uri";
import { DayConverter } from '../../../../hocs/DayConverter';

export const exportPDF = async (e, Data, status) => {
    var JsBarcode = require('jsbarcode');

    const imgUrl = process.env.REACT_APP_API_URL + Data.CompanyInfo.Logo;
    const imgData = await convertImgToBase64URL(imgUrl)
    const name = Data.CompanyInfo.Name;
    const branch = Data.CompanyInfo.Branch + " Branch";
    var cmpAd = Data.CompanyInfo.Address;

    const userName = Data.BatchDetails.FullName;
    const userID = "User ID: " + Data.BatchDetails.UserID;
    const ContactNo = Data.BatchDetails.ContactNo;
    const subscriberAd = Data.BatchDetails.Address;
    const ReceiptTitle = "PAYMENT RECEIPT";
    const BarcodeText = Data.BatchDetails.BatchID;

    const BatchNo = "Batch No: " + Data.BatchDetails.BatchNo;
    const subsTitle = Data.BatchDetails.Title;
    const subsID = Data.BatchDetails.BusinessType + "/" + Data.BatchDetails.BusinessID + "/" + Data.BatchDetails.BatchNo;
    const IssueDate = "Issue Date: " + moment(Data.BatchDetails.IssueDate).format('DD MMM YYYY');
    const DispatchDate = "Dispatch Date: " + moment(Data.BatchDetails.DispatchDate).format('DD MMM YYYY');
    const Period = "Period: " + DayConverter(DispatchDate, IssueDate) + " Days";
    const Season = "Season: " + Data.BatchDetails.Season;
    const Chick = "Chicks: " + Data.BatchDetails.Chicks;
    const BatchSize = "Batch Size: " + Data.BatchDetails.BatchSize + " Pcs";

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 0 || col === 2 || col === 3 || col === 4 || col === 5 || col === 6) {
            data.cell.styles.halign = 'right';
        } else if (col === 1) {
            data.cell.styles.halign = 'left';
        }
    }

    const colorRow = (data) => {
        let index = null;
        if (data.cell.text[0] === "Payment" || data.cell.text[0] === "Net Payment" || data.cell.text[0] === "Grand Payment") {
            index = data.row.index;
            // data.cell.styles.fontStyle = 'bold';
        }


        if (data.row.index === index) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [216, 78, 75];
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

    doc.setFontSize(15).setFont(undefined, 'bold').text(name, doc.internal.pageSize.getWidth() / 4, 85, { align: "center" })
    doc.setFontSize(11).setTextColor(64, 64, 64).setFont(undefined, 'normal').text(branch, doc.internal.pageSize.getWidth() / 4, 98, { align: "center" })
    var splitTitle = doc.splitTextToSize(cmpAd, 260); //Text wrap after char
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, doc.internal.pageSize.getWidth() / 4, 115, { align: "center" })

    doc.addImage(imgData, 'JPEG', 125, 20, 50, 50);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    JsBarcode(canvas, BarcodeText, {
        font: "monospace",
        format: "code39",
        height: 30,
        displayValue: false,
        fontSize: 18,
        textMargin: 2,
        textPosition: "top",
        marginTop: 15
    }).blank(1).render(); // Will affect all barcodes
    doc.addImage(canvas.toDataURL(), 308, doc.internal.pageSize.getHeight() / 8.9, 110, 40, null, null, 90);

    const PartyLeft = 320;
    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subsTitle, PartyLeft, marginTop)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(userName, PartyLeft, 55)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(subsID, PartyLeft, 65)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(userID, PartyLeft, 75)
    // doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(subscriber, doc.internal.pageSize.getWidth() / 1.5, marginTop, { align: "center" })
    var splitTitle = doc.splitTextToSize(subscriberAd, 260); //Text wrap after char
    doc.setFontSize(9).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitTitle, PartyLeft, 85)
    doc.setFontSize(10).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(ContactNo, PartyLeft, 109)

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(20);
    doc.line(311, 130, 560, 130);
    doc.setFillColor(119, 136, 153);
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReceiptTitle, PartyLeft, 133)

    doc.setFontSize(10).setTextColor(119, 136, 153).setFont(undefined, 'bold').text("B A T C H   F A C T", doc.internal.pageSize.getWidth() / 2, 160, { align: "center" })
    doc.autoTable({
        startY: 165,
        margin: {
            top: 60
        },
        theme: 'grid',
        bodyStyles: { lineColor: [220, 220, 220] },
        body: [
            [IssueDate, DispatchDate, Period],
            [Season, Chick, BatchSize],
        ],
    })

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("BATCH ACCOUNTS", doc.internal.pageSize.getWidth() / 2, 240, { align: "center" })
    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    let gpay = 0
    let pay = 0
    const headers = [["SLNo", "Title", "Quantity", "Weight", "#", "Rate", "Amount"]];
    var AccListData = [
        ...Data.AccountList.map((item, i) => [
            parseInt(item.OpCode) === 18 ? "Payment" : parseInt(item.OpCode) === 19 ? "Net Payment" : parseInt(item.OpCode) === 20 ? "Grand Payment" : i + 1,
            parseInt(item.OpCode) === 18 ? null : parseInt(item.OpCode) === 19 ? null : parseInt(item.OpCode) === 20 ? gpay = item.Amount : item.Title,
            parseFloat(item.Qty).toLocaleString("en-BD", { minimumFractionDigits: 0 }),
            parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
            parseFloat(item.Point).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
            parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
            parseInt(item.OpCode) === 18 || parseInt(item.OpCode) === 19 || parseInt(item.OpCode) === 20 ? parseFloat(item.Amount).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : parseFloat(item.DR) !== 0 ? (item.DR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : parseFloat(item.CR) !== 0 ? "—" + (item.CR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00 ",
        ]),
        // [{
        //     // content: `Total Quantity: ${QuantityTotal}              Total: ${getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}`, colSpan: 8,
        //     styles: {
        //         // fillColor: [239, 154, 154],
        //         halign: 'center',
        //         fontStyle: 'bold',
        //         // lineColor: [120, 135, 153],
        //         // lineWidth: 0.5,
        //         textColor: [0, 0, 0]
        //     }
        // }]
        // [{ content: data, colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],


    ]

    let options = {
        // html: table,
        startY: 245,
        head: headers,
        body: AccListData,
        theme: 'grid',
        bodyStyles: {
            lineColor: [220, 220, 220]
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [119, 136, 153]
        },

        didParseCell: function (data) {
            if (data.cell.raw === "Payment" || data.cell.raw === "Net Payment" || data.cell.raw === "Grand Payment") {
                data.row.cells[0].colSpan = 6;
                data.row.cells[0].styles.halign = 'right';
                data.row.cells[0].styles.fontStyle = 'bold';
                data.row.cells[6].styles.fontStyle = 'bold';
                data.row.cells[0].styles.fillColor = [240, 240, 240];
                data.row.cells[6].styles.fillColor = [240, 240, 240];

            }
            alignCol(data);
        },


        didDrawPage: function (data) {

            data.settings.margin.top = 60;

            const pageCount = doc.internal.getNumberOfPages();

            if (pageCount !== 1) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont(undefined, 'bold').text(name, data.settings.margin.left, 40, { align: "left" })
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont(undefined, 'normal').text(cmpAd, data.settings.margin.left, 50, { align: "left" })
            }

            // Footer
            doc.setFontSize(10);
            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();

            // For each page, print the page number and the total pages
            for (var i = 1; i <= pageCount; i++) {

                // Footer line
                doc.setDrawColor(211, 211, 211);
                doc.setLineWidth(0.5);
                doc.line(40, pageHeight - 35, pageWidth - 40, pageHeight - 35);
                doc.setFillColor(128, 128, 128);

                doc.setPage(i);
                var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

                doc.setFontSize(10).setTextColor(128, 128, 128).setFont(undefined, 'normal').text('Generated from www.softapoul.com', data.settings.margin.left, pageHeight - 20);
                doc.setFontSize(10).setTextColor(128, 128, 128).setFont(undefined, 'normal').text(date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
                doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
            }
        }
    };

    const LeftPayment = Data.PaymentList.reduce((TotalQuantity, myvalue) => TotalQuantity + parseFloat(myvalue.Amount, 10), 0);


    const fileName = Data.BatchDetails.UserID + ". " + subsTitle + " BisID-" + Data.BatchDetails.BusinessID + " Batch No-" + Data.BatchDetails.BatchNo + " Receipt.pdf"
    doc.autoTable(options);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("PAYMENTS", doc.internal.pageSize.getWidth() / 2, doc.autoTable.previous.finalY + 35, { align: "center" })
    const PaymentHeader = [["SLNo", "Date", "Recipient", "Details", "Payment Type", "Amount"]];
    var PayList = [
        ...Data.PaymentList.map((item, i) => [
            i + 1,
            moment(item.Date).format("DD MMM YYYY"),
            item.Recipient,
            item.Type === "Cash" ? item.AccountTitle : "Batch Payment (" + item.BankName + ", " + item.Branch + " Branch)",
            item.Type,
            (item.Amount).toLocaleString("en", { minimumFractionDigits: 2 })
        ]),
        [{
            content: (gpay - LeftPayment) === 0 ? "PAID" : `Remaining Balance  BDT- ${(gpay - LeftPayment).toLocaleString("en", { minimumFractionDigits: 2 })}`,
            colSpan: 7,
            styles: {
                // fillColor: [239, 154, 154],
                halign: "center",
                fontStyle: "normal",
                // lineColor: [120, 135, 153],
                // lineWidth: 0.5,
                fontSize: "10",
                textColor: [0, 0, 0],
            }
        }]
    ]
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 40,
        head: PaymentHeader,
        body: PayList,
        theme: 'grid',
        bodyStyles: {
            lineColor: [220, 220, 220],
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [119, 136, 153]
        },
        margin: {
            top: 60
        },
        styles: {
            overflow: 'linebreak',
            columnWidth: 'wrap',
            // font: 'arial',
            // fontSize: 10,
            // cellPadding: 8,
            overflowColumns: 'linebreak'
        },
        columnStyles: {
            0: {
                cellWidth: 40,
                valign: 'middle',
                halign: 'center',
            },
            1: {
                cellWidth: 70,
                valign: 'middle',
                halign: 'center',
            },
            2: {
                cellWidth: 80,
                valign: 'middle',
                halign: 'center',
            },
            3: { cellWidth: 180 },
            4: {
                cellWidth: 80,
                valign: 'middle',
                halign: 'center',
            },
            5: {
                valign: 'middle',
                halign: 'right',
            },
            // etc
        }
    })

    // Prepare by
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.setLineDash([1, 1], 0);
    doc.line(40, pageHeight - 70, doc.internal.pageSize.getWidth() / 4, pageHeight - 70);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Prepared By", doc.internal.pageSize.getWidth() / 9, pageHeight - 60, { align: "left" })
    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    // Checked by
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.setLineDash([1, 1], 0);
    doc.line(165, pageHeight - 70, 260, pageHeight - 70);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Checked By", 215, pageHeight - 60, { align: "center" })
    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    // Authority
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.setLineDash([1, 1], 0);
    doc.line(280, pageHeight - 70, 395, pageHeight - 70);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Authority", 340, pageHeight - 60, { align: "center" })
    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    // doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(userName, 340, pageHeight - 80, { align: "center" })
    // doc.setDrawColor(119, 136, 153);
    // doc.setLineWidth(0.5);
    // doc.line(marginLeft, 140, 310, 140);
    // doc.setFillColor(119, 136, 153);

    // Farmer
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.setLineDash([1, 1], 0);
    doc.line(550, pageHeight - 70, doc.internal.pageSize.getWidth() - 165, pageHeight - 70);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Recipient", doc.internal.pageSize.getWidth() - 100, pageHeight - 60, { align: "center" })
    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    // doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(userName, doc.internal.pageSize.getWidth() - 100, pageHeight - 50, { align: "center" })
    // doc.setDrawColor(119, 136, 153);
    // doc.setLineWidth(0.5);
    // doc.line(marginLeft, 140, 310, 140);
    // doc.setFillColor(119, 136, 153);

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).FullName,
        keywords: 'generated by SoftaPoul v6.00 web-version beta',
        creator: "SoftaPoul"
    });

    if (status === 1) {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }
}