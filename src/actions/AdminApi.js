import { DISPLAY_OVERLAY } from './types';
import axios from 'axios';
import { checkToken } from './auth';
import { useDispatch } from 'react-redux';

export const FetchBis = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/adm_business/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const SaveCompany = async (Name, ShortCode, DomainName, Established, BusinessEmail, ContactNo, LogoPrv, Logo, FirstName, LastName, email, MobileNo, password, con_pass, FullName, Nid_BirthNo, DOB, FatherName, MotherName, HoldingNo, WardNo, VillageName, Union, PostalCode, Upazila, Zila, Division, Nationality, Religion, Gender, Occupation, EducationalQualification, Image, RefID, RepID, NIDCopy, Agreement, BankCheque, TradeLicence, is_block, is_active, is_ceo, ImagePrv) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const Address = WardNo + ", " + Union + ", " + Upazila + ", " + Zila + ", " + Division
    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("ShortCode", ShortCode);
    formData.append("Domain", DomainName);
    formData.append("Established", Established);
    formData.append("BusinessEmail", BusinessEmail);
    formData.append("ContactNo", ContactNo);
    formData.append("Address", Address);
    if (LogoPrv) { formData.append("Logo", Logo, Logo.name); }
    formData.append("BranchEmail", BusinessEmail);
    formData.append("FirstName", FirstName);
    formData.append("LastName", LastName);
    formData.append("email", email);
    formData.append("MobileNo", MobileNo);
    formData.append("password", password);
    formData.append("con_pass", con_pass);
    formData.append("FullName", FullName);
    formData.append("Nid_BirthNo", Nid_BirthNo);
    formData.append("DOB", DOB);
    formData.append("FatherName", FatherName);
    formData.append("MotherName", MotherName);
    formData.append("HoldingNo", HoldingNo);
    formData.append("WardNo", WardNo);
    formData.append("VillageName", VillageName);
    formData.append("Union", Union);
    formData.append("PostalCode", PostalCode);
    formData.append("Upazila", Upazila);
    formData.append("Zila", Zila);
    formData.append("Division", Division);
    formData.append("Nationality", Nationality);
    formData.append("Religion", Religion);
    formData.append("Gender", Gender);
    formData.append("Occupation", Occupation);
    formData.append("EducationalQualification", EducationalQualification);
    if (ImagePrv) { formData.append("Image", Image, Image.name); }
    formData.append("RefID", RefID);
    formData.append("RepID", RepID);
    formData.append("NIDCopy", NIDCopy);
    formData.append("Agreement", Agreement);
    formData.append("BankCheque", BankCheque);
    formData.append("FarmRegCopy", TradeLicence);

    formData.append("is_block", is_block);
    formData.append("is_active", is_active);
    formData.append("is_ceo", is_ceo);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/adm_business/`, formData, config);
        return res.data
    } catch (err) {
        return true;
    }
}


export const FetchUsers = async () => {
    await checkToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
            // 'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/adm_users/`, config);
        return res.data
    } catch (err) {
        return true
    }
}

export const ForceLogoutUser = async (refresh) => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const formData = new FormData();
    formData.append("refresh_token", refresh);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/force_user_logout/`, formData, config);
        return res
    } catch (err) {
        return true;
    }
}

export const LogOutAllDevice = async () => {
    // const dispatch = useDispatch();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/logout_all/`, config);
        return res
    } catch (err) {
        return true;
    }
}