import { Link } from 'react-router-dom';

export const Manager_Menu = ({ setOpenModal, OpenModal }) => {
    return (
        <div className="hexagon-menu clear">
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a className="hex-content">
                    <span className="hex-content-inner"><span className="icon_dash"><i className="fad fa-chart-network"></i></span>
                        <span className="title">Dashboard</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </a>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Link className="hex-content" to='/my_user_lists'>
                    <span className="hex-content-inner"><span className="icon_dash"><i className="fad fa-users"></i></span>
                        <span className="title">Users</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Link className="hex-content" to='/z_reading'>
                    <span className="hex-content-inner"><span className="icon_dash"><i className="fad fa-book-reader"></i></span><span text-nowrap className="title" style={{ whiteSpace: 'nowrap' }}>Z-Reading</span></span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-content" onClick={(e) => setOpenModal(!OpenModal)}>
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-file-invoice"></i>
                        </span>
                        <span className="title">Voucher</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </div>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Link to="/my_supplier_list" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-briefcase"></i>
                        </span>
                        <span className="title">My Suppliers</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Link to="/my_party_list" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fas fa-book-user"></i>
                        </span>
                        <span className="title">My Parties</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>
            <div className="hexagon-item">
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="hex-item">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Link to="/stock" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-inventory"></i>
                        </span>
                        <span className="title">My Stock</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>

        </div>
    )
}