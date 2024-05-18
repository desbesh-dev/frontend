import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { getLabel } from '../../actions/ContractAPI';
import { PaymentTerms } from '../../actions/InventoryAPI';

export const Receipt = async (e, item, status, type) => {
    var JsBarcode = require('jsbarcode');
    const name = 'DESH BESH ENTERPRISE LTD';
    const sis_name = "——(" + item.SisterName + ")——"
    const ReceiptNo = "RECEIPT# " + item.InvoiceNo;
    const Dates = "Date: " + moment(item.CreatedAt).format("DD MMM YYYY");
    const Time = "Time: " + moment(item.CreatedAt).format("hh:mm:ss A");

    const Shop = "Shop: " + item.ShortCode + " (" + item.SectorName + ")";
    const Counter = "Counter: " + item.CounterNo;
    const agent = "Cashier: " + item.CounterMarry;

    const unit = "mm";
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 4;
    let LastY = null;
    let canvH = item.SellMapData.length * 7;
    let pageHeight = null;
    const headers = [["ITEMS", "UOM", "QTY", "RATE", "PRICE"]];
    var data = [...item.SellMapData.map((pro, i) => [
        pro.Title,
        pro.UnitName,
        pro.Qty,
        parseFloat(pro.Rate).toFixed(2),
        (pro.Qty * pro.Rate).toLocaleString("en", { minimumFractionDigits: 2 }),
        new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
        item.ReceiptNo
    ]),
    ]

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 1) {
            data.cell.styles.halign = 'center';
            data.cell.styles.valign = 'middle';
        }
        if (col === 2 || col === 3 || col === 4) {
            data.cell.styles.halign = 'right';
            data.cell.styles.valign = 'middle';
        }
    }

    let options = {
        theme: 'grid',
        startY: 40,
        margin: { left: 4 },
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
            lineColor: [128, 128, 128],
            cellPadding: 1,  // Set cellPadding to 0 to remove padding
            rowHeight: 5    // Set the rowHeight as desired to control the margin
        },
        columnStyles: {
            1: { cellWidth: 10, valign: 'middle', halign: 'center' },
            2: { columnWidth: 'wrap', overflow: 'linebreak' },
            3: { columnWidth: 'wrap', overflow: 'linebreak' },
            4: { columnWidth: 'wrap', overflow: 'linebreak' }
        },
        tableWidth: 68,
        columnWidth: 'auto', // This option helps to automatically adjust the width of columns based on content
        didParseCell: function (cell, data) {
            alignCol(cell, data);
        },
    };

    const tempDoc = new jsPDF({ orientation, unit, format: [79, 4000] }); // Set a large height to ensure enough space
    tempDoc.autoTable(options);
    pageHeight = tempDoc.previousAutoTable.finalY + 70; // Adding 10 to provide some bottom margin

    // Create the actual document with the correct pageHeight
    const doc = new jsPDF({ orientation, unit, format: [79, pageHeight] });

    doc.autoTable(options);

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = item.SellMapData.map(row => parseFloat(row.Qty) * parseFloat(row.Rate));
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }

    const QuantityTotal = item.SellMapData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Qty, 10), 0);
    let canvas = document.createElement('CANVAS')

    const pageWidth = 76;
    // pageHeight = doc.internal.pageSize.getHeight();
    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    doc.setFontSize(13).setFont(undefined, 'bold').text(name, pageWidth / 2, 6, { align: "center" })
    doc.setFontSize(11).setFont(undefined, 'normal').text(sis_name, pageWidth / 2, 10, { align: "center" })

    var splitTitle = doc.splitTextToSize(item.Location, 90); //Text wrap after char
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, pageWidth / 2, 14, { align: "center" })

    doc.setFontSize(10).setFont(undefined, 'bold').text(ReceiptNo, pageWidth / 2, 23, { align: "center" })

    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(Dates, marginLeft, 28)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Time, 44, 28)

    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Shop, marginLeft, 32)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(Counter, 44, 32)

    const customerText = item.PartyID !== null ? `Subs: ${item.PartyTitle}` : 'Walk-in Customer';
    const CustomerWrap = doc.splitTextToSize(customerText, 30);
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(CustomerWrap, marginLeft, 36)
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(agent, 44, 36)

    doc.autoTable(options);
    LastY = doc.lastAutoTable.finalY + 2;

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
            s.fontSize = 10
        }
    }

    var body = [
        ["TOTAL", ":", getTotal().toLocaleString("en", { minimumFractionDigits: 2 })],
        ["DISCOUNT", ":", parseFloat(item.Discount).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["10% GST INCLUDED", ":", parseFloat(0.00).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET TOTAL", ":", parseFloat(item.GrandTotal).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["PAID AMOUNT", ":", parseFloat(item.PaidAmount).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["PAYMENT TYPE", ":", getLabel(item.Payment, PaymentTerms)],
        ["CHANGE AMOUNT", ":", parseFloat(item.RefundAmount).toLocaleString("en", { minimumFractionDigits: 2 })],
    ]

    doc.autoTable({
        body: body,
        startY: LastY,
        theme: "plain",
        margin: { left: 10 },
        tableWidth: 68,
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
    doc.setFontSize(8).setTextColor(128, 128, 128).setFont(undefined, 'normal').text("Print: " + date.toString(), 52, pageHeight - 17, { align: "center" })

    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(3.5, pageHeight - 16, pageWidth - 3.5, pageHeight - 16);
    doc.setFillColor(128, 128, 128);

    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(3.5, pageHeight - 8, pageWidth - 3.5, pageHeight - 8);
    doc.setFillColor(128, 128, 128);

    doc.setFontSize(8).setTextColor(0, 0, 0).setFont(undefined, 'normal').text("THANKS FOR CHOOSING US", pageWidth / 2, pageHeight - 3.5, { align: "center" })

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
    document.body.appendChild(oHiddFrame)
}