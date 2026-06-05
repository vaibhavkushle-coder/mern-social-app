function Button(props){

    return(

        <button
        disabled={props.disabled}
        onClick={props.onClick}

        className="w-full bg-blue-500 text-white p-3 rounded-lg 
        hover:scale-105 transition-all font-semibold cursor-pointer "
        >

            {props.text}

        </button>

    );
}

export default Button;