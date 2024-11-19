import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { convertImgToBase64URL } from '../../../hocs/Base64Uri';

export const ZReadingPDF = async (e, item, user, extra) => {
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode },
        Name,
        Role: { Title: RoleTitle, No, Scale }
    } = user;

    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    var Shop = `${CollocationTitle} (${Sector})`
    if (extra.SisterFilter && extra.SectorFilter) {
        Shop = `${extra.SisterFilter?.label} (${extra.SectorFilter?.label})`;
    } else if (extra.SisterFilter) {
        Shop = extra.SisterFilter?.label;
    }

    let ReportTitle;
    if (moment(extra.FromDate).isSame(extra.ToDate, 'day')) {
        ReportTitle = "DAILY SALE REPORT (" + moment(extra.FromDate).format("DD MMM YYYY") + ") ";
    } else {
        const days = moment.duration(moment(extra.ToDate).diff(moment(extra.FromDate))).asDays();
        ReportTitle = parseInt(days) + 1 + " DAYS SALE REPORT (" + moment(extra.FromDate).format("DD MMM YYYY") + " to " + moment(extra.ToDate).format("DD MMM YYYY") + ") ";
    }

    const Counter = parseInt(extra.Counter).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 0 }) + " COUNTER";
    const Count = "INVOICE:  " + parseInt(extra.Count).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 0 });
    const COGS = "COGS:  " + parseFloat((extra.COGS).toFixed(2)).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const GrandTotal = "SALE:  " + parseFloat(extra.GrandTotal).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Vat = "VAT   " + parseFloat(extra.Vat).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Discount = "DISCOUNT:  " + parseFloat(extra.Discount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Shipping = "SHIPPING:  " + parseFloat(extra.Shipping).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Payment = "PAYMENT:  " + parseFloat(extra.Payment || 0.00).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const PaidAmount = "LIQUID:  " + parseFloat(extra.PaidAmount + extra.Payment).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Due = "DUE:  " + parseFloat(extra.Due).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const RefundAmount = "REFUND:  " + parseFloat(extra.RefundAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Bank = "E-POS:  " + parseFloat(extra.Bank).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Cash = "CASH:  " + parseFloat(extra.Cash).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Partial = "PARTIAL:  " + parseFloat(extra.Partial).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const Revenue = "REVENUE:  " + parseFloat((extra.Revenue).toFixed(2)).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 });
    const per = (parseFloat(extra.Revenue) / parseFloat(extra.GrandTotal) * 100)
    const Percentage = "REVENUE:  " + (parseFloat(per || 0.00).toFixed(2)).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) + "%";

    const alignCol = (data) => {
        var col = data.column.index;
        if (col === 0)
            data.cell.styles.halign = 'left';
        else if (col === 1)
            data.cell.styles.halign = 'right';
        if (data.row.index === 0 && data.row.raw.value && data.row.raw.Title !== "Total Invoice") {
            data.cell.colSpan = 2;
            data.cell.styles.halign = 'center';
            data.cell.styles.fontStyle = 'bold'; // set the font weight to bold
            data.cell.styles.fontSize = 11; // set the font weight to bold
            data.cell.styles.borderBottomWidth = 0; // remove top border
        } else if (data.row.index === 0 && !data.row.raw.value) {
            data.cell.colSpan = 2;
            data.cell.styles.halign = 'center';
            data.cell.styles.fontStyle = 'normal'; // set the font weight to bold
            data.cell.styles.fontSize = 9; // set the font weight to bold
            data.cell.styles.borderTopWidth = 0; // remove top border
        }
    }

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    let LastY = null;
    const marginLeft = 20;
    const marginTop = 20;
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

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(CollocationTitle.toUpperCase(), marginLeft + 94, marginTop + 15)
    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Location, marginLeft + 94, marginTop + 28)
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(Shop, marginLeft + 94, marginTop + 40)

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(1);
    doc.line(marginLeft, 110, 570, 110);
    doc.setFillColor(119, 136, 153);

    const ReportDescription = "* The counters range in " + extra.SearchKey.min + " to " + extra.SearchKey.max + " & report in " + extra.ModeFilter.label + " mode."
    // doc.setFillColor(255, 255, 255).rect(x - 40, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(ReportTitle, doc.internal.pageSize.getWidth() / 2, 88, { align: "center" });
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(ReportDescription, doc.internal.pageSize.getWidth() / 2, 103, { align: "center" });

    doc.setFontSize(12).setTextColor(119, 136, 153).setFont('helvetica', 'bold').text("R   E   P   O   R   T           F   A   C   T", doc.internal.pageSize.getWidth() / 2, 125, { align: "center" })

    let tableBody = [
        [Counter, Count, GrandTotal],
        [Discount, RefundAmount, Due],
        [Cash, Bank, Partial],
        [Payment, '', PaidAmount],
    ];

    if (No === 1 && Scale === 1) {
        tableBody.push([COGS, Revenue, Percentage]);
    }

    doc.autoTable({
        startY: 135,
        margin: {
            top: 60
        },
        theme: 'grid',
        styles: {
            lineWidth: 1.5, // Set the border width to a thicker value
            lineColor: [220, 220, 220], // Set the border color to black
        },
        bodyStyles: {
            // lineColor: [220, 220, 220],
            fontSize: 11,
            fontWeight: 'bold',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            // lineWidth: 0.5,
            fontStyle: 'helvetica'
        },
        body: tableBody,
        drawCell: function (cell, data) {
            if (data.column.dataKey === 0) {
                cell.content = {
                    html: cell.raw
                };
            }
        }
    })
    LastY = doc.lastAutoTable.finalY + 25;

    let INV_ProductItems = item.map((row) => {
        if (row.grouped_sales.Count) {
            let rows = [
                [{ Title: "COUNTER NO - " + row.No, value: row.No }],
                [
                    { Title: "Total Invoice", value: parseFloat(row.grouped_sales.Count).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 0 }) },
                    { Title: "Sale Total", value: parseFloat(row.grouped_sales.GrandTotal).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Refund", value: parseFloat(row.grouped_sales.RefundAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Discount", value: parseFloat(row.grouped_sales.Discount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Cash", value: parseFloat(row.grouped_sales.Cash).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "E-POS", value: parseFloat(row.grouped_sales.Bank).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Payment", value: parseFloat(row.grouped_sales.Payment || 0).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Liquid", value: parseFloat(row.grouped_sales.PaidAmount).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                ],
            ];
            if (extra.ModeFilter.value !== 1) {
                rows[1].splice(2, 0, { Title: "Due", value: parseFloat(row.grouped_sales.Due).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) });
            }
            if (No === 1 && Scale === 1) {
                rows[1].unshift({ Title: row.ShortCode + " (" + row.SectorTitle + ")", value: 0 });
                rows[1].push(
                    { Title: "COGS", value: parseFloat(row.grouped_sales.COGS).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) },
                    { Title: "Revenue", value: parseFloat((parseFloat(row.grouped_sales.GrandTotal) - parseFloat(row.grouped_sales.RefundAmount)) - (parseFloat(row.grouped_sales.COGS) + parseFloat(row.grouped_sales.Discount))).toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 }) }
                );
            }
            return rows;
        } else {
            return [[{ Title: "COUNTER NO - " + row.No, value: row.No }], [{ Title: "No Activity", value: "" }]];
        }
    });

    // Move the "No Activity" rows to the front, then sort by row.No
    INV_ProductItems.sort((a, b) => {
        if (a[1][0].Title === "No Activity" && b[1][0].Title !== "No Activity") {
            return 1;
        } else if (a[1][0].Title !== "No Activity" && b[1][0].Title === "No Activity") {
            return -1;
        } else {
            return a[0][0].value - b[0][0].value;
        }
    });

    let pageCount;
    let xPos1 = 40;
    let xPos2 = doc.internal.pageSize.width / 3 + 20;
    let xPos3 = doc.internal.pageSize.width / 3 * 2;
    let yPos = 256;
    let tableWidth = (doc.internal.pageSize.width - 150) / 3;
    let tableHeight = 240;
    let tableCount = 0; // keep track of the number of tables created
    let pageNumber = 0; // keep track of the current page number

    INV_ProductItems.forEach((row, index) => {
        let xPos;
        if (index % 3 === 0) {
            xPos = xPos1;
        } else if (index % 3 === 1) {
            xPos = xPos2;
        } else {
            xPos = xPos3;
        }

        let tableIndexOnPage = index - pageNumber * 6;
        let tableYPos = yPos + Math.floor(tableIndexOnPage / 3) * (tableHeight + doc.internal.getFontSize());

        if (tableCount % 6 === 0 && tableCount !== 0) { // add a page break after every 6 tables, except for the first page
            doc.addPage();
            pageNumber++;
            tableYPos = 60;
            yPos = 60;
        }

        let options = {
            head: row[0],
            body: row[1],
            startY: tableYPos,
            theme: "grid",
            margin: { left: xPos },
            tableWidth: tableWidth,

            bodyStyles: {
                lineColor: [26, 189, 156],
                textColor: [0, 0, 0],
                fontStyle: "normal",
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                valign: 'middle',
                halign: 'center',
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.1,
                lineColor: [128, 128, 128]
            },

            didParseCell: function (cell, data) {
                alignCol(cell, data);
                if (cell && cell.styles) {
                    cell.styles.cellHeight = 5;
                }
            },
        };

        doc.autoTable(options);
        tableCount++;
        pageCount = doc.internal.getNumberOfPages()
    });

    pageCount = doc.internal.getNumberOfPages()
    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        if (i !== 1) {
            // Header
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontSize(12).setFont("helvetica", 'bold').text(Shop, 40, 40, { align: "left" })
            doc.setFontSize(10).setTextColor(105, 105, 105).setFont("helvetica", 'normal').text(Location, 40, 50, { align: "left" })
        }
        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text(date.toString(), doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 500, pageHeight - 20);

        doc.addImage(watermarkData, 'PNG', 80, 300);
        if (i === pageCount) {
            // Asstant Manager
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(40, pageHeight - 80, doc.internal.pageSize.getWidth() / 4, pageHeight - 80);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Asst. Manager", 55, pageHeight - 70, { align: "left" })

            // Checked by
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(190, pageHeight - 80, 320, pageHeight - 80);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Manager", 260, pageHeight - 70, { align: "center" })

            // Authority
            doc.setDrawColor(97, 97, 97);
            doc.setLineWidth(0.5);
            doc.setLineDash([1, 1], 0);
            doc.line(550, pageHeight - 80, doc.internal.pageSize.getWidth() - 165, pageHeight - 80);
            doc.setFillColor(97, 97, 97);
            doc.setFontSize(11).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("Authority", doc.internal.pageSize.getWidth() - 100, pageHeight - 70, { align: "center" })
        }
    }

    doc.setProperties({
        title: ReportTitle,
        subject: 'Sale Report',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "Deshbesh ERP"
    });

    window.open(doc.output('bloburl'), { "filename": ReportTitle });

    var oHiddFrame = document.createElement("iframe");
    oHiddFrame.style.position = "fixed";
    oHiddFrame.style.visibility = "hidden";
    oHiddFrame.src = doc.output('bloburl');
    document.body.appendChild(oHiddFrame);
}