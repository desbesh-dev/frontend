import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../.././hocs/Base64Uri";
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { inWords } from '../../../hocs/NumberToWord';
// import { numberToWords } from '../../hocs/Class/InWord';

export const NotePrint = async (e, item, status) => {
    var JsBarcode = require('jsbarcode');

    const name = item.SisterName;
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const shop = item.SisterName;
    const shop_code = "Shop Code: " + item.ShortCode + " (" + item.SectorName + ")";
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const note_type = {
        1: "CASH REFUND",
        2: "CREDIT NOTE",
        3: "DEBIT NOTE"
    }[item.Note?.NoteType] || "N/A";

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 0 || col === 1) {
            data.cell.styles.halign = 'center';
        } else if (col === 2 && data.cell.raw.includes("\n")) {
            data.cell.styles.valign = 'top';
            var parts = data.cell.raw.split("\n");
            data.cell.text = parts[0];
            data.row.height = 30;
        } else if (col === 3) {
            data.cell.styles.halign = 'center';
            data.cell.styles.valign = 'middle';
        } else if (col === 4 || col === 5) {
            data.cell.styles.halign = 'right';
        }
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    let LastY = null;
    const marginLeft = 20;
    const marginTop = 20;
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

    doc.addImage(imgData, 'JPEG', marginLeft + 10, marginTop, 75.5, 55.75);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 15)

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 28)

    const contact = [
        item.Phone && `Phone: ${item.Phone}`,
        item.Contact && `Contact: ${item.Contact}`,
        item.Fax && `Fax: ${item.Fax}`,
        item.Whatsapp && `Whatsapp: ${item.Whatsapp}`,
        item.Imo && `Imo: ${item.Imo}`,
        item.Wechat && `Wechat: ${item.Wechat}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text(contact, marginLeft + 94, marginTop + 38)

    const online_contact = [
        item.Email && `Email: ${item.Email}`,
        item.Website && `Website: ${item.Website}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text(online_contact, marginLeft + 94, marginTop + 48)

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(2);
    doc.line(marginLeft, 98, 570, 98);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 130;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 65, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('courier', 'bold').text(note_type, doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });

    JsBarcode(canvas, item.Note?.NoteNo, {
        font: "Arial",
        format: "code128",
        height: 15,
        width: 1,
        displayValue: false,
        fontSize: 8,
        textMargin: -1,
        textPosition: "bottom",
        margin: 0
    }).blank(3).render(); // Will affect all barcodes

    var order_bar = canvas.toDataURL('image/jpeg');
    doc.addImage(order_bar, 'JPEG', 45, 156, 70, 20, null, null, 90);


    const tin = "TIN No: " + 500049832
    const gst = "GST: " + 5911
    const od = "Order Date: " + moment(item.OrderDate).format("DD MMM YYYY")
    const dd = "Delivery Date: " + moment(item.DeliveryDate).format("DD MMM YYYY")

    const slsman = "Salesman: " + item.CounterMarry

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Invoice to: ", marginLeft + 35, 115)
    var party_title = item.PartyTitle.length > 35 ? item.PartyTitle.substring(0, 35) + "..." : item.PartyTitle;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", "normal").text(party_title, marginLeft + 35, 127);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text("Contact: " + item.PartyContact, marginLeft + 35, 139)

    var party_address = item.PartyAddress.substring(0, 70) + (item.PartyAddress.length < 70 ? "" : "...");
    party_address = doc.splitTextToSize(party_address, 190);
    var p_ht = doc.getTextDimensions(party_address).h;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(party_address, marginLeft + 35, 150)


    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(tin, 380, 115)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(gst, 380, 127)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(shop_code, 380, 139)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Date: " + moment(item.Note?.Date).format("DD MMM YYYY"), 380, 151)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Invoice No: " + item.InvoiceNo, 380, 163)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Note No: " + item.Note?.NoteNo, 380, 175)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(slsman, 380, item.OrderNo ? 175 : 151)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Payment: " + getPaymentShort(item.Payment, PaymentTerms), 380, 139 + ht + 11)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Details: ", 20, 200)

    var lineHeight = 15; // set the line height to 15 points
    var n = 20; // set the x-coordinate of the text
    var y = 215; // set the y-coordinate of the text
    var maxWidth = pageWidth - 40; // set the maximum width of the text
    var paragraphs = item.Note?.Details.split("\n");
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal');

    for (var i = 0; i < paragraphs.length; i++) {
        var lines = doc.splitTextToSize(paragraphs[i], maxWidth);
        for (var j = 0; j < lines.length; j++) {
            if (y + lineHeight > doc.internal.pageSize.height - 20) {
                // add a new page if there isn't enough space for the current line
                doc.addPage();
                y = 20; // reset the y-coordinate
            }
            doc.text(lines[j], n, y, { align: 'justify' });
            y += lineHeight;
        }
    }
    const TotalQty = item.SellMapReturn.reduce((TotalQt, myvalue) => TotalQt + parseInt(myvalue.Qty, 10), 0);
    const TotalWt = item.SellMapReturn.reduce((TotalWt, myvalue) => TotalWt + parseInt(myvalue.Weight, 10), 0);

    let gpay = 0
    let pay = 0
    const inv_headers = [["S/N", "CODE", "ITEM DETAILS", "UOM", "Qty", "RATE", "SUB-TOTAL"]];

    var INV_ProductItems = [
        ...item.SellMapReturn.map((item, i) => [
            item.SLNo,
            item.Code,
            item.Title + (item.Remark && item.Remark !== 'N/A' && item.Remark !== "" ? "\n" + item.Remark : ''),
            item.UnitName,
            item.Qty,
            parseFloat(item.Rate).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            }),
            parseFloat(item.SubTotal).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            })
        ]),
    ]

    let options = {
        startY: 260,
        head: inv_headers,
        body: INV_ProductItems,
        theme: 'grid',
        margin: { left: marginLeft },
        tableWidth: 555,
        bodyStyles: {
            lineColor: [26, 189, 156],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 11
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            textColor: [0, 0, 0],
            lineColor: [26, 189, 156], // Setting line color to black
        },
        columnStyles: {
            0: {
                cellWidth: 35,
                valign: 'middle',
                halign: 'center',
            },
            1: {
                cellWidth: 40,
                valign: 'middle',
                halign: 'left',
            },
            2: {
                cellWidth: 'auto',
                valign: 'middle',
                halign: 'left',
            },
            3: { cellWidth: 40 },
            4: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'center',
            },
            5: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'right',
            },
            6: {
                cellWidth: 80,
                valign: 'middle',
                halign: 'right',
            },
            7: {
                cellWidth: 80,
                valign: 'middle',
                halign: 'right',
            },
            // etc
        },
        didParseCell: function (data) {
            alignCol(data);
        },
        didDrawCell: function (data) {
            if (data.column.index === 2 && data.cell.raw.includes("\n")) {
                var parts = data.cell.raw.split("\n");
                doc.setFontSize(8).setTextColor(105, 105, 105).setFont("helvetica", 'italic').text(parts[1], data.cell.x + 5, data.cell.y + 25);
            }
        },

        didDrawPage: function (data) {
            data.settings.margin.top = 60;
            const pageCount = doc.internal.getNumberOfPages();
            if (pageCount !== 1) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont("helvetica", 'bold').text(name, data.settings.margin.left, 40, { align: "left" })
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(cmpAd, data.settings.margin.left, 50, { align: "left" })
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
                doc.setLineWidth(5);
                doc.setLineDash([], 0); // set the border with
                doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
                doc.setFillColor(128, 128, 128);

                doc.setPage(i);
                var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

                doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', data.settings.margin.left, pageHeight - 20);
                doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text(date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })

                if (pageCount !== 1)
                    doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
                else
                    doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Customer Copy', 500, pageHeight - 20);

            }
        }
    };

    doc.autoTable(options);
    doc.addImage(watermarkData, 'PNG', 80, 220);
    LastY = doc.lastAutoTable.finalY + 4;

    const alignColCalc = (data) => {
        var col = data.column.index;
        if (col === 0) {
            data.cell.styles.halign = 'right';
        }
        if (col === 1) {
            data.cell.styles.halign = 'center';
        }
        if (col === 2) {
            data.cell.styles.halign = 'right';
        }

        var s = data.cell.styles;
        if (data.row.index === 0 || data.row.index === 3) {
            s.fontStyle = 'bold';
        }
    }

    const getTotal = () => {
        const price = item.SellMapReturn.map(row => parseFloat(row.Qty) * parseFloat(row.Rate)).filter(val => !isNaN(val));
        const totalPrice = price.reduce((acc, val) => acc + val, 0);
        return totalPrice.toFixed(2);
    };

    const Total = item.SellMapReturn.reduce((Total, myvalue) => Total + parseFloat(myvalue.SubTotal, 10), 0);

    var body = [
        ["SUB-TOTAL", " :", Total.toLocaleString("en", { minimumFractionDigits: 2 })],
        ["10% GST INCLUDED", " :", parseFloat(0.00).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET AMOUNT", " :", Total.toLocaleString("en", { minimumFractionDigits: 2 })]
    ];

    doc.autoTable({
        body: body,
        startY: LastY,
        bodyStyles: {
            lineColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 11,
            minCellHeight: 17,
        },
        theme: "plain",
        margin: { left: 340 },
        tableWidth: 235,
        columnStyles: {
            0: { cellWidth: 147 },
            1: { cellWidth: 8 },
            2: { cellWidth: 80 },
        },
        styles: { fontSize: 11, leading: 15, textColor: [0, 0, 0], cellPadding: 1 },
        minCellHeight: 25, // specify the line height here
        didParseCell: function (cell, data) {
            alignColCalc(cell, data);
        },
        willDrawCell: function (data) {
            if (data.row.index === 1 || data.row.index === 3 || data.row.index === 5) {
                doc.setDrawColor(0, 0, 0); // set the border color
                doc.setLineWidth(0.1); // set the border with
                doc.setLineDash([], 0); // set the border with
                // draw bottom border
                doc.line(
                    data.cell.x,
                    data.cell.y,
                    data.cell.x + data.cell.width,
                    data.cell.y
                );
            }
        },
    });

    let summery_table_y = doc.lastAutoTable.finalY + 4;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Total Item: " + (Array.isArray(item.SellMapReturn) ? item.SellMapReturn.length : 0) + ", Total Qty: " + TotalQty, marginLeft, LastY + 15)


    const amountInWords = inWords(parseFloat(getTotal()));
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Amount (In Word): ", marginLeft, LastY + 38)
    var Words = doc.splitTextToSize(amountInWords, 260); //Text wrap after char
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(Words, marginLeft + 100, LastY + 38)


    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(1);
    doc.setLineDash([4, 8], 0);
    doc.line(0, LastY + 200, pageWidth - 0, LastY + 200);
    doc.setFillColor(128, 128, 128);

    //Customer Copy
    LastY = LastY + 242
    doc.addImage(watermarkData, 'PNG', 80, LastY - 20, 400, 250);

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont("courier", 'bold').text(shop, 20, LastY)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(shop_code, 20, LastY + 12)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(tin, 20, LastY + 24)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(gst, 20, LastY + 36)

    var party_name = doc.splitTextToSize("Name: " + item?.PartyTitle, 200); //Text wrap after char
    var ht = doc.getTextDimensions(party_name).h;

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont("courier", 'bold').text(party_name, 350, LastY)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Date: " + moment(item.Note?.Date).format("DD MMM YYYY"), 350, LastY + 12 + ht)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Invoice No: " + item.InvoiceNo, 350, LastY + 24 + ht)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Note No: " + item.Note?.NoteNo, 350, LastY + 36 + ht)
    doc.setFontSize(14).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Amount: " + item.Note?.Amount, 350, LastY + 60 + ht)

    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('courier', 'bold').text(note_type, 20, LastY + 60);
    doc.addImage(order_bar, 'JPEG', 128, LastY + 45, 110, 20, null, null, 180);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("ADVICE: ", 20, LastY + 130)

    var a = LastY + 145; // set the y-coordinate of the text
    var advice = item.Note?.Advice.split("\n");
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal');

    for (var i = 0; i < advice.length; i++) {
        var lines = doc.splitTextToSize(advice[i], maxWidth);
        for (var j = 0; j < lines.length; j++) {
            if (a + lineHeight > doc.internal.pageSize.height - 20) {
                // add a new page if there isn't enough space for the current line
                doc.addPage();
                a = 20; // reset the y-coordinate
            }
            doc.text(lines[j], n, a, { align: 'justify' });
            y += lineHeight;
        }
    }
    const fileName = "Credit Note No-" + item.NoteNo + " " + item.SupplierTitle + " Date-" + moment(item.Date).format("DD MMM YYYY")

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });


    if (status === true) {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }

}

