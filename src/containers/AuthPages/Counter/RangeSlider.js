import { useRef, useState } from 'react';

function RangeSlider(props) {
    const [minValue, setMinValue] = useState(props.min || 1);
    const [maxValue, setMaxValue] = useState(props.max || 1);

    const minInputRef = useRef(null);
    const maxInputRef = useRef(null);

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
            <div className='text-center fw-bold'>
                Min: {minValue} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Max: {maxValue}
            </div>
            <input
                type="range"
                min={props.min || 1}
                max={maxValue}
                value={minValue}
                onChange={handleMinChange}
                onWheel={(event) => {
                    const newValue = parseFloat(minValue) + (event.deltaY > 1 ? -1 : 1);
                    const clampedValue = Math.min(Math.max(newValue, props.min || 1), maxValue);
                    setMinValue(clampedValue);
                    if (props.onChange) {
                        props.onChange({ min: clampedValue, max: maxValue });
                    }
                }}
                ref={minInputRef}
            />
            <input
                type="range"
                min={minValue}
                max={props.max || 100}
                value={maxValue}
                onChange={handleMaxChange}
                onWheel={(event) => {
                    const newValue = parseFloat(maxValue) + (event.deltaY > 10 ? -1 : 1);
                    const clampedValue = Math.min(Math.max(newValue, minValue), props.max || 100);
                    setMaxValue(clampedValue);
                    if (props.onChange) {
                        props.onChange({ min: minValue, max: clampedValue });
                    }
                }}
                ref={maxInputRef}
            />
        </div>
    );
}

export default RangeSlider;
