export const GeneralColourStyles = {
    container: base => ({
        ...base,
        flex: 1,
        fontWeight: "500"
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: provided => ({
        ...provided,
        backgroundColor: 'white',
    }),
    option: (provided, state) => {
        let backgroundColor = state.isSelected ? '#6495ED' : 'transparent';
        let color = state.isSelected ? 'whitesmoke' : '#333';
        let scale = state.isSelected ? 'scale(1)' : 'scale(1.01)';

        if (state.isFocused) {
            backgroundColor = '#6495ED';
            color = 'whitesmoke';
            scale = 'scale(1.01)';
        }

        return {
            ...provided,
            color,
            backgroundColor,
            padding: "5px 5px",
            cursor: 'pointer',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            height: '40px',
            ':focus': {
                backgroundColor: '#6495ED',
                color: '#fff',
                paddingTop: "5px",
                paddingBottom: "5px",
                whiteSpace: 'wrap',
            },
            ':hover': {
                backgroundColor: '#6495ED',
                color: '#fff',
                paddingTop: "5px",
                paddingBottom: "5px",
                whiteSpace: 'wrap',
            },
        };
    },
    control: (provided) => ({
        ...provided,
        cursor: 'pointer',
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        cursor: 'pointer',
    }),
};