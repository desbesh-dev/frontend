import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";
import { inWords } from '../../../hocs/NumberToWord';
// import { numberToWords } from '../../hocs/Class/InWord';

export const QuotePrint = async (e, item, status) => {
    var JsBarcode = require('jsbarcode');
    const name = 'DESH BESH ENTERPRISE LTD';
    const sis_name = item.SisterName;
    var cmpAd = item.Location;
    const Shop = "Shop: " + item.ShortCode + " (" + item.SectorName + ")";
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const alignCol = (data) => {
        if (data.row.section === 'body') {
            data.cell.height = 10; // Adjust this value to change the row height in the body section
        } else if (data.row.section === 'head') {
            data.cell.height = 20; // Adjust this value to change the row height in the head section
        }
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
    let order = document.createElement('CANVAS')

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    const marginX = (pageWidth - canvasWidth) / 1;
    const marginY = (pageHeight - canvasHeight) / 2;

    doc.addImage(imgData, 'JPEG', marginLeft + 15, marginTop, 68, 70);
    doc.setFontSize(18).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 15)

    doc.setFontSize(14).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(sis_name, marginLeft + 94, marginTop + 28)
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 41)

    const contact = [
        item.Phone && `Phone: ${item.Phone}`,
        item.Contact && `Contact: ${item.Contact}`,
        item.Fax && `Fax: ${item.Fax}`,
        item.Whatsapp && `Whatsapp: ${item.Whatsapp}`,
        item.Imo && `Imo: ${item.Imo}`,
        item.Wechat && `Wechat: ${item.Wechat}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(contact, marginLeft + 94, marginTop + 51)

    const online_contact = [
        item.Email && `Email: ${item.Email}`,
        item.Website && `Website: ${item.Website}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(online_contact, marginLeft + 94, marginTop + 61)

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(2);
    doc.line(marginLeft, 98, 570, 98);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 110;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 55, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("QUOTATION", x, 102, { align: "center" });

    JsBarcode(order, item.QuoteNo, {
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

    var order_bar = order.toDataURL('image/jpeg');
    doc.addImage(order_bar, 'JPEG', 45, 167, 80, 20, null, null, 90);

    const tin = "TIN No: " + 500049832
    const gst = "GST: " + 5911
    const od = "Date: " + moment(item.Date).format("DD MMM YYYY")
    // const slsman = "Salesman: " + item.CounterMarry

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(Shop, 380, 115)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(tin, 380, 127)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(gst, 380, 139)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Quote No: " + item.QuoteNo, 380, 151)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(od, 380, 163)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(slsman, 380, 187)

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("courier", 'bold').text("CUSTOMER, ", marginLeft + 35, 115)
    var party_title = doc.splitTextToSize(item.Name, 250);
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text(party_title, marginLeft + 35, 127)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text("Contact: " + item.PartyContact, marginLeft + 35, 139)

    var party_address = item.Address.substring(0, 70) + (item.Address.length < 70 ? "" : "...");
    party_address = doc.splitTextToSize(party_address, 190);
    var ht = doc.getTextDimensions(party_address).h;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(party_address, marginLeft + 35, 150)

    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Payment: " + getPaymentShort(item.Payment, PaymentTerms), marginLeft + 35, 139 + ht + 11)

    const TotalQty = item.QuoteMapData.reduce((TotalQt, myvalue) => TotalQt + parseInt(myvalue.Qty, 10), 0);
    const TotalWt = item.QuoteMapData.reduce((TotalWt, myvalue) => TotalWt + parseInt(myvalue.Weight, 10), 0);

    let gpay = 0
    let pay = 0
    const headers = [["S/N", "CODE", "ITEM DETAILS", "UOM", "QTY", "RATE", "SUB-TOTAL"]];
    var ProductItems = [
        ...item.QuoteMapData.map((item, i) => [
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
    ].sort((a, b) => a[0] - b[0]);

    let options = {
        startY: 210,
        head: headers,
        body: ProductItems,
        theme: 'grid',
        margin: { left: marginLeft },
        tableWidth: 555,
        bodyStyles: {
            lineColor: [26, 189, 156],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 10
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
            }
            // etc
        },
        rowStyles: {
            minCellHeight: 10 // Adjust this value to change the row height
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
        }
    };

    doc.autoTable(options);
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
        if (data.row.index === 0 || data.row.index === 4) {
            s.fontStyle = 'bold';
        }
    }

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = item.QuoteMapData.map(row => parseFloat(row.Qty) * parseFloat(row.Rate));
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    var body = [
        ["TOTAL", " :", getTotal().toLocaleString("en", { minimumFractionDigits: 2 })],
        ["10% GST INCLUDED", " :", parseFloat((parseFloat(item.GrandTotal) * 0.10).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["DISCOUNT", " :", parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["SHIPPING COST", " :", parseFloat(item.Shipping).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET TOTAL", " :", parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })]
    ];

    doc.autoTable({
        body: body,
        startY: LastY,
        bodyStyles: {
            lineColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 10,
            minCellHeight: 13,
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
            // add borders around the head cells
            if (data.row.index === 1 || data.row.index === 4) {
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
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Total Item: " + parseFloat(item.QuoteMapData.length).toLocaleString("en", { minimumFractionDigits: 0 }), marginLeft, LastY + 30)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Total Quantity: " + parseFloat(TotalQty).toLocaleString("en", { minimumFractionDigits: 2 }), 200, LastY + 30)

    const amountInWords = inWords(parseFloat(getTotal()));
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Amount (In Word): ", marginLeft, summery_table_y + 10)
    var Words = doc.splitTextToSize(amountInWords, 400); //Text wrap after char
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(Words, marginLeft + 100, summery_table_y + 10)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("PLEASE PAYMENT TO: ", marginLeft, summery_table_y + 30)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Bank: " + item.Bank.BankName, marginLeft, summery_table_y + 42)
    // doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Branch Name: " + item.Bank.BranchName, marginLeft, summery_table_y + 54)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("A/C Name: " + item.Bank.AccName, marginLeft, summery_table_y + 54)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("A/C No: " + item.Bank.AccNo, marginLeft, summery_table_y + 66)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("BSB Number: " + item.Bank.BSBNO, marginLeft, summery_table_y + 78)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'italic').text("**Please contact with us for further information about payment options", marginLeft, summery_table_y + 93)

    let pageCount = doc.internal.getNumberOfPages()
    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', 80, 320);

        if (i === pageCount) {
            // Recepient
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(550, pageHeight - 70, doc.internal.pageSize.getWidth() - 165, pageHeight - 70);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Prepared by", doc.internal.pageSize.getWidth() - 100, pageHeight - 60, { align: "center" })
            doc.setFontSize(11).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(item.SalesMan, doc.internal.pageSize.getWidth() - 100, pageHeight - 45, { align: "center" })

        }

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


    const fileName = "Quote No-" + item.QuoteNo + " " + item.Name + " Date-" + moment(item.Date).format("DD MMM YYYY")

    doc.setProperties({
        title: fileName,
        subject: 'Quotation',
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