import axios from "axios";

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

export const ContainerIssue = async (SectorID, Date, SupplierID, DocketNo, CtrNo, InvoiceNo, OrderNo, CarNo, DriverName, From, PushDate, Status, SealStatus, Reserve, Remark) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID.value);
    formData.append("Date", Date);
    formData.append("SupplierID", SupplierID.value);
    formData.append("DocketNo", DocketNo);
    formData.append("ContainerNo", CtrNo);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("OrderNo", OrderNo);
    formData.append("CarNo", CarNo);
    formData.append("DriverName", DriverName);
    formData.append("From", From);
    formData.append("PushDate", PushDate);
    formData.append("Status", Status);
    formData.append("SealStatus", SealStatus);
    formData.append("Reserve", Reserve);
    formData.append("Remark", Remark);
    try {
        for (var pair of formData.entries()) {
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ctr_issuance/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}


export const ContainerUpdate = async (id, SectorID, Date, SupplierID, DocketNo, CtrNo, InvoiceNo, OrderNo, CarNo, DriverName, From, PushDate, Status, SealStatus, Reserve, Remark) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID.value);
    formData.append("Date", Date);
    formData.append("SupplierID", SupplierID.value);
    formData.append("DocketNo", DocketNo);
    formData.append("ContainerNo", CtrNo);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("OrderNo", OrderNo);
    formData.append("CarNo", CarNo);
    formData.append("DriverName", DriverName);
    formData.append("From", From);
    formData.append("PushDate", PushDate);
    formData.append("Status", Status);
    formData.append("SealStatus", SealStatus);
    formData.append("Reserve", Reserve);
    formData.append("Remark", Remark);
    try {
        for (var pair of formData.entries()) {
        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/ctr_issuance/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}


export const ContainerPush = async (id, PushID, PushDate, CarNo, DriverName, PickupBy) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("PushID", PushID);
    formData.append("Date", PushDate);
    formData.append("CarNo", CarNo);
    formData.append("DriverName", DriverName);
    formData.append("PickupBy", PickupBy);
    formData.append("Status", 2);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ctr_push_back/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const FetchCtrPursInvoice = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_ctr_purs_invoice/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const DelRequest = async (SectorID, RequestToID, RequestForID, Date, DeliveryDate, VatRate, Vat, Discount, Shipment, Payment, GrandTotal, PaidAmount, Due, RefundAmount, Count, OrderData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    let formData = new FormData();
    formData.append("RequestedID", SectorID);
    formData.append("RequestToID", RequestToID && RequestToID.value);
    formData.append("RequestForID", RequestForID && RequestForID.value);
    formData.append("Date", Date);
    formData.append("DeliveryDate", DeliveryDate);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("Shipping", parseFloat(Shipment).toFixed(2));
    formData.append("Payment", parseInt(Payment.value));
    formData.append("GrandTotal", parseFloat(GrandTotal).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount).toFixed(2));
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
        formData.append(`OrderMapData[${i}]ContainerID`, sell.CtrID ? sell.CtrID : '');
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/delivery_request/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const FetchPrintRequest = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_print_req/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchRequestData = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_request_data/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveDocket = async (RequestID, Date, GrandTotal, Count, RequestData) => {
    const macAddressObj = JSON.parse(localStorage.getItem('macAddress'));
    const ipAddress = localStorage.getItem('ipAddress');
    const deviceID = localStorage.getItem('deviceId');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json',
            'X-MAC-Address': navigator.userAgent,
            'X-IP-Address': ipAddress || '',
            'X-Device-ID': deviceID || ''
        }
    };
    let formData = new FormData();
    formData.append("RequestID", RequestID);
    formData.append("Date", Date);
    formData.append("GrandTotal", parseFloat(GrandTotal).toFixed(2));
    formData.append("ItemCount", Count);
    for (var pair of formData.entries()) {
        // console.log("Pair: ", pair);
    }
    for (let i = 0; i < RequestData.length; i++) {
        const sell = RequestData[i];
        formData.append(`DeliveryMapData[${i}]SLNo`, sell.SLNo);
        formData.append(`DeliveryMapData[${i}]ItemID`, sell.ItemID);
        formData.append(`DeliveryMapData[${i}]UnitName`, sell.UnitName);
        formData.append(`DeliveryMapData[${i}]UnitQty`, parseFloat(sell.UnitQty).toFixed(2));
        formData.append(`DeliveryMapData[${i}]UnitWeight`, parseFloat(sell.UnitWeight).toFixed(3));
        formData.append(`DeliveryMapData[${i}]UnitPrice`, parseFloat(sell.UnitPrice).toFixed(2));
        formData.append(`DeliveryMapData[${i}]Weight`, parseFloat(sell.Weight).toFixed(3));
        formData.append(`DeliveryMapData[${i}]Qty`, parseFloat(sell.Qty).toFixed(2));
        formData.append(`DeliveryMapData[${i}]Rate`, parseFloat(sell.Rate).toFixed(4));
        formData.append(`DeliveryMapData[${i}]SubTotal`, parseFloat(sell.SubTotal).toFixed(2));
        formData.append(`DeliveryMapData[${i}]Available`, parseFloat(sell.Available).toFixed(2));
        formData.append(`DeliveryMapData[${i}]ContainerID`, sell.ContainerID);
        formData.append(`DeliveryMapData[${i}]Status`, 1);
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/exec_del/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const FetchDeliveryNote = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_delivery_note/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const FetchProductDetails = async (sect_id, code) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_product_details/${sect_id}/${code}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const UpdateDeliveryNote = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
        params: { id: id }
    };

    const formData = new FormData();
    formData.append("Status", 3);
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/exec_del/${id}/update_note_status/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}