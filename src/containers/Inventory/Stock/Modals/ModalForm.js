import moment from 'moment';
import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import 'react-virtualized-select/styles.css';
import { FetchSector, InitProductList, fetchServerTimestamp } from "../../../../actions/APIHandler";
import { FetchProductInit, ProductInit, UpdateStock } from '../../../../actions/InventoryAPI';
import { DISPLAY_OVERLAY } from '../../../../actions/types';
import errorIcon from '../../../../assets/error.png';
import successIcon from '../../../../assets/success.png';
import warningIcon from '../../../../assets/warning.gif';
import { CustomMenuList } from '../../../../hocs/Class/CustomMenuList';
import '../../../../hocs/react-select/dist/react-select.css';

export const InitProductModal = (props) => {
    const account = useSelector((state) => state.auth.accounts);

    const initialValue = { value: 0, label: "" };
    const [Error, setError] = useState({});
    const [SectorList, setSectorList] = useState();
    const [Sector, setSector] = useState();
    const [MyProList, setMyProList] = useState([]);
    const [HasMore, setHasMore] = useState(false);
    const initial = {
        BarCode: "",
        ItemID: "",
        Title: "",
        Category: "",
        UnitWeight: 0.000,
        Weight: 0.000,
        UnitPrice: 0.00,
        Quantity: 0,
        InitStock: 0,
        SubTotal: 0.00,
        MinRequired: 0,
        Status: 1,
        UpdatedAt: null
    }
    const [formData, setFormData] = useState(initial);
    const { ItemID, Category, Title, Code, UnitWeight, UnitPrice, Quantity, InitStock, Weight, SubTotal, MinRequired, Status, COA, COA_Code, UpdatedAt } = formData;
    let toastProperties = null;
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        LoadSector();
    }, [])

    const PropLoadSet = () => {
        setFormData({
            BarCode: "", ItemID: "", Title: "", Category: "", UnitWeight: "", Weight: "", UnitPrice: "", Quantity: "", InitStock: "", SubTotal: "", MinRequired: "", Status: "",
        });
        setError(null);
        props.onHide();
    }

    const ProductInitialize = async (e) => {
        e.preventDefault();
        if (ItemID) {
            const result = await ProductInit(Sector.value, ItemID, UnitPrice, Quantity, parseFloat(Weight).toFixed(3), MinRequired, Status);
            if (result !== true) {
                if (result.user_error) {
                    const updatedState = {};
                    for (var pair of result.exception.entries()) {
                        updatedState[pair[1].field] = pair[1].message;
                        setError({
                            ...updatedState,
                        });
                    }
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: warningIcon
                    }])
                } else {
                    LoadItem(Code);
                    props.setList([...props.list, toastProperties = {
                        id: 1,
                        title: result.Title,
                        description: result.message,
                        backgroundColor: '#f0ad4e',
                        icon: successIcon
                    }])
                }
            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Error',
                    description: "Product Initialize failed. Please try after some moment.",
                    backgroundColor: '#f0ad4e',
                    icon: errorIcon
                }])
            }
        }
    }

    const CScolourStyles = {
        container: base => ({
            ...base,
            flex: 1,
            fontWeight: "500"
        }),
        menuList: provided => ({
            ...provided,
            backgroundColor: 'white',
        }),
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? '#6495ED' : 'transparent';
            let color = state.isSelected ? 'whitesmoke' : '#333';
            let scale = state.isSelected ? 'scale(1)' : 'scale(1.01)';

            if (state.isFocused) {
                backgroundColor = '#6495ED';
                color = 'whitesmoke';
                scale = 'scale(1.01)';
            }

            return {
                ...provided,
                color,
                backgroundColor,
                paddingTop: "5px",
                paddingBottom: "5px",
                cursor: 'pointer',
                ':focus': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                },
                ':hover': {
                    backgroundColor: '#6495ED',
                    color: '#fff',
                    paddingTop: "5px",
                    paddingBottom: "5px"
                },
            };
        },
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", minWidth: "30vh", borderRadius: '20px' }),
        indicatorsContainer: (provided) => ({
            ...provided,
            cursor: 'pointer',
        }),
    };

    const QuantityCalc = (e) => {
        let weight = UnitWeight * e.target.value
        let price = UnitPrice * e.target.value
        setFormData({ ...formData, "Weight": weight, "SubTotal": price, "Quantity": e.target.value })
    }

    const LoadSector = async () => {
        var result = await FetchSector();
        if (result !== true) {
            setSectorList(result.Data);
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
        } else {
            dispatch({ type: DISPLAY_OVERLAY, payload: false });
            history.push('/');
        }
    }

    useEffect(() => {
        LoadProductItems();
    }, [Sector]);

    async function LoadProductItems() {
        dispatch({ type: DISPLAY_OVERLAY, payload: true });
        setMyProList([]);
        const today = new Date();
        const storedOptions = localStorage.getItem("data");
        let storedOptionsTimestamp = localStorage.getItem("dataTimestamp");

        if (storedOptions && storedOptionsTimestamp) {
            const currentTimestamp = await fetchServerTimestamp();
            if (storedOptionsTimestamp >= currentTimestamp) {
                setMyProList(JSON.parse(storedOptions));
                setHasMore(false);
                dispatch({ type: DISPLAY_OVERLAY, payload: false });
                return;
            }
        }

        var ProductItems = await InitProductList(Sector.value);
        if (ProductItems !== true) {
            setMyProList([...MyProList, ...ProductItems.data]);
            localStorage.setItem("data", JSON.stringify([...MyProList, ...ProductItems.data]));
            localStorage.setItem("dataTimestamp", today.getTime());
            if (ProductItems.data.length === 0) setHasMore(false);
        }
        dispatch({ type: DISPLAY_OVERLAY, payload: false });
    }

    const LoadItem = async (e) => {
        const input = e.toString()
        const paddedValue = input.length <= 7 ? input.padStart(7, '0') : input;
        const value = await FetchProductInit(paddedValue, Sector.value);
        if (value) {
            setFormData({
                Category: "",
                MinRequired: value.MinRequired,
                Status: 1,
                ItemID: value.ItemID,
                Barcode: value.Barcode,
                Code: value.Code,
                value: value.Code,
                label: value.Title,
                Title: { label: value.Title },
                UnitName: value.UnitName,
                UnitQty: value.UnitQty,
                UnitWeight: value.UnitWeight,
                UnitPrice: value.UnitPrice,
                Rate: value.SellPrice,
                Quantity: Quantity,
                InitStock: value.InitStock,
                Weight: value.UnitWeight * Quantity,
                Remark: "N/A",
                SubTotal: value.SellPrice,
                UpdatedAt: value.UpdatedAt
            })
        }
    };

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: "#F4F7FC", border: 0, boxShadow: 'none', fontWeight: "bold", minHeight: "fit-content", borderRadius: '20px' }),
        menu: base => ({
            ...base,
            borderRadius: '0px',
            outline: 0,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
            ...base,
            padding: '5px'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    };

    const EnterKeyEvent = (e) => {
        const value = e.target.value;
        const paddedValue = value.padStart(7, '0');
        if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            LoadItem(paddedValue);
            e.target.blur();
        }
    }

    const EnterKeyUpEvent = (e) => {
        if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            const value = e.target.value;
            const paddedValue = value.padStart(7, "0");
            LoadItem(paddedValue);
        }
    }

    const handleFocusSelect = (e) => {
        e.target.select();
    };
    MyProList.forEach(option => {
        option.combinedLabel = `${option.label} (${option.value})`;
    });
    const sortedOptions = SectorList?.sort((a, b) => a.label.localeCompare(b.label));

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Initialize Product Stock</span>
                        <small className="text-center px-0 text-muted">(Please fill up the desired field)</small>
                        <form>
                            <div className="row mt-3">
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <Select
                                            menuPortalTarget={document.body}
                                            borderRadius={'0px'}
                                            options={sortedOptions}
                                            name='Site'
                                            placeholder={"Select site"}
                                            styles={colourStyles}
                                            value={Sector}
                                            onChange={e => { setMyProList([]); setFormData(initial); setSector(e) }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <Select
                                        options={MyProList}
                                        name="Title"
                                        placeholder={"Please select product"}
                                        styles={CScolourStyles}
                                        value={Title}
                                        onChange={e => LoadItem(e && e.value)}
                                        required
                                        id="Title"
                                        isClearable={true}
                                        isSearchable={true}
                                        components={{ MenuList: CustomMenuList }}
                                        optionLabel="combinedLabel"
                                        maxMenuHeight={40 * 35}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label text-center">Item Code</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Code"
                                            name="Code"
                                            placeholder='Code'
                                            value={formData ? Code : ""}
                                            onChange={(e) => setFormData({ ...formData, Barcode: e.target.value, Code: e.target.value })}
                                            onKeyDown={event => EnterKeyEvent(event)}
                                            onKeyUp={(e) => EnterKeyUpEvent(e)}
                                            onFocus={handleFocusSelect}
                                        />
                                        {Error.ItemID ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.ItemID}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Unit Weight</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="UnitWeight"
                                            name="UnitWeight"
                                            placeholder='Unit Weight'
                                            value={UnitWeight}
                                            disabled
                                        />
                                        {Error.UnitWeight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitWeight}</small></p>
                                            : null}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Unit Price</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="UnitPrice"
                                            name="UnitPrice"
                                            placeholder='Unit Price'
                                            value={UnitPrice ? UnitPrice.toLocaleString("en", { minimumFractionDigits: 2 }) : null}
                                            onChange={(e) => setFormData({ ...formData, "UnitPrice": e.target.value })}
                                        />
                                        {Error.UnitPrice ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.UnitPrice}</small></p>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Quantity"
                                            name="Quantity"
                                            placeholder='Quantity'
                                            value={Quantity.toLocaleString("en-BD", { minimumFractionDigits: 0 })}
                                            onChange={(e) => QuantityCalc(e)}
                                            onBlur={(e) => QuantityCalc(e)}
                                        />
                                        {Error.Quantity ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Quantity}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Weight</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="Weight"
                                            name="Weight"
                                            placeholder='Total Weight'
                                            value={Weight ? Weight.toLocaleString("en-BD", { minimumFractionDigits: 3 }) : null}
                                            disabled
                                        />
                                        {Error.Weight ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">SubTotal</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="SubTotal"
                                            name="SubTotal"
                                            placeholder='Sub Total'
                                            value={SubTotal ? SubTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 }) : null}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Minimum Quantity</label>
                                        <input
                                            type="text"
                                            className="form-control fw-bold"
                                            id="MinRequired"
                                            name="MinRequired"
                                            placeholder='Minimum Quantity'
                                            value={MinRequired}
                                            onChange={(e) => setFormData({ ...formData, "MinRequired": e.target.value })}
                                        />
                                        {Error.MinRequired ?
                                            <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MinRequired}</small></p>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">Initial Stock</label>
                                        <p className='m-0 p-0 fw-bold text-dark'>{InitStock ?? parseFloat(InitStock).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="message-text" className="col-form-label text-center mx-auto">Updated At</label>
                                    <p className='m-0 p-0 fw-bold text-dark'>{moment(UpdatedAt).format("hh:mm:ss A, DD MMM YYYY")}</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Active Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setFormData({ ...formData, "Status": Status === 1 ? 0 : 1 })}
                                    />
                                    <label className="form-check-label text-center fw-bold pr-2" for={Status}>{Status === 1 ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i className="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={(e) => ProductInitialize(e)}>
                                <i className="fad fa-edit pr-2"></i> Submit </button>
                        </div>
                    </div>
                </div>
            </Modal.Body >
        </Modal >
    );
}

