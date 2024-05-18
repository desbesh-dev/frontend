import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { GetParty, GetPartyAdmin } from '../../../../actions/APIHandler';
import { logout } from '../../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../../actions/types';

import Bank from './Bank';
import DeliveryOrder from './DeliveryOrder';
import Details from './Details';
import Invoices from './Invoices';
import Ladger from './Ladger/Ladger';

const PartyMain = ({ UserID, PartyID, MyPartyID, list, setList, no }) => {
    const [Data, setData] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        LoadParty();
    }, [])

    const LoadParty = async () => {
        if (no <= 11)
            var result = await GetPartyAdmin(PartyID);
        else if ([8, 11].includes(no))
            var result = await GetParty(PartyID);

        if (result !== true) {
            setData(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/my_party_list');
        }
    }

    return (
        <>
            {/* <div className="header mb-0">
                <div className="d-flex justify-content-start overflow-auto bg-white mx-0 mb-2">
                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "40px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{"0"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Trans</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data?.Invoice ?? "0"}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Invoice</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data?.GrandTotal ?? 0.00}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Total Sale</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center text-uppercase m-0">{Data?.Paid ?? 0.00}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Paid</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data?.ReturnTotal ?? 0.00}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">Refund</p>
                    </div>

                    <div className="col-md-2 text-md-center my-auto px-0 text-center border-right" style={{ minWidth: "80px" }}>
                        <p className="fs-4 fw-bolder text-center m-0">{Data?.Balance !== undefined ? Data?.Balance : Data?.Due}</p>
                        <p className="fs-5 fw-bold m-0 text-uppercase text-center text-success bg-light">{Data?.Balance !== undefined ? "Balance" : "Due"}</p>
                    </div>
                </div>
            </div> */}

            <div className="item grid-group-item list-group-item m-0 px-0" style={{ borderLeft: "5px solid #ffc107", borderRight: "5px solid #ffc107", borderRadius: "10px" }}>
                <div className="d-flex justify-content-between align-items-center py-2 px-1">
                    <div className="fs-5 m-0 px-2">
                        <p className="display-6 fw-bold d-flex justify-content-start m-0">{Data ? Data.PartyInfo.Title : null}</p>
                        <p className="fs-5 fw-bold m-0">Address:</p>
                        <p className="fs-5 text-muted m-0">{Data ? Data.SectorArray[0].Address : "N/A"}</p>
                    </div>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "60px" }}>
                        {/* <div className="cs_inner"></div> */}
                    </div>
                    <p className="fs-5 m-0 px-2">
                        <p className="display-6 fw-bold text-right m-0">{Data ? Data.PartyInfo.Name : null}</p>
                        <p className="fs-5 fw-bold text-right m-0">{Data ? Data.Contact : "N/A"}</p>
                    </p>
                </div>
            </div>

            <div className="header d-flex justify-content-center bg-white my-1">
                <div className="d-flex justify-content-start overflow-auto">
                    <Link className='fw-bold fs-5 text-success p-2' title="Transactions" type='button' to={`${url}/bis_ladger`}>Transactions</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}></div>
                    <Link className='fw-bold fs-5 text-success p-2' title="Transactions" type='button' to={`${url}/order`}>D/O</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}></div>
                    <Link className='fw-bold fs-5 text-success p-2' title="Invoices" type='button' to={`${url}/party_invoices`}>Invoices</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className="fw-bold fs-5 text-success p-2" type='button' to={`${url}`}>Banks</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className='fw-bold fs-5 text-success p-2' title="Details" type='button' to={`${url}/details`}>Details</Link>

                </div>
            </div>

            <Switch>
                <Route exact path={path}><Details PartyID={PartyID} list={list} setList={setList} /></Route>
                <Route exact path={`${path}/order`}> <DeliveryOrder PartyID={PartyID} MyPartyID={MyPartyID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/details`}> <Details PartyID={PartyID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bis_ladger`}> <Ladger PartyID={PartyID} MyPartyID={MyPartyID} BisData={Data} Title={Data?.PartyInfo?.Title} Address={Data?.SectorArray[0]?.Address} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bank`}> <Bank PartyID={PartyID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/party_invoices`}> <Invoices PartyID={PartyID} MyPartyID={MyPartyID} list={list} setList={setList} /> </Route>
            </Switch>
        </>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    UserID: props.match.params.id,
    PartyID: props.match.params.party_id,
    MyPartyID: props.match.params.my_party_id,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(PartyMain);