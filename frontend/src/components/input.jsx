function Input({
    type,
    placeholder,
    value,
    onChange,
    onKeyDown
}){

    return(

        <input

        type={type}

        placeholder={placeholder}

        value={value}

        onChange={onChange}

        onKeyDown={onKeyDown}

        className="w-full border border-gray-300 p-3
        rounder-lg outline-none focus:border-blue-500"

        />

    );
}

export default Input;