import axios from 'axios';

export const getLabel = (value, arr) =>
    arr.find(item => item.value === value)?.label || 'N/A';

export const getPaymentShort = (value, arr) =>
    arr.find(item => item.value === value)?.short || 'N/A';

export const CalculateAge = (DOB) => {
    let today = new Date();
    let BirthDate = new Date(DOB);
    let tod = today.getTime();
    let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
    let age = days_diff - 1;
    return age;
}

export const OperationList = [
    { label: "N/A", value: 0 },
    { label: "Percentage (%)", value: 1 },
    { label: "Total Body / Total Feed (BG)", value: 2 },
    { label: "Total Body / Total Feed (KG)", value: 3 },
    { label: "Total Cost / Total Body (KG)", value: 4 },
    { label: "Sell Rate > Cost (Per KG) + Profit Margin", value: 5 },
    { label: "Quantity × Rate", value: 6 },
    { label: "Weight × Rate", value: 7 },
    { label: "Mortality > Deceased", value: 8 },
    { label: "Mortality < Deceased", value: 9 },
    { label: "Weight × Sell Rate", value: 10 },
    { label: "Quantity × Chick Rate", value: 11 },

    { label: "Batch Payment - Savings", value: 12 },
    { label: "Net Payment - Savings", value: 13 },
    { label: "Grand Payment - Savings", value: 14 },
    { label: "Stock Feed", value: 15 },
    { label: "Stock Medicine", value: 16 },
    { label: "Stock Bird", value: 17 },
    { label: "Payment", value: 18 },
    { label: "Net Payment", value: 19 },
    { label: "Grand Payment", value: 20 },
    { label: "Recall Feed", value: 21 },
    { label: "Net Payment - Other Cost", value: 22 },
    { label: "Payment + Fixed Amount", value: 22 },
]

export const CurrencyList = [
    { label: "N/A", value: 0 },
    { label: "BDT", value: 1 },
    { label: "Percentage (%)", value: 2 },
    { label: "Array[]", value: 3 },
    { label: "Boolean", value: 4 }
]

export const ConditionScheme = [
    { label: "Feed Conversion Ratio (FCR) [BCF]", value: 1 },
    { label: "Credit Farm [BCF]", value: 2 },
    { label: "Profit & Loss Sharing (P/L Sharing) [BCF]", value: 3 },
    { label: "Market Value [BCF]", value: 4 },
    { label: "Fixed Rate [BCF]", value: 5 },
    { label: "Controled Broiler Farm [CLF]", value: 6 },
    { label: "Controled Layer Farm [CLF]", value: 7 },
    { label: "Layer Contract Farm [LCF]", value: 8 },
    { label: "Fixed Rate [LCF]", value: 9 },
]

export const LoadBusiness = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_user_business/${id}`, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const BusinessPro = async (ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_my_business/${ID}`, config);
        return res.data[0]
    } catch (err) {
        return true;
    }
}