export const UpdateModal = (props) => {
    const [Qty, setQty] = useState(props.Item.Qty ? props.Item.Qty : null)
    const [Weight, setWeight] = useState(props.Item.Weight ? props.Item.Weight : null)
    const [Cost, setCost] = useState(props.Item.Cost ? props.Item.Cost : false)
    const [MinRequired, setMinRequired] = useState(props.Item.MinRequired ? props.Item.MinRequired : false)
    const [InitStock, setInitStock] = useState(props.Item.InitStock ? props.Item.InitStock : false)
    const [Status, setStatus] = useState(props.Item.Status ? props.Item.Status : false)
    const [Error, setError] = useState({});

    let toastProperties = null;
    const dispatch = useDispatch();

    const PropLoadSet = () => {
        setQty(false);
        setWeight(false);
        setCost(false);
        setMinRequired(false);
        setInitStock(false);
        setStatus(false);
        props.onHide();
    }

    const StockUpdate = async () => {
        const result = await UpdateStock(props.Item.id, Qty, Weight, Cost, MinRequired, InitStock, Status);

        if (result !== true) {
            if (result.user_error) {
                const updatedState = {};
                for (var pair of result.exception.entries()) {
                    updatedState[pair[1].field] = pair[1].message;
                    setError({
                        ...updatedState,
                    });
                }
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Invalid props.item',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }])

            } else {
                props.setList([...props.list, toastProperties = {
                    id: 1,
                    title: 'Success',
                    description: result.message,
                    backgroundColor: '#f0ad4e',
                    icon: successIcon
                }])
                props.onReload();
                props.onHide();
            }
        } else {
            props.setList([...props.list, toastProperties = {
                id: 1,
                title: 'Error',
                description: "Stock update failed. Please try after some moment.",
                backgroundColor: '#f0ad4e',
                icon: errorIcon
            }])
        }
    }

    const QuantityCalc = (e) => {
        let weight = props.Item.ItemID.UnitWeight * e.target.value
        setWeight(weight)
        setQty(e.target.value)
    }


    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static">

            <Modal.Body>
                <div className="d-flex flex-row-reverse bd-highlight">
                    <button className="btn-close fs-5" aria-label="Close" Title="Close" onClick={() => PropLoadSet()} />
                </div>
                <div className="d-flex justify-content-center bg-white h-100">
                    <div className="row justify-content-center align-items-center">
                        <span className="fs-4 fw-bolder text-center px-0 text-uppercase">Update Stock</span>
                        <small className="fs-5 fw-bold text-center px-0">{props.Item.ItemID.Title}</small>
                        <small className="text-center px-0">(Please fill up the desired field to update)</small>
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Unit Price</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Cost"
                                    name="Cost"
                                    placeholder='Unit Price'
                                    value={Cost}
                                    onChange={(e) => setCost(e.target.value)}
                                />
                                {Error.Cost ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Cost}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Quantity</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Qty"
                                    name="Qty"
                                    placeholder='Quantity'
                                    value={Qty}
                                    onChange={(e) => QuantityCalc(e)}
                                />
                                {Error.Qty ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Qty}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Weight</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="Weight"
                                    name="Weight"
                                    placeholder='Unit Price'
                                    value={Weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    disabled
                                />
                                {Error.Weight ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Weight}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Minimum Quantity</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="MinRequired"
                                    name="MinRequired"
                                    placeholder='Minimum Quantity'
                                    value={MinRequired}
                                    onChange={(e) => setMinRequired(e.target.value)}
                                />
                                {Error.MinRequired ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.MinRequired}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Initial Stock</label>
                                <input
                                    type="text"
                                    class="form-control fw-bold"
                                    id="InitStock"
                                    name="InitStock"
                                    placeholder='Initial Stock'
                                    value={InitStock}
                                    onChange={(e) => setInitStock(e.target.value)}
                                />
                                {Error.InitStock ?
                                    <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.InitStock}</small></p>
                                    : null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message-text" class="col-form-label">Active Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value={Status}
                                        id="Status"
                                        name="Status"
                                        checked={Status}
                                        onChange={(e) => setStatus(!Status ? true : false)}
                                    />
                                    <label class="form-check-label text-center fw-bold pr-2" for={Status}>{Status === true ? "Active" : "Deactive"}</label>
                                    {Error.Status ?
                                        <p className='mx-auto d-table text-center text-warning m-0'><small>{Error.Status}</small></p>
                                        : null}
                                </div>
                            </div>


                        </form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-outline-success" onClick={() => PropLoadSet()}><i class="fad fa-times pr-2"></i> Close</button>
                            <button className="btn btn-outline-success fs-6 fw-bold text-center mx-2" onClick={() => StockUpdate()}>
                                <i class="fad fa-edit pr-2"></i> Update </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
}

export const DeleteModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.FullName}</h4>
                <p>
                    Do you want to delete <strong>{props.FullName}</strong>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger" onClick={props.Click}>
                    Delete
                </button>
                <button className="btn btn-outline-success" onClick={props.onHide}>Close</button>

            </Modal.Footer>
        </Modal>
    );
}

export const InfoMessage = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.header}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.body_header}</h4>
                <p>
                    {props.body}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn text-center btn-outline-success" onClick={props.onHide}>Ok</button>
            </Modal.Footer>
        </Modal>
    );
}