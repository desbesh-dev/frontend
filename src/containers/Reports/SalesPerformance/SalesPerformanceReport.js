import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { FetchConcern, FetchSisterSector } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchSalePerformance } from '../../../actions/InventoryAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import '../../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { SalesPerformancePDF } from "./SalesPerformancePDF";

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const SalesPerformanceReport = ({ user, list, setList, scale, no }) => {
    const [MyProList, setMyProList] = useState([])
    const [SearchKey, setSearchKey] = useState('')
    const [type, setType] = useState('')
    const [data, setData] = useState(null)
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [SectorFilter, setSectorFilter] = useState({ label: user.Collocation.Sector, value: user.Collocation.id })
    const [SisterFilter, setSisterFilter] = useState({ label: user.Collocation.Title, value: user.Collocation.SisterID })
    const [SisterList, setSisterList] = useState(false)
    const [SectorList, setSectorList] = useState(false)
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');
    const history = useHistory();

    useEffect(() => {
        LoadConcern();
    }, [])

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuList: provided => ({
            ...provided,
            backgroundColor: 'white',
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
                paddingTop: "5px",
                paddingBottom: "5px",
                cursor: 'pointer',
                ':focus': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                },
                ':hover': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px"
                },
            };
        },
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "30vh", borderRadius: '20px' }),
        indicatorsContainer: (provided) => ({
            ...provided,
            cursor: 'pointer',
        }),
    };

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
        setSectorFilter(false)
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

    const DateHandler = async (e) => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchSalePerformance(type?.value, SectorFilter?.value, date_from, date_to);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const calculatePerformance = (current, previous) => {
        if (!previous) return "N/A"; // No previous value for the first period
        const difference = current - previous;
        const percentageChange = (difference / previous) * 100;
        return percentageChange.toFixed(2) + "%";
    };

    var h = window.innerHeight - 167;
    return (
        <div className="row m-0 d-flex justify-content-center">
            <div className="col-lg-12 px-0">
                <div className="row d-flex bg-white mx-auto mb-1 py-1">
                    <div className={`d-flex justify-content-between align-items-center bg-white`}>
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>Sales Performance</p>
                        <div className="d-flex justify-content-around align-items-center bg-white p-0">
                            {no <= 7 &&
                                <>
                                    <div className="d-flex justify-content-center mx-2 w-50">
                                        <Select
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            menuPortalTarget={document.body}
                                            borderRadius={"0px"}
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
                                            isDisabled={!SisterFilter}
                                        />
                                    </div>
                                </>
                            }
                            <div className="d-flex justify-content-center mx-2 w-25">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ label: "Daily", value: 0 }, { label: "Weekly", value: 1 }, { label: "Monthly", value: 2 }]}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Type"
                                    placeholder={"Type"}
                                    styles={CScolourStyles}
                                    value={type}
                                    onChange={e => { setData(null); setType(e) }}
                                    required
                                    id="Type"
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>
                            {type &&
                                <div className="d-flex justify-content-end mx-2 w-50">
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
                            }
                        </div>
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                            onClick={(e) => SalesPerformancePDF(e, '#product_analysis', type?.value)}
                        ><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>

                <div className='d-flex justify-content-center align-items-center bg-white'>
                    <div className="col-md-6 tableFixHead w-100" style={{ height: h + "px" }}>
                        <table id='product_analysis' className={`table table-hover table-bordered bg-white fs-5 mt-3`}>
                            {data && type && (
                                <>
                                    <tbody>
                                        <tr className="border-bottom text-center">
                                            <td className="p-1" colSpan="5">
                                                <p className="fs-4 fw-bolder text-center p-0 m-0 px-0">
                                                    {`${type?.label} Sales Performance (${moment(DateFrom).format("DD MMM YYYY")} to ${moment(DateTo).format("DD MMM YYYY")})`}
                                                </p>
                                            </td>
                                        </tr>

                                        {Object.keys(data).map((storeName, index) => (
                                            <React.Fragment key={index}>
                                                <tr className="border-bottom text-center">
                                                    <td className="p-0" colSpan="5">
                                                        <p className="fs-6 fw-bolder text-center py-2 m-0">{storeName}</p>
                                                    </td>
                                                </tr>

                                                <tr className="text-center border-bottom p-0">
                                                    <th className='p-1'>S/N</th>
                                                    <th className='p-1'>{type?.value === 0 ? "DATE" : type?.value === 1 ? "WEEK" : type?.value === 2 ? "MONTH" : "N/A"}</th>
                                                    {type?.value === 0 && <th className='p-1'>DAY</th>}
                                                    <th className='p-1'>SALE</th>
                                                    {type?.value !== 0 && <th className='p-1'>PER DAY (AVG)</th>}
                                                    <th className='p-1'>GROWTH/DEGROWTH</th>
                                                </tr>

                                                {data[storeName].map((item, i, arr) => {
                                                    const previousSubtotal = i > 0 ? arr[i - 1].total_subtotal : null;
                                                    const performance = calculatePerformance(item.total_subtotal, previousSubtotal);

                                                    // Calculate the difference in days
                                                    let avgPerDay;
                                                    if (i === 0 || i === arr.length - 1) {
                                                        // Check if item.type.value is 1
                                                        if (type?.value === 2) {
                                                            const previousPeriod = i === 0 ? null : moment(arr[i - 1].period);
                                                            const currentPeriod = moment(item.period);
                                                            const daysDiff = previousPeriod ? currentPeriod.diff(previousPeriod, 'days') : 0;

                                                            avgPerDay = daysDiff > 0
                                                                ? (parseFloat(item.total_subtotal) / daysDiff).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                : "N/A";
                                                        } else {
                                                            avgPerDay = "N/A"; // For other types, set to "N/A"
                                                        }
                                                    } else {
                                                        const periodStart = moment(arr[i - 1].period);
                                                        const periodEnd = moment(item.period);
                                                        const daysDiff = periodEnd.diff(periodStart, 'days');
                                                        avgPerDay = daysDiff > 0
                                                            ? (parseFloat(item.total_subtotal) / daysDiff).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                            : "N/A";
                                                    }

                                                    return (
                                                        <tr className="border-bottom text-center" key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{moment(item.period).format("DD MMM YYYY")}</td>
                                                            {type?.value === 0 && <td>{moment(item.period).format("dddd")}</td>}
                                                            <td className='text-right'>{parseFloat(item.total_subtotal || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                                                            {type?.value !== 0 && <td className='text-right'>{avgPerDay}</td>}
                                                            <td className='d-flex justify-content-between'>
                                                                <span className='pl-2'>
                                                                    {parseFloat(performance) > 0 ? (
                                                                        <i className="fad fa-sort-amount-up text-dark"></i>
                                                                    ) : parseFloat(performance) < 0 ? (
                                                                        <i className="fad fa-sort-amount-down text-danger"></i>
                                                                    ) : (
                                                                        <i className="fad fa-sort-alt"></i>
                                                                    )}
                                                                </span>
                                                                <span>{performance}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                <tr className="border-top text-center fw-bolder">
                                                    <td colSpan={type?.value === 0 ? "3" : "2"}>{`Total ${Object.values(data).flat().length} ${type?.value === 0 ? "Days" : type?.value === 1 ? "Weeks" : "Months"}`}</td>
                                                    <td className='text-right'>
                                                        {Object.values(data)
                                                            .flat()
                                                            .reduce((sum, item) => sum + parseFloat(item.total_subtotal || 0), 0)
                                                            .toLocaleString("en", { minimumFractionDigits: 2 })}
                                                    </td>

                                                    {
                                                        type?.value !== 0 && <td className='text-right'>
                                                            {/* Total sales / Total days */}
                                                            {(() => {
                                                                const totalSales = Object.values(data[storeName])
                                                                    .reduce((sum, item) => sum + parseFloat(item.total_subtotal || 0), 0);

                                                                // Calculate total days from the periods (assuming periods are continuous)
                                                                const totalDays = moment(DateTo).diff(moment(DateFrom), 'days') + 1; // +1 to include both start and end dates

                                                                return (totalSales / totalDays).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                            })()}
                                                        </td>
                                                    }
                                                    <td className='text-right'>
                                                        {/* Average of sales excluding first and last row */}
                                                        Avg {type?.value === 1 ? (
                                                            Object.values(data[storeName])
                                                                .slice(1, -1) // Exclude first and last rows
                                                                .reduce((sum, item) => sum + parseFloat(item.total_subtotal || 0), 0) /
                                                            (data[storeName].length - 2 || 1) // Count excluding first and last, ensure at least 1 to avoid division by zero
                                                        ).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                            :
                                                            (Object.values(data[storeName]).reduce((sum, item) => sum + parseFloat(item.total_subtotal || 0), 0) / data[storeName].length).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                        }
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>

                    </div>
                </div>
            </div>
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    no: state.auth.user.Role.No,
});

export default connect(mapStateToProps, { logout })(SalesPerformanceReport);