export const SaveContract = async (CompanyID, BranchID, UserID, TypeID, Type, Title, CondID, SecurityMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact) => {

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
    formData.append("UserID", UserID);
    formData.append("Title", Title);
    formData.append("CondID", CondID);
    formData.append("TypeID", TypeID);
    formData.append("Type", Type);
    formData.append("SecurityMoney", SecurityMoney);
    formData.append("Balance", Balance);
    formData.append("RepID", RepID);
    formData.append("FarmReg", FarmReg);
    formData.append("BlankCheque", BlankCheque);
    formData.append("Agreement", Agreement);

    formData.append("ShedSize", ShedSize);
    formData.append("Floor", Floor);
    formData.append("Roof", Roof);
    formData.append("WaterPot", WaterPot);
    formData.append("FeedPot", FeedPot);
    formData.append("Employee", Employee);
    formData.append("ContactNo", Contact);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/business/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveSubDealer = async (CompanyID, BranchID, UserID, TypeID, Type, Title, SecurityMoney, Target, Currency, Balance, RepID, FarmReg, BlankCheque, Agreement) => {

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
    formData.append("UserID", UserID);
    formData.append("Title", Title);
    formData.append("TypeID", TypeID);
    formData.append("Type", Type);
    formData.append("SecurityMoney", SecurityMoney);
    formData.append("Balance", Balance);
    formData.append("RepID", RepID);
    formData.append("FarmReg", FarmReg);
    formData.append("BlankCheque", BlankCheque);
    formData.append("Agreement", Agreement);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/business/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveCustomer = async (CompanyID, BranchID, UserID, TypeID, Type, Title, RepID, FarmReg, BlankCheque, Agreement) => {

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
    formData.append("UserID", UserID);
    formData.append("Title", Title);
    formData.append("TypeID", TypeID);
    formData.append("Type", Type);
    formData.append("RepID", RepID);
    formData.append("FarmReg", FarmReg);
    formData.append("BlankCheque", BlankCheque);
    formData.append("Agreement", Agreement);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/business/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}


export const SaveBatch = async (CompanyID, BranchID, UserID, BusinessID, BatchNo, CondID, IssueDate, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status) => {

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
    formData.append("UserID", parseInt(UserID));
    formData.append("BusinessID", BusinessID);

    formData.append("BatchNo", BatchNo);
    formData.append("CondID", parseInt(CondID));
    formData.append("IssueDate", IssueDate);
    formData.append("Size", Size);
    formData.append("FCR", FCR);
    formData.append("ABW", ABW);
    formData.append("Cost", Cost);
    formData.append("SellRate", SellRate);
    formData.append("NetPay", NetPay);
    formData.append("GrandPay", GrandPay);
    formData.append("SavingRate", SavingRate);
    formData.append("Saving", Saving);
    formData.append("Status", Status);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/batch/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateBatch = async (CompanyID, BranchID, UserID, BusinessID, BatchID, BatchNo, CondID, IssueDate, Size, FCR, ABW, Cost, SellRate, NetPay, GrandPay, SavingRate, Saving, Status) => {

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
    formData.append("UserID", UserID);
    formData.append("BusinessID", BusinessID);
    formData.append("BatchNo", BatchNo);

    if (CondID !== null)
        formData.append("CondID", CondID)
    if (IssueDate !== null)
        formData.append("IssueDate", IssueDate)
    if (Size !== null)
        formData.append("Size", Size)
    if (FCR !== null)
        formData.append("FCR", FCR)
    if (ABW !== null)
        formData.append("ABW", ABW)
    if (Cost !== null)
        formData.append("Cost", Cost)
    if (SellRate !== null)
        formData.append("SellRate", SellRate)
    if (NetPay !== null)
        formData.append("NetPay", NetPay)
    if (GrandPay !== null)
        formData.append("GrandPay", GrandPay)
    if (SavingRate !== null)
        formData.append("SavingRate", SavingRate)
    if (Saving !== null)
        formData.append("Saving", Saving)
    formData.append("Status", Status);


    try {
        for (var pair of formData.entries()) {

        }

        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/batch/${BatchID}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }

}

export const UpdateContract = async (BusinessID, FarmID, Title, CondID, SecurityMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BusinessID", BusinessID);
    formData.append("FarmID", FarmID);
    formData.append("Title", Title);
    formData.append("CondID", parseInt(CondID));
    formData.append("SCMoney", SecurityMoney);
    formData.append("Balance", Balance);
    formData.append("RepID", parseInt(RepID));
    formData.append("FarmReg", FarmReg ? 1 : 0);
    formData.append("BlankCheque", BlankCheque ? 1 : 0);
    formData.append("Agreement", Agreement ? 1 : 0);

    formData.append("ShedSize", ShedSize);
    formData.append("Floor", Floor);
    formData.append("Roof", Roof);
    formData.append("WaterPot", WaterPot);
    formData.append("FeedPot", FeedPot);
    formData.append("Employee", Employee);
    formData.append("ContactNo", Contact);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/business/${BusinessID}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const PartySectorDelete = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/my_party_sector/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const PartyDelete = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/party/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const BISTerminate = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/business/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const RemoveBatch = async (id) => {



    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/batch/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}


export const BatchPro = async (ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_batch/${ID}`, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const ParkedBatchPro = async (ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_parked_batch/${ID}`, config);
        if (res.data) {
            return res.data
        }
        else {
            return true
        }
    } catch (err) {
        return true;
    }
}

// export const CondList = async () => {
//     
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('access')}`,
//             'Accept': 'application/json'
//         }
//     };

//     try {
//         const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cond_title/`, config);
//         return res.data
//     } catch (err) {
//         return true;
//     }
// }

