import { useState } from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory } from 'react-router-dom';
import store from './store';

import { BranchManagerRoute } from './hocs/BranchManagerRoute';
import { FieldWorkerRoute } from './hocs/FieldWorkerRoute';
import { PrivateRoute } from "./hocs/PrivateRoute";

import 'bootstrap/dist/css/bootstrap.min.css';
import './hocs/@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './hocs/Layout';
import "./hocs/css/light.css";
import "./hocs/css/style.css";

import Block from './containers/PublicPages/Block';
import Home from './containers/PublicPages/Home';
import Activate from './containers/PublicPages/Login_Reg_View/Activate';
import Facebook from './containers/PublicPages/Login_Reg_View/Facebook';
import Google from './containers/PublicPages/Login_Reg_View/Google';
import Login from './containers/PublicPages/Login_Reg_View/Login';
import ResetPassword from './containers/PublicPages/Login_Reg_View/ResetPassword';
import ResetPasswordConfirm from './containers/PublicPages/Login_Reg_View/ResetPasswordConfirm';
import NotFound from './containers/PublicPages/NotFound';

import Dashboard from './containers/AuthPages/Dashboard/Dashboard';
import BusinessProfiles from './containers/CeoPages/BusinessProfiles';
import EmployeeMain from './containers/CeoPages/Employee/EmployeeMain';

import LoadPending from './containers/AuthPages/LoadPending';
import PendingUser from './containers/AuthPages/PendingUser';
import Register from './containers/AuthPages/Register';
import WaitingUsers from './containers/PublicPages/Login_Reg_View/WaitingUsers';

import CreateCompany from './containers/AuthPages/Admin/CreateCompany';
import CreateBranch from './containers/CeoPages/CreateBranch';
import UpdateBranch from './containers/CeoPages/UpdateBranch';

//Profiles
import MyUserLists from './containers/AuthPages/Profiles/MyUserLists';
import Profiles from './containers/AuthPages/Profiles/Profiles';

//BusinessProfiles
import BusinessPro from './containers/AuthPages/Profiles/BisProfile/BisMain';

// Suppliers
// National Suppliers
import ProductItems from './containers/Suppliers/NationalSuppliers/Profiles/ProductItems';
import SupplierPro from './containers/Suppliers/NationalSuppliers/Profiles/SupplierMain';
import NationalSuppliers from './containers/Suppliers/NationalSuppliers/SupplierLists';
import SupplierReg from './containers/Suppliers/Register';

// My Suppliers
import MySupplierMain from './containers/Suppliers/MySuppliers/Profiles/SupplierMain';
import MySupplierList from './containers/Suppliers/MySuppliers/SupplierLists';

// Purchase
import DocketPurchase from './containers/Inventory/Purchase/DocketPurchase';
import PurchaseProduct from './containers/Inventory/Purchase/PurchaseProduct';
import SupplierList from './containers/Inventory/Purchase/SupplierLists';

// Daily Sell
import { default as RetailSell, default as Sells } from './containers/Trading/RetailSell';

// Stock
import Stock from './containers/Inventory/Stock/Stock';

//Contract Farm Management
import ContractDispatchReport from './containers/Contract/DispatchReport/ContractDispatchReport';
import PrvConInvoice from './containers/Contract/DispatchReport/ViewInvoice/PrvConInvoice';
import FarmLists from './containers/Contract/FarmLists';
import FarmMain from './containers/Contract/FarmManagement/FarmMain';
import LiveStock from './containers/Contract/LiveStock/LiveStock';
import MonitoringCell from './containers/Contract/MonitoringCell';
import SendProduct from './containers/Contract/Products/SendProduct';
import Return from './containers/Contract/Return/Return';

// Accounts
import AccountJournal from './containers/Accounts/AccountJournal';
import COA from './containers/Accounts/COA';
import PaymentList from './containers/Accounts/Farmer Payment/PaymentList';
import Ledger from './containers/Accounts/Ledger/Ledger';
import Voucher from './containers/Accounts/Voucher/Voucher';

