import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../.././hocs/Base64Uri";
import { getPaymentShort } from '../../actions/ContractAPI';
import { PaymentTerms } from '../../actions/InventoryAPI';
import logo from '../../assets/logo.png';
import no_delivery from '../../assets/no_delivery.png';
import watermark from '../../assets/watermark.png';
import { inWords } from '../../hocs/NumberToWord';
// import { numberToWords } from '../../hocs/Class/InWord';

export const InvoicePrint = async (e, item, status) => {
    var JsBarcode = require('jsbarcode');
    const name = 'DESH BESH ENTERPRISE LTD';
    const sis_name = item.SisterName;
    var cmpAd = item.Location;
    const Shop = "Shop: " + item.ShortCode + " (" + item.SectorName + ")";
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const delivery = await convertImgToBase64URL(no_delivery)

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
    let pageCount = 0;
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

    doc.addImage(imgData, 'JPEG', marginLeft + 15, marginTop, 68, 70);
    doc.setFontSize(18).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 15)

    doc.setFontSize(14).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(sis_name, marginLeft + 94, marginTop + 28)
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 41)

    const contact = [
        item.Phone && `Phone: ${item.Phone}`,
        item.Contact && `Contact: ${item.Contact}`,
        // item.Fax && `Fax: ${item.Fax}`,
        // item.Whatsapp && `Whatsapp: ${item.Whatsapp}`,
        // item.Imo && `Imo: ${item.Imo}`,
        // item.Wechat && `Wechat: ${item.Wechat}`
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
    let width = 80;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 40, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("INVOICE", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });

    JsBarcode(canvas, item.InvoiceNo, {
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

    if (item.OrderStatus !== 2)
        doc.addImage(delivery, 'PNG', 450, 10, 100, 100);
    // doc.addImage(watermarkData, 'PNG', 80, 320);

    const tin = "TIN No: " + 500049832
    const gst = "GST: " + 5911
    const od = "Order Date: " + moment(item.OrderDate).format("DD MMM YYYY")
    const dd = "Delivery Date: " + moment(item.DeliveryDate).format("DD MMM YYYY")

    const slsman = "Salesman: " + item.CounterMarry
    const no = item.OrderNo || item.InvoiceNo ?
        `Date: ${moment(item.Date).format("DD MMM YYYY")}, ${item.OrderNo ? `Order No: ${item.OrderNo}` : ""}${item.InvoiceNo ? `${item.OrderNo ? ", " : ""}Invoice No: ${item.InvoiceNo}` : ""}`
        : `Date: ${moment(item.Date).format("DD MMM YYYY")}`;

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(tin, marginLeft + 35, 115)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(gst, marginLeft + 35, 127)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(Shop, marginLeft + 35, 139)

    if (item.OrderNo) {
        doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(od, marginLeft + 35, 151)
        doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(dd, marginLeft + 35, 163)
    }
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'normal').text(slsman, marginLeft + 35, item.OrderNo ? 175 : 151)

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("courier", 'bold').text("Invoice to: ", 350, 115)
    var party_title = doc.splitTextToSize(item.PartyTitle, 290);
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(party_title, 350, 127);
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Contact: " + item.PartyContact, 350, 139);

    var party_address = item.PartyAddress.substring(0, 70) + (item.PartyAddress.length < 70 ? "" : "...");
    party_address = doc.splitTextToSize(party_address, 190);
    var ht = doc.getTextDimensions(party_address).h;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(party_address, 350, 150);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Payment: " + getPaymentShort(item.Payment, PaymentTerms), 350, 139 + ht + 11);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("courier", 'bold').text(no, doc.internal.pageSize.getWidth() / 2, 200, { align: "center" });

    const TotalQty = item.SellMapData.reduce((TotalQt, myvalue) => TotalQt + parseInt(myvalue.Qty, 10), 0);
    const TotalWt = item.SellMapData.reduce((TotalWt, myvalue) => TotalWt + parseInt(myvalue.Weight, 10), 0);

    const ord_headers = [["S/N", "CODE", "ITEM DETAILS", "UOM", "ORDERED", "SHIPPED", "RATE", "SUB-TOTAL"]];
    const inv_headers = [["S/N", "CODE", "ITEM DETAILS", "UOM", "Qty", "RATE", "SUB-TOTAL"]];

    var ORD_ProductItems = [
        ...item.SellMapData.map((item, i) => [
            item.SLNo,
            item.Code,
            item.Title + (item.Remark && item.Remark !== 'N/A' && item.Remark !== 'Dispatch' && item.Remark !== "" ? "\n" + item.Remark : ''),
            item.UnitName,
            item.OrderQty,
            item.Qty,
            parseFloat(item.Rate).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
            parseFloat(item.SubTotal).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 })
        ]),
    ]

    var INV_ProductItems = [
        ...item.SellMapData.map((item, i) => [
            item.SLNo,
            item.Code,
            item.Title + (item.Remark && item.Remark !== 'N/A' && item.Remark !== 'Dispatch' && item.Remark !== "" ? "\n" + item.Remark : ''),
            item.UnitName,
            item.Qty,
            parseFloat(item.Rate).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
            parseFloat(item.SubTotal).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 })
        ]),
    ]

    let options = {
        startY: 210,
        head: item.OrderNo ? ord_headers : inv_headers,
        body: item.OrderNo ? ORD_ProductItems : INV_ProductItems,
        theme: 'grid',
        margin: { left: marginLeft },
        tableWidth: 555,
        bodyStyles: {
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 10,
            minCellHeight: 13,
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
            3: { cellWidth: 50 },
            4: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'center',
            },
            5: {
                cellWidth: 55,
                valign: 'middle',
                halign: 'right',
            },
            6: {
                cellWidth: item.OrderNo ? 50 : 80,
                valign: 'middle',
                halign: 'right',
            },
            7: {
                cellWidth: 70,
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
        }
    };

    doc.autoTable(options);
    LastY = doc.lastAutoTable.finalY + 4;

    const getTotal = () => {
        if (!Array.isArray(item.SellMapData) || !item.SellMapData.length) return 0.00;
        return item.SellMapData.reduce((acc, { SubTotal }) => acc + parseFloat(SubTotal), 0.00);
    };

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

    const result = (parseFloat(item.GrandTotal) - parseFloat(item.Shipping) + parseFloat(item.Discount));
    const re_gst = result / 1.1
    const gst_value = (re_gst * 0.1).toFixed(2)
    const formattedResult = parseFloat(gst_value).toLocaleString("en", { minimumFractionDigits: 2 });

    var body = [
        ["TOTAL", " :", getTotal().toLocaleString("en", { minimumFractionDigits: 2 })],
        ["DISCOUNT", " :", parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["10% GST INCLUDED", " :", formattedResult],
        ["SHIPPING COST", " :", parseFloat(item.Shipping).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET AMOUNT", " :", parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["PAID AMOUNT", " :", parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })],
        '',
        '',
        '',
        '',
        '',
        '',
    ];

    doc.autoTable({
        body: body,
        startY: LastY,
        bodyStyles: {
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 12,
            minCellHeight: 10,
        },
        theme: "plain",
        margin: { left: 340 },
        tableWidth: 235,
        pageBreak: 'avoid',
        columnStyles: {
            0: { cellWidth: 147 },
            1: { cellWidth: 10 },
            2: { cellWidth: 80 },
        },
        styles: { fontSize: 12, leading: 15, textColor: [0, 0, 0], cellPadding: 1 },
        minCellHeight: 25, // specify the line height here
        didParseCell: function (cell, data) {
            alignColCalc(cell, data);
        },
        willDrawCell: function (data) {
            if (data.row.index === 1 || data.row.index === 4 || data.row.index === 6) {
                doc.setDrawColor(0, 0, 0); // set the border color
                doc.setLineWidth(0.1); // set the border with
                // doc.setLineDash([], 0); // set the border with
                // draw bottom border
                doc.line(
                    data.cell.x,
                    data.cell.y,
                    data.cell.x + data.cell.width,
                    data.cell.y
                );
            }
        }
    });

    let summery_table_y = doc.lastAutoTable.finalY - 180;
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Total Item: " + parseFloat(item.SellMapData.length).toLocaleString("en", { minimumFractionDigits: 0 }), marginLeft, summery_table_y - 2)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Total Quantity: " + parseFloat(TotalQty).toLocaleString("en", { minimumFractionDigits: 2 }), 200, summery_table_y - 2)

    const amountInWords = inWords(parseFloat(getTotal()));
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Amount (In Word): ", marginLeft, summery_table_y + 10)
    var Words = doc.splitTextToSize(amountInWords, 300); //Text wrap after char
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(Words, marginLeft, summery_table_y + 23)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("PLEASE PAYMENT TO: ", marginLeft, summery_table_y + 50)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Bank: " + item.Bank.BankName, marginLeft, summery_table_y + 62)
    // doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("Branch Name: " + item.Bank.BranchName, marginLeft, summery_table_y + 54)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("A/C Name: " + item.Bank.AccName, marginLeft, summery_table_y + 74)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("A/C No: " + item.Bank.AccNo, marginLeft, summery_table_y + 86)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text("BSB Number: " + item.Bank.BSBNO, marginLeft, summery_table_y + 98)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'italic').text("**Please contact with us for further information about payment options", marginLeft, summery_table_y + 113)
    const contactDetails = `${item.Whatsapp ? 'Whatsapp: ' + item.Whatsapp : ''} ${item.Imo ? 'Imo: ' + item.Imo : ''} ${item.Wechat ? 'Wechat: ' + item.Wechat : ''}`;

    doc.setFontSize(11)
        .setTextColor(0, 0, 0)
        .setFont('helvetica', 'bolditalic')
        .text(`NB: Change or complaints must be submitted within 7 days.`, marginLeft, summery_table_y + 128);

    doc.setFontSize(11)
        .setTextColor(0, 0, 0)
        .setFont('helvetica', 'normal')
        .text(`Contact- ${contactDetails}`, marginLeft, summery_table_y + 140);

    pageCount = doc.internal.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', 80, 320);

        if (i !== 1) {
            // Header
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontSize(12).setFont("helvetica", 'bold').text(name + ' (' + item.ShortCode + "-" + item.SectorName + ")", 20, 25, { align: "left" })
            doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(cmpAd, 20, 35, { align: "left" })
        }

        if (i === pageCount) {
            // Prepare by
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(40, pageHeight - 55, doc.internal.pageSize.getWidth() / 4, pageHeight - 55);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Prepared By", doc.internal.pageSize.getWidth() / 9, pageHeight - 45, { align: "left" })

            // Checked by
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(165, pageHeight - 55, 260, pageHeight - 55);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Checked By", 215, pageHeight - 45, { align: "center" })


            // Authority
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(280, pageHeight - 55, 395, pageHeight - 55);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Authority", 340, pageHeight - 45, { align: "center" })


            // Recepient
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(550, pageHeight - 55, doc.internal.pageSize.getWidth() - 165, pageHeight - 55);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Recipient", doc.internal.pageSize.getWidth() - 100, pageHeight - 45, { align: "center" })
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

    const fileName = "Invoice No-" + item.InvoiceNo + " " + item.PartyTitle + " Date-" + moment(item.Date).format("DD MMM YYYY") + ".pdf"

    doc.setProperties({
        title: fileName,
        subject: 'Party Invoice',
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