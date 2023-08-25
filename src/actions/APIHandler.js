import axios from 'axios';

export const getStaffLabel = (value, arr) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value === value) {
            return arr[i].label;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

export const ReligionList = [{ label: "Islam", value: 1 }, { label: "Christians", value: 2 }, { label: "Hindus", value: 3 }, { label: "Buddhists", value: 4 }, { label: "Others", value: 5 }]

export const PartyStatusList = [
    { label: "Pending", value: 0 },
    { label: "Active", value: 1 },
    { label: "Hold", value: 2 },
    { label: "Freeze", value: 3 },
    { label: "Blocked", value: 4 }
]

export const MarginOperation = [
    { label: "N/A", value: 0 },
    { label: "Contract Farm", value: 1 },
    { label: "Private Farm", value: 2 },
    { label: "Sub-dealers", value: 3 },
    { label: "Customers", value: 4 },
    { label: "Egg", value: 5 },
    { label: "Layer Farm", value: 6 },
    { label: "Party", value: 7 },
    { label: "Batch Payment", value: 8 },
    { label: "Net Payment", value: 9 },
    { label: "Grand Payment", value: 10 },
    { label: "Profit Margin (BS)", value: 11 },
    { label: "Market Retail Price (MRP)", value: 12 },
    { label: "Custom", value: 13 },
]

export const TransferMethodList = [
    { label: "Bank (EFTN)", value: 3 },
    { label: "Bank (RTGS)", value: 4 },
    { label: "Bank (IMPS)", value: 5 },
    { label: "Bank (UPI)", value: 6 },
    { label: "Bank (Cheque)", value: 7 },
    { label: "Bank (Pay Order)", value: 8 },

    { label: "MFSP (ROCKET)", value: 3 },
    { label: "MFSP (bKash)", value: 4 },
    { label: "MFSP (MYCash)", value: 5 },
    { label: "MFSP (mCash)", value: 6 },
    { label: "MFSP (tap)", value: 7 },
    { label: "MFSP (SureCash)", value: 8 },

    { label: "MFSP (upay)", value: 9 },
    { label: "MFSP (OK Wallet)", value: 10 },
    { label: "MFSP (TeleCash)", value: 11 }
    ,
    { label: "MFSP (Islamic Wallet)", value: 12 },
    { label: "MFSP (Tap `n Pay)", value: 13 },
    { label: "MFSP (Nagad)", value: 14 },
    { label: "Bank", value: 15 },
    { label: "MFSP", value: 16 },
]

export const findUnique = (arr, predicate) => {
    var found = {};
    arr.forEach(d => {
        found[predicate(d)] = d;
    });
    return Object.keys(found).map(key => found[key]);
}

export const LoadPending = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/pending_users/`, config);
        return res
    } catch (err) {
        return true
    }
}

export const LoadProfile = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile_view/${id}`, config);
        return res.data[0]
    } catch (err) {
        return true
    }
}

export const CreateAccount = async (UserName, FirstName, LastName, DOB, MobileNo, UserMail, pass, con_pass, Nationality, PassportNo, IssueDate, ExpireDate, FullName, GovtID, FatherName, MotherName, Religion, Gender, MaritalStatus, Education, Language, PresentAddress, PermanentAddress, is_block, is_active, Concern, Sector, Designation, Image, ImagePrv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const LanguageJson = JSON.stringify(Language);

    const formData = new FormData();
    formData.append("username", UserName);
    formData.append("FirstName", FirstName);
    formData.append("LastName", LastName);
    formData.append("DOB", DOB);
    formData.append("MobileNo", MobileNo);
    formData.append("email", UserMail);
    formData.append("password", pass);
    formData.append("con_pass", con_pass);

    formData.append("Nationality", Nationality.value);
    formData.append("PassportNo", PassportNo);         //Passport model
    formData.append("IssueDate", IssueDate);           //Passport model
    formData.append("ExpireDate", ExpireDate);         //Passport model
    formData.append("Name", FullName);
    formData.append("GovtID", GovtID);
    formData.append("FatherName", FatherName);
    formData.append("MotherName", MotherName);
    formData.append("Religion", Religion);
    formData.append("Gender", Gender);
    formData.append("MaritalStatus", MaritalStatus.value);
    formData.append("Education", Education);
    formData.append("Language", LanguageJson);
    formData.append("PresentAddress", PresentAddress);
    formData.append("PermanentAddress", PermanentAddress);

    formData.append("SisterID", Concern.value);    //Sector model SisterID
    formData.append("SectorID", Sector.value);  //Sector model Title
    formData.append("SectorTitle", Sector.label);  //Sector model Title

    formData.append("is_block", is_block);          //Role model
    formData.append("is_active", is_active);        //Role model
    formData.append("No", Designation.value);       //Role model
    formData.append("Title", Designation.label);    //Role model
    formData.append("Scale", Designation.Scale);    //Role model
    if (ImagePrv) {
        formData.append("avatar", Image, Image.name);
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/profile_action/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const GetCompany = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_company/${id}`, config);
        return res
    } catch (err) {
        return true
    }
}

export const GetBranch = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_branch/${id}`, config);
        return res
    } catch (err) {
        return true
    }
}

