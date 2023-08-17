import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../../../.././hocs/Base64Uri";
import { getPaymentShort } from '../../../../../actions/ContractAPI';
import { PaymentTerms } from '../../../../../actions/InventoryAPI';
import logo from '../../../../../assets/logo.png';
import watermark from '../../../../../assets/watermark.png';
import { inWords } from '../../../../../hocs/NumberToWord';
// import { numberToWords } from '../../../../../hocs/Class/InWord';

export const OrderPrint = async (e, item, status) => {

    var JsBarcode = require('jsbarcode');

    const name = item.SisterName;
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const ReceiptNo = "RECEIPT# " + item.OrderNo;
    const Dates = "Date: " + moment(item.CreatedAt).format("DD MMM YYYY");
    const Time = "Time: " + moment(item.CreatedAt).format("hh:mm:ss A");

    const Shop = "Shop: " + item.ShortCode + " (" + item.SectorName + ")";
    const Counter = "Counter: " + item.CounterNo;
    const agent = "Cashier: " + item.CounterMarry;

    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    var subscriberAd = item.Address;
    const ReceiptTitle = "INVOICE#" + item.OrderNo;

    const subsTitle = item.PartyTitle;
    const ContactNo = item.ContactNo;

    const OrderDate = "Order Date: " + moment(item.OrderDate).format('DD MMM YYYY');
    const DeliveryDate = "Delivery Date: " + moment(item.DeliveryDate).format('DD MMM YYYY');

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
    let LastY = null;
    const marginLeft = 20;
    const marginTop = 20;
    const doc = new jsPDF(orientation, unit, size);

    let canvas = document.createElement('CANVAS')
    let invoice = document.createElement('CANVAS')
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

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
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
    let width = 80;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 40, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("ORDER", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });
    // doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(ReceiptTitle, doc.internal.pageSize.getWidth() / 2, 133, { align: "center" })

    // JsBarcode(invoice, item.InvoiceNo, {
    //     font: "Arial",
    //     format: "code128",
    //     height: 15,
    //     width: 1,
    //     displayValue: false,
    //     fontSize: 8,
    //     textMargin: -1,
    //     textPosition: "bottom",
    //     margin: 0
    // }).blank(3).render(); // Will affect all barcodes

    JsBarcode(order, item.OrderNo, {
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

    // var invoice_bar = invoice.toDataURL('image/jpeg');
    var order_bar = order.toDataURL('image/jpeg');
    // doc.addImage(bar, 'JPEG', 40, 150, 65, 20, null, null, 90);
    // doc.addImage(invoice_bar, 'JPEG', 370, 167, 80, 20, null, null, 90);

    doc.addImage(order_bar, 'JPEG', 45, 167, 80, 20, null, null, 90);

    const tin = "TIN No: " + 500049832
    const gst = "GST: " + 5911
    const od = "Order Date: " + moment(item.OrderDate).format("DD MMM YYYY")
    const dd = "Delivery Date: " + moment(item.DeliveryDate).format("DD MMM YYYY")
    const slsman = "Salesman: " + item.CounterMarry

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(Shop, 380, 115)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(tin, 380, 127)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(gst, 380, 139)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("OrderNo: " + item.OrderNo, 380, 151)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(od, 380, 163)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(dd, 380, 175)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(slsman, 380, 187)

    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(item.PartyTitle, marginLeft + 35, 127)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(item.PartyAddress, marginLeft + 35, 139)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(item.PartyContact, marginLeft + 35, 150)

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("courier", 'bold').text("ORDER BY: ", marginLeft + 35, 115)
    var party_title = doc.splitTextToSize(item.PartyTitle, 190);
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(party_title, marginLeft + 35, 127)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text("Contact: " + item.PartyContact, marginLeft + 35, 139)

    var party_address = item.PartyAddress.substring(0, 70) + (item.PartyAddress.length < 70 ? "" : "...");
    party_address = doc.splitTextToSize(party_address, 190);
    var ht = doc.getTextDimensions(party_address).h;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(party_address, marginLeft + 35, 150)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Payment: " + getPaymentShort(item.Payment, PaymentTerms), marginLeft + 35, 139 + ht + 11)



    const TotalQty = item.OrderMapData.reduce((TotalQt, myvalue) => TotalQt + parseInt(myvalue.Qty, 10), 0);
    const TotalWt = item.OrderMapData.reduce((TotalWt, myvalue) => TotalWt + parseInt(myvalue.Weight, 10), 0);

    let gpay = 0
    let pay = 0
    const headers = [["S/N", "CODE", "ITEM DETAILS", "UOM", "ORDERED", "SHIPPED", "RATE", "SUB-TOTAL"]];
    var ProductItems = [
        ...item.OrderMapData.map((item, i) => [
            item.SLNo,
            item.Code,
            item.Title + (item.Remark && item.Remark !== 'N/A' && item.Remark !== "" ? "\n" + item.Remark : ''),
            item.UnitName,
            item.Qty,
            item.OrderQty,
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
                cellWidth: 50,
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
            // if (data.cell.raw === "Payment" || data.cell.raw === "Net Payment" || data.cell.raw === "Grand Payment") {
            //     data.row.cells[0].colSpan = 6;
            //     data.row.cells[0].styles.halign = 'right';
            //     data.row.cells[0].styles.fontStyle = 'bold';
            //     data.row.cells[6].styles.fontStyle = 'bold';
            //     data.row.cells[0].styles.fillColor = [240, 240, 240];
            //     data.row.cells[6].styles.fillColor = [240, 240, 240];

            // }
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
                if (i === pageCount) {

                    // Prepare by
                    doc.setDrawColor(97, 97, 97);
                    doc.setLineWidth(0.5);
                    doc.setLineDash([1, 1], 0);
                    doc.line(40, pageHeight - 70, doc.internal.pageSize.getWidth() / 4, pageHeight - 70);
                    doc.setFillColor(97, 97, 97);
                    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Prepared By", doc.internal.pageSize.getWidth() / 9, pageHeight - 60, { align: "left" })

                    // Checked by
                    doc.setDrawColor(97, 97, 97);
                    doc.setLineWidth(0.5);
                    doc.setLineDash([1, 1], 0);
                    doc.line(165, pageHeight - 70, 260, pageHeight - 70);
                    doc.setFillColor(97, 97, 97);
                    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Checked By", 215, pageHeight - 60, { align: "center" })


                    // Authority
                    doc.setDrawColor(97, 97, 97);
                    doc.setLineWidth(0.5);
                    doc.setLineDash([1, 1], 0);
                    doc.line(280, pageHeight - 70, 395, pageHeight - 70);
                    doc.setFillColor(97, 97, 97);
                    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Storekeeper", 340, pageHeight - 60, { align: "center" })


                    // Recepient
                    doc.setDrawColor(97, 97, 97);
                    doc.setLineWidth(0.5);
                    doc.setLineDash([1, 1], 0);
                    doc.line(550, pageHeight - 70, doc.internal.pageSize.getWidth() - 165, pageHeight - 70);
                    doc.setFillColor(97, 97, 97);
                    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Recipient", doc.internal.pageSize.getWidth() - 100, pageHeight - 60, { align: "center" })

                }

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
                doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
            }

        }
    };

    doc.autoTable(options);
    doc.addImage(watermarkData, 'PNG', 80, 320);
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
        let TotalPrice = 0.00;
        const price = item.OrderMapData.map(row => parseFloat(row.Qty) * parseFloat(row.Rate));
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    var body = [
        ["TOTAL", " :", getTotal().toLocaleString("en", { minimumFractionDigits: 2 })],
        ["DISCOUNT", " :", parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["10% GST INCLUDED", " :", parseFloat(0.00).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET TOTAL", " :", parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })]
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
            // add borders around the head cells
            if (data.row.index === 1 || data.row.index === 3) {
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
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Payment Info: ", marginLeft, LastY + 15)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Total Quantity: " + TotalQty, marginLeft, LastY + 30)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Account No: " + item.Bank.AccNo, marginLeft, LastY + 45)
    // doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("BSB Number: " + item.Bank.BSBNO, marginLeft, LastY + 60)


    const amountInWords = inWords(parseFloat(getTotal()));
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Amount (In Word): ", marginLeft, summery_table_y + 10)
    var Words = doc.splitTextToSize(amountInWords, 260); //Text wrap after char
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(Words, marginLeft + 100, summery_table_y + 10)

    const fileName = "Order No-" + item.OrderNo + " " + item.PartyTitle + " Date-" + moment(item.Date).format("DD MMM YYYY")

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