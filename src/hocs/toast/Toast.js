import './Toast.css';

import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

const Toast = props => {
    const { toastList, position, autoDelete, dismissTime } = props;
    const [list, setList] = useState(toastList);

    useEffect(() => {
        setList([...toastList]);

        // eslint-disable-next-line
    }, [toastList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, dismissTime);

        return () => {
            clearInterval(interval);
        }

        // eslint-disable-next-line
    }, [toastList, autoDelete, dismissTime, list]);

    const deleteToast = id => {
        const listItemIndex = list.findIndex(e => e.id === id);
        const toastListItem = toastList.findIndex(e => e.id === id);
        list.splice(listItemIndex, 1);
        toastList.splice(toastListItem, 1);
        setList([...list]);
    }

    return (
        <div className="position-relative">
            <div className="position-fixed bottom-0 end-0" style={{ zIndex: 11 }}>
                <div className="row m-0">
                    {
                        list.map((toast, i) =>
                            <div className="toast fade show p-0 h-100" role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <img src={toast.icon} className="rounded me-2" width="20" height="20" alt="..." />
                                    <strong className="me-auto text-dark">{toast.title}</strong>
                                    {/* <small className="text-muted">just now</small> */}
                                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => deleteToast(toast.id)}></button>
                                </div>
                                <div className="toast-body">
                                    {toast.description}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

Toast.propTypes = {
    toastList: PropTypes.array.isRequired,
    position: PropTypes.string,
    autoDelete: PropTypes.bool,
    dismissTime: PropTypes.number
}

export default Toast;
