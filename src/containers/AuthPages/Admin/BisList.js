import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { FetchBis } from '../../../actions/AdminApi';
import { findUnique } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const BisList = ({ display, user, scale, sub_scale }) => {
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();
    const [SearchKey, setSearchKey] = useState('')
    const [BranchFilter, setBranchFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        LoadBis();
    }, [])

    const LoadBis = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchBis();
        if (result !== true) {
            setData(result.BisList);
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_branch = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.BranchName) : null;
    let unique_status = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Status) : null;

    let FilterProfiles
    FilterProfiles = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && StatusFilter && SearchKey ? item.BranchID === BranchFilter.value && item.Status === StatusFilter.value && item.id === SearchKey.value :
            BranchFilter && StatusFilter ? item.BranchID === BranchFilter.value && item.Status === StatusFilter.value :
                BranchFilter ? item.BranchID === BranchFilter.value :
                    StatusFilter ? item.Status === StatusFilter.value :
                        SearchKey ? item.id === SearchKey.value :
                            item.Status === 1

        return BothValue
    }).map(function ({ id, BatchID, BranchID, BranchName, Cond, IssueDate, FarmID, Sell, FullName, UserID, Status, details }) {
        return { id, BatchID, BranchID, BranchName, Cond, IssueDate, FarmID, Sell, FullName, UserID, Status, details };
    }) : null
    let unique_search = Array.isArray(FilterProfiles) && FilterProfiles.length ? findUnique(FilterProfiles, d => d.FullName) : null;


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">
                    Profiles
                </p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Profile</Link></li>
                    </ol>
                </nav>
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
                            scale === 6 || (scale === 3 && (sub_scale === 9 || sub_scale === 10)) ?
                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={Array.isArray(unique_branch) && unique_branch.length ? unique_branch.map((item) => ({ label: item.BranchID + ". " + item.BranchName, value: item.BranchID })) : []}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Division"
                                        placeholder={"Branch"}
                                        styles={CScolourStyles}
                                        value={BranchFilter}
                                        onChange={(e) => setBranchFilter(e)}
                                        required
                                        id="FullName"
                                        isClearable={true}
                                        isSearchable={true}
                                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    />
                                </div>
                                : null}

                        {
                            scale === 6 || (scale === 3 && (sub_scale === 7 || sub_scale === 9 || sub_scale === 10)) ?
                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={Array.isArray(unique_status) && unique_status.length ? unique_status.map((item) => ({ label: item.Status === 2 ? "Staff " : item.Status === 1 ? "Subscriber" : null, value: item.Status })) : []}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Division"
                                        placeholder={"Status"}
                                        styles={CScolourStyles}
                                        value={StatusFilter}
                                        onChange={(e) => setStatusFilter(e)}
                                        required
                                        id="FullName"
                                        isClearable={true}
                                        isSearchable={true}
                                        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    />
                                </div>
                                :
                                null}
                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.FullName, value: item.id })) : []}
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

                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "75%" }}>
                    <div id="products" className="row view-group m-0 p-0" style={{ display: View ? 'flex' : null }}>
                        {
                            Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    <Link to={`/bis_profile_main/${item.id}`}
                                        // to={{ pathname: `/user_profile`, UserID: item.id }}
                                        className="justify-content-center align-items-center box thumbnail card py-2 shadow-none m-0 h-100">
                                        <div className="img-event mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                                            <img
                                                src={item.Logo ? process.env.REACT_APP_API_URL + item.Logo : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid rounded" alt="avatar"
                                                style={{ maxWidth: "12vh", maxHeight: "12vh" }} />
                                        </div>

                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2 h-100">
                                            <p className="group inner list-group-item-text fs-5 m-0">
                                                <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.Name}</p>
                                                <p className="fs-5 fw-bold m-0"> Name of managing director</p>
                                                <small className="text-muted m-0">
                                                    {item.VillageName + ", " + item.Union + ", " + item.Upazila + ", " + item.Zila + ", " + item.Division}
                                                </small>
                                                <br />
                                                <small className="fw-bold text-muted m-0"> {"Bis ID: " + item.id}</small>

                                            </p>
                                        </div>

                                    </Link>

                                </div>

                            )) :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-success m-0'>No Supplier Found!</p>
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
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(BisList);