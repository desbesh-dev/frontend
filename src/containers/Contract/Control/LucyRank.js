import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../../actions/auth';
import { FetchInvoice, RecallProduct, DispatchInvoiceDelete } from '../../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import * as moment from 'moment'
import Select from 'react-select';
import errorIcon from '../../../assets/error.png';
import infoIcon from '../../../assets/info.png';
import successIcon from '../../../assets/success.png';
import warningIcon from '../../../assets/warning.gif';

import { exportPDF } from './InvoicePDF';
import { FetchLucyRank } from '../../../actions/BoardAPI';

const LucyRank = ({ CompanyID, BranchID, SupplierID, user, list, setList }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Batch, setBatch] = useState(null)
    const [Year, setYear] = useState(null)
    const [OrderData, setOrderData] = useState([])
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        LoadFCRRank();
    }, [])

    const LoadFCRRank = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchLucyRank(Batch, Year);
        if (result.status === 200) {
            setData(result.data);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const FetchBatch = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchLucyRank(e.target.value | 0, Year | 'null');
        if (result.status === 200) {
            setData(result.data);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const FetchYear = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchLucyRank(Batch | 0, e | 'null');
        if (result.status === 200) {
            setData(result.data);
            setYear(e);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }


    return (
        <div className="position-relative h-100">
            <div className="container bg-white rounded">
                <div className="d-flex justify-content-between my-0 py-2 border-bottom">
                    <div className='my-auto text-center'>
                        <p className='display-6 fw-bolder m-0 text-uppercase text-center'><Link className="fad fa-chevron-left px-2 text-dark text-decoration-none" to={`/control_board`}></Link></p>
                    </div>

                    <div className="d-flex justify-content-around my-0 py-1 w-75 border" style={{ borderRadius: "30px" }}>
                        <div className='d-flex text-center align-items-center'>
                            <label for="message-text" class="col-form-label fw-bold px-2">Batch</label>
                            <input
                                type="numeric"
                                class="form-control border"
                                style={{ borderRadius: "20px" }}
                                id="Batch"
                                name="Batch"
                                placeholder='Minimum Batch'
                                value={Batch}
                                onChange={e => setBatch(e.target.value)}
                                onBlur={e => FetchBatch(e)}
                            />
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-2 w-75">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                options={[{ label: "2022", value: 2022 }, { label: "2023", value: 2023 }, { label: "2024", value: 2024 }, { label: "2025", value: 2025 }, { label: "2026", value: 2026 }, { label: "2027", value: 2027 }, { label: "2028", value: 2028 }, { label: "2029", value: 2029 }, { label: "2030", value: 2030 }]}
                                defaultValue={{ label: "All year", value: 0 }}
                                name="Search"
                                placeholder={"Select year"}
                                styles={CScolourStyles}
                                value={{ label: Year }}
                                onChange={(e) => FetchYear(e.value)}
                                required
                                id="Year"
                                isClearable={true}
                                isSearchable={true}
                            // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                    </div>

                    <div className='d-flex text-center align-items-center border' style={{ borderRadius: "30px" }}>
                        <button title="Generate PDF" className="btn fs-3 px-3 py-0 fad fa-file-pdf text-dark border-right" id="view"
                            onClick={(e) => exportPDF(e, Data, false)}
                        />
                        <button title="Print" className="btn fs-3 px-3 py-0 fad fa-print text-dark border-right" id="print"
                            onClick={(e) => exportPDF(e, Data, true)}
                        />
                    </div>
                </div>


                <div className='text-center mt-2'>
                    <p className='display-6 fw-bolder m-0 text-uppercase text-center text-muted'> LUCY RANK <span className="text-center fw-bolder">{Year ? "- " + Year : null}</span></p>
                </div>

                <div className="row justify-content-center py-2 mt-2 p-0">
                    <div className="col-md-10 col-md-offset-3 body-main">
                        <div className="col-md-12">
                            {Array.isArray(Data) && Data.length ?
                                <table className={`table table-hover table-borderless table-responsive d-table`}>
                                    <thead>
                                        <tr className="text-center text-uppercase" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                            <th className="p-1 border-right"><span>S/N</span></th>
                                            <th className="p-1 border-right"><span>Farm Name</span></th>
                                            <th className="p-1 border-right"><span>Farmer Name</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Batch</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Profit</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Score</span></th>
                                            <th className="p-1 border-right"><span className="d-block text-center fw-bolder">Farm ID</span></th>
                                            <th className="p-1"><span>User ID</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            Data.map((item, i) => (
                                                <tr className="border-bottom text-center" key={1}>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1">{i + 1}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Title}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-left px-1">{item.Name}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold px-1">{item.Batch}</span></td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-right px-1">{parseFloat(item.Profit).toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{(i + 1) + "/" + item.Farms}</span> </td>
                                                    <td className="p-0 border-right"><span className="d-block fw-bold text-center px-1">{item.FarmID}</span> </td>
                                                    <td className="p-0">{item.UserID}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                                : null}

                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    InvoiceNo: props.match.params.inv_no,
});

export default connect(mapStateToProps, { logout })(LucyRank);