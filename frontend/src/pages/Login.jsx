import { useState } from "react";

import { useNavigate, Navigate, Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import axios from "axios";

import Input from "../components/input";

import Button from "../components/Button";

import toast from "react-hot-toast";

function Login(){

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const [loading,setLoading]=useState(false);

    const [error,setError]=useState("");

    const { token,setToken } = useAuth();
    
    const navigate = useNavigate();

    if(token){

        return<Navigate to="/"/>
    }

    async function handelLogin(){

                try{

                    if(!email.includes("@")){

                        setError("Enter a valid email");

                        return;
                    }

                    if(password.length<6){

                        setError("password must be at least 6 characters");

                        return;
                    }

                    if(!email || !password){

                        ("Fill all fields");

                        return;
                    }


        const data = {
            email:email,
            password:password

        };

            setLoading(true);

        const response = await axios.post(
            

            "https://mern-social-app-xdit.onrender.com/api/auth/login",

            data

        )


                localStorage.setItem("token",response.data.token);

                setToken(response.data.token);

                setLoading(false);

                toast.success(response.data.message)

                setError("");

                setEmail("");

                setPassword("");

                setTimeout(() => {
                    navigate("/");
                },1000);
    

    }catch(error){

        setLoading(false);

        setError(error.response.data.message);
    }

}

    

    return(

        <div className="min-h-screen flex items-center 
        justify-center bg-gray-100">

            <div className="bg-white p-8 
            rounded-xl shadow-lg w-full
             max-w-sm hover:shadow-2xl transition">

            <h1  className="text-3xl font-bold
             text-center mb-6"
            >Login page</h1>

            <div  className="flex flex-col gap-4">

                        <Input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />

                        <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />

            

            {
                error && 

                <h3 className="text-red-500 text-sm mb-4">

                {error}</h3>
            }

            <Button

            disabled={loading}
            
            onClick={handelLogin}

              text= {loading?"Loading...":"Login"}

            />

            <p>

                Don't have an account?

                <Link to="/register">
                Register
                </Link>
            </p>
            
        </div>
        </div>
        </div>
    );
}

export default Login;