export const SaveBranch = async (CompanyID, BranchID, Name, Domain, Established, ManagerID, ContactNo, BranchEmail, Division, Zila, Upazila, Union, VillageName) => {
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
    formData.append("Name", Name);
    formData.append("Domain", Domain);
    formData.append("Established", Established);
    formData.append("ManagerID", ManagerID);
    formData.append("ContactNo", ContactNo);
    formData.append("BranchEmail", BranchEmail);
    formData.append("VillageName", VillageName);
    formData.append("Union", Union);
    formData.append("Upazila", Upazila);
    formData.append("Zila", Zila);
    formData.append("Division", Division);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/branch_action/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const BranchUpdate = async (BranchID, Name, Domain, Established, ManagerID, ContactNo, BranchEmail, Division, Zila, Upazila, Union, VillageName) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("BranchID", BranchID);
    formData.append("Name", Name);
    formData.append("Domain", Domain);
    formData.append("Established", Established);
    formData.append("ManagerID", ManagerID);
    formData.append("ContactNo", ContactNo);
    formData.append("BranchEmail", BranchEmail);
    formData.append("VillageName", VillageName);
    formData.append("Union", Union);
    formData.append("Upazila", Upazila);
    formData.append("Zila", Zila);
    formData.append("Division", Division);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/branch_action/${BranchID}/`, formData, config);
        return res.data
    } catch (err) {
        return err
    }
}

export const ApproveData = async (id, DetailID, RoleID, PassportID, SectorID, username, FirstName, LastName, email, password, MobileNo, Name, GovtID, DOB, FatherName, MotherName, Nationality, PassportNo, IssueDate, ExpireDate, Religion, Gender, Occupation, Education, MaritalStatus, Language, PresentAddress, PermanentAddress, is_block, is_active, Concern, sector, Designation, avatar, avatar_prv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const LanguageJson = JSON.stringify(Language);

    const formData = new FormData();
    formData.append("DetailID", DetailID);
    formData.append("RoleID", RoleID);
    formData.append("PassportID", PassportID);
    formData.append("SectorID", SectorID);

    formData.append("username", username);
    formData.append("FirstName", FirstName);
    formData.append("LastName", LastName);
    formData.append("DOB", DOB);
    formData.append("MobileNo", MobileNo);
    formData.append("email", email);
    formData.append("password", password);

    formData.append("Nationality", Nationality.value);
    formData.append("PassportNo", PassportNo);         //Passport model
    formData.append("IssueDate", IssueDate);           //Passport model
    formData.append("ExpireDate", ExpireDate);         //Passport model
    formData.append("Name", Name);
    formData.append("GovtID", parseInt(GovtID));
    formData.append("FatherName", FatherName);
    formData.append("MotherName", MotherName);
    formData.append("Religion", Religion.label);
    formData.append("Gender", Gender.label);
    formData.append("MaritalStatus", parseInt(MaritalStatus.value));
    formData.append("Education", Education);
    formData.append("Language", LanguageJson);
    formData.append("PresentAddress", PresentAddress);
    formData.append("PermanentAddress", PermanentAddress);

    formData.append("SisterID", Concern.value);    //Sector model SisterID
    formData.append("SectorTitle", sector.label);  //Sector model Title

    formData.append("is_block", is_block);          //Role model
    formData.append("is_active", is_active);        //Role model
    formData.append("No", Designation.value);       //Role model
    formData.append("Title", Designation.label);    //Role model
    formData.append("Scale", Designation.Scale);    //Role model
    if (avatar_prv) { formData.append("avatar", avatar, avatar.name); }

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile_action/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return err
    }
}

export const UpdateCredential = async (id, email, NewPass, MobileNo) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", NewPass);
    formData.append("MobileNo", MobileNo);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/update_new_pass/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return err
    }
}

export const ResetPass = async (id, old_pass, new_pass, con_pass) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("id", id);
    formData.append("old_pass", old_pass);
    formData.append("new_pass", new_pass);
    formData.append("con_pass", con_pass);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/change_pass/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return err
    }
}

export const UpdateImage = async (id, avatar) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("id", id);
    formData.append("avatar", avatar, avatar.name);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/update_image/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}


export const UpdateCMPLogo = async (id, Image) => {

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

export const RemoveUser = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/profile_action/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const Designation = [
    { label: "Office Clerk", value: 1 },
    { label: "Sales Executive", value: 2 },
    { label: "Store Keeper", value: 3 },
    { label: "Field Worker", value: 4 },
    { label: "Sales Manager", value: 5 },
    { label: "Area Manager", value: 6 },
    { label: "Branch Manager", value: 7 },

    { label: "Cashier", value: 8 }
]

export const Designation_CEO = [
    { label: "Office Clerk", value: 1 },
    { label: "Sales Executive", value: 2 },
    { label: "Store Keeper", value: 3 },
    { label: "Field Worker", value: 4 },

    { label: "Sales Manager", value: 5 },
    { label: "Area Manager", value: 6 },
    { label: "Branch Manager", value: 7 },

    { label: "Cashier", value: 8 },
    { label: "Accounts", value: 9 },
    { label: "Admin", value: 10 },
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


export const LoadBanks = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bank_lists/`, config);
        return res.data
    } catch (err) {
    }
}

