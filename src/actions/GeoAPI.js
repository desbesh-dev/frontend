import { DISPLAY_OVERLAY } from './types';
import axios from 'axios';

export const LoadDivision = async () => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/division/`, config);

        return res.data.Data
    } catch (err) {
    }
}

export const getZila = async (e) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/zila/${e.value}`, config);
        return res.data.Data
    } catch (err) {
    }
}

export const getUpazila = async (e) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/upazila/${e.value}`, config);
        return res.data.Data
    } catch (err) {
    }
}

export const getUnion = async (e, ZilaCode) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/union/${ZilaCode}/${e.value}`, config);
        return res.data.Data
    } catch (err) {
    }
}