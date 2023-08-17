import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    GOOGLE_AUTH_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_SUCCESS,
    SIGNUP_FAIL,
    SIGNUP_SUCCESS,
    USER_LOADED_FAIL,
    USER_LOADED_SUCCESS,
    USER_WAITING
} from './types';

export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        // Retrieve the values from localStorage
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
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/home_api/`, config);
            if (res.data.error) {
                localStorage.clear()
                dispatch({ type: USER_WAITING, payload: res.data });
            } else {
                if ('scale' in res.data) {
                    localStorage.setItem("scale", JSON.stringify(res.data.scale));
                    localStorage.setItem("no", JSON.stringify(res.data.no));
                    localStorage.setItem("cat", JSON.stringify(res.data.cat));
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    dispatch({ type: USER_LOADED_SUCCESS, payload: res.data });
                } else {
                    localStorage.clear()
                    dispatch({ type: LOGIN_FAIL, payload: ({ "error": true, "message": "Unable to login. Please contact to the authority" }) })
                }
            }
        } catch (err) {
            localStorage.clear()
            dispatch({ type: USER_LOADED_FAIL });
        }
    } else {
        localStorage.removeItem('user');
        dispatch({ type: USER_LOADED_FAIL });
    }
};

export const googleAuthenticate = (state, code) => async dispatch => {
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`, config);

            dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(load_user());
        } catch (err) {
            dispatch({
                type: GOOGLE_AUTH_FAIL
            });
        }
    }
};

export const facebookAuthenticate = (state, code) => async dispatch => {
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?${formBody}`, config);

            dispatch({
                type: FACEBOOK_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(load_user());
        } catch (err) {
            dispatch({
                type: FACEBOOK_AUTH_FAIL
            });
        }
    }
};

export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (checkTokenExpiry()) {
            const body = JSON.stringify({ "refresh": localStorage.getItem('refresh') });
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/refresh_token/`, body, config)

                localStorage.setItem("access", res.data.access);
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } catch (err) {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } else {
            dispatch({
                type: AUTHENTICATED_SUCCESS
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};

export const checkToken = async () => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (checkTokenExpiry()) {
            const body = JSON.stringify({ "refresh": localStorage.getItem('refresh') });
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/refresh_token/`, body, config)
                localStorage.setItem("access", res.data.access);
            } catch (err) {
                <Link to="/" />
            }
        }

    } else {
        // <Link to="/" />
    }
};

export const getLoginToken = () => {
    return localStorage.getItem("access");
}

export const getRefreshToken = () => {
    return localStorage.getItem("refresh");
}

export const checkTokenExpiry = () => {
    var expire = false;
    var token = getLoginToken();
    var tokenArray = token.split(".");
    var jwt = JSON.parse(atob(tokenArray[1]));

    if (jwt && jwt.exp && Number.isFinite(jwt.exp)) {
        expire = jwt.exp * 1000;

    } else {
        expire = false;
    }

    if (!expire) {
        return false;
    }

    return Date.now() > expire;
}

export const login = (username, password, rememberme) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, password });
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/get_token/`, formData, config)
        if (res.status === 200) {
            if (!res.data.error) {
                if (!localStorage.getItem('access'))
                    localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);
                if (rememberme) {
                    localStorage.setItem("username", username);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('user');
                }
                dispatch({ type: LOGIN_SUCCESS, payload: res.data });
                dispatch(load_user());
            } else {
                dispatch({ type: USER_WAITING, payload: res.data });
            }
        } else {
            dispatch({ type: LOGIN_FAIL, payload: ({ "error": true, "message": "Invalid login details. Please try again later" }) })
        }
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: ({ "error": true, "message": "Invalid login details. Please try again later." }) })
    };
};

export const signup = (FirstName, LastName, email, password, con_pass, username, FullName, Nid_BirthNo, DOB, FatherName, MotherName, HoldingNo, WardNo, VillageName, Union, PostalCode, Upazila, Zila, Division, Nationality, Religion, Gender, Occupation, EducationalQualification, Image) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // const body = JSON.stringify({ FirstName, LastName, email, password, con_pass, username, FullName, Nid_BirthNo, DOB, FatherName, MotherName, HoldingNo, VillageName, Union, PostalCode, Upzila, Zila, Division, Nationality, Religion, Gender, Occupation, EducationalQualification, Image});
    const formData = new FormData();
    formData.append("FirstName", FirstName);
    formData.append("LastName", LastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("con_pass", con_pass);
    formData.append("username", username);
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
    formData.append("Image", Image, Image.name);
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/union/`, formData, config);
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
        return res
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        })
        return err.response.status
    }
};

export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);

        dispatch({
            type: ACTIVATION_SUCCESS,
        });
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
};

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_Password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uid, token, new_Password, re_new_Password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_Password, re_new_Password });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_Password_confirm/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};
