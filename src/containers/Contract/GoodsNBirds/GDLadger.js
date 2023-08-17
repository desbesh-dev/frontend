import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GenGDLadger, GetGodown } from '../../../actions/ContractAPI';
import { logout } from '../../../actions/auth';

import Datepicker from 'react-datepicker';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
let today = new Date();

const PastMonth = (numOfMonths = 1, date = new Date()) => {
    date.setMonth(date.getMonth() - numOfMonths);
    return date;
}

const GDLadger = ({ UserID, GID, user, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Godown, setGodown] = useState(false)
    const [DateFrom, setDateFrom] = useState(PastMonth)
    const [DateTo, setDateTo] = useState(today)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        My_Ladger();
        PastMonth();
        LoadGodown();
    }, [])

    const LoadGodown = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await GetGodown(GID);
        if (result !== true && result.length !== 0) {
            setGodown(result.Godown);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/goods_n_bird');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const My_Ladger = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await GenGDLadger(GID, moment(DateFrom).format("YYYY-MM-DD"), moment(DateTo).format("YYYY-MM-DD"));
        if (result !== true)
            setData(result.data);
        else
            history.push(`/goods_n_bird`);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {

        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await GenGDLadger(GID, moment(DateFrom).format("YYYY-MM-DD"), moment(date).format("YYYY-MM-DD"));
            if (result !== true)
                setData(result.data);
            else
                setData(false);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-12 h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bolder m-0'>LEDGER</p>
                    <p className='display-6 bg-white fw-bold m-0'>{Godown ? Godown.Title : "N/A"}</p>
                    {/* <p className='display-6 bg-white fw-bold m-0'>{moment(DateFrom).format("DD MMM YYYY")}</p> */}
                    <div className="d-flex justify-content-end">
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

                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                        // onClick={() => setToggle(true)}
                        ><i class="fad fa-file-pdf"></i></button>
                        {/* <input className="border rounded-pill px-2 min-vw-25 mx-2" type="text" value={SearchKey} placeholder="Search Keywords" onChange={(e) => setSearchKey(e.target.value)} />
                                <p className='fw-bold text-success my-auto px-1 mx-1' title="Search" type='button'>Search</p>
                                <button className="btn fs-3 px-2 py-0 fad fa-plus text-success border-left" onClick={() => setToggle(true)} /> */}
                    </div>
                </div>

                <div className="position-absolute overflow-auto my-1 px-2 w-100 bg-white" style={{ maxHeight: "65%" }}>
                    <table table className={`table text-nowrap`}>
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Category</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Details</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">J.P. No</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Debit</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Credit</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Balance</span></th>
                                <th className="p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Timestamp</span></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data) && Data.length ? Data.map((item, i, Data) => (
                                    <tr className="border-bottom text-center" title={item.SellsMan} tooltip={item.SalesMan} key={i}>
                                        {
                                            parseInt(item.Order) === 3 ? <td className="border-right py-0 px-2"><span className="fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span>
                                            </td> :
                                                parseInt(item.SLNo) === 1 ?
                                                    <td rowSpan={parseInt(item.Count)} className="border-right py-0 px-2"><span className="fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span>
                                                    </td>
                                                    : null}
                                        <td className="border-right py-0 p-2"><span className="d-block fs-6 fw-bolder text-center text-dark">{item.Category}</span></td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.Details}</span></td>
                                        {parseInt(item.Order) === 3 ? <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.RefNo}</span></td>
                                            : parseInt(item.SLNo) === 1 ?
                                                <td rowSpan={parseInt(item.Count)} className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{item.RefNo}</span></td>
                                                : null}
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Debit) === 0 ? "—" : (item.Debit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Credit) === 0 ? "—" : (item.Credit).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="fs-6 fw-bold text-center text-dark">{(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-0 py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{moment(item.CreatedAt).format("DD MMM YYYY, hh:mm:ss A")}</span> </td>
                                    </tr>
                                ))
                                    : null
                            }
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    GID: props.match.params.id,
});

export default connect(mapStateToProps, { logout })(GDLadger);