import { Link } from 'react-router-dom';

export const YardManagerMenu = ({ setOpenModal, OpenModal }) => {
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
                <Link className="hex-content" to='/ctr_list'>
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i class="fad fa-container-storage"></i>
                        </span>
                        <span className="title">Container</span>
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
                <Link to="/delivery_notes" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i class="fad fa-chart-line"></i>
                        </span>
                        <span className="title">Docket List</span>
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
                <Link to="/request_list" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i class="fad fa-folders"></i>
                        </span>
                        <span className="title">Order List</span>
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
                <Link to="/yard" className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i class="fad fa-game-board-alt"></i>
                        </span>
                        <span className="title">Yard</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>

            </div>

        </div>
    )
}