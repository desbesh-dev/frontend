import axios from 'axios';
import moment from 'moment';

export const PackageList = [
    { label: "Ctn", value: 1 },
    { label: "1/2 Ctn", value: 2 },
    { label: "12 Pack", value: 3 },
    { label: "10 Pack", value: 4 },
    { label: "8 Pack", value: 5 },
    { label: "6 Pack", value: 6 },
    { label: "4 Pack", value: 7 },
    { label: "Pack 1", value: 8 },
    { label: "Pack 2", value: 9 },
    { label: "Loose", value: 10 },
]

export const PaymentTerms = [
    { label: "PIA (Payment in advance)", short: "PIA", value: 1 },
    { label: "CBS (Cash before shipment)", short: "CBS", value: 2 },
    { label: "CIA (Cash in advance)", short: "CIA", value: 3 },
    { label: "CWO (Cash on order)", short: "CWO", value: 4 },
    { label: "Net 7 (After 7 days of invoice date)", short: "Net 7", value: 5 },
    { label: "Net 10 (After 10 days of invoice date)", short: "Net 10", value: 6 },
    { label: "Net 30 (After 30 days of invoice date)", short: "Net 30", value: 7 },
    { label: "Net 60 (After 60 days of invoice date)", short: "Net 60", value: 8 },
    { label: "Net 90 (After 90 days of invoice date)", short: "Net 90", value: 9 },
    { label: "EOM (End of month)", short: "EOM", value: 10 },
    { label: "21 MFI (Month following invoice)", short: "21 MFI", value: 11 },
    { label: "COD (Cash on delivery)", short: "COD", value: 12 },
    { label: "CND (Cash next delivery)", short: "CND", value: 13 },
    { label: "Paid in cash", short: "Cash", value: 14 },
    { label: "Paid in bank", short: "Bank", value: 15 },
    { label: "Paid in cheque", short: "Cheque", value: 16 },
    { label: "Paid in online", short: "Online", value: 17 },
    { label: "Paid in visa/debit/credit", short: "Card", value: 18 },
    { label: "Partial", short: "Partial", value: 19 }
]

export const FetchPurchaseNo = async (InvoiceType, sector) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_purchase_no/${InvoiceType}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchProductRequestNo = async (InvoiceType) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_product_request_no/${InvoiceType}`, config);

        return res.data
    } catch (err) {

        return true;
    }
}

export const MyStock = async (page, page_size) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: { page: page, page_size: page_size }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_stock_list/`, config);
        return res
    } catch (err) {
        return true;
    }
};

export const AllMyProductList = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_product_list/`, config);

        return res
    } catch (err) {
        return true;
    }
}

const getInvNo = () => {
    var d = new window.Date();
    if (JSON.parse(localStorage.getItem("user"))) {
        var components = [
            JSON.parse(localStorage.getItem("user")).CompanyID,
            JSON.parse(localStorage.getItem("user")).BranchID,
            d.getYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
            String(d.getMilliseconds()).toString().substr(-1)
        ];
        var id = components.join("");
        return id
    } else {
        return false
    }
}


export const UpdateStock = async (id, Qty, Weight, Cost, MinRequired, InitStock, Status) => {
    if (getInvNo()) {


        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        const formData = new FormData();
        formData.append("Qty", Qty);
        formData.append("Weight", Weight);
        formData.append("Cost", Cost);
        formData.append("MinRequired", MinRequired);
        formData.append("InitStock", InitStock);
        formData.append("Status", Status);

        try {
            for (var pair of formData.entries()) {

            }
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/my_stock/${id}/`, formData, config);

            return res.data
        } catch (err) {
            return true;
        }
    }
}

