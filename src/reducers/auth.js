import {
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    DISPLAY_OVERLAY,
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
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    user: JSON.parse(localStorage.getItem("user")),
    scale: JSON.parse(localStorage.getItem("scale")),
    no: JSON.parse(localStorage.getItem("no")),
    cat: JSON.parse(localStorage.getItem("cat")),
    accounts: JSON.parse(localStorage.getItem("accounts")),
    error: false,
    message: "",
    OverlayDisplay: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
            }
        case LOGIN_SUCCESS:
        case GOOGLE_AUTH_SUCCESS:
        case FACEBOOK_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                access: payload.access,
                refresh: payload.refresh,
                scale: payload.scale,
                no: payload.no,
                cat: payload.cat,
                message: payload.message
            }
        case USER_WAITING:
            return {
                ...state,
                scale: payload.scale,
                no: payload.no,
                cat: payload.cat,
                message: payload.message,
                error: payload.error
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                scale: payload.scale,
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload.user,
                scale: payload.scale,
                no: payload.no,
                cat: payload.cat,
                message: payload.message
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                user: null,
                scale: null,
                no: null,
                cat: null,
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null,
                scale: null,
                no: null,
                cat: null,
            }
        case GOOGLE_AUTH_FAIL:
        case FACEBOOK_AUTH_FAIL:
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('user');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.setItem('scale', null);
            localStorage.setItem('no', null);
            localStorage.setItem('cat', null);
            return {
                ...state,
                access: null,
                refresh: null,
                user: null,
                scale: null,
                no: null,
                cat: null,
                message: payload ? payload.message : null,
                error: payload ? payload.error : null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        case DISPLAY_OVERLAY:
            return {
                ...state,
                OverlayDisplay: payload
            }
        default:
            return state
    }
};
