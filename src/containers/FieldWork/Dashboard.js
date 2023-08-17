import { Link, Redirect } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import Clock from '../AuthPages/Dashboard/Clock/clock';
import { Fragment } from 'react';
import React from 'react';
import axios from 'axios';
import { logout } from '../../actions/auth';
import CanvasJSReact from '../AuthPages/Dashboard/Chart/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const options = {
    height: 100,
    animationEnabled: true,
    title: {
        // text: "Customer Satisfaction"
    },
    subtitles: [{
        text: "12%",
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: false
    }],
    data: [{
        type: "doughnut",
        color: "whitesmoke",        // change color here
        dataPoints: [
            { name: "Unsatisfied", y: 5 },
        ]
    },
    {
        type: "doughnut",
        color: "black",
        dataPoints: [
            { name: "Very Unsatisfied", y: 31 }
        ]
    }]

}


const Home = ({ data }) => (
    <div className="row mx-auto">
        <div className="header d-flex py-2 pl-0 bg-white shadow-sm mb-2" style={{ borderRadius: "15px" }}>
            <div className="d-flex align-items-start flex-column w-100">
                <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="8"
                    // onMouseOver="stop();" onMouseOut="start();"
                    className="display-6 align-self-center text-success">
                    This is a breaking news with scrolling screen using by marquee text
                </marquee>
                <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="5"
                    // onMouseOver="stop();" onMouseOut="start();"
                    className="mx-auto align-self-center">
                    Example marquee text for broadcasting information to all
                </marquee>
            </div>
            <Clock />
        </div>

        <div className="row m-0 px-0 pb-2 d-flex justify-content-between">
            <div className="col-sm-5 col-md-5 col-lg-5 px-0">
                <div className="row d-flex justify-content-center align-items-center p-0 m-0">
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "20px 0px 0px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Total Farm</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">49</p>
                                <p class="card-text fs-6 fw-bold text-success pb-2 px-2 font-italic">
                                    <small class="text-muted font-italic">Non-issued farm </small> 55</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded-circle p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 20px 0px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Visited Today</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">20</p>
                                <p class="card-text fs-6 fw-bold text-success pb-2 px-2 font-italic">
                                    <small class="text-muted font-italic">Remaining Farm </small> 19
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-100"></div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 0px 0px 20px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Total Chicks</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">60,000 PCS</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 0px 20px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Live Chicks</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">58,741 PCS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-sm-2 col-md-2 col-lg-2 p-1">
                <div className="card text-center my-auto h-100 mb-0" style={{ borderRadius: "20px" }}>
                    <div className="card-body p-0">
                        <p class="fs-5 fw-bolder border-bottom border-light py-1 px-2 m-0">Mortality</p>
                        <CanvasJSChart options={options} />
                        <p class="card-text m-0 p-0"><small class="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
            </div>

            <div className="col-sm-5 col-md-5 col-lg-5 px-0">
                <div className="row d-flex justify-content-center align-items-center p-0 m-0">
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "20px 0px 0px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Total Batch Sell</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">214</p>
                                <p class="card-text fs-6 fw-bold text-success pb-2 px-2 font-italic">
                                    <small class="text-muted font-italic">Today </small> 2
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 20px 0px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Total Bird Sell</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">25,41,10,00,320 PCS</p>
                                <p class="card-text fs-6 fw-bold text-success pb-2 px-2 font-italic">
                                    <small class="text-muted font-italic">Today </small> 2,500 PCS
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-100"></div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 0px 0px 20px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Cash in Hand</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">BDT 2,10520</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 rounded p-1">
                        <div className="card text-center my-auto" style={{ borderRadius: "0px 0px 20px 0px" }}>
                            <div className="card-body p-0">
                                <p class="fs-5 fw-bolder border-bottom border-light py-1 m-0">Attended At</p>
                                <p class="fs-4 fw-bold text-primary py-0 px-2 m-0">9.58 AP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

);
const mapStateToProps = state => ({
    data: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Home);