import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { LoadProfile } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { BatchPro } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import BatchAccount from './BatchAccount';
import BatchAssesment from './BatchAssesment';
import BatchSummery from './BatchSummery';
import DailyRecord from './DailyRecords';
import Ladger from './Ladger';
import Payment from './Payment';
import ProfitNLoss from './ProfitNLoss';
import SellReport from './SellReport';
import Sell from './Sells';
import WeeklyReports from './WeeklyReports';
// import Products from './Products';
// import ProductList from './ProductItems';
// import Overview from './Overview';
var QRCode = require('qrcode.react');

const FarmMain = ({ display, UserID, BisID, BatchID, list, setList, scale, sub_scale }) => {
    const [Data, setData] = useState(null)
    const dispatch = useDispatch();
    const [Summary, setSummery] = useState(0);
    const [Active, setActive] = useState(0);
    const [UserData, setUserData] = useState(null);
    // const [BusinessID, setBusinessID] = useState(false);
    const [ShowBatch, setShowBatch] = useState(false);
    let { path, url } = useRouteMatch();
    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        MyUsers();
    }, [])

    const MyUsers = async () => {

        if (localStorage.getItem("user") !== null) {
            var result = await LoadProfile(UserID);
            if (result !== true) {
                var BatchDetials = await BatchPro(BatchID);
                if (BatchDetials !== true) {
                    setData(BatchDetials);
                    setUserData(result);
                } else {
                    history.push('/not_found');
                }
            } else {
                history.push('/not_found');
            }
        } else {
            history.push('/');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();
    return (
        <>
            <div className="header mb-0">
                <div className="d-flex justify-content-start overflow-auto bg-white mx-0 mb-2">
                    <div className="col-md-1 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data ? Data.BatchNo + "/" + Data.id : null}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">No/ID</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "100px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data ? new Date(Data.IssueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : null}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Issue Date</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "100px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data ? Data.ChickTotal.toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PC" : null}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Batch Size</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "100px" }}>
                        <p className="fs-4 fw-bolder text-center text-uppercase m-0">{Data ? Data.Condition : null}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Condition</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "130px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data ? Data.FeedTotal : null}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Comulative Feed</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "100px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Summary ? parseFloat(Summary.AVGCostKG).toLocaleString("en-BD", { minimumFractionDigits: 2, style: 'currency', currency: 'BDT' }) + "/" + parseFloat(Summary.AVGCostBird).toFixed(2) : "0.00/0.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Cost (kg/Qty)</p>
                    </div>

                    <div className="col-md-1 text-md-center my-auto px-0" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center text-uppercase m-0">{Data ? Data.Status === 0 ? "Closed" : Data.Status === 1 ? "Active" : Data.Status === 2 ? "Review" : Data.Status === 3 ? "Accounts" : Data.Status === 4 ? "Paid" : Data.Status === 5 ? "Hold" : "N/A" : "N/A"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Status</p>
                    </div>
                </div>
                {
                    UserData && Data ?
                        <div className="d-flex justify-content-start overflow-auto bg-white mb-2 mx-0" style={{ maxHeight: "160px" }}>
                            <div className="col-lg-2 text-center my-auto" style={{ minWidth: "160px" }}>
                                {Data ? <QRCode className="img p-2 border m-2" value={BisID.toString()} size="60" /> : ""}
                            </div>
                            <div className="col-lg-3 text-md-left my-auto py-2" style={{ minWidth: "250px" }}>
                                <p className="fs-5 m-0">
                                    <Link className="fs-4 fw-bold" to={`/business_pro/${UserID}/${BisID}`}>
                                        {Data ? Data.BusinessID + ". " + Data.Title : ""}
                                    </Link> <br />
                                    {/* <i class="fad fa-house-user pr-2"> </i> */}
                                    <i class="fad fa-warehouse-alt pr-2"></i>
                                    <Link to={`/user_profile/${UserID}`} className="fs-6 fw-bold"> {UserData.UserInfo.id + ". " + UserData.Details.FullName}</Link>
                                    <br />
                                    <small className="text-muted">{Data ? Data.BusinessType + " of conditition " + Data.Condition : ""}</small>
                                    <br />
                                    {
                                        Array.isArray(Data.Chicks) && Data.Chicks.length ? Data.Chicks.map((item, i) => (
                                            <small className="text-muted">
                                                {(i + 1) + ". " + item}
                                                <br />
                                            </small>
                                        ))
                                            : null
                                    }
                                    <p className="fs-5 fw-bold m-0"><i class="fad fa-phone-alt pr-2"> </i>{UserData.UserInfo.MobileNo + ", " + UserData.UserInfo.email}</p>
                                </p>
                            </div>

                            <div className="col-lg-1">
                                <div className="cs_outer" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                            </div>

                            <div className="col-lg-4 text-md-right my-auto py-2" style={{ minWidth: "250px" }}>
                                <p className="fs-5 m-0">
                                    <p className="fs-4 fw-bold m-0">
                                        {UserData.UserInfo.BranchID.BranchID + ". " + UserData.UserInfo.BranchID.Name + " Branch"}
                                    </p>
                                    <br />
                                    <i class="fad fa-user-tie pr-2"> </i>
                                    <Link to={`/employee_main/${Data.RepID}`} className="fs-5 fw-bold m-0">
                                        {Data.Rep}
                                    </Link>
                                    <br />
                                    <small className="text-muted">
                                        {"H#" + UserData.Details.HoldingNo + ", Word No- " + UserData.Details.WardNo + ", Postal Code- " + UserData.Details.PostalCode}<br />
                                        {UserData.Details.VillageName + ", " + UserData.Details.Union + ", " + UserData.Details.Upazila + ", " + UserData.Details.Zila + ", " + UserData.Details.Division}
                                    </small>
                                </p>
                                <button className="btn fs-6 fw-bold text-dark" onClick={() => setShowBatch(ShowBatch ? false : true)}><i class="fad fa-edit"> </i>Update</button>
                            </div>

                            <div className="col-lg-2 text-center my-auto">
                                {/* <img class="rounded-circle" src="http://placehold.it/150x150" width="150" alt="Generic placeholder image" /> */}
                                <img
                                    src={UserData.Details.Image ? process.env.REACT_APP_API_URL + UserData.Details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                    className="img" alt="avatar"
                                    width="130px" height="130px" />
                            </div>
                        </div>
                        : null
                }
            </div>

            <div className="header d-flex justify-content-center bg-white my-0">
                <div className="d-flex justify-content-start overflow-auto">
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 1 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(1)} id="1" title="Batch Summary" type='button' to={`${url}`}>Summary</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 2 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(2)} id="2" title="Daily Records" type='button' to={`${url}/daily_records`}>Daily Records</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 3 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(3)} id="3" title="Transaction Ladger" type='button'
                        // to={`${url}/ladger/${Data ? Data.BusinessID.id : null}/${Data ? Data.id : null}`}
                        to={`${url}/ladger`}
                    >Ladger</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 4 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(4)} id="4" title="Weekly Reports" type='button' to={`${url}/weekly_reports`}>Weekly Reports</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}></div>
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 11 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(11)} id="5" title="Chicken Sells" type='button' id="list" to={`${url}/rtl_sell`}>Sells</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 5 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(5)} id="6" title="Sell Reports" type='button' to={`${url}/bird_sell_report`}>Sell Reports</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 6 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(6)} id="7" title="Batch Accounts" type='button' to={`${url}/batch_assesment`}>Assesment</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 7 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(7)} id="8" title="Batch Accounts" type='button' to={`${url}/batch_account`}>Accounts</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 8 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(8)} id="9" title="Payments" type='button' to={`${url}/payment`}>Payments</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    {scale === 6 ?
                        <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 9 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(9)} id="10" title="Profit & Loss" type='button' to={`${url}/profit_n_loss`}>P/L</Link>
                        :
                        null
                    }
                    {/* <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 10 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(10)} id="11" title="Batch Receipt" type='button' to={`${url}/ladger`}><i class="fad fa-receipt"></i></Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 11 ? "bg-light text-dark fw-bolder" : null}`} onClick={(e) => setActive(11)} id="12" title="Batch Report" type='button' to={`${url}/ladger`}><i class="fad fa-file-alt"></i></Link> */}
                </div>
            </div>

            <Switch>
                <Route exact path={path}> <BatchSummery UserID={UserID} BisID={BisID} BatchID={BatchID} Status={Data ? Data.Status : 1} list={list} setList={setList} setSummery={setSummery} /> </Route>
                <Route exact path={`${path}/daily_records`}> <DailyRecord UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} scale={scale} sub_scale={sub_scale} /> </Route>
                <Route exact path={`${path}/ladger`}> <Ladger UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/weekly_reports`}> <WeeklyReports UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/rtl_sell`}> <Sell UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bird_sell_report`}> <SellReport UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/batch_assesment`}> <BatchAssesment UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} Status={Data ? Data.Status : null} /> </Route>
                <Route exact path={`${path}/batch_account`}> <BatchAccount UserID={UserID} BisID={BisID} BatchID={BatchID} BatchDetails={Data} UserData={UserData} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/profit_n_loss`}> <ProfitNLoss UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/payment`}> <Payment UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route render={(props) => <Redirect to="/not_found" />} />
            </Switch>
        </>
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    UserID: props.match.params.id,
    BisID: props.match.params.bis_id,
    BatchID: props.match.params.batch_id,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(FarmMain);