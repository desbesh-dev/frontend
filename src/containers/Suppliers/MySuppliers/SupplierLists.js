import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { findUnique } from '../../../actions/APIHandler';
import { load_user, logout } from '../../../actions/auth';
import { MySuppliers } from '../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const SupplierLists = ({ no }) => {
    const [Data, setData] = useState(null)
    const [Widget, setWidget] = useState(false)
    const [View, setView] = useState(false)
    const [SearchKey, setSearchKey] = useState('')

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        My_Suppliers();
    }, [])

    const My_Suppliers = async () => {
        var result = await MySuppliers();

        setData(result);
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
    let unique_search = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.SupplierTitle) : null;

    let FilterSupp
    FilterSupp = Array.isArray(Data) && Data.length ? Data.filter(function (item) {

        let BothValue = SearchKey ? item.SupplierID === SearchKey.value : true;
        return BothValue
    }).map(function ({ id, SupplierID, SupplierTitle, Logo, Contact, Address, Status }) {
        return { id, SupplierID, SupplierTitle, Logo, Contact, Address, Status };
    }) : null

    var h = window.innerHeight - 200;
    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/my_supplier_list">My Suppliers</Link></li>
                    </ol>
                </nav>
                <p className="display-6 d-flex justify-content-center m-0">My Suppliers</p>
            </div>

            <div className="col-lg-8 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">
                        {no <= 7 &&
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <Link className="btn rounded-0 rounded-start border-right d-flex align-items-center fs-4 text-dark fw-bold" id="grid" title="View"
                                    to="/supplier_reg" style={{ whiteSpace: 'nowrap' }}>
                                    New Supplier
                                </Link>
                            </div>
                        }
                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.SupplierTitle, value: item.SupplierID })) : []}
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
                            <Link className="btn rounded-0 rounded-end border-left d-flex align-items-center fs-4 text-dark fw-bold" id="grid" title="View"
                                to="/national_supplier_list" onClick={() => setView(View ? false : true)} style={{ whiteSpace: 'nowrap' }}>
                                All Suppliers
                            </Link>
                        </div>

                    </div>
                </div>
                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: h + "px" }}>

                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterSupp) && FilterSupp.length ? FilterSupp.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    <Link to={`/my_supplier/${item.SupplierID}`} className="box thumbnail card py-2 shadow-none m-0 h-100">
                                        <div className="img-event justify-content-center d-flex align-items-center flex-wrap h-100" style={{ minHeight: "12vh" }}>
                                            <img
                                                src={item.Logo ? process.env.REACT_APP_API_URL + item.Logo : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                                className="img-fluid" alt="avatar"
                                                style={{ minWidth: "12vh", maxHeight: "12vh" }} width="20px" height="20px" />

                                            {
                                                item.Status ? <small className="group card-title inner list-group-item-text fw-bold border border-light text-success px-2 w-100 text-center" style={{ borderRadius: "20px" }}><i class="fad fa-store pr-2"></i> Supplier</small>
                                                    :
                                                    <small className="group card-title inner list-group-item-text fw-bold border border-light text-warning px-2 w-100 text-center" style={{ borderRadius: "20px" }}><i class="fad fa-store pr-2"></i> Vendor</small>
                                            }
                                        </div>

                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2 h-100">
                                            <p className="group inner list-group-item-text m-0">
                                                <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.SupplierTitle}</p>
                                                <p className="group card-title inner list-group-item-text fs-6 fw-bold m-0"><i class="fad fa-user-tie pr-2"></i>Agent Name</p>
                                                <small className="group card-title inner list-group-item-text fw-normal"><i class="fad fa-phone-alt pr-2"></i>{item.Contact}</small>
                                                <br /><small className="text-muted"><i class="fad fa-map-marked-alt pr-2"></i>{item.Address}</small>
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )) :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-success m-0'>No Supplier!</p>
                                </div>
                        }

                    </div>
                </div>
            </div >
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.location.SupplierID,
    CompanyID: state.auth.user.CompanyID,
    BranchID: state.auth.user.BranchID,
    no: state.auth.user.No
});

export default connect(mapStateToProps, { logout, load_user })(SupplierLists);