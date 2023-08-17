import axios from 'axios';

export const UnitNameList = [
    { value: 1, label: "CTN" },
    { value: 2, label: "GM" },
    { value: 3, label: "BAG" },
    { value: 4, label: "PCS" },
    { value: 5, label: "LTR" },
    { value: 6, label: "MG" },

    { value: 7, label: "BOX" },
    { value: 8, label: "PKT" },
    { value: 9, label: "L/S" },
    { value: 10, label: "INNA" },
    { value: 11, label: "B/L" },
    { value: 12, label: "T/R" },

    { value: 13, label: "KG" },
    { value: 14, label: "Roll" },
    { value: 15, label: "Sack" },
    { value: 16, label: "ML" }
]

export const colourStyles = {
    control: (styles) => ({
        ...styles,
        backgroundColor: "#F4F7FC",
        border: 0,
        boxShadow: "none",
        fontWeight: "bold",
        minHeight: "fit-content",
        height: "25px",
        borderRadius: "0px",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            cursor: isDisabled ? "not-allowed" : "default",
            borderRadius: "20px",
        };
    },
    menu: (base) => ({
        ...base,
        borderRadius: "0px",
        outline: 0,
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: (base) => ({
        ...base,
        padding: "5px",
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: "25px",
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: "25px",
        padding: "0 3px",
        color: "black",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "black",
    }),
};

export const UpdateSupLogo = async (id, Image) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("id", id);
    formData.append("Logo", Image, Image.name);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/update_sup_logo/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const UpdateProductImage = async (id, Image) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("id", id);
    formData.append("Image", Image, Image.name);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/update_pro_image/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const NatSuppliers = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/nat_suppliers/`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const GetSuppliers = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_supplier/${id}`, config);
        return res.data[0]
    } catch (err) {
        return true;
    }
}


