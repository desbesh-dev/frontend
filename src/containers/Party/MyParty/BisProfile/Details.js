import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FetchPartyList, GetParty, GetPartyAdmin, PartyStatusList } from '../../../../actions/APIHandler';
import { PartyDelete, PartySectorDelete, getLabel } from '../../../../actions/ContractAPI';
import { logout } from '../../../../actions/auth';

import { DISPLAY_OVERLAY } from '../../../../actions/types';
import { DeleteMessage } from "./Modals/DeleteModal.js";
import { PartyInfo } from './PartyUpdate/PartyInfo';
import { PartySector } from './PartyUpdate/PartySector';
import { PartySectorCreate } from './PartyUpdate/PartySectorCreate';

const Details = ({ PartyID, list, setList, no }) => {
    const [ModalShow, setModalShow] = useState(false);
    const [PartyInfoUp, setPartyInfoUp] = useState(false);
    const [PartySectorUp, setPartySectorUp] = useState(false);
    const [PartyGenInfo, setPartyGenInfo] = useState(false);
    const [PartySectData, setPartySectData] = useState(false);
    const [PartyModalShow, setPartyModalShow] = useState(false);
    const [PartyDeleteID, setPartyDeleteID] = useState(false);
    const [PartySectorModalShow, setPartySectorModalShow] = useState(false);
    const [SectorDeleteID, setSectorDeleteID] = useState(false);

    const [NewPartyModalShow, setNewPartyModalShow] = useState(false);
    const [NewSectorModalShow, setNewSectorModalShow] = useState(false);
    const [NewSectorData, setNewSectorData] = useState(false);
    const [PartyList, setPartyList] = useState(false);

    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [Error, setError] = useState({});
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        PartyData();
        LoadPartyList();
    }, [])

    const PartyData = async () => {
        if (no <= 7)
            var result = await GetPartyAdmin(PartyID);
        else if ([8, 9, 11].includes(no))
            var result = await GetParty(PartyID);

        if (result !== true) {
            setData(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/my_party_list');
        }
    }

    const LoadPartyList = async () => {
        var result = await FetchPartyList();

        if (result !== true) {
            setPartyList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/my_party_list');
        }
    }

    const DeleteParty = async e => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await PartyDelete(Data.PartyInfo.id);
        if (result !== true) {
            history.goBack();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const DeleteSector = async (e, DeleteID) => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await PartySectorDelete(DeleteID);
        if (result !== true) {
            history.goBack();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    var h = window.innerHeight - 250;

    return (
        <div className="position-relative mb-5">
            <div className="d-flex justify-content-center bg-white h-100">
                <div className="col-md-6 justify-content-center align-items-center">
                    <table className={`table table-borderless table-responsive card-1 d-flex justify-content-center position-absolute overflow-auto top-0 start-50 translate-middle-x`} style={{ height: h + "px" }}>
                        {Data.PartyInfo ?
                            <tbody>
                                <tr className="border-bottom text-center">
                                    <td className="p-1" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">PARTY DETAILS</p></td>
                                </tr>
                                <tr className="border-bottom border-top text-center">
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Party ID</span></td>
                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.PartyInfo.id}</span></td>
                                </tr>
                                <tr className="border-bottom text-center">
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Name</span></td>
                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.PartyInfo.Name}</span></td>
                                </tr>
                                <tr className="border-bottom text-center">
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business Title</span></td>
                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.PartyInfo.Title}</span></td>
                                </tr>
                                {no <= 7 ?
                                    <tr className="text-right">
                                        <td className="p-1" colspan="2">
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mr-2" onClick={() => { setNewPartyModalShow(true) }}>Add With Sector</button>
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mr-2" onClick={() => { setPartyModalShow(true); setPartyDeleteID(Data.PartyInfo.id) }}>Delete</button>
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center" onClick={() => { setPartyInfoUp(true); setPartyGenInfo(Data.PartyInfo) }}>Update </button>
                                        </td>
                                    </tr>
                                    : null}

                                {
                                    Array.isArray(Data.SectorArray) && Data.SectorArray.length ? Data.SectorArray.map((item, i) => (
                                        <>
                                            {no <= 7 ?
                                                <tr className="border-bottom text-center mt-2">
                                                    <td className="p-1" colspan="2">
                                                        <p className="fs-4 fw-bold text-center m-0 p-0">{item.SectorID.SisterID.ShortCode} <span className='fw-bolder'>({item.SectorID.SectorTitle})</span></p>
                                                        <small className='text-muted'>{item.SectorID.SisterID.Title}</small>
                                                    </td>
                                                </tr>
                                                : null}
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Address</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.Address}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Contact No</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.Contact}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Security Money</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.SCMoney}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Credit Limit</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.Limit}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Balance</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.Balance}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Target</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{parseFloat(item.Target)} {parseInt(item.Currency) === 1 ? "BDT" : parseInt(item.Currency) === 2 ? "KG" : parseInt(item.Currency) === 3 ? "PCS" : ""}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Agreement</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.Agreement ? "Signed Up" : "No Agreement"}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Blank Cheque</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.BlankCheque ? "Received" : "Not Received"}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Trade Licence</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.FarmReg ? "Resereved" : "Not Resereved"}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Since</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(item.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Last Update</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(item.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated by</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{item.UpdatedBy}</span></td>
                                            </tr>
                                            <tr className="border-bottom text-center">
                                                <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Status</span></td>
                                                <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{getLabel(item.Status, PartyStatusList)}</span></td>
                                            </tr>
                                            <tr className="text-right">
                                                <td className="p-1" colSpan="2">
                                                    {no <= 7 ?
                                                        <>
                                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mr-2" onClick={() => { setNewSectorModalShow(true); setNewSectorData(item) }}>Add New Party</button>
                                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mr-2" onClick={() => { setPartySectorModalShow(true); setSectorDeleteID(item.id) }}>Delete</button>
                                                        </>
                                                        : null}
                                                    <button className="btn btn-outline-success fs-6 fw-bold text-center" onClick={() => { setPartySectorUp(true); setPartySectData(item) }}>Update </button>
                                                </td>
                                            </tr>
                                        </>))
                                        : null
                                }
                            </tbody>
                            : <p className="fs-6 fw-normal text-center py-2 m-0">No data found</p>
                        }
                    </table>
                </div>

                {
                    PartyGenInfo ?
                        <PartyInfo
                            item={PartyGenInfo}
                            show={PartyInfoUp}
                            list={list}
                            setList={setList}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setPartyInfoUp(false); setPartyGenInfo(false) }}
                        /> : null
                }

                {
                    PartySectData ?
                        <PartySector
                            item={PartySectData}
                            access={no}
                            show={PartySectorUp}
                            list={list}
                            setList={setList}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setPartySectorUp(false); setPartySectData(false) }}
                        /> : null
                }

                {
                    NewSectorData ?
                        <PartySectorCreate
                            item={NewSectorData}
                            Title={Data ? Data.PartyInfo.Title : "N/A"}
                            PartyList={PartyList}
                            show={NewSectorModalShow}
                            list={list}
                            setList={setList}
                            onReload={() => window.location.reload(false)()}
                            onHide={() => { setNewSectorModalShow(false); setNewSectorData(false) }}
                        /> : null
                }


                <DeleteMessage
                    FullName={`${Data ? Data.PartyInfo.Title : "N/A"}`}
                    show={PartyModalShow}
                    Click={(e) => DeleteParty(e, PartyDeleteID)}
                    onHide={() => { setPartyModalShow(false); setPartyDeleteID() }}
                />

                <DeleteMessage
                    FullName={`${Data ? Data.PartyInfo.Title : "N/A"}`}
                    show={PartySectorModalShow}
                    Click={(e) => DeleteSector(e, SectorDeleteID)}
                    onHide={() => { setPartySectorModalShow(false); setSectorDeleteID(false) }}
                />

            </div>
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(Details);