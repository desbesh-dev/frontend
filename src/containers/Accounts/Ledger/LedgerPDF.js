import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";
import logo from './../../../assets/logo.png';
import watermark from './../../../assets/watermark.png';
// import { numberToWords } from '../../hocs/Class/InWord';


export const GeneralLedgerPrint = async (e, item, status, date_from, date_to, Title, user) => {
    const name = "DESH BESH GROUP OF COMPANY LTD.";
    var cmpAd = 'PO Box: 262, Boroko, National Capital District, S#93, L#31, Vani Place, Gordons';
    const Sister = "Sister Name: " + item.Sister;
    const Sector = "Sector Name: " + item.Sector;
    const Short = "Short Code: " + item.ShortCode;
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    let column0Has1 = false;
    const alignCol = (data) => {
        if (data.row.section === 'body') {
            data.cell.height = 10; // Adjust this value to change the row height in the body section
        } else if (data.row.section === 'head') {
            data.cell.height = 20; // Adjust this value to change the row height in the head section
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
        }
        // else if (data.row.index !== 0 && data.column.index === 5 && parseFloat(data.cell.raw) === 0.00) {
        //     for (let key in data.row.cells) {
        //         data.row.cells[key].styles.fillColor = [240, 240, 240];
        //         data.row.cells[key].styles.textColor = [0, 0, 0];
        //     }
        // }

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
    doc.line(marginLeft, 98, 570, 98);
    doc.setFillColor(119, 136, 153);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 120;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 60, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("LEDGER", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Sister, marginLeft, marginTop + 110)
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Sector, marginLeft, marginTop + 128)
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Short, marginLeft, marginTop + 146)
    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(Title, 400, marginTop + 110, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("From " + d_from + " to " + d_to, 400, marginTop + 125, { align: "center" });

    doc.setFontSize(10).setTextColor(119, 136, 153).setFont("helvetica", 'italic').text("All transaction histories following the date are in the below table", marginLeft, marginTop + 170);
    const headers = [["S/N", "DATE", "DETAILS", "REFERENCE", "DEBIT", "CREDIT", "BALANCE"]];
    var ProductItems = [
        ...item.ladger.map((item, i) => [
            i + 1,
            moment(item.Date).format('DD MMM YYYY'),
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
    // Sum Debit and Credit for the footer (excluding the first row)
    const totalDebit = item.ladger.slice(1).reduce((sum, item) => sum + parseFloat(item.Debit || 0), 0);
    const totalCredit = item.ladger.slice(1).reduce((sum, item) => sum + parseFloat(item.Credit || 0), 0);

    // Group by Week and Month and calculate totals (excluding the first row)
    const groupByWeek = {};
    const groupByMonth = {};

    item.ladger.slice(1).forEach(item => {  // Exclude the first row
        const week = moment(item.Date).isoWeek();
        const month = moment(item.Date).format('MMM YYYY');

        if (!groupByWeek[week]) groupByWeek[week] = { Debit: 0, Credit: 0 };
        if (!groupByMonth[month]) groupByMonth[month] = { Debit: 0, Credit: 0 };

        groupByWeek[week].Debit += parseFloat(item.Debit || 0);
        groupByWeek[week].Credit += parseFloat(item.Credit || 0);

        groupByMonth[month].Debit += parseFloat(item.Debit || 0);
        groupByMonth[month].Credit += parseFloat(item.Credit || 0);
    });

    // Calculate percentage change of Debit (week-over-week and month-over-month)
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return 'N/A'; // Prevent division by zero
        return (((current - previous) / previous) * 100).toFixed(2) + '%';
    };

    const weekEntries = Object.entries(groupByWeek);
    const monthEntries = Object.entries(groupByMonth);

    const weeklyPercentageChanges = weekEntries.map(([, current], index) => {
        if (index === 0) return 'N/A';
        const [, previous] = weekEntries[index - 1];
        return calculatePercentageChange(current.Debit, previous.Debit);
    });

    const monthlyPercentageChanges = monthEntries.map(([, current], index) => {
        if (index === 0) return 'N/A';
        const [, previous] = monthEntries[index - 1];
        return calculatePercentageChange(current.Debit, previous.Debit);
    });

    // First Table: Ledger Data (excluding first row in totals)
    let options1 = {
        startY: 200,
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
            lineColor: [26, 189, 156],
        },
        columnStyles: {
            0: { cellWidth: 35, valign: 'middle', halign: 'center' },
            1: { cellWidth: 68, valign: 'middle', halign: 'left' },
            2: { cellWidth: 'auto', valign: 'middle', halign: 'left' },
            3: { cellWidth: '80', valign: 'left', halign: 'left' },
            4: { cellWidth: 73, valign: 'middle', halign: 'right' },
            5: { cellWidth: 73, valign: 'middle', halign: 'right' },
            6: { cellWidth: 78, valign: 'middle', halign: 'right' },
        },
        rowStyles: {
            minCellHeight: 10
        },
        didParseCell: function (data) {
            alignCol(data);
        },
        didDrawPage: function (data) {
            data.settings.margin.top = 60;
            const pageCount = doc.internal.getNumberOfPages();
            if (pageCount !== 1) {
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont("helvetica", 'bold').text(name, data.settings.margin.left, 40, { align: "left" });
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(cmpAd, data.settings.margin.left, 50, { align: "left" });
            }
            doc.setFontSize(10);
            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
        }
    };

    // Add footer row with total Debit and Credit
    options1.body.push([
        '', '', '', 'Total',
        totalDebit.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
        totalCredit.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
        ''
    ]);
    doc.autoTable(options1);

    // Create a new table for the summary data
    let options2 = {
        startY: doc.previousAutoTable.finalY + 10,  // Start just after the first table
        head: [["SUMMARY", "Cost", "Changing Ratio"]],
        body: [
            ["Weekly Summary", "", "", ""],
            ...weekEntries.map(([week, values], index) => [
                `Week ${week}`,
                values.Debit.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
                weeklyPercentageChanges[index]
            ]),
            ["Monthly Summary", "", "", ""],
            ...monthEntries.map(([month, values], index) => [
                month,
                values.Debit.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }),
                monthlyPercentageChanges[index]
            ]),
        ],
        tableWidth: 555,
        theme: 'grid',
        margin: { left: marginLeft },
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
            lineColor: [26, 189, 156],
        },
        columnStyles: {
            0: { valign: 'middle', halign: 'left' },
            1: { valign: 'middle', halign: 'right' },
            2: { valign: 'middle', halign: 'right' },
        }
    };

    doc.autoTable(options2);

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


    const fileName = "Cash Flow Date-" + moment(item.Date).format("DD MMM YYYY")

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


