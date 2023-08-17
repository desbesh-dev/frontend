import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { convertImgToBase64URL } from "../../../../.././hocs/Base64Uri";

export const exportPDF = async (e, BisData, UserData, Tarikh, Data, table, NestedTable) => {

    var JsBarcode = require('jsbarcode');
    const imgUrl = process.env.REACT_APP_API_URL + JSON.parse(localStorage.getItem("user")).Logo;
    const imgData = await convertImgToBase64URL(imgUrl)
    const name = JSON.parse(localStorage.getItem("user")).CompanyName;
    var Ad = [
        UserData.UserInfo.BranchID.VillageName,
        UserData.UserInfo.BranchID.Union,
        UserData.UserInfo.BranchID.Upazila,
        UserData.UserInfo.BranchID.Zila,
        UserData.UserInfo.BranchID.Division,
        UserData.UserInfo.BranchID.ContactNo
    ];
    var cmpAd = Ad.join(", ");

    const subsID = "Subscriber ID: " + BisData.id;
    const subsTitle = BisData.Title;
    const userID = "User ID: " + BisData.UserID.id;
    const userName = UserData.Details.FullName;
    const ContactNo = BisData.UserID.MobileNo;
    const subscriberAd = UserData.Details.VillageName + ", " + UserData.Details.Union + ", " + UserData.Details.Upazila + ", " + UserData.Details.Zila + ", " + UserData.Details.Division
    const LadgerDate = "Ladger " + Tarikh;

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 4 || col === 3) {
            data.cell.styles.halign = 'right';
        }

        if (col === 0 || col === 1 || col === 5 || col === 6) {
            data.cell.styles.halign = 'left';
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

    doc.setFontSize(15).setFont(undefined, 'bold').text(name, doc.internal.pageSize.getWidth() / 4, 90, { align: "center" })
    var splitTitle = doc.splitTextToSize(cmpAd, 260); //Text wrap after char
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitTitle, doc.internal.pageSize.getWidth() / 4, 105, { align: "center" })

    doc.addImage(imgData, 'JPEG', 110, 30, 60, 40);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    JsBarcode(canvas, LadgerDate, {
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
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(LadgerDate, PartyLeft, 134)


    doc.setFontSize(12).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("TRANSACTION DETAILS", doc.internal.pageSize.getWidth() / 2, 170, { align: "center" })

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);

    const headers = [["Date", "Details", "Ref No.", "Debit", "Credit", "Balance",]];
    var data = [...Data.map((item, i) => [
        new Date(item.Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
        item.Order !== 3 && Array.isArray(item.Details) && item.Details.length > 0
            ? "Product"
            : item.Details,
        item.RefNo,
        item.Debit,
        item.Credit,
        item.Balance,
    ]),
    [{
        // content: `Total Quantity: ${QuantityTotal}              Total: ${getTotal().toLocaleString("en", { minimumFractionDigits: 2 })}`, colSpan: 8,
        styles: {
            // fillColor: [239, 154, 154],
            halign: 'center',
            fontStyle: 'bold',
            // lineColor: [120, 135, 153],
            // lineWidth: 0.5,
            textColor: [0, 0, 0]
        }
    }]]







    // const data = item.OrderMapData.map((item, i) => ([
    //     i, item.ItemCode.id, 
    //     item.ItemCode.Title, 
    //     item.OrderQty, 
    //     (item.OrderQty * item.UnitPrice).toLocaleString("en", { minimumFractionDigits: 2 }), 
    //     new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' '), 
    //     item.LadgerDate
    // ]));






    let options = {
        // html: table,
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

        // didDrawCell: function (data) {
        //     // const rawNode = data.cell.raw !== undefined ? data.cell.raw : 0;
        //     // const nestTable = rawNode ? rawNode.querySelector('#NestTable') : null;
        //     // 
        //     if (data.column.dataKey === 0 && data.cell.section === 'body') {
        //         doc.autoTable({
        //             html: NestedTable,
        //             // head: [["One", "Two", "Three", "Four", "Five"]],
        //             // body: [
        //             //     ["1", "2", "3", "4", "5"],
        //             //     ["1", "2", "3", "4", "5"],
        //             //     ["1", "2", "3", "4", "5"],
        //             //     ["1", "2", "3", "4", "5"]
        //             // ],
        //             startY: data.cell.y + 2,
        //             margin: { left: data.cell.x + data.cell.padding('left') },
        //             tableWidth: 'wrap',
        //             theme: 'grid',
        //             styles: {
        //                 fontSize: 7,
        //                 cellPadding: 1,
        //             }
        //         });
        //     }
        // },

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

    const fileName = BisData.id + "/" + BisData.UserID.id + ". " + subsTitle + " " + LadgerDate + ".pdf"
    doc.autoTable(options);

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).FullName,
        keywords: 'generated by SoftaPoul v6.00 web-version beta',
        creator: "SoftaPoul"
    });

    if (e.target.id === "print") {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }
}