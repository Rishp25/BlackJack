import axios from "axios";
import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import pic from '../assets/blackjack_ss.jpg'

const Signup = () => {
    const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
    const { user, setUser } = useContext(AppContext);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    console.log(user.name);

    const sendRequest = async (data) => {
        console.log("Sending request with data:", data);
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, data);
            if (res.data.status !== 200) {
                toast.error(res.data.message);
				setIsLoading(false);
				navigate('/signin')
            } else {
                toast.success("Player successfully created");
                localStorage.setItem("userName", name);
                setUser(name);
                setTimeout(() => navigate("/signin"), 2000);
				setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("Account already exists. Redirecting to signin...");
                setTimeout(() => navigate("/signin"), 2000);
				setIsLoading(false);
            } else {
                toast.error("An error occurred. Please try again.");
				setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !password || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);
        sendRequest({
            name: name,
            password: password,
            numberOfChips: "1000000",
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="mt-16 max-w-md w-full backdrop-blur-[2px] space-y-8 p-8 rounded-xl shadow-lg bg-white bg-opacity-10">
                <Toaster />
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
                        Sign Up
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing up..." : "Sign up"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm font-bold text-black">
                        Already have an account?{" "}
                        <button 
                            onClick={() => navigate("/signin")}
                            className="font-bold text-yellow-500 hover:text-yellow-400"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;