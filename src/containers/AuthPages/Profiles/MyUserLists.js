import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { findUnique, LoadMyUsers } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const MyUserLists = ({ display, user, scale, no }) => {
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();
    const [SearchKey, setSearchKey] = useState('')
    const [DesiFilter, setDesiFilter] = useState('')
    const [NationFilter, setNationFilter] = useState('')

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        MyUsers();
    }, [])


    const MyUsers = async () => {
        var result = await LoadMyUsers(user.Collocation.SisterID);
        setData(result.Staff);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_nationality = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Nationality) : null;

    let FilterProfiles
    FilterProfiles = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = NationFilter && DesiFilter && SearchKey ? item.Nationality === NationFilter.value && item.Designation === DesiFilter.value && item.id === SearchKey.value :
            NationFilter && DesiFilter ? item.Nationality === NationFilter.value && item.Designation === DesiFilter.value :
                NationFilter ? item.Nationality === NationFilter.value :
                    DesiFilter ? item.Designation === DesiFilter.value :
                        SearchKey ? item.id === SearchKey.value : 1

        return BothValue
    }).map(function ({ id, Name, Designation, Nationality, LastLogin, avatar }) {
        return { id, Name, Designation, Nationality, LastLogin, avatar };
    }) : null

    let unique_desi = Array.isArray(FilterProfiles) && FilterProfiles.length ? findUnique(FilterProfiles, d => d.Designation) : null;
    let unique_search = Array.isArray(FilterProfiles) && FilterProfiles.length ? findUnique(FilterProfiles, d => d.Name) : null;

    // let Count = Array.isArray(FilterProfiles) && FilterProfiles.length ? Object.values(FilterProfiles.reduce((c, { Status }) => {
    //     c[Status] = c[Status] || { name: Status === 1 ? "Subscriber: " : "Staff: ", value: 0 };
    //     c[Status].value++;
    //     return c;
    // }, {})) : null

    var h = window.innerHeight - 180;
    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center m-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Profile</Link></li>
                    </ol>
                </nav>

                <p className="display-6 d-flex justify-content-center">My Staff List</p>
            </div>

            <div className="col-lg-8 h-100 p-0">
                <div className="row d-flex bg-white mx-auto">

                    <div className="d-flex justify-content-between p-0">

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button className="btn rounded-0 rounded-start border-right d-flex align-items-center" id="list">
                                <i class="fad fs-3 fa-qrcode text-dark"></i>
                            </button>
                        </div>

                        {
                            no <= 7 ?
                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={Array.isArray(unique_nationality) && unique_nationality.length ? unique_nationality.map((item) => ({ label: item.Nationality === 1 ? "Bangaldeshi" : "Papuans", value: item.Nationality })) : []}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Nationality"
                                        placeholder={"Nationality"}
                                        styles={CScolourStyles}
                                        value={NationFilter}
                                        onChange={(e) => setNationFilter(e)}
                                        required
                                        id="Nationality"
                                        isClearable={true}
                                        isSearchable={true}
                                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    />
                                </div>
                                :
                                null}
                        <div className="d-flex justify-content-center mx-2 w-50">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_desi) && unique_desi.length ? unique_desi.map((item) => ({ label: item.Designation, value: item.Designation })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder={"Designation"}
                                styles={CScolourStyles}
                                value={DesiFilter}
                                onChange={(e) => setDesiFilter(e)}
                                required
                                id="FullName"
                                isClearable={true}
                                isSearchable={true}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.Name, value: item.id })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder={"Search"}
                                styles={CScolourStyles}
                                value={SearchKey}
                                onChange={(e) => setSearchKey(e)}
                                required
                                id="FullName"
                                isClearable={true}
                                isSearchable={true}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn rounded-0 rounded-end border-left d-flex align-items-center" id="grid" title="View"
                                onClick={() => setView(View ? false : true)}>
                                <i class={`fad fs-3 text-dark ${View ? "fa-th-list" : "fa-th"}`}></i>
                            </button>
                        </div>

                    </div>
                </div>
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className="d-flex justify-content-around p-0">
                        {/* <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{Array.isArray(FilterProfiles) && FilterProfiles.length ? "Staff & Subscriber: " + FilterProfiles.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p> */}
                        {/* {
                            Array.isArray(Count) && Count.length ? Count.map((item, i) => (
                                <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{item.name + " " + item.value.toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                            )) : null
                        } */}
                    </div>
                </div>
                <div className="position-absolute overflow-auto mx-auto w-100" style={{ height: h + "px" }}>
                    <div id="products" className="row view-group m-0 p-0" style={{ display: View ? 'flex' : null }}>
                        {
                            Array.isArray(FilterProfiles) && FilterProfiles.length ? FilterProfiles.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    <Link to={`/user_profile/${item.id}`}
                                        className="justify-content-center align-items-center box thumbnail card py-2 shadow-none m-0 h-100">
                                        <div className="img-event mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                                            <img
                                                src={item.avatar ? process.env.REACT_APP_API_URL + item.avatar : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid rounded-circle" alt="avatar"
                                                style={{ maxWidth: "12vh", maxHeight: "12vh" }} />
                                        </div>

                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2 h-100">
                                            <p className="group inner list-group-item-text fs-5 m-0">
                                                <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.Name}</p>
                                                <p className="fs-5 fw-bold m-0">{item.Designation}</p>
                                                <small className="group card-title inner list-group-item-text m-0">{moment(item.LastLogin).format("DD MMM YYYY, hh:mm:ss A")}</small>
                                                <br />
                                                <small className="fw-bold text-muted m-0"> {"USER ID: " + item.id}</small>
                                            </p>
                                        </div>

                                    </Link>

                                </div>

                            )) :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-success m-0'>No staff found!</p>
                                </div>
                        }

                    </div>
                </div>

            </div >
        </div >
    );
}
const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(MyUserLists);