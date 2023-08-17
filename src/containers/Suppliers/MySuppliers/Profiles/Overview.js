import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { logout } from '../../../../actions/auth';


const Overview = ({ SupplierID, list, setList, setProdcutPro }) => {
    const [AccordLbl, setAccordLbl] = useState("Add New Product Profile");
    let toastProperties = null;
    const dispatch = useDispatch();

    useEffect(() => {
        // LoadProductList()
    }, [])


    return (
        <div className="position-relative h-100">
            <div className="position-absolute overflow-auto my-1 pb-5 w-100 h-75">
                <div className="row justify-content-center mx-auto d-table w-100 h-100">

                    <div className={`d-flex justify-content-between bg-white py-2 border-bottom`}>
                        <p className='display-6 bg-white'>OVERVIEW</p>
                        <div className="d-flex justify-content-end mx-2" style={{ minWidth: "10vh" }}>
                            <input className="border rounded-pill px-2 min-vw-25" type="text" placeholder="Search Keywords" />
                            <p className='fw-bold text-success my-auto px-1' title="Search" type='button'>Search</p>
                        </div>

                    </div >
                </div >

            </div >
        </div >
    );
}
const mapStateToProps = (state, props) => ({
    display: state.OverlayDisplay,
    user: state.auth.user,
    // SupplierID: props.location.SupplierID
});

export default connect(mapStateToProps, { logout })(Overview);