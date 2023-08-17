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
import { useHistory, Redirect } from 'react-router-dom';
import warningIcon from '../assets/warning.gif';


const FieldWorkLayout = ({ logout, checkAuthenticated, load_user, isAuthenticated, isAccess, children, list }) => {
	const pathname = window.location.pathname //returns the current url minus the domain name

	const [width, setWidth] = useState(window.screen.width)
	const [NavBar, setNavBar] = useState(null)
	const [isActive, setActive] = useState(pathname === "/dashboard" ? 1 : "")
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
				{/* {
					localStorage.getItem("user") === null ?
						null : !JSON.parse(localStorage.getItem("user")).User.isSubscriber && JSON.parse(localStorage.getItem("user")).User.UserType !== 5 ?
							<Sidebar isActive={isActive} setActive={setActive} setNavBar={setNavBar} NavBar={NavBar} />
							: null
				} */}
				<div className="main">
					<Navbar setNavBar={setNavBar} NavBar={NavBar} isActive={`/${isActive}`} setActive={setActive} />
					<main className="content mt-0 px-3">
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
const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	isAccess: state.auth.isAccess,
});
export default connect(mapStateToProps, { logout, checkAuthenticated, load_user })(FieldWorkLayout);
