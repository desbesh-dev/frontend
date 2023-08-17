import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
// import errorIcon from '../../../assets/error.png';
// import infoIcon from '../../../assets/info.png';
// import successIcon from '../../../assets/success.png';
// import warningIcon from '../../../assets/warning.gif';
import Datepicker from 'react-datepicker';
import { FetchCashFlow } from '../../actions/APIHandler';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { CashflowPrint } from './CashflowPrint';
let today = new Date();

const CashLadger = ({ data, accounts }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState();
    const [DateFrom, setDateFrom] = useState(today);
    const [SearchKey, setSearchKey] = useState(false)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        CashFlow();
        setDateFrom(today);
    }, [])

    const CashFlow = async (e) => {
        setDateFrom(e)
        let CashAC_ID = accounts ? accounts.CashAC_ID : null
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchCashFlow(10500, moment(e).format("YYYY-MM-DD"));
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {

        } else {
            // dispatch({ type: DISPLAY_OVERLAY, payload: true });
            // // var result = await LoadBirdSellHistory(date);
            // 
            // // if (result !== true) {
            // //     setData(result);
            // // } else {
            // //     // history.push('/not_found');
            // // }
            // dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }
    var h = window.innerHeight - 100;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bolder m-0'>CASH FLOW</p>
                    <p className='display-6 bg-white fw-bold m-0'>{moment(DateFrom).format("DD MMM YYYY")}</p>
                    <div className="d-flex justify-content-end">
                        <Datepicker
                            selected={DateFrom}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => CashFlow(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        {/* <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>To</p>
                        <Datepicker
                            selected={DateTo}
                            className="form-control fs-5 fw-bold round_radius50px text-center"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => DateHandler(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        /> */}

                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => CashflowPrint(e, Data, false, DateFrom, data.Name)}><i className="fad fa-file-pdf"></i></button>
                        {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                    </div>
                </div>

                <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                    <table className={`table table-hover table-borderless bg-white`}>
                        <thead>
                            <tr className="text-center border-top">
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Timestamp</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Type</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Title</span></th>
                                {/* <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Details</span></th> */}
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Reference</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Balance</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Details</span></th>
                                <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Site</span></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data.ladger) && Data.ladger.length ? Data.ladger.map((item, i, Data) => (
                                    <tr className="border-bottom text-center" title={item.SellsMan} tooltip={item.SalesMan} key={i}>
                                        {item.Order === 1 ?
                                            <td className="border-right py-1 px-2"><span className="fw-bold d-block text-left text-dark text-nowrap">{moment(item.Date).format("DD MMM YYYY")}</span> </td>
                                            :
                                            <td className="border-right py-1 px-2"><span className="d-block text-left text-muted text-nowrap">{moment(item.UpdatedAt).format("hh:mm:ss A")}</span> </td>
                                        }

                                        {/* <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder" : "fs-6 fw-bold"} text-center text-dark`} style={{ whiteSpace: 'nowrap' }}>{new window.Date(item.Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span>
                                        </td> */}
                                        <td colSpan={item.Order === 1 ? 3 : null} className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-center" : "fs-6 fw-bold text-center"} d-block text-dark`} style={{ whiteSpace: 'nowrap' }}>{item.Order === 1 ? item.Title : item.Type}</span></td>
                                        {item.Order === 1 ? null :
                                            <>
                                                <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark" style={{ whiteSpace: 'nowrap' }}>{item.Title}</span></td>
                                                <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.RefNo}</span></td>
                                            </>
                                        }
                                        {/* <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.Details}</span></td> */}
                                        <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{parseFloat(item.Debit) === 0 ? "—" : (item.Debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{parseFloat(item.Credit) === 0 ? "—" : (item.Credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-right" : "fs-6 fw-bold text-right"} d-block text-dark`}>{(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-right py-1 px-2"><span className={`${item.Order === 1 ? "fs-5 fw-bolder text-left" : "fs-6 fw-bold text-left"} d-block text-dark`}>{item.Details}</span> </td>
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
});

export default connect(mapStateToProps, { logout })(CashLadger);