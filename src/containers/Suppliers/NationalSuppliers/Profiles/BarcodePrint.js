import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const BarcodePrint = async (e, item, status) => {
    var JsBarcode = require('jsbarcode');
    let canvas = document.createElement('CANVAS')
    const unit = "mm";
    const orientation = "portrait"; // portrait or landscape
    var doc = new jsPDF(orientation, unit, "A4");
    JsBarcode(canvas, item.Barcode, {
        font: "Arial",
        format: "code128",
        height: 20,
        width: 1,
        displayValue: true,
        fontSize: 8,
        textMargin: -1,
        textPosition: "bottom",
        margin: 0
    }).blank(3).render(); // Will affect all barcodes
    var imgData = canvas.toDataURL('image/jpeg');

    var splitTitle = doc.splitTextToSize(item.Title + " (" + item.Qty.toString() + ")", 75);
    var pack = item.Pack
    let top = 5
    let top_barcode = top + 1
    let top_title = top + 15
    let row = 11
    var i = 1;
    // Footer line
    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.1);
    doc.setFillColor(150, 150, 150);
    doc.setLineDash([7, 3, 1, 3], 10);

    while (i <= row) {
        // doc.line(1, 297, 1, 0);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('DESH BESH', 6, top);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(pack, 33, top, { align: "left" });
        doc.addImage(imgData, 'JPEG', 6, top_barcode, 43, 10);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, 6, top_title);
        doc.line(53, 297, 53, 0);

        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('DESH BESH', 58, top);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(pack, 85, top);
        doc.addImage(imgData, 'JPEG', 58, top_barcode, 43, 10);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, 58, top_title);
        doc.line(105, 297, 105, 0);

        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('DESH BESH', 110, top);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(pack, 137, top);
        doc.addImage(imgData, 'JPEG', 110, top_barcode, 43, 10);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, 110, top_title);
        doc.line(157, 297, 157, 0);

        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text('DESH BESH', 162, top);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(pack, 189, top);
        doc.addImage(imgData, 'JPEG', 162, top_barcode, 43, 10);
        doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, 162, top_title);
        // doc.line(209, 297, 209, 0);


        doc.line(0, top_title + 7, 210, top_title + 7);

        top += 27
        top_barcode += 27
        top_title += 27

        i++
    }

    const fileName = item.Title + " Package- " + item.Pack
    doc.setProperties({
        title: fileName,
        subject: 'Package Barcode',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "Deshbesh ERP"
    });

    if (status) {
        doc.autoPrint();
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