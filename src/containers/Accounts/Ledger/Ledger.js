import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchLedger, LoadAccount, LoadCostAccount } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { LedgerPrint } from './LedgerPDF';
let today = new Date();

const Ledger = ({ data, accounts, no }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState();
    const [DateFrom, setDateFrom] = useState(today);
    const [AccLists, setAccLists] = useState(false)
    const [Account, setAccount] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadAccounts();
        setDateFrom(today);
    }, [])

    useEffect(() => {
        LoadTrans();
    }, [DateTo])

    const LoadTrans = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchLedger(Account?.COA_Code, moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"));
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
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px', minWidth: '500px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }
    const LoadAccounts = async (e) => {
        setAccLists(null);
        let result = no <= 7 ? await LoadAccount() : await LoadCostAccount();
        setAccLists(result.data);
    };

    var h = window.innerHeight - 100;

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
                            options={AccLists}
                            name="Account"
                            placeholder={"Select account"}
                            styles={CScolourStyles}
                            value={Account}
                            onChange={(e) => setAccount(e)}
                            required
                            id="Account"
                        />
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

                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => LedgerPrint(e, Data, false, DateFrom, DateTo, Account?.label, data.Name)}><i className="fad fa-file-pdf"></i></button>
                        {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                    </div>
                </div>

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
                                <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Site</span></th>\
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data.ladger) && Data.ladger.length ? Data.ladger.map((item, i, Data) => (
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