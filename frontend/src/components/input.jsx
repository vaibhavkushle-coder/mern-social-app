function Input({
    type,
    placeholder,
    value,
    onChange
}){

    return(

        <input

        type={type}

        placeholder={placeholder}

        value={value}

        onChange={onChange}

        className="w-full border border-gray-300 p-3
        rounder-lg outline-none focus:border-blue-500"

        />

    );
}

export default Input;