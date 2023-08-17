
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import Select from 'react-select';
import { logout } from '../../../actions/auth';
import { FetchSummery } from '../../../actions/BoardAPI';
import { LoadCondList } from '../../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import CanvasJSReact from './Chart/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let today = new Date();
let prv_month = new Date();
prv_month.setMonth(prv_month.getMonth() - 1)

const Summary = ({ data }) => {
    const dispatch = useDispatch();
    const [FCRChart, setFCRChart] = useState([]);
    const [BirdChart, setBirdChart] = useState([]);
    const [PLChart, setPLChart] = useState([]);
    const [CostChart, setCostChart] = useState([]);
    const [Summary, setSummery] = useState([]);
    const [Batch, setBatch] = useState(false);

    const [Data, setData] = useState(false);
    const [DateFrom, setDateFrom] = useState(prv_month);
    const [DateTo, setDateTo] = useState(today);
    const [CondList, setCondList] = useState(null);
    const [Condition, setCondition] = useState(null);
    const [display, setdisplay] = useState('none');
    const [locale, setLocale] = useState('en');
    var from = moment(DateFrom).format("YYYY-MM-DD")
    var to = moment(DateTo).format("YYYY-MM-DD")

    useEffect(() => {
        LoadSummery(Condition ? Condition.value : null, from, to);
        LoadCondition();
    }, [])

    const LoadCondition = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const result = await LoadCondList();
        if (result !== true) {
            setCondList(result)
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadSummery = async (cond, from, to) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchSummery(cond, from, to);
        if (result !== true) {
            setSummery(result.Summary);
            setCostChart(result.CostChart);
            setPLChart(result.PLChart);
            setFCRChart(result.FCRChart);
            setBirdChart(result.BirdChart);
        } else {
            // history.push('/not_found');
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() < e.getTime()) {
            var to = moment(e).format("YYYY-MM-DD")
            LoadSummery(Condition ? Condition.value : null, from, to);
            setDateTo(e)
        } else {

        }
    }

    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }


    // let unique_search = Array.isArray(FitlerData) && FitlerData.length ? findUnique(FitlerData, d => d.CondTitle) : null;


    const CostOption = {
        animationEnabled: true,
        title: {
            text: "DOC Chart",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            // text: Summary ? parseFloat(Summary.TotalCost).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " Total Cost" : "0.00",
            verticalAlign: "center",
            fontSize: 24,
            dockInsidePlotArea: true,
            fontFamily: "MyriadPro_bold",
            wrap: false,
        }],
        data: [{
            type: "pie",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: Array.isArray(CostChart) && CostChart.length ? CostChart : []
        }]
    }

    const FCROption = {
        animationEnabled: true,
        title: {
            text: "Feed Convertion Ratio",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Summary ? parseFloat(Summary.AFCR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + " A-FCR" : "0.00% A-FCR",
            verticalAlign: "center",
            fontSize: 24,
            dockInsidePlotArea: true,
            fontFamily: "MyriadPro_bold",
            wrap: false,
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###.##",
            dataPoints: Array.isArray(FCRChart) && FCRChart.length ? FCRChart : []
        }]
    }

    const BirdOption = {
        animationEnabled: true,
        title: {
            text: "Bird Chart",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Summary ? parseFloat(Summary.Mortality).toLocaleString("en-BD", { minimumFractionDigits: 2 }) + "%" : "0.00%",
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
            dataPoints: Array.isArray(BirdChart) && BirdChart.length ? BirdChart : []
        }]
    }

    const PLOption = {
        animationEnabled: true,
        title: {
            text: "Profit & Loss",
            fontFamily: "MyriadPro_bold",
            fontColor: "gray",
        },
        subtitles: [{
            text: Array.isArray(PLChart) && PLChart.length ? PLChart.find(({ order }) => order === 1) ? parseFloat(PLChart.find(({ order }) => order === 1).y).toFixed(0) + "% " + PLChart.find(({ order }) => order === 1).name : "0%" : "0%",
            // text: Summary ? Summary.TotalCost : "0.00",
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
            dataPoints: Array.isArray(PLChart) && PLChart.length ? PLChart : []
        }]
    }



    return (
        <div className="row h-100 m-0 d-flex justify-content-center">
            <div className="col-md-12 justify-content-center align-items-center h-100 p-0">
                <div className={`d-flex justify-content-between bg-white py-2 px-2`}>
                    <p className='display-6 bg-white fw-bolder m-0 text-uppercase'>Range Calculation</p>
                    {/* <p className='display-6 bg-white fw-bold m-0'>{moment(DateFrom).format("DD MMM YYYY")}</p> */}
                    <div className="d-flex justify-content-end mx-2" style={{ minWidth: "30%" }}>
                        <Select
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                            borderRadius={"0px"}
                            // options={Data.map}
                            options={CondList}
                            defaultValue={{ label: "Select Dept", value: 0 }}
                            name="Search"
                            placeholder={"Select condition"}
                            styles={CScolourStyles}
                            value={Condition}
                            onChange={(e) => setCondition(e)}
                            required
                            id="Title"
                            isClearable={true}
                            isSearchable={true}
                        // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                        />
                    </div>
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
                    </div>
                </div>

                <div className='row mx-0 p-0 my-2 rounded bg-white' style={{ zIndex: "1000" }}>
                    <div className="col-sm-1 col-md-1 col-lg-1 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Batch).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase py-1 m-0 text-nowrap text-muted">Total Batch</p>
                    </div>

                    <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.AVGFeedCons).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" : "0.000KG"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase text-uppercase border-light py-1 m-0 text-nowrap text-muted">Feed Cons.</p>
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.AVGBodyWeight).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" : "0.000KG"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Body Weight</p>
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.FCR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">FCR</p>
                    </div>

                    <div className="col-sm-1 col-md-1 col-lg-1 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.AFCR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Actual FCR</p>
                    </div>

                    <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Profit).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Profit</p>
                    </div>

                    <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Loss).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Total Loss</p>
                    </div>
                    <div className="col-sm-2 col-md-2 col-lg-2 rounded p-1 m-0">
                        <div className="card text-center my-auto">
                            <div className="card-body p-0">
                                <p class="fs-4 fw-bolder text-primary py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(parseFloat(Summary.Profit) - parseFloat(Summary.Loss)).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                <div class="divider div-transparent div-dot"></div>
                            </div>
                        </div>
                        <p class="fs-5 fw-bolder text-center text-uppercase border-light py-1 m-0 text-nowrap text-muted">Status</p>
                    </div>
                </div>

                <div className='row m-0 p-0'>
                    <div className="col-md-6 bg-white rounded px-0 py-5">
                        {Array.isArray(CostChart) && CostChart.length ?
                            <CanvasJSChart options={CostOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                            : null}
                    </div>

                    <div className="col-md-6 bg-white rounded px-0 py-5">
                        {Array.isArray(PLChart) && PLChart.length ?
                            <CanvasJSChart options={FCROption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                            : null}
                    </div>

                    <div className='row m-0 p-0'>
                        <div className="col-md-6 bg-white rounded p-1">
                            <div className='d-flex justify-content-center align-items-center border-top border-left border-right m-0 p-0'>
                                <p class="fs-6 fw-bolder text-center py-1 m-0 text-nowrap text-muted">TOTAL COST: </p>
                                <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotalCost).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                            </div>

                            <div className='row border rounded m-0 p-0'>
                                <div className="col-md-3 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Chick).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Chick</p>
                                </div>
                                <div className="col-md-3 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Feed).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Feed</p>
                                </div>
                                <div className="col-md-3 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Medicine).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Medicine</p>
                                </div>
                                <div className="col-md-3 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Payment).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Payment</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 bg-white rounded p-1">
                            <div className='d-flex justify-content-center align-items-center border-top border-left border-right m-0 p-0'>
                                <p class="fs-6 fw-bolder text-center py-1 m-0 text-nowrap text-muted">FEED CONVERTION RATIO (FCR): </p>
                                <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.FCR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>

                                <p class="fs-6 fw-bolder text-center py-1 m-0 text-nowrap text-muted">ACTUAL FCR: </p>
                                <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.AFCR).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                            </div>

                            <div className='row border rounded m-0 p-0'>
                                <div className="col-md-2 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.SellQty).toLocaleString("en-BD", { minimumFractionDigits: 0 }) : "0"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Bird</p>
                                </div>
                                <div className="col-md-4 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotWeight).toLocaleString("en-BD", { minimumFractionDigits: 3 }) : "0.000"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Weight</p>
                                </div>
                                <div className="col-md-2 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.SellRate).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Rate</p>
                                </div>
                                <div className="col-md-4 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotalSell).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Sell</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='row m-0 p-0'>
                    <div className="col-md-6 bg-white rounded px-0 py-5">
                        {Array.isArray(BirdChart) && BirdChart.length ?
                            <CanvasJSChart options={BirdOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                            : null}
                    </div>

                    <div className="col-md-6 bg-white rounded px-0 py-5">
                        {Array.isArray(PLChart) && PLChart.length ?
                            <CanvasJSChart options={PLOption} containerProps={{ paddingLeft: '0px', paddingRight: '0px' }} />
                            : null}
                    </div>

                    <div className='row m-0 p-0'>
                        <div className="col-md-6 bg-white rounded p-1">
                            <div className='d-flex justify-content-center align-items-center border-top border-left border-right m-0 p-0'>
                                <p class="fs-6 fw-bolder text-center py-1 m-0 text-nowrap text-muted">Mortality: </p>
                                <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Mortality).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00%"}</p>
                            </div>

                            <div className='row border rounded m-0 p-0'>
                                <div className="col-md-2 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Placed).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS" : "0"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Placed</p>
                                </div>
                                <div className="col-md-4 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Expired).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS" : "0 PCS"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Expired</p>
                                </div>
                                <div className="col-md-2 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Lost).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS" : "0.00 PCS"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Lost</p>
                                </div>
                                <div className="col-md-4 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Dispatch).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS" : "0 PCS"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Dispatch</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 bg-white rounded p-1">
                            <div className='d-flex justify-content-center align-items-center border-top border-left border-right m-0 p-0'>
                                <p class="fs-6 fw-bolder text-center py-1 m-0 text-nowrap text-muted">P&L STATUS: </p>
                                <p class="fs-5 fw-bolder text-primary text-center py-0 px-2 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(parseFloat(Summary.Profit) - parseFloat(Summary.Loss)).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                            </div>

                            <div className='row border rounded m-0 p-0'>
                                <div className="col-md-6 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.TotFeedSent).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + "BG" : "0BG"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Feed Sent</p>
                                </div>
                                <div className="col-md-6 bg-white rounded p-0">
                                    <p class="fs-5 fw-bolder text-primary text-center py-0 px-1 m-0" style={{ fontFamily: "Lato" }}>{Summary ? parseFloat(Summary.Consumption).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + "KG" : "0.000KG"}</p>
                                    <p class="fs-6 fw-bold text-center py-1 m-0 text-nowrap text-muted">Cons</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row justify-content-around align-items-center mx-0 p-0 bg-white rounded py-5' style={{ zIndex: "1000", marginTop: "0px" }}>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1 m-0 w-auto">
                        <div className='justify-content-center align-items-center border border-dark py-5 px-1' style={{ borderRadius: "50%" }}>
                            <p class="fs-5 fw-bolder text-center text-uppercase py-1 m-0 text-nowrap text-dark" style={{ fontFamily: "Scream alt outlined" }}>AVERAGE CHICK RATE</p>
                            <p class="display-1 fw-bold text-dark text-center py-0 px-2 m-0 w-auto" style={{ fontFamily: "Scream alt" }}>{Summary ? parseFloat(Summary.ChickRate).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1 m-0 w-auto">
                        <div className='justify-content-center align-items-center border border-danger py-5 px-1' style={{ borderRadius: "50%" }}>
                            <p class="display-1 fw-bold text-danger text-center py-0 px-2 m-0" style={{ fontFamily: "Scream alt outlined" }}>{Summary ? parseFloat(Summary.SellRate).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}</p>
                            <p class="fs-5 fw-bolder text-center text-uppercase text-uppercase border-light py-1 m-0 text-nowrap text-danger" style={{ fontFamily: "Scream alt" }}>Average Sell Rate</p>
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

export default connect(mapStateToProps, { logout })(Summary);