import moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchSisterSector, LoadBalance } from '../../actions/APIHandler';
import { load_user, logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { BalanceSheetPDF } from "./BalanceSheetPDF";
let today = new Date();
let oneMonthAgo = new Date(); // This gives us a new Date object with the current date and time
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const BalanceSheet = ({ date_from = oneMonthAgo, date_to = today, user }) => {
    const [Data, setData] = useState(null)
    const [DateFrom, setDateFrom] = useState(date_from)
    const [DateTo, setDateTo] = useState(date_to)
    const [SisterList, setSisterList] = useState(null)
    const [SectorList, setSectorList] = useState(null)
    const [SisterFilter, setSisterFilter] = useState(null)
    const [SectorFilter, setSectorFilter] = useState(null)
    const [CurrentAssets, setCurrentAssets] = useState(0.00)
    const [Assets, setAssets] = useState(0.00)
    const [TotalAssets, setTotalAssets] = useState(0.00)
    const [Liability, setLiability] = useState(0.00)
    const [TotalEquity, setTotalEquity] = useState(0.00)
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadBalanceSheet();
        LoadConcern();
    }, [])

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadBalanceSheet();
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }, [SisterFilter, SectorFilter])

    const LoadBalanceSheet = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var from = moment(DateFrom).format("YYYY-MM-DD");
        var to = moment(DateTo).format("YYYY-MM-DD");
        var result = await LoadBalance(from, to, SisterFilter, SectorFilter);
        if (result !== true) {
            setData(result)
            let cash = parseFloat(result.Cash || 0)
            let bank = parseFloat(result.Bank || 0)

            let receivable = parseFloat(result.Receivable || 0)
            let stock = parseFloat(result.Stock || 0)
            let yard_stock = parseFloat(result.YardStock || 0)
            let curent_asset = cash + bank + receivable + stock + yard_stock
            curent_asset.toFixed(2);
            setCurrentAssets(curent_asset)

            let fixed_asset = parseFloat(result.FixedAssets || 0)
            let assets = curent_asset + fixed_asset
            setAssets(assets)

            let payable = parseFloat(result.Payable || 0)
            let capital = parseFloat(result.Capital || 0)
            let equity = capital - parseFloat(result.Drawings || 0)

            setTotalEquity(equity)

            let liability = payable + equity
            setLiability(liability)

            let tot_assets = assets - liability
            setTotalAssets(tot_assets)
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

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

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
                        <button className='btn border-left fs-5' title="Print sale report"
                            onClick={(e) => BalanceSheetPDF(e, Data, CurrentAssets, Assets, TotalAssets, Liability, TotalEquity, DateFrom, DateTo, user, SisterFilter ? SisterFilter.label : '', SectorFilter ? SectorFilter.label : '', '')}
                        ><i className="fad fa-print"></i></button>
                    </div>
                </div>

                <table className={`table table-hover table-borderless table-responsive d-table mt-3`}>
                    <thead className='pt-4 border-4'>
                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right text-center fw-bolder align-middle">Current Assets </th>

                            <td className="p-1 border-right text-right fw-normal">
                                <table className={`table table-hover table-borderless fw-bold table-responsive d-table mt-3`}>
                                    <tr className='border'>
                                        <td className='border'>Cash </td>
                                        <td className='border'><span>{Data?.Cash ? parseFloat(Data.Cash).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='border'>Bank </td>
                                        <td className='border'><span>{Data?.Bank ? parseFloat(Data.Bank).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='border'>Stock </td>
                                        <td className='border'><span>{Data?.Stock ? parseFloat((Data.Stock).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='border'>Yard Stock </td>
                                        <td className='border'><span>{Data?.YardStock ? parseFloat((Data.YardStock).toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='border'>Receivable </td>
                                        <td className='border'><span>{Data?.Receivable ? parseFloat(Data.Receivable).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Total Current Assets </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{CurrentAssets && parseFloat(CurrentAssets.toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                        </tr>
                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Fixed Assets </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{Data?.FixedAssets ? parseFloat(Data.FixedAssets).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                        </tr>
                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Assets </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{Assets && parseFloat(Assets.toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                        </tr>

                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Account Payable </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{Data?.Payable ? parseFloat(Data.Payable).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00} </span></th>
                        </tr>

                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder align-middle"><span>Equity </span></th>

                            <td className="p-1 border-right text-right fw-normal">
                                <table className={`table table-hover table-borderless fw-bold table-responsive d-table mt-3`}>
                                    <tr className='border'>
                                        <td className='border'>Capital</td>
                                        <td className='border'><span>{Data?.Capital ? parseFloat(Data.Capital).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='border'>(—) Drawings</td>
                                        <td className='border'><span>{Data?.Drawings ? parseFloat(Data.Drawings).toLocaleString("en", { minimumFractionDigits: 2 }) : 0.00}</span></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Total Equity </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{TotalEquity && TotalEquity.toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                        </tr>

                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Total Liability </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{Liability && Liability.toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                        </tr>

                        <tr className="text-center text-uppercase border">
                            <th colSpan={2} className="p-1 border-right fw-bolder"><span>Total </span></th>
                            <th className="p-1 border-right text-right fw-bolder"><span>{TotalAssets && (TotalAssets.toFixed(2)).toLocaleString("en", { minimumFractionDigits: 2 })} </span></th>
                        </tr>

                    </thead>

                </table>

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