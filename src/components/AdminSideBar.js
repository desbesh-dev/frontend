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
import logo from '../assets/logo.png'

const AdminSideBar = ({ logout, scale, sub_scale, user, children, setNavBar, NavBar, isActive, setActive }) => {
  const [Dropdown, setDropdown] = useState(null)


  return (
    <nav id="sidebar" className={NavBar ? "sidebar toggled" : "sidebar"}>

      <Link className="sidebar-brand p-0 mt-2" to="/">
        <img src={logo} className="img-fluid mx-auto d-table" width="160" height="100" alt="avatar" />
        {/* SoftaPoul */}
      </Link>
      <div className="sidebar-content">
        <div className="sidebar-user pt-4">
          <img src={user ? process.env.REACT_APP_API_URL + user.Image : ''} className="img-fluid rounded-circle border border-success mb-0" width="50" height="55" alt="avatar" />
          <div className="fw-bold p-0 m-0 fs-4">{user ? user.FullName : ''}</div>
          <small className="text-muted">
            {
              scale ? scale === 9 ? "Super Admin" : scale === 8 ? "Admin" : scale === 7 ? "Representative" : null : null
            }
            {", SoftaPoul Administration"}
          </small>
          <br />
          <small>{user ? user.Email : ''}</small>
        </div>

        <ul className="sidebar-nav">
          <li className="sidebar-header">
            Main
          </li>

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

          <li className="sidebar-item">
            <a
              scale-bs-target="#accounts" scale-bs-toggle="collapse"
              className={isActive >= 901 && isActive < 999 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 901 && isActive < 999 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 900 && isActive < 999 && isActive !== null ? null : 900)}>
              <i className="fad fa-calculator-alt text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i>
              <span className="align-middle ml-2">Business</span>
            </a>

            <ul id="accounts" className={isActive >= 900 && isActive < 999 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">
              <li className="sidebar-item" id="Debit" onClick={(e) => setActive(901)}>
                <Link className={isActive === 901 ? "sidebar-link active" : "sidebar-link"} to='/bis_registration' >Business Register</Link>
              </li>
              <li className="sidebar-item" id="Debit" onClick={(e) => setActive(905)}>
                <Link className={isActive === 905 ? "sidebar-link active" : "sidebar-link"} to='/bis_lists' >Business Profiles</Link>
              </li>
            </ul>
          </li>

          {/* Suppliers */}
          <li className="sidebar-item">
            <a
              scale-bs-target="#dashboards" scale-bs-toggle="collapse"
              className={isActive >= 301 && isActive < 399 ? "sidebar-link active" : "sidebar-link collapsed"}
              aria-expanded={isActive >= 301 && isActive < 399 ? "true" : "false"}
              onClick={(e) => setActive(isActive >= 300 && isActive < 399 && isActive !== null ? null : 300)}>
              <i class="fad fa-briefcase text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Suppliers</span>
            </a>

            <ul id="Suppliers" className={isActive >= 300 && isActive < 399 ? "sidebar-dropdown list-unstyled collapse show" : "sidebar-dropdown list-unstyled collapse"} scale-bs-parent="#sidebar">

              <li className="sidebar-item">
                <Link className={isActive === 301 ? "sidebar-link active" : "sidebar-link"} to='/bis_supplier_reg' id="SupplierReg" role='button' onClick={(e) => setActive(301)}>Add New Supplier</Link>
              </li>

              <li className="sidebar-item">
                <Link className={isActive === 304 ? "sidebar-link active" : "sidebar-link"} to='/bis_national_supplier_list' id="AllSuppliers" role='button' onClick={(e) => setActive(304)}>National Suppliers</Link>
              </li>


            </ul>
          </li>



          <li className="sidebar-item" id="Profiles" onClick={(e) => setActive(500)}>
            <Link className={isActive === 500 ? "sidebar-link active" : "sidebar-link"} to='/usr_list'>
              <i class="fad fa-users text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Users</span></Link>
          </li>

          <li className="sidebar-item" id="Backup" onClick={(e) => setActive(501)}>
            <Link className={isActive === 501 ? "sidebar-link active" : "sidebar-link"} to='/ad_backup'>
              <i class="fad fa-backpack text-center align-middle fs-4 me-0" style={{ minWidth: "30px" }}></i> <span className="align-middle ml-2">Backup</span></Link>
          </li>


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

export default connect(mapStateToProps, { logout })(AdminSideBar);
