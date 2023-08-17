import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { login } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const Login = ({ display, login, isAuthenticated, error, message, scale, sub_scale }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        MobileNo: '',
        password: '',
        rememberme: false
    });

    useEffect(() => {
        if (localStorage.getItem('MobileNo')) {
            setFormData({ ...formData, rememberme: true, MobileNo: localStorage.getItem('MobileNo') });
        } else {
            setFormData({ ...formData, rememberme: false });
        }
    }, [])

    const history = useHistory();
    const { MobileNo, password, rememberme } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        login(MobileNo, password, rememberme);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const handleChange = (e) => {
        if (!e.target.value) {
            localStorage.removeItem('MobileNo');
            setFormData({
                ...formData, rememberme: false, MobileNo: '', password: ''
            });
        }
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }

    const continueWithGoogle = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };

    const continueWithFacebook = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)

            window.location.replace(res.data.authorization_url);
        } catch (err) {

        }
    };


    // if (scale === 6 || (scale === 3 && (sub_scale === 1 || sub_scale === 2 || sub_scale === 3 || sub_scale === 5 || sub_scale === 6 || sub_scale === 7 || sub_scale === 9 || sub_scale === 10) && sub_scale !== 4)) {
    //     return <Redirect to='/wellcome' />
    // } else if (scale === 3 && sub_scale === 4) {
    //     return <Redirect to='/field_work' />
    // }


    return (
        <div className="header">
            <div className="col-sm-12 col-md-10 col-lg-8 mx-auto d-table h-100">
                <div className="d-table-cell align-middle">
                    <h5 className='text-danger'>{error ? message : null}</h5>
                    <h1>Sign In</h1>
                    <p>Sign into your Account</p>
                    <form onSubmit={e => onSubmit(e)}>
                        <div className='form-group my-2'>
                            <input
                                style={{ borderRadius: '20px' }}
                                className='form-control form-rounded pl-3'
                                type='phone'
                                placeholder='User Id'
                                name='MobileNo'
                                value={MobileNo}
                                defaultValue={rememberme ? localStorage.getItem('MobileNo') : MobileNo}
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
                        <div className='form-group  my-2'>
                            <input
                                className='form-control form-rounded pl-3'
                                type='password'
                                placeholder='Password'
                                name='password'
                                value={password}
                                onChange={e => { handleChange({ target: { name: e.target.name, value: e.target.value } }); }}
                                minLength='6'
                                maxLength='12'
                                required
                            />
                        </div>
                        <div className='form-check  my-2'>
                            <input
                                type="checkbox"
                                name="rememberme"
                                id="rememberme"
                                className="form-check-input"
                                checked={rememberme}
                                onChange={(e) => {
                                    handleChange({
                                        target: {
                                            name: e.target.name,
                                            value: e.target.checked,
                                        },
                                    });
                                }}
                            />
                            <label for="rememberme">Remember me</label>
                        </div>
                        <button className='btn btn-primary' type='submit'>Login</button>
                    </form>
                    {/* <button className='btn btn-danger mt-3' onClick={continueWithGoogle}>
                            Continue With Google
                        </button>
                        <br />
                        <button className='btn btn-primary mt-3' onClick={continueWithFacebook}>
                            Continue With Facebook
                        </button>
                        <p className='mt-3'>
                            Don't have an account? <Link to='/signup'>Sign Up</Link>
                        </p> */}
                    <p className='mt-3'>
                        Forgot your password? <Link to='/reset-password'>Reset password</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
    message: state.auth.message,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { login })(Login);