export const SaveItem = async (SLNo, From, To, Rate, FirstCondID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SLNo", SLNo);
    formData.append("From", From);
    formData.append("To", To);
    formData.append("Rate", Rate);
    formData.append("FirstCondID", FirstCondID);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/cond_rate/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadCondition = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/condition/`, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const RemoveCondRate = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cond_rate/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const RemoveOC = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cond_rate/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const DeleteCondition = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/condition/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const CondImplement = async (ConID, Status, Value) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Status", Status ? 0 : 1);
    formData.append("Value", Value);
    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/condition/${ConID}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadCondList = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_condition/`, config);


        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadMyFarms = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/farm_list/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchBatchList = async (BisID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batch_list/${BisID}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadFarmStatus = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/farm_status/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchParked = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batch_park/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FarmMonitoring = async (req_date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/monitoring_cell/${req_date}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const GetFarm = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_farm/${id}`, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const GetActiveBatch = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/active_batch/${id}`, config);
        return res.data[0]
    } catch (err) {
        return true;
    }
}


export const GetGodown = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_godown/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const Invoice = async (BisID, BatchID, InvoiceNo, Date, VatRate, Vat, Discount, Shipment, TotalPrice, Count, SellData, ProductSent_ID, ProductSent_Code) => {
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

    const formData = new FormData();
    formData.append("BusinessID", BisID);
    formData.append("BatchID", BatchID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Date", Date);
    formData.append("VatRate", VatRate);
    formData.append("Vat", Vat);
    formData.append("Discount", Discount);
    formData.append("GrandTotal", TotalPrice);
    formData.append("ItemCount", Count);
    formData.append("Amount", Shipment);
    formData.append(`COA`, ProductSent_ID);
    formData.append(`COA_Code`, ProductSent_Code);

    Object.keys(SellData).map(e => {
        formData.append(`SellMapData[${e}]InvoiceNo`, InvoiceNo);
        formData.append(`SellMapData[${e}]SLNo`, SellData[e].SLNo);
        formData.append(`SellMapData[${e}]ItemCode`, SellData[e].ItemCode);
        formData.append(`SellMapData[${e}]UnitWeight`, SellData[e].UnitWeight);
        formData.append(`SellMapData[${e}]UnitPrice`, SellData[e].UnitPrice);
        formData.append(`SellMapData[${e}]Weight`, SellData[e].Weight);
        formData.append(`SellMapData[${e}]Qty`, SellData[e].Quantity);
        formData.append(`SellMapData[${e}]Rate`, SellData[e].Rate);
        formData.append(`SellMapData[${e}]SubTotal`, SellData[e].SubTotal);
        formData.append(`SellMapData[${e}]Status`, 1);
        formData.append(`SellMapData[${e}]COA`, ProductSent_ID);
        formData.append(`SellMapData[${e}]COA_Code`, ProductSent_Code);
    });


    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sale/`, formData, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const LoadLadger = async (BusinessID, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contract_ladger/${BusinessID}/${BatchID}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchContractFWRLadger = async (BusinessID, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fwr_contract_ladger/${BusinessID}/${BatchID}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const SaveDR = async (Date, Age, BusinessID, BatchID, Mort, Cons, ABW, Stock, EntryType, Remark) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Date", Date);
    formData.append("Age", Age);
    formData.append("BusinessID", BusinessID);
    formData.append("BatchID", BatchID);
    formData.append("Mortality", Mort);
    formData.append("Cons", Cons);
    if (ABW === '')
        formData.append("ABW", 0.000);
    else
        formData.append("ABW", ABW);
    formData.append("Stock", Stock);
    formData.append("EntryType", EntryType);
    formData.append("Remark", Remark);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/daily_record/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadDailyRecord = async (BusinessID, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_dr/${BusinessID}/${BatchID}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const DeleteDR = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/daily_record/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const RecordUpdate = async (id, CSDate, Age, DMort, DFeed, DCons, FeedStock, ABW, EntryType, Remark) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Date", CSDate);
    formData.append("Age", Age);
    formData.append("Mortality", DMort);
    formData.append("Feed", DFeed);
    formData.append("Cons", DCons);
    formData.append("Stock", FeedStock);
    formData.append("ABW", ABW);
    formData.append("EntryType", EntryType);
    formData.append("Remark", Remark);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/daily_record/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveBirdSell = async (GodownID, BusinessID, BatchID, Date, InvoiceNo, Rate, Party, PartyAgent, CarNo, Driver, RepID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("GodownID", GodownID);
    formData.append("BusinessID", BusinessID);
    formData.append("BatchID", BatchID);
    formData.append("Date", Date);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Rate", parseInt(Rate));
    if (Party)
        formData.append("PartyID", Party.value);
    formData.append("PartyAgent", PartyAgent);
    formData.append("CarNo", CarNo);
    formData.append("Driver", Driver);
    formData.append("SalesMan", RepID);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/init_bird_sell/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const FetchInitData = async (BusinessID, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_initialize/${BusinessID}/${BatchID}`, config);
        return res
    } catch (err) {
        return true;
    }
}


