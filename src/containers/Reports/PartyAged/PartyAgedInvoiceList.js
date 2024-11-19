import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import { FetchConcern, FetchSisterSector } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchPartyAgedInvoicesList, FetchPrintInvoice } from '../../../actions/PartyAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { InvoicePrint } from '../../Trading/InvoicePrint';
import InvoiceTable from './AgedInvoiceTable';
import { PartyAgedInvoiceListPDF } from './PartyAgedInvoiceListPDF';
let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const PartyAgedInvoiceList = ({ user, no }) => {
    const [Data, setData] = useState(false);
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(oneMonthAgo);
    const [SectorFilter, setSectorFilter] = useState({ label: user.Collocation.Sector, value: user.Collocation.id })
    const [SisterFilter, setSisterFilter] = useState({ label: user.Collocation.Title, value: user.Collocation.SisterID })
    const [SisterList, setSisterList] = useState(false)
    const [SectorList, setSectorList] = useState(false)
    const history = useHistory();
    const [locale, setLocale] = useState('en');
    const dispatch = useDispatch();
    const [tableId, setTableId] = useState(null);

    useEffect(() => {
        LoadConcern();
    }, [])

    useEffect(() => {
        if (DateTo && SectorFilter) { // Ensure both are set
            AgedInvoiceList();
        }
    }, [DateTo, SectorFilter]); // Dependency array to watch for changes

    const AgedInvoiceList = async () => {
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(DateTo).format("YYYY-MM-DD");
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        var result = await FetchPartyAgedInvoicesList(date_from, date_to, SectorFilter?.value);
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
            var result = await FetchPartyAgedInvoicesList(date_from, date_to, SectorFilter?.value);
            if (result !== true)
                setData(result.data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            setDateTo(e)
        }
    }


    const CScolourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: "2px solid #FFFFFF", boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px', minWidth: '200px' }),
        container: base => ({
            ...base,
            flex: 1,
        }),
    }

    const LoadConcern = async () => {
        var result = await FetchConcern();
        if (result !== true) {
            setSisterList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const getSector = async (e) => {
        setSectorFilter(false)
        setSisterFilter(e)
        var result = await FetchSisterSector(e.value);
        if (result !== true) {
            setSectorList(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    const PrintPDF = async (e, id) => {
        var result = await FetchPrintInvoice(id);
        if (result !== true)
            InvoicePrint(e, result, false)
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const exportTableToExcel = (e) => {
        e.preventDefault();
        // Get the table element
        const table = document.getElementById(tableId);

        // Convert the HTML table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook and trigger a download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, "Supplier Ageing Reports.xlsx");
    };

    var h = window.innerHeight - 110;
    return (
        <div className="col-md-12 justify-content-center align-items-center px-2">
            <div className={`d-flex justify-content-between bg-white py-1 px-0`}>
                <p className='display-6 bg-white fw-bolder m-0 px-2'>Party Ageing Reports</p>
                <div className="d-flex justify-content-end align-items-center bg-white p-0 w-75">
                    {no <= 7 &&
                        <>
                            <div className="d-flex justify-content-center mx-2 w-50">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={SisterList}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Sister"
                                    placeholder={"Sister"}
                                    styles={CScolourStyles}
                                    value={SisterFilter}
                                    onChange={e => getSector(e)}
                                    required
                                    id="Sister"
                                    isClearable={true}
                                    isSearchable={true}
                                />
                            </div>

                            <div className="d-flex justify-content-center mx-2 w-50">
                                <Select
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuPortalTarget={document.body}
                                    borderRadius={"0px"}
                                    options={SectorList}
                                    defaultValue={{ label: "Select Dept", value: 0 }}
                                    name="Sector"
                                    placeholder={"Sector"}
                                    styles={CScolourStyles}
                                    value={SectorFilter}
                                    onChange={(e) => setSectorFilter(e)}
                                    required
                                    id="Sector"
                                    isClearable={true}
                                    isSearchable={true}
                                    isDisabled={!SisterFilter}
                                />
                            </div>
                        </>
                    }
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
                    <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={(e) => PartyAgedInvoiceListPDF(e, Data, DateFrom, DateTo, user, SisterFilter?.label + " (" + SectorFilter?.label + ")",)}><i className="fad fa-file-pdf"></i></button>
                    <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left" onClick={exportTableToExcel}><i className="fad fa-file-excel"></i></button>
                </div>
            </div>

            {
                Array.isArray(Data) && Data.length ?
                    <div className='tableFixHead w-100' style={{ height: h + "px" }}>
                        <InvoiceTable Data={Data} PrintPDF={PrintPDF} sendTableIdToParent={setTableId} />

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

export default connect(mapStateToProps, { logout })(PartyAgedInvoiceList);