export const DeleteStock = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/my_stock/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const Purchase = async (CompanyID, BranchID, SupplierID, InvoiceNo, OrderNo, Date, Receiver, Payment, VatRate, Vat, Discount, Total, Count, PurchaseData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("CompanyID", CompanyID);
    formData.append("BranchID", BranchID);
    formData.append("SupplierID", SupplierID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Date", Date);
    formData.append("Receiver", Receiver);
    formData.append("Payment", Payment);
    formData.append("VatRate", VatRate);
    formData.append("Vat", Vat);
    formData.append("Discount", Discount);
    formData.append("GrandTotal", Total);
    formData.append("ItemCount", Count);

    Object.keys(PurchaseData).map(e => {
        formData.append(`PurchaseMapData[${e}]CompanyID`, CompanyID);
        formData.append(`PurchaseMapData[${e}]BranchID`, BranchID);
        formData.append(`PurchaseMapData[${e}]OrderNo`, OrderNo);
        formData.append(`PurchaseMapData[${e}]InvoiceNo`, InvoiceNo);
        formData.append(`PurchaseMapData[${e}]ReceiverID`, Receiver);
        formData.append(`PurchaseMapData[${e}]ItemCode`, PurchaseData[e].ItemCode);
        formData.append(`PurchaseMapData[${e}]Weight`, PurchaseData[e].Weight);

        formData.append(`PurchaseMapData[${e}]Qty`, PurchaseData[e].Quantity);
        formData.append(`PurchaseMapData[${e}]Rate`, PurchaseData[e].UnitPrice);
        // formData.append(`PurchaseMapData[${e}]SubTotal`, PurchaseData[e].ReceiverID);
        formData.append(`PurchaseMapData[${e}]Status`, "Received");
        formData.append(`PurchaseMapData[${e}]MFG`, PurchaseData[e].MFG);
        formData.append(`PurchaseMapData[${e}]EXP`, PurchaseData[e].EXP);
        formData.append(`PurchaseMapData[${e}]UpdatedBy`, Receiver);
    }
    );


    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/purchase/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchSubscriberList = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/business/`, config);

        return res.data
    } catch (err) {

        return true;
    }
}


export const FetchSubscriber = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_subscriber/${id}`, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const RequestOrder = async (RequestTo, RequestNo, data, DeliveryDate, Amount, Status, RequestData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("RequestTo", RequestTo);
    formData.append("Date", data);
    formData.append("DeliveryDate", DeliveryDate);
    formData.append("RequestNo", RequestNo);
    formData.append("Amount", Amount);
    formData.append("Status", Status);

    Object.keys(RequestData).map(e => {
        formData.append(`RequestMapData[${e}]ItemCode`, RequestData[e].ItemCode);
        formData.append(`RequestMapData[${e}]OrderQty`, RequestData[e].Quantity);
        formData.append(`RequestMapData[${e}]UnitPrice`, RequestData[e].UnitPrice);
        formData.append(`RequestMapData[${e}]SubTotal`, RequestData[e].SubTotal);
        formData.append(`RequestMapData[${e}]ReceivedQty`, "");
        formData.append(`RequestMapData[${e}]Status`, 0);
    });


    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product_request/`, formData, config);

        return res.data
    } catch (err) {


        return true;
    }
}


export const DeliverProduct = async (RequestID, DeliveryDate, Amount, RequestData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("RequestNo", RequestID);
    formData.append("DeliveryDate", DeliveryDate);
    formData.append("Amount", Amount);
    formData.append("Status", 2);

    Object.keys(RequestData).map(e => {
        formData.append(`RequestMapData[${e}]id`, RequestData[e].id);
        formData.append(`RequestMapData[${e}]ItemCode`, RequestData[e].ItemCode);
        formData.append(`RequestMapData[${e}]OrderQty`, RequestData[e].Quantity);
        formData.append(`RequestMapData[${e}]UnitPrice`, RequestData[e].UnitPrice);
        formData.append(`RequestMapData[${e}]SubTotal`, RequestData[e].SubTotal);
        formData.append(`RequestMapData[${e}]ReceivedQty`, RequestData[e].ReceivedQty);
        formData.append(`RequestMapData[${e}]Status`, 1);
    });


    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/product_request/${RequestID}/`, formData, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const FetchProductRequest = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product_request/`, config);

        return res.data
    } catch (err) {

        return true;
    }
}

export const FetchDraft = async (Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/req_draft/${Status}`, config);

        return res.data
    } catch (err) {

        return true;
    }
}

export const FetchDraftRequest = async (ReqNo) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_draft/${ReqNo}`, config);

        return res.data
    } catch (err) {

        return true;
    }
}


export const SaveDraftItem = async (RequestID, ItemCode, Quantity, UnitPrice, SubTotal, Status) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("RequestNo", RequestID);
    formData.append("ItemCode", ItemCode);
    formData.append("OrderQty", Quantity);
    formData.append("UnitPrice", UnitPrice);
    formData.append("SubTotal", SubTotal);
    formData.append("Status", Status);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/draft_item/`, formData, config);

        return res.data
    } catch (err) {
        return true
    }
}


