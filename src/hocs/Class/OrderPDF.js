import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { convertImgToBase64URL } from "../../.././hocs/Base64Uri";

export const exportPDF = async (e, item) => {
    var JsBarcode = require('jsbarcode');
    const imgUrl = item.CompanyID.Logo;
    const imgData = await convertImgToBase64URL(imgUrl)
    const name = item.CompanyID.Name;
    var Ad = [
        item.CompanyID.VillageName,
        item.CompanyID.Union,
        item.CompanyID.Upazila,
        item.CompanyID.Zila,
        item.CompanyID.Division,
        item.CompanyID.ContactNo
    ];
    var cmpAd = Ad.join(", ");
    const supplier = item.SupplierID.CmpName;
    const supplierAd = item.SupplierID.CPFAddress
    const OrderNo = "Order No# " + item.OrderNo.toString();
    const OrderDate = "Order Date: " + new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
    const DDate = "Delivery Date: " + item.DeliveryDate;
    const agent = "Order/Updated By: " + item.UpdatedBy;

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 4 || col === 3) {
            data.cell.styles.halign = 'right';
        }

        if (col === 0 || col === 1 || col === 5 || col === 6) {
            data.cell.styles.halign = 'center';
        }
    }

    const getTotal = () => {
        let TotalPrice = 0.00;
        const price = item.OrderMapData.map(row => row.OrderQty * row.UnitPrice);
        if (price.length > 0) {
            TotalPrice = price.reduce((acc, val) => acc + val);
        }
        return TotalPrice;
    }
    const QuantityTotal = item.OrderMapData.reduce((TotalQuantity, myvalue) => TotalQuantity + parseInt(myvalue.OrderQty, 10), 0);

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

    doc.setFontSize(15).setFont(undefined, 'bold').text(name, doc.internal.pageSize.getWidth() / 4, 90, { align: "center" })
    var splitTitle = doc.splitTextToSize(cmpAd, 280); //Text wrap after char
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, doc.internal.pageSize.getWidth() / 4, 105, { align: "center" })

    doc.addImage(imgData, 'JPEG', 110, 30, 60, 40);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    JsBarcode(canvas, OrderNo, {
        font: "monospace",
        format: "CODE128",
        height: 30,
        displayValue: true,
        fontSize: 18,
        textMargin: 2,
        textPosition: "top",
        marginTop: 15
    }).blank(2).render(); // Will affect all barcodes
    doc.addImage(canvas.toDataURL(), 308, doc.internal.pageSize.getHeight() / 8.9, 110, 40, null, null, 90);

    const PartyLeft = 320;
    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(supplier, PartyLeft, marginTop)
    // doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(supplier, doc.internal.pageSize.getWidth() / 1.5, marginTop, { align: "center" })
    var splitTitle = doc.splitTextToSize(supplierAd, 280); //Text wrap after char
    doc.setFontSize(10).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitTitle, PartyLeft, 55)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(OrderDate, PartyLeft, 97)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(DDate, PartyLeft, 109)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(agent, PartyLeft, 120)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(OrderNo, PartyLeft, 133)
    doc.setFontSize(12).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("PRODUCT ORDER DETAILS", doc.internal.pageSize.getWidth() / 2, 170, { align: "center" })

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    const headers = [["S/N", "Item Code", "Item Name", "Qty", "Sub-Total", "Order Date", "Order No",]];
    var data = [...item.OrderMapData.map((pro, i) => [
        i, pro.ItemCode.id,
        pro.ItemCode.Title,
        pro.OrderQty,
        (pro.OrderQty * pro.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 }),
        new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
        item.OrderNo
    ]),
    [{
        content: `Total Quantity: ${QuantityTotal}              Total: ${getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}`, colSpan: 8,
        styles: {
            // fillColor: [239, 154, 154],
            halign: 'center',
            fontStyle: 'bold',
            // lineColor: [120, 135, 153],
            // lineWidth: 0.5,
            textColor: [0, 0, 0]
        }
    }]]

    // const data = item.OrderMapData.map((pro, i) => ([
    //     i, pro.ItemCode.id, 
    //     pro.ItemCode.Title, 
    //     pro.OrderQty, 
    //     (pro.OrderQty * pro.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 }), 
    //     new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '), 
    //     item.OrderNo
    // ]));

    let options = {
        startY: 175,
        head: headers,
        body: data,
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

    const fileName = "Order No- " + item.OrderNo + " (" + new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') + ").pdf"
    doc.autoTable(options);
    doc.setProperties({
        title: fileName,
        subject: 'Product Order PDF',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "SoftaPoul"
    });

    if (e.target.id === "print") {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }
}