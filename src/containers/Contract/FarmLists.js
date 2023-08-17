import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { LoadMyFarms } from '../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';

const FarmLists = ({ display, scale, sub_scale }) => {
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const dispatch = useDispatch();
    const [SearchKey, setSearchKey] = useState('')
    const [BranchFilter, setBranchFilter] = useState('')
    const [StatusFilter, setStatusFilter] = useState('')
    const [RepFilter, setRepFilter] = useState('')

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        MyFarms();
    }, [])

    const MyFarms = async () => {
        var result = await LoadMyFarms();
        setData(result.farms);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    let unique_branch = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.BranchName) : null;
    let unique_status = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Status) : null;

    let FilterFarms
    FilterFarms = Array.isArray(Data) && Data.length ? Data.filter(function (item) {
        let BothValue = BranchFilter && RepFilter && StatusFilter && SearchKey ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.Status === StatusFilter.value && item.id === SearchKey.value :
            BranchFilter && RepFilter && StatusFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value && item.Status === StatusFilter.value :
                BranchFilter && RepFilter ? item.BranchID === BranchFilter.value && item.RepID === RepFilter.value :
                    BranchFilter && StatusFilter ? item.BranchID === BranchFilter.value && item.Status === StatusFilter.value :
                        RepFilter && StatusFilter ? item.RepID === RepFilter.value && item.Status === StatusFilter.value :
                            BranchFilter ? item.BranchID === BranchFilter.value :
                                RepFilter ? item.RepID === RepFilter.value :
                                    StatusFilter ? item.Status === StatusFilter.value :
                                        SearchKey ? item.id === SearchKey.value :
                                            item.Status === 1

        return BothValue
    }).map(function ({ id, BatchID, BranchID, BranchName, RepID, RepName, Cond, IssueDate, FarmID, Sell, Title, UserID, Status, details }) {
        return { id, BatchID, BranchID, BranchName, RepID, RepName, Cond, IssueDate, FarmID, Sell, Title, UserID, Status, details };
    }) : null

    let unique_search = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.Title) : null;
    let unique_rep = Array.isArray(FilterFarms) && FilterFarms.length ? findUnique(FilterFarms, d => d.RepName) : null;

    let Count = Array.isArray(FilterFarms) && FilterFarms.length ? Object.values(FilterFarms.reduce((c, { Status }) => {
        c[Status] = c[Status] || { name: Status === 0 ? "Closed:" : Status === 1 ? "Active:" : Status === 2 ? "Review:" : Status === 3 ? "Accounts:" : Status === 4 ? "Paid:" : Status === 5 ? "Hold:" : null, value: 0 };
        c[Status].value++;
        return c;
    }, {})) : null

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header m-0">
                <p className="display-6 d-flex justify-content-center m-0">Farm List</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Contract Farms</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Farm List</Link></li>
                    </ol>
                </nav>
            </div>


            <div className="col-lg-11 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto my-2 py-1">
                    <div className="d-flex justify-content-around p-0">
                        <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{Array.isArray(Data) && Data.length ? "Farms: " + Data.length.toLocaleString("en-BD", { minimumFractionDigits: 0 }) : null}</p>
                        {
                            Array.isArray(Count) && Count.length ? Count.map((item, i) => (
                                <p className='text-dark fw-bold m-0 border border-light px-2' style={{ borderRadius: "15px" }}>{item.name + " " + item.value.toLocaleString("en-BD", { minimumFractionDigits: 0 })}</p>
                            )) : null
                        }
                    </div>
                </div>

                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button className="btn rounded-0 rounded-start border-right d-flex align-items-center" id="list">
                                <i class="fad fs-3 fa-qrcode text-dark"></i>
                            </button>
                        </div>
                        {
                            scale === 6 || (scale === 3 && (sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ?
                                <Fragment>
                                    <div className="d-flex justify-content-center mx-2 w-25">
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
                                            id="Title"
                                            isClearable={true}
                                            isSearchable={true}
                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mx-2 w-50">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
                                            options={Array.isArray(unique_rep) && unique_rep.length ? unique_rep.map((item) => ({ label: item.RepID + ". " + item.RepName, value: item.RepID })) : []}
                                            defaultValue={{ label: "Select Dept", value: 0 }}
                                            name="Division"
                                            placeholder={"Representative"}
                                            styles={CScolourStyles}
                                            value={RepFilter}
                                            onChange={(e) => setRepFilter(e)}
                                            required
                                            id="RepFilter"
                                            isClearable={true}
                                            isSearchable={true}
                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                        />
                                    </div>
                                </Fragment>
                                : null
                        }

                        {
                            scale === 6 || (scale === 3 && (sub_scale === 6 || sub_scale === 7 || sub_scale === 9 || sub_scale === 10)) ?
                                <div className="d-flex justify-content-center mx-2 w-50">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        options={Array.isArray(unique_status) && unique_status.length ? unique_status.map((item) => ({ label: item.Status === 0 ? "Batch Closed" : item.Status === 1 ? "Active" : item.Status === 2 ? "Request for batch review" : item.Status === 3 ? "Waiting for accounts approval" : item.Status === 4 ? "Paid" : item.Status === 5 ? "Payment Hold" : null, value: item.Status })) : []}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Division"
                                        placeholder={"Status"}
                                        styles={CScolourStyles}
                                        value={StatusFilter}
                                        onChange={(e) => setStatusFilter(e)}
                                        required
                                        id="Title"
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
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.FarmID + ". " + item.Title, value: item.id })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder={"Search"}
                                styles={CScolourStyles}
                                value={SearchKey}
                                onChange={(e) => setSearchKey(e)}
                                required
                                id="Title"
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

                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterFarms) && FilterFarms.length ? FilterFarms.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    {/* <Link to={`/rtl_sell/${item.details.UserID}`} */}
                                    <Link Title="Click to make invoice" to={`${item.Status === 1 ? sub_scale === 2 || sub_scale === 3 || sub_scale === 4 ? `/sr_send_products/${item.FarmID}` : `/send_products/${item.FarmID}` : "#"}`}
                                        className="justify-content-center align-items-center box thumbnail card py-2 shadow-none m-0 h-100">

                                        <div className="img-event mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                                            <img
                                                src={item.details.Image ? item.details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid rounded-circle" alt="avatar"
                                                style={{ maxWidth: "12vh", maxHeight: "12vh" }} />
                                        </div>

                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2 h-100">
                                            {scale === 6 || (scale === 3 && (sub_scale === 6 || sub_scale === 9 || sub_scale === 10)) ?
                                                <p className="group inner list-group-item-text m-0">
                                                    <small className="group card-title inner list-group-item-text fs-4 fw-bold">
                                                        <Link Title="Go to farms to view active batch" to={`/farm_mng/${item.details.UserID}/${item.FarmID}/${item.BatchID}`}>{item.FarmID + ". " + item.Title}</Link>
                                                    </small>
                                                    <br />
                                                    <small className="group card-title inner list-group-item-text fw-bold text-dark">
                                                        {item.BranchID + ". " + item.BranchName + " Branch"}
                                                    </small>
                                                    <br />
                                                    <small className="text-muted lh-1">
                                                        <Link Title="Go to user profiles" to={`/user_profile/${item.details.UserID}`}>{item.details.UserID + ". " + item.details.FullName}</Link>
                                                        {", H#" + item.details.HoldingNo + ", Word No- " + item.details.WardNo + ", Postal Code- " + item.details.PostalCode}<br />
                                                        {item.details.VillageName + ", " + item.details.Union + ", " + item.details.Upazila + ", " + item.details.Zila + ", " + item.details.Division}
                                                    </small>
                                                    <br />
                                                    <small className='text-dark bg-light m-0 px-1 rounded fw-bold'>{item.Status === 0 ? "Batch Closed" : item.Status === 1 ? "Active" : item.Status === 2 ? "Request for batch review" : item.Status === 3 ? "Waiting for accounts approval" : item.Status === 4 ? "Paid" : item.Status === 5 ? "Payment Hold" : null}</small>
                                                </p>
                                                :
                                                <p className="group inner list-group-item-text m-0">
                                                    <small className="group card-title inner list-group-item-text fs-4 fw-bold">
                                                        <Link Title="Go to farms to view active batch" to={`/farm_mng/${item.details.UserID}/${item.FarmID}/${item.BatchID}`}>{item.FarmID + ". " + item.Title}</Link>
                                                    </small>
                                                    <br />
                                                    <small className="group card-title inner list-group-item-text fw-bold text-dark">
                                                        {item.BatchID + ". " + item.BranchName + " Branch"}
                                                    </small>
                                                    <br />
                                                    <small className="text-muted">
                                                        {", H#" + item.details.HoldingNo + ", Word No- " + item.details.WardNo + ", Postal Code- " + item.details.PostalCode}<br />
                                                        {item.details.VillageName + ", " + item.details.Union + ", " + item.details.Upazila + ", " + item.details.Zila + ", " + item.details.Division}
                                                    </small>
                                                </p>}
                                        </div>

                                    </Link>

                                </div>

                            )) :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-4 fw-bold text-success m-0'>No farmer found!</p>
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
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
});

export default connect(mapStateToProps, { logout })(FarmLists);