import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { checkToken } from '../../actions/auth';
import { DISPLAY_OVERLAY } from '../../actions/types';

export const CondRateModal = (props) => {
    const [Loading, setLoading] = useState(false)
    const [Next, setNext] = useState(false)
    const initialValue = { value: 0, label: "" };
    const [RepLists, setRepLists] = useState(initialValue);
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        CompanyID: props.CompanyID,
        BranchID: props.BranchID,
        CondID: props.CondID,
        CondTitle: props.CondTitle,
    });

    useEffect(() => {
        // LoadRep();
    }, [])

    const { CompanyID, BranchID, CondID, CondTitle } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    const LoadRep = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
                // 'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/rep_lists/`, config);
            setRepLists(res.data.Rep);

        } catch (err) {
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    // const SendContract = async () => {
    //     const result = await UpdateContract(props.Data.id, props.Data.farm[0] ? props.Data.farm[0].id : 0, Title, SecurityMoney, Balance, RepID, FarmReg, BlankCheque, Agreement, ShedSize, Floor, Roof, WaterPot, FeedPot, Employee, Contact);
    //     
    //     if (result !== true) {
    //         if (result.user_error) {
    //             const updatedState = {};
    //             for (var pair of result.exception.entries()) {
    //                 updatedState[pair[1].field] = pair[1].message;
    //                 setError({
    //                     ...updatedState,
    //                 });
    //             }
    //             props.setList([...props.list, toastProperties = {
    //                 id: 1,
    //                 title: 'Invalid Data',
    //                 description: result.message,
    //                 backgroundColor: '#f0ad4e',
    //                 icon: warningIcon
    //             }])

    //         } else {
    //             props.setList([...props.list, toastProperties = {
    //                 id: 1,
    //                 title: 'Success',
    //                 description: result.message,
    //                 backgroundColor: '#f0ad4e',
    //                 icon: successIcon
    //             }])
    //             props.onReload();
    //         }
    //     } else {
    //         props.setList([...props.list, toastProperties = {
    //             id: 1,
    //             title: 'Error',
    //             description: "Failed to update contract farm. Please try after some moment.",
    //             backgroundColor: '#f0ad4e',
    //             icon: errorIcon
    //         }])
    //     }
    //     dispatch({ type: DISPLAY_OVERLAY, payload: false });
    // }

    const ClearField = () => {
        // setFormData({
        //     CompanyID: props.CompanyID,
        //     BranchID: props.BranchID,
        //     UserID: props.UserID,
        //     Title: props.Data.Title,
        //     SecurityMoney: props.Data.SCMoney,
        //     Balance: props.Data.Balance,
        //     RepName: props.Data.RepID.FirstName + " " + props.Data.RepID.LastName,
        //     RepID: props.Data.RepID.id,
        //     FarmReg: props.Data.FarmReg ? true : false,
        //     BlankCheque: props.Data.BlankCheque ? true : false,
        //     Agreement: props.Data.Agreement ? true : false,

        //     ShedSize: props.Data.farm[0] ? props.Data.farm[0].ShedSize : "",
        //     Floor: props.Data.farm[0] ? props.Data.farm[0].Floor : "",
        //     Roof: props.Data.farm[0] ? props.Data.farm[0].Roof : "",
        //     WaterPot: props.Data.farm[0] ? props.Data.farm[0].WaterPot : "",
        //     FeedPot: props.Data.farm[0] ? props.Data.farm[0].FeedPot : "",
        //     Employee: props.Data.farm[0] ? props.Data.farm[0].Employee : "",
        //     Contact: props.Data.farm[0] ? props.Data.farm[0].ContactNo : "",
        // })
        // setNext(false)
        const initialValue = { value: 0, label: "" };
        setRepLists(initialValue);

        props.onHide()
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // onClick={() => ClearField()}
        >
            <Modal.Header className="py-2">
                <p id="contained-modal-title-vcenter" className="fs-4 fw-bold text-dark m-0 justify-content-center">
                    Creating Condition of Contract for {props.CondTitle} <br />
                    <small>Please fill up the required info</small>
                </p>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-2">
                            <label className="d-flex justify-content-center" for="inputEmail4">Email</label>
                            <input type="email" class="form-control" id="inputEmail4" placeholder="Email" />
                        </div>
                        <div className="form-group col-md-2">
                            <label className="d-flex justify-content-center" for="inputPassword4">Password</label>
                            <input type="password" class="form-control" id="inputPassword4" placeholder="Password" />
                        </div>
                        <div className="form-group col-md-2 d-flex justify-content-center align-items-end">
                            <label className="fs-w fw-bold" for="inputEmail4">&#8651;</label>
                        </div>
                        <div className="form-group col-md-2">
                            <label className="d-flex justify-content-center" for="inputEmail4">Email</label>
                            <input type="email" class="form-control" id="inputEmail4" placeholder="Email" />
                        </div>
                        <div className="form-group col-md-2">
                            <label className="d-flex justify-content-center" for="inputPassword4">Password</label>
                            <input type="password" class="form-control" id="inputPassword4" placeholder="Password" />
                        </div>
                        <div className="form-group col-md-2 d-flex justify-content-center align-items-end">
                            <button type="submit" class="btn btn-primary">Sign in</button>

                        </div>
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-success" onClick={() => ClearField()}>Close</button>
                {
                    !Next ?
                        <button onClick={() => setNext(true)} className="btn btn-outline-success"> Next<span aria-hidden="true">&rarr;</span></button> :
                        <Fragment>
                            <button className="btn btn-outline-success" onClick={() => setNext(false)}><span aria-hidden="true">&larr;</span> Back </button>
                            <button className="btn btn-outline-success"
                            // onClick={() => SendContract()}
                            >Submit </button>
                        </Fragment>
                }
            </Modal.Footer>
        </Modal >
    );
}