import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../assets/logo.png';
import watermark from '../../../assets/watermark.png';
import { convertImgToBase64URL } from '../../../hocs/Base64Uri';
import { inWords } from '../../../hocs/NumberToWord';

export const MoneyReciptPDF = async (item, data, user) => {
    const {
        Collocation: { Title: CollocationTitle, Sector, Location, ShortCode, Contact, Phone, Fax, Email, Web, Whatsapp, Imo, Wechat },
        Name,
        Role: { Title: RoleTitle, No, Scale }
    } = user;

    const imgData = await convertImgToBase64URL(logo)
    const watermarkData = await convertImgToBase64URL(watermark)

    const ReceiptNo = "Receipt No: " + item.VoucherNo
    const ReceiptDate = "Reecipt Date: " + moment(item.Date).format("DD MMM YYYY")
    const ReceivedFrom = "Received From: " + item.PartyTitle
    const Address = "Address: " + item.PartyAddress

    const InvoiceNo = "Payment of Invoice: " + data.InvoiceNo
    const InvoiceDate = "Invoice Date: " + moment(data.Date).format("DD MMM YYYY")
    const Amount = "Amount: " + parseFloat(item.DR).toLocaleString("en-BD", { minimumFractionDigits: 2 })
    const PayType = `Payment Type: ${item.PaymentMethod || "N/A"}`;

    const amountInWords = inWords(parseFloat(item.DR));

    const unit = "pt";
    const orientation = "portrait"; // portrait or landscape
    const size = 'A4';
    const doc = new jsPDF(orientation, unit, size);
    const marginLeft = 20;
    const marginTop = 20;

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
    var Words = doc.splitTextToSize(amountInWords, 600); //Text wrap after char

    doc.addImage(imgData, 'JPEG', marginLeft + 30, marginTop, 60, 50);
    doc.setFontSize(20).setTextColor(40, 40, 40).setFont("helvetica", 'bold').text(CollocationTitle.toUpperCase(), marginLeft + 94, marginTop + 15)

    doc.setFontSize(12).setTextColor(51, 51, 51).setFont("helvetica", 'normal').text(Location, marginLeft + 94, marginTop + 28)
    const contact = [
        Phone && `Phone: ${Phone}`,
        Contact && `Contact: ${Contact}`,
        Fax && `Fax: ${Fax}`,
        Whatsapp && `Whatsapp: ${Whatsapp}`,
        Imo && `Imo: ${Imo}`,
        Wechat && `Wechat: ${Wechat}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text(contact, marginLeft + 94, marginTop + 38)

    const online_contact = [
        Email && `Email: ${Email}`,
        Web && `Website: ${Web}`
    ].filter(Boolean).join(", ") || "";
    doc.setFontSize(10).setTextColor(51, 51, 51).setFont("courier", 'normal').text(online_contact, marginLeft + 94, marginTop + 48)

    doc.setDrawColor(128, 128, 128);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 90, 570, 90);
    doc.setFillColor(128, 128, 128);

    doc.addImage(watermarkData, 'PNG', 80, 0);

    let x = doc.internal.pageSize.getWidth() / 2;
    let width = 150;
    let height = 20;

    doc.setFillColor(255, 255, 255).rect(x - 75, 88, width, height, 'F');
    doc.setFontSize(16).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("MONEY RECEIPT", doc.internal.pageSize.getWidth() / 2, 96, { align: "center" });

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(300, 170, 300, 102);
    doc.setFillColor(119, 136, 153);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(ReceiptNo, marginLeft, 120)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(InvoiceNo, marginLeft + 300, 120)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(ReceiptDate, marginLeft, 135)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(InvoiceDate, marginLeft + 300, 135)

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(ReceivedFrom, marginLeft, 150)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text(PayType, marginLeft + 300, 150)

    var party_address = Address.substring(0, 60) + (Address.length < 60 ? "" : "...");
    party_address = doc.splitTextToSize(party_address, 380);

    doc.setFontSize(9).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(party_address, marginLeft, 165)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text(Amount, marginLeft + 300, 165)

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 175, 570, 175);
    doc.setFillColor(119, 136, 153);

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Amount (In Word): ", marginLeft, 188)
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(Words, marginLeft + 100, 188)

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 195, 570, 195);
    doc.setFillColor(119, 136, 153);


    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(moment(item.UpdatedAt).format("hh:mm:ss A"), 80, 230, { align: "center" })
    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'normal').text(moment(item.UpdatedAt).format("DD MMMM YYYY"), 80, 245, { align: "center" })

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(198.42, 260, 198.42, 210);
    doc.setFillColor(119, 136, 153);

    doc.setFontSize(20).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text('PAID', doc.internal.pageSize.getWidth() / 2, 240, { align: "center" });

    doc.setDrawColor(119, 136, 153);
    doc.setLineWidth(0.5);
    doc.line(396.85, 260, 396.85, 210);
    doc.setFillColor(119, 136, 153);

    // Authority
    doc.setDrawColor(97, 97, 97);
    doc.setLineWidth(0.5);
    doc.setLineDash([1, 1], 0);
    doc.line(550, 240, doc.internal.pageSize.getWidth() - 165, 240);
    doc.setFillColor(97, 97, 97);
    doc.setLineDash([0]); // reset line dash

    doc.setFontSize(11).setTextColor(0, 0, 0).setFont('helvetica', 'bold').text("Authorized Singnature", 490, 255, { align: "center" })

    const ReceiptTitle = "Money Receipt " + ReceiptNo
    doc.setProperties({
        title: ReceiptTitle,
        subject: 'Sale Report',
        author: item.UpdatedBy,
        keywords: 'generated, javascript, web 2.0, ajax',
        creator: "Deshbesh ERP"
    });

    window.open(doc.output('bloburl'), { "filename": ReceiptTitle });

    var oHiddFrame = document.createElement("iframe");
    oHiddFrame.style.position = "fixed";
    oHiddFrame.style.visibility = "hidden";
    oHiddFrame.src = doc.output('bloburl');
    document.body.appendChild(oHiddFrame);
}