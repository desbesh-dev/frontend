import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchLedger, FetchPartyOus, FetchSisterSector, FetchSupplierOus, LoadAccount } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { GeneralLedgerPrint, PartyOusLedgerPrint, SupplierOusLedgerPrint } from './LedgerPDF';
let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const Ledger = ({ data, no }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [AccLists, setAccLists] = useState(false)
    const [Account, setAccount] = useState(false)
    const [LedgerType, setLedgerType] = useState(false)
    const [SectorFilter, setSectorFilter] = useState(false)
    const [SisterFilter, setSisterFilter] = useState(false)
    const [SisterList, setSisterList] = useState(false)
    const [SectorList, setSectorList] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadAccounts();
        LoadConcern();
        setDateFrom(today);
    }, [])

    useEffect(() => {
        if (LedgerType && LedgerType.value === 1)
            LoadTrans();
        if (LedgerType && LedgerType.value === 2)
            LoadPartyOutstand();
        if (LedgerType && LedgerType.value === 3)
            LoadSupplierOutstand();
    }, [DateTo])

    const LoadTrans = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchLedger(Account?.COA_Code, moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"));
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadPartyOutstand = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyOus(moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"), SisterFilter, SectorFilter);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSupplierOutstand = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchSupplierOus(moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"), SisterFilter, SectorFilter);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px', minWidth: '200px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }
    const LoadAccounts = async (e) => {
        setAccLists(null);
        let result = await LoadAccount();
        setAccLists(result.data);
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

    var h = window.innerHeight - 100;
    // Calculate the sum of Debit and Credit balances
    const totalBalance = Array.isArray(Data) && Data.length && Data.reduce((acc, item) => acc + parseFloat(item.balance), 0);

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bolder m-0'>LEDGER</p>

                    <div className="d-flex justify-content-end">
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            options={[{ label: "General Ledger", value: 1 }, { label: "Parties Outstanding", value: 2 }, { label: "Suppliers Outstanding", value: 3 }]}
                            name="LedgerType"
                            placeholder={"Select account"}
                            styles={CScolourStyles}
                            value={LedgerType}
                            onChange={(e) => { setLedgerType(e); setData(false); setSisterFilter(false); setSectorFilter(false); setAccount(false) }}
                            required
                            id="LedgerType"
                        />
                        {no <= 7 &&
                            <>
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
                            </>
                        }
                        {LedgerType && LedgerType.value === 1 &&
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={AccLists}
                                name="Account"
                                placeholder={"Select account"}
                                styles={CScolourStyles}
                                value={Account}
                                onChange={(e) => setAccount(e)}
                                required
                                id="Account"
                            />
                        }
                        <Datepicker
                            selected={DateFrom}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => setDateFrom(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>to</p>
                        <Datepicker
                            selected={DateTo}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => DateHandler(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        {LedgerType && LedgerType.value === 1 &&
                            <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => GeneralLedgerPrint(e, Data, false, DateFrom, DateTo, Account?.label, data.Name)}><i className="fad fa-file-pdf"></i></button>
                        }
                        {LedgerType && LedgerType.value === 2 &&
                            <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => PartyOusLedgerPrint(e, { "Data": Data, "Sister": SisterFilter ? SisterFilter.label : data.Collocation.Title, "Sector": SectorFilter ? SectorFilter.label : data.Collocation.Sector, "ShortCode": 'N/A' }, false, DateFrom, DateTo, LedgerType?.label, data.Name)}><i className="fad fa-file-pdf"></i></button>
                        }
                        {LedgerType && LedgerType.value === 3 &&
                            <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => SupplierOusLedgerPrint(e, { "Data": Data, "Sister": SisterFilter ? SisterFilter.label : data.Collocation.Title, "Sector": SectorFilter ? SectorFilter.label : data.Collocation.Sector, "ShortCode": 'N/A' }, false, DateFrom, DateTo, LedgerType?.label, data.Name)}><i className="fad fa-file-pdf"></i></button>
                        }
                    </div>
                </div>
                {LedgerType && LedgerType.value === 1 &&
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless bg-white`}>
                            <thead>
                                <tr className="text-center border-top">
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Date</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Details</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Voucher No</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                    <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Site</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(Data?.ladger) && Data?.ladger.length ? Data?.ladger.map((item, i, Data) => (
                                        <tr className="border-bottom text-center" title={item.SellsMan} tooltip={item.SalesMan} key={i}>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{i + 1}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{moment(item.Date).format("DD MMM YYYY")}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.Details}</span></td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.RefNo}</span></td>
                                            <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{parseFloat(item.Debit) === 0 ? "—" : (item.Debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{parseFloat(item.Credit) === 0 ? "—" : (item.Credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            {/* <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-left" : "fs-6 fw-bold text-left"} d-block text-dark`}>{item.Details}</span> </td> */}
                                            <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{item.Site}</span> </td>
                                        </tr>
                                    ))
                                        : null
                                }
                            </tbody>

                        </table>
                    </div>
                }
                {LedgerType && LedgerType.value === 2 &&
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless bg-white`}>
                            <thead>
                                <tr className="text-center border-top">
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Party Title</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Address</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit Limit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                    <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Site</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                                        <tr className="border-bottom text-center" title={item.SellsMan} key={i}>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{i + 1}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.PartyID__PartyID__Title}</span></td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark px-2" >{item.PartyID__Address}</span></td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.PartyID__Limit}</span></td>
                                            <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.total_dr) === 0 ? "—" : parseFloat(item.total_dr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.total_cr) === 0 ? "—" : parseFloat(item.total_cr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            {no <= 7 ?
                                                <>
                                                    <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{item.Site}</span> </td>
                                                </>
                                                :
                                                <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{item.balance}</span> </td>
                                            }
                                        </tr>
                                    ))
                                        : null
                                }
                                {/* Add a row for the total */}
                                <tr className="border-bottom text-center">
                                    <td colSpan="5" className='fw-bolder'>TOTAL BALANCE</td>
                                    <td className="py-1 px-2"><span className="d-block text-dark text-nowrap fw-bolder">{parseFloat(totalBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                }

                {LedgerType && LedgerType.value === 3 &&
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless bg-white`}>
                            <thead>
                                <tr className="text-center border-top">
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Supplier Title</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                    <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Site</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                                        <tr className="border-bottom text-center" title={item.SellsMan} key={i}>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{i + 1}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.SupplierID__SupplierTitle}</span></td>
                                            <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.total_dr) === 0 ? "—" : parseFloat(item.total_dr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.total_cr) === 0 ? "—" : parseFloat(item.total_cr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                            {no <= 7 ?
                                                <>
                                                    <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{item.Site}</span> </td>
                                                </>
                                                :
                                                <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{item.balance}</span> </td>
                                            }
                                        </tr>
                                    ))
                                        : null
                                }
                                {/* Add a row for the total */}
                                <tr className="border-bottom text-center">
                                    <td colSpan="5" className='fw-bolder'>TOTAL PAYABLE</td>
                                    <td className="py-1 px-2"><span className="d-block text-dark text-nowrap fw-bolder">{parseFloat(totalBalance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                }

            </div>

            <div className="col-md-12 justify-content-center align-items-center h-100">

            </div>
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    data: state.auth.user,
    display: state.OverlayDisplay,
    accounts: state.auth.accounts,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(Ledger);