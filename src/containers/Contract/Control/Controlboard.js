
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { FetchBoard } from '../../../actions/BoardAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import CanvasJSReact from './Chart/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const Controlboard = ({ data }) => {
    const dispatch = useDispatch();
    const [Farmer, setFarmer] = useState([]);
    const [Farm, setFarm] = useState([]);
    const [Bird, setBird] = useState([]);
    const [Feed, setFeed] = useState([]);
    const [Summary, setSummery] = useState([]);
    const [Batch, setBatch] = useState(false);
    const [display, setdisplay] = useState('none');

    useEffect(() => {
        LoadBoard();
    }, [])

    const LoadBoard = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchBoard();
        if (result !== true) {
            setFarmer(result.farmer);
            setFarm(result.farm);
            setSummery(result.Summary);
            setBird(result.BirdChart);
            setFeed(result.FeedChart);
            setBatch(result.BatchSummery);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const options = {
        animationEnabled: true,
        title: {
            text: "FARMER CHART",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 1) ? parseFloat(Farmer.find(({ order }) => order === 1).y).toFixed(0) + "% Running" : "0%" : "0%",
            verticalAlign: "center",
            fontSize: 24,
            dockInsidePlotArea: true,
            fontFamily: "MyriadPro_bold",
            wrap: true,
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: Array.isArray(Farmer) && Farmer.length ? Farmer : []
        }]
    }

    const FarmOption = {
        animationEnabled: true,
        title: {
            text: "FARMS CHART",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 1) ? parseFloat(Farm.find(({ order }) => order === 1).y).toFixed(0) + "% Running" : "0%" : "0%",
            verticalAlign: "center",
            fontSize: 24,
            dockInsidePlotArea: true,
            fontFamily: "MyriadPro_bold",
            wrap: true,
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: Array.isArray(Farm) && Farm.length ? Farm : []
        }]
    }

    const BirdOption = {
        animationEnabled: true,
        title: {
            text: "BIRD CHART",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Batch ? ((Batch.Expired / Batch.PlacedBird) * 100).toFixed(2) + "%" : "0%",
            verticalAlign: "center",
            fontSize: 30,
            dockInsidePlotArea: true,
            fontFamily: "Scream alt outlined",
            fontWeight: "400",
            fontColor: "Green",
            wrap: true,
        }],
        data: [{
            type: "pie",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: Array.isArray(Bird) && Bird.length ? Bird : []
        }]
    }
    const FeedOption = {
        animationEnabled: true,
        title: {
            text: "FEED CHART",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Batch ? ((Batch.Stock / Batch.FeedWt) * 100).toFixed(2) + "%" : "0%",
            verticalAlign: "center",
            fontSize: 30,
            dockInsidePlotArea: true,
            fontFamily: "Scream alt",
            fontWeight: "bold",
            fontColor: "Green",
            wrap: true,
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: Array.isArray(Feed) && Feed.length ? Feed : []
        }]
    }

    return (
        <div className="row mx-auto h-100 m-0">
            <div className="header d-flex justify-content-center py-2 pl-0 bg-white shadow-sm mb-2 rounded">
                <p class="display-6 fw-bolder text-center border-light py-1 m-0"
                //  style={{ fontFamily: "Roboto" }}
                >Contract farm summery and it's analysis</p>
            </div>
            <div className='col-lg-12 h-100 m-0 p-0'>
                <div className="position-absolute overflow-auto mx-auto w-100" style={{ height: "90%", zIndex: "1000" }}>
                    <div className='row my-2 mx-0 p-0 rounded bg-white' style={{ zIndex: "1000" }}>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.BatchPaid).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase py-1 m-0 text-nowrap text-muted">Total Batch Paid</p>
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.SavingPaid).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Saving Paid</p>
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.SavingPayable).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Current Savings</p>
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotalSaving).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Savings</p>
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.SCMoney).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Security Money</p>
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                            <div className="card text-center my-auto">
                                <div className="card-body p-0">
                                    <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotalPaid).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <div class="divider div-transparent div-dot"></div>
                                </div>
                            </div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Paid</p>
                        </div>
                    </div>

                    <div className='row bg-white rounded m-0 p-0' style={{ zIndex: "1000" }}>
                        <div className="col-sm-4 col-md-4 col-lg-4 rounded px-1 py-2">
                            <div className='d-flex align-content-between flex-column h-100'>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-success p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 1) ? parseInt(Farmer.find(({ order }) => order === 1).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 1) ? Farmer.find(({ order }) => order === 1).name : "Running Farmers" : "Running Farmers"}</p>
                                    </div>
                                </div>

                                <div className="card text-center my-1 border">
                                    <div className="card-body text-info p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 3) ? parseInt(Farmer.find(({ order }) => order === 3).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 3) ? Farmer.find(({ order }) => order === 3).name : "Walk-in Farmers" : "Walk-in Farmers"}</p>
                                    </div>
                                </div>
                                <div className="card text-center my-1 border border">
                                    <div className="card-body text-warning p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 2) ? parseInt(Farmer.find(({ order }) => order === 2).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 2) ? Farmer.find(({ order }) => order === 2).name : "Active Farmers" : "Active Farmers"}</p>
                                    </div>
                                </div>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-danger p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 4) ? parseInt(Farmer.find(({ order }) => order === 4).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot text-dark"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 4) ? Farmer.find(({ order }) => order === 4).name : "Blocked Farmers" : "Blocked Farmers"}</p>

                                    </div>
                                </div>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-dark p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 5) ? parseInt(Farmer.find(({ order }) => order === 5).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farmer) && Farmer.length ? Farmer.find(({ order }) => order === 5) ? Farmer.find(({ order }) => order === 5).name : "Total Farmers" : "Total Farmers"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-8 rounded px-0 py-2">
                            {Array.isArray(Farmer) && Farmer.length ?
                                <CanvasJSChart options={options} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                                : null}
                        </div>
                    </div>
                    <div className='row justify-content-center align-items-center bg-white rounded my-2 mx-0 p-0' style={{ zIndex: "1000" }}>
                        <div className="col-md-8 col-xs-8 justify-content-center align-items-center rounded px-0 py-2">
                            {Array.isArray(Farm) && Farm.length ?
                                <CanvasJSChart options={FarmOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                                : null}
                            <div className='d-flex justify-content-end align-items-end mt-5 p-0'>
                                <Link className='btn btn-outline-dark fs-4 fw-bold text-center mx-auto px-2' to={'/contract_summery'} style={{ borderRadius: "20px" }}><i class="fad fa-chart-area border-right pr-1"></i> Range Calculation</Link>
                                <Link className='btn btn-outline-primary fs-4 fw-bold text-center mx-auto px-2' to={'/fcr_rank'} style={{ borderRadius: "20px" }}><i class="fad fa-crown border-right pr-1"></i> FCR Ranking</Link>
                                <Link className='btn btn-outline-warning fs-4 fw-bold text-center mx-auto px-2' to={'/lucy_rank'} style={{ borderRadius: "20px" }}><i class="fad fa-star border-right pr-1"></i> Lucy Ranking</Link>
                            </div>
                        </div>

                        <div className="col-sm-4 col-md-4 col-lg-4 rounded px-1 py-2">
                            <div className='d-flex align-content-between flex-column h-100'>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-success p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 1) ? parseInt(Farm.find(({ order }) => order === 1).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 1) ? Farm.find(({ order }) => order === 1).name : "Running Farmers" : "Running Farmers"}</p>
                                    </div>
                                </div>

                                <div className="card text-center my-1 border">
                                    <div className="card-body text-success p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 0) ? parseInt(Farm.find(({ order }) => order === 0).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 0) ? Farm.find(({ order }) => order === 0).name : "Not Placed" : "Not Placed"}</p>
                                    </div>
                                </div>

                                <div className="card text-center my-1 border border">
                                    <div className="card-body text-warning p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 2) ? parseInt(Farm.find(({ order }) => order === 2).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 2) ? Farm.find(({ order }) => order === 2).name : "Under Review" : "Under Review"}</p>
                                    </div>
                                </div>

                                <div className="card text-center my-1 border">
                                    <div className="card-body text-info p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 3) ? parseInt(Farm.find(({ order }) => order === 3).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 3) ? Farm.find(({ order }) => order === 3).name : "Account Approval" : "Account Approval"}</p>
                                    </div>
                                </div>

                                <div className="card text-center my-1 border">
                                    <div className="card-body text-danger p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 4) ? parseInt(Farm.find(({ order }) => order === 4).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot text-dark"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 4) ? Farm.find(({ order }) => order === 4).name : "Payment Hold" : "Payment Hold"}</p>

                                    </div>
                                </div>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-danger p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 5) ? parseInt(Farm.find(({ order }) => order === 5).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot text-dark"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 5) ? Farm.find(({ order }) => order === 5).name : "In-active Farms" : "In-active Farms"}</p>

                                    </div>
                                </div>
                                <div className="card text-center my-1 border">
                                    <div className="card-body text-dark p-0">
                                        <p class="fs-1 fw-bolder py-0 px-2 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 6) ? parseInt(Farm.find(({ order }) => order === 6).value).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0" : "0"}</p>
                                        <div class="divider div-transparent div-dot"></div>
                                        <p class="fs-5 text-uppercase fw-bolder py-1 m-0">{Array.isArray(Farm) && Farm.length ? Farm.find(({ order }) => order === 6) ? Farm.find(({ order }) => order === 6).name : "Total Farms" : "Total Farms"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row bg-white rounded my-2 mx-0 p-0' style={{ zIndex: "1000" }}>
                        <div className="col-sm-4 col-md-4 col-lg-4 rounded px-0 py-2">
                            <div className="card text-center text-dark my-auto">
                                <p class="fs-1 fw-bolder py-0 px-2 m-0" style={{ fontFamily: "Tahoma" }}>{Batch ? parseFloat(Batch.PlacedBird).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                            <p class="fs-5 fw-bolder text-uppercase text-center border-light py-1 m-0 text-nowrap">Total Birds</p>

                        </div>
                        <div className="col-sm-3 col-md-3 col-lg-3 rounded px-0 py-2">
                            <div className="card text-center text-primary my-auto">
                                <p class="fs-1 fw-normal py-0 px-2 m-0" style={{ fontFamily: "Scream alt" }}>{Batch ? parseFloat(Batch.LiveBird).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                            <p class="fs-5 fw-bolder text-uppercase text-center border-light py-1 m-0 text-nowrap">Live Birds</p>

                        </div>
                        <div className="col-sm-3 col-md-3 col-lg-3 rounded px-0 py-2">
                            <div className="card text-center text-danger my-auto">
                                <p class="fs-1 fw-normal py-0 px-2 m-0" style={{ fontFamily: "Scream alt outlined" }}>{Batch ? parseFloat(Batch.Expired).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                            <p class="fs-5 fw-bolder text-uppercase text-center border-light py-1 m-0 text-nowrap">Expire Birds</p>

                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <div className="card text-center text-danger my-auto rounded">
                                <p class="fs-1 fw-bolder py-0 px-2 m-0" style={{ fontFamily: "Scream alt outlined" }}>{Batch ? ((Batch.Expired / Batch.PlacedBird) * 100).toFixed(2) + "%" : "0%"}</p>
                                <div class="divider div-transparent div-dot"></div>
                                {/* <p class="fs-5 fw-bolder text-uppercase border-light py-1 m-0 text-nowrap">Mortality</p> */}
                            </div>
                            <p class="fs-5 fw-bolder text-uppercase text-center border-light py-1 m-0 text-nowrap">Mortality</p>
                        </div>


                        <div className="col-sm-6 col-md-6 col-lg-6 rounded px-0 py-2">
                            {Array.isArray(Farm) && Farm.length ?
                                <CanvasJSChart options={BirdOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                                : null}
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-6 rounded px-0 py-2">
                            {Array.isArray(Farm) && Farm.length ?
                                <CanvasJSChart options={FeedOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                                : null}
                        </div>

                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-bolder text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Tahoma" }}>{Batch ? parseFloat(Batch.FeedQty).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "BG" : "0BG"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Feed Sent (BG)</p>
                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-bolder text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Tahoma" }}>{Batch ? parseFloat(Batch.FeedWt).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" : "0KG"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Feed Sent (KG)</p>
                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-normal text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Scream alt outlined" }}>{Batch ? parseFloat(Batch.Consumption / 50).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + "BG" : "0BG"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Consumption (BG)</p>
                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-normal text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Scream alt outlined" }}>{Batch ? parseFloat(Batch.Consumption).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + "KG" : "0"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Consumption (KG)</p>
                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-normal text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Scream alt" }}>{Batch ? parseFloat(Batch.Stock / 50).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + "BG" : "0BG"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Stock (BG)</p>
                        </div>
                        <div className="col-sm-2 col-md-2 col-lg-2 rounded px-0 py-2">
                            <p class="fs-3 fw-normal text-center py-0 px-2 m-0 cs_shadow" style={{ fontFamily: "Scream alt" }}>{Batch ? parseFloat(Batch.Stock).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + "KG" : "0"}</p>
                            <div class="divider div-transparent div-dot"></div>
                            <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap">Total Stock (KG)</p>
                        </div>

                    </div>
                </div>
            </div>
        </div >


    );
}
const mapStateToProps = state => ({
    data: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Controlboard);