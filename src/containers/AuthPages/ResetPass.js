import { Link, Redirect, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { login } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { InfoMessage } from './ModalForm';
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import { ResetPass } from '../../actions/APIHandler';

const Login = ({ scale, sub_scale, user, list, setList }) => {

    const dispatch = useDispatch();
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const [Error, setError] = useState({});
    let toastProperties = null;

    const [formData, setFormData] = useState({
        old_pass: '',
        con_pass: '',
        new_pass: ''
    });

    const history = useHistory();
    const { old_pass, con_pass, new_pass } = formData;


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if ((user === "" || user === undefined || old_pass === "" || old_pass === undefined || con_pass === "" || con_pass === undefined || new_pass === "" || new_pass === undefined) || (new_pass !== con_pass)) {
            setInfoModalShow(true)
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            const result = await ResetPass(user.id, old_pass, new_pass, con_pass);


            if (result !== true) {
                if (result.user_error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({
                            ...updatedState,
                        });
                    }
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])

                } else {
                    setList([...list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                    }])
                }
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            }
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        }
    };

    const handleChange = (e) => {

        if (!e.target.value) {
            localStorage.removeItem('old_pass');
            setFormData({
                ...formData, rememberme: false, old_pass: '', new_pass: ''
            });
        }
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });

    }


    return (
        <div className="row">
            <div className="row h-100">
                <div className="col-sm-12 col-md-10 col-lg-8 mx-auto d-table h-100">
                    <div className="d-table-cell align-middle">
                        <h1>Reset Password</h1>
                        <p>Please type your old password & fill your new one</p>
                        <form onSubmit={e => onSubmit(e)}>
                            <div className='form-group'>
                                <input
                                    style={{ borderRadius: '20px' }}
                                    className='form-control form-rounded pl-3'
                                    type='password'
                                    placeholder='Type old password'
                                    name='old_pass'
                                    value={old_pass}
                                    onChange={e => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    className='form-control form-rounded pl-3'
                                    type='password'
                                    placeholder='New Password'
                                    name='new_pass'
                                    value={new_pass}
                                    onChange={e => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    minLength='6'
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    className='form-control form-rounded pl-3'
                                    type='password'
                                    placeholder='Confirm password'
                                    name='con_pass'
                                    value={con_pass}
                                    onChange={e => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    minLength='6'
                                    required
                                />
                            </div>

                            <button className='btn btn-primary' type='submit'>Reset</button>
                        </form>
                    </div>
                </div>
            </div>
            <InfoMessage
                header="Invalid Data"
                body_header="Input data is not valid. Please fill input field correctly."
                body="Please fill all field correctly"
                show={InfoModalShow}
                onHide={() => setInfoModalShow(false)}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { login })(Login);
