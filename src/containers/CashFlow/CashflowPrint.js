import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "./../.././hocs/Base64Uri";
import logo from './../../assets/logo.png';
import watermark from './../../assets/watermark_1.png';

export const CashflowPrint = async (e, item, status, date, user, account_type) => {
    const name = "DESH BESH GROUP OF COMPANY LTD.";
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const imgData = await convertImgToBase64URL(logo);
    const watermarkData = await convertImgToBase64URL(watermark);
    let column0Has1 = false;
    const alignCol = (data) => {
        if (data.row.section === 'body') {
            data.cell.height = 10; // Adjust this value to change the row height in the body section
        } else if (data.row.section === 'head') {
            data.cell.height = 20; // Adjust this value to change the row height in the head section
            data.cell.styles.halign = 'center';
            data.cell.styles.valign = 'middle';
        }
        var col = data.column.index;
        if (col === 0 || col === 1) {
            data.cell.styles.halign = 'center';
        } else if (col === 3) {
            data.cell.styles.halign = 'left';
            data.cell.styles.valign = 'middle';
        } else if (col === 4 || col === 5) {
            data.cell.styles.halign = 'right';
        }

        if (data.cell.raw === "Balance b/d") {
            data.row.cells[2].colSpan = 3;
            for (let key in data.row.cells) {
                data.row.cells[key].styles.halign = 'center';
                data.row.cells[key].styles.fontStyle = 'bold';
                data.row.cells[key].styles.fillColor = [255, 255, 0];
                data.row.cells[key].styles.textColor = [0, 0, 255];
            }
        } else if (data.row.index !== 0 && data.column.index === 5 && parseFloat(data.cell.raw) === 0.00) {
            // for (let key in data.row.cells) {
            //     data.row.cells[key].styles.fillColor = [240, 240, 240];
            //     data.row.cells[key].styles.textColor = [0, 0, 0];
            // }
        }
    };

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3, or A4
    const orientation = "landscape"; // Change to "landscape" for landscape orientation
    let LastY = null;
    const marginLeft = 30;
    const marginTop = 20;
    const doc = new jsPDF(orientation, unit, size);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(name.toUpperCase(), marginLeft + 94, marginTop + 25);

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 94, marginTop + 38);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(2);
    doc.line(marginLeft, 86, pageWidth - marginLeft, 86);
    doc.setFillColor(119, 136, 153);

    let x = pageWidth / 2;
    let width = 120;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - width / 2, 76, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("CASH FLOW", x, 90, { align: "center" });

    var site = `${item.Sister}${item.Sector?.trim() ? ` (${item.Sector})` : ''}`;
    doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(site, x, marginTop + 90, { align: "center" });

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text("STATEMENT FOR: ", marginLeft, marginTop + 110);
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(account_type, marginLeft + 110, marginTop + 110);

    var d = moment(date).format("DD MMM YYYY");
    doc.setFontSize(18).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(d, pageWidth - marginLeft - 150, marginTop + 90);

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - marginLeft - 170, marginTop + 98, pageWidth - marginLeft - 30, marginTop + 98);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(18).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("DATE", pageWidth - marginLeft - 115, marginTop + 114);

    doc.setFontSize(10).setTextColor(119, 136, 153).setFont("helvetica", 'italic').text("All transaction histories following the date are in the below table", marginLeft, marginTop + 125);
    const headers = [["S/N", "TIMESTAMP", "TYPE", "TITLE", "REFERENCE", "DEBIT", "CREDIT", "BALANCE"]];
    var ProductItems = [
        ...item.ladger.map((item, i) => [
            i + 1,
            moment(item.UpdatedAt).format('hh:mm:ss A'),
            item.Type,
            item.Details,
            item.RefNo,
            parseFloat(item.Debit).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            }),
            parseFloat(item.Credit).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            }),
            parseFloat(item.Balance).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            })
        ]),
    ].sort((a, b) => a[0] - b[0]);

    let options = {
        startY: 155,
        head: headers,
        body: ProductItems,
        theme: 'grid',
        margin: { left: marginLeft },
        tableWidth: pageWidth - 2 * marginLeft,
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
                cellWidth: 68,
                valign: 'middle',
                halign: 'left',
                fontSize: 10
            },
            2: {
                cellWidth: 60,
                valign: 'middle',
                halign: 'center',
            },
            3: {
                cellWidth: 'auto',
                valign: 'left',
                halign: 'left',
            },
            4: {
                cellWidth: 95,
                valign: 'middle',
                halign: 'center',
                fontSize: 10
            },
            5: {
                cellWidth: 73,
                valign: 'middle',
                halign: 'right',
            },
            6: {
                cellWidth: 73,
                valign: 'middle',
                halign: 'right',
            },
            7: {
                cellWidth: 78,
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
    };

    doc.autoTable(options);
    LastY = doc.lastAutoTable.finalY
    if (LastY > 500) doc.addPage();

    let pageCount = doc.internal.getNumberOfPages();


    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        if (i !== 1) {
            // Header
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontSize(12).setFont("helvetica", 'bold').text(name, marginLeft, 35, { align: "left" })
            // doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(cmpAd, marginLeft + 240, 35, { align: "left" })
            doc.setFontSize(12).setTextColor(105, 105, 105).setFont("helvetica", 'bold').text("CASHFLOW#" + moment(date).format("DDMMYYYY"), pageWidth - 160, 35)
        }
        // Define the page width and height for landscape mode
        const pageWidthLandscape = doc.internal.pageSize.getWidth();
        const pageHeightLandscape = doc.internal.pageSize.getHeight();

        // Calculate the center coordinates
        const centerX = pageWidthLandscape / 2;
        const centerY = pageHeightLandscape / 2;

        // Calculate the image dimensions and position it in the center
        const imageWidth = 800; // Adjust the width as needed
        const imageHeight = 500; // Adjust the height as needed
        const imageX = centerX - (imageWidth / 2);
        const imageY = centerY - (imageHeight / 2);

        // Add the watermark image to the center of the page
        doc.addImage(watermarkData, 'PNG', imageX, imageY, imageWidth, imageHeight);
        if (i === pageCount) {
            // Cashier
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(40, pageHeight - 60, 180, pageHeight - 60);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Cashier", 85, pageHeight - 50, { align: "left" });

            // Accountant or Asst. Manager (depending on the condition)
            let accountantText = item.ShortCode === "Corporate" ? "Accountant" : "Asst. Manager";
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(210, pageHeight - 60, 320, pageHeight - 60);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(accountantText, 270, pageHeight - 50, { align: "center" });

            // General Manager or Manager (depending on the condition)
            let managerText = item.ShortCode === "Corporate" ? "General Manager" : "Manager";
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(500, pageHeight - 60, pageWidth - 490, pageHeight - 60);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(managerText, 430, pageHeight - 50, { align: "center" });

            // Authority
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(665, pageHeight - 60, pageWidth - 30, pageHeight - 60);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Authority", pageWidth - 100, pageHeight - 50, { align: "center" });
        }

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border width
        doc.line(0, pageHeight - 35, pageWidth, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);
        var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')

        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text("Printed by " + user + " at " + date.toString(), pageWidth / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), pageWidth - 100, pageHeight - 20);
    }

    const fileName = "Cash Flow Date-" + moment(item.Date).format("DD MMM YYYY");

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ledger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });

    if (status === true) {
        doc.save(fileName);
    } else {
        window.open(doc.output('bloburl'), { "filename": fileName });
    }
}
