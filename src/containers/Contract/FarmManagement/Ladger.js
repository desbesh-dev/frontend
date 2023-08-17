import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoadLadger } from '../../../actions/ContractAPI';
import { logout } from '../../../actions/auth';

import { DISPLAY_OVERLAY } from '../../../actions/types';

const Ladger = ({ UserID, BisID, BatchID, SupplierID, user, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        My_Ladger();
        // LoadProductItems();
    }, [])

    const My_Ladger = async () => {
        if (user !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await LoadLadger(BisID, BatchID);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push(`/farm_mng/${UserID}/${BisID}/${BatchID}`);
        }
    }

    return (
        <div className="position-relative mb-5 w-100 h-100">

            <div className="position-absolute overflow-auto my-1 px-2 w-100 bg-white" style={{ maxHeight: "65%" }}>
                <table table className={`table text-nowrap`}>
                    <thead>
                        <tr className="text-center">
                            <th className="p-1 border-0" colspan="11">
                                <p className="fs-4 fw-bolder text-center py-2 m-0">LEDGER</p>
                            </th>
                        </tr>
                        <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Category</span></th>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Details</span></th>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">J.P. No</span></th>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Debit</span></th>
                            <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Credit</span></th>
                            <th className="p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Balance</span></th>

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
                                    <td className="border-0 py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{(item.Balance).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                </tr>
                            ))
                                : null
                        }
                    </tbody>

                </table>
            </div>

        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    // BisID: props.BisID,
    // BatchID: props.BatchID,
    // UserID: props.UserID
});

export default connect(mapStateToProps, { logout })(Ladger);