export const DeleteDraftItem = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/draft_item/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const SendDraftRequest = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("Status", 1);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/draft_item/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchOrderNo = async (InvoiceType) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_order_no/${InvoiceType}`, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const ProductInit = async (SectorID, id, UnitPrice, Quantity, Weight, MinRequired, Status) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID);
    formData.append("ItemID", id);
    formData.append("InitStock", Quantity);
    formData.append("LastReceived", Quantity);
    formData.append("MinRequired", MinRequired);
    formData.append("Weight", Weight);
    formData.append("Qty", Quantity);
    formData.append("Cost", UnitPrice);
    formData.append("Status", Status);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/init_product/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}


export const FetchBarcode = async (item, barcode, qty) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/barcode/${item}/${barcode}/${qty}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchProduct = async (code) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_product/${code}`, config);
        return res.data
    } catch (err) {
        return false;
    }
}

export const FetchAnyProduct = async (code) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_any_product/${code}`, config);
        return res.data
    } catch (err) {
        return false;
    }
}

export const FetchProductYard = async (code, sect_id, sect_to, ctr_no) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_product_yard/${code}/${sect_id}/${sect_to}/${ctr_no}`, config);
        return res.data
    } catch (err) {
        return false;
    }
}

export const FetchProductDetails = async (code) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_product_details/${null}/${code}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const FetchPartyData = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_party_data/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const DeliveryOrder = async (CounterID, PartyID, Date, OrderDate, DeliveryDate, VatRate, Vat, Discount, Shipment, Payment, GrandTotal, Bank, Cash, PaidAmount, Due, RefundAmount, Count, OrderData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    let formData = new FormData();
    formData.append("CounterID", CounterID);
    formData.append("PartyID", PartyID);
    formData.append("Date", Date);
    formData.append("OrderDate", OrderDate);
    formData.append("DeliveryDate", DeliveryDate);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("Shipping", parseFloat(Shipment).toFixed(2));
    formData.append("Payment", parseInt(Payment.value));
    formData.append("GrandTotal", parseFloat(GrandTotal).toFixed(2));
    formData.append("Bank", parseFloat(Bank || 0).toFixed(2));
    formData.append("Cash", parseFloat(Cash || 0).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount || 0).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));
    formData.append("RefundAmount", parseFloat(RefundAmount).toFixed(2));
    formData.append("ItemCount", Count);
    formData.append("Status", 1);

    for (let i = 0; i < OrderData.length; i++) {
        const sell = OrderData[i];
        formData.append(`OrderMapData[${i}]SLNo`, sell.SLNo);
        formData.append(`OrderMapData[${i}]ItemID`, sell.ItemID);
        formData.append(`OrderMapData[${i}]UnitName`, sell.UnitName);
        formData.append(`OrderMapData[${i}]UnitQty`, parseFloat(sell.UnitQty).toFixed(2));
        formData.append(`OrderMapData[${i}]UnitWeight`, parseFloat(sell.UnitWeight).toFixed(3));
        formData.append(`OrderMapData[${i}]UnitPrice`, parseFloat(sell.UnitPrice).toFixed(2));
        formData.append(`OrderMapData[${i}]Weight`, parseFloat(sell.Weight).toFixed(3));
        formData.append(`OrderMapData[${i}]Qty`, parseFloat(sell.Quantity).toFixed(2));
        formData.append(`OrderMapData[${i}]Rate`, parseFloat(sell.Rate).toFixed(4));
        formData.append(`OrderMapData[${i}]Remark`, sell.Remark);
        formData.append(`OrderMapData[${i}]SubTotal`, parseFloat(sell.SubTotal).toFixed(2));
        formData.append(`OrderMapData[${i}]Available`, parseFloat(sell.Available).toFixed(2));
        formData.append(`OrderMapData[${i}]Status`, 1);
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/delivery_order/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const ReturnSellItem = async (InvoiceNo, ItemID, SLNo, Code, UnitName, UnitQty, UnitWeight, UnitPrice, Weight, Qty, Rate, SubTotal, Remark) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("ItemID", ItemID);
    formData.append("SLNo", SLNo);
    formData.append("Code", Code);
    formData.append("UnitName", UnitName);
    formData.append("UnitQty", parseFloat(UnitQty).toFixed(2));
    formData.append("UnitWeight", parseFloat(UnitWeight).toFixed(3));
    formData.append("UnitPrice", parseFloat(UnitPrice).toFixed(2));
    formData.append("Weight", parseFloat(Weight).toFixed(3));
    formData.append("Qty", parseFloat(Qty).toFixed(2));
    formData.append("Rate", parseFloat(Rate).toFixed(2));
    formData.append("SubTotal", parseFloat(SubTotal).toFixed(2));
    formData.append("Remark", Remark);
    for (var pair of formData.entries()) {

    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/return_sell_product/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const RtnSellItemDelete = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/return_sell_product/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const ReturnPursItem = async (PurchaseNo, ItemID, SLNo, Code, UnitName, UnitQty, UnitWeight, Weight, Qty, Rate, SubTotal, Remark) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("PurchaseNo", PurchaseNo);
    formData.append("ItemID", ItemID);
    formData.append("SLNo", SLNo);
    formData.append("Code", Code);
    formData.append("UnitName", UnitName);
    formData.append("UnitQty", parseFloat(UnitQty).toFixed(2));
    formData.append("UnitWeight", parseFloat(UnitWeight).toFixed(3));
    formData.append("Weight", parseFloat(Weight).toFixed(3));
    formData.append("Qty", parseFloat(Qty).toFixed(2));
    formData.append("Rate", parseFloat(Rate).toFixed(2));
    formData.append("SubTotal", parseFloat(SubTotal).toFixed(2));
    formData.append("Remark", Remark);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/return_purs_product/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const RtnPursItemDelete = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/return_purs_product/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const TraceStock = async (SectorID, id, date) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stock_trace/${SectorID}/${id}/${date}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchProductInit = async (code, SectorID) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_product_init/${code}/${SectorID}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const MyProductList = async (currentPage, sector) => {
    const page = currentPage || 1;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sell_product_list/${page}/${sector}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const AllProductList = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/all_product_list/`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const CreateQuote = async (PartyID, Name, Address, Date, VatRate, Vat, Discount, Shipment, GrandTotal, PaidAmount, Due, RefundAmount, Count, QuoteData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    let formData = new FormData();
    formData.append("PartyID", PartyID && PartyID.value ? PartyID.value : '');
    formData.append("Name", Name);
    formData.append("Address", Address);
    formData.append("Date", Date);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("Shipping", parseFloat(Shipment).toFixed(2));
    formData.append("GrandTotal", parseFloat(GrandTotal).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));
    formData.append("RefundAmount", parseFloat(RefundAmount).toFixed(2));
    formData.append("ItemCount", Count);
    formData.append("Status", 1);

    for (let i = 0; i < QuoteData.length; i++) {
        const sell = QuoteData[i];
        formData.append(`QuoteMapData[${i}]SLNo`, sell.SLNo);
        formData.append(`QuoteMapData[${i}]ItemID`, sell.ItemID);
        formData.append(`QuoteMapData[${i}]UnitName`, sell.UnitName);
        formData.append(`QuoteMapData[${i}]UnitQty`, parseFloat(sell.UnitQty).toFixed(2));
        formData.append(`QuoteMapData[${i}]UnitWeight`, parseFloat(sell.UnitWeight).toFixed(3));
        formData.append(`QuoteMapData[${i}]UnitPrice`, parseFloat(sell.UnitPrice).toFixed(2));
        formData.append(`QuoteMapData[${i}]Weight`, parseFloat(sell.Weight).toFixed(3));
        formData.append(`QuoteMapData[${i}]Qty`, parseFloat(sell.Qty).toFixed(2));
        formData.append(`QuoteMapData[${i}]Rate`, parseFloat(sell.Rate).toFixed(4));
        formData.append(`QuoteMapData[${i}]Remark`, sell.Remark);
        formData.append(`QuoteMapData[${i}]SubTotal`, parseFloat(sell.SubTotal).toFixed(2));
        formData.append(`QuoteMapData[${i}]Available`, parseFloat(sell.Available).toFixed(2));
        formData.append(`QuoteMapData[${i}]Status`, 1);
    }
    for (var pair of formData.entries()) {

    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/quote/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const DeleteQuote = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/quote/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const CreatePO = async (SupplierID, Date, Count, PursOrderMapData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    let formData = new FormData();
    formData.append("SupplierID", SupplierID && SupplierID.value ? SupplierID.value : '');
    formData.append("Date", Date);
    formData.append("ItemCount", Count);
    formData.append("Status", 1);

    for (let i = 0; i < PursOrderMapData.length; i++) {
        const sell = PursOrderMapData[i];
        formData.append(`PursOrderMapData[${i}]SLNo`, sell.SLNo);
        formData.append(`PursOrderMapData[${i}]ItemID`, sell.ItemID);
        formData.append(`PursOrderMapData[${i}]UnitName`, sell.UnitName);
        formData.append(`PursOrderMapData[${i}]UnitQty`, parseFloat(sell.UnitQty).toFixed(2));
        formData.append(`PursOrderMapData[${i}]Weight`, parseFloat(sell.Weight).toFixed(3));
        formData.append(`PursOrderMapData[${i}]Qty`, parseFloat(sell.Qty).toFixed(2));
        formData.append(`PursOrderMapData[${i}]Status`, 1);
    }
    for (var pair of formData.entries()) {

    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/purs_order/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const DeletePursOrder = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/purs_order/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const ReqProductList = async (currentPage, sector, sect_to) => {
    const page = currentPage || 1;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/req_product_list/${page}/${sector}/${sect_to}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const UpdateInvoiceNo = async (id, InvoiceNo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("InvoiceNo", InvoiceNo);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/purchase/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const StockProductList = async (currentPage, itemsPerPage, SectorFilter, Category, SearchKey) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        params: {
            page: 1,
            page_size: 5000,
            sector: SectorFilter?.value,
            category: Category?.label,
            code: SearchKey?.value,
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_stock_list/`, config);
        return res
    } catch (err) {
        return true;
    }
}