export const CashNotePrint = async (e, item, status, type) => {
    var JsBarcode = require('jsbarcode');
    const name = 'DESH BESH ENTERPRISE LTD';
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const title = "RETURN PRODUCT";
    const InvoiceNo = "INVOICE#" + item.InvoiceNo;
    const NoteNo = "NOTE#" + item.Note.NoteNo;
    const Dates = "Date: " + moment(item.CreatedAt).format("DD MMM YYYY");
    const Time = "Time: " + moment(item.CreatedAt).format("hh:mm:ss A");

    const Shop = "Shop: " + item.ShortCode + " (" + item.SectorName + ")";
    const Counter = "Counter: " + item.CounterNo;
    const agent = "Cashier: " + item.CounterMarry;

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 1) {
            data.cell.styles.halign = 'center';
        }
        if (col === 2 || col === 3 || col === 4) {
            data.cell.styles.halign = 'right';
        }
    }

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = item.SellMapReturn.map(row => parseFloat(row.Qty) * parseFloat(row.Rate));
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = item.SellMapReturn.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Qty, 10), 0);
    let canvas = document.createElement('CANVAS')
    const unit = "mm";
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 4;
    let LastY = null;
    let canvH = item.SellMapReturn.length * 7;
    let pageHeight = null;
    // const doc = new jsPDF({ orientation, unit, format: [80, canvH + 110] });

    const headers = [["ITEMS", "UOM", "QTY", "RATE", "PRICE"]];
    var data = [...item.SellMapReturn.map((pro, i) => [
        pro.Title,
        pro.UnitName,
        pro.Qty,
        parseFloat(pro.Rate).toFixed(2),
        (pro.Qty * pro.Rate).toLocaleString("en", { minimumFractionDigits: 2 }),
        new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
        item.ReceiptNo
    ]),
    ]

    let options = {
        theme: 'grid',
        startY: 40,
        margin: { horizontal: 3 },
        head: headers,
        body: data,
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [128, 128, 128]
        },
        styles: {
            fontSize: 8,
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [128, 128, 128]
        },
        tableWidth: 72,
        didParseCell: function (cell, data) {
            alignCol(cell, data);
        }
    };

    const tempDoc = new jsPDF({ orientation, unit, format: [79, 4000] }); // Set a large height to ensure enough space
    tempDoc.autoTable(options);
    pageHeight = tempDoc.previousAutoTable.finalY + 70; // Adding 10 to provide some bottom margin

    // Create the actual document with the correct pageHeight
    const doc = new jsPDF({ orientation, unit, format: [79, pageHeight] });
    doc.autoTable(options);


    doc.autoTable(options);
    LastY = doc.lastAutoTable.finalY + 2;

    const pageWidth = 80;
    pageHeight = doc.internal.pageSize.getHeight();
    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    doc.setFontSize(13).setFont(undefined, 'bold').text(name, pageWidth / 2, 6, { align: "center" })
    var splitTitle = doc.splitTextToSize(cmpAd, 90); //Text wrap after char
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, pageWidth / 2, 10, { align: "center" })

    doc.setFontSize(10).setFont(undefined, 'bold').text(title, pageWidth / 2, 18, { align: "center" })
    doc.setFontSize(8).setFont(undefined, 'normal').text(InvoiceNo + ", " + NoteNo, 3, 23)

    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(Dates, marginLeft, 28)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Time, 47, 28)

    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Shop, marginLeft, 32)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Counter, 47, 32)

    var CustomerWrap = doc.splitTextToSize(item.PartyID !== null ? "Subs: " + item.CustomerTitle : 'Walk-in Customer', 45); //Text wrap after char
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(CustomerWrap, marginLeft, 36)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(agent, 47, 36)


    const alignColCalc = (data) => {
        var col = data.column.index;
        if (col === 0) {
            data.cell.styles.halign = 'right';
        }
        if (col === 1) {
            data.cell.styles.halign = 'center';
        }
        if (col === 2) {
            data.cell.styles.halign = 'right';
        }

        var s = data.cell.styles;
        if (data.row.index === 0 || data.row.index === 3) {
            s.fontStyle = 'bold';
        }
    }

    var body = [
        ["RETURN AMOUNT", ":", getTotal().toLocaleString("en", { minimumFractionDigits: 2 })]
    ]

    doc.autoTable({
        body: body,
        startY: LastY,
        theme: "plain",
        margin: { left: 15 },
        tableWidth: 76,
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 5 },
            2: { cellWidth: 20 },
        },
        styles: { fontSize: 9, textColor: [0, 0, 0], cellPadding: 0.7, },
        didParseCell: function (cell, data) {
            alignColCalc(cell, data);
        },
        willDrawCell: function (data) {
            // add borders around the head cells
            if (data.row.index === 1 || data.row.index === 3) {
                doc.setDrawColor(0, 0, 0); // set the border color
                doc.setLineWidth(0.1); // set the border with

                // draw bottom border
                doc.line(
                    data.cell.x,
                    data.cell.y,
                    data.cell.x + data.cell.width,
                    data.cell.y
                );
            }
        },
    })

    JsBarcode(canvas, item.InvoiceNo, {
        font: "monospace",
        format: "CODE128",
        height: 30,
        displayValue: false,
        fontSize: 9,
        textMargin: 4,
        textPosition: "bottom",
        marginTop: 0
    }).blank(2).render(); // Will affect all barcodes

    doc.addImage(canvas.toDataURL(), 2, pageHeight - 17, pageWidth - 4, 10, null, null, 0);

    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
    doc.setFontSize(8).setTextColor(128, 128, 128).setFont(undefined, 'normal').text('DESH BESH ERP', 4, pageHeight - 17);
    doc.setFontSize(8).setTextColor(128, 128, 128).setFont(undefined, 'normal').text("Print: " + date.toString(), 55, pageHeight - 17, { align: "center" })

    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(4, pageHeight - 16, pageWidth - 4, pageHeight - 16);
    doc.setFillColor(128, 128, 128);

    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(4, pageHeight - 8, pageWidth - 4, pageHeight - 8);
    doc.setFillColor(128, 128, 128);


    doc.setFontSize(8).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("THANKS FOR CHOOSING US", pageWidth / 2, pageHeight - 4, { align: "center" })

    const fileName = "Recipt No- " + item.InvoiceNo + " (" + new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') + ").pdf"
    // doc.autoTable(options);
    doc.setProperties({
        title: fileName,
        subject: 'Receipt',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "Deshbesh ERP"
    });

    if (status) {
        doc.autoPrint();
    }
    else if (status === "save") {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }

    var oHiddFrame = document.createElement("iframe");
    oHiddFrame.style.position = "fixed";
    oHiddFrame.style.visibility = "hidden";
    oHiddFrame.src = doc.output('bloburl');
    document.body.appendChild(oHiddFrame);
}