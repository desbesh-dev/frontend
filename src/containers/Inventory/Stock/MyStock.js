import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyStock = ({ page }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(page);
    const [itemsPerPage, setItemsPerPage] = useState(100);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my_stock_list/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
                params: { page: currentPage, page_size: itemsPerPage },
            });
            setData(res.data.results);
            setLoading(false);
        };
        fetchData();
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h1>My Stock</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Title</th>
                                <th>Weight</th>
                                <th>Price</th>
                                <th>Sector ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.item_id}</td>
                                    <td>{item.item_title}</td>
                                    <td>{item.weight}</td>
                                    <td>{item.price}</td>
                                    <td>{item.sector_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-container">
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={500} // You can get this value from the API response
                            paginate={handlePageChange}
                            currentPage={currentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="pagination">
            {pageNumbers.map((number) => (
                <li
                    key={number}
                    className={number === currentPage ? 'btn btn-success active' : 'btn btn-success'}
                    onClick={() => paginate(number)}
                >
                    {number}
                </li>
            ))}
        </ul>
    );
};

export default MyStock;
