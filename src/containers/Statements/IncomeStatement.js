import moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchSisterSector, LoadIncome, PartyStatusList, findUnique } from '../../actions/APIHandler';
import { getLabel } from '../../actions/ContractAPI';
import { load_user, logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
let today = new Date();
let oneMonthAgo = new Date(); // This gives us a new Date object with the current date and time
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const IncomeStatement = ({ date_from = oneMonthAgo, date_to = today }) => {
    const [Data, setData] = useState(null)
    const [Widget, setWidget] = useState(false)
    const [View, setView] = useState(false)
    const [SearchKey, setSearchKey] = useState('')
    const [DateFrom, setDateFrom] = useState(date_from)
    const [DateTo, setDateTo] = useState(date_to)
    const [SisterList, setSisterList] = useState(null)
    const [SectorList, setSectorList] = useState(null)
    const [SisterFilter, setSisterFilter] = useState(null)
    const [SectorFilter, setSectorFilter] = useState(null)
    const [Status, setStatus] = useState('')
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadIncomeStatement();
        LoadConcern();
    }, [])

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadIncomeStatement();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [SisterFilter, SectorFilter])

    const LoadIncomeStatement = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var from = moment(DateFrom).format("YYYY-MM-DD");
        var to = moment(DateTo).format("YYYY-MM-DD");
        var result = await LoadIncome(from, to, SisterFilter, SectorFilter);
        console.log("res: ", result);
        if (result !== true) {
            setData(result)
        } else {
            // history.push('/farm_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadConcern = async () => {
        var result = await FetchConcern();
        if (result !== true) {
            setSisterList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const getSector = async (e) => {
        setSisterFilter(e)
        var result = await FetchSisterSector(e.value);
        if (result !== true) {
            setSectorList(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
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

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

    const getTotal = () => {
        if (!Array.isArray(Data.Expense) || !Data.Expense.length) return 0.00;
        return Data.Expense.reduce((acc, { total_dr }) => acc + parseFloat(total_dr), 0.00);
    };

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Income Statement</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/inc_statement">Income Statement</Link></li>
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
                                options={SisterList}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Sister"
                                placeholder={"Sister"}
                                styles={CScolourStyles}
                                value={SisterFilter}
                                onChange={e => getSector(e)}
                                required
                                id="Sister"
                                isClearable={true}
                                isSearchable={true}
                            />
                        </div>

                        <div className="d-flex justify-content-center mx-2 w-50">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                // options={Data.map}
                                options={SectorList}
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
                        <div className="d-flex justify-content-end mx-2">
                            <Datepicker
                                selected={DateFrom}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => setDateFrom(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                            <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>To</p>
                            <Datepicker
                                selected={DateTo}
                                className="form-control fs-5 fw-bold round_radius50px text-center"
                                dateFormat="dd MMM yyyy"
                                onChange={(e) => DateHandler(e)}
                                renderCustomHeader={props => customHeader({ ...props, locale })}
                                locale={locales[locale]}
                                placeholderText="Date"
                            />
                        </div>
                    </div>
                </div>

                {
                    Array.isArray(Data?.Expense) && Data?.Expense.length &&
                    <table className={`table table-hover table-borderless table-responsive d-table mt-3`}>
                        <thead>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={3} className="p-1 border-right"><span>Expense</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Data?.Expense.map((item, i) => (
                                    <tr className="border-bottom text-center" key={i}>
                                        <td className="p-0 border-right"><span className="d-block fw-bold px-1">{i + 1}</span></td>
                                        <td className="p-0 border-right text-left"><span className="d-block fw-bold px-1 text-left">{item.COA__COA_Title}</span></td>
                                        <td className="p-0"><span className="d-block fw-bold text-right px-1">{parseFloat(item.total_dr).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <thead>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Total </span></th>
                                <th className="p-1 border-right text-right"><span>{parseFloat(getTotal()).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Revenue </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.Revenue ? parseFloat(Data.Revenue).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Return </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.Return ? parseFloat(Data.Return).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Opening Stock </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.InitStock ? parseFloat(Data.InitStock).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Purcahse In this Period </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.Purchase ? parseFloat(Data.Purchase).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Current Stock </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.EndStock ? parseFloat(Data.EndStock).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Current Stock </span></th>
                                <th className="p-1 border-right text-right"><span>{Data?.EndStock ? parseFloat(Data.EndStock).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Operating Expense </span></th>
                                <th className="p-1 border-right text-right"><span>{parseFloat(getTotal()).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                            </tr>
                            <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th colSpan={2} className="p-1 border-right"><span>Net Income </span></th>
                                <th className="p-1 border-right text-right"><span>{parseFloat(0).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                            </tr>
                        </thead>
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

export default connect(mapStateToProps, { logout, load_user })(IncomeStatement);