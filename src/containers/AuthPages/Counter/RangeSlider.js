import { useState } from 'react';

function RangeSlider(props) {
    const [minValue, setMinValue] = useState(props.min || 0);
    const [maxValue, setMaxValue] = useState(props.max || 0);

    const handleMinChange = (event) => {
        setMinValue(event.target.value);
        if (props.onChange) {
            props.onChange({ min: event.target.value, max: maxValue });
        }
    };

    const handleMaxChange = (event) => {
        setMaxValue(event.target.value);
        if (props.onChange) {
            props.onChange({ min: minValue, max: event.target.value });
        }
    };

    return (
        <div>
            <input
                type="range"
                min={props.min || 0}
                max={maxValue}
                value={minValue}
                onChange={handleMinChange}
            />
            <input
                type="range"
                min={minValue}
                max={props.max || 100}
                value={maxValue}
                onChange={handleMaxChange}
            />
            <div className='text-center'>
                Min: {minValue} Max: {maxValue}
            </div>
        </div>
    );
}

export default RangeSlider;