export const PartyOusLedgerPrint = async (e, item, status, date_from, date_to, Title, user) => {
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
        if (col === 1 && data.cell.raw.includes("\n")) {
            data.cell.styles.valign = 'top';
            var parts = data.cell.raw.split("\n");
            data.cell.text = parts[0];
            data.row.height = 30;
        }

        if (data.cell.raw === "Balance b/d") {
            data.row.cells[2].colSpan = 3;
            for (let key in data.row.cells) {
                data.row.cells[key].styles.halign = 'center';
                data.row.cells[key].styles.fontStyle = 'bold';
                data.row.cells[key].styles.fillColor = [255, 255, 0];
                data.row.cells[key].styles.textColor = [0, 0, 255];
            }
        }
        else if (data.row.index !== 0 && data.column.index === 5 && parseFloat(data.cell.raw) === 0.00) {
            for (let key in data.row.cells) {
                data.row.cells[key].styles.fillColor = [240, 240, 240];
                data.row.cells[key].styles.textColor = [0, 0, 0];
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
    let width = 120;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 60, 76, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("LEDGER", x, 90, { align: "center" });

    doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(Title, x, marginTop + 90, { align: "center" })

    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")
    var site = `${item.Sister}${item.Sector?.trim() ? ` (${item.Sector})` : ''}`;

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(site, x, marginTop + 110, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("From " + d_from + " to " + d_to, x, marginTop + 125, { align: "center" });

    const headers = [["S/N", "PARTY TITLE", "LIMIT", "DEBIT", "CREDIT", "BALANCE"]];

    // Filter and prepare ProductItems, excluding rows where balance is 0
    var ProductItems = [
        ...item.Data
            .filter(value => parseFloat(value.balance) !== 0) // Filter out rows where balance is 0
            .map((value, i) => [
                i + 1, // S/N
                value.PartyID__PartyID__Title + "\n" + value.PartyID__Address, // Party and Address
                parseFloat(value.PartyID__Limit).toLocaleString('en', {
                    useGrouping: true,
                    minimumFractionDigits: 2
                }), // Limit
                parseFloat(value.total_cr).toLocaleString('en', {
                    useGrouping: true,
                    minimumFractionDigits: 2
                }), // Total Credit
                parseFloat(value.total_dr).toLocaleString('en', {
                    useGrouping: true,
                    minimumFractionDigits: 2
                }), // Total Debit
                parseFloat(value.balance).toLocaleString('en', {
                    useGrouping: true,
                    minimumFractionDigits: 2
                }) // Balance
            ]),
    ].sort((a, b) => a[0] - b[0]); // Sort by S/N
    // Calculate the total balance
    var totalBalance = ProductItems.reduce((total, row) => {
        return total + parseFloat(row[5].replace(/,/g, '')); // Remove commas and sum
    }, 0);

    // Format the total balance and add it as a new row
    var formattedTotalBalance = totalBalance.toLocaleString('en', {
        useGrouping: true,
        minimumFractionDigits: 2
    });

    ProductItems.push(["", "TOTAL BALANCE", "", "", "", formattedTotalBalance]); // Add a new row at the end

    let options = {
        startY: 170,
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
                cellWidth: 70,
                valign: 'middle',
                halign: 'right',
            },
            3: {
                cellWidth: 75,
                valign: 'middle',
                halign: 'right',
            },
            4: {
                cellWidth: 75,
                valign: 'middle',
                halign: 'right',
            },
            5: {
                cellWidth: 80,
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
            if (data.column.index === 1 && data.cell.raw.includes("\n")) {
                var parts = data.cell.raw.split("\n");
                doc.setFontSize(8).setTextColor(105, 105, 105).setFont("helvetica", 'italic').text(parts[1], data.cell.x + 5, data.cell.y + 27);
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

    const fileName = "Ladger Date-" + moment(item.Date).format("DD MMM YYYY")

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


export const SupplierOusLedgerPrint = async (e, item, status, date_from, date_to, Title, user) => {
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
    let width = 120;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 60, 76, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("LEDGER", x, 90, { align: "center" });

    doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(Title, x, marginTop + 90, { align: "center" })

    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")
    var site = `${item.Sister}${item.Sector?.trim() ? ` (${item.Sector})` : ''}`;

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(site, x, marginTop + 110, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("From " + d_from + " to " + d_to, x, marginTop + 125, { align: "center" });

    const headers = [["S/N", "SUPPLIER TITLE", "DEBIT", "CREDIT", "BALANCE"]];

    var ProductItems = [
        ...item.Data.map((value, i) => [
            i + 1,
            value.SupplierID__SupplierTitle,
            parseFloat(value.total_dr).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            }),
            parseFloat(value.total_cr).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            }),
            parseFloat(value.balance).toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2
            })
        ]),
    ].sort((a, b) => a[0] - b[0]);
    // Calculate the total balance
    var totalBalance = ProductItems.reduce((total, row) => {
        return total + parseFloat(row[4].replace(/,/g, '')); // Remove commas and sum
    }, 0);

    // Format the total balance and add it as a new row
    var formattedTotalBalance = totalBalance.toLocaleString('en', {
        useGrouping: true,
        minimumFractionDigits: 2
    });
    ProductItems.push(["", "TOTAL BALANCE", "", "", totalBalance.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 })]); // Add a new row at the end

    let options = {
        startY: 170,
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
                cellWidth: 80,
                valign: 'middle',
                halign: 'right',
            },
            3: {
                cellWidth: 80,
                valign: 'middle',
                halign: 'right',
            },
            4: {
                cellWidth: 85,
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

    const fileName = "Cash Flow Date-" + moment(item.Date).format("DD MMM YYYY")

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
