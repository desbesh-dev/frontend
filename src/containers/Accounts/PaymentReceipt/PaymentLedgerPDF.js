import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";
import logo from './../../../assets/logo.png';
import watermark from './../../../assets/watermark.png';

export const PaymentReceivedLedger = async (e, item, status, date_from, date_to, user) => {
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
        var col = data.column.index;
        if (col === 3 && data.cell.raw.includes("\n")) {
            data.cell.styles.valign = 'top';
            var parts = data.cell.raw.split("\n");
            data.cell.text = parts[0];
            data.row.height = 30;
        }
        if (data.row.section === 'body' && data.column.index === 1) {
            const cellValue5 = data.cell.raw; // Get value of column index 5
            const cellValue6 = data.row.raw[2]; // Get value of column index 6

            if (cellValue5 === cellValue6) {
                for (let key in data.row.cells) {
                    data.row.cells[key].styles.fillColor = [240, 240, 240];
                    data.row.cells[key].styles.textColor = [0, 0, 0];
                    data.row.cells[key].styles.fontStyle = 'bold';
                }
            }
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
    doc.line(marginLeft, 86, 570, 86);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 180;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 90, 76, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("PAYMENT RECEIVED", x, 90, { align: "center" });

    // doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(Title, x, marginTop + 90, { align: "center" })

    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")
    var site = `${item.Sister}${item.Sector?.trim() ? ` (${item.Sector})` : ''}`;

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(site, x, marginTop + 90, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("From " + d_from + " to " + d_to, x, marginTop + 110, { align: "center" });

    const headers = [["S/N", "DATE", "INVOICE DATE", "PARTY TITLE", "INVOICE NO", "CASH", "BANK"]];

    var ProductItems = item.Payments
        .map((value, i) => [
            i + 1,
            moment(value.Date).format("DD/MM/YY"),
            moment(value.InvDate).format("DD/MM/YY"),
            `${value.Party}\n${value.Address}`,
            value.InvoiceNo,
            value.Payment === 14 ? parseFloat(value.PaidAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) : '—',
            value.Payment !== 14 ? parseFloat(value.PaidAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) : '—'
        ])
        .sort((a, b) => a[0] - b[0]);

    // Ensure `value.Payment` is a number before comparison
    item.Payments.forEach(value => {
        value.Payment = Number(value.Payment);
    });

    // Calculate totals
    const totals = item.Payments.reduce(
        (acc, value) => {
            const paidAmount = parseFloat(value.PaidAmount);
            if (value.Payment === 14) {
                acc.totalCash += paidAmount;
            } else {
                acc.totalBank += paidAmount;
            }
            return acc;
        },
        { totalCash: 0, totalBank: 0 }
    );

    // Format totals
    const formattedTotalCash = totals.totalCash.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const formattedTotalBank = totals.totalBank.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });

    // Example of adding totals to ProductItems array
    ProductItems.push(['', '', '', 'Total Cash & Bank', '', formattedTotalCash, formattedTotalBank]);

    let options = {
        startY: 160,
        head: headers,
        body: ProductItems,
        theme: 'grid',
        margin: { left: marginLeft },
        tableWidth: 555,
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
            fontSize: 11
        },
        columnStyles: {
            0: {
                cellWidth: 30,
                valign: 'middle',
                halign: 'center',
            },
            1: {
                cellWidth: 58,
                valign: 'middle',
                halign: 'center',
            },
            2: {
                cellWidth: 58,
                valign: 'middle',
                halign: 'center',
            },
            3: {
                cellWidth: 'auto',
                valign: 'middle',
                halign: 'left',
                fontSize: 10
            },
            4: {
                cellWidth: 90,
                valign: 'middle',
                halign: 'center',
                fontSize: 9
            },
            5: {
                cellWidth: 78,
                valign: 'middle',
                halign: 'right',
            },
            6: {
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

        didDrawCell: function (data) {
            if (data.column.index === 3 && data.cell.raw.includes("\n")) {
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

    const fileName = "Party Payment Received-" + moment(item.Date).format("DD MMM YYYY")

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

