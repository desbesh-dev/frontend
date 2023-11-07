import { useState } from 'react';
import { connect } from 'react-redux';
import avatar from '../../../assets/avatar.jpg';
import "../../../hocs/css/menu.css";
import { CostVoucherModal } from '../../Accounts/Voucher/CostVoucherModal';
import Clock from '../Dashboard/Clock/clock';
import { BossMenu } from './BossMenu';
import { Manager_Menu } from './ManagerMenu';
import { SalesmanManu } from './SalesmanManu';
import { SectorIT } from './SectorIT';
import { YardManagerMenu } from './YardManagerMenu';

const Wellcome = ({ data, cat, no, setList, list }) => {
    // if (scale === 6 || (scale === 3 && (no === 1 || no === 2 || no === 3 || no === 5 || no === 6 || no === 7 || no === 9 || no === 10) && no !== 4)) {
    //     return <Redirect to='/wellcome' />
    // } else if (scale === 3 && no === 4) {
    //     return <Redirect to='/field_work' />
    // } else if (scale === null || no === null) {
    //     return <Redirect to='/home' />
    // }
    const [OpenModal, setOpenModal] = useState(false)
    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-4 bg-gradient maintxt align-items-center justify-content-center p-0">
                {data ?
                    <div className='row m-0 px-2 border-bottom border-2 align-items-center justify-content-center'>
                        <div className='col-md-4 order-2 order-lg-1 order-md-1 order-sm-1'>
                            <div className='d-flex align-items-center justify-content-start border border-3 border-white' style={{ borderRadius: "15px" }}>
                                <img src={data ? data.avatar ? process.env.REACT_APP_API_URL + data.avatar : avatar : avatar} className="img-fluid border" alt="avatar" style={{ width: "80px", height: "80px", borderRadius: "50px" }} />
                                <p className="fs-5 text-left justify-content-center fw-normal m-0 px-4">Welcome back, &nbsp;<p className="fw-bold m-0 p-0">{data.Name + "!"}</p> <small className="text-muted fs-6 text-center" style={{ borderRadius: "15px" }}>{data.Role.Title + " at " + data.Collocation.Sector}</small></p>
                            </div>
                        </div>
                        <div className='col-md-2 order-2 order-lg-1 order-md-1 order-sm-1'>
                            <div className='d-flex align-items-center justify-content-end' style={{ borderRadius: "15px" }}>
                                <Clock />
                            </div>
                        </div>
                        <div className='col-md-6 order-1 order-lg-3 order-md-3 order-sm-2'>
                            <div className='row align-items-center justify-content-end'>
                                <p className="display-5 d-flex justify-content-end text-success text-right m-0" style={{ fontFamily: "MyriadPro_bold" }}>{data.Collocation.Title}</p>
                                <small className="text-muted text-right border px-2 w-auto fs-6" style={{ borderRadius: "15px" }}>{data.Collocation.Location}</small>
                                <p className="blockquote-footer fs-2 d-flex justify-content-end text-success fw-normal" style={{ fontFamily: "Tahoma" }}>{data.Collocation.Sector + " Sector"}</p></div>
                        </div>

                    </div>
                    : null
                }
                <div className="col-md-12 d-flex justify-content-center align-middle p-0" style={{ zIndex: "999", backgroundColor: "rgba(255, 204, 0, 0.1)" }}>
                    <marquee
                        behavior="scroll"
                        direction="left"
                        scrollamount="8"
                        // onMouseOver="stop();" onMouseOut="start();"
                        className="display-6 align-self-center">Deshbesh Enterprise Resource Planing (ERP) v1.0.0 beta
                    </marquee>
                </div>


                <div className="pt-table desktop-768">
                    <div className="page-home relative">
                        <div className="overlay"></div>

                        <div className="container">
                            <div className="row justify-content-center align-items-center">
                                <div className="col-xs-12 col-md-offset-1 col-md-10 col-lg-offset-2 col-lg-8">
                                    <div className="home my-5 text-center"><span className="heading-page"> Main Menu</span></div>
                                    {
                                        (parseInt(cat) === 0 || parseInt(cat) === 2) ?
                                            parseInt(no) === 8 ? <Manager_Menu setOpenModal={setOpenModal} OpenModal={OpenModal} list={list} setList={setList} /> :
                                                parseInt(no) === 1 ? <BossMenu setOpenModal={setOpenModal} OpenModal={OpenModal} list={list} setList={setList} /> :
                                                    parseInt(no) === 11 ? <SectorIT /> :
                                                        parseInt(no) === 12 ? <SalesmanManu /> :
                                                            null
                                            : parseInt(cat) === 4 ? parseInt(no) === 8 ? <YardManagerMenu setOpenModal={setOpenModal} OpenModal={OpenModal} list={list} setList={setList} /> : null : null
                                    }

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <CostVoucherModal
                    list={list}
                    setList={setList}
                    show={OpenModal}
                    onHide={() => setOpenModal(false)}
                />


            </div>
        </div >
    )
}

const mapStateToProps = state => ({
    data: state.auth.user,
    display: state.OverlayDisplay,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
    message: state.auth.message,
    scale: state.auth.scale,
    no: state.auth.no,
    cat: state.auth.cat,
});
export default connect(mapStateToProps)(Wellcome);
