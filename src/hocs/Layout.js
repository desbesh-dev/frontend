import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { checkAuthenticated, load_user, logout } from '../actions/auth';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import GoogleFontLoader from "react-google-font-loader";
import { useHistory } from 'react-router-dom';
import { DISPLAY_OVERLAY } from '../actions/types';
import Navbar from '../components/Navbar';
import Overlay from "../components/Overlay";
import Footer from './Footer';
import Toast from './toast/Toast';

const Layout = ({ logout, checkAuthenticated, load_user, user, scale, no, children, list, isActive, setActive }) => {

	const pathname = window.location.pathname //returns the current url minus the domain name

	const [width, setWidth] = useState(window.screen.width)
	const [NavBar, setNavBar] = useState(null)
	const dispatch = useDispatch();

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
					scale === 6 || (scale === 3 && (no === 7 || no === 8 || no === 9 || no === 10)) ?
						<Sidebar isActive={isActive} setActive={setActive} setNavBar={setNavBar} NavBar={NavBar} />
						: scale === 3 && no === 6 ?
							<AreaManager isActive={isActive} setActive={setActive} setNavBar={setNavBar} NavBar={NavBar} />
							: scale === 3 && no === 5 ?
								<SalesManager isActive={isActive} setActive={setActive} setNavBar={setNavBar} NavBar={NavBar} />
								: scale === 7 || scale === 8 || scale === 9 ?
									<AdminSideBar isActive={isActive} setActive={setActive} setNavBar={setNavBar} NavBar={NavBar} />
									: null
				} */}

				<div className="main">
					{
						scale && no ?
							<Navbar setNavBar={setNavBar} NavBar={NavBar} isActive={`/${isActive}`} setActive={setActive} />
							: null}
					<main className="content mt-0 px-0">
						{children}
						<Toast
							toastList={list}
							position="bottom-right"
							autoDelete={true}
							dismissTime={10000}
						/>
						<Overlay />
					</main>

					{
						scale && no ?
							null
							:
							<footer class="container-fluid p-0 m-0 w-100">
								<Footer />
							</footer>
					}
				</div>
			</div>
		</React.Fragment>
	);
};
const mapStateToProps = (state, props) => ({
	user: state.auth.user,
	scale: state.auth.scale,
	no: state.auth.no,
});
export default connect(mapStateToProps, { logout, checkAuthenticated, load_user })(Layout);
