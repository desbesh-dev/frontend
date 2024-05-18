import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <div className='h-100' style={{ zIndex: "1000" }}>
            <div className="col-md-12 d-flex justify-content-center align-middle" style={{ zIndex: "1000" }}>
                <div class="col-md-10 p-0 align-middle ">
                    <div class="d-flex justify-content-between">
                        <div class="col-md-4 border border-2 border-white m-2" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.1)" }}>
                            <h6 className='text-center text-uppercase pt-2'><i class="fas fa-link px-2"></i>Our Social Media</h6>
                            <div className='d-flex align-content-start flex-wrap justify-content-center'>
                                <div class="social">
                                    <a href='#' target="_blank"> <i class="fab fa-facebook-square text-dark"></i></a>
                                    <a href="#"><i class="fab fa-linkedin text-dark"></i></a>
                                    <a href="#"><i class="fab fa-instagram text-dark" aria-hidden="true"></i></a>
                                    <a href="#"><i class="fab fa-youtube text-dark" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-7 border border-2 border-white m-2" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 204, 0, 0.1)" }}>
                            <img src={logo} className="img-fluid mx-auto d-table p-2" width="80" height="40" alt="SoftaPoul" />
                            <p className='text-center'><i class="fs-5 fad fa-map-marked-alt text-whatsapp px-2"></i>P.O.Box 262, Boroko, National Capital District, Papua New Guinea.</p>
                        </div>
                    </div>
                </div>
            </div>


            <div class="copyright mt-3 bg-light">
                <div class="container">
                    <div class="row d-flex ">
                        <span className='text-center fw-bold text-success'>Copyright © 2022, All Right Reserved</span>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Footer;