export const getBranch = async (bank_name) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/branch_name/${bank_name}`, config);
        return res
    } catch (err) {
    }
}

export const SaveBank = async (AccName, AccNumber, BankID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("UserID", "");
    formData.append("AccName", AccName ? AccName : "");
    formData.append("AccNumber", AccNumber ? AccNumber : "");
    formData.append("BankID", BankID);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user_bank/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const BankUpdate = async (CompanyID, BranchID, UserID, AccName, AccNumber, BankID, UserBankID) => {

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
    formData.append("UserID", UserID);
    formData.append("AccName", AccName ? AccName : "");
    formData.append("AccNumber", AccNumber ? AccNumber : "");
    formData.append("BankID", BankID);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/user_bank/${UserBankID}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const RemoveBank = async (BankID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/user_bank/${BankID}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const SaveCMPBank = async (AccName, AccNumber, BankID, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("AccName", AccName ? AccName : "");
    formData.append("AccNumber", AccNumber ? AccNumber : "");
    formData.append("BankID", BankID);
    formData.append("Status", Status);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/cmp_bank/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const BankCMPUpdate = async (AccName, AccNumber, BankID, Status, id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("AccName", AccName ? AccName : "");
    formData.append("AccNumber", AccNumber ? AccNumber : "");
    formData.append("BankID", BankID);
    formData.append("Status", Status);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/cmp_bank/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const RemoveCMPBank = async (BankID) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/user_bank/${BankID}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const LoadMyUsers = async (sis_id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager_staff/${sis_id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadCounter = async (date_from, date_to, ModeFilter) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/counter_list/?date_from=${date_from}&date_to=${date_to}&mode=${ModeFilter}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UserProfile = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user_pro/${id}`, config);
        return res

    } catch (err) {
        return true;
    }
}

