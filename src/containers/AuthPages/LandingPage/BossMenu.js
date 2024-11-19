import { Link } from 'react-router-dom';

export const BossMenu = ({ setOpenModal, OpenModal }) => {
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
                <Link to='/cash_flow' className="hex-content">
                    <span className="hex-content-inner"><span className="icon_dash"><i className="fas fa-sack-dollar"></i></span>
                        <span className="title">Cash Flow</span>
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
                    <span className="hex-content-inner"><span className="icon_dash"><i class="fad fa-calculator-alt"></i></span>
                        <span className="title">Sale</span>
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
                <Link className="hex-content" to='/ledger'>
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i class="fad fa-book-spells"></i>
                        </span>
                        <span className="title">Ledger</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </Link>
            </div>
        </div>
    )
}