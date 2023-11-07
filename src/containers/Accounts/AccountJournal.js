import * as moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AccJournal, DeleteJournal } from '../../actions/APIHandler';
import { logout } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { customHeader, locales } from "../Suppliers/Class/datepicker";
import { DeleteMessage } from './Modal/DeleteModal';
let today = new Date();

const AccountJournal = ({ no }) => {
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const [Date, setDate] = useState(today);
    const [Journal, setJournal] = useState()
    const [ItemID, setItemID] = useState()
    const [Debit, setDebit] = useState(0.00)
    const [Credit, setCredit] = useState(0.00)
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();


    useEffect(() => {
        LoadJournal();
        // LoadProductItems();
    }, [])

    const LoadJournal = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await AccJournal(moment(Date).format("YYYY-MM-DD"));
        if (result !== true) {
            setJournal(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const history = useHistory();

    const RemoveJournal = async e => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();;
        const result = await DeleteJournal(ItemID.id);
        if (result !== true) {
            LoadJournal();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const DateHandler = async (e) => {
        setDate(e)
        let date = moment(e).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await AccJournal(date);
        if (result !== true) {
            setJournal(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
        setDate(e)
    }

    const Trans = Array.isArray(Journal) && Journal.length ? Journal.length : "0";
    const totalDebit = Array.isArray(Journal) && Journal.length ? Journal.reduce((acc, { voucher_map }) => [...acc, ...voucher_map], []).reduce((acc, { DR }) => acc += parseFloat(DR), 0) : 0;
    const totalCredit = Array.isArray(Journal) && Journal.length ? Journal.reduce((acc, { voucher_map }) => [...acc, ...voucher_map], []).reduce((acc, { CR }) => acc += parseFloat(CR), 0) : 0;

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="header mb-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center" m-0>
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/acc_journal">Account Journal</Link></li>
                    </ol>
                </nav>
                <p className="display-6 d-flex justify-content-center m-0">Account Journal</p>
            </div>
            
            <div className="col-lg-12 h-100 p-0">
                <div className={`d-flex justify-content-between align-items-center bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bold text-center m-0'>{moment(Date).format("DD MMM YYYY")}</p>
                    <div className="d-flex justify-content-center align-items-center">
                        <p className='fs-4 bg-white fw-bold text-center text-muted m-0'>Transaction# <span className='fw-bolder text-dark'>{Trans} <i class="fad fa-arrows-v"></i></span></p>
                        <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                        <p className='fs-4 bg-white fw-bold text-center text-muted m-0'>Debit: <span className='fw-bolder text-success'>{totalDebit.toLocaleString("en", { minimumFractionDigits: 2 })} <i class="fad fa-long-arrow-down"></i></span></p>
                        <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                        <p className='fs-4 bg-white fw-bold text-center text-muted m-0'>Credit: <span className='fw-bolder text-warning'>{totalCredit.toLocaleString("en", { minimumFractionDigits: 2 })} <i class="fad fa-long-arrow-up"></i></span></p>
                    </div>

                    <div className="d-flex justify-content-end">
                        <Datepicker
                            selected={Date}
                            className="form-control fs-5 fw-bold round_radius50px text-center p-0"
                            dateFormat="dd MMM yyyy"
                            onChange={(e) => DateHandler(e)}
                            renderCustomHeader={props => customHeader({ ...props, locale })}
                            locale={locales[locale]}
                            placeholderText="Date"
                        />
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"><i class="fad fa-file-pdf"></i></button>
                    </div>
                </div>
                <div className="position-absolute overflow-auto my-1 w-100 bg-white" style={{ maxHeight: "85%" }}>
                    <table className={`table table-borderless table-responsive card-1 d-table`}>
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Date</span></th>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Account Title & Description</span></th>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Code</span></th>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Ref</span></th>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Debit</span></th>
                                <th className="border-right py-2"><span className="fs-6 fw-bolder text-uppercase">Credit</span></th>
                                <th className="border-0 py-2"><span className="fs-6 fw-bolder text-uppercase">Action</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Journal) && Journal.length ? Journal.map((item, i) => (
                                    Array.isArray(item.voucher_map) && item.voucher_map.length ? item.voucher_map.map((data, n) => (
                                        <>
                                            <tr className={`text-center border-top`} key={i}>
                                                {
                                                    parseInt(data.SLNo) === 1 ?
                                                        <td rowSpan={parseInt(item.Count) + 1} className="border-right p-0">
                                                            <span className="d-block fs-6 fw-bolder text-center">{item.SectorID.Title}</span>
                                                            <small className="fw-normal"> {item.OperatorID.Name}</small>,
                                                            <small className="fw-normal text-muted"> {moment(data.UpdatedAt).format("hh.mm.ss A")}</small>
                                                        </td>
                                                        : null
                                                }
                                                <Fragment>
                                                    <td className={`border-right py-0 ${parseFloat(data.DR) === 0 ? 'pl-4' : 'px-2'}`}><span className="d-block fs-6 fw-bold text-left">{data.COA ? data.COA.COA_Title : ""}</span></td>
                                                    <td className="border-right p-0"><Link className="d-block fs-6 fw-bold text-center" to="#">{data.COA ? data.COA.COA_Code : "N/A"}</Link></td>
                                                    <td className="border-right p-0"><Link className="d-block fs-6 fw-bold text-center" to="#">{item.Reference ? item.Reference : "N/A"}</Link></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{parseFloat(data.DR) === 0.00 ? "—" : parseFloat(data.DR).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                    <td className="border-right p-0"><span className="d-block fs-6 fw-bold text-center">{parseFloat(data.CR) === 0.00 ? "—" : parseFloat(data.CR).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>

                                                    {
                                                        parseInt(data.SLNo) === 1 ?
                                                            <td rowSpan={parseInt(item.Count) + 1} className="p-0 mb-2">
                                                                {no === 1 && <button className="btn p-1 text-dark" onClick={() => { setItemID(item); setDeleteModalShow(true) }} ><i className="fs-3 fad fa-trash-alt" /> </button>}
                                                            </td> : null
                                                    }
                                                </Fragment>
                                            </tr>
                                            {
                                                parseInt(data.SLNo) === parseInt(item.Count) ?
                                                    <>
                                                        <tr className="text-center border-top border-bottom bg-body bg-gradient rounded">
                                                            <td colspan="5" className="border-right text-left py-0 px-2">
                                                                <span className="fs-6 fw-bold text-primary text-left">
                                                                    {item.Narration}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr height="15px" />
                                                    </>
                                                    : null
                                            }
                                        </>
                                    ))
                                        : null

                                ))
                                    :
                                    null
                            }
                        </tbody >
                    </table >
                </div >
            </div >
            {
                ItemID ?
                    <DeleteMessage
                        FullName={ItemID.Narration
                        }
                        show={DeleteModalShow}
                        Click={(e) => RemoveJournal(e)}
                        onHide={() => setDeleteModalShow(false)}
                    />
                    : null
            }
        </div >

    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BisID: props.match.params.id,
    no: state.auth.no,
    cat: state.auth.cat
});

export default connect(mapStateToProps, { logout })(AccountJournal);