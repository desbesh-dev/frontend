import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { DISPLAY_OVERLAY } from '../../../actions/types';
// import DailyRecord from './DailyRecords';
// import Ladger from './Ladger';
// import Sell from './Sells';
// import SellReport from './SellReport';
// import BatchSummery from './BatchSummery';
// import BatchAccount from './BatchAccount';
// import BatchAssesment from './BatchAssesment';
// import ProfitNLoss from './ProfitNLoss';
// import Payment from './Payment';
// import WeeklyReports from './WeeklyReports';
import GoodsNBirds from './GodownLists';
import { Create } from './Modals/ModalForm';
import SendProduct from './Products/GDInvoice';

const GoodsNBird = ({ display, UserID, list, setList, scale, sub_scale }) => {
    const [Data, setData] = useState(null)
    const dispatch = useDispatch();
    const [Summary, setSummery] = useState(0);
    const [Active, setActive] = useState(0);
    const [UserData, setUserData] = useState(null);
    // const [BusinessID, setBusinessID] = useState(false);
    const [ShowBatch, setShowBatch] = useState(false);
    const [CreateModalShow, setCreateModalShow] = useState(false);
    let { path, url } = useRouteMatch();
    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        MyUsers();
    }, [])

    const MyUsers = async () => {
        if (localStorage.getItem("user") !== null) {
            // var result = await LoadProfile(UserID);
            // if (result !== true) {
            //     var BatchDetials = await BatchPro(BatchID);
            //     if (BatchDetials !== true) {
            //         setData(BatchDetials);
            //         setUserData(result);
            //     } else {
            //         history.push('/not_found');
            //     }
            // } else {
            //     history.push('/not_found');
            // }
        } else {
            history.push('/');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const history = useHistory();
    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-lg-11 h-100 px-0">
                <div className="row d-flex mx-auto py-1">
                    <div className={`d-flex justify-content-around align-items-center bg-white`}>
                        <button className='btn text-dark fw-bold m-0 fs-4'><i class="fad fa-warehouse"></i> Godown List</button>
                        <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                        <button className='btn text-dark fw-bold m-0 fs-4'><i class="fad fa-history"></i> History</button>
                        <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                        <button className='btn text-dark fw-bold m-0 fs-4' onClick={() => setCreateModalShow(true)}
                        ><i class="fad fa-layer-plus"></i> Create New</button>
                    </div>

                </div>


                <Switch>
                    <Route exact path={path}> <GoodsNBirds UserID={UserID} Status={Data ? Data.Status : 1} list={list} setList={setList} setSummery={setSummery} /> </Route>
                    <Route exact path={`${path}/goodown_list`}> <GoodsNBirds UserID={UserID} list={list} setList={setList} scale={scale} sub_scale={sub_scale} /> </Route>
                    <Route exact path={`${path}/gd_invoice`}> <SendProduct UserID={UserID} list={list} setList={setList} scale={scale} sub_scale={sub_scale} /> </Route>
                    {/* <Route exact path={`${path}/ladger`}> <Ladger UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/weekly_reports`}> <WeeklyReports UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/rtl_sell`}> <Sell UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/bird_sell_report`}> <SellReport UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/batch_assesment`}> <BatchAssesment UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} Status={Data ? Data.Status : null} /> </Route>
                <Route exact path={`${path}/batch_account`}> <BatchAccount UserID={UserID} BisID={BisID} BatchID={BatchID} BatchDetails={Data} UserData={UserData} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/profit_n_loss`}> <ProfitNLoss UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/payment`}> <Payment UserID={UserID} BisID={BisID} BatchID={BatchID} list={list} setList={setList} /> </Route> */}
                    <Route render={(props) => <Redirect to="/not_found" />} />
                </Switch>
            </div>
            {
                <Create
                    show={CreateModalShow}
                    list={list}
                    setList={setList}
                    onReload={() => { setCreateModalShow(false); }}
                    onHide={() => { setCreateModalShow(false); }}
                />
            }
        </div>
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

export default connect(mapStateToProps, { logout })(GoodsNBird);