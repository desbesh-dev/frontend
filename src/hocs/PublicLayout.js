import React, { useEffect, useState } from 'react';
import { checkAuthenticated, load_user, logout } from '../actions/auth';
import { connect, useDispatch } from 'react-redux';

import { DISPLAY_OVERLAY } from '../actions/types';
import GoogleFontLoader from "react-google-font-loader";
import Navbar from '../components/Navbar';
import Overlay from "../components/Overlay";
import PageLoader from "../components/PageLoader";
import Sidebar from '../components/Sidebar';
import Toast from './toast/Toast';
import errorIcon from '../assets/error.png';
import infoIcon from '../assets/info.png';
import successIcon from '../assets/success.png';
import { useHistory } from 'react-router-dom';
import warningIcon from '../assets/warning.gif';
import AdminSideBar from '../components/AdminSideBar';
import AreaManager from '../components/AM_Sidebar';
import SalesManager from '../components/SM_Sidebar';


const Layout = ({ logout, checkAuthenticated, load_user, user, scale, sub_scale, children, list, isActive, setActive }) => {
	const pathname = window.location.pathname //returns the current url minus the domain name

	const [width, setWidth] = useState(window.screen.width)
	const [NavBar, setNavBar] = useState(null)
	const dispatch = useDispatch();

	// 
	useEffect(() => {
		dispatch({ type: DISPLAY_OVERLAY, payload: true });
		checkAuthenticated();
		load_user();
		onscreenresize();
		dispatch({ type: DISPLAY_OVERLAY, payload: false });

		// history.push(localStorage.getItem('active'));
	}, []);

	const alertUser = (e) => {
		// window.location.reload(false)(false);
		// localStorage.setItem("active", e.path[0].location.pathname);
		let currentPath = window.location.pathname;

		history.replace(`${currentPath}`);
		setTimeout(() => {
			history.replace(currentPath)
		}, 0)

		e.preventDefault();
		e.returnValue = true;
	};

	const history = useHistory();
	// history.go(0)
	const FetchUser = () => {


		history.push('/' + localStorage.getItem('active'));
	}

	const onscreenresize = () => {

		setWidth(window.screen.width)
	};
	return (
		<React.Fragment>
			<GoogleFontLoader
				fonts={[
					{
						font: "Roboto",
						weights: [400, 700],
					},
				]}
				subsets={["latin", "cyrillic-ext"]}
			/>
			<GoogleFontLoader
				fonts={[
					{
						font: "Material+Icons",
					},
				]}
			/>
			{/* <PageLoader display={displayOverlay}></PageLoader> */}
			<div className="wrapper">
				<div className="main">
					<main className="content mt-0 px-2">
						{children}
						<Toast
							toastList={list}
							position="bottom-right"
							autoDelete={true}
							dismissTime={10000}
						/>
						<Overlay />
					</main>

				</div>
			</div>
		</React.Fragment>
	);
};
const mapStateToProps = (state, props) => ({
	user: state.auth.user,
	scale: state.auth.scale,
	sub_scale: state.auth.sub_scale,
});
export default connect(mapStateToProps, { logout, checkAuthenticated, load_user })(Layout);
