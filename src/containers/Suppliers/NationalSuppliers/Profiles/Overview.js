import * as moment from 'moment'
import { SaveProductPro, ProductProList, UpdateImage, UpdateProductPro } from '../../../../actions/SuppliersAPI';
import { FaCodeBranch, FaUserTie } from "react-icons/fa";
import React, { Fragment, useEffect, useState } from 'react';
import { IoCloudUploadOutline, IoImagesOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Link, Redirect, useHistory } from 'react-router-dom';
import { checkToken, logout } from '../../../../actions/auth';
import { connect, useDispatch } from 'react-redux';

import { CreateMessage } from "../../../Modals/ModalForm.js";
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import Select from 'react-select';
import axios from 'axios';
import errorIcon from '../../../../assets/error.png';
import infoIcon from '../../../../assets/info.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { Accordion } from 'react-bootstrap';

const Overview = ({ SupplierID, list, setList, setProdcutPro, scale, sub_scale }) => {
    useEffect(() => {
        // LoadProductList()
    }, [])


    return (
        <div className="position-relative h-100">
            <div className="position-absolute overflow-auto my-1 pb-5 w-100 h-75">

                <div className="row justify-content-center mx-auto d-table w-100 h-100">
                    < div div className={`d-flex justify-content-between bg-white py-2 border-bottom`}>
                        <div className='my-auto text-center'>
                            <p className='display-6 fw-bold m-0 text-uppercase text-left'><Link className="fad fa-chevron-left px-2 text-dark text-decoration-none" to={`${scale === 7 || scale === 8 || scale === 9 ? `/bis_national_supplier_list` : `/national_supplier_list`}`}></Link> OVERVIEW</p>
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
    scale: state.auth.scale,
    sub_scale: state.auth.sub_scale,
    // SupplierID: props.location.SupplierID
});

export default connect(mapStateToProps, { logout })(Overview);