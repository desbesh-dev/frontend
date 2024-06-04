import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchPaymentReceived, FetchSisterSector } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { PaymentReceivedLedger } from './PaymentLedgerPDF';
let today = new Date();

const PaymentReceived = ({ data, no }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(today);
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
        LoadConcern();
        setDateFrom(today);
    }, [])

    useEffect(() => {
        LoadPaymentReceived();
    }, [DateTo])

    const LoadPaymentReceived = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPaymentReceived(moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"));
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
    const { TotCash, TotBank } = Array.isArray(Data.Payments) ? Data.Payments.reduce((acc, item) => {
        const amount = parseFloat(item.PaidAmount);
        if (item.Payment === 14) {
            acc.TotCash += amount;
        } else {
            acc.TotBank += amount;
        }
        return acc;
    }, { TotCash: 0, TotBank: 0 }) : { TotCash: 0, TotBank: 0 };


    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bolder m-0'>PAYMENT RECEIVED</p>

                    <div className="d-flex justify-content-end">
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
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => PaymentReceivedLedger(e, Data, false, DateFrom, DateTo, data.Name)}><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>
                {Data && Data.Payments &&
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <table className={`table table-hover table-borderless bg-white`}>
                            <thead>
                                <tr className="text-center border-top">
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Date</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Invoice Date</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Party</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Invoice No</span></th>
                                    <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Cash</span></th>
                                    <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Bank</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(Data?.Payments) && Data?.Payments.length ? Data?.Payments.map((item, i, Data) => (
                                        <tr className="border-bottom text-center" key={i}>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{i + 1}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{moment(item.Date).format("DD MMM YYYY")}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark">{moment(item.InvDate).format("DD MMM YYYY")}</span></td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bolder text-left text-dark px-2" >{item.Party}</span></td>
                                            <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.InvoiceNo}</span></td>
                                            <td className="border-right py-1 px-2"><span className="fs-5 fw-bold text-right d-block text-dark">{item.Payment === 14 ? parseFloat(item.PaidAmount).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "—"}</span> </td>
                                            <td className="border-right py-1 px-2"><span className="fs-5 fw-bold text-right d-block text-dark">{item.Payment === 14 ? "—" : parseFloat(item.PaidAmount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        </tr>
                                    ))
                                        : null
                                }
                                <tr className="border-bottom text-center">
                                    <td colSpan="5" className='fw-bolder'>TOTAL</td>
                                    <td className="py-1 px-2"><span className="d-block text-dark text-right text-nowrap fw-bolder">{parseFloat(TotCash).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                    <td className="py-1 px-2"><span className="d-block text-dark text-right text-nowrap fw-bolder">{parseFloat(TotBank).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
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

export default connect(mapStateToProps, { logout })(PaymentReceived);