import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { FetchContractFWRLadger } from '../../actions/ContractAPI';
import { DISPLAY_OVERLAY } from '../../actions/types';

const FarmLadger = ({ display, list, setList, BatchID, BusinessID }) => {
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        My_Ladger();
        // LoadProductItems();
    }, [])

    const My_Ladger = async () => {
        if (BatchID && BusinessID !== null) {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchContractFWRLadger(BusinessID, BatchID);
            if (result !== true)
                setData(result.data);

            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            history.push('/fwr_fields');
        }
    }

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-4">
                <p className="display-6 d-flex justify-content-center m-0">Farm Ladger</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item"><Link to="/field_work">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/fwr_fields">My Field</Link></li>
                        <li className="breadcrumb-item"><Link to="#">Farm Ladger</Link></li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 px-0">
                {/* <div className="row d-flex bg-white mx-auto" >
                    <div className="d-flex justify-content-between p-0">

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <button className="btn rounded-0 rounded-start border-right" id="list" onClick={() => setView(true)}>
                                <i class="fad fa-qrcode text-success"></i>
                            </button>
                        </div>

                        <div className="d-flex justify-content-center mx-2 w-100">
                            <Select
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuPortalTarget={document.body}
                                borderRadius={"0px"}
                                // options={Data.map}
                                options={Array.isArray(unique_search) && unique_search.length ? unique_search.map((item) => ({ label: item.FarmID + ". " + item.Title, value: item.id })) : []}
                                defaultValue={{ label: "Select Dept", value: 0 }}
                                name="Division"
                                placeholder={"Search"}
                                styles={CScolourStyles}
                                value={SearchKey}
                                onChange={(e) => setSearchKey(e)}
                                required
                                id="Title"
                                isClearable={true}
                                isSearchable={true}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn rounded-0 rounded-end border-left" id="grid"
                            // onClick={() => setView(false)}
                            >
                                <i class="fad fa-search"></i>
                            </button>
                        </div>

                    </div>
                </div> */}

                <div className="position-absolute overflow-auto my-1 w-100 bg-white" style={{ maxHeight: "75%" }}>

                    <table className={`table text-nowrap`}>
                        <thead>
                            <tr className="text-center" style={{ borderBottom: "3px solid #DEE2E6" }}>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Date</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Category</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Details</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Quantity</span></th>
                                <th className="border-right p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Weight</span></th>
                                <th className="p-2 align-middle"><span className="fs-6 fw-bolder text-dark">Amount</span></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.isArray(Data) && Data.length ? Data.map((item, i, Data) => (
                                    <tr className="border-bottom text-center" title={item.SellsMan} tooltip={item.SalesMan} key={i}>
                                        {
                                            parseInt(item.Order) === 3 ? <td className="border-right py-0 px-2"><span className="fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span>
                                            </td> :
                                                parseInt(item.SLNo) === 1 ?
                                                    <td rowSpan={parseInt(item.Count)} className="border-right py-0 px-2"><span className="fs-6 fw-bold text-center text-dark">{moment(item.Date).format("DD MMM YYYY")}</span>
                                                    </td>
                                                    : null}
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bolder text-center text-dark">{item.Category}</span></td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-left text-dark">{item.Details}</span></td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Quantity).toLocaleString("en-BD", { minimumFractionDigits: 0 }) + " PCS"}</span> </td>
                                        <td className="border-right py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{parseFloat(item.Weight).toLocaleString("en-BD", { minimumFractionDigits: 3 }) + " KG"}</span> </td>
                                        <td className="border-0 py-0 px-2"><span className="d-block fs-6 fw-bold text-right text-dark">{(item.Amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span> </td>
                                    </tr>
                                ))
                                    : null
                            }
                        </tbody>

                    </table>
                </div>

            </div>
        </div >

    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    BatchID: props.match.params.id,
    BusinessID: props.match.params.bis_id
});

export default connect(mapStateToProps, { logout })(FarmLadger);