// Business Preference
import AccountSettings from './containers/Accounts/AccountSetup/AccountSettings';
import Policy from './containers/BusinessPreference/Policy/Policy';
import ProfitMargin from './containers/BusinessPreference/ProfitMargin/ProfitMargin';

// Field Works
import BirdSell from './containers/FieldWork/BirdSell/BirdSell';
import Fieldboard from './containers/FieldWork/Dashboard';
import FarmFields from './containers/FieldWork/FarmFields';
import FarmLadger from './containers/FieldWork/FarmLadger';
import FieldWorkerMenu from './containers/FieldWork/FieldWorkerMenu';
import LightEntry from './containers/FieldWork/LightEntry';
import SellReportField from './containers/FieldWork/SellReport/SellReport';


import PaymentProcedure from './containers/Accounts/Farmer Payment/PaymentRelease';
import Backup from './containers/AuthPages/Admin/Backup';
import BisList from './containers/AuthPages/Admin/BisList';
import UserLists from './containers/AuthPages/Admin/UserLists';
import Counters from './containers/AuthPages/Counter/Counters';
import Wellcome from './containers/AuthPages/LandingPage/Wellcome';
import UpdateUser from './containers/AuthPages/Profiles/UpdateUser';
import ResetPass from './containers/AuthPages/ResetPass';
import CashLadger from './containers/CashFlow/CashLadger';
import BirdSellHistory from './containers/Contract/BirdSellReport/BirdSellHistory';
import Controlboard from './containers/Contract/Control/Controlboard';
import FCR_Rank from './containers/Contract/Control/FCR_Rank';
import LucryRank from './containers/Contract/Control/LucyRank';
import Summary from './containers/Contract/Control/Summary';
import CostMapping from './containers/Contract/Costing/CostMapping';
import GDLadger from './containers/Contract/GoodsNBirds/GDLadger';
import GoodsNBirdMain from './containers/Contract/GoodsNBirds/GoodsNBird';
import GDInvoice from './containers/Contract/GoodsNBirds/Products/GDInvoice';
import BatchAccounts from './containers/FieldWork/BatchAccount/BatchAccounts';
import BatchPayFields from './containers/FieldWork/BatchPayFields';
import BirdSellGodown from './containers/FieldWork/BirdSell/BirdSellGodown';
import BirdSellReturn from './containers/FieldWork/BirdSell/BirdSellReturn';
import FarmRecord from './containers/FieldWork/DailyRecord/FarmRecord';
import Parking from './containers/FieldWork/Parking/Parking';
import PurchaseReport from './containers/Inventory/PurchaseReport/PurchaseReport';
import ProductRequisition from './containers/Inventory/Requisitions/ProductRequisition';
import ReqExecute from './containers/Inventory/Requisitions/ReqExecute';
import RequisitionDraft from './containers/Inventory/Requisitions/RequisitionDraft';
import RequisitionHistory from './containers/Inventory/Requisitions/RequisitionHistory';
import RequisitionList from './containers/Inventory/Requisitions/RequisitionList';
import SellReport from './containers/Inventory/SellReport/SellReport';
import PartyMain from './containers/Party/MyParty/BisProfile/PartyMain';
import PartyLists from './containers/Party/MyParty/PartyLists';
import PartyReg from './containers/Party/PartyReg';
import Disable from './containers/PublicPages/Disable';
import ViewPurchase from './containers/Suppliers/MySuppliers/Profiles/ViewInvoice/ViewPurchase';
import CounterSellReport from './containers/Trading/CounterSellReport/CounterSellReport';
import Parties from './containers/Trading/Parties';
import Order from './containers/Trading/SaleOrder/Order';
import OrderExecute from './containers/Trading/SaleOrder/OrderExecute';
import OrderList from './containers/Trading/SaleOrder/OrderList';

// Quotation
import EditQuote from './containers/Trading/Quotation/EditQuote';
import QuoteList from './containers/Trading/Quotation/QuotationList';
import Quote from './containers/Trading/Quotation/Quote';
import QuoteOrder from './containers/Trading/Quotation/QuoteOrder';
import QuotePreview from './containers/Trading/Quotation/QuotePreview';
import QuoteSale from './containers/Trading/Quotation/QuoteSale';