export const AllProductList = async (SupplierID) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sup_product_list/${SupplierID}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const SupplierProductDropdown = async (SupplierID) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchase_pro_list/${SupplierID}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const SupplierProductAll = async (SupplierID) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/purchase_pro_list_all/${SupplierID}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const LoadAccounts = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/accounts/`, config);
        return res.data
    } catch (err) {
    }
}

export const SaveAcc = async (SectorID, ParentID, COA_ID, COA_Title, COA_Code, TransType, AccType, Terms, GrossProfit, MoneyType, TreeLevel) => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID);
    formData.append("ParentID", ParentID);
    formData.append("CoaID", COA_ID);
    formData.append("COA_Title", COA_Title);
    formData.append("COA_Code", COA_Code);
    formData.append("TransType", TransType);
    formData.append("AccType", AccType);
    formData.append("Terms", Terms);
    formData.append("GrossProfit", GrossProfit);
    formData.append("MoneyType", MoneyType);
    formData.append("TreeLevel", TreeLevel);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateAcc = async (ParentID, COA_ID, COA_Title, COA_Code, TransType, AccType, Terms, GrossProfit, MoneyType, TreeLevel, id) => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("ParentID", ParentID);
    formData.append("COA_ID", COA_ID);
    formData.append("COA_Title", COA_Title);
    formData.append("COA_Code", COA_Code);
    formData.append("TransType", TransType);
    formData.append("AccType", AccType);
    formData.append("Terms", Terms);
    formData.append("GrossProfit", GrossProfit);
    formData.append("MoneyType", MoneyType);
    formData.append("TreeLevel", TreeLevel);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/accounts/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const RemoveAcc = async (id) => {



    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/accounts/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const LoadAccount = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_acc/`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const LoadCostAccount = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_cost_acc/`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const LoadMainAcc = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_acc/`, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const VoucherSave = async (SectorID, Date, VoucherType, Name, PaymentMethod, Narration, Reference, Count, Bank, ACName, ACNumber, ChequeNo, TrxNo, AccData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("SectorID", SectorID && SectorID.value);
    formData.append("Date", Date);
    formData.append("VoucherType", VoucherType);
    formData.append("Consignee", Name);
    formData.append("PaymentMethod", PaymentMethod);
    formData.append("Narration", Narration);
    formData.append("Reference", Reference);
    formData.append("Count", Count);

    if (VoucherType.value === "2") {
        formData.append("FrmBank", Bank);
        formData.append("FrmACName", ACName);
        formData.append("FrmACNumber", ACNumber);
        formData.append("FrmChequeNo", ChequeNo);
        formData.append("TrxNo", TrxNo);
    }
    else if (VoucherType.value === "4") {
        formData.append("ToBank", Bank);
        formData.append("ToACName", ACName);
        formData.append("ToACNumber", ACNumber);
        formData.append("ToChequeNo", ChequeNo);
        formData.append("TrxNo", TrxNo);
    }

    Object.keys(AccData).map(e => {
        formData.append(`VMapData[${e}]SLNo`, AccData[e].SLNo);
        formData.append(`VMapData[${e}]SupplierID`, AccData[e].SupplierID === undefined ? "" : AccData[e].SupplierID);
        formData.append(`VMapData[${e}]StaffID`, AccData[e].StaffID === undefined ? "" : AccData[e].StaffID);
        formData.append(`VMapData[${e}]PartyID`, AccData[e].PartyID === undefined ? "" : AccData[e].PartyID);
        formData.append(`VMapData[${e}]COA_Code`, AccData[e].COA_Code);
        formData.append(`VMapData[${e}]COA`, AccData[e].COA_ID);
        formData.append(`VMapData[${e}]DR`, AccData[e].Debit);
        formData.append(`VMapData[${e}]CR`, AccData[e].Credit);
    });

    for (var pair of formData.entries()) {
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/voucher/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const AccJournal = async (Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_journal/${Date}`, config);
        return res.data
    } catch (err) {
    }
}

export const DeleteJournal = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/voucher/${id}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const LoadBranch = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/branch_acc/`, config);
        return res.data
    } catch (err) {
    }
}

