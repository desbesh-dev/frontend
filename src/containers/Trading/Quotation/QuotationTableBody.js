import { useEffect, useState } from 'react';

export const useTbody = (SellData, Error, deleteRow, forceRender) => {
    const [tableRows, setTableRows] = useState([]);

    const getErrorMessage = (itemID) => {
        return Error.ItemID === itemID ? Error.message : null;
    };

    const generateTableRows = () => {
        const rows = SellData.slice().reverse().map((item, i) => {
            const errorMessage = getErrorMessage(item.ItemID);
            const reversedIndex = SellData.length - i - 1;
            return (
                <tr className="border-bottom text-center" key={i}>
                    <td className="py-0 border-right"><span className="d-block fw-bold">{reversedIndex + 1}</span></td>
                    <td className="py-0 border-right"><span className="d-block fw-bold text-left px-1">{item.label ? item.label : item.Title} <small className='text-warning text-left ml-0'>{errorMessage && errorMessage}</small></span></td>
                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Qty).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                    <td className="py-0 border-right"><span className="d-block fw-bold">{(item.Weight).toLocaleString("en", { minimumFractionDigits: 3 })}</span> </td>
                    <td className="py-0 border-right"><span className="d-block fw-bold">{item.Rate.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                    <td className="py-0 border-right"><span className="d-block fw-bold text-right">{item.SubTotal.toLocaleString("en", { minimumFractionDigits: 2 })}</span> </td>
                    <td className="p-0">
                        <button className="btn fs-3 px-2 py-0 text-danger" onClick={() => deleteRow(reversedIndex)}>
                            <i className="fad fa-minus"></i>
                        </button>
                    </td>
                </tr>
            );
        });

        setTableRows(rows);
    };

    useEffect(() => {
        generateTableRows();
    }, [SellData, Error, forceRender]);

    return { tableRows };
};