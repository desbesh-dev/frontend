import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { findUnique, LoadParty, PartyStatusList } from '../../../actions/APIHandler';
import { load_user, logout } from '../../../actions/auth';
import { getLabel } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';

const PartyLists = ({ display, user, no }) => {
    const [Data, setData] = useState(null)
    const [Widget, setWidget] = useState(false)
    const [View, setView] = useState(false)
    const [SearchKey, setSearchKey] = useState('')
    const [SectorFilter, setSectorFilter] = useState(null)
    const [Status, setStatus] = useState('')

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        FetchParty();
    }, [])

    const FetchParty = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadParty();

        if (result !== true) {
            setData(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? '#6495ED' : 'transparent';
            let color = state.isSelected ? 'whitesmoke' : '#333';
            let scale = state.isSelected ? 'scale(1)' : 'scale(1.01)';

            if (state.isFocused) {
                backgroundColor = '#6495ED';
                color = 'whitesmoke';
                scale = 'scale(1.01)';
            }

            return {
                ...provided,
                color,
                backgroundColor,
                padding: "5px 5px",
                cursor: 'pointer',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                height: '40px',
                ':focus': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    whiteSpace: 'wrap',
                },
                ':hover': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    whiteSpace: 'wrap',
                },
            };
        },
    }
    // let unique_search = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.Title) : null;

    let unique = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.SectorNo) : null;
    let unique_data = Array.isArray(Data) && Data.length ? findUnique(Data, d => d.PartyID) : null;


    const FilterParties = unique_data && unique_data.length ? unique_data
        .filter(item => (!SectorFilter || item.SectorNo === SectorFilter.value) &&
            (!Status || item.Status === Status.value) &&
            (!SearchKey || item.id === SearchKey.value))
        .map(({ id, PartyID, Title, Name, Contact, Address, SectorTitle, SectorNo, Status }) => ({
            id, PartyID, Title, Name, Contact, Address, SectorTitle, SectorNo, Status
        })) : null;

    let unique_status = Array.isArray(FilterParties) && FilterParties.length ? findUnique(FilterParties, d => getLabel(d.Status, PartyStatusList)) : null;
    // let unique_search = Array.isArray(FilterParties) && FilterParties.length ? findUnique(FilterParties, d => d.Address) : null;

    const formatOptionLabel = ({ label, Address }) => {
        return (
            <div style={{ lineHeight: '1' }}>
                <div className='p-0 m-0' style={{ lineHeight: '1' }}>{label}</div>
                <small className='p-0 m-0 text-dark' style={{ lineHeight: '1' }}>{Address}</small>
            </div>
        );
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">My Party Lists</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/supplier_list">My Party</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto" >

                    <div className="d-flex justify-content-around align-items-center bg-white p-0">
                        {
                            no <= 7 ?
                                <div className="d-flex justify-content-center mx-2 w-100">
                                    <Select
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        menuPortalTarget={document.body}
                                        borderRadius={"0px"}
                                        // options={Data.map}
                                        options={Array.isArray(unique) && unique.length ? unique.map((item) => ({ label: item.SectorTitle, value: item.SectorNo })) : []}
                                        defaultValue={{ label: "Select Dept", value: 0 }}
                                        name="Sector"
                                        placeholder={"Sector"}
                                        styles={CScolourStyles}
                                        value={SectorFilter}
                                        onChange={(e) => setSectorFilter(e)}
                                        required
                                        id="Sector"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                </div>
                                : null
                        }
                        <div className="d-flex justify-content-end mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                // options={Data.map}
                                options={Array.isArray(unique_status) && unique_status.length ? unique_status.map((item) => ({ label: getLabel(item.Status, PartyStatusList), value: item.Status })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Status"
                                placeholder={"Status"}
                                styles={CScolourStyles}
                                value={Status}
                                onChange={(e) => setStatus(e)}
                                required
                                id="Status"
                                isClearable={true}
                                isSearchable={true}
                            />
                        </div>
                        <div className="d-flex justify-content-end mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={Array.isArray(FilterParties) && FilterParties.length ? FilterParties.map((item) => ({ label: item.Title, value: item.id, Address: item.Address })) : []}
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
                                formatOptionLabel={formatOptionLabel}
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
                <div className="position-absolute overflow-auto mx-auto mt-3 w-100" style={{ height: "70%" }}>

                    <div id="products" className="row view-group m-0 p-0">
                        {
                            Array.isArray(FilterParties) && FilterParties.length ? FilterParties.map((item, i) => (
                                <div className={View ? "item col-xs-3 col-lg-3 grid-group-item mb-3" : "item col-xs-3 col-lg-3 grid-group-item list-group-item mb-3"} key={i}>
                                    <Link to={`/my_party/${item.PartyID}/${item.id}`} className="box thumbnail card py-2 shadow-none m-0 h-100">
                                        <div className="caption card-body d-flex flex-column justify-content-center py-0 px-2 h-100">
                                            <p className="group inner list-group-item-text m-0">
                                                <p className="group card-title inner list-group-item-text fs-4 fw-bold m-0">{item.Title} <span className='text-warning'> ({getLabel(item.Status, PartyStatusList)})</span></p>
                                                <p className="group card-title inner list-group-item-text fs-6 fw-bold m-0"><i class="fad fa-user-tie pr-2"></i>{item.Name}</p>
                                                <small className="group card-title inner list-group-item-text fw-normal"><i class="fad fa-phone-alt pr-2"></i>{item.Contact}</small>
                                                <br /><small className="text-muted"><i class="fad fa-map-marked-alt pr-2"></i>{item.Address}</small>
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                            ))
                                :
                                <div className={`d-flex justify-content-center align-items-center bg-white`}>
                                    <p className='fs-2 fw-bold text-success m-0'>No Party Found!</p>
                                </div>
                        }

                    </div>
                </div>
            </div>
        </div>

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout, load_user })(PartyLists);