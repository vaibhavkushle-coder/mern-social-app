import { useState } from "react";

import axios from "axios";

import { useNavigate, Navigate, Link } from "react-router-dom";

import Input from "../components/input";

import Button from "../components/Button";


function Register(){

    const navigate = useNavigate();

const token =localStorage.getItem("token");

if(token){

    return <Navigate to="/"/>
}

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [name,setName] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

async function handleRegister(){

    try{

        if(!name || !email || !password){

            alert("Fill all fields");

            return;
        }

        if(!email.includes("@")){

            setError("Enter a valid email");

            return;
        }

        if(password.length<6){

            setError("Password must be at least 6 characters");

            return;
        }

        const data = {

            name:name,
            email:email,
            password:password

        }

        setLoading(true);

        const response = await axios.post(

            "https://mern-social-app-xdit.onrender.com/api/auth/register",

            data

        );

        setLoading(false);

        setError("");

        setEmail("");

        setPassword("");

        setName("");

        navigate("/login");

    }catch(error){

        setLoading(false);

        setError(error.response.data.message);

    }
}



return(

    <div className="min-h-screen flex items-center 
        justify-center bg-gray-100">

            <div  className="bg-white p-8 
            rounded-xl shadow-lg w-full
             max-w-sm hover:shadow-2xl transition ">
        
        <h1 className="text-3xl font-bold text-center mb-6"
        >Register</h1>

        <div className="flex flex-col gap-4">

        <Input
        type="text"    
        placeholder="Enter name..."
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />

        <Input
        type="email"
        placeholder="Enter email.."
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />

        <Input
        type="password"
        placeholder="Enter password..."
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        {
            error && 
            <p className="text-red-500 text-sm mb-4">
                
                {error}
                
                </p>
        }


        <Button 

        disabled={loading}

        onClick={handleRegister}

        text={loading?"Loading...":"Register"}

        />

        <p>

            Already have an account?

            <Link to="/login">
            Login
            </Link>
        </p>


    </div>
    </div>
    </div>

);

}

export default Register;