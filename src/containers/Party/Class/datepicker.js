import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Datepicker from 'react-datepicker';

import es from 'date-fns/locale/es';
import en from 'date-fns/locale/en-GB';

import 'react-datepicker/dist/react-datepicker.css';

import { format, setMonth, getMonth, getYear } from 'date-fns';

// import './styles.css';

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

    const years = new Array(15).fill(null).map((_, i) => 2010 + i);

    const handleYearChange = ({ target: { value } }) => changeYear(value);
    const handleMonthChange = ({ target: { value } }) => changeMonth(value);

    return (
        <div>
            <select className="border-light p-1 fw-bold w-50 text-center" onChange={handleYearChange} value={getYear(date)}>
                {years.map(year => (
                    <option className="d-flex border fw-bold text-center" value={year} key={year}>
                        {year}
                    </option>
                ))}
            </select>
            <select className="border-light p-1 fw-bold w-50 text-center" onChange={handleMonthChange} value={getMonth(date)}>
                {months.map(({ value, label }) => (
                    <option className="border fw-bold text-center" value={value} key={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

function App() {
    const [selected, setSelected] = useState(new Date());
    const [locale, setLocale] = useState('en');

    const handleOnChange = date => setSelected(date);
    const nextLocale = locale === 'en' ? 'es' : 'en';

    return (
        <div className="App">
            <button onClick={() => setLocale(nextLocale)}>
                switch locale to {nextLocale}
            </button>

            <Datepicker
                selected={selected}
                dateFormat="dd MMM yyyy"
                onChange={handleOnChange}
                renderCustomHeader={props => customHeader({ ...props, locale })}
                locale={locales[locale]}
            />
        </div>
    );
}











// import React from 'react'
// import { Form } from 'react-bootstrap';
// import * as moment from 'moment'

// class DatePicker extends React.Component {

//     render() {

//         return (
//             <div>
//                 <div className="row">
//                     <div className="row">
//                         <Form.Group controlId="doj">
//                             {/* <Form.Label>Select Date</Form.Label> */}
//                             <Form.Control
//                                 type="date"
//                                 name="doj"
//                                 dateFormat="dd MMM yyyy"
//                                 // defaultValue={this.props.selectedValue}
//                                 defaultValue={moment(new Date(this.props.selectedValue)).format('DD MMM YYYY')}
//                                 placeholder="Date of Joining"
//                                 onChange={(e) => this.props.onChange(e)} />
//                         </Form.Group>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

// }

// export default DatePicker;