export const BranchAcc = async (Cash, Sell, Purchase, Payable, Receivable, BatchSell, ProductSent, Stock, BatchPayment, BatchPaymentPayable, SavingPayment, SavingPaymentPayable, BranchID) => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("CashAC", Cash);
    formData.append("SellAC", Sell);
    formData.append("PurchaseAC", Purchase);
    formData.append("PayableAC", Payable);
    formData.append("ReceivableAC", Receivable);
    formData.append("BatchSellAC", BatchSell);
    formData.append("ProductSentAC", ProductSent);
    formData.append("StockAC", Stock);
    formData.append("BatchPaymentAC", BatchPayment);
    formData.append("BatchPaymentPayableAC", BatchPaymentPayable);
    formData.append("SavingPaymentAC", SavingPayment);
    formData.append("SavingPaymentPayableAC", SavingPaymentPayable);
    formData.append("BranchID", BranchID);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/branch_acc/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchProfitMargin = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profit_margin/`, config);
        return res.data
    } catch (err) {
    }
}

export const SaveMargin = async (Title, ProfitMargin, Currency, Operation, Status) => {

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
    formData.append("ProfitMargin", ProfitMargin);
    formData.append("Currency", Currency);
    formData.append("Operation", Operation);
    formData.append("Status", Status);

    for (var pair of formData.entries()) {

    }
    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/profit_margin/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdateProfitMargin = async (Title, ProfitMargin, Currency, Operation, Status, id) => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("ProfitMargin", ProfitMargin);
    formData.append("Currency", Currency);
    formData.append("Operation", Operation);
    formData.append("Status", Status);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profit_margin/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const DeleteProfitMargin = async (id) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/profit_margin/${id}/`, config);

        return res.data
    } catch (err) {
        return true
    }
}


export const FetchMargin = async (Operation) => {


    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/margin_list/${Operation}`, config);


        return res.data
    } catch (err) {
        return true;
    }
}


export const SaveBisBank = async (UserID, BisID, AccName, AccNumber, BankID, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("UserID", UserID);
    formData.append("BusinessID", BisID);
    formData.append("AccName", AccName);
    formData.append("AccNumber", AccNumber);
    formData.append("BankID", BankID);
    formData.append("Status", Status);

    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/usr_bis_bank/`, formData, config);

        return res.data
    } catch (err) {
        return true
    }
}

export const RemoveBisBank = async (BankID) => {



    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/usr_bis_bank/${BankID}/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const FetchBisBank = async (BisID) => {


    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_usr_bis_bank/${BisID}`, config);


        return res.data
    } catch (err) {
        return true;
    }
}

export const EnableBank = async (id, Status) => {

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
    try {
        for (var pair of formData.entries()) {

        }
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/usr_bis_bank/${id}/`, formData, config);

        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchInvoiceNo = async () => {
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

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_invoice_no/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchVoucherNo = async (VoucherType) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_voucher_no/${VoucherType}`, config);

        return res.data
    } catch (err) {


        return true;
    }
}

export const Invoice = async (CounterID, PartyID, OrderID, Date, VatRate, Vat, Discount, Shipping, Payment, GrandTotal, Cash, Bank, PaidAmount, Due, RefundAmount, Count, SellData) => {
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
    formData.append("CounterID", CounterID);
    formData.append("PartyID", (PartyID?.value) || '');
    formData.append("OrderID", OrderID);
    formData.append("Date", Date);
    formData.append("VatRate", parseFloat(VatRate).toFixed(2));
    formData.append("Vat", parseFloat(Vat).toFixed(2));
    formData.append("Discount", parseFloat(Discount || 0.00).toFixed(2));
    formData.append("Shipping", parseFloat(Shipping || 0.00).toFixed(2));
    formData.append("Payment", parseInt(Payment.value));
    formData.append("GrandTotal", parseFloat(GrandTotal).toFixed(2));
    formData.append("Cash", parseFloat(Cash || 0.00).toFixed(2));
    formData.append("Bank", parseFloat(Bank || 0.00).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));
    formData.append("RefundAmount", parseFloat(RefundAmount).toFixed(2));
    formData.append("ItemCount", Count);

    for (let i = 0; i < SellData.length; i++) {
        const sell = SellData[i];
        formData.append(`SellMapData[${i}]SLNo`, sell.SLNo);
        formData.append(`SellMapData[${i}]ItemID`, sell.ItemID);
        formData.append(`SellMapData[${i}]UnitName`, sell.UnitName);
        formData.append(`SellMapData[${i}]UnitQty`, parseFloat(sell.UnitQty).toFixed(2));
        formData.append(`SellMapData[${i}]UnitWeight`, parseFloat(sell.UnitWeight).toFixed(3));
        formData.append(`SellMapData[${i}]UnitPrice`, parseFloat(sell.UnitPrice).toFixed(2));
        formData.append(`SellMapData[${i}]Weight`, parseFloat(sell.Weight).toFixed(3));
        formData.append(`SellMapData[${i}]Qty`, parseFloat(sell.Qty).toFixed(2));
        formData.append(`SellMapData[${i}]Rate`, parseFloat(sell.Rate).toFixed(4));
        formData.append(`SellMapData[${i}]Remark`, sell.Remark);
        formData.append(`SellMapData[${i}]SubTotal`, parseFloat(sell.SubTotal).toFixed(2));
        formData.append(`SellMapData[${i}]Available`, parseFloat(sell.Available).toFixed(2));
        formData.append(`SellMapData[${i}]Status`, 1);
    }

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sale/`, formData, config);
        return res.data;
    } catch (err) {
        return true;
    }
};

