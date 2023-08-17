import axios from 'axios';

export const FetchPartyOrder = async (id, from, to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/party_orders/${id}/${from}/${to}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchPrintInvoice = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_print_invoice/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchPrintQuote = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_print_quote/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchPrintPO = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_print_po/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchPrintOrder = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_print_order/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchOrderData = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_order_data/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchPartyInvoices = async (id, from, to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/party_invoice_list/${id}/${from}/${to}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const PaymentRecipt = async (id, Payment, Discount, PaidAmount, Due, IsBank, IsCheque, IsCard, IsOnline, Bank, ACName, ACNumber, ChequeNo, TrxNo) => {
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
    formData.append("Payment", parseInt(Payment));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));

    formData.append("IsBank", IsBank);
    formData.append("IsCheque", IsCheque);
    formData.append("IsCard", IsCard);
    formData.append("IsOnline", IsOnline);

    formData.append("TrxNo", TrxNo);
    formData.append("FrmAccName", ACName);
    formData.append("FrmAccNumber", ACNumber);
    formData.append("FrmChequeNo", ChequeNo);
    formData.append("FrmBankID", Bank)
    for (var pair of formData.entries()) {

    }
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/party_payment_receipt/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const UpdateDlvStatus = async (id, Status) => {
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
    formData.append("Status", parseInt(Status));
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/delivery_order/${id}/update_order_status/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}