import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { LoadParty, PartyStatusList, findUnique } from '../../actions/APIHandler';
import { getLabel } from '../../actions/ContractAPI';
import { load_user, logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';

const BalanceSheet = ({ display, user, no }) => {
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

    const history = useHistory();

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
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
    let unique_search = Array.isArray(FilterParties) && FilterParties.length ? findUnique(FilterParties, d => d.Title) : null;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Balance Sheet</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/bal_sheet">Balance Sheet</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 pl-0">
                <div className="row d-flex bg-white mx-auto" >

                    <div className="d-flex justify-content-around align-items-center bg-white p-0">
                        <div className="d-flex justify-content-center mx-2 w-50">
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
                    </div>
                    
                </div>
                {Array.isArray(Data?.Items) && Data?.Items.length &&
                    <table className={`table table-hover table-borderless table-responsive d-table`}>
                        <thead>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="p-1 border-right"><span>S/N</span></th>
                                <th className="p-1 border-right"><span>Code</span></th>
                                <th className="p-1 border-right"><span>Product Name</span></th>
                                <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Quantity</span></th>
                                <th className="p-1"><span>Return</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Data?.Items.map((item, i) => (
                                    <tr className="border-bottom text-center" key={i}>
                                        <td className="p-0 border-right"><span className="d-block fw-bold px-1">{i + 1}</span></td>
                                        <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.ItemCode}</span></td>
                                        <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                        <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                                        <td className="p-0"><span className="d-block fw-bold text-right px-1">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout, load_user })(BalanceSheet);