export const SaveSupplier = async (SupplierName, Products, Address, Contact, Email, Fax, Website, Status, Logo, LogoPrv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const JsonProducts = JSON.stringify(Products);
    const formData = new FormData();
    formData.append("SupplierTitle", SupplierName);
    formData.append("Products", JsonProducts);
    formData.append("Address", Address);
    formData.append("Contact", Contact);
    formData.append("Email", Email);
    formData.append("Fax", Fax);
    formData.append("Website", Website);
    formData.append("Status", Status);
    if (LogoPrv) { formData.append("Logo", Logo, Logo.name); }

    for (var pair of formData.entries()) {

    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/nat_suppliers/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveProductPro = async (SupplierID, Title, Description, Specification, UnitName, Category, Status, Image, ImagePrv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const JsonType = JSON.stringify(UnitName);

    const formData = new FormData();
    formData.append("SupplierID", SupplierID);
    formData.append("Title", Title);
    formData.append("Description", Description);
    formData.append("Specification", Specification);
    formData.append("Category", Category);
    formData.append("UnitName", JsonType);
    formData.append("Status", Status);
    if (ImagePrv) { formData.append("Image", Image, Image.name); }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product_pro/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const ProductProList = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product_pro_list/${id}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const UpdateProductPro = async (SupplierID, ProductID, Title, Description, Specification, Type, Category, Status, Image, ImagePrv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const JsonType = JSON.stringify(Type);
    const formData = new FormData();
    formData.append("SupplierID", SupplierID);
    formData.append("ProductID", ProductID);
    formData.append("Title", Title);
    formData.append("Description", Description);
    formData.append("Specification", Specification);
    formData.append("Type", JsonType);
    formData.append("Category", Category);
    formData.append("Status", Status);
    if (ImagePrv && Image) {
        formData.append("Image", Image, Image.name);
    }

    // for (var pair of formData.entries()) {
    //     
    // }

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/product_pro/${ProductID}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const SaveProductItem = async (SupplierID, ProductID, Code, Barcode, Title, PackType, UnitName, UnitQty, UnitWeight, UnitPrice, MRP, LoosePrice, Status, CtnBarcode, CtnQty, CtnPrice, HalfCtnBarcode, HalfCtnQty, HalfCtnPrice, TwelveBarcode, TwelveQty, TwelvePrice, TenBarcode, TenQty, TenPrice, EightBarcode, EightQty, EightPrice, SixBarcode, SixQty, SixPrice, FourBarcode, FourQty, FourPrice, Pack1Barcode, Pack1Qty, Pack1Price, Pack2Barcode, Pack2Qty, Pack2Price, Package) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SupplierID", SupplierID);
    formData.append("ProductID", ProductID);
    formData.append("Code", parseInt(Code));
    formData.append("Barcode", parseInt(Barcode));
    formData.append("Title", Title);
    formData.append("PackType", PackType);
    formData.append("UnitName", UnitName);
    formData.append("UnitQty", UnitQty);
    formData.append("UnitWeight", UnitWeight);
    formData.append("UnitPrice", UnitPrice);
    formData.append("MRP", MRP);
    formData.append("LoosePrice", LoosePrice);
    formData.append("Status", Status);
    formData.append("CtnBarcode", CtnBarcode);
    formData.append("CtnQty", CtnQty);
    formData.append("CtnPrice", CtnPrice);
    formData.append("HalfCtnBarcode", HalfCtnBarcode);
    formData.append("HalfCtnQty", HalfCtnQty);
    formData.append("HalfCtnPrice", HalfCtnPrice);
    formData.append("TwelveBarcode", TwelveBarcode);
    formData.append("TwelveQty", TwelveQty);
    formData.append("TwelvePrice", TwelvePrice);
    formData.append("TenBarcode", TenBarcode);
    formData.append("TenQty", TenQty);
    formData.append("TenPrice", TenPrice);
    formData.append("EightBarcode", EightBarcode);
    formData.append("EightQty", EightQty);
    formData.append("EightPrice", EightPrice);
    formData.append("SixBarcode", SixBarcode);
    formData.append("SixQty", SixQty);
    formData.append("SixPrice", SixPrice);
    formData.append("FourBarcode", FourBarcode);
    formData.append("FourQty", FourQty);
    formData.append("FourPrice", FourPrice);
    formData.append("Pack1Barcode", Pack1Barcode);
    formData.append("Pack1Qty", Pack1Qty);
    formData.append("Pack1Price", Pack1Price);
    formData.append("Pack2Barcode", Pack2Barcode);
    formData.append("Pack2Qty", Pack2Qty);
    formData.append("Pack2Price", Pack2Price);
    formData.append("Package", Package);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product_item/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SavePackage = async (ItemID, CtnBarcode, CtnQty, HalfCtnBarcode, HalfCtnQty, TwelveBarcode, TwelveQty, TenBarcode, TenQty, EightBarcode, EightQty, SixBarcode, SixQty, FourBarcode, FourQty, Pack1Barcode, Pack1Qty, Pack2Barcode, Pack2Qty, Pack3Barcode, Pack3Qty, OtherBarcode, OtherQty, WhlslBarcode, WhlslQty) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("ItemID", ItemID);

    formData.append("CtnBarcode", CtnBarcode);
    formData.append("CtnQty", parseFloat(CtnQty));

    formData.append("HalfCtnBarcode", HalfCtnBarcode);
    formData.append("HalfCtnQty", parseFloat(HalfCtnQty));

    formData.append("TwelveBarcode", TwelveBarcode);
    formData.append("TwelveQty", parseFloat(TwelveQty));

    formData.append("TenBarcode", TenBarcode);
    formData.append("TenQty", parseFloat(TenQty));

    formData.append("EightBarcode", EightBarcode);
    formData.append("EightQty", parseFloat(EightQty));

    formData.append("SixBarcode", SixBarcode);
    formData.append("SixQty", parseFloat(SixQty));

    formData.append("FourBarcode", FourBarcode);
    formData.append("FourQty", parseFloat(FourQty));

    formData.append("Pack1Barcode", Pack1Barcode);
    formData.append("Pack1Qty", parseFloat(Pack1Qty));

    formData.append("Pack2Barcode", Pack2Barcode);
    formData.append("Pack2Qty", parseFloat(Pack2Qty));

    formData.append("Pack3Barcode", Pack3Barcode);
    formData.append("Pack3Qty", parseFloat(Pack3Qty));

    formData.append("OtherBarcode", OtherBarcode);
    formData.append("OtherQty", parseFloat(OtherQty));

    formData.append("WhlslBarcode", WhlslBarcode);
    formData.append("WhlslQty", parseFloat(WhlslQty));
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/packaging_n_reform/create_package/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const CreatePackage = async (ItemID, PurchasePrice, MRP, RetailPrice, WhlslPrice, CtnPrice, HalfCtnPrice, TwelvePrice, TenPrice, EightPrice, SixPrice, FourPrice, Pack1Price, Pack2Price, Pack3Price, OtherPrice) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("ItemID", ItemID);
    formData.append("PurchasePrice", parseFloat(PurchasePrice || null));
    formData.append("RetailPrice", parseFloat(RetailPrice || null));
    formData.append("WhlslPrice", parseFloat(WhlslPrice || null));
    formData.append("MRP", parseFloat(MRP || null));

    formData.append("CtnPrice", parseFloat(CtnPrice || null));
    formData.append("HalfCtnPrice", parseFloat(HalfCtnPrice || null));
    formData.append("TwelvePrice", parseFloat(TwelvePrice || null));
    formData.append("TenPrice", parseFloat(TenPrice || null));
    formData.append("EightPrice", parseFloat(EightPrice || null));
    formData.append("SixPrice", parseFloat(SixPrice || null));
    formData.append("FourPrice", parseFloat(FourPrice || null));
    formData.append("Pack1Price", parseFloat(Pack1Price || null));
    formData.append("Pack2Price", parseFloat(Pack2Price || null));
    formData.append("Pack3Price", parseFloat(Pack3Price || null));
    formData.append("OtherPrice", parseFloat(OtherPrice || null));
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/packaging_n_reform/add_package/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchProductCode = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_product_code/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const ProductItemList = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product_item_list/${id}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchPack = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_single_package/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchPackNPrice = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_sector_package/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateProductItem = async (id, ProductID, Code, Barcode, Title, UnitName, UnitQty, UnitWeight, PackType, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("ProductID", ProductID);
    formData.append("id", id);
    formData.append("Code", Code);
    formData.append("Barcode", Barcode);
    formData.append("Title", Title);
    formData.append("UnitName", UnitName);
    formData.append("UnitQty", UnitQty);
    formData.append("UnitWeight", UnitWeight);
    formData.append("PackType", PackType);
    formData.append("Status", Status);
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/product_item/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const AddSupplier = async (SupplierID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SupplierID", SupplierID);
    try {
        // for (var pair of formData.entries()) {
        //     
        // }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/supplier_relation/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const MySuppliers = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/supplier_relation/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const AddProduct = async (CompanyID, BranchID, SupplierID, ItemCode) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("CompanyID", CompanyID);
    formData.append("BranchID", BranchID);
    formData.append("SupplierID", SupplierID);
    formData.append("ItemCode", ItemCode);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/supplier_relation_item/`, formData, config);
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

export const SendOrder = async (CompanyID, BranchID, SupplierID, OrderNo, Amount, DDate, UpdatedBy, OrderData) => {
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
    formData.append("OrderNo", OrderNo);
    formData.append("Amount", Amount);
    formData.append("DeliveryDate", DDate);
    formData.append("Status", "Pending");
    formData.append("UpdatedBy", UpdatedBy);
    Object.keys(OrderData).map(e => {
        formData.append(`OrderMapData[${e}]ItemCode`, OrderData[e].ItemCode);
        formData.append(`OrderMapData[${e}]OrderQty`, OrderData[e].Quantity);
        formData.append(`OrderMapData[${e}]UnitPrice`, OrderData[e].UnitPrice);
    });

    // 
    try {
        // for (var pair of formData.entries()) {
        //     
        // }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/order/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const MyOrders = async (CompanyID, BranchID, SupplierID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_orders/${CompanyID}/${BranchID}/${SupplierID}`, config);
        // 
        return res
    } catch (err) {
        return true;
    }
}

export const LoadMyRep = async (CompanyID, BranchID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_my_rep/${CompanyID}/${BranchID}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const Purchase = async (SectorID, ContainerID, SupplierID, PurchaseNo, OrderNo, OrderBy, ReceiverID, InvoiceNo, DocketNo, Date, Today, Receiver, Payment, VatRate, Vat, Discount, Total, Paid, Due, Count, PurchaseData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID);
    formData.append("ContainerID", ContainerID);
    formData.append("SupplierID", SupplierID);
    formData.append("PurchaseNo", PurchaseNo);
    formData.append("OrderNo", OrderNo);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("OrderBy", OrderBy);
    formData.append("InvDate", Date);
    formData.append("RcvDate", Today);
    formData.append("ReceiverID", ReceiverID);
    formData.append("DocketNo", DocketNo);
    formData.append("Payment", Payment);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("GrandTotal", parseFloat(Total).toFixed(2));
    formData.append("PaidAmount", parseFloat(Paid).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));
    formData.append("Count", Count);

    Object.keys(PurchaseData).map(e => {
        formData.append(`PurchaseMapData[${e}]SectorID`, SectorID);
        formData.append(`PurchaseMapData[${e}]PurchaseNo`, PurchaseNo);
        formData.append(`PurchaseMapData[${e}]ReceiverID`, Receiver);
        formData.append(`PurchaseMapData[${e}]SLNo`, PurchaseData[e].SLNo);
        formData.append(`PurchaseMapData[${e}]ItemID`, PurchaseData[e].ItemID);
        formData.append(`PurchaseMapData[${e}]UnitName`, PurchaseData[e].UnitName);
        formData.append(`PurchaseMapData[${e}]UnitQty`, parseFloat(PurchaseData[e].Size).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Weight`, parseFloat(PurchaseData[e].Weight).toFixed(3));
        formData.append(`PurchaseMapData[${e}]Qty`, parseFloat(PurchaseData[e].Quantity).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Rate`, parseFloat(PurchaseData[e].UnitPrice).toFixed(2));
        formData.append(`PurchaseMapData[${e}]SubTotal`, parseFloat(PurchaseData[e].SubTotal).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Available`, parseFloat(PurchaseData[e].Available).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Status`, "Received");
        formData.append(`PurchaseMapData[${e}]Remark`, PurchaseData[e].Remark);
        formData.append(`PurchaseMapData[${e}]UpdatedBy`, Receiver);
    });

    formData.append('VoucherType', 6)
    formData.append('Date', Date)
    formData.append('VoucherNo', PurchaseNo);
    formData.append('PaymentMethod', "Cash");
    formData.append('Consignee', "");

    try {
        for (var pair of formData.entries()) {
            // console.log("Pair: ", pair);
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/purchase/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const PurchaseUpdate = async (PurchaseID, InvoiceNo, DocketNo, Payment, RcvDate, VatRate, Vat, Discount, Total, Paid, Due, Count, PurchaseData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("id", PurchaseID);
    formData.append("InvoiceNo", InvoiceNo);
    formData.append("RcvDate", RcvDate);
    formData.append("DocketNo", DocketNo);
    formData.append("Payment", Payment.value);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("GrandTotal", parseFloat(Total).toFixed(2));
    formData.append("PaidAmount", parseFloat(Paid).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));
    formData.append("Count", Count);

    Object.keys(PurchaseData).map(e => {
        formData.append(`PurchaseMapData[${e}]SLNo`, PurchaseData[e].SLNo);
        formData.append(`PurchaseMapData[${e}]ItemID`, PurchaseData[e].ItemID);
        formData.append(`PurchaseMapData[${e}]UnitName`, PurchaseData[e].UnitName);
        formData.append(`PurchaseMapData[${e}]UnitQty`, parseFloat(PurchaseData[e].Size).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Weight`, parseFloat(PurchaseData[e].Weight).toFixed(3));
        formData.append(`PurchaseMapData[${e}]Qty`, parseFloat(PurchaseData[e].Quantity).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Rate`, parseFloat(PurchaseData[e].UnitPrice).toFixed(2));
        formData.append(`PurchaseMapData[${e}]SubTotal`, parseFloat(PurchaseData[e].SubTotal).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Available`, parseFloat(PurchaseData[e].Available).toFixed(2));
        formData.append(`PurchaseMapData[${e}]Status`, "Received");
        formData.append(`PurchaseMapData[${e}]Remark`, PurchaseData[e].Remark);
    });

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/purchase/${PurchaseID}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchMySuppliers = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_supplier_list/`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchMyBis = async (TypeNo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_bis_list/${TypeNo}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchMyEmp = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_emp_list/`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchSupplierInvoices = async (id, from, to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sup_invoice_list/${id}/${from}/${to}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchPurchaseInvoice = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_purs_invoice/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SupplierPayment = async (id, Payment, Discount, PaidAmount, Due, IsBank, IsCheque, IsCard, IsOnline, Bank, ACName, ACNumber, ChequeNo, TrxNo) => {
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
    formData.append("ToAccName", ACName);
    formData.append("ToAccNumber", ACNumber);
    formData.append("ToChequeNo", ChequeNo);
    formData.append("ToBankID", Bank)

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/sup_payment_receipt/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}