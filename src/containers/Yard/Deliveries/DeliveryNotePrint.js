import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';

export const DeliveryNotePrint = async (e, item, status, type) => {
    var JsBarcode = require('jsbarcode');
    const name = 'DELIVERY NOTE';
    const ReqToTitle = item.ReqToSister
    const ReqToSector = "———(" + item.ReqToSector + " - " + item.ReqToShortCode + ")———"
    var ReqToAdd = item.ReqToAdd;

    const ReqForTitle = item.ReqForSister
    const ReqForSector = "———(" + item.ReqForSector + " - " + item.ReqForShortCode + ")———"
    var ReqForAdd = item.ReqForAdd;

    const DelNoteNo = "DELIVERY NOTE NO# " + item.DeliveryNoteNo;
    const Dates = "Date: " + moment(item.CreatedAt).format("DD MMM YYYY") + ", Order Date: " + moment(item.OrderDate).format("DD MMM YYYY");
    const Sender = "Sender: " + item.Sender;

    const unit = "mm";
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 4;
    let LastY = null;
    let canvH = item.DeliveryMapData.length * 7;
    let pageHeight = null;
    const headers = [["ITEMS", "UOM", "QTY"]];
    var data = [...item.DeliveryMapData.map((pro, i) => [
        pro.Title + "\n [" + pro.CtrNo + "]",
        pro.UnitName,
        pro.Qty
    ]),
    ]

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 1) {
            data.cell.styles.halign = 'center';
        }
        if (col === 2 || col === 3 || col === 4) {
            data.cell.styles.halign = 'right';
        }
    }

    let options = {
        theme: 'plain',
        startY: 57,
        margin: { horizontal: 2 },
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
            fontSize: 9,
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [128, 128, 128]
        },
        tableWidth: 72,
        didParseCell: function (cell, data) {
            alignCol(cell, data);
        },
    };

    const tempDoc = new jsPDF({ orientation, unit, format: [79, 4000] });
    tempDoc.autoTable(options);
    pageHeight = tempDoc.previousAutoTable.finalY + 70;

    const doc = new jsPDF({ orientation, unit, format: [79, pageHeight] });
    doc.autoTable(options);

    const QuantityTotal = item.DeliveryMapData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.Qty, 10), 0);
    let canvas = document.createElement('CANVAS')

    const pageWidth = 79;

    doc.setFontSize(13).setFont(undefined, 'bold').text(name, pageWidth / 2, 6, { align: "center" })
    doc.setFontSize(10).setFont(undefined, 'normal').text(DelNoteNo, pageWidth / 2, 10, { align: "center" })

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReqToTitle, pageWidth / 2, 15, { align: "center" })
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(ReqToSector, pageWidth / 2, 19, { align: "center" })

    var to_address = item.ReqToAdd.substring(0, 70) + (item.ReqToAdd.length < 70 ? "" : "...");
    to_address = doc.splitTextToSize(to_address, 70);
    var to_ht = doc.getTextDimensions(to_address).h;
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont("courier", 'normal').text(to_address, pageWidth / 2, 22, { align: "center" })


    doc.setFontSize(10).setTextColor(0, 0, 0).setFont("Helvetica", 'bold').text("To", pageWidth / 2, to_ht + 24, { align: "center" })

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('Helvetica', 'bold').text(ReqForTitle, pageWidth / 2, to_ht + 29, { align: "center" })
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont('Helvetica', 'normal').text(ReqForSector, pageWidth / 2, to_ht + 33, { align: "center" })

    var for_address = item.ReqForAdd.substring(0, 70) + (item.ReqForAdd.length < 70 ? "" : "...");
    for_address = doc.splitTextToSize(for_address, 70);
    var for_ht = doc.getTextDimensions(for_address).h;
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont("courier", 'normal').text(for_address, pageWidth / 2, to_ht + 37, { align: "center" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont('Helvetica', 'bold').text(Dates, pageWidth / 2, to_ht + for_ht + 39, { align: "center" })
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont('Helvetica', 'normal').text(Sender, pageWidth / 2, to_ht + for_ht + 43, { align: "center" })

    doc.autoTable(options);
    LastY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont('Helvetica', 'bold').text("TOTAL# " + QuantityTotal, pageWidth / 2, LastY, { align: "left" })

    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
    doc.setFontSize(8).setTextColor(128, 128, 128).setFont(undefined, 'normal').text('DESH BESH ERP', 4, pageHeight - 4);
    doc.setFontSize(8).setTextColor(128, 128, 128).setFont(undefined, 'normal').text("Print: " + date.toString(), 55, pageHeight - 4, { align: "center" })

    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(4, pageHeight - 8, pageWidth - 4, pageHeight - 8);
    doc.setFillColor(128, 128, 128);

    const fileName = "Delivery Note No- " + item.DeliveryNoteNo + " (" + new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') + ").pdf"
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