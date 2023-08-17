import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../.././hocs/Base64Uri";

export const exportPDF = async (e, Data, status) => {
    var JsBarcode = require('jsbarcode');

    const imgUrl = Data.CompanyID.Logo;
    const imgData = await convertImgToBase64URL(imgUrl)
    const name = Data.CompanyID.Name;
    const branch = Data.BranchID.Name + " Branch";
    var Ad = [
        Data.CompanyID.VillageName,
        Data.CompanyID.Union,
        Data.CompanyID.Upazila,
        Data.CompanyID.Zila,
        Data.CompanyID.Division,
        Data.CompanyID.ContactNo
    ];
    var cmpAd = Ad.join(", ");

    const userName = Data.BatchID.UserID.FirstName + " " + Data.BatchID.UserID.LastName;
    const IDs = "UID- " + Data.BatchID.UserID.id + ", FID- " + Data.BusinessID.id + " BID- " + Data.BatchID.id + ", BNO- " + Data.BatchID.BatchNo;
    const ContactNo = Data.BatchID.ContactNo;
    var Sub_Ad = [
        Data.BatchID.UserID.Details[0].VillageName,
        Data.BatchID.UserID.Details[0].Union,
        Data.BatchID.UserID.Details[0].Upazila,
        Data.BatchID.UserID.Details[0].Zila,
        Data.BatchID.UserID.Details[0].Division,
        Data.BatchID.UserID.Details[0].ContactNo
    ];
    var subscriberAd = Sub_Ad.join(", ");
    const ReceiptTitle = "INVOICE#" + Data.InvoiceNo;


    const BatchNo = "Batch No: " + Data.BatchID.BatchNo;
    const subsTitle = Data.BusinessID.Title;
    const BisType = Data.BusinessID.Type + "- " + Data.BatchID.CondID.Title;
    const IssueDate = "Issue Date: " + moment(Data.BatchID.IssueDate).format('DD MMM YYYY');

    // const BisType = Data.BusinessID.Type + "/" + Data.BusinessID.id + "/" + Data.BatchID.BatchNo;
    // const DispatchDate = "Dispatch Date: " + moment(Data.BatchDetails.DispatchDate).format('DD MMM YYYY');
    // const Period = "Period: " + DayConverter(DispatchDate, IssueDate) + " Days";
    // const Season = "Season: " + Data.BatchDetails.Season;
    // const Chick = "Chicks: " + Data.BatchDetails.Chicks;
    const BatchSize = "Batch Size: " + Data.BatchID.BatchSize + " Pcs";

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 0 || col === 1 || col === 2) {
            data.cell.styles.halign = 'center';
        } else if (col === 3) {
            data.cell.styles.halign = 'left';
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

    doc.addImage(imgData, 'JPEG', 110, 30, 60, 40);

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(310, 140, 310, 25);
    doc.setFillColor(119, 136, 153);

    JsBarcode(canvas, Data.InvoiceNo, {
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
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(IDs, PartyLeft, 50)

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(BisType, PartyLeft, 65)
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(IssueDate, PartyLeft, 77)

    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(userName, PartyLeft, 90)
    var splitTitle = doc.splitTextToSize(subscriberAd, 260); //Text wrap after char
    doc.setFontSize(9).setTextColor(85, 87, 104).setFont(undefined, 'normal').text(splitTitle, PartyLeft, 100)


    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(20);
    doc.line(311, 130, 560, 130);
    doc.setFillColor(119, 136, 153);
    doc.setFontSize(10).setTextColor(0, 0, 0).setFont(undefined, 'bold').text(ReceiptTitle, PartyLeft, 133)



    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 140, 310, 140);
    doc.setFillColor(119, 136, 153);


    // doc.setFontSize(10).setTextColor(119, 136, 153).setFont(undefined, 'bold').text("B A T C H   F A C T", doc.internal.pageSize.getWidth() / 2, 160, { align: "center" })
    // doc.autoTable({
    //     startY: 165,
    //     margin: {
    //         top: 60
    //     },
    //     theme: 'grid',
    //     bodyStyles: { lineColor: [220, 220, 220] },
    //     body: [
    //         [IssueDate, DispatchDate, Period],
    //         [Season, Chick, BatchSize],
    //     ],
    // })

    doc.setFontSize(12).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Product Details", doc.internal.pageSize.getWidth() / 2, 170, { align: "center" })
    const TotalQty = Data.sellmap.reduce((TotalQt, myvalue) => TotalQt + parseInt(myvalue.Qty, 10), 0);
    const TotalWt = Data.sellmap.reduce((TotalWt, myvalue) => TotalWt + parseInt(myvalue.Weight, 10), 0);

    let gpay = 0
    let pay = 0
    const headers = [["SLNo", "Code", "Category", "Product Name", "Qty", "Weight"]];
    var ProductItems = [
        ...Data.sellmap.map((item, i) => [
            item.SLNo,
            item.ItemCode,
            item.Category,
            item.Title,
            item.Qty,
            item.Weight
        ]),
        [{
            content: `Total Quantity: ${TotalQty}              Total Weight: ${TotalWt.toLocaleString("en", { minimumFractionDigits: 3 })}`, colSpan: 6,
            styles: {
                // fillColor: [239, 154, 154],
                halign: 'center',
                fontStyle: 'bold',
                // lineColor: [120, 135, 153],
                // lineWidth: 0.5,
                textColor: [0, 0, 0]
            }
        }]
        // [{ content: data, colSpan: 2, rowSpan: 2, styles: { halign: 'center' } }],


    ]

    let options = {
        // html: table,
        startY: 180,
        head: headers,
        body: ProductItems,
        theme: 'grid',
        bodyStyles: {
            lineColor: [220, 220, 220]
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [119, 136, 153]
        },
        columnStyles: {
            0: {
                cellWidth: 40,
                valign: 'middle',
                halign: 'center',
            },
            1: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'center',
            },
            2: {
                cellWidth: 70,
                valign: 'middle',
                halign: 'center',
            },
            3: { cellWidth: 220 },
            4: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'center',
            },
            5: {
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



    const fileName = "UID-" + Data.BatchID.UserID.id + " FID-" + Data.BusinessID.id + " BID-" + Data.BatchID.id + " BNO-" + Data.BatchID.BatchNo + " " + Data.InvoiceNo;
    doc.autoTable(options);

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).FullName,
        keywords: 'generated by SoftaPoul v6.00 web-version beta',
        creator: "SoftaPoul"
    });

    if (status === true) {
        doc.save(fileName);
    }
    else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }
}