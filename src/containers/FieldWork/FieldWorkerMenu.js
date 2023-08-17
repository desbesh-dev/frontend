import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { LoadMyFarms, FetchInitData, RemoveInitialization } from '../../actions/ContractAPI';
import { connect, useDispatch } from 'react-redux';
import { DISPLAY_OVERLAY } from '../../actions/types';
import { FaList, FaBorderAll } from "react-icons/fa";
import { AiOutlineScan } from "react-icons/ai";
import * as moment from 'moment';
import { CreateModal, SellModal, SellSummerizeModal, DeleteModal } from './BirdSell/BirdSellModal'
import errorIcon from '../../assets/error.png';
import infoIcon from '../../assets/info.png';
import successIcon from '../../assets/success.png';
import warningIcon from '../../assets/warning.gif';
import { StockModal } from "./StockModal.js";

const FieldWorkerMenu = ({ display, user, scale, sub_scale, list, setList }) => {
    const [InitData, setInitData] = useState(null)
    const [Data, setData] = useState(null)
    const [View, setView] = useState(false)
    const [Item, setItem] = useState(false)
    const [AccItems, setAccItems] = useState(false)
    const [StockItem, setStockItem] = useState(false)
    const [DeleteItem, setDeleteItem] = useState(false)
    const [SellModalShow, setSellModalShow] = useState(false)
    const [CreateModalShow, setCreateModalShow] = useState(false)
    const [StockModalShow, setStockModalShow] = useState(false)
    const [SummeryModalShow, setSummeryModalShow] = useState(false)
    const [DeleteModalShow, setDeleteModalShow] = useState(false)
    const dispatch = useDispatch();
    let toastProperties = null;

    useEffect(() => {
        MyFarms();
    }, [])

    const MyFarms = async () => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await LoadMyFarms();
        setData(result.farms);

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadInit = async (item) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setItem(item)
        setInitData(null);
        var result = await FetchInitData(0, item.BatchID);
        if (result !== true) {
            setInitData(result.user);
            setSellModalShow(true)
        }

        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    const DeleteInvoice = async (e, inv) => {
        setDeleteModalShow(false)
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        e.preventDefault();
        const result = await RemoveInitialization(inv);
        if (result !== true) {
            if (result.user_error) {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Not Found/Invalid Invoice',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: infoIcon
                }])
            } else {
                setList([...list, toastProperties = {
                    id: 1,
                    title: 'Success!',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                LoadInit(Item);
                setSellModalShow(true);
            }
        } else {
            setList([...list, toastProperties = {
                id: 1,
                title: 'Error!',
                description: "Failed to delete invoice. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    };

    const CalculateAge = (DOB) => {
        let today = new Date();
        let BirthDate = new Date(DOB);
        let tod = today.getTime();
        let days_diff = Math.ceil(Math.abs(tod - BirthDate) / (1000 * 60 * 60 * 24));
        let age = "Age " + days_diff + " Days";
        return age;
    }

    const history = useHistory();
    // const FetchUser = async (id) => {
    //     var User_Data = await LoadProfile(id);
    //     history.push('/pending_user', { UserData: User_Data.user });
    // }


    const getWholeAndDecimal = value => {
        const [whole, decimal] = String(value).split('.');
        return [Number(whole), Number(decimal)];
    }

    const [whole, decimal] = getWholeAndDecimal(13.37);

    return (
        <div className="row h-100 m-0 d-flex justify-content-center">

            <div className="header mb-2">
                <p className="display-6 d-flex justify-content-center m-0">{user ? user.FullName : ''}</p>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex justify-content-center">
                        <li className="breadcrumb-item text-muted">{scale === 3 & sub_scale === 4 ? "— Field Worker —" : 'Designation Not Defined'}</li>
                    </ol>
                </nav>
            </div>

            <div className="col-lg-8 h-100 px-0">
                <div className="row position-absolute overflow-auto mx-auto mt-3 w-100">
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/field_board'>Dashbord</Link>
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/fwr_fields'>My Field</Link>
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/fwr_parked'>Parking</Link>
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/fwr_batch_pay_fields'>Batch Payment</Link>
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/fields'>My Activity</Link>
                    <Link className="btn bg-gradient btn-outline-success btn-lg btn-block fw-bold text-uppercase" to='/fields'>Subscription</Link>
                </div>
            </div >

            {
                InitData ?
                    <SellModal
                        show={SellModalShow}
                        list={list}
                        setList={setList}
                        Data={InitData}
                        onHide={() => { setSellModalShow(false) }}
                        Create={() => { setCreateModalShow(true); setSellModalShow(false); }}
                        onStock={(item) => { setStockItem(item); setCreateModalShow(false); setSellModalShow(false); setSummeryModalShow(true); }}
                        onRemove={(item) => { setDeleteItem(item); setSellModalShow(false); setDeleteModalShow(true); }}
                    /> : null
            }
            {
                Item ?
                    <CreateModal
                        BusinessID={Item.FarmID}
                        BatchID={Item.BatchID}
                        show={CreateModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadInit(Item); setCreateModalShow(false); setSellModalShow(true); }}
                        onHide={() => { setCreateModalShow(false); }}
                    /> : null
            }
            {
                AccItems ?
                    <StockModal
                        stock_data={AccItems}
                        show={StockModalShow}
                        list={list}
                        set_list={setList}
                        // onReload={() => setStockModalShow(false)}
                        onHide={() => { setAccItems(false); setStockModalShow(false); }}
                    /> : null
            }
            {
                StockItem ?
                    <SellSummerizeModal
                        Data={StockItem}
                        show={SummeryModalShow}
                        list={list}
                        setList={setList}
                        onReload={() => { LoadInit(Item); setSummeryModalShow(false); setCreateModalShow(false); setSellModalShow(true); }}
                        onHide={() => { setStockItem(false); setSummeryModalShow(false); setSellModalShow(true); }}
                    /> : null
            }
            {
                DeleteItem ?
                    <DeleteModal
                        MsgHeader={"Remove Initialization"}
                        HeaderTitle={DeleteItem.InvoiceNo + " with agent name " + DeleteItem.PartyAgent}
                        Msg={"Are you sure to remove initialization with party " + DeleteItem.PartyAgent + "? All of sell quantity & weight permanently wiped."}
                        show={DeleteModalShow}
                        onDelete={(e) => DeleteInvoice(e, DeleteItem.InvoiceNo)}
                        onHide={() => { setDeleteModalShow(false); setSellModalShow(true); }}
                    /> : null
            }
        </div >
    );
}

const mapStateToProps = state => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(FieldWorkerMenu);