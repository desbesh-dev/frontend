import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "./../.././hocs/Base64Uri";
import logo from './../../assets/logo.png';
import watermark from './../../assets/watermark.png';
// import { numberToWords } from '../../hocs/Class/InWord';

export const IncStatementPDF = async (e, item, NetSale, COGS, GrossProfit, NetIncome, DateFrom, DateTo, user, Sister, Sector, Short) => {
    const name = "DESH BESH GROUP OF COMPANY LTD.";
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 20;
    const marginTop = 20;
    const doc = new jsPDF(orientation, unit, size);

    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 25)

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 38)

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
    let width = 170;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 85, 95, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("INCOME STATEMENT", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Sister, marginLeft, marginTop + 110)
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Sector, marginLeft, marginTop + 128)
    // doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Short, marginLeft, marginTop + 146)
    var F = moment(DateFrom).format("DD MMM YYYY")
    var T = moment(DateTo).format("DD MMM YYYY")
    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("From " + F + " To " + T, 350, marginTop + 110);

    // doc.setDrawColor(97, 97, 97);
    // doc.setLineWidth(0.5);
    // doc.line(380, marginTop + 118, 520, marginTop + 118);
    // doc.setFillColor(97, 97, 97);

    // doc.setFontSize(18).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("DATE", 430, marginTop + 138);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("courier", 'normal').text("Operating Expenses", x, marginTop + 170, { align: "center" });


    const getTotal = () => {
        if (!Array.isArray(item?.Expense) || !item?.Expense.length) return 0.00;
        return item?.Expense.reduce((acc, { total_dr }) => acc + parseFloat(total_dr), 0.00);
    };

    const headers = [["S/N", "Title", "Amount"]];
    var ProductItems = [
        ...item.Expense.map((item, i) => [
            i + 1,
            item.COA__COA_Title,
            parseFloat(item.total_dr).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            })
        ]),
    ].sort((a, b) => a[0] - b[0]);
    // Calculate vertical centering
    const tableWidth = 480; // Adjust this to match your table width
    const startX = (pageWidth - tableWidth) / 2;

    let options = {
        startY: 200,
        head: headers,
        body: ProductItems,
        theme: 'grid',
        margin: { left: startX },
        tableWidth: tableWidth,
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
                cellWidth: 'auto',
                valign: 'middle',
                halign: 'left',
            },
            2: {
                cellWidth: 180,
                valign: 'middle',
                halign: 'right',
            }
        },
        rowStyles: {
            minCellHeight: 10 // Adjust this value to change the row height
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
    let LastY = doc.lastAutoTable.finalY + 4;
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text("TOTAL", 250, LastY + 15)
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(parseFloat(getTotal()).toLocaleString("en", { minimumFractionDigits: 2 }), 430, LastY + 15)

    let pageCount = doc.internal.getNumberOfPages()
    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', 80, 320);

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);
        var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text("Printed by " + user?.Name + " at " + date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
    }


    var body = [
        ["Revenue", " :", parseFloat(item.Revenue).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["  (—) Return", " :", parseFloat(item.Return).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET SALES", " :", parseFloat(NetSale).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["      Opening Stock", " :", parseFloat(item.InitStock).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["      Purchase In This Period", " :", parseFloat(item.Purchase).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["      Current Stock", " :", parseFloat(item.EndStock).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["(—) COGS", " :", parseFloat(COGS).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["GROSS PROFIT", " :", parseFloat(GrossProfit).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["(—) OPERATING EXPENSE", " :", parseFloat(getTotal()).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["PRE-TAX INCOME", " :", parseFloat(GrossProfit - getTotal()).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["(—) TAX", " :", parseFloat(item.Tax).toLocaleString("en", { minimumFractionDigits: 2 })],
        ["NET INCOME", " :", parseFloat(NetIncome - getTotal()).toLocaleString("en", { minimumFractionDigits: 2 })],
    ];

    doc.autoTable({
        body: body,
        startY: LastY + 50,
        bodyStyles: {
            lineColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 12,
            minCellHeight: 10,
        },
        theme: "plain",
        margin: { left: startX },
        tableWidth: 480,
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 8 },
            2: {
                cellWidth: 180,
                valign: 'middle',
                halign: 'right',
            },
        },
        styles: { fontSize: 11, leading: 15, textColor: [0, 0, 0], cellPadding: 1 },
        minCellHeight: 25, // specify the line height here
        // didParseCell: function (cell, data) {
        //     alignColCalc(cell, data);
        // },
        willDrawCell: function (data) {
            const boldRows = [2, 7, 9, 11]; // Rows where text should be bolder

            // Set bold font for specified rows
            if (boldRows.includes(data.row.index)) {
                doc.setFont('helvetica', 'bold'); // Set font to bold
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
            } else {
                doc.setFont('helvetica', 'normal'); // Set font back to normal
            }

        },
    });

    let summery_table_y = doc.lastAutoTable.finalY + 4;

    const fileName = "Income Statement Date-" + moment(item.Date).format("DD MMM YYYY")

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });


    window.open(doc.output('bloburl'), { "filename": fileName });

}