// Purchase Order
import EditPursOrder from './containers/Trading/PurchaseOrder/EditPursOrder';
import PursOrder from './containers/Trading/PurchaseOrder/PursOrder';
import PursOrderList from './containers/Trading/PurchaseOrder/PursOrderList';

// Yard
import ContainerList from './containers/Yard/ContainerList';
import CtrPurchase from './containers/Yard/CtrPurchase';
import DeliveryNoteList from './containers/Yard/Deliveries/DeliveryNoteList';
import DeliveryNoteView from './containers/Yard/Deliveries/DeliveryNoteView';
import DeliveryRequest from './containers/Yard/Deliveries/DeliveryRequest';
import RequestExecute from './containers/Yard/Request/RequestExecute';
import YardStock from './containers/Yard/YardStock';


import PreviewInvoice from './containers/Trading/ViewInvoice/PreviewInvoice';
import Transaction from './containers/Transactions/Transactions';
import RequestList from './containers/Yard/Request/RequestList';
import { AdminRoute } from './hocs/AdminRoute';
import { AuthRoute } from './hocs/AuthRoute';
import { PublicRoute } from './hocs/PublicRoute';
import { SalesRepresentativeRoute } from './hocs/SalesRepresentativeRoute';

//Statements
import BalanceSheet from './containers/Statements/BalanceSheet';
import IncomeStatement from './containers/Statements/IncomeStatement';
import TrialBalance from './containers/Statements/TrialBalance';

