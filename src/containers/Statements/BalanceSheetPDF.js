import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { convertImgToBase64URL } from "../../hocs/Base64Uri";
import logo from './../../assets/logo.png';
import watermark from './../../assets/watermark.png';
// import { numberToWords } from '../../hocs/Class/InWord';

export const BalanceSheetPDF = async (e, item, CurrentAssets, Assets, TotalAssets, Liability, TotalEquity, DateFrom, DateTo, user, Sister, Sector, Short) => {
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
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("BALANCE SHEET", doc.internal.pageSize.getWidth() / 2, 102, { align: "center" });
    var site = `${Sister}${Sector?.trim() ? ` (${Sector})` : ''}`;
    doc.setFontSize(13).setTextColor(51, 51, 51).setFont("helvetica", 'bold').text(site, doc.internal.pageSize.getWidth() / 2, marginTop + 100, { align: "center" })

    var F = moment(DateFrom).format("DD MMM YYYY")
    var T = moment(DateTo).format("DD MMM YYYY")
    doc.setFontSize(12).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("As at " + T, doc.internal.pageSize.getWidth() / 2, marginTop + 115, { align: "center" });

    let assetMargin = marginTop + 30
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("ASSETS", x, assetMargin + 145, { align: "center" });

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("CURRENT ASSETS", 90, assetMargin + 214);

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, assetMargin + 155, 520, assetMargin + 155);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Cash ", 300, assetMargin + 170);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.Cash).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 170, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, assetMargin + 177, 520, assetMargin + 177);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Bank ", 300, assetMargin + 192);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.Bank).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 192, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, assetMargin + 199, 520, assetMargin + 199);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Warehouse ", 300, assetMargin + 214);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat((item.Stock || 0.00).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 214, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, assetMargin + 221, 520, assetMargin + 221);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Yard Stock ", 300, assetMargin + 236);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat((item.YardStock || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 236, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, assetMargin + 243, 520, assetMargin + 243);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Receivable ", 300, assetMargin + 258);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat((item.Receivable || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 258, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, assetMargin + 265, 520, assetMargin + 265);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL CURRENT ASSETS ", 90, assetMargin + 280);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(parseFloat((CurrentAssets || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 280, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, assetMargin + 287, 520, assetMargin + 287);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("FIXED ASSETS ", 90, assetMargin + 302);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.FixedAssets || 0).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 302, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, assetMargin + 309, 520, assetMargin + 309);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL ", 90, assetMargin + 324);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(parseFloat((Assets || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 510, assetMargin + 324, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, assetMargin + 155, 295, assetMargin + 265);

    // doc.setDrawColor(97, 97, 97);
    // doc.setLineWidth(0.5);
    // doc.line(520, marginTop + 155, 520, marginTop + 287);

    // // Define the starting and ending points for the vertical line
    // var startX = 100; // X-coordinate of the starting point
    // var startY = 50;  // Y-coordinate of the starting point
    // var endY = 150;   // Y-coordinate of the ending point

    let liabilityMargin = marginTop + 80
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("LIABILITIES & EQUITY", x, liabilityMargin + 340, { align: "center" });

    // Liability
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, liabilityMargin + 350, 520, liabilityMargin + 350);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("ACCOUNT PAYABLE ", 90, liabilityMargin + 365);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.Payable || 0).toLocaleString("en", { minimumFractionDigits: 2 }), 510, liabilityMargin + 365, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, liabilityMargin + 372, 520, liabilityMargin + 372);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("Capital ", 300, liabilityMargin + 387);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.Capital || 0.00).toLocaleString("en", { minimumFractionDigits: 2 }), 510, liabilityMargin + 387, { align: "right" });

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("EQUITY", 90, liabilityMargin + 394);

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, liabilityMargin + 394, 520, liabilityMargin + 394);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("(—) Drawings ", 300, liabilityMargin + 409);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(item.Drawings || 0.00).toLocaleString("en", { minimumFractionDigits: 2 }), 510, liabilityMargin + 409, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, liabilityMargin + 414, 520, liabilityMargin + 414);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text("TOTAL EQUITY ", 90, liabilityMargin + 429);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'normal').text(parseFloat(TotalEquity || 0).toLocaleString("en", { minimumFractionDigits: 2 }), 510, liabilityMargin + 429, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(75, liabilityMargin + 436, 520, liabilityMargin + 436);
    doc.setFillColor(97, 97, 97);

    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL ", 90, liabilityMargin + 451);
    doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(parseFloat(Liability || 0).toLocaleString("en", { minimumFractionDigits: 2 }), 510, liabilityMargin + 451, { align: "right" });

    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.line(295, liabilityMargin + 372, 295, liabilityMargin + 414);

    // Total
    if (TotalAssets > 0) {
        doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL ASSETS ", 145, liabilityMargin + 550);
        doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text("(TOTAL ASSETS = TOTAL LIABILITIES + OWNERS EQUITY) ", x, liabilityMargin + 565, { align: "center" });
        doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(parseFloat((TotalAssets || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 450, liabilityMargin + 550, { align: "right" });
    } else if (TotalAssets < 0) {
        doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL LIABILITY ", 145, liabilityMargin + 550);
        doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text("(TOTAL ASSETS = TOTAL LIABILITIES + OWNERS EQUITY) ", x, liabilityMargin + 565, { align: "center" });
        doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text(parseFloat((TotalAssets || 0).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }), 450, liabilityMargin + 550, { align: "right" });
    } else if (TotalAssets === 0) {
        doc.setFontSize(13).setTextColor(0, 0, 0).setFont("helvetica", 'bold').text("TOTAL ASSETS = TOTAL LIABILITIES + OWNERS EQUITY ", x, liabilityMargin + 550, { align: "right" });
    }

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

    const fileName = "Balance Sheet Date-" + moment(item.Date).format("DD MMM YYYY")

    doc.setProperties({
        title: fileName,
        subject: 'Subscriber PDF Ladger',
        author: JSON.parse(localStorage.getItem("user")).Name,
        keywords: 'generated by DESH BESH ERP v1.00 web-version beta',
        creator: "DESH BESH ERP"
    });


    window.open(doc.output('bloburl'), { "filename": fileName });

}