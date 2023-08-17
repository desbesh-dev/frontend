import './clock.css';

import { Component } from 'react';

class Clock extends Component {
    constructor(props) {
        super(props);
        const d = new Date();
        const date = d.toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        }).replace(/ /g, ' ');
        this.state = { time: new Date().toLocaleTimeString(), date: date }
    }

    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.updateClock()
        }, 1000)
    }

    // componentWillMount() {
    //     clearInterval(this.intervalID);
    // }

    // LoadProductItems = async () => {
    //     const currentTimestamp = await fetchServerTimestamp();
    //     const timestamp = currentTimestamp.timestamp;
    //     const date = new Date(timestamp * 1000);

    //     console.log("Moment Format:", moment(date).format("DD MMM YYYY, h:mm:ss A"));
    //     if (isNaN(date.getTime())) {
    //         // The date is not valid
    //         console.error("Invalid timestamp:", timestamp);
    //     } else {
    //         // The date is valid
    //         const dateString = date.toLocaleDateString();  // Get the date as a string
    //         const timeString = date.toLocaleTimeString();  // Get the time as a string
    //         const formattedString = `${dateString}, ${timeString}`;  // Combine the date and time strings
    //         console.log("Formatted date string:", formattedString);
    //     }
    // }

    updateClock() {
        const d = new Date();
        const date = d.toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        }).replace(/ /g, ' ');
        this.setState({ time: new Date().toLocaleTimeString(), date: date })
    }

    render() {
        return (
            <div className="d-flex align-items-center justify-content-center flex-column pl-2">
                <div className="Time text-right">
                    <p className="display-4 fw-bold m-0">{this.state.time}</p>
                </div>
                <p className="text-right m-0">{this.state.date}</p>
            </div>
        );
    }
}

export default Clock;