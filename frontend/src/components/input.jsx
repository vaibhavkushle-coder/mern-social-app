function Input({
    placeholder,
    value,
    onChange,
    onKeyDown,
    inputRef
}){

    return(

        <textarea

        placeholder={placeholder}

        value={value}

        onChange={onChange}

        onKeyDown={onKeyDown}

        rows={1}

        ref={inputRef}

        className="w-full border border-gray-300 p-3
        rounded-lg outline-none focus:border-blue-500
        resize-none shadow"

        />

    );
}

export default Input;