export const SaveScale = async (GodownID, BatchID, InvoiceNo, Pices, Weight) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("GodownID", GodownID);
    formData.append("BatchID", BatchID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Qty", Pices);
    formData.append("Weight", Weight);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/scale/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const ScaleReturn = async (BatchID, InvoiceNo, Pices, Weight) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BatchID", BatchID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Qty", Pices);
    formData.append("Weight", Weight);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/scale_return/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const UpdateScale = async (id, Pices, Weight) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Qty", Pices);
    formData.append("Weight", Weight);
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/scale/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SellRunningTotal = async (ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sell_running_total/${ID}`, config);
        return res.data[0]
    } catch (err) {
        return true;
    }
}

export const LoadSellReport = async (BatchID, InvoiceNo) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bs_sell_report/${BatchID}/${InvoiceNo}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadSellData = async (BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bs_sell_data/${BatchID}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadWeeklyData = async (BusinessID, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_weekly_reports/${BusinessID}/${BatchID}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveCondition = async (Scheme, Title, Value, Season) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Scheme", Scheme);
    formData.append("Title", Title);
    formData.append("Value", Value);
    formData.append("Season", Season);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/condition/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateCondition = async (id, Scheme, Title, Value, Season) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Scheme", Scheme);
    formData.append("Title", Title);
    formData.append("Value", Value);
    formData.append("Season", Season);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/condition/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveOtherCond = async (CondID, SLNo, Title, Rate, Currency, Operation, Times, Status, COA_ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("CondID", CondID);
    formData.append("SLNo", SLNo);
    formData.append("Title", Title);
    formData.append("Rate", Rate);
    formData.append("Currency", Currency);
    formData.append("Operation", Operation);
    formData.append("Times", Times);
    formData.append("Status", Status);
    formData.append("COA_ID", COA_ID);
    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/other_cond/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveSecondCond = async (CondID, SLNo, Title, Type, Rate, Currency, COA_ID, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("CondID", CondID);
    formData.append("SLNo", SLNo);
    formData.append("Title", Title);
    formData.append("Type", Type);
    formData.append("Rate", Rate);
    formData.append("Currency", Currency);
    formData.append("COA_ID", COA_ID);
    formData.append("Status", Status);

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/second_cond/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchAccounts = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_coa/`, config);
        return res.data
    } catch (err) {
    }
}

