import * as moment from 'moment';
import { useEffect, useState } from 'react';
import Datepicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { fetchServerTimestamp } from '../../../actions/APIHandler';
import { logout } from '../../../actions/auth';
import { FetchProductAnalysis } from '../../../actions/InventoryAPI';
import { MyProductList } from '../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../actions/types';
import { CustomMenuList } from '../../../hocs/Class/CustomMenuList';
import '../../../hocs/react-select/dist/react-select.css';
import { customHeader, locales } from "../../Suppliers/Class/datepicker";
import { ProductAnalysisPDF } from "./ProductAnalysisPDF";

let today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const ProductItemsAnalysis = ({ user, list, setList, scale, no }) => {
    const [MyProList, setMyProList] = useState([])
    const [SearchKey, setSearchKey] = useState('')
    const [data, setData] = useState(null)
    const [DateTo, setDateTo] = useState(today);
    const [DateFrom, setDateFrom] = useState(today);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');
    const history = useHistory();

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuList: provided => ({
            ...provided,
            backgroundColor: 'white',
        }),
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? '#6495ED' : 'transparent';
            let color = state.isSelected ? 'whitesmoke' : '#333';
            let scale = state.isSelected ? 'scale(1)' : 'scale(1.01)';

            if (state.isFocused) {
                backgroundColor = '#6495ED';
                color = 'whitesmoke';
                scale = 'scale(1.01)';
            }

            return {
                ...provided,
                color,
                backgroundColor,
                paddingTop: "5px",
                paddingBottom: "5px",
                cursor: 'pointer',
                ':focus': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                },
                ':hover': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px"
                },
            };
        },
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "30vh", borderRadius: '20px' }),
        indicatorsContainer: (provided) => ({
            ...provided,
            cursor: 'pointer',
        }),
    };

    useEffect(() => {
        LoadProductItems();
    }, []);

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        const today = new Date();
        const storedOptions = localStorage.getItem("data");
        let storedOptionsTimestamp = localStorage.getItem("dataTimestamp");

        if (storedOptions && storedOptionsTimestamp) {
            const currentTimestamp = await fetchServerTimestamp();
            if (storedOptionsTimestamp >= currentTimestamp) {
                setMyProList(JSON.parse(storedOptions));
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                return;
            }
        }

        var ProductItems = await MyProductList();
        if (ProductItems !== true) {
            setMyProList([...MyProList, ...ProductItems.data]);
            localStorage.setItem("data", JSON.stringify([...MyProList, ...ProductItems.data]));
            localStorage.setItem("dataTimestamp", today.getTime());
            if (ProductItems.data.length === 0) setHasMore(false);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    MyProList.forEach(option => {
        option.combinedLabel = `${option.label} (${option.value})`;
    });

    const DateHandler = async (e) => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        let date_from = moment(DateFrom).format("YYYY-MM-DD");
        let date_to = moment(e).format("YYYY-MM-DD");
        if (e.getTime() >= DateFrom.getTime() && DateFrom.getTime() <= e.getTime()) {
            setDateTo(e);
        } else {
            date_from = moment(e).format("YYYY-MM-DD");
            setDateFrom(e);
            setDateTo(e);
        }
        var result = await FetchProductAnalysis(SearchKey.id, date_from, date_to);
        if (result !== true)
            setData(result.data);
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    var h = window.innerHeight - 167;
    return (
        <div className="row m-0 d-flex justify-content-center">
            <div className="col-lg-12 px-0">
                <div className="row d-flex bg-white mx-auto mb-1 py-1">
                    <div className={`d-flex justify-content-between align-items-center bg-white`}>
                        <p className='fs-3 bg-white fw-bolder text-dark text-nowrap m-0 w-25'>PRODUCT ANALYSIS</p>
                        <div className="d-flex justify-content-around align-items-center bg-white p-0">
                            <div className="d-flex justify-content-end mx-2" style={{ minWidth: "50vh", maxHeight: "4vh" }}>
                                <Select
                                    options={MyProList}
                                    name="Title"
                                    placeholder={"Please select product"}
                                    styles={CScolourStyles}
                                    value={SearchKey}
                                    onChange={(e) => setSearchKey(e)}
                                    required
                                    id="Title"
                                    isClearable={true}
                                    components={{ MenuList: CustomMenuList }}
                                    optionLabel="combinedLabel"
                                    maxMenuHeight={20 * 35}
                                />
                            </div>
                            <div className="d-flex justify-content-end mx-2 w-50">
                                <Datepicker
                                    selected={DateFrom}
                                    className="form-control fs-5 fw-bold round_radius50px text-center"
                                    dateFormat="dd MMM yyyy"
                                    onChange={(e) => setDateFrom(e)}
                                    renderCustomHeader={props => customHeader({ ...props, locale })}
                                    locale={locales[locale]}
                                    placeholderText="Date"
                                    disabled={!SearchKey}
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
                                    disabled={!SearchKey}
                                />
                            </div>
                        </div>
                        <button className="btn fs-3 px-2 ml-2 py-0 text-dark border-left"
                            onClick={(e) => ProductAnalysisPDF(e, '#product_analysis')}
                        ><i className="fad fa-file-pdf"></i></button>
                    </div>
                </div>

                <div className='d-flex justify-content-center align-items-center bg-white'>
                    <div className="col-md-6 tableFixHead w-100" style={{ height: h + "px" }}>
                        <table id='product_analysis' className={`table table-hover table-borderless bg-white fs-5`}>
                            {data && SearchKey ?
                                <>
                                    <tbody>
                                        <tr className="border-bottom text-center">
                                            <td className="p-1" colspan="2"><p className="fs-4 fw-bolder text-center p-0 m-0">{`${SearchKey?.label} (${SearchKey?.value})`}</p></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="p-1" colspan="2"><p className="fs-5 fw-bolder text-center p-0 m-0 px-0">{`Sale Analysis (${moment(DateFrom).format("DD MMM YYYY")} to ${moment(DateTo).format("DD MMM YYYY")})`}</p></td>
                                        </tr>
                                        <tr className="border-bottom border-top text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Qty</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(data.sale_summary.total_qty / data.CtnQty.CtnQty || 0).toFixed(0)}</span></td>
                                        </tr>
                                        <tr className="border-bottom text-center">
                                            <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Total Amount</span></td>
                                            <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(data.sale_summary.total_subtotal || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                        </tr>

                                        {Array.isArray(data.sale_sector_summary) && data.sale_sector_summary.length ?
                                            data.sale_sector_summary.map((item, i) => (
                                                <>
                                                    <tr className="border-bottom text-center">
                                                        <td className="p-0" colspan="2"><p className="fs-5 fw-bolder text-center py-2 m-0">{item.sector_title}</p></td>
                                                    </tr>
                                                    <tr className="border-bottom text-center">
                                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Qty</span></td>
                                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(item.total_qty / data.CtnQty.CtnQty || 0).toFixed(0)}</span></td>
                                                    </tr>
                                                    <tr className="border-bottom text-center">
                                                        <td className="border-right p-1"><span className="d-block fs-6 fw-bold text-uppercase text-left text-dark px-2">Amount</span></td>
                                                        <td className="p-1"><span className="d-block fs-5 text-left text-dark fw-bolder">{parseFloat(item.total_subtotal || 0).toLocaleString("en", { minimumFractionDigits: 2 })}</span></td>
                                                    </tr>
                                                </>
                                            )) : null}
                                    </tbody>
                                </>
                                : <p className="fs-6 fw-normal text-center py-2 m-0">No data found</p>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}

const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    no: state.auth.user.Role.No,
});

export default connect(mapStateToProps, { logout })(ProductItemsAnalysis);