const App = () => {
    const pathname = window.location.pathname
    const [list, setList] = useState([]);
    // const [ProductPro, setProductPro] = useState();
    const [SupplierID, setSupplierID] = useState();
    const [isActive, setActive] = useState(pathname === "/dashboard" ? 1 : "")
    const history = useHistory();
    return (
        // <Switch>
        //     <RouteWithLayout layout={PublicLayout} path="/" component={HomePage} />
        //     <RouteWithLayout layout={FieldWorkerRoute} path="/profile" component={ProfilePage} />
        //     <RouteWithLayout layout={Layout} path="/dashboard" component={DashboardPage} />
        // </Switch>

        // !localStorage.getItem("user") ?
        //     <Provider store={store}>
        //         <Router path='/' history={history}>
        //             <PublicLayout list={list} setList={setList}>
        //                 <Switch>

        //                 </Switch>
        //             </PublicLayout>
        //         </Router>
        //     </Provider>
        //     :
        //     JSON.parse(localStorage.getItem("accounts")) ?

        <Provider store={store}>
            <Router>
                <Layout list={list} setList={setList} setActive={setActive} isActive={isActive}>
                    <Switch>
                        {/* <Route path='/login' render={(props) => <Layout list={list} setList={setList} setActive={setActive} isActive={isActive} {...props} />}></Route> */}
                        <PublicRoute exact path='/' component={Home} render={undefined} />
                        <PublicRoute exact path='/home' component={Home} render={undefined} />
                        <PublicRoute exact path='/login' component={Login} render={undefined} />
                        <PublicRoute exact path='/block' component={Block} render={undefined} />
                        <PublicRoute exact path='/disable' component={Disable} render={undefined} />
                        <PublicRoute exact path='/disable' component={Disable} render={undefined} />
                        {/* <PublicRoute exact path='/Register' render={(props) => <Register list={list} setList={setList} {...props} />} /> */}

                        <AuthRoute exact path='/wellcome' render={(props) => <Wellcome list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/waiting' component={WaitingUsers} render={undefined} />
                        <PrivateRoute exact path='/dashboard' component={Dashboard} render={undefined} />
                        <PrivateRoute exact path='/facebook' component={Facebook} render={undefined} />
                        <PrivateRoute exact path='/google' component={Google} render={undefined} />
                        <PrivateRoute exact path='/reset-password' component={ResetPassword} render={undefined} />
                        <PrivateRoute exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} render={undefined} />
                        <PrivateRoute exact path='/activate/:uid/:token' component={Activate} render={undefined} />
                        <PrivateRoute exact path='/LoadPending' component={LoadPending} render={undefined} />
                        <PrivateRoute exact path='/Register' render={(props) => <Register list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/pending_user' component={PendingUser} render={undefined} />

                        {/* Counters */}
                        <PrivateRoute path='/counter_list' render={(props) => <Counters list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/counter_sale_report/:ctr_no/:date_from/:date_to' render={(props) => <CounterSellReport list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Cash Flow */}
                        <PrivateRoute path='/cash_flow' render={(props) => <CashLadger list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/transactions' render={(props) => <Transaction list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Field Works */}
                        <PrivateRoute path='/fields' render={(props) => <FarmFields list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/light_record/:bis_id/:id' render={(props) => <LightEntry list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/bird_sell/:bis_id/:id/:inv_no/:inv_id' render={(props) => <BirdSell list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/sell_report/:bis_id/:id/:inv_no/:inv_id' render={(props) => <SellReportField list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/field_worker' render={(props) => <FieldWorkerMenu list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Accounts */}
                        <PrivateRoute path='/voucher' render={(props) => <Voucher list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/coa' render={(props) => <COA list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/acc_journal' render={(props) => <AccountJournal list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/farmer_payment_list' render={(props) => <PaymentList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/farmer_payment_release/:id' render={(props) => <PaymentProcedure list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/ledger' render={(props) => <Ledger list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Profiles */}
                        <PrivateRoute exact path='/my_user_lists' component={MyUserLists} render={undefined} />
                        <PrivateRoute exact path='/user_profile/:id' render={(props) => <Profiles list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/update_user' render={(props) => <UpdateUser list={list} setList={setList} {...props} />} component={undefined} />

                        <PrivateRoute exact path='/business_profiles' render={(props) => <BusinessProfiles list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/employee_main/:id' render={(props) => <EmployeeMain list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/update_branch' component={UpdateBranch} render={undefined} />
                        <PrivateRoute exact path='/create_branch' render={(props) => <CreateBranch list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Supplier PrivateRoute */}
                        {/* National Suppliers */}
                        <PrivateRoute exact path='/national_supplier_list' render={(props) => <NationalSuppliers list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/my_supplier_pro/:sup_id' render={(props) => <SupplierPro list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/product_item/:sup_id/:id' render={(props) => <ProductItems list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Supplier PrivateRoute */}
                        {/* My Suppliers */}
                        <PrivateRoute exact path='/my_supplier_list' render={(props) => <MySupplierList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/my_supplier/:sup_id' render={(props) => <MySupplierMain list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/supplier_reg' render={(props) => <SupplierReg list={list} setList={setList} {...props} />} component={undefined} />
                        {/* Supplier PrivateRoute */}

                        {/* Party PrivateRoute */}
                        {/* Party */}
                        <PrivateRoute exact path='/my_party_list' render={(props) => <PartyLists list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/my_party/:party_id/:my_party_id' render={(props) => <PartyMain list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/party_reg' render={(props) => <PartyReg list={list} setList={setList} {...props} />} component={undefined} />
                        {/* Party PrivateRoute */}

                        {/* Inventory */}
                        {/* Purchase */}
                        <PrivateRoute exact path='/supplier_items' render={(props) => <SupplierList setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/purchase_product/:sup_id' render={(props) => <PurchaseProduct setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/purchase_reports' render={(props) => <PurchaseReport list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/purchase_order' render={(props) => <PursOrder list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/purs_order_list' render={(props) => <PursOrderList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/po_edit/:po_id' render={(props) => <EditPursOrder list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/add_docket/:purs_id' render={(props) => <DocketPurchase list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Trading */}
                        {/* Order */}
                        <PrivateRoute exact path='/parties' render={(props) => <Parties setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/order/:party_id' render={(props) => <Order list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/order_exc/:order_id' render={(props) => <OrderExecute list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/order_list' render={(props) => <OrderList list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Quotation */}
                        <PrivateRoute exact path='/parties' render={(props) => <Parties setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/quote' render={(props) => <Quote list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/quote_list' render={(props) => <QuoteList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/quote_preview/:qt_id' render={(props) => <QuotePreview list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/quote_edit/:qt_id' render={(props) => <EditQuote list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/quote_sale/:qt_id/:walk_in' render={(props) => <QuoteSale list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/quote_order/:qt_id/:party_id' render={(props) => <QuoteOrder list={list} setList={setList} {...props} />} component={undefined} />

                        <PrivateRoute exact path='/order_exc/:order_id' render={(props) => <OrderExecute list={list} setList={setList} {...props} />} component={undefined} />


                        <PrivateRoute exact path='/rtl_sell' render={(props) => <RetailSell setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/whl_sell' render={(props) => <Sells setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/sell_reports' render={(props) => <SellReport list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/sell_invoice_preview/:inv_id' render={(props) => <PreviewInvoice list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/purs_invoice_preview/:pur_id' render={(props) => <ViewPurchase list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Stock */}
                        <PrivateRoute exact path='/stock' render={(props) => <Stock setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Bis Profile */}
                        <PrivateRoute path='/business_pro/:id/:bis_id' render={(props) => <BusinessPro list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Cotract */}
                        {/* Farm */}
                        <PrivateRoute path='/control_board' render={(props) => <Controlboard list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/contract_summery' render={(props) => <Summary list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/fcr_rank' render={(props) => <FCR_Rank list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/lucy_rank' render={(props) => <LucryRank list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/farm_mng/:id/:bis_id/:batch_id' render={(props) => <FarmMain list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/farm_lists' render={(props) => <FarmLists list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/send_products/:id' render={(props) => <SendProduct list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/live_stock' render={(props) => <LiveStock list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/cost_mapping' render={(props) => <CostMapping list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/bird_sell_history' render={(props) => <BirdSellHistory list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/con_dispatch_report' render={(props) => <ContractDispatchReport list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/prv_dispatch_invoice/:inv_no' render={(props) => <PrvConInvoice list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/field_monitoring' render={(props) => <MonitoringCell list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/recall_products' render={(props) => <Return list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/goods_n_bird' render={(props) => <GoodsNBirdMain list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/gd_invoice/:id' render={(props) => <GDInvoice list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/gd_ladger/:id' render={(props) => <GDLadger list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Yard */}
                        <PrivateRoute path='/ctr_list' render={(props) => <ContainerList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/ctr_purchase' render={(props) => <CtrPurchase list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/yard' render={(props) => <YardStock list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/yard_request' render={(props) => <DeliveryRequest list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/request_list' render={(props) => <RequestList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/request_exc/:id' render={(props) => <RequestExecute list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/delivery_notes' render={(props) => <DeliveryNoteList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/delivery_note_view/:id' render={(props) => <DeliveryNoteView list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Statements */}
                        <PrivateRoute path='/inc_statement' render={(props) => <IncomeStatement list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/bal_sheet' render={(props) => <BalanceSheet list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/trial_balance' render={(props) => <TrialBalance list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Business Preference */}
                        <PrivateRoute path='/acc_settings' render={(props) => <AccountSettings list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute path='/profit_margin' render={(props) => <ProfitMargin list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/policy' render={(props) => <Policy list={list} setList={setList} {...props} />} component={undefined} />

                        <PrivateRoute exact path='/req_list' render={(props) => <RequisitionList list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/req_execute/:req_no' render={(props) => <ReqExecute list={list} setList={setList} {...props} />} component={undefined} />
                        <PrivateRoute exact path='/pvt_reset_pass' render={(props) => <ResetPass list={list} setList={setList} {...props} />} component={undefined} />

                        <BranchManagerRoute exact path='/' component={Dashboard} render={undefined} />
                        <BranchManagerRoute exact path='/products_requisition' render={(props) => <ProductRequisition list={list} setList={setList} setActive={setActive} {...props} />} component={undefined} />
                        <BranchManagerRoute exact path='/req_draft' render={(props) => <RequisitionDraft list={list} setList={setList} {...props} />} component={undefined} />
                        <BranchManagerRoute exact path='/req_history' render={(props) => <RequisitionHistory list={list} setList={setList} {...props} />} component={undefined} />
                        <BranchManagerRoute exact path='/br_reset_pass' render={(props) => <ResetPass list={list} setList={setList} {...props} />} component={undefined} />

                        <FieldWorkerRoute exact path='/' component={Dashboard} render={undefined} />
                        <FieldWorkerRoute exact path='/' render={(props) => <FieldWorkerMenu list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/field_work' render={(props) => <FieldWorkerMenu list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/field_board' render={(props) => <Fieldboard list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_fields' render={(props) => <FarmFields list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_parked' render={(props) => <Parking list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_batch_pay_fields' render={(props) => <BatchPayFields list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_light_record/:bis_id/:id' render={(props) => <LightEntry list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_farm_ladger/:bis_id/:id' render={(props) => <FarmLadger list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_farm_record/:bis_id/:id' render={(props) => <FarmRecord list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_batch_account/:bis_id' render={(props) => <BatchAccounts list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_bird_sell/:bis_id/:id/:inv_no/:inv_id' render={(props) => <BirdSell list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_bird_sell_gd/:gd_id/:inv_no/:inv_id' render={(props) => <BirdSellGodown list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_bird_sell_return/:bis_id/:id/:inv_no/:inv_id' render={(props) => <BirdSellReturn list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_sell_report/:bis_id/:id/:inv_no/:inv_id' render={(props) => <SellReportField list={list} setList={setList} {...props} />} component={undefined} />
                        <FieldWorkerRoute exact path='/fwr_reset_pass' render={(props) => <ResetPass list={list} setList={setList} {...props} />} component={undefined} />

                        <SalesRepresentativeRoute exact path='/' component={Dashboard} render={undefined} />
                        <SalesRepresentativeRoute exact path='/sr_sells' render={(props) => <Sells setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute exact path='/sr_sell_reports' render={(props) => <SellReport list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute path='/sr_farm_lists' render={(props) => <FarmLists list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute path='/sr_send_products/:id' render={(props) => <SendProduct list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute path='/sr_con_dispatch_report' render={(props) => <ContractDispatchReport list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute path='/sr_prv_dispatch_invoice/:inv_no' render={(props) => <PrvConInvoice list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute exact path='/sr_stock' render={(props) => <Stock setSupplierID={setSupplierID} SupplierID={SupplierID} list={list} setList={setList} {...props} />} component={undefined} />
                        <SalesRepresentativeRoute exact path='/sr_reset_pass' render={(props) => <ResetPass list={list} setList={setList} {...props} />} component={undefined} />


                        <AdminRoute exact path='/' component={Dashboard} render={undefined} />
                        {/* Business */}
                        <AdminRoute exact path='/bis_registration' render={(props) => <CreateCompany list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/bis_lists' render={(props) => <BisList list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/usr_list' render={(props) => <UserLists list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/ad_backup' render={(props) => <Backup list={list} setList={setList} {...props} />} component={undefined} />

                        {/* Supplier */}
                        <AdminRoute exact path='/bis_supplier_reg' render={(props) => <SupplierReg list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/bis_national_supplier_list' render={(props) => <NationalSuppliers list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute path='/adm_supplier_pro/:sup_id' render={(props) => <SupplierPro list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/adm_product_item/:sup_id/:id' render={(props) => <ProductItems list={list} setList={setList} {...props} />} component={undefined} />
                        <AdminRoute exact path='/adm_reset_pass' render={(props) => <ResetPass list={list} setList={setList} {...props} />} component={undefined} />

                        <Route path='/not_found' component={NotFound} />
                        <Route component={NotFound} />
                        <Redirect path="/" exact to="/home" />
                    </Switch>

                </Layout>


            </Router>
        </Provider >
    );
}

export default App;