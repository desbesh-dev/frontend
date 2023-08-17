import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { LoadBatchAssesment, SaveSummey } from '../../../actions/ContractAPI';

import { DISPLAY_OVERLAY } from '../../../actions/types';
import errorIcon from '../../../assets/error.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

const BatchSummery = ({ CompanyID, BranchID, BisID, BatchID, Status, user, list, setList, setSummery }) => {
    const [SummeryData, setSummeryData] = useState(false);

    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        FetchBatchAssesment(BatchID);
    }, [])


    const FetchBatchAssesment = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadBatchAssesment(BatchID, Status);
        if (result !== true) {
            setSummeryData(result.data.Summary);
            setSummery(result.data.Summary);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const Summerize = async () => {
        const result = await SaveSummey(BatchID);
        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                }
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Invalid',
                    description: updatedState,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                FetchBatchAssesment();
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Payment request failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    return (
        <div className="position-relative mb-5" style={{ height: "85%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-75 bg-white">

                <div className="d-flex justify-content-center bg-white py-2">
                    <div className="col-md-11 justify-content-center align-items-center">
                        <p className="fs-4 fw-bolder text-center py-2 m-0">SUMMERY</p>

                        <div className="row justify-content-center align-items-center">
                            <table className={`table table-borderless table-responsive card-1 d-table`}>
                                <tbody>
                                    <tr className="border-bottom border-top text-center text-success">
                                        <td className="p-1" colspan="2"><span className="fs-5 fw-bolder text-center py-2">BATCH SUMMERY</span></td>
                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>
                                        <td className="p-1" colspan="3"><span className="fs-5 fw-bolder text-center py-2">TECHNICAL TERMS</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Batch Size</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.BatchSize.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Total Feed Cons.</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.FeedConsBG.toLocaleString("en", { minimumFractionDigits: 0 }) + " BG/" + (parseFloat(SummeryData.FeedConsBG) * parseFloat(SummeryData.CondValue)).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Issue Date</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? moment(SummeryData.Placement).format('DD MMM YYYY') + "/" + SummeryData.Period + " Day" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">AVG FEED CONS.</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.AVGFC.toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Sells Date</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? moment(SummeryData.SellDate).format('DD MMM YYYY') : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">TOTAL BODY WEIGHT</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.TBW.toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Total Solded Bird</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.TSB.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">AVG BODY WEIGHT</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.AVGBW.toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Stock Bird</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.StockBird.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">FCR</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.FCR.toFixed(2) : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Expired Chicks</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.Expire.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Actual FCR</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.AFCR.toFixed(2) : "N/A"}</span></td>
                                    </tr>

                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Lost Bird/Chick</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.LostBird.toLocaleString("en", { minimumFractionDigits: 0 }) + " PCS" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Mortality</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.Mortality.toFixed(2) + "%" : "N/A"}</span></td>
                                    </tr>



                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Dispatch</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.FeedSend.toLocaleString("en", { minimumFractionDigits: 0 }) + " BG/" + (parseFloat(SummeryData.FeedSend) * parseFloat(SummeryData.CondValue)).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Livability</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.Livability.toFixed(2) + "%" : "N/A"}</span></td>
                                    </tr>

                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Return</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.FeedRecall.toLocaleString("en", { minimumFractionDigits: 0 }) + " BG/" + (parseFloat(SummeryData.FeedRecall) * parseFloat(SummeryData.CondValue)).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Performance Efficiency Factor (PEF)</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.BPEF.toFixed(2) : "N/A"}</span></td>
                                    </tr>

                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Stock</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.FeedStock.toLocaleString("en", { minimumFractionDigits: 0 }) + " BG/" + (parseFloat(SummeryData.FeedStock) * parseFloat(SummeryData.CondValue)).toLocaleString("en", { minimumFractionDigits: 3 }) + " KG" : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Farm Economy Index (FEI)</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.BFEI.toFixed(2) : "N/A"}</span></td>
                                    </tr>


                                </tbody>

                            </table>


                            <table className={`table table-borderless table-responsive card-1 d-table`}>
                                <tbody>
                                    <tr className="border-bottom text-center text-success">
                                        <td className="p-1" colspan="5"><span className="fs-5 fw-bolder text-center py-2">CONTRACT SUMMERY</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Contract Condition</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? SummeryData.Condition : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Addmission Charge</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? parseFloat(SummeryData.Admission).toFixed(2) : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Equivalent Rate</span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? parseFloat(SummeryData.EqRate).toFixed(2) : "N/A"}</span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Savings</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? parseFloat(SummeryData.Saving).toFixed(2) : "N/A"}</span></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2"></span></td>

                                        <td className="border-right border-left p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2"></span></td>

                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Security Money</span></td>
                                        <td className="p-1"><span className="d-block fs-6 fw-bold text-center text-dark px-2">{SummeryData ? parseFloat(SummeryData.SCMoney).toFixed(2) : "N/A"}</span></td>
                                    </tr>
                                </tbody>

                            </table>
                            {
                                SummeryData ?
                                    <button className="btn btn-outline-success text-center fs-4 fw-bolder px-2 mb-0 w-auto" title="Batch Summerize" onClick={(e) => Summerize()}>
                                        <i class="fad fa-kite"></i> {SummeryData.isSummerize ? " Update" : " Summerize"}
                                    </button>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div >

        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(BatchSummery);