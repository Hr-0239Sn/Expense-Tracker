
import React from 'react'
import Authlayout from '../../components/layouts/Authlayout'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/input';
import {validateEmail} from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'; // Adjust the path if needed
import {API_PATHS} from '../../utils/apiPaths'; 
// import { UserContext } from "../../context/UserContext"; // Adjust the path if needed
// ...existing code... here i have to import the things i need to use in this file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setError("");
    // login API call
    try{
      // console.log("start")

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      // console.log("end")
      const {token} = response.data;
      if (token) {
        localStorage.setItem("token",token);
        // updateUser(user);
        navigate("/dashboard");
      }
    } catch (error){
      if (error.response && error.response.data.message){
        setError(error.response.data.message);

      }else  {
        setError("Something went wrong. Please try again");
      }
    }

  }

  return (
    <Authlayout>
<div className="lg:w-[90%] h-3/4 md:h-full flex flex-col justify-center">
<h3 className="text-xl font-semibold text-black">Welcome Back</h3>
<p className="text-xs text -slate-700 mt-[5px] mb-6">
  Please enter your credentials to access your account.
</p>
<form onSubmit={handleLogin}>
  <Input 
    type="text"
    placeholder="@gmail.com"
    value={email}
    label="Email Address"
    onChange={({target}) => setEmail(target.value)}
    />
      <Input
    type="password"
    placeholder="Min 8 Characters"
    label="Password"
    value={password}
    onChange={({target}) => setPassword(target.value)}
    />
    
    {error && 
      <p className="text-red-500 text-xv pb-2.5">{error}</p>}

      <button type="submit" className="btn-primary">
        LOGIN
      </button>
      <p className="text-[13px] text-slate-800 mt-3">
        Don't have an account?{" "} 
        <Link className="font-medium text-primary underline" to="/signUp">Sign Up</Link>
      </p>
  </form>

</div>
    </Authlayout>
  )
}

export default Login;