export const BusinessType = async (Type) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/business_type_load/${Type}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchBisLadger = async (BusinessID, date_from, date_to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/business_ladger/${BusinessID}/${date_from}/${date_to}`, config);

        return res
    } catch (err) {
        return true;
    }
}

export const FetchSupplierLadger = async (SupplierID, date_from, date_to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/supplier_ladger/${SupplierID}/${date_from}/${date_to}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchCashFlow = async (COA_ID, Date) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cash_flow/${COA_ID}/${Date}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const FetchBranch = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/branch_list/`, config);
        return res.data
    } catch (err) {
    }
}

export const FetchConcern = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/concern_list/`, config);
        ;
        return res.data
    } catch (err) {
    }
}

export const FetchSector = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sector_list/`, config);
        return res.data
    } catch (err) {
    }
}

export const FetchSisterSector = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sister_sectors/${id}`, config);
        return res.data
    } catch (err) {
    }
}

export const FetchDesignation = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/designation_list/`, config);
        return res.data
    } catch (err) {
    }
}

export const LoadParty = async () => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/party/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const SaveParty = async (Title, Name, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status, RepID) => {
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
    formData.append("Name", Name);
    formData.append("Address", Address);
    formData.append("Contact", Contact);
    formData.append("SCMoney", SCMoney);
    formData.append("Limit", Limit);
    formData.append("Balance", Balance);
    formData.append("Target", Target);
    formData.append("Currency", Currency);
    formData.append("FarmReg", FarmReg);
    formData.append("BlankCheque", BlankCheque);
    formData.append("Agreement", Agreement);
    formData.append("Status", 1);
    formData.append("RepID", RepID);

    try {
        for (var pair of formData.entries()) {
        }
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/party/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const GetParty = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_party/${id}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const GetPartyAdmin = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_admin_party/${id}`, config);
        return res.data[0]
    } catch (err) {
        return true;
    }
}

export const FetchPartyList = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/party_list/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchSectorPartyList = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sector_party_list/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const UpdatePartyInfo = async (id, Title, Name) => {
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
    formData.append("Name", Name);

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/party/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const CreatePartySector = async (id, SectorID, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("PartyID", id.value);
    formData.append("SectorID", SectorID);
    formData.append("Address", Address);
    formData.append("Contact", Contact);
    formData.append("SCMoney", SCMoney);
    formData.append("Limit", Limit);
    formData.append("Balance", Balance);
    formData.append("Target", Target);
    formData.append("Currency", Currency);
    formData.append("FarmReg", FarmReg ? 1 : 0);
    formData.append("BlankCheque", BlankCheque ? 1 : 0);
    formData.append("Agreement", Agreement ? 1 : 0);
    formData.append("Status", parseInt(Status.value));

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/my_party_sector/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const UpdatePartySector = async (id, Address, Contact, SCMoney, Limit, Balance, Target, Currency, FarmReg, BlankCheque, Agreement, Status) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("Address", Address);
    formData.append("Contact", Contact);
    formData.append("SCMoney", SCMoney);
    formData.append("Limit", Limit);
    formData.append("Balance", Balance);
    formData.append("Target", Target);
    formData.append("Currency", Currency);
    formData.append("FarmReg", FarmReg ? 1 : 0);
    formData.append("BlankCheque", BlankCheque ? 1 : 0);
    formData.append("Agreement", Agreement ? 1 : 0);
    formData.append("Status", parseInt(Status.value));

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/my_party_sector/${id}/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const FetchBankAcc = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_cm_bank_ac/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const RunningBalance = async (Date) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/balance/${Date}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const fetchServerTimestamp = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/timestamp/`);
        const timestamp = await response.json();
        return timestamp;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const AddNote = async (PartyID, SupplierID, NoteType, InvoiceID, PurchaseNo, Details, Advice, Count, Amount, Status) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    const formData = new FormData();
    formData.append("PartyID", PartyID);
    formData.append("SupplierID", SupplierID);
    formData.append("NoteType", NoteType);
    formData.append("InvoiceNo", InvoiceID);
    formData.append("PurchaseNo", PurchaseNo);
    formData.append("Details", Details);
    formData.append("Advice", Advice);
    formData.append("Count", Count);
    formData.append("Amount", parseFloat(Amount).toFixed(2));
    formData.append("Status", parseInt(Status));

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/note/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const InvoicePayment = async (id, Payment, Discount, PaidAmount, Due) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
        params: { id: id }
    }

    const formData = new FormData();
    formData.append("Payment", parseInt(Payment));
    formData.append("Discount", parseFloat(Discount).toFixed(2));
    formData.append("PaidAmount", parseFloat(PaidAmount).toFixed(2));
    formData.append("Due", parseFloat(Due).toFixed(2));

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/sup_inv_payment/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const CounterVoucherSave = async (Date, vla, No, PaidAmount, CounterID) => {
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
    formData.append("vla", JSON.stringify(vla));
    formData.append("CounterNo", No);
    formData.append("CounterID", CounterID);
    formData.append("Sell", PaidAmount);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/voucher_counter/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const AllConsignee = async (type) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/load_consignee/${type}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const CostVoucher = async (COA_Code, COAID, Amount, PaymentMethod, Staff, Consignee, Reference, Narration) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("COA", COAID);
    formData.append("COA_Code", COA_Code);
    formData.append("DR", Amount);
    formData.append("StaffID", Staff);
    formData.append("Consignee", Consignee);
    formData.append("PaymentMethod", PaymentMethod);
    formData.append("Narration", Narration);
    formData.append("Reference", Reference);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/cost_voucher/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const LoadReceipt = async (invoice_no) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment_receipt_list/${invoice_no}`, config);
        ;
        return res.data
    } catch (err) {
    }
}

export const LoadPaymentVoucher = async (invoice_no) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment_voucher_list/${invoice_no}`, config);

        return res.data
    } catch (err) {
    }
}

export const CreateDumpster = async (id, Date, Type, Qty, Weight, Amount, Remark, SectorID) => {
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
    formData.append("Date", Date);
    formData.append("Type", Type);
    formData.append("Qty", parseFloat(Qty).toFixed(2));
    formData.append("Weight", parseFloat(Weight).toFixed(3));
    formData.append("Amount", parseFloat(Amount).toFixed(2));
    formData.append("Narration", Remark);
    formData.append("SectorID", SectorID);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/dumposter/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}



export const FetchUsrLadger = async (UserID, date_from, date_to) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user_ladger/${UserID}/${date_from}/${date_to}`, config);

        return res
    } catch (err) {
        return true;
    }
}


export const InitProductList = async (SupplierID) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/init_pro_list/${SupplierID}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const VerifyUser = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/verify_me/${id}`, config);
        return res
    } catch (err) {
        return true;
    }
}

export const LoadIncome = async (date_from, date_to, sis_id, sect_id) => {
    console.log("sis: ", sis_id);
    console.log("sect: ", sect_id);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        },
        params: {
            date_from: date_from,
            date_to: date_to,
            sis_id: sis_id?.value,
            sect_id: sect_id?.value
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/statement/income/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}
