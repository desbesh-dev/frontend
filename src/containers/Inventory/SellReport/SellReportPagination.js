export const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage, h }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 11;
    let startPage = 1;
    let endPage = totalPages;
    if (totalPages > 1)
        h = h - 80
    if (totalPages > maxPagesToShow) {
        const halfMaxPages = Math.floor(maxPagesToShow / 2);
        if (currentPage <= halfMaxPages) {
            endPage = maxPagesToShow;
        } else if (currentPage >= totalPages - halfMaxPages) {
            startPage = totalPages - maxPagesToShow + 1;
        } else {
            startPage = currentPage - halfMaxPages;
            endPage = currentPage + halfMaxPages;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        totalPages > 1 ?
            <ul className="pagination justify-content-center py-2 m-0" style={{ borderTop: "3px solid #DEE2E6" }}>
                {currentPage > 1 && (
                    <li className="btn btn-outline-warning mx-2" onClick={() => paginate(currentPage - 1)}>
                        <i class="fad fa-chevron-left"></i> Previous
                    </li>
                )}
                {startPage > 1 && (
                    <li className="btn btn-outline-success mx-2" onClick={() => paginate(1)}>
                        1
                    </li>
                )}
                {startPage > 2 && (
                    <li className="btn btn-secondary" onClick={() => paginate(startPage - 1)}>
                        . . .
                    </li>
                )}
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={number === currentPage ? 'btn btn-outline-success mx-2 active' : 'btn btn-outline-success mx-2'}
                        onClick={() => paginate(number)}>
                        {number}
                    </li>
                ))}
                {endPage < totalPages - 1 && (
                    <li className="btn btn-secondary" onClick={() => paginate(endPage + 1)}>
                        . . .
                    </li>
                )}
                {endPage < totalPages && (
                    <li className="btn btn-outline-success mx-2" onClick={() => paginate(totalPages)}>
                        {totalPages}
                    </li>
                )}
                {currentPage < totalPages && (
                    <li className="btn btn-outline-warning mx-2" onClick={() => paginate(currentPage + 1)}>
                        Next <i class="fad fa-chevron-right"></i>
                    </li>
                )}
            </ul>
            :
            null
    );
};