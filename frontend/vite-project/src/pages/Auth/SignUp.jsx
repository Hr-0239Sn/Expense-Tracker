
import React from 'react'
import Authlayout from '../../components/layouts/Authlayout'
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/input';
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'; // <-- Add this import
import axiosInstance from "../../utils/axiosInstance"; // adjust path if needed
import {API_PATHS} from '../../utils/apiPaths'; 
// import { UserContext } from "../../context/UserContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");   
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(null);

  // const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // handle sign up form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    // let profileImageUrl="";

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!fullName) {
      setError("Full name is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setError("");

    // sign up API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
      });
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      // updateUser(user);
      navigate("/dashboard");
    }
    }catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }else{
        setError("something went wrong!");
      }
    }

  };

  return (
    <Authlayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6"> 
          Join us by entering the details.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Harsh Singh"
              value={fullName}
              label="Full Name"
              onChange={({target}) => setFullName(target.value)}
            />
            <Input 
              type="text"
              placeholder="@gmail.com"
              value={email}
              label="Email Address"
              onChange={({target}) => setEmail(target.value)}
            />
          </div>

          <div className="col-span-2">
            <Input
              type="password"
              placeholder="Min 8 Characters"
              label="Password"
              value={password}
              onChange={({target}) => setPassword(target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xv pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary mt-4">
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </Authlayout>
  );
}

export default SignUp;