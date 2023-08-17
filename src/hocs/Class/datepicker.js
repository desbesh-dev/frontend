import en from 'date-fns/locale/en-GB';
import es from 'date-fns/locale/es';

import 'react-datepicker/dist/react-datepicker.css';

import { format, getMonth, getYear, setMonth } from 'date-fns';

export const locales = {
    es,
    en,
};

export const customHeader = ({ locale, date, changeMonth, changeYear }) => {
    const months = new Array(12).fill(null).map((_, i) => ({
        value: i,
        label: format(setMonth(new Date(), i), 'MMMM', {
            locale: locales[locale],
        }),
    }));

    const years = new Array(100).fill(null).map((_, i) => 1940 + i);

    const handleYearChange = ({ target: { value } }) => changeYear(value);
    const handleMonthChange = ({ target: { value } }) => changeMonth(value);

    return (
        <div className='d-flex justify-content-around text-center'>
            <select className="border-gray border-2 fw-bold fs-5 p-1 fw-bold text-center mx-2" onChange={handleYearChange} value={getYear(date)} style={{ borderRadius: "20px", width: "40%" }}>
                {years.map(year => (
                    <option className="d-flex border-light fs-5 fw-bold text-center my-2" value={year} key={year} style={{ borderRadius: "20px" }}>
                        {year}
                    </option>
                ))}
            </select>
            <select className="border-gray border-2 fw-bold fs-5 p-1 fw-bold text-center mx-2" onChange={handleMonthChange} value={getMonth(date)} style={{ borderRadius: "20px", width: "40%" }}>
                {months.map(({ value, label }) => (
                    <option className="border fw-bold text-center" value={value} key={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};
