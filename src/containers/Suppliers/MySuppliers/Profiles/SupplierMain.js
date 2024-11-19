import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { logout } from '../../../../actions/auth';
import { GetSuppliers } from '../../../../actions/SuppliersAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import unavilable_logo from '../../../../assets/no_logo.jpg';
import AgedInvoices from './AgedInvoiceList/AgedInvoices';
import Dockets from './Dockets';
import Invoices from './Invoices';
import Ladger from './Ladger/Ladger';
import ProductList from './ProductItems';
import PurchaseOrder from './PurchaseOrder';

const SupplierMain = ({ display, SupplierID, list, setList }) => {
    let { path, url } = useRouteMatch();
    const [Data, setData] = useState(null)
    const dispatch = useDispatch();;

    useEffect(() => {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        LoadSuppliers();
    }, [])

    const LoadSuppliers = async () => {
        var result = await GetSuppliers(SupplierID);

        if (result !== true) {

            setData(result);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/my_supplier');
        }
    }
    const history = useHistory();

    return (
        <>
            <div className={"item grid-group-item list-group-item m-0"}>
                <div className="box thumbnail card py-2 shadow-none m-0 h-100">
                    <div className="img-event d-flex flex-column justify-content-center align-items-end" style={{ minHeight: "10vh", width: "40%" }}>
                        <img src={Data ? Data.Logo : unavilable_logo} className="img-fluid rounded mb-0 mx-auto d-table" alt="avatar" style={{ height: "10vh" }} />
                    </div>

                    <div className="caption card-body d-flex flex-column justify-content-center align-items-start py-0 px-2 w-50" style={{ minHeight: "10vh", width: "60%" }}>
                        <p className="group inner list-group-item-text fs-5 m-0"><span className="display-6 d-flex justify-content-start m-0">{Data ? Data.SupplierTitle : null}</span></p>
                        <p className="fs-5 fw-bold text-muted m-0">{Data ? Data.Address + ", " + Data.Contact : null}</p>
                        <p className="fs-5 fw-bold text-muted m-0">{Data ? Data.Contact + ", " + Data.Email : null}</p>
                    </div>
                </div>
            </div>

            <div className="header d-flex justify-content-center bg-white my-1">
                <div className="d-flex justify-content-start overflow-auto">
                    <Link className='fw-bold btn btn-outline-warning' title="Back to My Supplier" type='button' to="/my_supplier_list"> ← My Supplier</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}></div>
                    <Link className='btn btn-outline-success fw-bold fs-5' title="Products" type='button' to={`${url}/ladger`}>Transactions</Link>

                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }}>
                        {/* <div className="cs_inner"></div> */}
                    </div>

                    <Link className="btn btn-outline-success fw-bold fs-5" type='button' to={`${url}/orders`}>P/O</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className="btn btn-outline-success fw-bold fs-5" type='button' to={`${url}/invoice`}>Invoice</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className='btn btn-outline-success fw-bold fs-5' title="Agents" type='button' to={`${url}/docket`}>Dockets</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className='fw-bold fs-5 btn btn-outline-success' title="Aged Invoice" type='button' to={`${url}/aged_invoice`}>Aged Invoice</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className='btn btn-outline-success fw-bold fs-5' title="Products" type='button' to={`${url}/product_items`}>Products</Link>
                    <div className="cs_outer bg-light mx-2 my-auto" style={{ height: "30px" }} />
                    <Link className="btn btn-outline-success fw-bold fs-5" type='button' to={url}>Banks</Link>

                </div>
            </div>

            <Switch>
                <Route exact path={path}> <ProductList SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/product_items`}> <ProductList SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/ladger`}> <Ladger SupplierID={SupplierID} Title={Data?.SupplierTitle} Address={[Data?.Address, Data?.Contact, Data?.Email].filter(Boolean).join(', ')} BisData={Data} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/orders`}> <PurchaseOrder SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/invoice`}> <Invoices SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/docket`}> <Dockets SupplierID={SupplierID} list={list} setList={setList} /> </Route>
                <Route exact path={`${path}/aged_invoice`}> <AgedInvoices SupplierID={SupplierID} SupplierData={Data} list={list} setList={setList} /> </Route>
                <Route render={(props) => <Redirect to="/not_found" />} />
            </Switch>
        </>
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    SupplierID: props.match.params.sup_id
});

export default connect(mapStateToProps, { logout })(SupplierMain);