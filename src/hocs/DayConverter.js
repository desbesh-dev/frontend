import * as moment from 'moment'

export const DayConverter = (startDate, timeEnd) => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(timeEnd);
    let result = moment(newStartDate).diff(newEndDate, 'days')
    return result
}