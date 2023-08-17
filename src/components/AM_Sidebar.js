import "adminbsb-materialdesign/css/themes/all-themes.css";

import React, { Fragment, useEffect, useState } from "react";

import { GrBusinessService, GrGroup } from "react-icons/gr";
import { HiClipboardList } from "react-icons/hi";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiFileUserLine } from "react-icons/ri";
import { TiGroup } from "react-icons/ti";
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { FaFileContract } from "react-icons/fa";
import Register from '../containers/AuthPages/Register';
// import Dashboard from '../containers/AuthPages/Dashboard';

const AM_Sidebar = ({ logout, scale, sub_scale, user, children, setNavBar, NavBar, isActive, setActive }) => {
  const [Dropdown, setDropdown] = useState(null)


  return (
    <nav id="sidebar" className={NavBar ? "sidebar toggled" : "sidebar"}>

      <Link className="sidebar-brand p-0 mt-2" to="/">
        <img src={`${process.env.REACT_APP_API_URL}/Media/SoftaBin.png`} className="img-fluid mx-auto d-table" width="160" height="100" alt="avatar" />
        {/* SoftaPoul */}
      </Link>
      <div className="sidebar-content">
        <div className="sidebar-user pt-4">
          <img src={user ? process.env.REACT_APP_API_URL + user.Image : ''} className="img-fluid rounded-circle border border-success mb-0" width="50" height="55" alt="avatar" />
          <div className="fw-bold p-0 m-0 fs-4">{user ? user.FullName : ''}</div>
          <small className="text-muted">
            {
              scale ? scale === 3 ?
                sub_scale === 1 ? "Office Clerk" : sub_scale === 2 ? "Sales Executive" : sub_scale === 3 ? "Store Keeper" : sub_scale === 4 ? "Feild Worker" : sub_scale === 5 ? "Sales Manager" : sub_scale === 6 ? "Area Manager" : sub_scale === 7 ? "Branch Manager" : sub_scale === 8 ? "Cashier" : sub_scale === 9 ? "Accountant" : sub_scale === 10 ? "Admin" : null
                : scale === 6 ? "Managing Director"
                  : scale === 7 ? "Representative"
                    : scale === 8 ? "Admin"
                      : scale === 9 ? "Super Admin"
                        : null : null
            }
            {
              user ? ", " + user.BranchName + " Branch" :
                null}
          </small>
          <br />
          <small>{user ? [user.Email, user.MobileNo].filter(Boolean).join(', ') : ''}</small>
        </div>

        <ul className="sidebar-nav">
          <li className="sidebar-header">Main</li>

          {/* Dashboard */}
          <li className="sidebar-item">
            <a
              scale-bs-target="#dashboards" scale-bs-toggle="collapse"
              className={isActive >= 1 && isActive < 99 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 1 && isActive < 99 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 0 && isActive < 99 && isActive !== null ? null : 0)}>
              <i className="fad fa-tachometer-alt-average text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Dashboards</span>
            </a>

            <ul id="dashboards" className={isActive < 99 && isActive !== null ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
              <li className="sidebar-item" id="Dashboard" onClick={(e) => setActive(1)}>
                <Link className={isActive === 1 ? "sidebar-link active" : "sidebar-link"} to='/dashboard' >Default</Link>
              </li>

              <li className="sidebar-item" id="Analytics" onClick={(e) => { setActive(2) }}>
                <Link className={isActive === 2 ? "sidebar-link active" : "sidebar-link"} to='/' role='button'>Analytics</Link></li>
              <li className="sidebar-item" id="commerce" onClick={(e) => { setActive(3) }}>
                <Link className={isActive === 3 ? "sidebar-link active" : "sidebar-link"} to="/">Trend & Chart</Link></li>
            </ul>
          </li>

          {/* Sells */}
          <li className="sidebar-item" id="DailySell" onClick={(e) => setActive(600)}>
            <Link className={isActive === 600 ? "sidebar-link active" : "sidebar-link"} to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? '/sr_sells' : '/rtl_sell'}`}>
              <i class="fad fa-cart-plus text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">Daily Sell</span></Link>
          </li>


          {scale === 6 || (scale === 3 && (sub_scale === 7 || sub_scale === 8 || sub_scale === 9 || sub_scale === 10)) ?
            <Fragment>
              {/* Cash Flow */}
              <li className="sidebar-item" id="CashFlow" onClick={(e) => setActive(1200)}>
                <Link className={isActive === 1200 ? "sidebar-link active" : "sidebar-link"} to='/cash_flow'>
                  <i class="fad fa-sack-dollar text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">Cash Flow</span></Link>
              </li>

              {/* Accounts */}
              <li className="sidebar-item">
                <a
                  scale-bs-target="#accounts" scale-bs-toggle="collapse"
                  className={isActive >= 901 && isActive < 999 ? "sidebar-link active" : "sidebar-link collapsed"}
                  aria-expanded={isActive >= 901 && isActive < 999 ? "true" : "false"}
                  onClick={(e) => setActive(isActive >= 900 && isActive < 999 && isActive !== null ? null : 900)}>
                  <i className="fad fa-calculator-alt text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i>
                  <span className="align-middle ml-2">Accounting</span>
                </a>

                <ul id="accounts" className={isActive >= 900 && isActive < 999 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
                  <li className="sidebar-item" id="Debit" onClick={(e) => setActive(901)}>
                    <Link className={isActive === 901 ? "sidebar-link active" : "sidebar-link"} to='/voucher' >Voucher</Link>
                  </li>
                  <li className="sidebar-item" id="Debit" onClick={(e) => setActive(905)}>
                    <Link className={isActive === 905 ? "sidebar-link active" : "sidebar-link"} to='/acc_journal' >Account Journal</Link>
                  </li>

                  <li className="sidebar-item" id="Credit" onClick={(e) => { setActive(902) }}>
                    <Link className={isActive === 902 ? "sidebar-link active" : "sidebar-link"} to='/coa' role='button'>COA</Link>
                  </li>
                  <li className="sidebar-item" id="Contra" onClick={(e) => { setActive(903) }}>
                    <Link className={isActive === 903 ? "sidebar-link active" : "sidebar-link"} to="/farmer_payment_list">Farmer Payment</Link>
                  </li>
                  <li className="sidebar-item" id="Journal" onClick={(e) => { setActive(904) }}>
                    <Link className={isActive === 904 ? "sidebar-link active" : "sidebar-link"} to="/">Journal voucher</Link>
                  </li>
                </ul>
              </li>


              {/* Field */}
              <li className="sidebar-item" id="FieldWorks" onClick={(e) => setActive(1000)}>
                <Link className={isActive === 1000 ? "sidebar-link active" : "sidebar-link"} to='/fields'>
                  <i class="fad fa-biking text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">Field Work</span></Link>
              </li>
            </Fragment>
            :
            null}

          {/* Contact Farm */}
          <li className="sidebar-item">
            <a
              scale-bs-target="#dashboards" scale-bs-toggle="collapse"
              className={isActive >= 101 && isActive < 199 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 101 && isActive < 199 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 100 && isActive < 199 && isActive !== null ? null : 100)}>
              <i class="fad fa-file-signature text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">Contract Farms</span>
            </a>
            <ul id="dashboards" className={isActive >= 100 && isActive < 199 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
              <li className="sidebar-item" id="FarmLists" onClick={(e) => setActive(102)}>
                <Link className={isActive === 102 ? "sidebar-link active" : "sidebar-link"} to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? '/sr_farm_lists' : '/farm_lists'}`} role='button'>Farm Lists</Link>
              </li>

              <li className="sidebar-item" id="FarmerLists" onClick={(e) => setActive(103)}>
                <Link className={isActive === 103 ? "sidebar-link active" : "sidebar-link"} to="/">Farmer Lists</Link>
              </li>
              <li className="sidebar-item" id="BirdStock" onClick={(e) => setActive(105)}>
                <Link className={isActive === 105 ? "sidebar-link active" : "sidebar-link"} to='/live_stock' >Live Stock</Link>
              </li>
              <li className="sidebar-item" id="Monitoring" onClick={(e) => setActive(104)}>
                <Link className={isActive === 104 ? "sidebar-link active" : "sidebar-link"} to='/field_monitoring' >Monitoring Cell</Link>
              </li>
              <li className="sidebar-item" id="Assesment" onClick={(e) => setActive(106)}>
                <Link className={isActive === 106 ? "sidebar-link active" : "sidebar-link"} to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? '/sr_con_dispatch_report' : '/con_dispatch_report'}`}>Dispatch Report</Link>
              </li>
              <li className="sidebar-item" id="BirdSell" onClick={(e) => setActive(108)}>
                <Link className={isActive === 108 ? "sidebar-link active" : "sidebar-link"} to='/bird_sell_history' >Bird Sell Report</Link>
              </li>
            </ul>
          </li>


          {/* Party */}
          {/* <li className="sidebar-item">
            <a
              scale-bs-target="#dashboards" scale-bs-toggle="collapse"
              className={isActive >= 401 && isActive < 499 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 401 && isActive < 499 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 400 && isActive < 499 && isActive !== null ? null : 400)}>
              <i class="fad fa-handshake text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">Party</span>
            </a>

            <ul id="Party" className={isActive >= 400 && isActive < 499 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
              <li className="sidebar-item">
                <Link className={isActive === 401 ? "sidebar-link active" : "sidebar-link"} to='/create_company' id="PartyReg" role='button' onClick={(e) => setActive(401)}>Add New Party</Link>
              </li>

              <li className={isActive === "MyParty" ? "sidebar-item active" : "sidebar-item"}>
                <Link className={isActive === 402 ? "sidebar-link active" : "sidebar-link"} to='/Register' id="MyParty" role='button' onClick={(e) => setActive(402)}>My Party</Link>
              </li>

              <li className={isActive === "PartyDashboard" ? "sidebar-item active" : "sidebar-item"}>
                <Link className={isActive === 403 ? "sidebar-link active" : "sidebar-link"} to='/create_branch' id="PartyDashboard" role='button' onClick={(e) => setActive(403)}>Dashboard</Link>
              </li>

            </ul>
          </li> */}

          {/* Inventory */}
          <li className="sidebar-item">
            <a
              scale-bs-target="#dashboards" scale-bs-toggle="collapse"
              className={isActive >= 701 && isActive < 799 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 701 && isActive < 799 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 700 && isActive < 799 && isActive !== null ? null : 700)}>
              <i class="fad fa-people-carry text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Inventory</span>
            </a>

            <ul id="Inventory" className={isActive >= 700 && isActive < 799 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
              {
                scale === 6 || (scale === 3 && sub_scale === 10) ?
                  <Fragment>
                    <li className="sidebar-item">
                      <Link className={isActive === 701 ? "sidebar-link active" : "sidebar-link"} to='/supplier_items' id="InvPurchase" role='button' onClick={(e) => setActive(701)}>Product Purchase</Link>
                    </li>
                    <li className="sidebar-item">
                      <Link className={isActive === 709 ? "sidebar-link active" : "sidebar-link"} to='/req_list' id="ReqList" role='button' onClick={(e) => setActive(709)}>Requisition List</Link>
                    </li>
                  </Fragment>

                  : scale === 3 && sub_scale === 7 ?
                    <Fragment>
                      <li className="sidebar-item">
                        <Link className={isActive === 701 ? "sidebar-link active" : "sidebar-link"} to='/products_requisition' id="InvPurchase" role='button' onClick={(e) => setActive(701)}>Products Requisition</Link>
                      </li>
                      <li className="sidebar-item">
                        <Link className={isActive === 707 ? "sidebar-link active" : "sidebar-link"} to='/req_draft' id="Requisition" role='button' onClick={(e) => setActive(707)}>Requisition Draft</Link>
                      </li>
                      <li className="sidebar-item">
                        <Link className={isActive === 708 ? "sidebar-link active" : "sidebar-link"} to='/req_history' id="History" role='button' onClick={(e) => setActive(708)}>Requisition History</Link>
                      </li>
                    </Fragment>
                    : null
              }

              <li className="sidebar-item">
                <Link className={isActive === 702 ? "sidebar-link active" : "sidebar-link"} to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? '/sr_stock' : '/stock'}`} id="ProductStock" role='button' onClick={(e) => setActive(702)}>Product Stock</Link>
              </li>

              <li className="sidebar-item">
                <Link className={isActive === 703 ? "sidebar-link active" : "sidebar-link"} to={`${scale === 3 && (sub_scale === 2 || sub_scale === 3 || sub_scale === 4) ? '/sr_sell_reports' : '/sell_reports'}`} id="Reports" role='button' onClick={(e) => setActive(703)}>Report</Link>
              </li>

              {/* <li className="sidebar-item">
                <Link className={isActive === 704 ? "sidebar-link active" : "sidebar-link"} to='/national_supplier_list' id="Statistics" role='button' onClick={(e) => setActive(704)}>Sell Statistics</Link>
              </li>

              <li className="sidebar-item">
                <Link className={isActive === 705 ? "sidebar-link active" : "sidebar-link"} to='/create_branch' id="StockTrace" role='button' onClick={(e) => setActive(705)}>Stock Trace</Link>
              </li>

              <li className="sidebar-item">
                <Link className={isActive === 706 ? "sidebar-link active" : "sidebar-link"} to='/create_branch' id="InvDashboard" role='button' onClick={(e) => setActive(706)}>Dashboard</Link>
              </li> */}

            </ul>
          </li>

          <Fragment>
            {/* Profile */}
            <li className="sidebar-item" id="Profiles" onClick={(e) => setActive(500)}>
              <Link className={isActive === 500 ? "sidebar-link active" : "sidebar-link"} to='/my_user_lists'>
                <i class="fad fa-users text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Profiles</span></Link>
            </li>

            {/* Register */}
            <li className="sidebar-item">
              <a
                scale-bs-target="#dashboards" scale-bs-toggle="collapse"
                className={isActive >= 201 && isActive < 299 ? "sidebar-link active" : "sidebar-link collapsed"}
                aria-expanded={isActive >= 201 && isActive < 299 ? "true" : "false"}
                onClick={(e) => setActive(isActive >= 200 && isActive < 299 && isActive !== null ? null : 200)}>
                <i class="fad fa-file-user text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i><span className="align-middle ml-2">User Register</span>
              </a>
              <ul id="UserRegister" className={isActive >= 200 && isActive < 299 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
                <li className="sidebar-item">
                  <Link className={isActive === 202 ? "sidebar-link active" : "sidebar-link"} to='/Register' id="Register" role='button' onClick={(e) => { setActive(202) }}>Add New User</Link>
                </li>

                {/* <li className="sidebar-item">
                  <Link className={isActive === 204 ? "sidebar-link active" : "sidebar-link"} to='/LoadPending' id="LoadPending" role='button' onClick={(e) => { setActive(204) }}>Pending User</Link>
                </li> */}
              </ul>
            </li>

          </Fragment>

        </ul>
      </div >
    </nav >
  );

}

const mapStateToProps = state => ({
  user: state.auth.user,
  scale: state.auth.scale,
  sub_scale: state.auth.sub_scale
});

export default connect(mapStateToProps, { logout })(AM_Sidebar);
