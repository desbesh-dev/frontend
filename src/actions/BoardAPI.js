import { DISPLAY_OVERLAY } from './types';
import axios from 'axios';
import { checkToken } from './auth';
import { useDispatch } from 'react-redux';

export const FetchBoard = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contract_board/`, config);
        return res.data
    } catch (err) {
        return true;
    }
}
export const FetchSummery = async (Condition, DateFrom, DateTo) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contract_summery/${Condition}/${DateFrom}/${DateTo}`, config);
        return res.data
    } catch (err) {
        return true;
    }
}

export const FetchFCRRank = async (Batch, Year) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fcr_ranking/${Batch}/${Year}`, config);
        return res
    } catch (err) {
    }
}

export const FetchLucyRank = async (Batch, Year) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lucy_ranking/${Batch}/${Year}`, config);
        return res
    } catch (err) {
    }
}