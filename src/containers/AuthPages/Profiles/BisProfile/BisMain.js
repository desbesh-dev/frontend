import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { LoadProfile } from '../../../../actions/APIHandler';
import { logout } from '../../../../actions/auth';
import { BusinessPro } from '../../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
// import { ContractUpdate } from '../../../Contract/ContractUpdate';
// import { BatchIssuance } from './BatchIssuance';

import Bank from './Bank';
import Batches from './Batches';
import Details from './Details';
import Ladger from './Ladger/Ladger';

var QRCode = require('qrcode.react');
const BisMain = ({ display, CompanyID, BranchID, UserID, BisID, list, setList }) => {
    const [BUp, setBUp] = useState(false);
    const [Item, setItem] = useState(false);

    const [Data, setData] = useState(null);
    const [UserData, setUserData] = useState(null);
    const [Active, setActive] = useState(false);
    const [ShowBatch, setShowBatch] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    let { path, url } = useRouteMatch();


    useEffect(() => {
        MyProfile();
    }, [])

    const MyProfile = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        if (localStorage.getItem("user") !== null) {
            var result = await LoadProfile(UserID);
            if (result !== true) {
                var BisDetials = await BusinessPro(BisID);

                if (BisDetials !== true) {
                    setData(BisDetials);
                    setUserData(result);
                } else {
                    history.push('/not_found');
                }
            } else {
                history.push('/not_found');
            }

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/my_user_lists');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });

    }


    return (
        <>
            <div className="header mb-1">
                {
                    UserData && Data ?
                        <div className="d-flex justify-content-start overflow-auto bg-white mb-2 mx-0" style={{ maxHeight: "160px" }}>
                            <div className="col-lg-2 text-center my-auto">
                                {Data ? <QRCode className="img p-2 border" value={Data.id.toString()} size="60" /> : ""}
                            </div>
                            <div className="col-lg-3 text-md-left my-auto py-2">
                                <p className="fs-5 m-0">
                                    <p className="fs-4 fw-bold m-0">
                                        {Data ? Data.id + ". " + Data.Title : ""}
                                    </p> <br />
                                    <small className="text-muted fs-6">{Data ? Data.Type : ""}</small>
                                    <br />
                                    <small className="text-muted">
                                        {"Since " + new Date(Data.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
                                    </small>
                                    <br />
                                    <i class="fad fa-user pr-2"> </i>
                                    <Link to={`/user_profile/${UserID}`} className="fs-6 fw-bold">
                                        {UserData.UserInfo.id + ". " + UserData.Details.FullName}
                                    </Link>
                                    <p className="fs-5 fw-bold m-0">
                                        <i class="fad fa-phone-alt pr-2"> </i> {UserData.UserInfo.MobileNo + ", " + UserData.UserInfo.email}
                                    </p>

                                </p>
                            </div>

                            <div className="col-lg-1">
                                <div className="cs_outer" style={{ height: "100%" }}>
                                    <div className="cs_inner"></div>
                                </div>
                            </div>

                            <div className="col-lg-4 text-md-right my-auto py-2">
                                <p className="fs-5 m-0">
                                    <p className="fs-4 fw-bold m-0">
                                        {UserData.UserInfo.BranchID.BranchID + ". " + UserData.UserInfo.BranchID.Name + " Branch"}
                                    </p>

                                    <br />
                                    <i class="fad fa-user-tie pr-2"> </i>
                                    <Link to={`/user_profile/${Data.RepID.id}`} className="fs-5 fw-bold m-0">
                                        {Data.RepID.FirstName + " " + Data.RepID.LastName}
                                    </Link>

                                    <br />
                                    <small className="text-muted">
                                        {"H#" + UserData.Details.HoldingNo + ", Word No- " + UserData.Details.WardNo + ", Postal Code- " + UserData.Details.PostalCode}<br />
                                        {UserData.Details.VillageName + ", " + UserData.Details.Union + ", " + UserData.Details.Upazila + ", " + UserData.Details.Zila + ", " + UserData.Details.Division}
                                    </small>
                                </p>
                            </div>

                            <div className="col-lg-2 text-center my-auto">
                                <img
                                    src={UserData.Details.Image ? process.env.REACT_APP_API_URL + UserData.Details.Image : process.env.REACT_APP_API_URL + "/Media/no_logo.jpeg"}
                                    className="img" alt="avatar"
                                    width="130px" height="130px" />
                            </div>
                        </div>
                        : null
                }
                <div className="d-flex justify-content-start overflow-auto bg-white mx-0">
                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"1"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Layer</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"2"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Contract</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"1"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Private</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Debit</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Credit</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0">
                        <p className="fs-4 fw-bolder text-center m-0">{"01,234,567,890.00"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Balance</p>
                    </div>
                </div>
            </div>

            <div className="header d-flex justify-content-center bg-white my-0">
                <div className="d-flex justify-content-start overflow-auto">
                    {Data && Data.TypeID === 1 ?
                        <>
                            <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 1 ? "bg-light text-dark fw-bolder" : null}`}
                                onClick={(e) => setActive(1)} id="1" title="Batch Summary" type='button' to={`${url}/batches`}>Batches</Link>
                            <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                        </>
                        : null
                    }
                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 4 ? "bg-light text-dark fw-bolder" : null}`}
                        onClick={(e) => setActive(4)} id="4" title="Feed Consumption Ratio" type='button' to={`${url}/details`}>Details</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />

                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 2 ? "bg-light text-dark fw-bolder" : null}`}
                        onClick={(e) => setActive(2)} id="2" title="Daily Records" type='button' to={`${url}/bis_ladger`}>Ladger</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />

                    <Link className={`fw-bold fs-5 text-success p-2 text-decoration-none ${Active === 5 ? "bg-light text-dark fw-bolder" : null}`}
                        onClick={(e) => setActive(5)} id="5" title="Bank" type='button' to={`${url}/bank`}>Bank</Link>

                </div>
                {/* {
                    Item ?
                        <ContractUpdate
                            CompanyID={CompanyID}
                            BranchID={BranchID}
                            UserID={UserID}
                            item={Item}
                            show={BUp}
                            list={list}
                            setList={setList}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setBUp(false); setItem(false) }}
                        /> : null
                } */}
            </div>

            <Switch>
                {Data && Data.TypeID === 1 ?
                    <Fragment>
                        <Route exact path={path}><Batches UserID={UserID} BisID={BisID} list={list} setList={setList} /></Route>
                        <Route exact path={`${path}/batches`}> <Batches UserID={UserID} BisID={BisID} list={list} setList={setList} /> </Route>
                        <Route exact path={`${path}/details`}><Details UserID={UserID} BisID={BisID} list={list} setList={setList} /></Route>
                        <Route exact path={`${path}/bis_ladger`}> <Ladger UserID={UserID} BisID={BisID} BisData={Data} UserData={UserData} list={list} setList={setList} /> </Route>
                        <Route exact path={`${path}/bank`}> <Bank UserID={UserID} BisID={BisID} list={list} setList={setList} /> </Route>

                    </Fragment>
                    :
                    <Route exact path={path}><Details UserID={UserID} BisID={BisID} list={list} setList={setList} /></Route>
                }
                <Route exact path={`${path}/details`}> <Details UserID={UserID} BisID={BisID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bis_ladger`}> <Ladger UserID={UserID} BisID={BisID} BisData={Data} UserData={UserData} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bank`}> <Bank UserID={UserID} BisID={BisID} list={list} setList={setList} /> </Route>
                <Route render={(props) => <Redirect to="/not_found" />} />
            </Switch>
        </>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    UserID: props.match.params.id,
    BisID: props.match.params.bis_id,
    CompanyID: state.auth.user.D,
    BranchID: state.auth.user.BranchID
});

export default connect(mapStateToProps, { logout })(BisMain);