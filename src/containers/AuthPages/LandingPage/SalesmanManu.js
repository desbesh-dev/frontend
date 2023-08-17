import moment from 'moment';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const SalesmanManu = () => {
    let date = moment().format('YYYY-MM-DD');
    const { CounterNo } = useSelector((state) => state.auth.user.Collocation);    
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
                <Link className="hex-content" to='/rtl_sell'>
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-tv-alt"></i>
                        </span>
                        <span className="title">My Counter</span>
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
                <Link className="hex-content" to={`counter_sale_report/${CounterNo}/${date}/${date}`}>
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-chart-line"></i>
                        </span>
                        <span className="title">Sale Report</span>
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
                <a className="hex-content">
                    <span className="hex-content-inner">
                        <span className="icon_dash">
                            <i className="fad fa-briefcase"></i>
                        </span>
                        <span className="title">Stock</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#32CD32"></path></svg>
                </a>
            </div>


        </div>
    )
}