export const FetchProductAnalysis = async (id, DateFrom, DateTo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product_item_analysis/${id}/${DateFrom}/${DateTo}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchSalePerformance = async (type, sect_id, DateFrom, DateTo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sale_performance_report/${type}/${sect_id}/${DateFrom}/${DateTo}`, config);
        return res
    } catch (err) {
        return true;
    }
}


export const FetchOrderedItemPDF = async (itemsPerPage, DateFrom, DateTo, SectorFilter, searchKey) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: {
            page: 1,
            page_size: itemsPerPage,
            date_from: moment(DateFrom).format("YYYY-MM-DD"),
            date_to: moment(DateTo).format("YYYY-MM-DD"),
            sect_id: SectorFilter?.value,
            code: searchKey?.value,
            print_mode: true
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ordered_items_list/`, config);
        return res;
    } catch (err) {
        return true;
    }
}


export const FetchSoldOutItemPDF = async (itemsPerPage, DateTo, SectorFilter, searchKey) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: {
            page: 1,
            page_size: itemsPerPage,
            date_to: moment(DateTo).format("YYYY-MM-DD"),
            sect_id: SectorFilter?.value,
            code: searchKey?.value,
            print_mode: true
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sold_items_list/`, config);
        return res;
    } catch (err) {
        return true;
    }
}


export const FetchUCSReportPDF = async (itemsPerPage, DateTo, SectorFilter, searchKey) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: {
            page: 1,
            page_size: itemsPerPage,
            date_to: moment(DateTo).format("YYYY-MM-DD"),
            sect_id: SectorFilter?.value,
            code: searchKey?.value,
            print_mode: true
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ucs_reports/`, config);
        return res;
    } catch (err) {
        return true;
    }
}

export const FetchUCSPartyInvoicePDF = async (currentPage, itemsPerPage, DateFrom, DateTo, SectorFilter, searchKey) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: {
            page: currentPage,
            page_size: itemsPerPage,
            date_from: moment(DateFrom).format("YYYY-MM-DD"),
            date_to: moment(DateTo).format("YYYY-MM-DD"),
            sect_id: SectorFilter?.value,
            code: searchKey?.value,
            print_mode: 0
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ucs_party_invoices/`, config);
        return res;
    } catch (err) {
        return true;
    }
}


export const FetchPurchaseReport = async (itemsPerPage, DateFrom, DateTo, SisterFilter, SectorFilter, PayTypeFilter, searchKey, PrintMode) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params: {
            page: 1,
            page_size: itemsPerPage,
            date_from: DateFrom,
            date_to: DateTo,
            sis_id: SisterFilter?.value,
            sect_id: SectorFilter?.value,
            pay_type: PayTypeFilter?.value,
            no: searchKey?.value,
            print_mode: PrintMode
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchase_report/`, config);
        return res;
    } catch (err) {
        return true;
    }
}