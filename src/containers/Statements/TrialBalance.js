import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FetchConcern, FetchSisterSector, FetchTrialBalance } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { TrialBalancePrint } from './TrialBalancePDF';

let today = new Date();

const TrialBalance = ({ user }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState();
    const [DateFrom, setDateFrom] = useState(today);
    const [SisterList, setSisterList] = useState(null)
    const [SectorList, setSectorList] = useState(null)
    const [SisterFilter, setSisterFilter] = useState(null)
    const [SectorFilter, setSectorFilter] = useState(null)
    const [locale, setLocale] = useState('en');
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadConcern();
    }, [])

    useEffect(() => {
        LoadTrans();
    }, [SisterFilter, SectorFilter])

    const LoadTrans = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var from = moment(DateFrom).format("YYYY-MM-DD");
        var to = moment(DateTo).format("YYYY-MM-DD");
        var result = await FetchTrialBalance(from, to, SisterFilter, SectorFilter);
        if (result !== true)
            setData(result);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime())
            setDateTo(e)
        else { setDateFrom(e); setDateTo(e) }
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

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    // Calculate the sum of Debit and Credit balances
    const totalDebit = Array.isArray(Data) && Data.length && Data.reduce((acc, item) => acc + parseFloat(item.total_dr), 0);
    const totalCredit = Array.isArray(Data) && Data.length && Data.reduce((acc, item) => acc + parseFloat(item.total_cr), 0);

    var h = window.innerHeight - 100;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Trial Balance</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/trial_balance">Balance Sheet</Link></li>
                    </ol>
                </nav>
            </div>


            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
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
                        <div className="d-flex justify-content-around align-items-center mx-2 w-50">
                            <p className='fw-bolder fs-4 m-0 p-0'>{`Debit# ${totalDebit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`}</p>
                            <p className='fw-bolder fs-4 m-0 p-0'>{`Credit# ${totalCredit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`}</p>
                        </div>
                        <button className='btn border-left fs-3' title="Print sale report"
                            onClick={(e) => TrialBalancePrint(e, '#trial_table', DateFrom, DateTo, user, SisterFilter ? SisterFilter.label : '', SectorFilter ? SectorFilter.label : '', '')}
                        ><i className="fad fa-print"></i></button>
                    </div>
                </div>

                <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                    <table className={`table table-hover table-borderless bg-white`} id='trial_table'>
                        <thead>
                            <tr className="text-center border-top">
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">S/N</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Account Title</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Code</span></th>
                                <th className="border-right py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Debit</span></th>
                                <th className="py-1 align-middle"><span className="fs-6 fw-bolder text-dark text-uppercase">Credit</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data) && Data.length ? Data.map((item, i) => (
                                    <tr className="border-bottom text-center" title={item.SellsMan} key={i}>
                                        <td className="border-right py-1 px-2"><span className="fw-bold d-block text-center text-dark text-nowrap">{i + 1}</span> </td>
                                        <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.COA__COA_Title}</span></td>
                                        <td className="border-right py-1 px-2"><span className="d-block fs-6 fw-bold text-center text-dark px-2" >{item.COA_Code}</span></td>
                                        <td className="border-right py-1 px-2"><span className={`fs-6 fw-bold text-right d-block text-dark`}>{parseFloat(item.total_dr) === 0 ? "—" : (item.total_dr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                        <td className="border-0 py-1 px-2"><span className={`d-block text-dark text-nowrap`}>{parseFloat(item.total_cr) === 0 ? "—" : (item.total_cr).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr>
                                ))
                                    : null
                            }
                            {/* Add a row for the total */}
                            <tr className="border-bottom text-center">
                                <td colSpan="3" className='fw-bolder'>TOTAL</td>
                                <td className="border-right py-1 px-2"><span className="fs-6 fw-bolder text-right d-block text-dark">{totalDebit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                                <td className="py-1 px-2"><span className="d-block text-dark text-nowrap fw-bolder">{totalCredit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span></td>
                            </tr>
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
    user: state.auth.user,
    display: state.OverlayDisplay,
    accounts: state.auth.accounts,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(TrialBalance);