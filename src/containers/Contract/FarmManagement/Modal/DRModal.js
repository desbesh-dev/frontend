import {Modal} from "react-bootstrap";
import React, { useState } from 'react';
import Select from 'react-select';

import { useDispatch } from 'react-redux';
import { customHeader, locales } from "../../../Suppliers/Class/datepicker";
import * as moment from 'moment'

import Datepicker from 'react-datepicker';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { RecordUpdate } from "../../../../actions/ContractAPI";
let today = new Date()

export const UpdateModal = (props) => {
    const [CSDate, setCSDate] = useState(props.Item.Date ? props.Item.Date : null)
    const [Age, setAge] = useState(props.Item.Age ? props.Item.Age : null)
    const [DMort, setDMort] = useState(props.Item.DMort ? props.Item.DMort : 0)
    const [DFeed, setDFeed] = useState(props.Item.DFeed ? props.Item.DFeed : 0)
    const [DCons, setDCons] = useState(props.Item.DCons ? props.Item.DCons : 0)
    const [FeedStock, setFeedStock] = useState(props.Item.FeedStock ? props.Item.FeedStock : 0)
    const [ABW, setABW] = useState(props.Item.ABW ? props.Item.ABW : 0)
    const [EntryType, setEntryType] = useState(props.Item.EntryType ? props.Item.EntryType : false)
    const [Remark, setRemark] = useState(props.Item.Remark ? props.Item.Remark : "N/A")
    const [Error, setError] = useState({});
    const [locale, setLocale] = useState('en');

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setCSDate(today);
        setAge(0);
        setDMort(0);
        setDFeed(0);
        setDCons(0);
        setFeedStock(0);
        setABW(0);
        setEntryType("");
        setRemark("");
        props.onHide();
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    }

    const UpdateRecord = async () => {
        var data = moment(CSDate).format('YYYY-MM-DD')
        const result = await RecordUpdate(props.Item.id, data, Age, DMort, DFeed, DCons, FeedStock, ABW, EntryType, Remark);
        if (result !== true) {
            if (result.error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({ ...updatedState });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid Data',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: result.Title,
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
                }])
                PropLoadSet();
                props.onReload();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Failed to update daily record. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: result.ico === 1 ? successIcon : result.ico === 2 ? infoIcon : result.ico === 3 ? warningIcon : result.ico === 4 ? errorIcon : null
            }])
        }
    }


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Update Daily Record</span>
                        {/* <small className="fs-5 fw-bold text-center px-0">{props.Item.ItemCode.Title}</small> */}
                        <small className="text-center px-0">(Please fill up the desired field to update)</small>
                        <form>
                            <div className="form-group">
                                <p className="m-0 text-center">Date</p>
                                <Datepicker
                                    selected={new Date(CSDate)}
                                    className="form-control border rounded text-center text-dark fw-bolder mx-auto"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setCSDate(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Please select date"
                                />
                            </div>

                            <div className="form-group">
                                <p className="m-0 text-center">Age</p>
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border rounded text-center text-dark fw-bolder mx-auto"
                                        placeholder="Age"
                                        value={Age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <p className="m-0 text-center">Expire</p>
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border rounded text-center text-dark fw-bolder mx-auto"
                                        placeholder="Mortality"
                                        value={DMort}
                                        onChange={(e) => setDMort(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <p className="m-0 text-center">Feed Sent</p>
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border text-center text-dark fw-bolder mx-auto"
                                        placeholder="Consumption"
                                        value={DFeed}
                                        onChange={(e) => setDFeed(e.target.validity.valid ? e.target.value : 0.000)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <p className="m-0 text-center">Consumption</p>
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border text-center text-dark fw-bolder mx-auto"
                                        placeholder="Consumption"
                                        value={DCons}
                                        onChange={(e) => setDCons(e.target.validity.valid ? e.target.value : 0.000)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <p className="m-0 text-center">Feed Stock</p>
                                <div className="input-group">
                                    <input
                                        type="numeric"
                                        className="form-control border text-center text-dark fw-bolder mx-auto"
                                        placeholder="Consumption"
                                        value={FeedStock}
                                        onChange={(e) => setFeedStock(e.target.validity.valid ? e.target.value : 0.000)}
                                    />
                                </div>
                            </div>
                            {
                                [6, 13, 20, 27, 34, 41].includes(Age) ?
                                    <div className="form-group">
                                        <p className="m-0 text-center">Average Body Weight</p>
                                        <div className="input-group">
                                            <input
                                                type="numeric"
                                                className="form-control border text-center text-dark fw-bolder mx-auto"
                                                placeholder="Average Weight"
                                                value={ABW}
                                                onChange={(e) => setABW(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    : null
                            }
                            <div className="form-group align-items-center">
                                <p className="m-0 text-center">Entry From</p>
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={[{ value: 0, label: "From farm" }, { value: 1, label: "From office" }, { value: 2, label: "From home" }, { value: 3, label: "Over the phone" }]}
                                    name="Percent"
                                    placeholder={"Please select entry from"}
                                    styles={CScolourStyles}
                                    value={EntryType ? { label: EntryType, value: 0 } : ""}
                                    onChange={(e) => setEntryType(e.label)}
                                    required
                                    id="Percent"
                                />
                                {Error.CondID ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.CondID}</small></p>
                                    : null}
                            </div>
                            <div className="form-group">
                                <p className="m-0 text-center">Remark</p>

                                <div className="input-group">
                                    <textarea
                                        rows="1"
                                        className="form-control border text-center text-dark fs-6 mx-auto"
                                        placeholder="Remark"
                                        value={Remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />
                                </div>
                            </div>

                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => UpdateRecord()}><i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
        </Modal >
    );
}