export const UpdateOtherCond = async (id, SLNo, Title, Rate, Currency, Operation, Times, Status, COA_ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SLNo", SLNo);
    formData.append("Title", Title);
    formData.append("Rate", Rate);
    formData.append("Currency", Currency);
    formData.append("Operation", Operation);
    formData.append("Times", Times);
    formData.append("Status", Status);
    formData.append("COA_ID", COA_ID);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/other_cond/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchDispatch = async (COA, Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contract_dispatch/${COA}/${Date}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchSellReport = async (Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sell_report/${Date}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchPurchaseReport = async (Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchase_report/${Date}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchLiveStock = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/live_stock/`, config);

        return res
    } catch (err) {
    }
}

export const FetchCosting = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cost_map/`, config);
        return res
    } catch (err) {
    }
}

export const ParkBatch = async (id, value) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("Sell", value);
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/batch_park/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadBatchAccount = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batch_payment_rcpt/${id}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const LoadBatchAssesment = async (id, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_batch_assesment/${id}/${Status}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const LoadProfitNLoss = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pl_calculate/${id}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const LoadPayment = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batch_payment/${id}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchInvoice = async (InvoiceNo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_invoice/${InvoiceNo}`, config);
        return res
    } catch (err) {
    }
}

export const RecallProduct = async (id, ItemCode, Qty, Weight, SubTotal) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("ItemCode", ItemCode);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("SubTotal", SubTotal);
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/con_dis_inv_single_item_remove/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const DispatchInvoiceDelete = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/remove_dis_inv/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}


export const FetchPartyInvoiceNo = async (InvoiceType) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_party_invoice_no/${InvoiceType}`, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const LeftBird = async (inv, Rate, Qty, Wt, VatRate, Vat, Discount, GrandTotal, PaidAmount, Due) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("Rate", Rate);
    formData.append("StockQty", Qty);
    formData.append("StockWeight", Wt);
    formData.append("VatRate", VatRate);
    formData.append("Vat", Vat);
    formData.append("Discount", Discount);
    formData.append("GrandTotal", GrandTotal);
    formData.append("PaidAmount", PaidAmount);
    formData.append("Due", Due);
    for (var pair of formData.entries()) {

    }
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/init_bird_sell/${inv}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const RemoveInitialization = async (inv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/init_bird_sell/${inv}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const BirdSellReturn = async (id, Qty, Weight) => {

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

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/my_stock/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const DeleteScale = async (id) => {


    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/scale/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}


export const DeleteReturnScale = async (id) => {


    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/scale_return/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const SaveBatchStock = async (array, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("BatchID", BatchID);
    formData.append("Data", JSON.stringify(array));

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/batch_stock/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveBatchAcc = async (array, BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BatchID", BatchID);
    formData.append("Data", JSON.stringify(array));
    for (var pair of formData.entries()) {
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/batch_acc/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const LoadBatchSummery = async (BatchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_batch_summery/${BatchID}`, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadBirdSellHistory = async (Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_bird_sell_history/${Date}`, config);

        return res.data
    } catch (err) {
        return true;
    }
}
export const FetchAllFarmPayment = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/farmer_pending_payment/`, config);

        return res
    } catch (err) {
    }
}


export const FetchBatch = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment_batch/${id}`, config);

        return res.data[0]
    } catch (err) {
        return true;
    }
}

export const FetchRecallProducts = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/recall_products/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const ClosingRecall = async (id, AccID, ItemCode, Qty, Weight, SubTotal) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("ItemCode", ItemCode);
    formData.append("AccID", AccID);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("SubTotal", SubTotal);
    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/recall_products/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}


export const SaveSummey = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batch_summerized/${id}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const SaveGodown = async (Title, Type, Qty, Weight, UnitCost, TotalCost, RepID, GodownAC, Godown_Code, ExpireAC, Expire_Code, BirdStockAC, BirdStock_Code, BranchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("Type", Type);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("UnitCost", UnitCost);
    formData.append("TotalCost", TotalCost);
    formData.append("RepID", RepID);
    formData.append("GodownAC", parseInt(GodownAC));
    formData.append("Godown_Code", parseInt(Godown_Code));
    formData.append("BirdStockAC", parseInt(BirdStockAC));
    formData.append("BirdStock_Code", parseInt(BirdStock_Code));
    formData.append("ExpireAC", parseInt(ExpireAC));
    formData.append("Expire_Code", parseInt(Expire_Code));
    formData.append("BranchID", parseInt(BranchID));
    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/godown/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateGodown = async (id, Title, Type, Qty, Weight, UnitCost, TotalCost, RepID, GodownAC, Godown_Code, ExpireAC, Expire_Code, BirdStockAC, BirdStock_Code, BranchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("Type", Type);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("UnitCost", UnitCost);
    formData.append("TotalCost", TotalCost);
    formData.append("RepID", RepID);
    formData.append("GodownAC", parseInt(GodownAC));
    formData.append("Godown_Code", parseInt(Godown_Code));
    formData.append("BirdStockAC", parseInt(BirdStockAC));
    formData.append("BirdStock_Code", parseInt(BirdStock_Code));
    formData.append("ExpireAC", parseInt(ExpireAC));
    formData.append("Expire_Code", parseInt(Expire_Code));
    formData.append("BranchID", parseInt(BranchID));
    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/godown/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchGodown = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/godown/`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const DeleteGodown = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/godown/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}


export const GodownInvoice = async (GID, InvoiceNo, Date, VatRate, Vat, Discount, Shipment, TotalPrice, Count, SellData, ProductSent_ID, ProductSent_Code) => {
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

    const formData = new FormData();
    formData.append("GodownID", GID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("Date", Date);
    formData.append("VatRate", VatRate);
    formData.append("Vat", Vat);
    formData.append("Discount", Discount);
    formData.append("GrandTotal", TotalPrice);
    formData.append("ItemCount", Count);
    formData.append("Amount", Shipment);
    formData.append(`COA`, ProductSent_ID);
    formData.append(`COA_Code`, ProductSent_Code);

    Object.keys(SellData).map(e => {
        formData.append(`SellMapData[${e}]InvoiceNo`, InvoiceNo);
        formData.append(`SellMapData[${e}]SLNo`, SellData[e].SLNo);
        formData.append(`SellMapData[${e}]ItemCode`, SellData[e].ItemCode);
        formData.append(`SellMapData[${e}]UnitWeight`, SellData[e].UnitWeight);
        formData.append(`SellMapData[${e}]UnitPrice`, SellData[e].UnitPrice);
        formData.append(`SellMapData[${e}]Weight`, SellData[e].Weight);
        formData.append(`SellMapData[${e}]Qty`, SellData[e].Quantity);
        formData.append(`SellMapData[${e}]Rate`, SellData[e].Rate);
        formData.append(`SellMapData[${e}]SubTotal`, SellData[e].SubTotal);
        formData.append(`SellMapData[${e}]Status`, 1);
        formData.append(`SellMapData[${e}]COA`, ProductSent_ID);
        formData.append(`SellMapData[${e}]COA_Code`, ProductSent_Code);
    });


    try {
        for (var pair of formData.entries()) {
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sale/`, formData, config);
        return res.data
    } catch (err) {
        return err;
    }
}

export const GenGDLadger = async (id, dt_from, dt_to) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/gen_gd_ladger/${id}/${dt_from}/${dt_to}`, config);
        return res
    } catch (err) {
        return true;
    }
}


export const SaveExpire = async (BranchID, id, Date, Qty, Weight, UnitCost, TotalCost, ExpireAC, Expire_Code) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BranchID", parseInt(BranchID));
    formData.append("GodownID", id);
    formData.append("Date", Date);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("UnitCost", UnitCost);
    formData.append("TotalCost", TotalCost);
    formData.append("ExpireAC", ExpireAC);
    formData.append("Expire_Code", Expire_Code);
    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/gd_expire/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchTFBatchData = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_tf_farm_data/${id}`, config);
        return res
    } catch (err) {
        return true;
    }
}


export const SaveTransfer = async (BranchID, BusinessID, BatchID, GodownID, data, Age, Qty, Weight, UnitCost, TotalCost) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BranchID", parseInt(BranchID));
    formData.append("BusinessID", parseInt(BusinessID));
    formData.append("BatchID", parseInt(BatchID));
    formData.append("GodownID", GodownID);
    formData.append("Date", data);
    formData.append("Age", Age);
    formData.append("Qty", Qty);
    formData.append("Weight", Weight);
    formData.append("UnitCost", UnitCost);
    formData.append("TotalCost", TotalCost);
    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/transfer/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const ParkedGodownPro = async (ID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_parked_godown/${ID}`, config);
        if (res.data) {
            return res.data
        }
        else {
            return true
        }
    } catch (err) {
        return true;
    }
}