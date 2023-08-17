import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import logo from '../../assets/logo.png';
import wallpaper from '../../assets/wallpaper.jpg';

const Home = ({ data, login, error, message, scale, sub_scale }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberme: false
    });

    useEffect(() => {
        if (localStorage.getItem('username')) {
            setFormData({ ...formData, rememberme: true, username: localStorage.getItem('username') });
        } else {
            setFormData({ ...formData, rememberme: false });
        }
    }, [])

    const { username, password, rememberme } = formData;

    const onSubmit = e => {
        e.preventDefault();
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        login(username, password, rememberme);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const handleChange = (e) => {
        if (!e.target.value) {
            localStorage.removeItem('username');
            setFormData({
                ...formData, rememberme: false, username: '', password: ''
            });
        }
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }

    return (
        <div className='h-100' style={{ zIndex: "1000" }}>
            <div className="col-md-12 d-flex justify-content-center align-middle bg-white" style={{ zIndex: "1000" }}>
                <div className="col-md-10 align-middle p-0" style={{ zIndex: "1000" }}>
                    <div className='row m-0 p-0 d-flex justify-content-between align-middle'>
                        <div className="col-md-3 px-0 d-flex align-items-center" style={{ zIndex: "1000" }}>
                            <img src={logo} className="img-fluid my-auto" width="40" height="80" alt="Softapoul" />
                            <span className='fs-2 fw-bolder text-nowrap'>DESH BESH ENTERPRISE LTD</span>
                        </div>
                        <div className="col-md-7 px-0" style={{ zIndex: "1000" }}>
                            <div className='d-flex flex-wrap align-middle align-content-center justify-content-between bg-white h-100'>
                                <p className='fs-5 m-0 fw-bold my-auto no-wrap'><i className="fad fa-phone-office fa-flip-horizontal text-dark px-2"></i><span className='fw-bolder'>Office</span> +675 3254100 </p>
                                &nbsp;
                                <p className='fs-5 m-0 fw-bold my-auto no-wrap'><i className="fad fa-user-headset fa-flip-horizontal text-dark px-2"></i><span className='fw-bolder'>Support</span> +675 3254100 </p>
                                <p className='fs-5 m-0 fw-bold my-auto no-wrap mx-2'> <i className="fad fa-mail-bulk text-dark px-2"></i> info@deshbesh.com</p>
                                <p className='fs-5 m-0 fw-bold my-auto no-wrap mx-2'> <i className="fad fa-envelope-open-text text-dark px-2"></i> support@deshbesh.com</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex justify-content-center align-middle p-0" style={{ zIndex: "1000", backgroundColor: "rgba(255, 204, 0, 0.1)" }}>
                {/* <span className="d-flex justify-content-center text-center text-uppercase">Deshbesh Group of Company Ltd.</span> */}
                <div className="col-md-10 align-middle">
                    <marquee
                        behavior="scroll"
                        direction="left"
                        scrollamount="8"
                        // onMouseOver="stop();" onMouseOut="start();"
                        className="display-6 align-self-center">Deshbesh Enterprise Resource Planing (ERP) v1.0.0
                    </marquee>
                </div>
            </div>

            <div className="col-md-12 d-flex justify-content-center align-middle" style={{ zIndex: "1000" }}>
                <div className="col-md-10 align-middle pb-5" style={{ zIndex: "1000", backgroundImage: `url(${wallpaper})` }}>

                    <div className='row m-4 p-0 d-flex justify-content-end align-middle'>
                        <div className="col-md-8 d-flex flex-column px-0 py-1 justify-content-center align-items-center">
                            <p className="d-flex fs-1 fw-bold justify-content-center text-center text-dark">Deshbesh Group of Company Ltd.</p>
                            <p className='display-2'>Since 1993</p>
                            <p className='text-center border border-white shadow-sm px-2' style={{ borderRadius: "15px" }}>P.O. Box 262, Boroko, National Capital District, Papua New Guinea</p>
                        </div>

                        <div className="col-md-4 border border-light px-0 py-4 align-middle" style={{ borderRadius: "15px", zIndex: "1000", backgroundColor: "rgba(255, 204, 0, 0.4)" }}>
                            <div className="col-sm-12 col-md-10 col-lg-10 mx-auto d-table h-100">
                                <div className="d-table-cell align-middle">
                                    <h5 className='text-danger'>{error ? message : null}</h5>
                                    <h1>Sign In</h1>
                                    <p className='text-muted'>Sign in with your data that you entered during your registration.</p>
                                    <form onSubmit={e => onSubmit(e)}>
                                        <div className='form-group my-2'>
                                            <input
                                                style={{ borderRadius: '20px' }}
                                                className='form-control form-rounded pl-3'
                                                type='phone'
                                                placeholder='User Id'
                                                name='username'
                                                value={username}
                                                defaultValue={rememberme ? localStorage.getItem('username') : username}
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
                                        <button className='btn btn-dark' type='submit'>Submit</button>
                                    </form>

                                    <p className='mt-3'>
                                        Forgot your password? <Link to='/reset-password'>Reset password</Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div className="col-md-12 d-flex justify-content-center align-middle mb-3" style={{ zIndex: "1000", marginTop: "-30px" }}>
                <div className="col-md-10 align-middle p-0" style={{ zIndex: "1000" }}>
                    <div className='row m-0 p-0 d-flex justify-content-around align-middle'>
                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center bg-gradient bg-light border border-1 border-white align-items-center" style={{ borderRadius: "8px" }}>
                            <div className='d-flex justify-content-center flex-column'>
                                <i className="fs-2 fad fa-industry-alt text-dark text-center px-2"></i>
                                <span className="d-flex fs-4 fw-bold justify-content-center text-center text-dark text-uppercase px-2">Manufacturing</span>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center bg-gradient bg-light border border-1 border-white align-items-center" style={{ borderRadius: "8px" }}>
                            <div className='d-flex justify-content-center flex-column'>
                                <i className="fs-2 fad fa-analytics text-dark text-center px-2"></i>
                                <span className="d-flex fs-4 fw-bold justify-content-center text-center text-dark text-uppercase px-2">Trade & Commerce</span>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center bg-gradient bg-light border border-1 border-white align-items-center" style={{ borderRadius: "8px" }}>
                            <div className='d-flex justify-content-center flex-column'>
                                <i className="fs-2 fad fa-exchange text-dark text-center px-2"></i>
                                <span className="d-flex fs-4 fw-bold justify-content-center text-center text-dark text-uppercase px-2">Import & Exports</span>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center bg-gradient bg-light border border-1 border-white align-items-center" style={{ borderRadius: "8px" }}>
                            <div className='d-flex justify-content-center flex-column'>
                                <i className="fs-2 fad fa-dolly-flatbed-alt text-dark text-center px-2"></i>
                                <span className="d-flex fs-4 fw-bold justify-content-center text-center text-dark text-uppercase px-2">Supermarkets</span>
                            </div>
                        </div>

                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center bg-gradient bg-light border border-1 border-white align-items-center" style={{ borderRadius: "8px" }}>
                            <div className='d-flex justify-content-center flex-column'>
                                <i className="fs-2 fad fa-building text-dark text-center px-2"></i>
                                <span className="d-flex fs-4 fw-bold justify-content-center text-center text-dark text-uppercase px-2">Apartments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 d-flex justify-content-center align-middle" style={{ zIndex: "1000" }}>
                <div className="col-md-10 align-middle p-0" style={{ zIndex: "1000" }}>
                    <div className='row mt-2 mx-0 p-0 d-flex justify-content-between align-middle'>
                        <div className="col-md-3 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Gordons Wholesale 01</span>
                        </div>
                        <div className="col-md-3 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Gordons Wholesale 02, Kaibar & Bakery</span>
                        </div>
                        <div className="col-md-2 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Central Super Market</span>
                        </div>
                        <div className="col-md-3 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Substation, Kaibar & Bakery</span>
                        </div>
                    </div>
                    <div className='row mx-0 p-0 d-flex justify-content-between align-middle'>
                        <div className="col-md-6 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Konedobu Supermarket, Kaibar & Bakery</span>
                        </div>
                        <div className="col-md-5 d-flex px-0 py-1 justify-content-center align-items-center border border-white shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.5)" }}>
                            <span className="d-flex fs-4 fw-normal justify-content-center text-center text-dark px-2">Deshbesh Tokarara Containar Yard</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    data: state.auth.user,
    display: state.OverlayDisplay,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
    message: state.auth.message,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});
export default connect(mapStateToProps, { login })(Home);
