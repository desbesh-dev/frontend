import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "./../.././hocs/Base64Uri";
import logo from './../../assets/logo.png';
import watermark from './../../assets/watermark.png';
// import { numberToWords } from '../../hocs/Class/InWord';

export const TrialBalancePrint = async (e, table, DateFrom, DateTo, user, Sister, Sector, Short) => {
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

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(2);
    doc.line(marginLeft, 98, 570, 98);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 170;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 85, 95, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("TRIAL BALANCE", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });
    var site = `${Sister}${Sector?.trim() ? ` (${Sector})` : ''}`;
    doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(site, doc.internal.pageSize.getWidth() / 2, marginTop + 100, { align: "center" })

    var F = moment(DateFrom).format("DD MMM YYYY")
    var T = moment(DateTo).format("DD MMM YYYY")
    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("From " + F + " to " + T, doc.internal.pageSize.getWidth() / 2, marginTop + 115, { align: "center" });

    // Calculate vertical centering
    const tableWidth = 480; // Adjust this to match your table width
    const startX = (pageWidth - tableWidth) / 2;

    let options = {
        theme: "grid",
        html: table,
        startY: 160,
        margin: { left: startX },
        tableWidth: tableWidth,
        bodyStyles: {
            lineColor: [26, 189, 156],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 12
        },
        headStyles: {
            valign: 'middle',
            halign: 'center',
            textColor: [0, 0, 0],
            lineColor: [26, 189, 156], // Setting line color to black
            fontSize: 12
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
                cellWidth: 55,
                valign: 'middle',
                halign: 'center',
            },
            3: {
                cellWidth: 95,
                valign: 'middle',
                halign: 'right',
            },
            4: {
                cellWidth: 95,
                valign: 'middle',
                halign: 'right',
            }
        },
        rowStyles: {
            minCellHeight: 10 // Adjust this value to change the row height
        },
        didParseCell: function (data) {
            // Check if it's a header cell (data.row.index === 0) and if cellData.content is defined
            if (data.row.index === 0 && data.cell && data.cell.content) {
                data.cell.content = data.cell.content.toUpperCase();
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
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text("Printed by " + user?.Name + " at " + date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);
    }

    const fileName = "Trial Balance Date- " + moment(DateFrom).format("DD MMM YYYY") + " to " + moment(DateTo).format("DD MMM YYYY")

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });


    window.open(doc.output('bloburl'), { "filename": fileName });

}