import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { convertImgToBase64URL } from "../../../hocs/Base64Uri";

export const UCSPartyInvoicePDF = async (e, table, date_from, date_to, user, SectorFilter) => {
    var date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: true }).replace(/ /g, ' ')
    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode, Phone, Contact, Email },
        Role: { Title: RoleTitle, No, Scale },
        Name
    } = user;

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 40;
    const marginTop = 40;
    const doc = new jsPDF(orientation, unit, size);
    const Left = 580

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(15).setFont(undefined, 'bold').text(SectorFilter, 40, 40)
    var splitAddress = doc.splitTextToSize(Location, 360);
    doc.setFontSize(9).setTextColor(0, 0, 0).setFont(undefined, 'normal').text(splitAddress, 40, 52)

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(570, 65, 570, 25);
    doc.setFillColor(119, 136, 153);

    doc.setFontSize(15).setTextColor(0, 0, 0).setFont(undefined, 'bold').text("Under Cost Parties Sales Report", Left, 40)
    var d_from = moment(date_from).format("DD MMM YYYY")
    var d_to = moment(date_to).format("DD MMM YYYY")

    const dateRangeText = d_from !== d_to
        ? `From ${d_from} to ${d_to}`
        : `Date- ${d_to}`; // If the dates are the same, set to an empty string

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont(undefined, 'italic').text(dateRangeText, Left, 60)
    const headers = [["S/N", "DATE", "INVOICE NO", "PARTY NAME", "CODE", "PRODUCT NAME", "UNIT NAME", "UNIT QTY", "PURCHASE", "SALE"]];
    const body = table.map((item, i) => [
        (i + 1), // S/N
        moment(item.Date).format("DD-MM-YYYY"),
        item.InvoiceNo,
        item.PartyTitle,
        item.Code,
        item.Title,
        item.UnitName,
        item.UnitQty,
        parseFloat(item.UnitPrice).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        parseFloat(item.Rate).toLocaleString("en-BD", { minimumFractionDigits: 2 }),
    ]);

    let options = {
        theme: "grid",
        head: headers,
        body: body,
        startY: 75,
        headStyles: {
            valign: 'middle',
            halign: 'center',
            lineWidth: 1,
            lineColor: [128, 128, 128],
            fillColor: [211, 211, 211],
            textColor: [0, 0, 0],
            fontSize: 10
        },
        bodyStyles: {
            lineColor: [128, 128, 128],
            textColor: [0, 0, 0],
            fontSize: 9
        },
        columnStyles: {
            0: { valign: 'middle', halign: 'center' },
            1: { valign: 'middle', halign: 'center' },
            2: { valign: 'middle', halign: 'center' },
            3: { valign: 'middle', halign: 'left' },
            4: { valign: 'middle', halign: 'center' },
            5: { valign: 'middle', halign: 'left' },
            6: { valign: 'middle', halign: 'center' },
            7: { valign: 'middle', halign: 'right' },
            8: { valign: 'middle', halign: 'right' },
            9: { valign: 'middle', halign: 'right' },
        },

        didDrawPage: function (data) {
            data.settings.margin.top = 60;
            const pageCount = doc.internal.getNumberOfPages();

            if (pageCount !== 1) {
                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontSize(12).setFont(undefined, 'bold').text("Under Cost Parties Sales Report", data.settings.margin.left, 40, { align: "left" })
                doc.setFontSize(10).setTextColor(105, 105, 105).setFont(undefined, 'normal').text(dateRangeText, data.settings.margin.left, 52, { align: "left" })
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

    const pageWidthLandscape = doc.internal.pageSize.getWidth();
    const pageHeightLandscape = doc.internal.pageSize.getHeight();

    const centerX = pageWidthLandscape / 2;
    const centerY = pageHeightLandscape / 2;

    const imageWidth = 800;
    const imageHeight = 500;
    const imageX = centerX - (imageWidth / 2);
    const imageY = centerY - (imageHeight / 2);

    // Add the image to each page
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(watermarkData, 'PNG', imageX, imageY, imageWidth, imageHeight);

        // Footer line
        doc.setDrawColor(211, 211, 211);
        doc.setLineWidth(5);
        doc.setLineDash([], 0); // set the border with
        doc.line(0, pageHeight - 35, pageWidth - 0, pageHeight - 35);
        doc.setFillColor(128, 128, 128);

        doc.setPage(i);

        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text('DESH BESH ERP', 40, pageHeight - 20);
        doc.setFontSize(10).setTextColor(128, 128, 128).setFont("helvetica", 'normal').text(`Printed By ${user.Name} | ${date.toString()}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: "center" })
        doc.setFontSize(10).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text('Page ' + String(i) + ' of ' + String(pageCount), 750, pageHeight - 20);
    }

    const fileName = `Under Cost Parties Sales Report ${dateRangeText}.pdf`

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).FullName,
        keywords: 'generated by SoftaPoul v6.00 web-version beta',
        creator: "SoftaPoul"
    });

    if (e.target.id === "print") {
        doc.save("fileName");
    }
    else {
        window.open(doc.output('bloburl'), { "filename": "fileName" });
    }
}