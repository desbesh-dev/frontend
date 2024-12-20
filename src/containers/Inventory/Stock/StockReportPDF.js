import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";
import logo from './../../../assets/logo.png';
import watermark from './../../../assets/watermark.png';

export const StockReportPDF = async (e, item, status, user, SectorFilter) => {
    const name = "DESH BESH GROUP OF COMPANY LTD.";
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    const alignCol = (data) => {
        if (data.row.section === 'body') {
            data.cell.height = 10; // Adjust this value to change the row height in the body section
        } else if (data.row.section === 'head') {
            data.cell.height = 20; // Adjust this value to change the row height in the head section
        }
        if (data.row.index === body.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [183, 212, 231];
        }
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    let LastY = null;
    const marginLeft = 20;
    const marginTop = 20;
    const doc = new jsPDF(orientation, unit, size);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 25)

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 38)

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(2);
    doc.line(marginLeft, 86, 570, 86);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 200;
    let height = 20;
    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')

    doc.setFillColor(255, 255, 255).rect(x - 100, 76, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("STOCK REPORT", x, 90, { align: "center" });
    var site = SectorFilter || user;

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(site, x, marginTop + 90, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'italic').text("Date: " + date, x, marginTop + 110, { align: "center" });

    // Calculate the total sum of item.Cost * item.Qty
    const totalSum = item.results.reduce((acc, item) => {
        return acc + parseFloat((item.Cost * item.Qty).toFixed(2));
    }, 0);
    // Format the total sum
    const formattedTotalSum = totalSum.toLocaleString("en-BD", { minimumFractionDigits: 2 });

    const headers = [["S/N", "CODE", "ITEMS NAME", "CTN/BALE/BAG", "PRICE", "AMOUNT"]];
    const body = item.results.map((item, i) => [
        (i + 1), // S/N
        item.Code,
        item.Title,
        parseFloat(item.Ctn).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        parseFloat(item.CtnPrice).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        parseFloat((item.Ctn * item.CtnPrice).toFixed(2)).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
    ]);

    // Add the total sum to the end of the body (or in the footer if needed)
    body.push([
        '', // Empty cell for S/N
        '', // Empty cell for Code
        'Total', // Total label
        '', // Empty cell for Qty
        '', // Empty cell for Cost
        formattedTotalSum, // Total sum for the cost * qty
    ]);

    let options = {
        startY: 160,
        head: headers,
        body: body,
        // theme: 'striped', // or 'grid' or 'plain'
        margin: { left: marginLeft },
        tableWidth: 555,
        bodyStyles: {
            lineColor: [26, 189, 156],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 9,
            halign: 'right'
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            lineWidth: 1,
            lineColor: [255, 255, 255],
            fillColor: [41, 127, 185],
            textColor: [255, 255, 255],
            fontSize: 10
        },
        columnStyles: {
            0: {
                valign: 'middle',
                halign: 'center',
            },
            1: {
                valign: 'middle',
                halign: 'center',
            },
            2: {
                valign: 'middle',
                halign: 'left',
                fontSize: 9
            },
            3: {
                valign: 'middle',
                halign: 'right',
                fontSize: 9
            },
            4: {
                valign: 'middle',
                halign: 'right',
                fontSize: 9
            },
            5: {
                valign: 'middle',
                halign: 'right',
            },
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
                doc.setFontSize(9).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(parts[1], data.cell.x + 5, data.cell.y + 27);
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
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text("Printed by " + user + " at " + date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
    }

    const fileName = "Payment Due Report-" + moment(item.Date).format("DD MMM YYYY")

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