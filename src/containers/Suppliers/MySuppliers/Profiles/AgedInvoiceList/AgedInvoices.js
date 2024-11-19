import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { logout } from '../../../../../actions/auth';
import { FetchPurchaseInvoice, FetchSupplierAgedInvoices } from '../../../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../../../actions/types';
import { customHeader, locales } from "../../../../Suppliers/Class/datepicker";
import { AgedInvoiceListPDF } from '../AgedInvoiceList/AgedInvoiceListPDF';
import { InvoicePrint } from '../ViewInvoice/InvoicePrint';
import InvoiceTable from './AgedInvoiceTable';
let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const AgedInvoices = ({ user, SupplierID, SupplierData }) => {
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);

    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();

    useEffect(() => {
        AgedInvoiceList();
        setDateTo(today);
    }, [])

    const AgedInvoiceList = async () => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchSupplierAgedInvoices(SupplierID, date_from, date_to);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const DateHandler = async (e) => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (DateFrom.getTime() > e.getTime()) {
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: true });
            var result = await FetchSupplierAgedInvoices(SupplierID, date_from, date_to);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }

    const PrintPDF = async (e, id) => {
        var result = await FetchPurchaseInvoice(id);
        if (result !== true)
            InvoicePrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }


    var h = window.innerHeight - 290;
    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white py-1 px-0`}>
                <p className='display-6 bg-white fw-bolder m-0 px-2'>Aged Invoices</p>
                <div className="d-flex justify-content-end align-items-center bg-white p-0 w-75">
                    <div className="d-flex justify-content-end mx-2 w-50">
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
                    <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => AgedInvoiceListPDF(e, Data, SupplierData, user, DateFrom, DateTo)}><i className="fad fa-file-pdf"></i></button>
                </div>
            </div>

            {
                Array.isArray(Data) && Data.length ?
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <InvoiceTable Data={Data} PrintPDF={PrintPDF} />
                    </div>
                    :
                    <div className={`d-flex justify-content-center align-items-center bg-white`}>
                        <p className='fs-2 fw-bold text-center text-success m-0'>No invoice has issued!</p>
                    </div>
            }
        </div>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    no: state.auth.no
});

export default connect(mapStateToProps, { logout })(AgedInvoices);
