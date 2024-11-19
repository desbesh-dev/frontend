import { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoadProfile } from '../../../../actions/APIHandler';
import { logout } from '../../../../actions/auth';
import { BISTerminate, BusinessPro } from '../../../../actions/ContractAPI';

import { DISPLAY_OVERLAY } from '../../../../actions/types';
// import { ContractUpdate } from '../../../Contract/ContractUpdate';
import { DeleteMessage } from "./Modals/DeleteModal.js";

const Details = ({ CompanyID, BranchID, SupplierID, user, UserID, BisID, list, setList }) => {
    const [ModalShow, setModalShow] = useState(false);
    const [BUp, setBUp] = useState(false);
    const [Item, setItem] = useState(false);
    const [DeleteModalShow, setDeleteModalShow] = useState(false);
    const [InfoModalShow, setInfoModalShow] = useState(false);
    const initialValue = { value: 0, label: "" };
    const [Data, setData] = useState(false)
    const [UserData, setUserData] = useState(false)
    const [MyProList, setMyProList] = useState(false)
    const [OrderData, setOrderData] = useState([])
    const [Count, setCount] = useState(null)
    const [Error, setError] = useState({});
    const [Toggle, setToggle] = useState(false);
    const [DDate, setDDate] = useState(false);
    const [OrderNo, setOrderNo] = useState("12120121912033");
    const [Amount, setAmount] = useState(0.00);
    let toastProperties = null;
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        ItemCode: "",
        Title: "",
        UnitWeight: "",
        UnitPrice: "",
        Quantity: "",
    });
    const { ItemCode, Title, UnitWeight, UnitPrice, Quantity } = formData;

    useEffect(() => {
        My_Orders();
        // LoadProductItems();
    }, [])



    const My_Orders = async () => {
        var result = await LoadProfile(UserID);
        if (result !== true) {
            var BisDetials = await BusinessPro(BisID);

            if (BisDetials !== true) {
                setData(BisDetials);
                setUserData(result);
                setFormData({
                    ...formData,
                    CompanyID: result.UserInfo.CompanyID.id,
                    BranchID: result.UserInfo.BranchID.BranchID,
                    ID: result.UserInfo.id
                })
            } else {
                history.push('/not_found');
            }
        } else {
            history.push('/not_found');
        }
    }

    const onSubmit = (e) => {
        if (formData.Quantity === "" || formData.Quantity === undefined || formData.ItemCode === "" || formData.ItemCode === undefined || formData.UnitPrice === "" || formData.UnitPrice === undefined) {
            setInfoModalShow(true)
        } else {
            setOrderData([...OrderData, formData]);
            setCount(Count + 1);
            setFormData({
                Title: "",
                UnitWeight: "",
                UnitPrice: "",
                Quantity: "",
                ItemCode: "",
            });
        }
    }
    const today = new Date().toLocaleDateString("en-us", "dd/MM/yyyy");

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
        }),
    }






    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
            onSubmit();
        }
    }


    const DeleteUser = async e => {
        setModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await BISTerminate(BisID);

        if (result !== true) {
            history.goBack();
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    return (
        <div className="position-relative mb-5" style={{ height: "92%" }}>

            <div className="position-absolute overflow-auto my-1 w-100 h-100 bg-white">

                <div className="d-flex justify-content-center bg-white py-2 h-100">
                    <div className="col-md-6 justify-content-center align-items-center">
                        <table className={`table table-borderless table-responsive card-1 d-flex justify-content-center position-absolute overflow-auto top-0 start-50 translate-middle-x`} style={{ maxHeight: "70%" }}>
                            {Data ?
                                <tbody>
                                    <tr className="border-bottom text-center">
                                        <td className="p-1" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">BUSINESS DETAILS</p></td>
                                    </tr>
                                    <tr className="border-bottom border-top text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business ID</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.id}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business Type</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.Type}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Branch ID</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.BranchID.id}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Subscriber Name</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.UserID.FirstName + " " + Data.UserID.LastName}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Business/Farm/Shed Name</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.Title}</span></td>
                                    </tr>
                                    {Data.TypeID === 1 ?
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Condition</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.CondID.Title}</span></td>
                                        </tr>
                                        : null
                                    }
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Security Money</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.SCMoney}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Balance</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.Balance}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Agreement</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.Agreement ? "Signed Up" : "No Agreement"}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Blank Cheque</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.BlankCheque ? "Received" : "No Blank Cheque Received"}</span></td>
                                    </tr><tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Farm/Trade Licence</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.FarmReg ? "Copy has Resereved" : "No Copy has been Resereved"}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Representative</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.RepID.FirstName + " " + Data.RepID.LastName}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Since</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(Data.CreatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Last Update</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(Data.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated by</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.UpdatedBy}</span></td>
                                    </tr>
                                    <tr className="border-bottom text-center">
                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Status</span></td>
                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.Status}</span></td>
                                    </tr>

                                    {
                                        Data.farm[0] && Data.TypeID === 1 ?
                                            <Fragment>
                                                <tr className="border-bottom text-center">
                                                    <td className="p-1 pt-3" colspan="2"><p className="fs-4 fw-bolder text-center py-2 m-0">FARM DETAILS</p></td>
                                                </tr>
                                                {/* <tr className="border-bottom text-center">
                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Farm ID</span></td>
                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].id}</span></td>
                                </tr> */}
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Shed Size</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].ShedSize}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Roof</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].Roof}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Floor</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].Floor}</span></td>
                                                </tr>

                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Water Pot</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].WaterPot}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Feed Pot</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].FeedPot}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Employee</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].Employee}</span></td>
                                                </tr>

                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Contact No</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].ContactNo}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Last Updated</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{new Date(Data.UpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</span></td>
                                                </tr>
                                                <tr className="border-bottom text-center">
                                                    <td className="border-right p-1"><span className="d-block fs-6 fw-bolder text-uppercase text-left text-dark px-2">Updated by</span></td>
                                                    <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bold">{Data.farm[0].UpdatedBy}</span></td>
                                                </tr>

                                            </Fragment>
                                            : null
                                    }
                                    <tr className="text-center">
                                        <td className="p-1 pt-3" colspan="2">
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center mr-2" onClick={() => setModalShow(true)}>Delete</button>
                                            <button className="btn btn-outline-success fs-6 fw-bold text-center" onClick={() => { setBUp(true); setItem(Data) }}>Update </button>
                                        </td>
                                    </tr>
                                </tbody>
                                : <p className="fs-6 fw-normal text-center py-2 m-0">No data found</p>
                            }
                        </table>
                    </div>

                </div>

                <DeleteMessage
                    FullName={`${Data ? Data.Title : null}`}
                    show={ModalShow}
                    Click={(e) => DeleteUser(e)}
                    onHide={() => setModalShow(false)}
                />

            </div>
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Details);