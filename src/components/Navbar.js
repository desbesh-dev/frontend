/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useState } from 'react';

import { Link, Redirect, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { LoadProfile } from '../actions/APIHandler';
import { logout } from '../actions/auth';
import logo from '../assets/logo.png';
// import { Container, Nav, NavDropdown } from 'react-bootstrap';

const Navbar = ({ logout, user, scale, no, cat }) => {
	const [DropDown, setDropDown] = useState(false);
	const [Expand, setExpand] = useState(false);
	const [Grid, setGrid] = useState(false);
	const [NavToggle, setNavToggle] = useState(false);
	const history = useHistory();
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [isFullscreen, setIsFullscreen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const isMobile = screenWidth <= 980;
	const logout_user = (e) => {
		e.preventDefault();
		logout();
		history.push('/');
	};

	const BrowserClose = (e) => {
		e.preventDefault();
		window.close();
	}

	const BlurToggle = (e) => {
		if (e.relatedTarget === null)
			setDropDown(false)
		else if (e.relatedTarget.id === e.target.id) {
			setDropDown(true)
		}
		else {
			setDropDown(false)
		}
	}

	const BlurNavToggle = (e) => {
		if (e.relatedTarget === null)
			setNavToggle(false)
		else if (e.relatedTarget.id === 'grid_menu') {
			setNavToggle(true)
		}
		else {
			setNavToggle(false)
		}
	}

	const GridMenu = (e) => {
		if (e.relatedTarget === null)
			setGrid(false)
		else if (e.relatedTarget.id === e.target.id) {
			setGrid(true)
		}
		else {
			setGrid(false)
		}
	}

	const FetchUser = async (id) => {
		var User_Data = await LoadProfile(id);
		history.push('/update_user', { UserData: User_Data });
	}

	const guestLinks = () => (
		<Fragment>
			<li className='nav-item active'>
				<Link className='nav-link' to='/'>Home <span className='sr-only'>(current)</span></Link>
			</li>
			<li className='nav-item'>
				<Link className='nav-link' to='/login'>Login</Link>
			</li>
			{/* <li className='nav-item'>
				<Link className='nav-link' to='/signup'>Sign Up</Link>
			</li>
			<li className='nav-item'>
				<Link className='nav-link' to='/company_register'>Create A Business</Link>
			</li> */}
			{/* <Redirect to='/wellcome' /> */}
		</Fragment>
	);

	const WaitingView = () => (
		<Fragment>
			<li className='nav-item'>
				<a className='nav-link' href='#'>{!user ? "Loading" : user.FullName}</a>
			</li>
			<li className='nav-item'>
				<Link className='nav-link' to='#' onClick={logout_user}>Logout</Link>
			</li>
			<Redirect to='/disable' />
		</Fragment>
	);

	const BlockView = () => (
		<Fragment>
			<li className='nav-item'>
				<a className='nav-link' href='#'>{!user ? "Loading" : user.FullName}</a>
			</li>
			<li className='nav-item'>
				<Link className='nav-link' to='#' onClick={logout_user}>Logout</Link>
			</li>
			<Redirect to='/block' />
		</Fragment>
	);

	const dropdown_toggle = (toggle) => {
		return (
			<ul
				className={`dropdown-menu dropdown-menu-right mx-2 px-2 ${toggle ? "show" : null}`}
				aria-labelledby="grid_menu"
				style={{ zIndex: "1000", height: "auto", maxHeight: "420px", width: "350px", overflowX: "hidden" }}
				onBlur={(e) => BlurNavToggle(e)}
			>
				{no === 8 && cat === 4 ?
					<li className='m-2'>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to='/ctr_list'><i className="fad fa-container-storage"></i> Containers</Link>
						</div>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to='/request_list'><i className="fad fa-folders"></i> Order List</Link>
						</div>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to='/delivery_notes'><i className="fad fa-chart-line"></i> Docket List</Link>
						</div>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to='/purchase_reports'><i className="fad fa-chart-line-down"></i> Purchase Report</Link>
						</div>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to='/yard'><i className="fad fa-cubes"></i> Yard Stock</Link>
						</div>
						<div className='d-flex align-items-center py-2'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu"><i className="fad fa-abacus"></i> Y-Summary</Link>
						</div>
					</li>
					:
					<li className='m-2'>
						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" name="Dashboard" onClick={(e) => setExpand(Expand === "Dashboard" ? false : "Dashboard")}><i className="fad fa-chart-network pr-1 fa-fw"></i> Dashboard </button>
							<i className={`fad ${Expand === "Dashboard" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Dashboard" ? "d-flex" : "d-none"}`}>
							<Link className="row btn btn-outline-success m-0" id="grid_menu" onClick={(e) => FetchUser(user.id.replace(/-/gi, ''))}><i className="fad fa-chart-network"></i> Dashboard</Link>
							<Link className="row btn btn-outline-success m-0" id="grid_menu" onClick=""><i className="fad fa-chart-network"></i> LINK 1</Link>
							<Link className="row btn btn-outline-success m-0" id="grid_menu" onClick={logout_user}><i className="fad fa-chart-network"></i> Logout</Link>
						</div>

						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Sell" ? false : "Sell")}><i className="fad fa-cart-plus pr-1 fa-fw"></i> Daily Sell </button>
							<i className={`fad ${Expand === "Sell" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Sell" ? "d-flex flex-column" : "d-none"}`}>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/rtl_sell'><i className="fad fa-person-dolly"></i> Retail</Link>
								{/* <Link className="row btn btn-outline-success m-0" id="grid_menu" to='/whl_sell'><i className="fad fa-dolly-flatbed-alt"></i> Wholesale</Link> */}
								{/* <Link className="row btn btn-outline-success m-0" id="grid_menu" to='/whl_sell'><i className="fad fa-truck-couch"></i> Wholesale</Link> */}
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/parties'><i className="fas fa-folder-plus"></i> Order</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/quote"><i className="fad fa-quote-left"></i> Quotation</Link>

							</div>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/sell_reports'><i className="fad fa-chart-line"></i> Sell Report</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/order_list'><i className="fad fa-th-list"></i> Order List</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/quote_list'><i className="fad fa-list"></i> Quote List</Link>
							</div>
						</div>

						<div className='d-flex align-items-center py-1'>
							<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to="/counter_list"><i className="fs-5 fal fa-desktop fa-fw pr-1"></i> Counters </Link>
						</div>
						{[8, 9].includes(no) &&
							<>
								<div className='d-flex align-items-center py-1'>
									<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to="/cash_flow"><i className="fs-5 fad fa-repeat-alt fa-fw"></i> Cash Flow </Link>
								</div>
								<div className='d-flex align-items-center py-1'>
									<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Accounts" ? false : "Accounts")}><i className="fad fa-calculator-alt pr-1"></i> Accounts </button>
									<i className={`fad ${Expand === "Accounts" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
								</div>
								<div className={`border ${Expand === "Accounts" ? "d-flex flex-column" : "d-none"}`}>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-calculator"></i> A/C-Summary</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='#'><i className="fad fa-project-diagram"></i> Voucher</Link>
										<Link className="row btn btn-outline-success m-0" to='/ledger' id="grid_menu"><i className="fab fa-wpforms"></i> Ledger</Link>
									</div>
								</div>
							</>
						}

						{no <= 7 &&
							<>
								<div className='d-flex align-items-center py-1'>
									<Link className="fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" to="/cash_flow"><i className="fs-5 fad fa-repeat-alt fa-fw"></i> Cash Flow </Link>
								</div>
								<div className='d-flex align-items-center py-1'>
									<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Accounts" ? false : "Accounts")}><i className="fad fa-calculator-alt pr-1"></i> Accounts </button>
									<i className={`fad ${Expand === "Accounts" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
								</div>
								<div className={`border ${Expand === "Accounts" ? "d-flex flex-column" : "d-none"}`}>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-calculator"></i> A/C-Summary</Link>
										<Link className="row btn btn-outline-success m-0" to='/acc_journal' id="grid_menu"><i className="fad fa-book"></i> Journal</Link>
										<Link className="row btn btn-outline-success m-0" to='/ledger' id="grid_menu"><i className="fab fa-wpforms"></i> Ledger</Link>
									</div>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-file-invoice-dollar"></i> Remit. Advice</Link>
										<Link className="row btn btn-outline-success m-0" to='/acc_journal' id="grid_menu"><i className="fad fa-hand-holding-usd"></i> Payment Advice</Link>
									</div>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/voucher'><i className="fad fa-receipt"></i> Payslip</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/voucher'><i className="fad fa-project-diagram"></i> Voucher</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/coa"><i className="fad fa-project-diagram"></i> COA</Link>
									</div>
								</div>
							</>
						}

						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Party" ? false : "Party")}><i className="fad fa-users pr-1 fa-fw"></i> Party </button>
							<i className={`fad ${Expand === "Party" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Party" ? "d-flex flex-column" : "d-none"}`}>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/"><i className="fad fa-abacus"></i> P-Summary</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/party_reg"><i className="fad fa-handshake"></i> New Party</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/my_party_list'><i className="fad fa-address-book"></i> My Parties</Link>
							</div>
						</div>

						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Supplier" ? false : "Supplier")}><i className="fad fa-users pr-1 fa-fw"></i> Supplier </button>
							<i className={`fad ${Expand === "Supplier" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Supplier" ? "d-flex flex-column" : "d-none"}`}>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/"><i className="fad fa-abacus"></i> S-Summary</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/supplier_reg"><i className="fad fa-handshake"></i> New Supplier</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/my_supplier_list'><i className="fad fa-address-book"></i> My Suppliers</Link>
							</div>
						</div>

						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Inventory" ? false : "Inventory")}><i className="fad fa-inventory pr-1 fa-fw"></i> Inventory </button>
							<i className={`fad ${Expand === "Inventory" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Inventory" ? "d-flex flex-column" : "d-none"}`}>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-abacus"></i> I-Summary</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/supplier_items"><i className="fad fa-money-check-edit"></i> Purchase</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/stock'><i className="fad fa-cubes"></i> Stock</Link>
							</div>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/purchase_reports'><i className="fad fa-chart-line-down"></i> Purchase Report</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/purchase_order'><i className="fad fa-folders"></i> P/O</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/purs_order_list'><i className="fad fa-chart-line"></i> P/O List</Link>
							</div>
						</div>

						<div className='d-flex align-items-center py-1'>
							<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Yard" ? false : "Yard")}><i className="fad fa-game-board-alt pr-1 fa-fw"></i> Yard </button>
							<i className={`fad ${Expand === "Yard" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
						</div>
						<div className={`border ${Expand === "Yard" ? "d-flex flex-column" : "d-none"}`}>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-abacus"></i> Y-Summary</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/yard_request"><i className="fad fa-paper-plane"></i> Del. Request</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/yard'><i className="fad fa-cubes"></i> Yard Stock</Link>
							</div>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/purchase_reports'><i className="fad fa-chart-line-down"></i> Purchase Report</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/request_list'><i className="fad fa-folders"></i> Order List</Link>
								<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/delivery_notes'><i className="fad fa-chart-line"></i> Docket List</Link>
							</div>
							<div className='d-flex border'>
								<Link className="row btn btn-outline-success m-0 w-100" id="grid_menu" to='/ctr_list'><i className="fad fa-container-storage"></i> Containers</Link>
							</div>
						</div>

						{
							no <= 7 &&
							<>
								<div className='d-flex align-items-center py-1'>
									<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Staff" ? false : "Staff")}><i className="fad fa-users-crown pr-1 fa-fw"></i> My Staff </button>
									<i className={`fad ${Expand === "Staff" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
								</div>
								<div className={`border ${Expand === "Staff" ? "d-flex flex-column" : "d-none"}`}>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu"><i className="fad fa-abacus"></i> S-Summary</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/my_user_lists"><i className="fad fa-users-className"></i> List</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/Register'><i className="fad fa-user-plus"></i> Register</Link>
									</div>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/'><i className="fad fa-user-cog"></i> Payroll</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to='/'><i className="fad fa-user-chart"></i> Activity</Link>
									</div>
								</div>
							</>
						}

						{
							no <= 5 &&
							<>
								<div className='d-flex align-items-center py-1'>
									<button className="btn fs-5 fw-bold text-dark text-left m-0 px-2 w-100" style={{ textDecoration: 'none' }} id="grid_menu" onClick={(e) => setExpand(Expand === "Statement" ? false : "Statement")}><i className="fad fa-file-chart-line pr-1 fa-fw"></i> Statements </button>
									<i className={`fad ${Expand === "Statement" ? "fa-minus" : "fa-plus"}  text-right mr-2`}></i>
								</div>
								<div className={`border ${Expand === "Statement" ? "d-flex flex-column" : "d-none"}`}>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0 w-100" id="grid_menu" to="/trial_balance"><i class="fad fa-balance-scale"></i> Trial Balance</Link>
									</div>
									<div className='d-flex border'>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/inc_statement"><i className="fad fa-analytics"></i> Income Statement</Link>
										<Link className="row btn btn-outline-success m-0" id="grid_menu" to="/bal_sheet"><i className="fad fa-balance-scale"></i> Balance Sheet</Link>
									</div>
								</div>
							</>
						}

					</li>
				}
			</ul>
		)
	}

	const requestFullScreen = () => {
		if (!isFullscreen) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}

		setIsFullscreen(!isFullscreen);
	};

	const authLinks = () => (
		<Fragment>
			{no <= 7 &&
				<li className='nav-item'>
					<Link title='Registration' className='nav-link' to='/Register'> <i className="fad fa-plus-circle fs-3 fa-fw"></i></Link>
				</li>
			}
			<li className='nav-item mx-2'>
				<Link title='Home' className='nav-link' to='home'><i className="fad fa-home-lg fs-3 fa-fw"></i></Link>
			</li>
			<li className='nav-item mx-2'>
				<Link title='Shrink' className='nav-link' to='#' onClick={() => requestFullScreen()}><i className={`fad ${isFullscreen ? "fa-compress-arrows-alt" : "fa-expand"} fs-3 fa-fw"`}></i></Link>
			</li>

			<li className="nav-item dropdown" onBlur={(e) => GridMenu(e)}>
				<button title='Dropdown Menu' className="nav-link dropdown-toggle show border-0 bg-white" id="grid_menu" data-bs-toggle="dropdown" aria-expanded="true" onClick={() => setGrid(Grid ? false : true)}><i className="fad fa-ellipsis-v fs-3 fa-fw"></i></button>
				{dropdown_toggle(Grid)}
			</li >

			<li className="nav-item dropdown" onBlur={(e) => BlurToggle(e)}>
				<button title='User Dropdown' className="nav-link dropdown-toggle show border-0 bg-white" id="drop_menu" data-bs-toggle="dropdown" aria-expanded="true" onClick={() => setDropDown(DropDown ? false : true)}>{user.username}</button>
				<ul className={`dropdown-menu ${DropDown ? "show" : null}`} aria-labelledby="drop_menu" style={{ width: "80%" }}>
					<li><Link className="dropdown-item" id="drop_menu" to={`/user_profile/${user.id}`}>My Profile</Link></li>
					<li><Link className="dropdown-item" id="drop_menu" onClick={(e) => FetchUser(user.id.replace(/-/gi, ''))}>Profile Update</Link></li>
					<li><Link className="dropdown-item" id="drop_menu" to="/pvt_reset_pass">Change Password</Link></li>
					<li><Link className="dropdown-item" id="drop_menu" to='#' onClick={logout_user}>Logout</Link></li>
				</ul>
			</li>

			<li className='nav-item'>
				<Link className='nav-link' to='#' onClick={logout_user}>Logout</Link>
			</li>
			<li className='nav-item d-flex align-items-center'>
				<Link className='nav-link' to='#'
					onClick={(e) => BrowserClose(e)}
				> <i className="fad fa-window-close fa-fw"></i></Link>
			</li>
			{/* <Redirect to='/wellcome' /> */}
		</Fragment >
	);

	const meriLinks = () => (
		<Fragment>
			<li className='nav-item mx-2'>
				<Link className='nav-link' to='home'><i className="fad fa-home-lg fs-3 fa-fw"></i></Link>
			</li>
			<li className='nav-item mx-2'>
				<Link className='nav-link' to='home'><i className="fad fa-compress-arrows-alt fs-3 fa-fw"></i></Link>
			</li>

			<li className="nav-item dropdown" onBlur={(e) => BlurToggle(e)}>
				<button className="nav-link dropdown-toggle show border-0 bg-white" id="drop_menu" data-bs-toggle="dropdown" aria-expanded="true" onClick={() => setDropDown(DropDown ? false : true)}>{user.username}</button>
				<ul className={`dropdown-menu ${DropDown ? "show" : null}`} aria-labelledby="drop_menu" style={{ width: "80%" }}>
					<li><Link className="dropdown-item" id="drop_menu" onClick={(e) => FetchUser(user.id.replace(/-/gi, ''))}>My Profile</Link></li>
					<li><Link className="dropdown-item" id="drop_menu" to="/pvt_reset_pass">Change Password</Link></li>
					<li><Link className="dropdown-item" id="drop_menu" to='#' onClick={logout_user}>Logout</Link></li>
				</ul>
			</li>

			<li className='nav-item'>
				<Link className='nav-link' to='#' onClick={logout_user}>Logout</Link>
			</li>
			<li className='nav-item d-flex align-items-center'>
				<Link className='nav-link' to='#' onClick={(e) => BrowserClose(e)}> <i className="fad fa-window-close fa-fw"></i></Link>
			</li>
			{/* <Redirect to='/wellcome' /> */}
		</Fragment >
	);

	return (
		<nav className="navbar navbar-expand-lg navbar-theme bg-white rounded py-0 mb-2 border-bottom px-2" aria-label="Eleventh navbar example">
			<Link className="navbar-brand d-flex py-0" to={`${scale === 3 && no === 4 ? '/field_work' : '/'}`}>
				<img src={logo} className="img-fluid mx-auto d-table p-1" width="55" height="8" alt="SoftaPoul" />
				<span className='fs-2 fw-bold text-success shadow-md'>DESH BESH ENTERPRISE LTD</span>
			</Link>
			<button style={{ paddingTop: "12px", paddingBottom: "12px" }}
				className="navbar-toggler collapsed"
				data-bs-toggle="collapse"
				data-bs-target="#navbarsExample09"
				aria-controls="navbarsExample09"
				aria-expanded={NavToggle ? "false" : "true"}
				aria-label="Toggle navigation"
				onClick={() => { NavToggle ? setNavToggle(false) : setNavToggle(true) }}
				onBlur={(e) => BlurNavToggle(e)}
			>
				<i className="hamburger align-self-center fa-fw"></i>
			</button>
			{isMobile ?
				<div className={NavToggle ? "navbar-collapse collapse show" : "navbar-collapse collapse"} id="navbarsExample09">
					{parseInt(no) === 12 || parseInt(no) === 11 ? meriLinks() : dropdown_toggle(NavToggle)}
				</div>
				:
				<div className={NavToggle ? "navbar-collapse collapse show" : "navbar-collapse collapse"} id="navbarsExample09">
					<ul className="navbar-nav ms-auto">
						{parseInt(no) === 12 || parseInt(no) === 11 ? meriLinks() : authLinks()}
					</ul>
				</div>
			}
		</nav>
	);
};

const mapStateToProps = state => ({
	user: state.auth.user,
	scale: state.auth.scale,
	no: state.auth.no,
	cat: state.auth.cat
});

export default connect(mapStateToProps, { logout })(Navbar);
